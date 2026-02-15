import useDirection from '@/hooks/useDirection';
import { useTranslation } from 'react-i18next';
import { currencyFormated } from '../utils/currencyFormated';
import { useQueries } from '@tanstack/react-query';
import axiosInstance from '@/api/interceptors';
type PeriodFilter = 'day' | 'week' | 'month';

function DashSalesCard({
  data,
  activeFilter,
  dashboardDateQuery,
  isCustomRangeActive,
  customRangeLabel,
}: {
  data: any;
  activeFilter: PeriodFilter;
  dashboardDateQuery: string;
  isCustomRangeActive: boolean;
  customRangeLabel: string;
}) {
  const isRtl = useDirection();
  const { t } = useTranslation();
  const sumOrders = (payload: any) =>
    payload?.sum_orders?.reduce(
      (sum: number, item: any) => sum + item.value,
      0
    ) ?? 0;
  const activeFilterTotal = sumOrders(data);
  const allPeriods: PeriodFilter[] = ['day', 'week', 'month'];
  const missingPeriods = isCustomRangeActive
    ? []
    : allPeriods.filter((period) => period !== activeFilter);
  const missingQueries = useQueries({
    queries: missingPeriods.map((period) => ({
      queryKey: ['dashboard-overview', period, dashboardDateQuery],
      queryFn: async () => {
        const response = await axiosInstance.get(
          `/reports/overview/light?groupby=${period}${dashboardDateQuery}`
        );
        return response?.data?.data;
      },
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    })),
  });

  const fetchedTotals = missingPeriods.reduce(
    (acc, period, index) => {
      acc[period] = sumOrders(missingQueries[index]?.data);
      return acc;
    },
    {} as Record<PeriodFilter, number>
  );
  const missingLoadingState = missingPeriods.reduce(
    (acc, period, index) => {
      const query = missingQueries[index];
      acc[period] = Boolean((query?.isLoading || query?.isPending) && !query?.data);
      return acc;
    },
    {} as Record<PeriodFilter, boolean>
  );

  const totalRevent = data?.sum_orders?.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const activeFormattedTotal = currencyFormated(Number(activeFilterTotal));
  const getSkeletonChars = (valueLength: number) =>
    Math.max(6, Math.min(14, valueLength + 1));
  const defaultPeriodTotals = [
    {
      filter: 'day' as PeriodFilter,
      label: t('DAY'),
      value: currencyFormated(
        Number(activeFilter === 'day' ? activeFilterTotal : fetchedTotals.day)
      ),
      isLoading: activeFilter === 'day' ? false : missingLoadingState.day,
      skeletonChars: getSkeletonChars(activeFormattedTotal.length),
    },
    {
      filter: 'week' as PeriodFilter,
      label: t('WEEK'),
      value: currencyFormated(
        Number(activeFilter === 'week' ? activeFilterTotal : fetchedTotals.week)
      ),
      isLoading: activeFilter === 'week' ? false : missingLoadingState.week,
      skeletonChars: getSkeletonChars(activeFormattedTotal.length),
    },
    {
      filter: 'month' as PeriodFilter,
      label: t('MONTH'),
      value: currencyFormated(
        Number(
          activeFilter === 'month' ? activeFilterTotal : fetchedTotals.month
        )
      ),
      isLoading: activeFilter === 'month' ? false : missingLoadingState.month,
      skeletonChars: getSkeletonChars(activeFormattedTotal.length),
    },
  ];
  const periodTotals = isCustomRangeActive
    ? [
        {
          filter: 'range',
          label: customRangeLabel || 'Selected Range',
          value: currencyFormated(Number(totalRevent)),
          isLoading: false,
          skeletonChars: getSkeletonChars(activeFormattedTotal.length),
        },
      ]
    : defaultPeriodTotals;
  const newTotalRevent = currencyFormated(Number(totalRevent));
  return (
    <>
      <div className={`flex flex-col rounded-none `}>
        <div
          className={`flex gap-5 justify-start py-6 ${
            isRtl ? 'pl-3.5 pr-10' : 'pr-3.5 pl-10'
          } w-full bg-white rounded-lg border border-gray-200 border-solid relative`}
        >
          <div className="absolute inset-0 right-[90%] top-auto bottom-auto">
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
            {periodTotals.map((period) => (
              <div key={period.filter}>
                <div className="flex gap-5 justify-between self-center w-full max-w-[295px]">
                  <div className="flex gap-3 font-medium whitespace-nowrap">
                    <div className="flex shrink-0 my-auto w-2.5 h-2.5 bg-[var(--main)] rounded-full" />
                    <div>{period.label}</div>
                  </div>
                  {period.isLoading ? (
                    <div
                      className="h-6 animate-pulse rounded bg-slate-200"
                      style={{ width: `${period.skeletonChars}ch` }}
                    />
                  ) : (
                    <div className="font-semibold">SR {period.value}</div>
                  )}
                </div>
                <div className="object-contain mt-5 w-full aspect-[333.33] bg-slate-200 " />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DashSalesCard;
