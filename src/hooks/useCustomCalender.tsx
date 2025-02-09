import moment from "moment";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import useFilterQuery from "./useFilterQuery";
import { useSearchParams } from "react-router-dom";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const useCustomCalender = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedWeek, setSelectedWeek] = useState<DateRange>({
    from: searchParams.get("from")
      ? new Date(searchParams.get("from") as string)
      : startOfWeek(new Date()),
    to: searchParams.get("to")
      ? new Date(searchParams.get("to") as string)
      : endOfWeek(new Date()),
  });

  const [month, setMonth] = useState(+moment().format("M"));
  const [year, setYear] = useState(new Date().getFullYear());
  const [date, setDate] = useState<Date>(new Date());

  const { filterObj } = useFilterQuery();

  const handleNextPrevChange = (type: "next" | "prev", dateType: string) => {
    if (type === "next") {
      if (dateType === "daily") {
        setDate((prev) => moment(prev).add(1, "day").toDate());
      } else if (dateType === "weekly") {
        setSelectedWeek({
          from: moment(selectedWeek?.to).add(1, "day").toDate(),
          to: moment(selectedWeek?.to).add(1, "week").toDate(),
        });
        setSearchParams({
          ...filterObj,
          from: format(
            moment(selectedWeek?.to).add(1, "day").toDate(),
            "yyyy-MM-dd"
          ),
          to: format(
            moment(selectedWeek?.to).add(1, "week").toDate(),
            "yyyy-MM-dd"
          ),
        });
      } else if (dateType === "monthly") {
        setMonth((prev) => (prev === 12 ? 1 : prev + 1));
        setYear((prev) => (month === 12 ? prev + 1 : prev));
        const date = new Date(
          month === 12 ? year + 1 : year,
          (month === 12 ? 1 : month + 1) - 1,
          1
        );
        const start = format(startOfMonth(date), "yyyy-MM-dd");
        const end = format(endOfMonth(date), "yyyy-MM-dd");

        setSearchParams({
          ...filterObj,
          from: `${start}`,
          to: `${end}`,
        });
      } else if (dateType === "custom") {
        setSelectedWeek({
          from: moment(selectedWeek?.to).add(1, "day").toDate(),
          to: moment(selectedWeek?.to).add(7, "day").toDate(),
        });
        setSearchParams({
          ...filterObj,
          from: format(
            moment(selectedWeek?.to).add(1, "day").toDate(),
            "yyyy-MM-dd"
          ),
          to: format(
            moment(selectedWeek?.to).add(7, "day").toDate(),
            "yyyy-MM-dd"
          ),
        });
      }
    } else {
      if (dateType === "daily") {
        setDate((prev) => moment(prev).subtract(1, "day").toDate());
      } else if (dateType === "weekly") {
        setSelectedWeek({
          from: moment(selectedWeek?.from).subtract(1, "week").toDate(),
          to: moment(selectedWeek?.from).subtract(1, "day").toDate(),
        });

        setSearchParams({
          ...filterObj,
          from: format(
            moment(selectedWeek?.from).subtract(1, "week").toDate(),
            "yyyy-MM-dd"
          ),
          to: format(
            moment(selectedWeek?.from).subtract(1, "day").toDate(),
            "yyyy-MM-dd"
          ),
        });
      } else if (dateType === "monthly") {
        setMonth((prev) => (prev === 1 ? 12 : prev - 1));
        setYear((prev) => (month === 1 ? prev - 1 : prev));
        const date = new Date(
          month === 1 ? year - 1 : year,
          (month === 1 ? 12 : month - 1) - 1,
          1
        );
        const start = format(startOfMonth(date), "yyyy-MM-dd");
        const end = format(endOfMonth(date), "yyyy-MM-dd");

        setSearchParams({
          ...filterObj,
          from: `${start}`,
          to: `${end}`,
        });
      } else if (dateType === "custom") {
        setSelectedWeek({
          from: moment(selectedWeek?.to).subtract(1, "day").toDate(),
          to: moment(selectedWeek?.to).subtract(7, "day").toDate(),
        });
        setSearchParams({
          ...filterObj,
          form: format(
            moment(selectedWeek?.to).subtract(1, "day").toDate(),
            "yyyy-MM-dd"
          ),
          to: format(
            moment(selectedWeek?.to).subtract(7, "day").toDate(),
            "yyyy-MM-dd"
          ),
        });
      }
    }
  };

  return {
    selectedWeek,
    setSelectedWeek,
    month,
    setMonth,
    year,
    setYear,
    date,
    setDate,
    handleNextPrevChange,
  };
};

export default useCustomCalender;
