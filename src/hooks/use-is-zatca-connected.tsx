import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useZatcaConnection() {
  const value = useSelector(
    (state: any) => state?.allSettings?.value?.WhoAmI?.is_connected_to_zatca
  );
  return value === 1 || value === true;
}

export function useIsZatcaConnected(columns: any) {
  const isConnectedToZatca = useZatcaConnection();

  const filteredColumns = useMemo(
    () =>
      columns.filter((col: any) => {
        if (col.accessorKey === 'zatca_report_status' && !isConnectedToZatca) {
          return false;
        }
        return true;
      }),
    [columns, isConnectedToZatca]
  );

  return { columns: filteredColumns, isConnectedToZatca };
}
