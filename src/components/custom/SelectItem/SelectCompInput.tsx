import React, { useState, useRef, useEffect } from 'react';
import './SelectItem.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useDirection from '@/hooks/useDirection';
import { useParams } from 'react-router-dom';
import CustomSearchInbox from '../CustomSearchInbox';
import { set } from 'zod';

interface SelectCompProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  onValueChange: (value: string) => void;
  label?: string;
}
// React.forwardRef<HTMLElement, BreadcrumbProps>
export const SelectCompInput = React.forwardRef<HTMLInputElement, any>(
  (
    {
      options,
      placeholder = 'Select an option',
      onValueChange,
      onInputFieldChange,
      className,
      label,
      value,
      directValue,
      cantDoAnything = false,
      cantType = false,
      TextDisabled = false,
      disabled = false,
      cantChoose = false,
      ...props
    },
    ref
  ) => {
    const [isInputActive, setIsInputActive] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [dropDownValue, setDropDownValue] = useState(value);
    const isRtl = useDirection();
    const params = useParams();

    const handleInputFocus = () => {
      setIsInputActive(true);
      // onValueChange('');
      // setInputValue('');
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      onValueChange('');
      setDropDownValue('');
      setInputValue(value);
    };

    useEffect(() => {
      onInputFieldChange(inputValue);
      onValueChange('');
    }, [inputValue]);

    useEffect(() => {
      setDropDownValue(value);
    }, [value]);

    return (
      <div className={className} style={{ position: 'relative' }}>
        {/* {label && (
          <label className="mb-2 block text-sm font-medium text-secText">
            {label}
          </label>
        )} */}

        <CustomSearchInbox
          options={options}
          value={dropDownValue}
          onValueChange={(value) => {
            onValueChange(value);
            setDropDownValue(value);
            // setInputValue('');
          }}
          placeholder={inputValue == '' && placeholder}
          label={label}
          className={className}
          disabled={disabled || cantChoose || cantDoAnything}
        />

        {/* <Select
          {...props}
          onValueChange={handleValueChange}
          dir={isRtl ? 'rtl' : 'ltr'}
          defaultValue={inputValue || ''}
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
        </Select> */}

        {/* Transparent Input Overlay */}
        {!disabled ? (
          <input
            ref={ref}
            type="text"
            disabled={cantType || cantDoAnything}
            defaultValue={directValue ? directValue : inputValue}
            onFocus={handleInputFocus}
            onChange={handleInputChange}
            // placeholder={placeholder}
            className="absolute translate-y-3 inset-0 w-[80%] h-full bg-transparent border-none focus:outline-none ps-4 z-[10]"
          />
        ) : (
          ''
        )}
      </div>
    );
  }
);
