// useDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { labels, priorities, statuses } from '../data/data';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';
import { format } from 'path';
import { formatDate } from '@/utils/formatDateTime';
import { useNavigate } from 'react-router-dom';
import createCrudService from '@/api/services/crudService';
import { useState } from 'react';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { use } from 'i18next';
import { useDispatch } from 'react-redux';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const crudService = createCrudService<any>('inventory/purchasing');
  const { useRemove } = crudService;
  const { mutate: remove } = useRemove();
  const [loading, setLoading] = useState(false);
  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'get_supplier',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'اسم العميل'} />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('get_supplier')?.name || '-'}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: 'reference',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم المرجع'} />
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
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'الحالة'} />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex space-x-2 ">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('status') == 'Closed' && (
                <StatusBadge status="active" text={'Closed'} />
              )}
              {row.getValue('status') == 'Draft' && (
                <StatusBadge status="Inactive" text={'Draft'} />
              )}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'get_supplier',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم الهاتف'} />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex space-x-2 ">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('get_supplier')?.phone || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'التاريخ'} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 ">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {formatDate(row.getValue('created_at')) || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'invoice_number',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم الفاتورة'} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('invoice_number') || '-'}
            </span>
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
