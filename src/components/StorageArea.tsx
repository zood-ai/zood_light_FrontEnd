import StorageIcon from "@/assets/icons/Storage";
import { FormItem } from "./ui/form";
import CustomSelect from "./ui/custom/CustomSelect";
import { Controller, useFormContext } from "react-hook-form";
import useCommonRequests from "@/hooks/useCommonRequests";

const StorageArea = () => {
  const { setValue, getValues, watch } = useFormContext();
  const { storageAreasSelect } = useCommonRequests({
    getStorageAreas: true,
    filterByBranch: "type=all",
  });

  const filtredStorageAreas = storageAreasSelect?.filter(
    (el: { value: string }) => !watch("storage_areas").includes(+el.value)
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-[13px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <StorageIcon />
        </div>
        <h3 className="font-bold text-[16px]">Storage area</h3>
      </div>
      <div className="border p-4 flex justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          {watch("storage_areas")?.map((item: any) => (
            <div
              key={item}
              className="flex gap-1 w-fit p-2 h-[30px] rounded-[4px] items-center border-[#91DFF2] bg-muted-foreground justify-center"
            >
              {
                storageAreasSelect?.find(
                  (el: { value: string }) => +el.value === item
                )?.label
              }
              <span
                className="cursor-pointer"
                onClick={() => {
                  setValue(
                    `storage_areas`,
                    getValues(`storage_areas`).filter(
                      (id: string) => id !== item
                    )
                  );
                }}
              >
                x
              </span>
            </div>
          ))}
        </div>
        <FormItem className="">
          <Controller
            name={`storage_areas`}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  options={filtredStorageAreas}
                  placeHolder="Assign Storage"
                  displayValue={false}
                  onValueChange={(e) => {
                    if (e === "null") {
                      return;
                    }
                    if (
                      getValues(`storage_areas`).findIndex(
                        (el: number) => el === +e
                      ) === -1
                    ) {
                      const newValue = [...value, +e];
                      onChange(newValue);
                    }
                  }}
                />
              );
            }}
          />
        </FormItem>
      </div>
    </>
  );
};

export default StorageArea;
