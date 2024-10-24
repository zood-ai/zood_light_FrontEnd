// useDataTableColumns.js
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { labels, priorities, statuses } from '../data/data';
import { Task } from '../data/schema';
import { DataTableColumnHeader } from '@/components/custom/DataTableComp/data-table-column-header';
import { StatusBadge } from '@/components/custom/StatusBadge';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const useDataTableColumns = () => {
  const { t } = useTranslation();
  const crudService = createCrudService<any>('menu/categories');
  const { useRemove } = crudService;
  const { mutate: remove } = useRemove();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false)
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
        <DataTableColumnHeader column={column} title={'رقم العرض'} />
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
          <div className="flex space-x-2 ">
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
          <div className="flex space-x-2 ">
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
            <Button className="ps-0" variant={'linkHover'}>
              رؤية الفاتورة
            </Button>
            <div
              className="flex gap-2 max-w-[82px] hover:stroke-main pe-0 ms-0"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigate(`edit/${row.original.id}`);
              }}
            >
              <div className="flex gap-x-[16px] items-center p-1 min-h-[24px]">
                <svg
                  width="18"
                  height="22"
                  viewBox="0 0 18 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V19C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7893 15.5304 21 15 21H9.5M1 12.5V5C1 4.46957 1.21071 3.96086 1.58579 3.58579C1.96086 3.21071 2.46957 3 3 3H5M6 1H12C12.5523 1 13 1.44772 13 2V4C13 4.55228 12.5523 5 12 5H6C5.44772 5 5 4.55228 5 4V2C5 1.44772 5.44772 1 6 1ZM7.42 11.61C7.61501 11.415 7.84653 11.2603 8.10132 11.1548C8.35612 11.0492 8.62921 10.9949 8.905 10.9949C9.18079 10.9949 9.45388 11.0492 9.70868 11.1548C9.96347 11.2603 10.195 11.415 10.39 11.61C10.585 11.805 10.7397 12.0365 10.8452 12.2913C10.9508 12.5461 11.0051 12.8192 11.0051 13.095C11.0051 13.3708 10.9508 13.6439 10.8452 13.8987C10.7397 14.1535 10.585 14.385 10.39 14.58L4.95 20L1 21L1.99 17.05L7.42 11.61Z"
                    stroke="#26262F"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="hover:stroke-main"
                  />
                </svg>
                <div
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setLoading(true);
                    await remove(
                      { id: row.original.id },
                      {
                        onSuccess: () => {
                          setLoading(false);
                        },
                        onError: () => {
                          setLoading(false);
                        },
                      }
                    );
                  }}
                >
                  {loading ? (
                    <>
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-main"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <>
                      {' '}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 4L4 20"
                          stroke="#FC3030"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                        <path
                          d="M4 4L20 20"
                          stroke="#FC3030"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    </>
                  )}
                </div>
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
