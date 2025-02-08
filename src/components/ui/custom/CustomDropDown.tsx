import { CustomDropDownProps } from "@/types/global.type";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import ArrowFillIcon from "@/assets/icons/ArrowFill";

const CustomDropDown = ({
  options,
  className,
  defaultValue,
  onValueChange,
  placeHolder,
  disabled,
  showIcon = false,
}: CustomDropDownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex relative items-center justify-between border-gray-200 border-[1.5px] p-3 bg-white py-[4px] text-gray-400 rounded-[3px] cursor-pointer ${className}`}
        >
          {placeHolder ?? defaultValue}
          {showIcon && <ArrowFillIcon />}
        </div>
      </DropdownMenuTrigger>

      {options?.length ? (
        <DropdownMenuContent
          className={` bg-white p-2 absolute w-auto z-50 top-2 space-y-2 right-0 text-black  ${
            options?.length > 8 ? "h-[180px]" : "h-auto"
          } overflow-y-scroll ${className}`}
        >
          {options?.map((item: any) => (
            <DropdownMenuCheckboxItem
              onClick={() => onValueChange && onValueChange(item.value)}
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <p className="mr-5 text-sm">{item.label}</p>
                </div>
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent
          className={`w-auto bg-white text-center text-gray-400 py-3 ${className}`}
        >
          No Item
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default CustomDropDown;
