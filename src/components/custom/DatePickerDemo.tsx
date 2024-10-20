import * as React from 'react'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from './button'
import { CalendarIcon } from '@radix-ui/react-icons'

export function DatePickerDemo({ onChange, ...props }: any) {
  const [date, setDate] = React.useState<Date>()
  const handleDateChange = (newDate: Date) => {
    setDate(newDate)

    if (newDate) {
      const formattedDate = newDate.toISOString().split('T')[0] // Format date as YYYY-MM-DD
      onChange(formattedDate) // Return the formatted date
    } else {
      onChange(null) // Handle case where no date is selected
    }
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal ',
            !date && 'text-muted-background'
          )}
        >
          {date ? (
            date.toLocaleDateString()
          ) : (
            <span className='text-muted-background'>Select a date</span>
          )}
          <CalendarIcon className='ml-auto h-4 w-4 ' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0 '>
        <Calendar
          {...props}
          mode='single'
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
