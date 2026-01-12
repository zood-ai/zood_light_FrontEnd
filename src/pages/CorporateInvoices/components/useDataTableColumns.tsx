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
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import axiosInstance from '@/api/interceptors';
import { currencyFormated } from '../../../utils/currencyFormated';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import createCrudService from '@/api/services/crudService';
import { useQueryClient } from '@tanstack/react-query';
import { Pointer } from 'lucide-react';
import { useIsZatcaConnected } from '@/hooks/use-is-zatca-connected';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  let dispatch = useDispatch();
  const queryClient = useQueryClient();
  const animationStyles = `
    @keyframes buttonPulse {
      0% {
        box-shadow: 0 0 0 0 rgba(89, 81, 200, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(89, 81, 200, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(89, 81, 200, 0);
      }
    }

    @keyframes pointerPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
    }

    .button-send-zatca {
      animation: buttonPulse 2s infinite;
    }

    .pointer-icon-animation {
      animation: pointerPulse 1.5s ease-in-out infinite;
      display: inline-block;
    }
  `;
  const [isConnectedLoading, setIsConnectedLoading] = useState(false);

  const handleSendToZatca = async ({ id }) => {
    try {
      setIsConnectedLoading(true);
      const res = await axiosInstance.post(`zatca/orders/${id}/report`);
      console.log('Zatca Response: ', res);
      toast({
        title: 'Reported',
        description: res.data.message || 'Sent to Zatca successfully',
        duration: 3000,
        variant: 'default',
      });
    } catch (err) {
      console.error('Zatca Error: ', err);
    } finally {
      setIsConnectedLoading(false);
      queryClient.invalidateQueries(['/orders']);
    }
  };
  let columns: ColumnDef<Task>[] = [
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
        <DataTableColumnHeader column={column} title={t('CUSTOMER_NAME')} />
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
        <DataTableColumnHeader column={column} title={t('TOTAL_PRICE')} />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {currencyFormated(row.getValue('total_price')) || '-'}
            </span>
          </div>
        );
      },
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
      accessorKey: 'payment_status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('PAYMENT_STATUS')} />
      ),
      cell: ({ row }: any) => {
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
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
      accessorKey: 'zatca_report_status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('ZATCA_REPORTING')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center space-x-2 w-[180px] md:w-auto">
            <style>{animationStyles}</style>
            {row.getValue('zatca_report_status') === 'PASS' ? (
              <StatusBadge status="reported" text={t('REPORTED')} />
            ) : (
              <Button
                type="button"
                disabled={isConnectedLoading}
                className="px-2.5 py-1 gap-2 text-white bg-[#5951C8] rounded-lg border border-[#5951C8] border-solid max-md:px-5 hover:text-white transition-all duration-200 ease-out hover:scale-105 active:scale-95 cursor-pointer hover:shadow-md hover:shadow-[#5951C8]/30 button-send-zatca"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendToZatca({ id: row.original.id });
                }}
              >
                <span>{t('SEND_TO_ZATCA')}</span>{' '}
                <Pointer size={15} className="pointer-icon-animation" />
              </Button>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('INVOICE')} />
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
      footer: () => {
        return (
          <div className="space-x-2 font-bold flex  justify-end">
            <span
              dir="ltr"
              className="max-w-32   truncate font-bold sm:max-w-72 md:max-w-[31rem]"
            >
              Total:
            </span>
          </div>
        );
      },
    },
  ];
  const { columns: filteredColumns } = useIsZatcaConnected(columns);
  return { columns: filteredColumns };
};
