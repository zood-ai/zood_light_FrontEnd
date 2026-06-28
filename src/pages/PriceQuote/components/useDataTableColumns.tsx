// useDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';
import { formatDateTime } from '@/utils/formatDateTime';
import { useDispatch } from 'react-redux';
import { currencyFormated } from '../../../utils/currencyFormated';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { useMemo } from 'react';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const columns: ColumnDef<Task>[] = useMemo(
    () => [
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
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('reference') || '-'}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'customer',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('CUSTOMER_NAME')} />
        ),
        cell: ({ row }: any) => (
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('customer')?.name || '-'}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'total_price',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('TOTAL_PRICE')} />
        ),
        cell: ({ row }: any) => (
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {currencyFormated(row.getValue('total_price')) || '0'}
            </span>
          </div>
        ),
        footer: ({ table }) => {
          const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
            const value = row.getValue('total_price');
            return sum + (typeof value === 'number' ? value : 0);
          }, 0);

          return (
            <div className="flex space-x-2 font-bold">
              <span className="max-w-32 truncate font-bold sm:max-w-72 md:max-w-[31rem]">
                {currencyFormated(total)}
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
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {formatDateTime(row.getValue('business_date'))}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('STATUS')} />
        ),
        cell: ({ row }) => (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {row.getValue('status') == '8' && (
              <StatusBadge status="Inactive" text={t('DRAFT')} />
            )}
          </div>
        ),
      },
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('INVOICE')} />
        ),
        cell: ({ row }) => (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            <div className="flex gap-4 text-sm font-bold text-right ">
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
                {t('OPEN_INVOICE')}
              </Button>
            </div>
          </div>
        ),
        footer: () => (
          <div className="space-x-2 font-bold flex  justify-end">
            <span
              dir="ltr"
              className="max-w-32   truncate font-bold sm:max-w-72 md:max-w-[31rem]"
            >
              Total:
            </span>
          </div>
        ),
      },
    ],
    [t, dispatch]
  );

  return { columns };
};
