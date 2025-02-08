import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Label } from "@/components/ui/label";
import { TimeOptions } from "@/constants/dropdownconstants";
import PopularShiftInput from "@/modules/Schedulling/Schedule/components/PopularShiftInput";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const Availability = () => {
  const { setValue, watch } = useFormContext();
    const [focusedInput, setFocusedInput] =useState("");
  
  return (
    <div className="flex flex-col gap-[16px]">
      {watch("availability")?.map((item, index) =>
      (

        <div className="flex items-center gap-[56px]">
          <p className="w-11">{item?.day}</p>
          <div>
        
            <div className="flex items-center gap-2">
              <p className="text-[#72727B]">From</p>
              <PopularShiftInput
                className="w-[50px] px-1 text-center h-[30px] "
                name={`availability.${index}.from`}
                formkey={`availability.${index}.from`}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                disabled={!watch(`availability.${index}.is_available`)}
                
              />
              <p className="text-[#72727B]">to</p>
              <PopularShiftInput
                className="w-[50px] px-1 text-center h-[30px] "
                name={`availability.${index}.to`}
                formkey={`availability.${index}.to`}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                disabled={!watch(`availability.${index}.is_available`)}

              />
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Checkbox
              checked={!watch(`availability.${index}.is_available`)}
              onCheckedChange={(e) => {
                setValue(`availability.[${index}].is_available`, !e, { shouldValidate: true })
              }
              } />
            <Label>Not available</Label>
          </div>
        </div>
      ))}




    </div>
  );
};

export default Availability;
