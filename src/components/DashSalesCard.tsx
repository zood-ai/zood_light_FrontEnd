import useDirection from '@/hooks/useDirection';
import axiosInstance from '../api/interceptors';
import { useState, useEffect } from 'react';
import { IconLoader } from '@tabler/icons-react';

function Loader() {
  return (
    <div className={`flex h-fit w-full items-center justify-center`}>
      <IconLoader className="animate-spin" size={32} />
      <span className="sr-only">loading</span>
    </div>
  );
}

function DashSalesCard({ data }) {
  const isRtl = useDirection();
  const [day, setDay] = useState<any>([]);
  const [month, setMonth] = useState<any>([]);
  const [week, setWeek] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  useEffect(function () {
    async function getStatistic() {
      setLoading(true);
      const data1 = await axiosInstance.get(
        `/reports/overview/light?groupby=month`
      );
      const data2 = await axiosInstance.get(
        `/reports/overview/light?groupby=day`
      );
      const data3 = await axiosInstance.get(
        `/reports/overview/light?groupby=week`
      );
      setDay(data1.data);
      setMonth(data2.data);
      setWeek(data3.data);
      setLoading(false);
    }
    getStatistic();
  }, []);
  console.log(
    day?.data?.sum_orders?.reduce((sum, item) => sum + item.value, 0)
  );
  const totalDay = day?.data?.sum_orders?.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const totalMonth = month?.data?.sum_orders?.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalWeek = week?.data?.sum_orders?.reduce(
    (sum, item) => sum + item.value,
    0
  );
  console.log(totalDay);
  const totalRevent = data?.data?.sum_orders.reduce(
    (sum, item) => sum + item.value,
    0
  );
  // console.log(totalRevent);
  return (
    <>
      {loading ? (
        <div className="flex items-center rounded-none">
          <Loader />
        </div>
      ) : (
        <div className={`flex flex-col rounded-none `}>
          <div
            className={`flex gap-5 justify-start py-6 ${
              isRtl ? 'pl-3.5 pr-10a' : 'pr-3.5 pl-10'
            } w-full bg-white rounded-lg border border-gray-200 border-solid relative bg-`}
          >
            <div className="absolute inset-0  right-[90%] top-auto bottom-auto ml-aauto">
              <div className=" flex flex-col max-w-[15px] rounded-[40px]">
                <div className="flex flex-col pt-9 w-full bg-violet-200 rounded-[40px]">
                  <div className="flex w-full bg-indigo-900 min-h-[98px] rounded-[40px]" />
                </div>
              </div>
            </div>

            <div
              className={`flex flex-col self-start pt-9 bg-violet-200 rounded-[40px]`}
            >
              <div className="flex shrink-0 bg-indigo-900 h-[98px] rounded-[40px]" />
            </div>
            <div className="flex flex-col relative">
              <div
                className={`flex flex-col ${
                  isRtl ? 'pl-1.5 pr-0' : 'pr-1.5 pl-6'
                } mt-6`}
              >
                <div className="self-start text-base font-semibold text-zinc-800">
                  اجمالي المبيعات
                </div>
                <div
                  className={`self-start mt-2.5 text-2xl font-bold text-indigo-900 ${
                    isRtl ? 'text-left' : 'text-right'
                  }`}
                >
                  SR {totalRevent?.toFixed(2)}
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
                    <div className="flex shrink-0 my-auto w-2.5 h-2.5 bg-indigo-900 rounded-full" />
                    <div>اليوم</div>
                  </div>
                  <div className="font-semibold">
                    SR {Number(totalDay)?.toFixed(2)}
                  </div>
                </div>
                <div className="object-contain mt-5 w-full aspect-[333.33] bg-slate-200 " />
              </>
              <>
                <div className="flex gap-5 justify-between self-center w-full max-w-[295px]">
                  <div className="flex gap-3 font-medium whitespace-nowrap">
                    <div className="flex shrink-0 my-auto w-2.5 h-2.5 bg-indigo-900 rounded-full" />
                    <div>الاسبوع</div>
                  </div>
                  <div className="font-semibold">
                    SR {Number(totalMonth)?.toFixed(2)}
                  </div>
                </div>
                <div className="object-contain mt-5 w-full aspect-[333.33] bg-slate-200 " />
              </>
              <>
                <div className="flex gap-5 justify-between self-center w-full max-w-[295px]">
                  <div className="flex gap-3 font-medium whitespace-nowrap">
                    <div className="flex shrink-0 my-auto w-2.5 h-2.5 bg-indigo-900 rounded-full" />
                    <div>الشهر</div>
                  </div>
                  <div className="font-semibold">
                    SR {Number(totalWeek)?.toFixed(2)}
                  </div>
                </div>
                <div className="object-contain mt-5 w-full aspect-[333.33] bg-slate-200 " />
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashSalesCard;
