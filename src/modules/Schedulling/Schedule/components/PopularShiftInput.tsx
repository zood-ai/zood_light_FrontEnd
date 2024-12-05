import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

const PopularShiftInput = ({
  name,
  formkey,
  setFocusedInput,
  className = "w-[45px]",
  focusedInput,
}: {
  name: string;
  formkey: string;
  setFocusedInput?: (name: string) => void;
  className?: string;
  focusedInput?: string;
}) => {
  const { setValue, watch } = useFormContext();

  const handleKeyDown = (e) => {
    // Prevent dot (.) and minus (-)
    if (e.key === "." || e.key === "-") {
      e.preventDefault();
    }
  };

  const calcShiftTime = (startTime: string, endTime: string, name: string) => {
    if (startTime.length === 1) {
      startTime = `0${startTime}`;
    }
    if (endTime.length === 1) {
      endTime = `0${endTime}`;
    }
    if (!/^\d+$/.test(startTime) || +startTime > 23 || !startTime) {
      startTime = "00";
    }
    if (!/^\d+$/.test(endTime) || +endTime > 59 || !endTime) {
      endTime = "00";
    }
    if (name === "time_to") {
      setValue(formkey, `${startTime}:${endTime}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue(formkey, `${startTime}:${endTime}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleAddShift = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // check if the value contain a : or not
    if (value.includes(":")) {
      let [startTime, endTime] = value.split(":");
      calcShiftTime(startTime, endTime, e.target.name);
    } else {
      let startTime = e.target.value.slice(0, 2);
      let endTime = e.target.value.slice(2, 4);
      calcShiftTime(startTime, endTime, e.target.name);
    }
  };
  return (
    <Input
      type="text"
      className={className}
      autoFocus={focusedInput === name}
      name={name}
      onChange={(e) => {
        setValue(formkey, e.target.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }}
      onBlur={handleAddShift}
      onKeyDown={handleKeyDown}
      value={watch(formkey)}
      onClick={(e) => {
        e.stopPropagation();
        setFocusedInput?.(name);
      }}
    />
  );
};

export default PopularShiftInput;
