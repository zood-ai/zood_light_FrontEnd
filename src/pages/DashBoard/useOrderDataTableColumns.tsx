// useOrderDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { formatDateTime } from '@/utils/formatDateTime';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { currencyFormated } from '@/utils/currencyFormated';
export const useOrderDataTableColumns = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'reference',
      header: ({ column }) => (
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={t('INVOICE_NUMBER')}
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('reference')}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('INVOICE_TYPE')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {row.getValue('type') == 2 ? (
              <StatusBadge type={2} status="Inactive" text={t('CORPORATE')} />
            ) : (
              <StatusBadge type={1} status="active" text={t('INDIVIDUAL')} />
            )}
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          </div>
        );
      },
    },
    {
      accessorKey: 'total_price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('TOTAL_PRICE')} />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {currencyFormated(row.getValue('total_price'))}
        </span>
      ),
    },
    {
      accessorKey: 'customer', // Access the entire 'customer' object
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('CUSTOMER_NAME')} />
      ),
      cell: ({ row }) => {
        const customerName = row.getValue('customer')?.name; // Access 'name' from the 'customer' object
        return <span>{customerName || '-'}</span>;
      },
    },
    {
      accessorKey: 'business_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('DATE')} />
      ),
      cell: ({ row }) => (
        <span>{formatDateTime(row.getValue('business_date')) || '-'}</span>
      ),
    },
    {
      accessorKey: 'payment_status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('PAYMENT_STATUS')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row?.original.return_reason ? (
                <StatusBadge status="pending" text={t('RETURN_PAYMENT')} />
              ) : row.getValue('payment_status') == 'partial' ? (
                <StatusBadge status="Inactive" text={t('PARTIALLY_PAID')} />
              ) : row.getValue('payment_status') == 'unpaid' ? (
                <StatusBadge status="error" text={t('UNPAID')} />
              ) : row.getValue('payment_status') == 'fully' ? (
                <StatusBadge status="active" text={t('PAID')} />
              ) : (
                '-'
              )}
            </span>
          </div>
        );
      },
    },
  ];

  return { columns };
};
