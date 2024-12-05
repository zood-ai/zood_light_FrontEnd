import LegalIcon from "@/assets/icons/Legal";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contractTypes, visaTypes } from "@/constants/dropdownconstants";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useFormContext } from "react-hook-form";


const Legal = () => {
  const { register, watch, setValue } = useFormContext()

  return (
    <section>
      <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]">
          <LegalIcon />
        </div>
        <h3 className="font-bold text-[16px]">Legal</h3>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <CustomSelect options={contractTypes}
            required
            label="Contract type" width="w-[165px]"
            value={watch('contract')}
            onValueChange={(e) => {
              if (e == "null") {
                setValue('contract', "")
                return;
              }
              setValue('contract', e)
            }
            }
          />
          <div className="mt-[43px] ">
            <Input textRight="hrs" className="w-[75px]" value={watch('contract_hrs')}

              onChange={(e: any) => {
                if (+e.target.value > 168) {
                  setValue('contract_hrs', 168, { shouldValidate: true });
                  return
                }
                setValue('contract_hrs', +e.target.value, { shouldValidate: true });
              }} />
          </div>
        </div>

        <div>
          <CustomSelect options={visaTypes}
            value={watch('visa_type')}
            label="Visa type" width="w-[250px]"
            onValueChange={(e) => {
              if (e == "null") {
                setValue('visa_type', "")
                return;
              }
              setValue('visa_type', e)
            }
            } />
          <div className="flex items-center gap-x-[20px] mt-[10px]">
            <Checkbox id="terms" />{" "}
            <Label className="text-[14px] text-[#3F474B] ">
              Visa document verified
            </Label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Legal;
