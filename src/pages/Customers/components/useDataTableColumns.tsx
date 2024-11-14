// useDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { labels, priorities, statuses } from '../data/data';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import createCrudService from '@/api/services/crudService';
import { formatDate } from '@/utils/formatDateTime';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { useDispatch } from 'react-redux';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const crudService = createCrudService<any>('manage/customers');
  const { useRemove } = crudService;
  const { mutate: remove } = useRemove();
  const [loading, setLoading] = useState(false);
  let dispatch = useDispatch();

  const columns: ColumnDef<Task>[] = [
    // {
    //   accessorKey: 'last_orders',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={'رقم الفاتورة'} />
    //   ),
    //   cell: ({ row }) => {
    //     const label = labels.find(
    //       (label) => label.value === row.original.label
    //     );

    //     return (
    //       <div className="flex space-x-2">
    //         {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
    //         <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
    //           {row.getValue('last_orders') || '-'}
    //         </span>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'اسم العميل'} />
      ),
      cell: ({ row }) => {
         

        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('name') || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم الهاتف'} />
      ),
      cell: ({ row }) => {
         

        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span dir='ltr' className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('phone') || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'التاريخ'} />
      ),
      cell: ({ row }) => {
         

        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {formatDate(row.getValue('created_at')) || '-'}
            </span>
          </div>
        );
      },
    },
  


    // {
    //   accessorKey: 'id',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={'تنفيذ'} />
    //   ),
    //   cell: ({ row }) => {
         

    //     return (
    //       <div className="flex space-x-2 w-[180px] md:w-auto">
    //         {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
    //         <div className="flex gap-4 text-sm font-bold text-right ">
    //           {' '}
    //           <Button
    //             type="button"
    //             onClick={(e) => {
    //               e.stopPropagation();
    //               dispatch(toggleActionView(true));
                  // dispatch(toggleActionViewData(row.original));
    //             }}
    //             className="ps-0"
    //             variant={'linkHover'}
    //           >
    //             رؤية الفاتورة
    //           </Button>
          
    //         </div>
    //       </div>
    //     );
    //   },
    // },
  ];

  return { columns };
};
