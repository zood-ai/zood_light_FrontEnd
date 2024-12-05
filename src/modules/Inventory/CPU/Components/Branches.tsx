import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useFieldArray, useFormContext } from "react-hook-form";
import useCPUHttp from "../hooks/useCPUHttp";
import { useParams } from "react-router-dom";

const Branches = ({ id }: { id: string }) => {
  const { control, setValue, getValues, watch } = useFormContext();

  const { remove, append } = useFieldArray({
    control,
    name: "branches",
  });
  const { branchesSelect, isBranchesLoading } = useCommonRequests({
    getBranches: true,
  });

  return (
    <>
      <div className="flex text-start items-center justify-between pb-[16px] font-bold">
        <div>Branch</div>
        <div>Customer #</div>
        <div>CC emails</div>
      </div>

      {isBranchesLoading ? (
        <div className="flex gap-5 flex-col">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton className="h-4 w-[150px] bg-gray-300" key={index} />
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-[8px] mt-2 mb-6">
            <Checkbox
              id="location"
              // {...register('check')}
              defaultChecked={watch("AllChecked")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setValue("AllChecked", true);
                  branchesSelect
                    ?.filter((e: any) => e.value !== id)
                    ?.forEach(
                      (
                        branch: { value: string; label: string },
                        index: number
                      ) => {
                        setValue(`branches.${index}.id`, branch.value);
                        setValue(`branches.${index}.name`, branch.label);
                        setValue(`branches.${index}.value`, branch.value);
                      }
                    );
                } else {
                  setValue("AllChecked", false);
                  setValue("branches", []);
                }
              }}
            />
            <p className="w-[120px]">All Branches</p>
          </div>

          {branchesSelect
            ?.filter((e: any) => e.value !== id)
            ?.map((item: { label: string; value: string }, index: number) => {
              const removedBranchIndex: number = getValues(
                "branches"
              )?.findIndex(
                (branch: { id: string }) => branch.id === item?.value
              );

              return (
                <div
                  className="flex justify-between mb-5 items-center"
                  key={index}
                >
                  <div className="flex items-center gap-[8px] mt-1">
                    <Checkbox
                      checked={watch("branches")
                        ?.map((a: { id: string }) => a.id)
                        .includes(item?.value)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          append({
                            id: item?.value,
                            name: item?.label,
                            value: item?.value,
                          });
                        } else {
                          remove(removedBranchIndex);
                        }
                      }}
                    />
                    <p className="w-[120px]">{item?.label}</p>
                  </div>
                  <Input
                    className="w-[120px]"
                    type="number"
                    defaultValue={getValues(
                      `branches.${removedBranchIndex}.customer_code`
                    )}
                    disabled={!watch(`branches.${removedBranchIndex}.name`)}
                    onChange={(e) => {
                      setValue(
                        `branches.${removedBranchIndex}.customer_code`,
                        e.target.value
                      );
                    }}
                  />

                  <Input
                    className="w-[120px]"
                    type="text"
                    defaultValue={getValues(
                      `branches.${removedBranchIndex}.cc_email`
                    )}
                    disabled={!watch(`branches.${removedBranchIndex}.name`)}
                    onChange={(e) => {
                      setValue(
                        `branches.${removedBranchIndex}.cc_email`,
                        e.target.value
                      );
                    }}
                  />
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default Branches;
