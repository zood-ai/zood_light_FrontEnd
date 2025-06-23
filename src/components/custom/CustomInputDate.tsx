/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import moment from 'moment';
import { Label } from '@/components/ui/label';

type ICustomInputDate = {
  date?: string | Date;
  onSelect?: (date: Date) => void;
  disabled?: boolean;
  width?: string;
  height?: string;
  disabledDate?: (date: Date) => boolean;
  defaultValue?: any;
  className?: string;
  parentClassName?: string;
  label?: string;
  labelClassName?: string;
  required?: boolean;
};

const CustomInputDate = ({
  date,
  onSelect,
  disabled,
  width = 'w-[150px]',
  height = 'h-[40px]',
  disabledDate,
  defaultValue = moment(new Date()).format('YYYY-MM-DD'),
  className = '',
  parentClassName = '',
  labelClassName = '',
  label,
  required = false,
}: ICustomInputDate) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // dont remove this
      setSelectedDate(moment(date).format('YYYY-MM-DD') as any);
      onSelect?.(moment(date).format('YYYY-MM-DD') as any);
    }
  };

  return (
    <Popover>
      <div className={`flex flex-col ${parentClassName}`}>
        {label && (
          <Label
            className={`text-sm font-medium text-textPrimary mb-2 ${labelClassName}`}
          >
            {label} {required && <span className="text-warn">*</span>}
          </Label>
        )}

        <div className={`${width}  ${height} ${className}`}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                `text-black w-full ${
                  width ? '' : 'flex justify-between'
                } disabled:bg-[#CCCCCC]/30 disabled:opacity-100 flex h-[40px] justify-between  rounded-md font-normal  border border-[#CCCCCC]`
              )}
              disabled={disabled}
            >
              <p>
                {date
                  ? moment(date).format('YYYY-MM-DD')
                  : moment(defaultValue).format('YYYY-MM-DD')}
              </p>
              {!disabled && (
                <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-transparent">
            <Calendar
              mode="single"
              selected={selectedDate}
              className="bg-white text-black"
              onSelect={handleDateSelect}
              disabled={disabledDate}
            />
          </PopoverContent>
        </div>
      </div>
    </Popover>
  );
};

export default CustomInputDate;
