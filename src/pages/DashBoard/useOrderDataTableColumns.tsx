// useOrderDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { formatDateTime } from '@/utils/formatDateTime';
import { StatusBadge } from '@/components/custom/StatusBadge';

export const useOrderDataTableColumns = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'reference',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('رقم الفاتورة')} />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('reference')}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('نوع الفاتورة')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {row.getValue('type') == 2 ? (
              <StatusBadge type={2} status="Inactive" text={'مؤسسة'} />
            ) : (
              <StatusBadge type={1} status="active" text={'افراد'} />
            )}
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          </div>
        );
      },
    },
    {
      accessorKey: 'total_price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('المبلغ الاجمالي')} />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {row.getValue('total_price').toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: 'customer', // Access the entire 'customer' object
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('اسم العميل')} />
      ),
      cell: ({ row }) => {
        const customerName = row.getValue('customer')?.name; // Access 'name' from the 'customer' object
        return <span>{customerName || '-'}</span>;
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('التاريخ')} />
      ),
      cell: ({ row }) => (
        <span>{formatDateTime(row.getValue('created_at')) || '-'}</span>
      ),
    },
    {
      accessorKey: 'payment_status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('حالة الدفع')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('payment_status') == 'partial' ? (
                <StatusBadge status="Inactive" text={'مدفوع جزئي'} />
              ) : row.getValue('payment_status') == 'unpaid' ? (
                <StatusBadge status="error" text={'غير مدفوع'} />
              ) : (
                <StatusBadge status="active" text={'مدفوع'} />
              )}
            </span>
          </div>
        );
      },
    },
  ];

  return { columns };
};
