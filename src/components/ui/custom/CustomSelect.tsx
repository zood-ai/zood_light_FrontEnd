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
import { Label } from "../label";
import { Input } from "../input";
import { useMemo, useState } from "react";

const CustomSelect = ({
  options,
  placeHolder,
  onValueChange,
  removeDefaultOption = false,
  label,
  defaultValue,
  name,
  disabled,
  required = false,
  value,
  width = "w-[180px]",
  height,
  loading,
  displayValue = true,
  optionDefaultLabel = "Choose one",
  showSearch = true,
}: CustomDropDownProps) => {
  const optionDefault = { label: optionDefaultLabel, value: "null" };
  const isDefaultSelected = value === optionDefault.value || !value;

  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search) return options || [];
    return (
      options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      ) || []
    );
  }, [search, options?.length]);

  const AllOptions = removeDefaultOption
    ? filteredOptions
    : [optionDefault, ...filteredOptions];

  return (
    <div className="flex flex-col">
      <div className="flex">
        {label && <Label className="mt-[16px] mb-3">{label}</Label>}{" "}
        {required && <span className="mt-3 text-warn">*</span>}
      </div>

      {loading ? (
        <Select disabled>
          {" "}
          <SelectTrigger className={`${width} ${height}`}>
            <SelectValue placeholder={"loading.."} />
          </SelectTrigger>
        </Select>
      ) : (
        <Select
          value={value}
          onValueChange={onValueChange}
          defaultValue={defaultValue}
          name={name}
          disabled={disabled}
        >
          <SelectTrigger
            className={`${width} ${height} ${
              isDefaultSelected ? "text-gray-400" : "text-black"
            }`}
          >
            {displayValue ? (
              <SelectValue
                placeholder={
                  isDefaultSelected ? optionDefault.label : placeHolder
                }
              />
            ) : (
              placeHolder
            )}
          </SelectTrigger>

          <SelectContent className={`bg-white ${width}`}>
            <>
              {showSearch && (
                <Input
                  searchIcon
                  type="search"
                  className="ps-8 pe-2 mx-1"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  value={search}
                />
              )}

              {filteredOptions?.length > 0 ? (
                <SelectGroup>
                  {AllOptions?.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className={`h-[25px] cursor-pointer   ${
                        option.value === "null" ? "text-gray-400" : "text-black"
                      }`}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ) : (
                <SelectGroup className="text-center text-input">
                  Not Data
                </SelectGroup>
              )}
            </>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default CustomSelect;
