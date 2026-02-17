import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';

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
import { useTranslation } from 'react-i18next';

export default function CustomSearchInbox({
  options,
  value,
  directValue = null,
  onValueChange,
  placeholder = 'CHOOSE_A_CHOOSE',
  label,
  className,
  triggerClassName = '',
  hideChevron = false,
  disabled = false,
  footerActions = [],
}: any) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState(''); // For managing search input
  const { t } = useTranslation();

  // Filter options based on the search input
  const filteredOptions = React.useMemo(() => {
    if (options?.length === 0) return [];
    return options?.filter((option) =>
      option?.label?.toLowerCase()?.includes(search?.toLowerCase())
    );
  }, [search, options]);

  const handleSelect = (currentValue) => {
    setOpen(false); // Close the popover
    // Close popover first to avoid aria-hidden/focus conflicts with dialogs.
    if (currentValue !== value) {
      window.setTimeout(() => onValueChange(currentValue), 0);
    }
  };

  const handleFooterAction = (action: any) => {
    if (action?.disabled || disabled) return;
    setOpen(false);
    if (typeof action?.onClick === 'function') {
      window.setTimeout(() => action.onClick(), 0);
    }
  };
  // if (options?.length === 0 || !options) return null;

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
            className={cn('w-full justify-between', triggerClassName)}
          >
            {directValue
              ? directValue
              : value
              ? options?.find((option) => option?.value === value)?.label
              : placeholder
            ? t(placeholder)
            : ''}
          {!hideChevron && <ChevronDown className="h-4 w-4 opacity-50 ms-auto" />}
        </Button>
      </PopoverTrigger>
        <PopoverContent className="w-full flex-grow p-0">
          <Command>
            {/* Search input */}
            <CommandInput
              placeholder={t(placeholder)}
              className="h-9"
              value={search}
              onValueChange={setSearch} // Update search value
            />
            <CommandList>
              {filteredOptions?.length > 0 ? (
                <CommandGroup>
                  {filteredOptions?.map((option) => (
                    <CommandItem
                      disabled={disabled}
                      key={option?.value}
                      onSelect={() => handleSelect(option?.value)} // Trigger selection
                      className="cursor-pointer hover:bg-gray-100 active:bg-gray-200 data-[disabled]:pointer-events-auto"
                    >
                      {option?.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          value === option?.value ? 'opacity-100' : 'opacity-0'
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
          {Array.isArray(footerActions) && footerActions.length > 0 && (
            <div
              className="grid gap-1 border-t border-mainBorder bg-background p-2"
              style={{
                gridTemplateColumns: `repeat(${Math.min(
                  Math.max(footerActions.length, 1),
                  4
                )}, minmax(0, 1fr))`,
              }}
            >
              {footerActions.map((action: any) => (
                <button
                  key={action?.id || action?.label}
                  type="button"
                  disabled={Boolean(action?.disabled) || disabled}
                  onClick={() => handleFooterAction(action)}
                  className={cn(
                    'h-8 rounded-md border border-mainBorder bg-background px-2 text-xs text-mainText hover:bg-mainBg disabled:cursor-not-allowed disabled:opacity-50',
                    action?.className || ''
                  )}
                >
                  {action?.label}
                </button>
              ))}
            </div>
          )}
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
