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
  iconSrcLeft?: string
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
        <div className="relative">
          <Input
          type={type}
            {...props}
            placeholder={placeholder}
            className={` w-[${
              width ? width :  '327px'
            }] text-right text-mainText   ${
              iconSrc && 'ps-10  w-[327px]'
            } ${inputClassName}`}
          />
          {iconSrc && (
            <img
              loading="lazy"
              src={iconSrc}
              alt=""
              className={`object-contain shrink-0 my-auto text-secText aspect-square w-[18px] absolute right-3 ${
                label ? 'top-[25%]' : 'top-[20%]'
              } `}
            />
          )}
          {iconSrcLeft && (
            <div
              // loading="lazy"
              // src={iconSrcLeft}
              // alt=""
              className={`w-[18px] absolute left-3 text-secText ${
                label ? 'top-[14%]' : 'top-[20%]'
              } `}
            >{iconSrcLeft}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IconInput;
