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
      console.log({
        col,
        colKey: col.accessorKey,
        is_connected_to_zatca: is_connected_to_zatca,
      });
      if (col.accessorKey === 'zatca_report_status' && !is_connected_to_zatca) {
        return false;
      } else {
        return true;
      }
    });
    setIndividualInvoicesColumns(filteredColumns);
  }, []);

  columns = individualInvoicesColumns; 
  return { columns };
}
