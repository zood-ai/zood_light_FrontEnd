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
import placeHolderImg from '/images/image.png';

import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { Link } from 'react-router-dom';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('CATEGORY_NAME')} />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="  flex justify-start items-center py-[11.5px] w-[500px]  ">
            <div className="flex justify-start items-center max-w-[79px]">
              <img
                loading="lazy"
                src={row.original.image || placeHolderImg}
                className=" size-[50px] "
                alt="placeholder"
              />
            </div>
            <div className="ms-[20px]">{row.getValue('name')}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'products',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('PRODUCTS')} />
      ),
      cell: ({ row }) => {
        return (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex space-x-2"
          >
            <Link
              to={`/zood-dashboard/products?category_id=${row.original.id}`}
            >
              <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem] cursor-pointer text-blue-500 underline">
                {row.getValue('products') || '0'}
              </span>
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: 'reference',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('BARCODE')} />
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
      accessorKey: 'business_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('DATE')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {/* {dayjs(row.getValue('business_date')).format('MMMM D, YYYY h:mm A')} */}
              {formatDateTime(row.getValue('business_date'))}
            </span>
          </div>
        );
      },
    },
  ];

  return { columns };
};
