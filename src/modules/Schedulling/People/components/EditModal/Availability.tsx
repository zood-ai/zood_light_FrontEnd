import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Label } from "@/components/ui/label";
import { TimeOptions } from "@/constants/dropdownconstants";
import { useFormContext } from "react-hook-form";

const Availability = () => {
  const { setValue, watch } = useFormContext();
  return (
    <div className="flex flex-col gap-[16px]">
      {watch("availability")?.map((item, index) =>
      (

        <div className="flex items-center gap-[56px]">
          <p className="w-11">{item?.day}</p>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[#72727B]">From</p>
              <CustomSelect
                options={TimeOptions}
                width="w-[76px]"
                value={watch(`availability.${index}.from`)}
                disabled={watch(`availability.${index}.is_available`)}
                onValueChange={(e) => {

                  setValue(`availability.[${index}].from`, e, { shouldValidate: true });
                }}
              />
              <p className="text-[#72727B]">to</p>

              <CustomSelect
                options={TimeOptions}
                width="w-[76px]"
                value={watch(`availability.${index}.to`)}

                disabled={watch(`availability.${index}.is_available`)}
                onValueChange={(e) => {
                  if (e == "null") {
                    setValue("to", null);
                    return;
                  }
                  setValue(`availability.[${index}].to`, e, { shouldValidate: true });
                }}
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
