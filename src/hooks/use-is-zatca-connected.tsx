import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export function useIsZatcaConnected(columns: any) {
  const is_connected_to_zatca = useSelector(
    (state: any) => state?.allSettings?.value?.WhoAmI?.is_connected_to_zatca
  );

  const [individualInvoicesColumns, setIndividualInvoicesColumns] =
    useState<any>(columns);
  useEffect(() => {
    const filteredColumns = columns.filter((col: any) => {
      if (col.accessorKey === 'zatca_report_status' && !is_connected_to_zatca) {
        return false;
      } else {
        return true;
      }
    });
    setIndividualInvoicesColumns(filteredColumns);
  }, [columns, is_connected_to_zatca]);

  columns = individualInvoicesColumns;
  return { columns };
}
