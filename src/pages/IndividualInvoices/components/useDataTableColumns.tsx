// useDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { labels, priorities, statuses } from '../data/data';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';

export const useDataTableColumns = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'id',
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
              {row.getValue('id')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'اسم العميل'} />
      ),
      cell: ({ row }) => {
        const label = labels.find(
          (label) => label.value === row.original.label
        );

        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('id')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'رقم الهاتف'} />
      ),
      cell: ({ row }) => {
        const label = labels.find(
          (label) => label.value === row.original.label
        );

        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('id')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
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
              {row.getValue('id')}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={'Zatca Reporting'} />
      ),
      cell: ({ row }) => {
        const label = labels.find(
          (label) => label.value === row.original.label
        );

        return (
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {label?.label === 'Bug' && (
              <StatusBadge status="pending" text={'click to clearance'} />
            )}
            {label?.label !== 'Bug' && (
              <StatusBadge status="reported" text={'cleared'} />
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
          <div className="flex space-x-2 w-[180px] md:w-auto">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <div className="flex gap-4 text-sm font-bold text-right ">
              {' '}
              <div className="text-indigo-900 border-b-2 border-indigo-900">
                رؤية الفاتورة
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/76a0eb3bfd36cd90613b8969de7f62b92c2cc89e857c5ada32654fdc39de5cf4?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                className="object-contain shrink-0 my-auto aspect-[0.9] w-[19px]"
              />
            </div>
          </div>
        );
      },
    },
  ];

  return { columns };
};
