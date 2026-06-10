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
import { formatDateTime } from '@/utils/formatDateTime';
import { useNavigate } from 'react-router-dom';
import createCrudService from '@/api/services/crudService';
import { useEffect, useState } from 'react';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { use } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useIsZatcaConnected } from '@/hooks/use-is-zatca-connected';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/interceptors';
import { toast } from '@/components/ui/use-toast';
import { Pointer } from 'lucide-react';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const crudService = createCrudService<any>('inventory/purchasing');
  const { useRemove } = crudService;
  const { mutate: remove } = useRemove();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [isConnectedLoading, setIsConnectedLoading] = useState(false);

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

  const handleSendToZatca = async ({ id }: { id: string }) => {
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
      accessorKey: 'get_supplier',
      header: ({ column }) => (
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={t('SUPPLIER_NAME')}
        />
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
      accessorKey: 'total_cost',
      header: ({ column }) => (
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={t('TOTAL_PRICE')}
        />
      ),
      cell: ({ row }: any) => {
        const sum = row?.original?.items.reduce(
          (acc: any, item: any) =>
            acc + item?.pivot?.quantity * item?.pivot?.cost,
          0
        );
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {sum || '0'}
            </span>
          </div>
        );
      },
      footer: ({ table }) => {
        const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
          const rowSum = row?.original?.items.reduce(
            (acc: any, item: any) =>
              acc + item?.pivot?.quantity * item?.pivot?.cost,
            0
          );
          return sum + (rowSum || 0);
        }, 0);

        return (
          <div className="flex space-x-2 font-bold">
            <span className="max-w-32 truncate font-bold sm:max-w-72 md:max-w-[31rem]">
              {total}
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
          <div className="flex space-x-2 ">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('business_date')
                ? formatDateTime(row.getValue('business_date'))
                : '-'}
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
          title={t('ZATCA_REPORTING')}
        />
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
                <span>{t('SEND_TO_ZATCA')}</span>
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
