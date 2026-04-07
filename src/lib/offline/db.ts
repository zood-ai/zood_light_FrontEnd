export type OfflineOrderStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export type OfflineOrderRecord = {
  local_id: string;
  client_order_id: string;
  owner_key: string;
  payload: Record<string, any>;
  status: OfflineOrderStatus;
  retry_count: number;
  last_error: string;
  server_order_id?: string;
  created_at: string;
  updated_at: string;
};

type SyncMetaRecord = {
  key: string;
  value: string;
};

export type ProductIndexRecord = {
  id: string;
  product_id: string;
  owner_key: string;
  branch_key: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  stock_quantity?: number;
  updated_at: string;
};

const DB_NAME = 'zood_pos_offline_v1';
const DB_VERSION = 2;
const OFFLINE_ORDERS_STORE = 'offline_orders';
const SYNC_META_STORE = 'sync_meta';
const PRODUCT_INDEX_STORE = 'product_index';

let dbPromise: Promise<IDBDatabase> | null = null;

function promisifyRequest<T = any>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(OFFLINE_ORDERS_STORE)) {
        const ordersStore = db.createObjectStore(OFFLINE_ORDERS_STORE, {
          keyPath: 'local_id',
        });
        ordersStore.createIndex('by_status', 'status', { unique: false });
        ordersStore.createIndex('by_created_at', 'created_at', { unique: false });
      }

      if (!db.objectStoreNames.contains(SYNC_META_STORE)) {
        db.createObjectStore(SYNC_META_STORE, { keyPath: 'key' });
      }

      if (!db.objectStoreNames.contains(PRODUCT_INDEX_STORE)) {
        const productIndexStore = db.createObjectStore(PRODUCT_INDEX_STORE, { keyPath: 'id' });
        productIndexStore.createIndex('by_owner_branch', ['owner_key', 'branch_key'], {
          unique: false,
        });
        productIndexStore.createIndex(
          'by_owner_branch_sku',
          ['owner_key', 'branch_key', 'sku'],
          { unique: false }
        );
        productIndexStore.createIndex(
          'by_owner_branch_updated_at',
          ['owner_key', 'branch_key', 'updated_at'],
          { unique: false }
        );
      } else {
        // Recreate to enforce owner/branch-aware schema in v2.
        db.deleteObjectStore(PRODUCT_INDEX_STORE);
        const productIndexStore = db.createObjectStore(PRODUCT_INDEX_STORE, { keyPath: 'id' });
        productIndexStore.createIndex('by_owner_branch', ['owner_key', 'branch_key'], {
          unique: false,
        });
        productIndexStore.createIndex(
          'by_owner_branch_sku',
          ['owner_key', 'branch_key', 'sku'],
          { unique: false }
        );
        productIndexStore.createIndex(
          'by_owner_branch_updated_at',
          ['owner_key', 'branch_key', 'updated_at'],
          { unique: false }
        );
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => Promise<T>
) {
  const db = await openDb();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName);
  const result = await callback(store);

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error);
    tx.onerror = () => reject(tx.error);
  });

  return result;
}

export async function putOfflineOrder(record: OfflineOrderRecord) {
  return withStore(OFFLINE_ORDERS_STORE, 'readwrite', async (store) => {
    await promisifyRequest(store.put(record));
    return record;
  });
}

export async function getOfflineOrder(localId: string) {
  return withStore(OFFLINE_ORDERS_STORE, 'readonly', async (store) => {
    const record = await promisifyRequest<OfflineOrderRecord | undefined>(
      store.get(localId)
    );
    return record ?? null;
  });
}

export async function getOfflineOrdersByStatuses(statuses: OfflineOrderStatus[]) {
  return withStore(OFFLINE_ORDERS_STORE, 'readonly', async (store) => {
    const all = await promisifyRequest<OfflineOrderRecord[]>(store.getAll());
    return all
      .filter((record) => statuses.includes(record.status))
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  });
}

