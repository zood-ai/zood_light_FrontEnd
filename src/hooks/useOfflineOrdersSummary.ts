import { useCallback, useEffect, useState } from 'react';
import { getOfflineOrdersByStatusesForOwner } from '@/lib/offline/db';
import { OFFLINE_ORDERS_CHANGED_EVENT } from '@/lib/offline/outbox';
import { getCurrentOfflineOwnerKey } from '@/lib/offline/session';

type OfflineOrdersSummary = {
  pendingCount: number;
  failedCount: number;
};

export function useOfflineOrdersSummary() {
  const [summary, setSummary] = useState<OfflineOrdersSummary>({
    pendingCount: 0,
    failedCount: 0,
  });

  const refresh = useCallback(async () => {
    try {
      const ownerKey = getCurrentOfflineOwnerKey();
      const [pending, failed] = await Promise.all([
        getOfflineOrdersByStatusesForOwner(['pending', 'syncing'], ownerKey),
        getOfflineOrdersByStatusesForOwner(['failed'], ownerKey),
      ]);
      setSummary({
        pendingCount: pending.length,
        failedCount: failed.length,
      });
    } catch {
      // Ignore read errors and keep existing value.
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => {
      void refresh();
    }, 10000);

    const onOrdersChanged = () => {
      void refresh();
    };

    window.addEventListener(OFFLINE_ORDERS_CHANGED_EVENT, onOrdersChanged);
    window.addEventListener('online', onOrdersChanged);
    document.addEventListener('visibilitychange', onOrdersChanged);

    return () => {
      clearInterval(interval);
      window.removeEventListener(OFFLINE_ORDERS_CHANGED_EVENT, onOrdersChanged);
      window.removeEventListener('online', onOrdersChanged);
      document.removeEventListener('visibilitychange', onOrdersChanged);
    };
  }, [refresh]);

  return summary;
}
