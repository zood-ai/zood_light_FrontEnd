import { useState } from "react";

// UI components
import CustomCalendar from "./CustomCalendar";
import CustomDropDown from "./CustomDropDown";

// Icons
import ArrowLeftIcon from "@/assets/icons/ArrowLeft";
import ArrowRightIcon from "@/assets/icons/ArrowRight";

// Types
import { DateType } from "@/types/global.type";

// Custom Hooks
import useCustomCalender from "@/hooks/useCustomCalender";
import { useSearchParams } from "react-router-dom";
import useFilterQuery from "@/hooks/useFilterQuery";
import {
  endOfWeek,
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

const DatePicker = () => {
  const [dateType, setDateType] = useState<DateType>("weekly");

  const {
    date,
    month,
    year,
    selectedWeek,
    setSelectedWeek,
    setDate,
    setMonth,
    setYear,
    handleNextPrevChange,
  } = useCustomCalender();

  const {
    date: dateForecast,
    month: monthForecast,
    year: yearForecast,
    selectedWeek: selectedWeekForecast,
    setSelectedWeek: setSelectedWeekForecast,
    setDate: setDateForecast,
    setMonth: setMonthForecast,
    setYear: setYearForecast,
  } = useCustomCalender();
  const [_, setSearchParams] = useSearchParams();
  const { filterObj } = useFilterQuery();
  return (
    <div className="items-center flex gap-[7px] select-none">
      <ArrowLeftIcon
        className="cursor-pointer"
        onClick={() => handleNextPrevChange("prev", dateType)}
      />

      <CustomDropDown
        options={[
          { label: "Daily", value: "daily" },
          { label: "Weekly", value: "weekly" },
          { label: "Monthly", value: "monthly" },
        ]}
        defaultValue="weekly"
        onValueChange={(value) => {
          setDateType(value as DateType);
          if (value == "daily") {
            setSearchParams({
              ...filterObj,
              from: format(new Date(), "yyyy-MM-dd"),
              to: format(new Date(), "yyyy-MM-dd"),
            });
          }
          if (value == "weekly") {
            setSearchParams({
              ...filterObj,
              from: format(startOfWeek(new Date()), "yyyy-MM-dd"),
              to: format(endOfWeek(new Date()), "yyyy-MM-dd"),
            });
          }
          if (value == "monthly") {
            setSearchParams({
              ...filterObj,
              from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
              to: format(endOfMonth(new Date()), "yyyy-MM-dd"),
            });
          }
        }}
      />
      <CustomCalendar
        dateType={dateType}
        date={date}
        month={month}
        year={year}
        setSelectedWeek={setSelectedWeek}
        selectedWeek={selectedWeek}
        setDate={setDate}
        setMonth={setMonth}
        setYear={setYear}
      />
      <span>vs</span>
      <CustomCalendar
        dateType={dateType}
        date={dateForecast}
        month={monthForecast}
        year={yearForecast}
        setSelectedWeek={setSelectedWeekForecast}
        selectedWeek={selectedWeekForecast}
        setDate={setDateForecast}
        setMonth={setMonthForecast}
        setYear={setYearForecast}
      />

      <ArrowRightIcon
        className="cursor-pointer"
        onClick={() => handleNextPrevChange("next", dateType)}
      />
    </div>
  );
};

export default DatePicker;
