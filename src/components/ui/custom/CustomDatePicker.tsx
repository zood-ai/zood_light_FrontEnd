import { useEffect, useState } from "react";

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
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useSearchParams } from "react-router-dom";

const CustomDatePicker = ({
  disableChoose,
  showType = true,
}: {
  disableChoose?: boolean;
  showType?: boolean;
}) => {
  const [dateType, setDateType] = useState<DateType>("weekly");
  const { filterObj } = useFilterQuery();

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

  useEffect(() => {
    setSelectedWeek({
      from: filterObj?.from
        ? new Date(filterObj?.from)
        : startOfWeek(new Date()),
      to: filterObj?.to ? new Date(filterObj?.to) : endOfWeek(new Date()),
    });
    setDate(new Date("1-10-2024"));
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
  }, [dateType]);
  const [_, setSearchParams] = useSearchParams();
  return (
    <div className="items-center flex gap-[7px] select-none">
      <ArrowLeftIcon
        className="cursor-pointer"
        onClick={() => handleNextPrevChange("prev", dateType)}
      />
      {showType && (
        <CustomDropDown
          options={[
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
            { label: "Custom", value: "custom" },
          ]}
          defaultValue="weekly"
          
          onValueChange={(value) => {
            setDateType(value as DateType);
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
          disabled={disableChoose}
        />
      )}

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
      <ArrowRightIcon
        className="cursor-pointer"
        onClick={() => handleNextPrevChange("next", dateType)}
      />
    </div>
  );
};

export default CustomDatePicker;
