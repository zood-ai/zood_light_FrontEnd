import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCommonRequests from "@/hooks/useCommonRequests";
import { ISelect } from "@/types/global.type";
import { useFormContext } from "react-hook-form";

const BranchFrom = () => {
  const { branchesSelect } = useCommonRequests({
    getBranches: true,
  });
  const { setValue, control, register } = useFormContext();
  return (
    <FormField
      control={control}
      name="branches"
      render={({ field }) => {
        return (
          <>
            <div className="flex flex-col px-6 py-[20px]">
              {branchesSelect.map(
                (branch: { label: string; value: string }) => (
                  <div key={branch.value} className="flex">
                    <div className="flex gap-2 items-center w-[200px]">
                      <Checkbox
                        id={branch.value}
                        name="branch"
                        value={branch.value}
                        checked={field.value
                          ?.map((value: any) => value.id)
                          .includes(branch.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (branch.value === "") {
                              setValue(
                                "branches",
                                branchesSelect.map((branch: ISelect) => ({
                                  id: branch.value,
                                }))
                              );
                            } else {
                              setValue("branches", [
                                ...field?.value,
                                { id: branch.value },
                              ]);
                            }
                          } else {
                            setValue(
                              "branches",
                              field.value?.filter(
                                (value: any) => value.id !== branch.value
                              )
                            );
                          }
                        }}
                      />
                      <Label htmlFor={branch.value}>{branch.label}</Label>
                    </div>
                    <div className="flex gap-2 flex-col mb-6 ">
                      <Label htmlFor="" className="">
                        custom price
                      </Label>
                      <Input
                        placeholder="248 SAR"
                        type="number"
                        value={
                          field.value.find((item) => item.id === branch.value)
                            ?.price || ""
                        }
                        onChange={(e) => {
                          field.onChange(
                            field.value.map((item) => {
                              if (item.id === branch.value) {
                                return {
                                  ...item,
                                  price: +e.target.value,
                                };
                              }
                              return item;
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        );
      }}
    />
  );
};

export default BranchFrom;