export async function getOfflineOrdersByStatusesForOwner(
  statuses: OfflineOrderStatus[],
  ownerKey: string
) {
  const all = await getOfflineOrdersByStatuses(statuses);
  return all.filter((record) => record.owner_key === ownerKey);
}

export async function getLegacyOfflineOrdersByStatuses(statuses: OfflineOrderStatus[]) {
  const all = await getOfflineOrdersByStatuses(statuses);
  return all.filter((record) => !record.owner_key);
}

export async function assignOwnerToOfflineOrders(localIds: string[], ownerKey: string) {
  if (!localIds.length) return 0;

  return withStore(OFFLINE_ORDERS_STORE, 'readwrite', async (store) => {
    let updated = 0;
    for (const localId of localIds) {
      const existing = await promisifyRequest<OfflineOrderRecord | undefined>(
        store.get(localId)
      );
      if (!existing) continue;
      if (existing.owner_key === ownerKey) continue;
      await promisifyRequest(
        store.put({
          ...existing,
          owner_key: ownerKey,
          updated_at: new Date().toISOString(),
        } as OfflineOrderRecord)
      );
      updated += 1;
    }
    return updated;
  });
}

export async function updateOfflineOrder(
  localId: string,
  patch: Partial<OfflineOrderRecord>
) {
  const existing = await getOfflineOrder(localId);
  if (!existing) return null;

  const nextRecord: OfflineOrderRecord = {
    ...existing,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  await putOfflineOrder(nextRecord);
  return nextRecord;
}

export async function putSyncMeta(key: string, value: string) {
  return withStore(SYNC_META_STORE, 'readwrite', async (store) => {
    const row: SyncMetaRecord = { key, value };
    await promisifyRequest(store.put(row));
    return row;
  });
}

export async function getSyncMeta(key: string) {
  return withStore(SYNC_META_STORE, 'readonly', async (store) => {
    const row = await promisifyRequest<SyncMetaRecord | undefined>(store.get(key));
    return row?.value ?? null;
  });
}

export async function putProductIndexRecords(records: ProductIndexRecord[]) {
  return withStore(PRODUCT_INDEX_STORE, 'readwrite', async (store) => {
    for (const record of records) {
      // Queue all writes in one transaction for better large-batch performance.
      store.put(record);
    }
    return records.length;
  });
}

export async function getProductIndexBySku(
  sku: string,
  ownerKey: string,
  branchKey: string
) {
  return withStore(PRODUCT_INDEX_STORE, 'readonly', async (store) => {
    const normalized = sku.trim().toLowerCase();
    if (!normalized) return null;
    const index = store.index('by_owner_branch_sku');
    const matches = await promisifyRequest<ProductIndexRecord[]>(
      index.getAll([ownerKey, branchKey, normalized])
    );
    return matches?.[0] ?? null;
  });
}

/** Count indexed products for the current owner+branch (local POS catalog size). */
export async function countProductIndexByOwnerBranch(
  ownerKey: string,
  branchKey: string
): Promise<number> {
  if (!ownerKey || !branchKey) return 0;
  return withStore(PRODUCT_INDEX_STORE, 'readonly', async (store) => {
    const index = store.index('by_owner_branch');
    const range = IDBKeyRange.only([ownerKey, branchKey]);
    return promisifyRequest<number>(index.count(range));
  });
}

export async function pruneSyncedOfflineOrdersForOwner(
  ownerKey: string,
  maxKeep = 500
) {
  return withStore(OFFLINE_ORDERS_STORE, 'readwrite', async (store) => {
    const allSynced = (await promisifyRequest<OfflineOrderRecord[]>(store.getAll()))
      .filter((item) => item.owner_key === ownerKey && item.status === 'synced')
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

    if (allSynced.length <= maxKeep) return 0;
    const toDelete = allSynced.slice(maxKeep);
    for (const row of toDelete) {
      await promisifyRequest(store.delete(row.local_id));
    }
    return toDelete.length;
  });
}
