import * as React from "react";

import { cn } from "@/utils";
import SearchIcon from "@/assets/icons/SearchIcon";
import { Label } from "./label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  searchIcon?: boolean;
  label?: string;
  defaultValue?: string | number;
  textLeft?: string;
  textRight?: string;
  required?: boolean;
  type?: "text" | "number" | "date" | "password" | "search";
  errorText?: JSX.Element;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      placeholder,
      label,
      searchIcon = false,
      textLeft,
      textRight,
      defaultValue,
      required,
      errorText,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col relative">
        {label && (
          <div className="mt-[16px]">
            <Label>{label}</Label>
            {required && <span className="text-warn text-[16px]">*</span>}
          </div>
        )}

        <div className={`  rounded-md ${label ? "mt-2" : ""}`}>
          {searchIcon && (
            <div className=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-[8px]">
              <SearchIcon />
            </div>
          )}
          {textLeft && (
            <div className="pointer-events-none  -bottom-[2px] absolute -translate-y-1/2 left-3 flex items-center  text-gray-400 text-[12px] ">
              {textLeft}
            </div>
          )}
          <input
            type={type}
            value={defaultValue}
            className={cn(`
              flex h-[32px] w-[208px] rounded-[4px] border border-input bg-background py-1.5  ${
                searchIcon ? "px-10" : textLeft ? "pl-[35px]" : "px-[12px]"
              }
              
                pt-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400  placeholder:text-[14px] 
              placeholder:font-medium focus-visible:outline-[#91DFF2]   outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50
              ${className}
            `)}
            placeholder={placeholder}
            ref={ref}
            {...props}
          />
          {textRight && (
            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center px-1.5 text-[#000000] text-[12px] bg-[#EDF2F7] rounded-tr-[4px] 
            rounded-br-[4px] min-w-[35px]
            border-input border
            "
            >
              {textRight}
            </div>
          )}
        </div>
        {errorText && <>{errorText}</>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
