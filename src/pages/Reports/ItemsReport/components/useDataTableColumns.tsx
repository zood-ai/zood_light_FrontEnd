import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { currencyFormated } from '@/utils/currencyFormated';

type SoldItemRow = {
  id: string;
  name: string;
  sku: string;
  quantity_sold: number;
  total_sales: number;
};

export const useDataTableColumns = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<SoldItemRow>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('PRODUCT_NAME')} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[360px] truncate font-medium">
          {String(row.getValue('name') || '-')}
        </div>
      ),
    },
    {
      accessorKey: 'sku',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('BARCODE')} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[220px] truncate">{String(row.getValue('sku') || '-')}</div>
      ),
    },
    {
      accessorKey: 'quantity_sold',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('SOLD_QUANTITY')} />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{Number(row.getValue('quantity_sold') || 0)}</div>
      ),
    },
    {
      accessorKey: 'total_sales',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('TOTAL_SALES')} />
      ),
      cell: ({ row }) => (
        <div className="font-semibold">
          {currencyFormated(Number(row.getValue('total_sales') || 0))}
        </div>
      ),
    },
  ];

  return { columns };
};
