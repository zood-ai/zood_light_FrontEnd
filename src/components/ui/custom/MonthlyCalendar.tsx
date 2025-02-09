// Utils
import moment from "moment";

// UI components
import { Button } from "../button";

// Icons
import ArrowLeftIcon from "@/assets/icons/ArrowLeft";
import ArrowRightIcon from "@/assets/icons/ArrowRight";

// Types
import { MonthlyCalendarProps } from "@/types/global.type";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useFilterQuery from "@/hooks/useFilterQuery";
import { endOfMonth, format, startOfMonth } from "date-fns";

const MonthlyCalendar = ({
  month,
  setMonth,
  year,
  setYear,
}: MonthlyCalendarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filterObj } = useFilterQuery();
  const handleNextPrevDate = (type: string) => {
    if (type === "next") {
      setMonth((prev) => (prev === 12 ? 1 : prev + 1));
      setYear((prev) => (month === 12 ? prev + 1 : prev));
    } else {
      setMonth((prev) => (prev === 1 ? 12 : prev - 1));
      setYear((prev) => (month === 1 ? prev - 1 : prev));
    }
  };

  useEffect(() => {
    const date = new Date(year, month - 1, 1);
    const start = format(startOfMonth(date), "yyyy-MM-dd");
    const end = format(endOfMonth(date), "yyyy-MM-dd");

    setSearchParams({
      ...filterObj,
      from: `${start}`,
      to: `${end}`,
    });
  }, [month, year]);

  return (
    <div className="w-[276px] p-3 ">
      {/* head */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="w-7 h-7 bg-transparent"
          onClick={() => handleNextPrevDate("prev")}
        >
          <ArrowLeftIcon className="w-4 h-4 absolute" />
        </Button>
        <span>
          {moment()
            .month(month - 1)
            .format("MMM")}{" "}
          {year}
        </span>
        <Button
          variant="outline"
          className="w-7 h-7 bg-transparent"
          onClick={() => handleNextPrevDate("next")}
        >
          <ArrowRightIcon className="w-4 h-4 absolute" />
        </Button>
      </div>

      {/* body */}
      <div className="grid grid-cols-auto-fill-custom gap-5 mt-5">
        {moment.monthsShort().map((monthName, index) => (
          <Button
            key={index}
            variant="outline"
            className={
              month === index + 1
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : ""
            }
            onClick={() => setMonth(index + 1)}
          >
            {monthName}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MonthlyCalendar;
