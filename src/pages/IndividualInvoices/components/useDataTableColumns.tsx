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
import { formatDate } from '@/utils/formatDateTime';

export const useDataTableColumns = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'reference',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم الفاتورة'} />
      ),
      cell: ({ row }) => {
        const label = labels.find(
          (label) => label.value === row.original.label
        );

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
        <DataTableColumnHeader column={column} title={'اسم العميل'} />
      ),
      cell: ({ row }: any) => {
        const label = labels.find(
          (label) => label.value === row.original.label
        );

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
      accessorKey: 'customer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم الهاتف'} />
      ),
      cell: ({ row }: any) => {
        const label = labels.find(
          (label) => label.value === row.original.label
        );

        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('customer')?.phone || '-'}
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
        const label = labels.find(
          (label) => label.value === row.original.label
        );

        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {/* {dayjs(row.getValue('created_at')).format('MMMM D, YYYY h:mm A')} */}
              {formatDate(row.getValue('created_at'))}
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
        const label = labels.find(
          (label) => label.value === row.original.label
        );

        return (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {row.getValue('zatca_report_status') === 'pending' ||
              (row.getValue('zatca_report_status') === null && (
                <StatusBadge status="pending" text={'click to clearance'} />
              ))}
            {row.getValue('zatca_report_status') === 'PASS' && (
              <StatusBadge status="reported" text={'reported'} />
            )}
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
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
        const label = labels.find(
          (label) => label.value === row.original.label
        );

        return (
          <div className="flex  w-[180px] md:w-auto">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <div className="flex  text-sm font-bold text-right items-center ">
              {' '}
              <Button variant="linkHover" className="ps-0">
                رؤية الفاتورة
              </Button>
              <svg
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.11816V7.11816M1 7.11816H7M1 7.11816L4 4.41816C5.51344 3.08461 7.43099 2.29813 9.44496 2.18494C11.4589 2.07175 13.4525 2.6384 15.1059 3.79397C16.7592 4.94954 17.9764 6.62702 18.5622 8.55724C19.1479 10.4875 19.0683 12.5585 18.336 14.438C17.6037 16.3176 16.2613 17.8966 14.524 18.9218C12.7868 19.9469 10.7556 20.3588 8.75628 20.0912C6.75695 19.8237 4.90547 18.8923 3.49893 17.4464C2.09239 16.0005 1.21234 14.1241 1 12.1182"
                  stroke="#DB2525"
                  stroke-width="2"
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
