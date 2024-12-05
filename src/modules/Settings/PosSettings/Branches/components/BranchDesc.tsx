import CustomFileImage from "@/components/ui/custom/CustomFileImage";
import FolderIcon from "@/assets/icons/Folder";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { TimeOptions } from "@/constants/dropdownconstants";
import useCommonRequests from "@/hooks/useCommonRequests";
import useBranchesHttps from "../queriesHttp/useBranchesHttps";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { set } from "date-fns";
const BranchDesc = () => {
  const { register } = useFormContext();
  const { taxGroupsSelect, istaxGroupsLoading } = useCommonRequests({
    getTaxGroups: true,
  });
  const { generateRef, isLoadingGenerate } = useBranchesHttps({
    setReference: (value) => {
      setValue("reference", value);
    },
  });
  const { setValue, getValues, watch } = useFormContext();

  return (
    <div className="border-b border-input">
      <CustomFileImage fileParam="image" defaultValue={getValues("image")} />

      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <FolderIcon />
        </div>
        <h3 className="font-bold text-[16px] py-[24px]">Branch Desc</h3>
      </div>
      <div className="flex gap-3">
        <Input
          label="Name"
          placeholder=" Branch name"
          {...register("name")}
          required
          className="w-[268px]"
        />
        <Input
          label="Name Localized"
          placeholder=" Branch name localized"
          {...register("name_localized")}
          className="w-[268px]"
        />
      </div>
      <div className="flex gap-3 items-center">
        <Input
          label="Sku"
          placeholder="Generate Sku"
          {...register("reference")}
          required
          disabled
          className="w-[268px]"
          value={getValues("reference") || ""}
        />
        <Button
          loading={isLoadingGenerate}
          variant="line"
          className=" mt-10"
          type="button"
          onClick={() => {
            generateRef();
          }}
        >
          Generate
        </Button>
      </div>
      <div className="flex gap-3 items-center">
        <CustomSelect
          label="Tax group"
          options={taxGroupsSelect}
          loading={istaxGroupsLoading}
          placeHolder="Choose one"
          defaultValue={watch("tax_group_id")}
          onValueChange={(e) => {
            setValue("tax_group_id", e);
          }}
          width="w-[268px]"
        />

        <Input
          label="Tax registration name"
          className="w-[268px]"
          {...register("tax_name")}
        />
      </div>
      <div className="flex gap-3 items-center">
        <Input
          label="Tax number"
          className="w-[268px]"
          {...register("tax_number")}
        />
        <Input
          label="Phone"
          className="w-[268px]"
          type="number"
          value={getValues("phone")}
          onChange={(e) => {
            const { value } = e.target;
            setValue("phone", +value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
      </div>
      <Input label="Address" className="w-[268px]" {...register("address")} />
      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-2">
          <CustomSelect
            label="Opening from"
            options={TimeOptions}
            placeHolder="Choose one"
            width="w-[130px] "
            defaultValue={watch("opening_from")}
            onValueChange={(e) => {
              setValue("opening_from", e);
            }}
          />
          <CustomSelect
            label="Opening to"
            options={TimeOptions}
            placeHolder="Choose one"
            width="w-[130px] "
            defaultValue={watch("opening_to")}
            onValueChange={(e) => {
              setValue("opening_to", e);
            }}
          />
        </div>
        <CustomSelect
          label="End of day"
          options={TimeOptions}
          placeHolder="Choose one"
          width="w-[268px] "
          defaultValue={watch("inventory_end_of_day_time")}
          onValueChange={(e) => {
            setValue("inventory_end_of_day_time", e);
          }}
        />
      </div>
      <div className="flex gap-3 items-center">
        <Input
          label="Latitude"
          type="number"
          className="w-[268px]"
          value={getValues("latitude")}
          onChange={(e) => {
            const value = e.target.value;
            const numberValue = value ? Number(value) : undefined;

            if (
              numberValue !== undefined &&
              !isNaN(numberValue) &&
              Number.isFinite(numberValue)
            ) {
              setValue("latitude", numberValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
            } else {
              setValue("latitude", 0, {
                shouldValidate: false,
              });
            }
          }}
        />
        <Input
          label="Longitude"
          className="w-[268px]"
          type="number"
          value={getValues("longitude")}
          onChange={(e) => {
            const value = e.target.value;
            const numberValue = value ? Number(value) : undefined;

            if (
              numberValue !== undefined &&
              !isNaN(numberValue) &&
              Number.isFinite(numberValue)
            ) {
              setValue("longitude", numberValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
            } else {
              setValue("longitude", 0, {
                shouldValidate: false,
              });
            }
          }}
        />
      </div>

      <Input
        label="Receipt header"
        className="w-full"
        {...register("receipt_header")}
      />
      <Input
        label="Receipt footer"
        className="w-full mb-5"
        {...register("receipt_footer")}
      />
    </div>
  );
};

export default BranchDesc;
