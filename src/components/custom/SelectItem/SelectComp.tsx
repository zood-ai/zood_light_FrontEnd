import React from 'react';
import { SelectItemProps } from './SelectItem.types';
import './SelectItem.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useDirection from '@/hooks/useDirection';

interface SelectCompProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  onValueChange: (value: string) => void; // Callback to pass the selected value to the parent
  label?: string; // Optional label for the select component
}

export const SelectComp: React.FC<SelectCompProps | any> = ({
  options,
  placeholder = 'Select an option',
  onValueChange,
  className,
  label, // Destructure the label
  ...props
}) => {
  const handleValueChange = (value: string) => {
    // If the value is "clear", handle it as clearing the selection
    if (value === 'clear') {
      onValueChange(''); // Or any other indicator for no selection
    } else {
      onValueChange(value);
    }
  };

  const isRtl = useDirection();

  return (
    <div className={className}>
      {/* Render label if provided */}
      {label && (
        <label className="mb-2 block text-sm font-medium text-secText">
          {label}
        </label>
      )}

      <Select
        {...props}
        onValueChange={handleValueChange}
        dir={isRtl ? 'rtl' : 'ltr'}
        // style={{ width: '100%' }}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent dir={isRtl ? 'rtl' : 'ltr'}>
          <SelectItem value="clear">{placeholder}</SelectItem>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
