import TagIcon from "@/assets/icons/Tag";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { FormItem } from "@/components/ui/form";
import useCommonRequests from "@/hooks/useCommonRequests";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const Taxes = () => {
  const { taxesData, isFetchingTaxes } = useCommonRequests({
    getTaxes: true,
  });
  const { getValues, watch, setValue } = useFormContext();
  console.log(watch("taxes"));

  return (
    <div className="border-b border-input mt-5">
      <div className="border p-4 flex justify-between gap-2 mb-5">
        <div className="flex gap-2 flex-wrap">
          {!isFetchingTaxes && (
            <>
              {watch("taxes")?.map((item: any) => (
                <div
                  key={item}
                  className="flex gap-1 w-fit p-2 h-[30px] rounded-[4px] items-center border-[#91DFF2] bg-muted-foreground justify-center"
                >
                  {
                    taxesData?.data?.find(
                      (el: { id: string }) => el.id === item?.id
                    )?.name
                  }
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setValue(
                        `taxes`,
                        getValues(`taxes`).filter((id: string) => id !== item)
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
            name={`taxes`}
            render={({ field }) => {
              return (
                <CustomSelect
                  options={taxesData?.data?.map(
                    (tax: { name: string; id: string }) => ({
                      label: tax.name,
                      value: tax?.id,
                    })
                  )}
                  placeHolder="Assign taxes"
                  loading={isFetchingTaxes}
                  onValueChange={(e) => {
                    const newValue =
                      field.value !== undefined
                        ? [...field.value, { id: e }]
                        : [{ id: e }];
                    field.onChange(newValue);
                    // setValue('taxes', newValue)

                    // watch(`taxes`).filter(
                    //     (id: string) => id !== e
                    // )
                  }}
                  value={getValues(`taxes.${field.value?.length - 1}.id`)}
                  defaultValue={getValues(
                    `taxes.${field.value?.length - 1}.id`
                  )}
                />
              );
            }}
          />
        </FormItem>
      </div>
    </div>
  );
};

export default Taxes;
