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
    // {
    //   accessorKey: 'invoice_number',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader remove={true} column={column} title={t('INVOICE_NUMBER')} />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex space-x-2">
    //         {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
    //         <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
    //           {row.getValue('invoice_number') || '-'}
    //         </span>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: 'get_supplier',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('SUPPLIER_NAME')} />
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
        <DataTableColumnHeader column={column} title={t('TOTAL_PRICE')} />
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
    },
    {
      accessorKey: 'business_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('DATE')} />
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
        <DataTableColumnHeader column={column} title={'Zatca Reporting'} />
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
    },
  ];

  return { columns };
};
