import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Switch } from "@/components/ui/switch";
import React from "react";

const Permissions = () => {
  return (
    <>
      <CustomSelect options={[]} label="Permission level" />
      <div className="flex flex-col gap-3 bg-popover px-[16px] py-[10px] mt-[16px] rounded-[4px]">
        <div className="border-b border-white py-[10px] flex items-center justify-between">
          Can access inventory management features
          <Switch />
        </div>
        <div className=" flex items-center justify-between">
          Can access inventory management features
          <Switch />
        </div>
      </div>
    </>
  );
};

export default Permissions;
