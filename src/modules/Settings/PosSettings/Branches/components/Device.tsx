import DeviceIcon from "@/assets/icons/Device";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { useFormContext } from "react-hook-form";
import { handleStatus } from "../helpers/helpers";

const Device = () => {
  const { getValues } = useFormContext();

  return (
    <div className="border-b border-input">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <DeviceIcon />
        </div>
        <h3 className="font-bold text-[16px] py-[24px]">Devices</h3>
      </div>

      {getValues("devices")?.length ? (
        <div className="px-[40px] pb-5">
          <div className="flex justify-between items-center font-bold pb-[8px]">
            <p>Device</p>
            <p className="px-7">Type</p>
            <p>Status</p>
            <p>Reference</p>
          </div>
          {getValues("devices")?.map(
            (d: {
              name: string;
              reference: string;
              in_use: number;
              type: number;
            }) => (
              <div className="flex justify-between items-center pb-5">
                <p className="w-[90px]">{d?.name}</p>
                <p className="w-[70px]"> {handleStatus(d?.type)}</p>
                <p className="w-[80px]">
                  <Badge variant={d?.in_use == 0 ? "danger" : "success"}>
                    {d?.in_use == 0 ? "Unused" : "Used"}
                  </Badge>
                </p>
                <p>{d?.reference}</p>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center py-12">
          You can add devices to this branch from device.
        </div>
      )}
    </div>
  );
};

export default Device;
