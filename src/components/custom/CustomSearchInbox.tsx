import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function CustomSearchInbox({
  options,
  value,
  onValueChange,
  placeholder = 'اختر خيارًا...',
  label,
  className,
  disabled = false,
}: any) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState(''); // For managing search input
  console.log({ options, value, onValueChange, placeholder, label, className });

  // Filter options based on the search input
  const filteredOptions = React.useMemo(() => {
    if(options?.length === 0) return [];
    return options?.filter((option) =>
      option?.label?.toLowerCase()?.includes(search?.toLowerCase())
    );
  }, [search, options]);

  const handleSelect = (currentValue) => {
    if (currentValue !== value) {
      onValueChange(currentValue); // Update value if it's different
    }
    setOpen(false); // Close the popover
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled={disabled} asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="opacity-50 mr-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            {/* Search input */}
            <CommandInput
              placeholder="ابحث عن خيار..."
              className="h-9"
              value={search}
              onValueChange={setSearch} // Update search value
            />
            <CommandList>
              {filteredOptions?.length > 0 ? (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      disabled={disabled}
                      key={option.value}
                      onSelect={() => handleSelect(option.value)} // Trigger selection
                      className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 data-[disabled]:pointer-events-auto"
                    >
                      {option.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>لا يوجد نتائج.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

{
  /* <CustomSelect
  className="w-[220px]"
  placeholder="اسم الصنف"
  options={getAllPro?.data?.map((item) => ({
    value: item.item_id,
    label: item.name,
  }))}
  onValueChange={(value) => handleItemChange(index, 'item', value)}
  label="اسم الصنف"
  value={items[index]?.item}
/>; */
}
