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
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import createCrudService from '@/api/services/crudService';
import { formatDateTime } from '@/utils/formatDateTime';
import { useResolvedPath } from 'react-router-dom';

import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { useDispatch } from 'react-redux';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const crudService = createCrudService<any>('manage/customers');
  const { useRemove } = crudService;
  const { mutate: remove } = useRemove();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const resolvedPath = useResolvedPath('customer-profile');

  const columns: ColumnDef<Task>[] = [
    // {
    //   accessorKey: 'last_orders',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t('INVOICE_NUMBER')} />
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
        <DataTableColumnHeader column={column} title={t('CUSTOMER_NAME')} />
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
        <DataTableColumnHeader column={column} title={t('PHONE_NUMBER')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span
              dir="ltr"
              className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]"
            >
              {row.getValue('phone') || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'total_orders',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('ORDERS_QUANTITY')} />
      ),
      cell: ({ row }) => {
        const id = row?.original?.id;
        return (
          <div className="flex space-x-2">
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              to={`/zood-dashboard/customer-profile/${id}`}
              className="max-w-32 truncate text-[#363088] underline  font-medium sm:max-w-72 md:max-w-[31rem]"
            >
              {row.getValue('total_orders')}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: 'last_orders',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('LATEST_ORDER')} />
      ),
      cell: ({ row }) => {
        const timing = row.getValue('last_orders');
        return (
          <div className="flex space-x-2">
            <span className="max-w-32 text-[#363088] truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {timing ? formatDateTime(timing) : '-'}
            </span>
          </div>
        );
      },
    },
  ];

  return { columns };
};
