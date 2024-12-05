import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";

const FormReason = () => {
  const { register } = useFormContext();
  return (
    <div className="flex items-center gap-5">
      <Input label="Name" required {...register("name")} />
      <Input label="Name Localized" {...register("name_localized")} />
    </div>
  );
};

export default FormReason;
