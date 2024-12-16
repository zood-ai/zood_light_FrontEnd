import useDirection from '@/hooks/useDirection';
import createCrudService from '@/api/services/crudService';
import { useTranslation } from 'react-i18next';
import {currencyFormated} from '../utils/currencyFormated';
function DashSalesCard({ data }) {
  const isRtl = useDirection();
  const { t } = useTranslation();
  const { data: data1 } = createCrudService<any>(
    '/reports/overview/light?groupby=month'
  ).useGetAll();
  const { data: data2 } = createCrudService<any>(
    '/reports/overview/light?groupby=day'
  ).useGetAll();
  const { data: data3 } = createCrudService<any>(
    '/reports/overview/light?groupby=week'
  ).useGetAll();

  const totalDay = data2?.data?.sum_orders?.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const totalMonth = data1?.data?.sum_orders?.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalWeek = data3?.data?.sum_orders?.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalRevent = data?.sum_orders.reduce(
    (sum, item) => sum + item.value,
    0
  );   
  const newTotalDay = currencyFormated(Number(totalDay));
  const newTotalWeek = currencyFormated(Number(totalWeek)); 
  const newTotalMonth = currencyFormated(Number(totalMonth))
  const newTotalRevent = currencyFormated(Number(totalRevent)); 
  console.log(typeof +newTotalRevent)
  return (
    <>
      <div className={`flex flex-col rounded-none `}>
        <div
          className={`flex gap-5 justify-start py-6 ${
            isRtl ? 'pl-3.5 pr-10a' : 'pr-3.5 pl-10'
          } w-full bg-white rounded-lg border border-gray-200 border-solid relative bg-`}
        >
          <div className="absolute inset-0  right-[90%] top-auto bottom-auto ml-aauto">
            <div className=" flex flex-col max-w-[15px] rounded-[40px]">
              <div className="flex flex-col pt-9 w-full bg-violet-200 rounded-[40px]">
                <div className="flex w-full bg-[var(--main)] min-h-[98px] rounded-[40px]" />
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col self-start pt-9 bg-violet-200 rounded-[40px]`}
          >
            <div className="flex shrink-0 bg-[var(--main)] h-[98px] rounded-[40px]" />
          </div>
          <div className="flex flex-col relative">
            <div
              className={`flex flex-col ${
                isRtl ? 'pl-1.5 pr-0' : 'pr-1.5 pl-6'
              } mt-6`}
            >
              <div className="self-start text-base font-semibold text-zinc-800">
                {t('INVOICES')}
              </div>
              <div
                className={`self-start mt-2.5 text-2xl font-bold text-indigo-900 ${
                  isRtl ? 'text-left' : 'text-right'
                }`}
              >
                {/* SR {totalRevent?.toFixed(2)} */}
                   SR {newTotalRevent}
              </div>
            </div>
          </div>
        </div>

        {/* المنتصف */}

        <div className="flex flex-col py-7 mt-4 w-full text-base bg-white rounded-lg border border-gray-200 border-solid text-zinc-800">
          <div
            className={`flex flex-col px-3.5 w-full ${
              isRtl ? 'text-right' : 'text-left'
            }`}
          >
            <>
              <div className="flex gap-5 justify-between self-center w-full max-w-[295px]">
                <div className="flex gap-3 font-medium whitespace-nowrap">
                  <div className="flex shrink-0 my-auto w-2.5 h-2.5 bg-[var(--main)] rounded-full" />
                  <div>{t('DAY')}</div>
                </div>
                <div className="font-semibold">
                  {/* SR {Number(totalDay)?.toFixed(2)} */}
                SR {newTotalDay}
                </div>
              </div>
              <div className="object-contain mt-5 w-full aspect-[333.33] bg-slate-200 " />
            </>
            <>
              <div className="flex gap-5 justify-between self-center w-full max-w-[295px]">
                <div className="flex gap-3 font-medium whitespace-nowrap">
                  <div className="flex shrink-0 my-auto w-2.5 h-2.5 bg-[var(--main)] rounded-full" />
                  <div>{t('WEEK')}</div>
                </div>
                <div className="font-semibold">
                  {/* SR {Number(totalWeek)?.toFixed(2)} */}
                 SR {newTotalWeek}
                </div>
              </div>
              <div className="object-contain mt-5 w-full aspect-[333.33] bg-slate-200 " />
            </>
            <>
              <div className="flex gap-5 justify-between self-center w-full max-w-[295px]">
                <div className="flex gap-3 font-medium whitespace-nowrap">
                  <div className="flex shrink-0 my-auto w-2.5 h-2.5 bg-[var(--main)] rounded-full" />
                  <div>{t('MONTH')}</div>
                </div>
                <div className="font-semibold">
                  {/* SR {Number(totalMonth)?.toFixed(2)} */}
                   SR {newTotalMonth}
                </div>
              </div>
              <div className="object-contain mt-5 w-full aspect-[333.33] bg-slate-200 " />
            </>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashSalesCard;
