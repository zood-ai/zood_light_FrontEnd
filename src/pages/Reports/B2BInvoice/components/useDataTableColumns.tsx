import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';
import dayjs from 'dayjs';
import { formatDateTime } from '@/utils/formatDateTime';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { useEffect, useState } from 'react';
import { useIsZatcaConnected } from '@/hooks/use-is-zatca-connected';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  let dispatch = useDispatch();

  let columns: ColumnDef<any>[] = [
    {
      accessorKey: 'reference',
      header: ({ column }) => (
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={t('INVOICE_NUMBER')}
        />
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
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={t('CUSTOMER_NAME')}
        />
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
      accessorKey: 'discount_amount',
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            remove={true}
            column={column}
            title={t('DISCOUNT')}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="min-w-[45px] truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('discount_amount') || '0'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'subtotal_price',
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            remove={true}
            column={column}
            title={t('TOTAL_WITHOUT_TAX')}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="min-w-28 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('subtotal_price')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'tax_value',
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            remove={true}
            column={column}
            title={t('TAX')}
          />
        );
      },
      cell: ({ row }) => {
        // Access tax_value from order_product[0].taxes[0].pivot.amount
        return (
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.original?.order_product?.[0]?.taxes?.[0]?.pivot?.amount ||
                '0'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'tax',
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            remove={true}
            column={column}
            title={t('TAX_RATE')}
          />
        );
      },
      cell: ({ row }) => {
        // Access tax rate from order_product[0].taxes[0].rate
        return (
          <div className="flex space-x-2">
            <span className="min-w-20 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.original?.order_product?.[0]?.taxes?.[0]?.rate
                ? `${row.original.order_product[0].taxes[0].rate}%`
                : '0%'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'total_price',
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            remove={true}
            column={column}
            title={t('TOTAL_WITH_TAX')}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="min-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('total_price')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'payment_status',
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            remove={true}
            column={column}
            title={t('PAYMENT_STATUS')}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row?.original.return_reason ? (
                <StatusBadge status="pending" text={t('RETURN_PAYMENT')} />
              ) : row.getValue('payment_status') == 'partial' ? (
                <StatusBadge status="Inactive" text={t('PARTIALLY_PAID')} />
              ) : row.getValue('payment_status') == 'unpaid' ? (
                <StatusBadge status="error" text={t('UNPAID')} />
              ) : row.getValue('payment_status') == 'fully' ? (
                <StatusBadge status="active" text={t('PAID')} />
              ) : (
                '-'
              )}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'business_date',
      header: ({ column }) => (
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={t('DATE')}
        />
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
    {
      accessorKey: 'zatca_report_status',
      header: ({ column }) => (
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={'Zatca Reporting'}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {/* {row.getValue('zatca_report_status') === 'pending' ||
              (row.getValue('zatca_report_status') === null && (
                <StatusBadge status="pending" text={'click to clearance'} />
              ))} */}
            {/* {row.getValue('zatca_report_status') === 'PASS' && ( */}
            <StatusBadge status="reported" text={t('REPORTED')} />
            {/* )} */}
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={t('INVOICE')}
        />
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
                {t('OPEN_INVOICE')}
              </Button>
            </div>
          </div>
        );
      },
    },
  ];
  const { columns: filteredColumns } = useIsZatcaConnected(columns);
  return { columns: filteredColumns };
};
