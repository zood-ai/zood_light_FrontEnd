import TagIcon from "@/assets/icons/Tag";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { FormItem } from "@/components/ui/form";
import useCommonRequests from "@/hooks/useCommonRequests";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const Tags = () => {
  const { tagsSelect, isFetchingTags } = useCommonRequests({ typeTag: "2" });
  const { getValues, watch, setValue } = useFormContext();
  console.log(watch("tags"));

  return (
    <div className="border-b border-input">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-popover-foreground">
          <TagIcon />
        </div>
        <h3 className="font-bold text-[16px] py-[24px]">Tags</h3>
      </div>

      <div className="border p-4 flex justify-between gap-2 mb-5">
        <div className="flex gap-2 flex-wrap">
          {!isFetchingTags && (
            <>
              {watch("tags")?.map((item: any) => (
                <div
                  key={item}
                  className="flex gap-1 w-fit p-2 h-[30px] rounded-[4px] items-center border-[#91DFF2] bg-muted-foreground justify-center"
                >
                  {
                    tagsSelect?.find(
                      (el: { value: string }) => el.value === item?.id
                    )?.label
                  }
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setValue(
                        `tags`,
                        getValues(`tags`).filter((id: string) => id !== item)
                      );
                    }}
                  >
                    x
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
        <FormItem className="">
          <Controller
            name={`tags`}
            render={({ field }) => {
              return (
                <CustomSelect
                  options={tagsSelect}
                  placeHolder="Assign Tags"
                  loading={isFetchingTags}
                  onValueChange={(e) => {
                    const newValue =
                      field.value !== undefined
                        ? [...field.value, { id: e }]
                        : [{ id: e }];
                    field.onChange(newValue);
                    // setValue('tags', newValue)

                    // watch(`tags`).filter(
                    //     (id: string) => id !== e
                    // )
                  }}
                  value={getValues(`tags.${field.value?.length - 1}.id`)}
                  defaultValue={getValues(`tags.${field.value?.length - 1}.id`)}
                />
              );
            }}
          />
        </FormItem>
      </div>
    </div>
  );
};

export default Tags;
