import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import { TimeOptions } from "@/constants/dropdownconstants";
import { useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/guards/axiosInstance";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useWarehouseHttp from "../queriesHttp/useWarehouseHttp";

export const CreateModal = ({
  inventory_end_of_day_time,
}: {
  inventory_end_of_day_time: string;
  referenceProp: string;
}) => {
  const { register, setValue, watch } = useFormContext();
  const { createReference, isPendingReference } = useWarehouseHttp({
    setReference: (value) => {
      setValue("reference", value);
    },
  });

  return (
    <div className="mb-[24px]">
      <div className="flex gap-[20px]">
        <Input
          label="Name"
          placeholder="Enter Name"
          {...register(`name`)}
          className="w-[268px]"
          required
        />
        <Input
          label="Name localized"
          {...register(`name_localized`)}
          name="name_localized"
          placeholder="Enter Name Localized"
          className="w-[268px]"
        />
      </div>
      <CustomSelect
        options={TimeOptions}
        label="Inventory end of day"
        value={watch("inventory_end_of_day_time")}
        onValueChange={(e) => {
          if (e == "null") {
            setValue("inventory_end_of_day_time", "00:00", {
              shouldValidate: true,
              shouldDirty: true,
            });
          } else {
            setValue("inventory_end_of_day_time", e, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        }}
        width="w-[268px]"
      />
      <div className="flex">
        <Input
          label="Reference"
          className="w-[130px]"
          disabled
          defaultValue={watch("reference")}
          {...register("reference")}
        />
        <Button
          variant="line"
          className="mt-10"
          loading={isPendingReference}
          onClick={() => {
            createReference();
          }}
          type="button"
        >
          Generate
        </Button>
      </div>
    </div>
  );
};
