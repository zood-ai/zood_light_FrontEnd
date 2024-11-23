import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'react-router-dom';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { priorities, statuses } from '@/pages/tasks/data/data';
import { DataTableViewOptions } from './data-table-view-options';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';
import { IconFileExport } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  actionBtn: any;
  actionText?: string;
}

export function DataTableToolbar<TData>({
  table,
  actionBtn,
  actionText,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { t } = useTranslation();
  const isRtl = useDirection();
  const navigate = useNavigate();
  const pathName = useLocation();
  const locations = [
    '/zood-dashboard/corporate-invoices',
    '/zood-dashboard/individual-invoices',
    '/zood-dashboard/purchase-invoices',
  ];

  return (
    <div className="flex items-center justify-between">
      <div
        className={`flex flex-1 flex-col-reverse items-start gap-y-2   sm:flex-row sm:items-center sm:space-x-2 `}
      >
        {/* {actionBtn} */}

        {/* <DataTableViewOptions table={table} /> */}
        <div className="flex gap-x-[16px] ">
          <Button
            className="rounded-[4px] w-[146px] h-[39px] "
            variant={'default'}
            onClick={() => {
              navigate('add');
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 1V14M1 7.5H14"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className="ms-[10px]">{`اضافة ${actionText}`}</span>
          </Button>
          {locations.includes(pathName?.pathname) && (
            <Button
              variant="outline"
              // onClick={() => table.resetColumnFilters()}
              className="h-[39px] w-[103px]"
            >
              <span className="me-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 12.1667V15.7222C17 16.1937 16.8127 16.6459 16.4793 16.9793C16.1459 17.3127 15.6937 17.5 15.2222 17.5H2.77778C2.30628 17.5 1.8541 17.3127 1.5207 16.9793C1.1873 16.6459 1 16.1937 1 15.7222V12.1667M4.55556 7.72222L9 12.1667M9 12.1667L13.4444 7.72222M9 12.1667V1.5"
                    stroke="#363088"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              {t('EXPORT')}
            </Button>
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}