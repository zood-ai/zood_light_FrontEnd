import { ColumnDef } from '@tanstack/react-table';
import { formatDateTime } from '@/utils/formatDateTime';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { useTranslation } from 'react-i18next';

export const useBranchesDataTable = () => {
  const { t } = useTranslation();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          remove={true}
          column={column}
          title={t('BRANCH_NAME')}
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('name') || '-'}</span>
      ),
    },
  ];

  return { columns };
};
