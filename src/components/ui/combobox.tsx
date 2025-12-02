import * as React from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  dir?: 'rtl' | 'ltr';
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'اختر...',
  searchPlaceholder = 'ابحث...',
  emptyText = 'لا توجد نتائج',
  className,
  dir = 'rtl',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const selectedOption = options.find((option) => option.value === value);

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          dir={dir}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-md border border-gray-300 bg-background px-3 py-2 text-sm shadow-sm transition-all duration-200',
            'focus:border-[#7272F6] focus:ring-2 focus:ring-[#7272F6]/20 focus:outline-none',
            'hover:bg-accent hover:text-accent-foreground',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            width="12"
            height="7"
            viewBox="0 0 12 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('shrink-0 opacity-50', dir === 'rtl' ? 'mr-2' : 'ml-2')}
          >
            <path
              d="M10.82 1.00016L5.91 5.91016L1 1.00016"
              stroke="#868686"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="flex flex-col" dir={dir}>
          {/* Search Input */}
          <div className="flex items-center border-b px-3">
            <svg
              className="h-4 w-4 shrink-0 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
                dir === 'rtl' ? 'mr-2' : 'ml-2'
              )}
            />
          </div>

          {/* Options List */}
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm">{emptyText}</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    value === option.value && 'bg-accent'
                  )}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      'h-4 w-4',
                      dir === 'rtl' ? 'mr-auto' : 'ml-auto',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
