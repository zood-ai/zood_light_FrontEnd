import { DashHoverIcon } from './Icons/DashHoverIcon.tsx';
import { useTranslation } from 'react-i18next';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

function DashCards({
  data,
  activeFilter,
  setActiveFilter,
  dashboardDateRange,
  setDashboardDateRange,
}) {
  const { t } = useTranslation();
  const formatCount = (value) => Number(value ?? 0).toLocaleString();
  const isCustomRangeActive = Boolean(dashboardDateRange?.query);
  const buildDateRangeQuery = (startDate, endDate) => {
    const rangeValue = `${startDate} - ${endDate}`;
    return `&business_date=${rangeValue}&from_date=${startDate}&to_date=${endDate}`;
  };
  const handleFilterClick = (filter) => {
    if (isCustomRangeActive) return;
    setActiveFilter(filter);
  };
  const handleDateChange = (dates, dateStrings) => {
    if (!dateStrings[0] || !dateStrings[1]) {
      setDashboardDateRange({
        value: null,
        query: '',
        label: '',
      });
      return;
    }
    setDashboardDateRange({
      value: dates,
      query: buildDateRangeQuery(dateStrings[0], dateStrings[1]),
      label: `${dateStrings[0]} - ${dateStrings[1]}`,
    });
  };
  const handleClearDateFilter = () => {
    setDashboardDateRange({
      value: null,
      query: '',
      label: '',
    });
  };

  const buttonStyles = (filter) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: activeFilter === filter ? 'var(--main)' : '#F5F5F5',
    color: activeFilter === filter ? '#FFF' : '#888',
    cursor: isCustomRangeActive ? 'not-allowed' : 'pointer',
    opacity: isCustomRangeActive ? 0.6 : 1,
    border: 'none',
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-mainBorder/60 bg-white p-2 md:gap-3">
        <button
          style={buttonStyles('day')}
          onClick={() => handleFilterClick('day')}
        >
          {t('DAY')}
        </button>
        <button
          style={buttonStyles('week')}
          onClick={() => handleFilterClick('week')}
        >
          {t('WEEK')}
        </button>
        <button
          style={buttonStyles('month')}
          onClick={() => handleFilterClick('month')}
        >
          {t('MONTH')}
        </button>
        <div className="ms-auto flex items-center gap-2">
          <RangePicker
            value={dashboardDateRange?.value}
            placeholder={[t('START_DATE'), t('END_DATE')]}
            className="h-[42px] max-w-[303px] rounded-md border-mainBorder text-black"
            onChange={handleDateChange}
          />
          {dashboardDateRange?.query ? (
            <button
              type="button"
              onClick={handleClearDateFilter}
              className="h-[35px] rounded-md border border-mainBorder px-3 text-sm text-mainText hover:bg-slate-50"
            >
              {t('RESET')}
            </button>
          ) : null}
          {dashboardDateRange?.label ? (
            <span className="rounded-md bg-main/10 px-2 py-1 text-xs text-mainText">
              {dashboardDateRange.label}
            </span>
          ) : null}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 text-slate-600 sm:grid-cols-2">
        <div className="group flex h-[98px] w-full flex-col whitespace-nowrap text-slate-600">
          <div className="flex w-full justify-between gap-5 rounded-lg border border-gray-200 bg-white p-4 duration-100 group-hover:bg-main group-hover:text-white">
            <div className="  flex flex-col">
              <div className="self-start ml-3 text-base font-medium text-right">
                {t('INVOICES')}
              </div>
              <div className="mt-2 text-3xl font-semibold">
                {formatCount(data?.count_orders)}
              </div>
            </div>
            <DashHoverIcon />
          </div>
        </div>
        <div className="group flex h-[98px] w-full flex-col whitespace-nowrap text-slate-600">
          <div className="flex w-full justify-between gap-5 rounded-lg border border-gray-200 bg-white p-4 duration-100 group-hover:bg-main group-hover:text-white">
            <div className="flex flex-col">
              <div className="self-start ml-3 text-base font-medium text-right">
                {t('PURCHASES')}
              </div>
              <div className="mt-2 text-3xl font-semibold">
                {formatCount(data?.count_purchases)}
              </div>
            </div>
            <DashHoverIcon />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashCards;
