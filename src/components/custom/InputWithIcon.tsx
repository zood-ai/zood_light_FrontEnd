import React from 'react';
import { Input } from '../ui/input';
import useDirection from '@/hooks/useDirection';

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
  const isRtl = useDirection();
  return (
    <div className={`flex gap-2   rounded  border-gray-200 ${className} `}>
      <div dir="" className="w-full flex flex-col">
        {label && (
          <div className="self-start text-sm font-medium text-right text-secText mb-xs">
            {label}
          </div>
        )}
        <div className="relative flex items-end">
          <Input
            type={type}
            {...props}
            style={{
              width: width ? width : '100%',
            }}
            placeholder={placeholder}
            className={`w-full text-mainText ${
              iconSrc && 'ps-10  w-full'
            } ${inputClassName}`}
          />
          {iconSrc && (
            <img
              loading="lazy"
              src={iconSrc}
              alt=""
              style={{
                left: isRtl ? 'unset' : '10px',
                right: !isRtl ? 'unset' : '10px',
              }}
              className={`object-contain  shrink-0 my-auto text-secText aspect-square w-[18px] absolute  ${
                label ? 'top-[25%]' : 'top-[20%]'
              }`}
            />
          )}

          <div className="relative">
            {iconSrcLeft && (
              <div
              style={{
                left: !isRtl ? 'unset' : '10px',
                right: !isRtl ? '10px' : 'unset',
              }}
                className={`absolute inset-y-0 flex items-center text-gray-400 ${
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
