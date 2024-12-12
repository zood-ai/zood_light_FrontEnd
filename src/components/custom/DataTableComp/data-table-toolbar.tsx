import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/custom/button';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/interceptors';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  actionBtn: any;
  actionText?: string;
  allUrl: string;
}

export function DataTableToolbar<TData>({
  table,
  actionBtn,
  actionText,
  allUrl,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { t, i18n } = useTranslation();
  const isRtl = useDirection();
  const navigate = useNavigate();
  const pathName = useLocation();
  const locationsExport = [
    '/zood-dashboard/corporate-invoices',
    '/zood-dashboard/individual-invoices',
    '/zood-dashboard/purchase-invoices',
    '/zood-dashboard/price-quote',
    '/zood-dashboard/normal-report',
    '/zood-dashboard/b2b-report',
    '/zood-dashboard/purchase-report',
  ];
  const locationsAdd = [
    '/zood-dashboard/corporate-invoices',
    '/zood-dashboard/individual-invoices',
    '/zood-dashboard/purchase-invoices',
    '/zood-dashboard/price-quote',
  ];

  const exportExcel = async () => {
    const exportedColumnsAR = `&headings[]=رقم الفاتورة&columns[]=reference&headings[]=اسم العميل&columns[]=customer.name&headings[]=المبلغ الإجمالي&columns[]=total_price&headings[]=التاريخ&columns[]=business_date&headings[]=حالة الدفع&columns[]=payment_status`;
    const exportedColumnsEn = `&headings[]=Invoice number&columns[]=reference&headings[]=Customer name&columns[]=customer.name&headings[]=Total price&columns[]=total_price&headings[]=Date&columns[]=business_date&headings[]=Payment status&columns[]=payment_status`;

    const holder =
      i18n.language === 'ar'
        ? allUrl + exportedColumnsAR
        : allUrl + exportedColumnsEn;

    const lastUrl = holder.includes('?')
      ? holder[holder.length - 1] === '?'
        ? `${holder}is_exporting_excel=1`
        : `${holder}&is_exporting_excel=1`
      : `${holder}?is_exporting_excel=1`;
    const res = await axiosInstance.get(lastUrl);
    console.log(lastUrl);
    const a = Object.assign(document.createElement('a'), {
      href: res.data,
      download: 'file.xlsx',
    });
    a.click();
  };

  return (
    <div className="flex items-center justify-between">
      <div
        className={`flex flex-1 flex-col-reverse items-start gap-y-2   sm:flex-row sm:items-center sm:space-x-2 `}
      >
        {/* {actionBtn} */}

        {/* <DataTableViewOptions table={table} /> */}
        <div className="flex gap-x-[16px] ">
          {locationsAdd.includes(pathName?.pathname) && (
            <Button
              style={{
                flexDirection: isRtl ? 'row-reverse' : 'row',
              }}
              className="rounded-[4px]  gap-x-[10px] w-fit h-[39px] "
              variant={'default'}
              onClick={actionBtn}
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
              <span>{`${actionText}`}</span>
            </Button>
          )}
          {locationsExport.includes(pathName?.pathname) && (
            <Button
              variant="outline"
              style={{
                flexDirection: isRtl ? 'row-reverse' : 'row',
              }}
              onClick={() => exportExcel()}
              className="h-[39px] w-[103px] gap-x-[10px]"
            >
              <span className="">
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
