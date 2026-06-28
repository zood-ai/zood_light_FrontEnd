// useDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';
import { formatDateTime } from '@/utils/formatDateTime';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { useDispatch } from 'react-redux';
import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/interceptors';
import { toast } from '@/components/ui/use-toast';
import { Pointer } from 'lucide-react';
import { useIsZatcaConnected } from '@/hooks/use-is-zatca-connected';

const animationStyles = `
  @keyframes buttonPulse {
    0% { box-shadow: 0 0 0 0 rgba(89, 81, 200, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(89, 81, 200, 0); }
    100% { box-shadow: 0 0 0 0 rgba(89, 81, 200, 0); }
  }
  @keyframes pointerPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  .button-send-zatca { animation: buttonPulse 2s infinite; }
  .pointer-icon-animation {
    animation: pointerPulse 1.5s ease-in-out infinite;
    display: inline-block;
  }
`;

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isConnectedLoading, setIsConnectedLoading] = useState(false);

  const handleSendToZatca = useCallback(
    async ({ id }: { id: string }) => {
      try {
        setIsConnectedLoading(true);
        const res = await axiosInstance.post(`zatca/orders/${id}/report`);
        toast({
          title: t('REPORTED'),
          description: res.data.message || t('VIEW_MODAL_ZATCA_SENT'),
          duration: 3000,
          variant: 'default',
        });
      } catch (err) {
        console.error('Zatca Error: ', err);
      } finally {
        setIsConnectedLoading(false);
        queryClient.invalidateQueries({ queryKey: ['/orders'] });
      }
    },
    [queryClient, t]
  );

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
        id: 'customer_phone',
        accessorFn: (row: any) => row.customer?.phone,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('PHONE_NUMBER')} />
        ),
        cell: ({ row }: any) => (
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('customer_phone') || '-'}
            </span>
          </div>
        ),
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
        accessorKey: 'zatca_report_status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('ZATCA_REPORTING')} />
        ),
        cell: ({ row }) => (
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
                <span>{t('SEND_TO_ZATCA')}</span>
                <Pointer size={15} className="pointer-icon-animation" />
              </Button>
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
      },
    ],
    [t, dispatch, isConnectedLoading, handleSendToZatca]
  );

  const { columns: filteredColumns } = useIsZatcaConnected(columns);
  return { columns: filteredColumns };
};
