import FolderIcon from "@/assets/icons/Folder";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import useCommonRequests from "@/hooks/useCommonRequests";
import { Button } from "@/components/ui/button";
import useDevicesHttps from "../queriesHttp/useDevicesHttps";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { deviceType } from "../helpers";
import { useEffect } from "react";
const DeviceDesc = ({ isEdit }: { isEdit: boolean }) => {
  const { register, setValue, getValues } = useFormContext();

  const { branchesSelect, isBranchesLoading } = useCommonRequests({
    getBranches: true,
  });
  const { generateRef, isLoadingGenerate } = useDevicesHttps({
    setReference: (value) => {
      setValue("reference", value);
    },
  });

  useEffect(() => {
    if (!isEdit) {
      generateRef();
    }
  }, []);

  return (
    <div className="">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <FolderIcon />
        </div>
        <h3 className="font-medium text-textPrimary text-[16px] py-[16px]">
          Desc
        </h3>
      </div>
      <div className="flex gap-12 items-center">
        <Input
          label="Name"
          {...register("name")}
          required
          className="w-[268px]"
        />
        <Input
          label="Name Localized"
          {...register("name_localized")}
          className="w-[268px]"
        />
      </div>
      <div className="flex gap-12 items-center">
        <CustomSelect
          label="Device type"
          options={deviceType}
          required
          width="w-[268px]"
          placeHolder="Choose one"
          defaultValue={String(getValues("type"))}
          onValueChange={(e) => {
            setValue("type", +e, { shouldValidate: true, shouldDirty: true });
          }}
        />
        <CustomSelect
          options={branchesSelect}
          loading={isBranchesLoading}
          label="Branch"
          placeHolder="Choose one"
          defaultValue={getValues("branch_id")}
          onValueChange={(e) => {
            setValue("branch_id", e, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          width="w-[268px]"
          required
        />
      </div>
      <div className="flex gap-3 items-center">
        <Input
          label="Reference"
          placeholder="Generate Reference"
          {...register("reference")}
          required
          disabled
          className="w-[127px]"
        />
        <Button
          loading={isLoadingGenerate}
          variant="line"
          type="button"
          className=" mt-10"
          onClick={() => {
            generateRef();
          }}
        >
          Generate
        </Button>
      </div>
    </div>
  );
};

export default DeviceDesc;
