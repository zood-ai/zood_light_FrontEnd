import LegalIcon from "@/assets/icons/Legal";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contractTypes, visaTypes } from "@/constants/dropdownconstants";
import moment from "moment";
import { useFormContext } from "react-hook-form";

const Legal = () => {
  const {  watch, setValue } = useFormContext();
  const emergencyFields:{
    label:string,
    placeholder:string,
    name:string,
    type:"text"|"number"
  }[] = [
    {
      label: "Name of emergency contact",
      placeholder: "Name of emergency contact",
      name: "contact_name",
      type: "text",
    },
    {
      label: "Relationship",
      placeholder: "Relationship",
      name: "contact_relation",
      type: "text",
    },
    {
      label: "Phone",
      placeholder: "Phone",
      name: "contact_phone",
      type: "number",

    },
  ];

  
  return (
    <section>
      <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]">
          <LegalIcon />
        </div>
        <h3 className="font-bold text-[16px]">Legal</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CustomSelect
              options={contractTypes}
              required
              label="Contract type"
              width="w-[165px]"
              value={watch("contract")}
              onValueChange={(e) => {
                if (e == "null") {
                  setValue("contract", "");
                  return;
                }
                setValue("contract", e);
              }}
            />
            <div className="mt-[43px] ">
              <Input
                textRight="hrs"
                className="w-[75px]"
                value={watch("contract_hrs")}
                type="number"
                min={1}
                max={168}
                step={0.1}
                onChange={(e: any) => {
                  if (+e.target.value > 168) {
                    setValue("contract_hrs", 168, { shouldValidate: true });
                    return;
                  }
                  setValue("contract_hrs", +e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          </div>
          {/* visa */}
          <div>
            <CustomSelect

              options={visaTypes}
              value={watch("visa_type")}
              label="Visa type"
              width="w-[250px]"
              onValueChange={(e) => {
                if (e == "null") {
                  setValue("visa_type", "");
                  return;
                }
                setValue("visa_type", e);
              }}
            />

            <CustomInputDate
              required
              
              onSelect={(e) => {
                setValue("visa_date", moment(e).format("YYYY-MM-DD"), {
                  shouldValidate: true,
                });
              }}
              defaultValue={watch("visa_date")==null?moment(new Date()).format("YYYY-MM-DD"):moment(watch("visa_date")).format("YYYY-MM-DD")}
              width="w-[250px] "
              className="mt-2"
            />
            <div className="flex items-center gap-x-[20px] mt-[10px]">
              <Checkbox
              disabled={!watch("visa_type")}
                checked={!!watch(`visa_verified`)}
                onCheckedChange={(e) => {
                  setValue(`visa_verified`, e, { shouldValidate: true });
                }}
              />
              <Label className="text-[14px] text-[#3F474B] ">
                Visa document verified
              </Label>
            </div>
          </div>
        </div>
        <div>
          {/* emergency contact */}
          <label className="block text-sm font-medium mb-2 mt-3">
            Emergency Contact
          </label>
          <div className="flex flex-col gap-[6px] mt-3">
            {emergencyFields.map((field, index) => (
              <div key={field.name}>
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-[250px] p-2 border rounded "
                  aria-label={field.label}
                  value={watch(`${field.name}`)}
                  onChange={(e) => {
                    setValue(`${field.name}`, e.target.value,{shouldValidate:true});
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Legal;
