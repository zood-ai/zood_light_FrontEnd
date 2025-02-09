import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import { TimeOptions } from "@/constants/dropdownconstants";
import { useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/guards/axiosInstance";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useCategoryHttp from "../queriesHttp/useCategoryHttp";

export const CreateModal = () => {
  const { register, setValue, watch } = useFormContext();
  const { createReference, isPendingReference } = useCategoryHttp({
    setReference: (value) => {
      setValue("reference", value);
    },
  });

  return (
    <div className="mb-[24px]">
      <div className="flex gap-[20px]">
        <Input
          label="Name"
          {...register(`name`)}
          className="w-[268px]"
          required
        />
        <Input
          label="Name localized"
          {...register(`name_localized`)}
          name="name_localized"
          className="w-[268px]"
        />
      </div>

      <div className="flex">
        <Input
          required
          label="Reference"
          className="w-[130px]"
          {...register(`reference`)}
        />
      </div>
    </div>
  );
};
