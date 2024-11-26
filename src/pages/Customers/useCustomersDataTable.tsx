import { ColumnDef } from '@tanstack/react-table';
import { formatDateTime } from '@/utils/formatDateTime'; // A utility to format dates
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';

export const useCustomersDataTable = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'reference',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم الفاتورة'} />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('reference')}</span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'التاريخ'} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue('created_at');
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
        <DataTableColumnHeader column={column} title={'المبلغ الاجمالي'} />
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
        <DataTableColumnHeader column={column} title={'الحالة'} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {row.getValue('status') == '8' && (
              <StatusBadge status="Inactive" text={'draft'} />
            )}
            {row.getValue('status') == '4' && (
              <StatusBadge status="active" text={'closed'} />
            )}
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'نوع الفاتورة '} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('type') == 2 ? (
                <StatusBadge type={2} status="Inactive" text={'مؤسسة'} />
              ) : (
                <StatusBadge type={1} status="active" text={'افراد'} />
              )}
            </span>
          </div>
        );
      },
    },
  ];

  return { columns };
};
