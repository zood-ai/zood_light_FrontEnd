import React, { useState, useRef } from 'react';
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
  onValueChange: (value: string) => void;
  label?: string;
}

export const SelectCompInput: React.FC<any> = ({
  options,
  placeholder = 'Select an option',
  onValueChange,
  className,
  label,
  ...props
}) => {
  const [isInputActive, setIsInputActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isRtl = useDirection();

  const handleInputFocus = () => {
    setIsInputActive(true);
    // onValueChange('');
    // setInputValue('');
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    onValueChange('');
    setInputValue(value);
  };

  const handleValueChange = (value: string) => {
    if (value === 'clear') {
      onValueChange('');
      setInputValue('');
    } else {
      onValueChange(value);
      setInputValue('');
    }
    // setIsInputActive(false); // Reset to dropdown mode after selection
  };

  const openDropdown = () => {
    if (inputRef.current) inputRef.current.blur();
    setIsInputActive(false);
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-secText">
          {label}
        </label>
      )}

      <Select
        {...props}
        onValueChange={handleValueChange}
        dir={isRtl ? 'rtl' : 'ltr'}
        defaultValue={inputValue == '' && ''}

      >
        <SelectTrigger>
          <SelectValue placeholder={inputValue == '' && placeholder} />
        </SelectTrigger>
        <SelectContent dir={isRtl ? 'rtl' : 'ltr'}>
          <SelectItem value="clear">
            {inputValue == '' && placeholder}
          </SelectItem>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Transparent Input Overlay */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onFocus={handleInputFocus}
        onChange={handleInputChange}
        // placeholder={placeholder}
        className="absolute translate-y-3 inset-0 w-[80%] h-full bg-transparent border-none focus:outline-none"
        style={{
          zIndex: 10, // Ensures input stays above the dropdown
          paddingRight: '1rem', // Adjust padding to align text with dropdown (modify as needed)
        }}
      />
    </div>
  );
};
