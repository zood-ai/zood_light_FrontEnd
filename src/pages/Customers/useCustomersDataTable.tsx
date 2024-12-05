import { ColumnDef } from '@tanstack/react-table';
import { formatDateTime } from '@/utils/formatDateTime'; // A utility to format dates
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { useTranslation } from 'react-i18next'; // A hook for translations

export const useCustomersDataTable = () => {
  const { t } = useTranslation();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'reference',
      header: ({ column }) => (
        <DataTableColumnHeader remove={true} column={column} title={t('INVOICE_NUMBER')} />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('reference')}</span>
      ),
    },
    {
      accessorKey: 'business_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('DATE')} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue('business_date');
        const formattedDate = createdAt ? formatDateTime(createdAt) : '-';
        return (
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {formattedDate}
          </span>
        );
      },
    },
    {
      accessorKey: 'total_price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('TOTAL_PRICE')} />
      ),
      cell: ({ row }) => {
        return (
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('total_price').toFixed(2) || '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('STATUS')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {row.getValue('status') == '8' && (
              <StatusBadge status="Inactive" text={t('DRAFT')} />
            )}
            {row.getValue('status') == '4' && (
              <StatusBadge status="active" text={t('CLOSED')} />
            )}
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('INVOICE_TYPE')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('type') == 2 ? (
                <StatusBadge type={2} status="Inactive" text={t('CORPORATE')} />
              ) : (
                <StatusBadge type={1} status="active" text={t('INDIVIDUAL')} />
              )}
            </span>
          </div>
        );
      },
    },
  ];

  return { columns };
};
