import FolderIcon from "@/assets/icons/Folder";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useFormContext } from "react-hook-form";

const FormPaymentMethod = ({ isEdit }: { isEdit: boolean }) => {
  const { register, getValues, setValue } = useFormContext();

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <FolderIcon />
        </div>
        <h3 className="font-bold text-[16px] py-[24px]">Payment Methods</h3>
      </div>
      <div className="flex items-center gap-5">
        <Input label="Name" required {...register("name")} />
        <Input label="Name Localized" {...register("name_localized")} />
      </div>

      <Input
        label="Type "
        disabled
        value={
          getValues("type") == "1"
            ? "Cash"
            : getValues("type") == "2"
            ? "Card"
            : "Other"
        }
      />
      <Input label="Code " {...register("code")} />

      <div className="flex flex-col gap-3 mt-5">
        <p className="flex items-center gap-2">
          <Checkbox
            defaultChecked={!!getValues("auto_open_drawer")}
            onCheckedChange={(seleced) => {
              setValue("auto_open_drawer", +seleced);
            }}
          />
          <Label>Auto open cash</Label>
        </p>

        {isEdit && (
          <p className="flex items-center gap-2">
            <Checkbox
              defaultChecked={!!getValues("is_active")}
              onCheckedChange={(seleced) => {
                setValue("is_active", +seleced);
              }}
            />
            <Label>Active</Label>
          </p>
        )}
      </div>
    </>
  );
};

export default FormPaymentMethod;
