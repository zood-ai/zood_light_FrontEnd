import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { currencyFormated } from '@/utils/currencyFormated';
import { formatDateTime } from '@/utils/formatDateTime';

type PaymentRow = {
  id: string;
  payment_method_name: string;
  total_amount: number;
  payments_count: number;
  orders_count: number;
  last_payment_date: string;
};

export const useDataTableColumns = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<PaymentRow>[] = [
    {
      accessorKey: 'payment_method_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('PAYMENT_METHOD')} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[240px] truncate font-medium">
          {row.original?.payment_method_name || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'total_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('TOTAL_AMOUNT')} />
      ),
      cell: ({ row }) => (
        <div className="font-semibold">
          {currencyFormated(Number(row.original?.total_amount || 0))}
        </div>
      ),
    },
    {
      accessorKey: 'payments_count',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('TOTAL_PAYMENTS')} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[220px] truncate font-medium">
          {Number(row.original?.payments_count || 0)}
        </div>
      ),
    },
    {
      accessorKey: 'orders_count',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('ORDERS_QUANTITY')} />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {Number(row.original?.orders_count || 0)}
        </div>
      ),
    },
    {
      accessorKey: 'last_payment_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('LATEST_ORDER')} />
      ),
      cell: ({ row }) => (
        <div>
          {formatDateTime(row.original?.last_payment_date || '')}
        </div>
      ),
    },
  ];

  return { columns };
};
