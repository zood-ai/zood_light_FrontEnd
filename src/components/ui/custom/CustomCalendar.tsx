// Utils
import { endOfWeek, format, startOfWeek } from "date-fns";
import { cn } from "@/utils";

// UI components
import { Calendar } from "@/components/ui/calendar";
import { Button } from "../button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MonthlyCalendar from "@/components/ui/custom/MonthlyCalendar";

// Icons
import { Calendar as CalendarIcon } from "lucide-react";

// Types
import { CustomCalendarProps } from "@/types/global.type";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import useFilterQuery from "@/hooks/useFilterQuery";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";

const CustomCalendar = ({
  dateType,
  date,
  month,
  year,
  setSelectedWeek,
  selectedWeek,
  setDate,
  setMonth,
  setYear,
}: CustomCalendarProps) => {
  const [_, setSearchParams] = useSearchParams();
  const { filterObj } = useFilterQuery();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const toggleCalendar = () => {
    setIsCalendarOpen(true);
  };

  console.log(date, "datedate");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          onClick={toggleCalendar}
          className={cn(
            "w-[100px] h-[32px] justify-between gap-2 rounded-sm font-normal px-2",
            !selectedWeek && "text-muted-foreground"
          )}
        >
          {dateType === "daily" && date && (
            <p>{moment(date).format("D MMM")}</p>
          )}
          {dateType === "weekly" && (
            <p>
              {format(startOfWeek(selectedWeek?.from ?? new Date()), "d")}-
              {format(endOfWeek(selectedWeek?.to ?? new Date()), "d MMM")}
            </p>
          )}
          {dateType === "custom" && (
            <p>
              {format(selectedWeek?.from ?? new Date(), "d")}-
              {format(selectedWeek?.to ?? new Date(), "d MMM")}
            </p>
          )}
          {dateType === "monthly" && <p>{month + " - " + year}</p>}

          <CalendarIcon className="h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-transparent bg-white">
        {dateType === "weekly" && (
          <Calendar
            mode="range"
            modifiers={{
              selected: selectedWeek || [],
            }}
            onDayClick={(day, modifiers) => {
              if (modifiers.selected) {
                setSelectedWeek({
                  from: startOfWeek(day),
                  to: endOfWeek(day),
                });
                return;
              }
              setSelectedWeek({
                from: startOfWeek(day),
                to: endOfWeek(day),
              });
              setSearchParams({
                ...filterObj,
                from: format(startOfWeek(day), "yyyy-MM-dd"),
                to: format(endOfWeek(day), "yyyy-MM-dd"),
              });
            }}
          />
        )}

        {dateType === "daily" && (
          <Calendar
            mode={"single"}
            selected={date}
            onSelect={(selectedDate: Date | undefined) => {
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
            initialFocus
          />
        )}

        {dateType === "custom" && isCalendarOpen && (
          <>
            <Calendar
              mode={"range"}
              selected={selectedWeek}
              onSelect={(selectedDate: DateRange | undefined) => {
                if (selectedDate?.from || selectedDate?.to) {
                  setSelectedWeek({
                    from: selectedDate.from,
                    to: selectedDate.to,
                  });
                  setSelectedDate(selectedDate);
                }
              }}
              initialFocus
            />

            <Button
              variant={"outline"}
              className="w-[270px] m-2"
              onClick={() => {
                setIsCalendarOpen(false);
                setSearchParams({
                  ...filterObj,
                  from: format(selectedDate.from || new Date(), "yyyy-MM-dd"),
                  to: format(selectedDate.to || new Date(), "yyyy-MM-dd"),
                });
              }}
            >
              Apply
            </Button>
          </>
        )}

        {dateType === "monthly" && (
          <MonthlyCalendar
            month={month}
            setMonth={setMonth}
            year={year}
            setYear={setYear}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CustomCalendar;
