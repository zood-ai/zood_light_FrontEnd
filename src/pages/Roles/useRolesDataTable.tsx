import { ColumnDef } from '@tanstack/react-table';
import { formatDateTime } from '@/utils/formatDateTime';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { useTranslation } from 'react-i18next';

export const useRolesDataTable = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={t('ROLE_NAME')}
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name') || '-'}</span>
      ),
    },
    {
      accessorKey: 'users',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('USERS_COUNT')} />
      ),
      cell: ({ row }) => {
        const users = row.getValue('users');

        return (
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {users?.length ?? ''}
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
