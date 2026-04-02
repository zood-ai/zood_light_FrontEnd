import axiosInstance from '@/api/interceptors';
import {
  getProductIndexBySku,
  getSyncMeta,
  putProductIndexRecords,
  putSyncMeta,
  type ProductIndexRecord,
} from './db';
import { getCurrentBranchKey, getCurrentOfflineOwnerKey } from './session';

const getLastCatalogSyncKey = (ownerKey: string, branchKey: string) =>
  `catalog_last_sync_at::${ownerKey}::${branchKey}`;
const getFullSyncCheckpointKey = (ownerKey: string, branchKey: string) =>
  `catalog_full_sync_checkpoint::${ownerKey}::${branchKey}`;
const MIN_SYNC_INTERVAL_MS = 1000 * 60 * 15;
const CATALOG_PAGE_TIMEOUT_MS = 25000;
const CATALOG_PAGE_PER_PAGE_STEPS = [2000, 1000, 500, 500] as const;
const CATALOG_PAGE_MAX_RETRIES = CATALOG_PAGE_PER_PAGE_STEPS.length;
export type CatalogSyncResult = {
  fetchedRows: number;
  syncedRows: number;
  pages: number;
  totalPages: number;
  skipped: true | false;
};

export type CatalogSyncProgress = {
  currentPage: number;
  totalPages: number;
  fetchedRows: number;
  syncedRows: number;
};

type FullSyncCheckpoint = {
  nextPage: number;
  fetchedRows: number;
  syncedRows: number;
  totalPages: number;
};

let activeCatalogSyncPromise: Promise<CatalogSyncResult> | null = null;
let lastCatalogSyncProgress: CatalogSyncProgress | null = null;
const catalogSyncProgressListeners = new Set<
  (progress: CatalogSyncProgress) => void
>();

const normalizeSku = (value: string) => value.trim().toLowerCase();

