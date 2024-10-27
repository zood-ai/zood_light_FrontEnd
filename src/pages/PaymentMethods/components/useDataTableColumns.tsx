// useDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { labels, priorities, statuses } from '../data/data';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleActionView } from '@/store/slices/toggleAction';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  const crudService = createCrudService<any>('menu/categories');
  const { useRemove } = crudService;
  const { mutate: remove } = useRemove();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  let dispatch = useDispatch();

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'اسم الطريقة'} />
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
      accessorKey: 'type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'طريقة الدفع'} />
      ),
      cell: ({ row }) => {
        const type = row.getValue('type');
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {type == '1' ? 'Cash' : type == '2' ? 'Card' : 'Other'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'is_active',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'الحالة'} />
      ),
      cell: ({ row }) => {
        const status = row.getValue('is_active');
        return (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            <StatusBadge
              status={status == '0' ? 'Inactive' : 'active'}
              text={status == '0' ? 'Inactive' : 'Active'}
            />
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
              <svg
                width="18"
                height="22"
                viewBox="0 0 18 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V19C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7893 15.5304 21 15 21H9.5M1 12.5V5C1 4.46957 1.21071 3.96086 1.58579 3.58579C1.96086 3.21071 2.46957 3 3 3H5M6 1H12C12.5523 1 13 1.44772 13 2V4C13 4.55228 12.5523 5 12 5H6C5.44772 5 5 4.55228 5 4V2C5 1.44772 5.44772 1 6 1ZM7.42 11.61C7.61501 11.415 7.84653 11.2603 8.10132 11.1548C8.35612 11.0492 8.62921 10.9949 8.905 10.9949C9.18079 10.9949 9.45388 11.0492 9.70868 11.1548C9.96347 11.2603 10.195 11.415 10.39 11.61C10.585 11.805 10.7397 12.0365 10.8452 12.2913C10.9508 12.5461 11.0051 12.8192 11.0051 13.095C11.0051 13.3708 10.9508 13.6439 10.8452 13.8987C10.7397 14.1535 10.585 14.385 10.39 14.58L4.95 20L1 21L1.99 17.05L7.42 11.61Z"
                  stroke="#26262F"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        );
      },
    },
  ];

  return { columns };
};
