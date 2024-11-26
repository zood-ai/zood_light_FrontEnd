// useDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { labels, priorities, statuses } from '../data/data';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';
import dayjs from 'dayjs';
import { formatDateTime } from '@/utils/formatDateTime';
import { useDispatch } from 'react-redux';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  let dispatch = useDispatch();

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'reference',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم الفاتورة'} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('reference') || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'customer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'اسم العميل'} />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('customer')?.name || '-'}
            </span>
          </div>
        );
      },
    },
    
    {
      accessorKey: 'total_price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'المبلغ الكلي'} />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('total_price').toFixed(2) || '0'}
            </span>
          </div>
        );
      },
    },
    // {
    //   accessorKey: 'payment_status',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={'حالة الدفع'} />
    //   ),
    //   cell: ({ row }: any) => {
    //     return (
    //       <div className="flex space-x-2">
    //         {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
    //         <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
    //           {row.getValue('payment_status') == 'partial' ? (
    //             <StatusBadge status="Inactive" text={'مدفوع جزئي'} />
    //           ) : row.getValue('payment_status') == 'unpaid' ? (
    //             <StatusBadge status="error" text={'غير مدفوع'} />
    //           ) : (
    //             <StatusBadge status="active" text={'مدفوع'} />
    //           )}
    //         </span>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'التاريخ'} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {/* {dayjs(row.getValue('created_at')).format('MMMM D, YYYY h:mm A')} */}
              {formatDateTime(row.getValue('created_at'))}
            </span>
          </div>
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
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'تنفيذ'} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <div className="flex gap-4 text-sm font-bold text-right ">
              {' '}
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(toggleActionView(true));
                  dispatch(toggleActionViewData(row.original));
                }}
                className="ps-0"
                variant={'linkHover'}
              >
                رؤية الفاتورة
              </Button>
            </div>
          </div>
        );
      },
    },
  ];

  return { columns };
};
