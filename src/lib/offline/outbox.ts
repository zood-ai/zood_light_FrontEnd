import axiosInstance from '@/api/interceptors';
import {
  assignOwnerToOfflineOrders,
  getOfflineOrdersByStatusesForOwner,
  getLegacyOfflineOrdersByStatuses,
  pruneSyncedOfflineOrdersForOwner,
  putOfflineOrder,
  putSyncMeta,
  type OfflineOrderRecord,
} from './db';
import { getCurrentOfflineOwnerKey } from './session';

export type SyncSummary = {
  attempted: number;
  synced: number;
  failed: number;
};

const LAST_SYNC_META_KEY = 'orders_last_sync_at';
export const OFFLINE_ORDERS_CHANGED_EVENT = 'offline-orders-changed';
const OFFLINE_SYNC_LOCK_KEY = 'offline-orders-sync-lock-v1';
const OFFLINE_SYNC_LOCK_TTL_MS = 120000;

let activeSyncPromise: Promise<SyncSummary> | null = null;

const notifyOfflineOrdersChanged = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OFFLINE_ORDERS_CHANGED_EVENT));
};

const createUuid = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const acquireCrossTabSyncLock = (token: string) => {
  if (typeof window === 'undefined') return true;
  const now = Date.now();
  try {
    const existingRaw = window.localStorage.getItem(OFFLINE_SYNC_LOCK_KEY);
    if (existingRaw) {
      const existing = JSON.parse(existingRaw) as { token?: string; expires_at?: number };
      if (
        existing?.token &&
        existing.token !== token &&
        Number(existing?.expires_at || 0) > now
      ) {
        return false;
      }
    }

    window.localStorage.setItem(
      OFFLINE_SYNC_LOCK_KEY,
      JSON.stringify({
        token,
        expires_at: now + OFFLINE_SYNC_LOCK_TTL_MS,
      })
    );

    const verifyRaw = window.localStorage.getItem(OFFLINE_SYNC_LOCK_KEY);
    if (!verifyRaw) return false;
    const verify = JSON.parse(verifyRaw) as { token?: string; expires_at?: number };
    return verify?.token === token && Number(verify?.expires_at || 0) > now;
  } catch {
    return true;
  }
};

const releaseCrossTabSyncLock = (token: string) => {
  if (typeof window === 'undefined') return;
  try {
    const existingRaw = window.localStorage.getItem(OFFLINE_SYNC_LOCK_KEY);
    if (!existingRaw) return;
    const existing = JSON.parse(existingRaw) as { token?: string };
    if (existing?.token !== token) return;
    window.localStorage.removeItem(OFFLINE_SYNC_LOCK_KEY);
  } catch {
    // ignore localStorage lock release failures
  }
};

export async function enqueueOfflineOrder(payload: Record<string, any>) {
  const nowIso = new Date().toISOString();
  const localId = `local-order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const clientOrderId = String(payload?.client_order_id || createUuid());
  const ownerKey = getCurrentOfflineOwnerKey();
  const record: OfflineOrderRecord = {
    local_id: localId,
    client_order_id: clientOrderId,
    owner_key: ownerKey,
    payload: {
      ...payload,
      client_order_id: clientOrderId,
    },
    status: 'pending',
    retry_count: 0,
    last_error: '',
    created_at: nowIso,
    updated_at: nowIso,
  };

  await putOfflineOrder(record);
  notifyOfflineOrdersChanged();
  return record;
}

async function syncPendingOrdersInternal(): Promise<SyncSummary> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { attempted: 0, synced: 0, failed: 0 };
  }

  const ownerKey = getCurrentOfflineOwnerKey();
  const queue = await getOfflineOrdersByStatusesForOwner(
    ['pending', 'failed'],
    ownerKey
  );
  if (!queue.length) {
    return { attempted: 0, synced: 0, failed: 0 };
  }

  let synced = 0;
  let failed = 0;

  for (const record of queue) {
    const now = new Date().toISOString();
    await putOfflineOrder({
      ...record,
      owner_key: record.owner_key || ownerKey,
      status: 'syncing',
      last_error: '',
      updated_at: now,
    });
    notifyOfflineOrdersChanged();

    try {
      const response = await axiosInstance.post('orders', record.payload, {
        headers: {
          'X-Idempotency-Key': record.client_order_id,
        },
      });
      const payload = response?.data?.data ?? response?.data ?? null;
      const serverOrderId = payload?.id ? String(payload.id) : undefined;

      await putOfflineOrder({
        ...record,
        owner_key: record.owner_key || ownerKey,
        status: 'synced',
        server_order_id: serverOrderId,
        last_error: '',
        updated_at: new Date().toISOString(),
      });
      notifyOfflineOrdersChanged();
      synced += 1;
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to sync order';

      await putOfflineOrder({
        ...record,
        owner_key: record.owner_key || ownerKey,
        status: 'failed',
        retry_count: Number(record.retry_count || 0) + 1,
        last_error: String(apiMessage),
        updated_at: new Date().toISOString(),
      });
      notifyOfflineOrdersChanged();
      failed += 1;
    }
  }

  await putSyncMeta(LAST_SYNC_META_KEY, new Date().toISOString());
  await pruneSyncedOfflineOrdersForOwner(ownerKey, 500);
  notifyOfflineOrdersChanged();
  return {
    attempted: queue.length,
    synced,
    failed,
  };
}

export async function syncPendingOrders() {
  if (activeSyncPromise) return activeSyncPromise;

  const lockToken = createUuid();
  if (!acquireCrossTabSyncLock(lockToken)) {
    return { attempted: 0, synced: 0, failed: 0 };
  }

  activeSyncPromise = syncPendingOrdersInternal().finally(() => {
    releaseCrossTabSyncLock(lockToken);
    activeSyncPromise = null;
  });
  return activeSyncPromise;
}

export async function getLegacyPendingOrdersCount() {
  const legacy = await getLegacyOfflineOrdersByStatuses(['pending', 'failed', 'syncing']);
  return legacy.length;
}

export async function adoptLegacyOrdersForCurrentOwner() {
  const ownerKey = getCurrentOfflineOwnerKey();
  const legacy = await getLegacyOfflineOrdersByStatuses(['pending', 'failed', 'syncing']);
  if (!legacy.length) return 0;
  const updated = await assignOwnerToOfflineOrders(
    legacy.map((item) => item.local_id),
    ownerKey
  );
  if (updated > 0) notifyOfflineOrdersChanged();
  return updated;
}
