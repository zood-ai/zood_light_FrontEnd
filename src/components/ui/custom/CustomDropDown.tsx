// UI components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
import { CustomDropDownProps } from "@/types/global.type";

const CustomDropDown = ({
  options,
  className,
  defaultValue,
  onValueChange,
  disabled,
}: CustomDropDownProps) => {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-auto h-auto py-3 focus:ring-0 focus:ring-offset-0">
        {defaultValue}
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CustomDropDown;
