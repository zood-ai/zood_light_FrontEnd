import CustomSelect from "@/components/ui/custom/CustomSelect";
import { FormItem } from "@/components/ui/form";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import useCommonRequests from "@/hooks/useCommonRequests";

const Location = () => {
  const { watch, getValues, setValue } = useFormContext();
  const { branches } = useCommonRequests({
    getBranches: true,
  });
  const selectedBranches = watch("branches") || [];
  const filteredOptions = branches?.filter(
    (branch: { id: string }) =>
      !selectedBranches.some((selected: { id: string }) => selected.id === branch.id)
  );


  return (
    <>
      <div className="border-b border-input mt-5">
        <div className="border p-4 flex justify-between gap-2 mb-5">
          <div className="flex gap-2 flex-wrap">
            {selectedBranches?.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-1 w-fit p-2 h-[30px] rounded-[4px] items-center border-[#91DFF2] bg-muted-foreground justify-center"
              >
                {item.name}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    if (watch('branches')?.length > 1) {
                      setValue(
                        `branches`,
                        getValues(`branches`).filter(
                          (branch: { id: string }) => branch.id !== item.id
                        )
                      );
                    }
                  }
                  }
                >
                  x
                </span>
              </div>
            ))}
          </div>
          <FormItem>
            <Controller
              name={`branches`}

              render={({ field }) => (
                <CustomSelect
                  placeHolder="Assign branches"
                  displayValue={false}
                  options={filteredOptions?.map(
                    (branch: { name: string; id: string }) => ({
                      label: branch.name,
                      value: branch.id,
                    })
                  )}

                  onValueChange={(e) => {
                    const newValue = [
                      ...(field.value || []),
                      {
                        id: e,
                        name: branches?.find((branch: { id: string }) => branch.id === e)?.name,
                        is_home: false
                      },
                    ];
                    field.onChange(newValue);

                  }}

                />
              )}
            />
          </FormItem>
        </div>
      </div>
      {/* Additional Dropdown */}
      <CustomSelect
        label="Home location"
        options={selectedBranches?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))}

        onValueChange={(e) => {
          // Make is_home true for the selected branch
          const updatedBranches = selectedBranches?.map((branch: any) => ({
            ...branch,
            is_home: branch.id === e ? true : false, // Set to true only for the matching branch
          }));

          setValue("branches", updatedBranches);
        }}
        value={watch("branches")?.find((item: any) => item.is_home)?.id}

        disabled={selectedBranches?.length === 1}
      />
    </>
  );
};

export default Location;
