import FolderIcon from "@/assets/icons/Folder";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";

const EmployeeBranch = () => {
  const { register, setValue } = useFormContext();

  return (
    <>
      {" "}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <FolderIcon />
        </div>
        <h3 className="font-bold text-[16px] py-[24px]">Branch Employee</h3>
      </div>
      <div className="flex gap-3">
        <Input
          label="Number of employee"
          type="number"
          onChange={(e) => {
            setValue("employee_count", +e.target.value);
          }}
          className="w-[164px]"
          required
        />
        <Input
          label="Cost of employee"
          type="number"
          onChange={(e) => {
            setValue("employee_cost", +e.target.value);
          }}
          textLeft="SAR"
          className="w-[164px]"
          required
        />
      </div>
    </>
  );
};

export default EmployeeBranch;
