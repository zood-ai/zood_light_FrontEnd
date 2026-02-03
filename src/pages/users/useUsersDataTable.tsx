import { ColumnDef } from '@tanstack/react-table';
import { formatDateTime } from '@/utils/formatDateTime';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { useTranslation } from 'react-i18next';

export const useUsersDataTable = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={t('NAME')}
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name') || '-'}</span>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('EMAIL')} />
      ),
      cell: ({ row }) => {
        return (
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('email') || '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('CREATED_AT')} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue('created_at');
        const formattedDate = createdAt ? formatDateTime(createdAt) : '-';
        return (
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {formattedDate}
          </span>
        );
      },
    },
  ];

  return { columns };
};