const toSafeNumber = (value: any, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const isRetryableCatalogError = (error: any) => {
  const status = Number(error?.response?.status || 0);
  const code = String(error?.code || '');
  const isTimeout =
    code === 'ECONNABORTED' ||
    code === 'ERR_NETWORK' ||
    String(error?.message || '').toLowerCase().includes('timeout');
  return isTimeout || !status || status >= 500;
};

const mapApiProductToIndexRecord = (product: any): ProductIndexRecord | null => {
  const ownerKey = getCurrentOfflineOwnerKey();
  const branchKey = getCurrentBranchKey();
  const id = String(product?.id || '').trim();
  const skuRaw = String(product?.sku || '').trim();
  if (!id || !skuRaw) return null;

  const image =
    String(product?.image || '').trim() ||
    String(product?.images || '').trim() ||
    '';

  return {
    id: `${ownerKey}::${branchKey}::${id}`,
    product_id: id,
    owner_key: ownerKey,
    branch_key: branchKey,
    sku: normalizeSku(skuRaw),
    name: String(product?.name || '').trim() || `#${id}`,
    price: toSafeNumber(product?.price, 0),
    image,
    stock_quantity:
      product?.quantity !== undefined
        ? toSafeNumber(product.quantity, 0)
        : product?.stock_quantity !== undefined
          ? toSafeNumber(product.stock_quantity, 0)
          : product?.available_quantity !== undefined
            ? toSafeNumber(product.available_quantity, 0)
            : undefined,
    updated_at: String(product?.updated_at || new Date().toISOString()),
  };
};

const emitCatalogSyncProgress = (progress: CatalogSyncProgress) => {
  lastCatalogSyncProgress = progress;
  for (const listener of catalogSyncProgressListeners) {
    try {
      listener(progress);
    } catch {
      // Ignore listener failures so sync loop keeps running.
    }
  }
};

export async function upsertProductIndexFromApiProducts(products: any[]) {
  const rows = products
    .map(mapApiProductToIndexRecord)
    .filter((row): row is ProductIndexRecord => Boolean(row));
  if (!rows.length) return 0;
  return putProductIndexRecords(rows);
}

export async function getIndexedProductByBarcode(barcode: string) {
  const ownerKey = getCurrentOfflineOwnerKey();
  const branchKey = getCurrentBranchKey();
  const record = await getProductIndexBySku(barcode, ownerKey, branchKey);
  if (!record) return null;
  return {
    id: record.product_id,
    sku: record.sku,
    name: record.name,
    image: record.image,
    price: record.price,
    quantity: record.stock_quantity,
    stock_quantity: record.stock_quantity,
    available_quantity: record.stock_quantity,
  };
}

export async function syncCatalogIndexIfDue(
  force = false,
  fullResync = false,
  onProgress?: (progress: CatalogSyncProgress) => void
) {
  if (onProgress) {
    catalogSyncProgressListeners.add(onProgress);
    if (lastCatalogSyncProgress) {
      onProgress(lastCatalogSyncProgress);
    }
  }
  if (activeCatalogSyncPromise) {
    return activeCatalogSyncPromise.finally(() => {
      if (onProgress) catalogSyncProgressListeners.delete(onProgress);
    });
  }

  activeCatalogSyncPromise = (async () => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      fetchedRows: 0,
      syncedRows: 0,
      pages: 0,
      totalPages: 0,
      skipped: true as const,
    };
  }

  const ownerKey = getCurrentOfflineOwnerKey();
  const branchKey = getCurrentBranchKey();
  const syncMetaKey = getLastCatalogSyncKey(ownerKey, branchKey);
  const checkpointKey = getFullSyncCheckpointKey(ownerKey, branchKey);
  const lastSyncAt = await getSyncMeta(syncMetaKey);
  if (!force && lastSyncAt) {
    const elapsedMs = Date.now() - new Date(lastSyncAt).getTime();
    if (Number.isFinite(elapsedMs) && elapsedMs < MIN_SYNC_INTERVAL_MS) {
      return {
        fetchedRows: 0,
        syncedRows: 0,
        pages: 0,
        totalPages: 0,
        skipped: true as const,
      };
    }
  }

  let page = 1;
  let fetchedRows = 0;
  let syncedRows = 0;
  let pages = 0;
  let totalPages = 0;
  let hasMore = true;
  let isFirstRequest = true;

  if (fullResync) {
    const checkpointRaw = await getSyncMeta(checkpointKey);
    if (checkpointRaw) {
      try {
        const checkpoint = JSON.parse(checkpointRaw) as FullSyncCheckpoint;
        if (Number.isFinite(checkpoint?.nextPage) && checkpoint.nextPage > 1) {
          page = checkpoint.nextPage;
        }
        if (Number.isFinite(checkpoint?.fetchedRows) && checkpoint.fetchedRows > 0) {
          fetchedRows = checkpoint.fetchedRows;
        }
        if (Number.isFinite(checkpoint?.syncedRows) && checkpoint.syncedRows > 0) {
          syncedRows = checkpoint.syncedRows;
        }
        if (Number.isFinite(checkpoint?.totalPages) && checkpoint.totalPages > 0) {
          totalPages = checkpoint.totalPages;
        }
      } catch {
        // Ignore invalid checkpoint format.
      }
    }
  }

  while (hasMore) {
    let response;
    let lastError: any = null;
    for (let attempt = 0; attempt < CATALOG_PAGE_MAX_RETRIES; attempt += 1) {
      const perPage =
        CATALOG_PAGE_PER_PAGE_STEPS[
          Math.min(attempt, CATALOG_PAGE_PER_PAGE_STEPS.length - 1)
        ];
      try {
        response = await axiosInstance.get('menu/products', {
          timeout: CATALOG_PAGE_TIMEOUT_MS,
          params: {
            not_default: 1,
            per_page: perPage,
            page,
            sort: '-updated_at',
            ...(!fullResync && lastSyncAt ? { updated_since: lastSyncAt } : {}),
          },
        });
        break;
      } catch (error) {
        lastError = error;
        const canTryIncrementalFallback =
          Boolean(lastSyncAt) && !fullResync && isFirstRequest;
        if (canTryIncrementalFallback) {
          try {
            // Fallback for backends that do not support incremental params.
            response = await axiosInstance.get('menu/products', {
              timeout: CATALOG_PAGE_TIMEOUT_MS,
              params: {
                not_default: 1,
                per_page: perPage,
                page,
                sort: '-updated_at',
              },
            });
            break;
          } catch (fallbackError) {
            lastError = fallbackError;
          }
        }

        const shouldRetry =
          attempt < CATALOG_PAGE_MAX_RETRIES - 1 &&
          isRetryableCatalogError(lastError);
        if (!shouldRetry) {
          throw lastError;
        }
        const backoffMs = 450 * (attempt + 1);
        await new Promise<void>((resolve) => setTimeout(resolve, backoffMs));
      }
    }

    if (!response) {
      throw lastError ?? new Error('Catalog sync page fetch failed');
    }

    const pageItems = Array.isArray(response?.data?.data) ? response.data.data : [];
    if (pageItems.length === 0) break;

    fetchedRows += pageItems.length;
    const currentPage = Number(response?.data?.meta?.current_page || page);
    const lastPage = Number(response?.data?.meta?.last_page || currentPage);
    totalPages = Number.isFinite(lastPage) && lastPage > 0 ? lastPage : currentPage;

    // Live update as soon as page payload arrives (before local write completes).
    emitCatalogSyncProgress({
      currentPage,
      totalPages,
      fetchedRows,
      syncedRows,
    });
    // Yield one tick so the UI can paint updated counters smoothly.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    syncedRows += await upsertProductIndexFromApiProducts(pageItems);
    pages += 1;

    if (fullResync) {
      const checkpoint: FullSyncCheckpoint = {
        nextPage: currentPage + 1,
        fetchedRows,
        syncedRows,
        totalPages,
      };
      await putSyncMeta(checkpointKey, JSON.stringify(checkpoint));
    }

    // Second update after this page is persisted.
    emitCatalogSyncProgress({
      currentPage,
      totalPages,
      fetchedRows,
      syncedRows,
    });
    hasMore = currentPage < lastPage;
    page += 1;
    isFirstRequest = false;
  }

  await putSyncMeta(syncMetaKey, new Date().toISOString());
  if (fullResync) {
    await putSyncMeta(checkpointKey, '');
  }
  return { fetchedRows, syncedRows, pages, totalPages, skipped: false as const };
  })();

  try {
    return await activeCatalogSyncPromise;
  } finally {
    if (onProgress) catalogSyncProgressListeners.delete(onProgress);
    lastCatalogSyncProgress = null;
    activeCatalogSyncPromise = null;
  }
}
