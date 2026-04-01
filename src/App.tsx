import { useEffect } from 'react';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';
import { BranchProvider } from './context/BranchContext';
import {
  adoptLegacyOrdersForCurrentOwner,
  getLegacyPendingOrdersCount,
  syncPendingOrders,
} from './lib/offline/outbox';
import { syncCatalogIndexIfDue } from './lib/offline/catalogIndex';

export default function App() {
  useEffect(() => {
    const checkLegacyOrders = async () => {
      try {
        const legacyCount = await getLegacyPendingOrdersCount();
        if (!legacyCount) return;
        const shouldAdopt = window.confirm(
          `Found ${legacyCount} legacy offline order(s) from older app versions. Adopt them for this account and sync now?`
        );
        if (!shouldAdopt) return;
        await adoptLegacyOrdersForCurrentOwner();
      } catch {
        // Ignore legacy check failures.
      }
    };

    const runSync = () => {
      void syncPendingOrders();
      void syncCatalogIndexIfDue();
    };

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      void checkLegacyOrders().finally(runSync);
    } else {
      void checkLegacyOrders();
    }

    window.addEventListener('online', runSync);
    return () => {
      window.removeEventListener('online', runSync);
    };
  }, []);

  return (
    <BranchProvider>
      <RouterProvider router={router} />
    </BranchProvider>
  );
}
