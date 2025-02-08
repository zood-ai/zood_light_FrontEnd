import DollarIcon from "@/assets/icons/Dollar";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";

const Payroll = () => {
  const { register, watch, setValue, formState, trigger } = useFormContext();

  return (
    <>
      <div className="flex  items-center gap-3 mt-[30px] mb-[13px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]">
          <DollarIcon />
        </div>
        <h3 className="font-bold text-[16px]">Payroll</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Iban"
            className="w-[250px]"
            placeholder="Enter IBAN"
            type="text"
            value={watch("iban")}
            onChange={(e) => {
              setValue("iban", e.target.value, { shouldValidate: true });
              trigger("iban");
            }}
            errorText={
              <p className="text-warn text-[10px] w-[140px]">
                {typeof formState?.errors?.iban?.message === "string"
                  ? formState.errors.iban.message
                  : ""}
              </p>
            }
          />
         
        </div>
        <div>
          <Input
            label="SWIFT/BIC"
            className="w-[250px]"
            type="text"
            placeholder="Enter SWIFT/BIC"
            value={watch("swift")}
            onChange={(e) => {
              setValue("swift", e.target.value, { shouldValidate: true });
              trigger("swift");
            }}
            errorText={
              <p className="text-warn text-[10px] w-[140px]">
                {typeof formState?.errors?.swift?.message === "string"
                  ? formState.errors.swift.message
                  : ""}
              </p>
            }
          />
        </div>
      </div>
    </>
  );
};

export default Payroll;
