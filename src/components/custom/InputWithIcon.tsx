import React from 'react';
import { Input } from '../ui/input';

interface SearchInputProps {
  placeholder?: string;
  iconSrc?: string;
  label?: string;
  width?: string;
  className?: string;
  inputClassName?: string;
  type?: string;
  iconSrcLeft?: string;
}

const IconInput: React.FC<any> = ({
  placeholder = '',
  iconSrc,
  label,
  width,
  className,
  inputClassName,
  type,
  iconSrcLeft,
  ...props
}) => {
  return (
    <div className={`flex gap-2   rounded  border-gray-200 ${className} `}>
      <div className="w-full">
        {label && (
          <div className="self-start text-sm font-medium text-right text-secText mb-xs">
            {label}
          </div>
        )}
        <div className="relative  flex items-end">
          <Input
            type={type}
            {...props}
            placeholder={placeholder}
            className={`w-full text-right text-mainText ${
              iconSrc && 'ps-10  w-full'
            } ${inputClassName}`}
          />
          {iconSrc && (
            <img
              loading="lazy"
              src={iconSrc}
              alt=""
              className={`object-contain  shrink-0 my-auto text-secText aspect-square w-[18px] absolute right-3  ${
                label ? 'top-[25%]' : 'top-[20%]'
              }`}
            />
          )}

          <div className="relative">
            {iconSrcLeft && (
              <div
                className={`absolute inset-y-0 left-3 flex items-center text-gray-400 ${
                  label ? 'top-[-36px]' : 'top-[-36px]'
                }`}
              >
                {iconSrcLeft}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconInput;
