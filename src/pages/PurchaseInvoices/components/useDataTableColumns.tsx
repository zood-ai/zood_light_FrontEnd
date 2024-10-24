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
import { formatDate } from '@/utils/formatDateTime';

export const useDataTableColumns = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'get_supplier',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'اسم المورد'} />
      ),
      cell: ({ row }:any) => {
        const label = labels.find(
          (label) => label.value === row.original.label
        );

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
      accessorKey: 'purchasing_number',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم المرجع'} />
      ),
      cell: ({ row }) => {
        const label = labels.find(
          (label) => label.value === row.original.label
        );

        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('purchasing_number') || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'get_supplier',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم الهاتف'} />
      ),
      cell: ({ row }:any) => {
        const label = labels.find(
          (label) => label.value === row.original.label
        );

        return (
          <div className="flex space-x-2 ">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('get_supplier')?.phone || '-'}
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
          <div className="flex space-x-2 ">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {formatDate(row.getValue('created_at')) || '-'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'invoice_number',
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
              {row.getValue('invoice_number') || '-'}
            </span>
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
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <div className="flex gap-4 text-sm font-bold text-right ">
              {' '}
              <div className="text-indigo-900 border-b-2 border-indigo-900">
                رؤية الفاتورة
              </div>
              <div className="flex gap-2 max-w-[82px]">
                <div className="flex gap-2.5 items-center p-1 min-h-[24px]">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/76a0eb3bfd36cd90613b8969de7f62b92c2cc89e857c5ada32654fdc39de5cf4?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                    className="object-contain shrink-0 self-start aspect-[0.9] w-[19px]"
                  />
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/8dcd2e428ac64c3eea4448b8910b03cf9a9f3a9fbe037ee7356e02ea5bee9337?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                    className="object-contain shrink-0 w-6 aspect-square"
                  />
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/3b7cdc2c2c31d720b264711c9fd68a5fd75016f77c00397ec0e56afd0e96f502?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                    className="object-contain self-stretch my-auto w-4 aspect-square"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return { columns };
};
