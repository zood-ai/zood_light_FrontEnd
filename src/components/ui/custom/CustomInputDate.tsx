import React, { useState } from "react";
import { cn } from "@/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../calendar";
import moment from "moment";
import { Label } from "../label";

type ICustomInputDate = {
  date?: string;
  onSelect: (date: Date) => void;
  disabled?: boolean;
  width?: string;
  disabledDate?: (date: Date) => boolean;
  defaultValue?: any;
  className?: string;
  label?: string;
  required?: boolean;
};

const CustomInputDate = ({
  date,
  onSelect,
  disabled,
  width = "w-[150px]",
  disabledDate,
  defaultValue = moment(new Date()).format("YYYY-MM-DD"),
  className,
  label,
  required = false
}: ICustomInputDate) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Ensure date is valid
      setSelectedDate(date);
      onSelect(date);
    }
  };

  return (
    <Popover>
      <div className={`flex flex-col gap-3 ${className}`}>
        {label && <Label>{label} {required && <span className="text-warn">*</span>}</Label>}

        <div>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                `text-black ${width}  ${width ? "" : "flex justify-between"
                } flex justify-between font-normal rounded-sm border border-input `
              )}
              disabled={disabled}
            >
              <p>{defaultValue}</p>
              <CalendarIcon className="h-4 w-4 shrink-0 text-gray" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-transparent">
            <Calendar
              mode="single"
              selected={selectedDate}
              className="bg-white"
              onSelect={handleDateSelect} // Ensure this matches Calendar's expected type
              disabled={disabledDate}
            />
          </PopoverContent>
        </div>
      </div>
    </Popover>
  );
};

export default CustomInputDate;
