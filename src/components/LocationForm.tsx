import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

// UI
import { Checkbox } from "@/components/ui/checkbox";
import useCommonRequests from "@/hooks/useCommonRequests";
import { ISelect } from "@/types/global.type";
import { Skeleton } from "./ui/skeleton";

const LocationForm = ({
  className,
  text = " Select the locations that this item is available in",
}: {
  className?: string;
  text?: string;
}) => {
  const { control } = useFormContext();
  const { branchesSelect, isBranchesLoading } = useCommonRequests({
    getBranches: true,
  });

  return (
    <FormField
      control={control}
      name="branches"
      render={({ field }) => {
        return (
          <>
            <p>
              {text} <span className="text-warn text-[18px]">*</span>
            </p>
            <div className={className}>
              {isBranchesLoading ? (
                <div className="flex flex-col gap-5 mt-5">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton className="h-4 w-[150px]" key={index} />
                  ))}
                </div>
              ) : (
                <>
                  <FormItem className={`flex gap-2 items-center  mb-3 mt-3 `}>
                    <Checkbox
                      checked={field.value?.length === branchesSelect?.length}
                      id="locations"
                      name="All locations"
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange(
                            branchesSelect.map((branch: ISelect) => ({
                              id: branch.value,
                            }))
                          );
                        } else {
                          field.onChange((field.value = []));
                        }
                      }}
                    />
                    <FormLabel
                      htmlFor="locations"
                      className="text-sm font-medium "
                    >
                      All locations
                    </FormLabel>
                  </FormItem>
                  {branchesSelect?.map((branch: ISelect) => (
                    <FormItem
                      className={`flex gap-2 items-center  mb-3 mt-3 `}
                      key={branch.value}
                    >
                      <Checkbox
                        checked={field.value
                          ?.map((value: any) => value.id)
                          .includes(branch.value)}
                        id={branch.value}
                        name={branch.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (branch.value === "") {
                              field.onChange(
                                branchesSelect.map((branch: ISelect) => ({
                                  id: branch.value,
                                })),
                                { shouldValidate: true }
                              );
                            } else {
                              field.onChange(
                                [...field?.value, { id: branch.value }],
                                { shouldValidate: true }
                              );
                            }
                          } else {
                            field.onChange(
                              field.value?.filter(
                                (value: any) => value.id !== branch.value
                              ),
                              { shouldValidate: true }
                            );
                          }
                        }}
                      />

                      <FormLabel
                        htmlFor={branch.value}
                        className="text-sm font-medium "
                      >
                        {branch.label}
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  ))}
                </>
              )}
            </div>
          </>
        );
      }}
    />
  );
};

export default LocationForm;
