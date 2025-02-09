import CustomSelect from "@/components/ui/custom/CustomSelect";
import { FormItem } from "@/components/ui/form";
import { Controller, useFormContext } from "react-hook-form";
import useCommonRequests from "@/hooks/useCommonRequests";
import CustomDropDown from "@/components/ui/custom/CustomDropDown";
import { useState } from "react";
import CustomAlert from "@/components/ui/custom/CustomAlert";
import CloseIcon from "@/assets/icons/Close";
import useFilterQuery from "@/hooks/useFilterQuery";
import usePeopleHttp from "../../../queriesHttp/usePeopleHttp";

const Location = ({employeeData}:{employeeData:{id:string}[]}) => {
  const {filterObj}=useFilterQuery()
  const [changeBranch, setChangeBranch] = useState(false);
  const { watch, getValues, setValue } = useFormContext();
  const { branches,departmentsDataList } = useCommonRequests({
    getBranches: true,
    locationList: watch("branches")?.map((item: any) => item?.id),
  });
  const filteredOptions = branches?.filter(
    (branch: { id: string }) =>
      !watch("branches")?.some(
        (selected: { id: string }) => selected.id === branch.id
      )
  );
 

  return (
    <>
      {changeBranch && (
        <CustomAlert
          bgColor="bg-[#FFE0B9]"
          colorIcon="var(--info)"
          icon={"👀"}
          content={
            <div className="flex items-center gap-4">
              <div>
                {watch("first_name")} {watch("last_name")}{" "}
                <b>requests, time off and holdiays will be moved</b> to{" "}
                <b>
                  {watch("branches")?.find((item: any) => item.is_home)?.name}
                </b>
              </div>

              <CloseIcon color="white" onClick={() => setChangeBranch(false)} className="cursor-pointer" />
            </div>
          }
        />
      )}
      <div className="border-b border-input mt-5">
        <div className="border p-4 flex justify-between gap-2 mb-5">
          <div className="flex gap-2 flex-wrap">
            {watch("branches")?.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-1 w-fit p-2 h-[30px] rounded-[4px] items-center border-[#91DFF2] bg-muted-foreground justify-center"
              >
                {item.name}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    if (watch("branches")?.length > 1) {
                      setValue(
                        `branches`,
                        getValues(`branches`).filter(
                          (branch: { id: string }) => branch.id !== item.id
                        )
                      );
                    }
                    if (watch("branches")?.length == 1) {
                      const updatedBranches = watch("branches")?.map(
                        (item: any, index: number) =>
                          index === 0 ? { ...item, is_home: true } : item
                      );
                      setValue("branches", updatedBranches);
                    }
                  }}
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
                <CustomDropDown
                  className="w-[200px]"
                  placeHolder="Assign branches"
                  displayValue={false}
                  showIcon={true}
                  options={filteredOptions?.map(
                    (branch: { name: string; id: string }) => ({
                      label: branch.name,
                      value: branch.id,
                    })
                  )}
                  onValueChange={(e) => {
                    if (
                      watch("branches")?.find((item: any) => item.is_home)
                        ?.id == undefined
                    ) {
                      const updatedBranches = watch("branches")?.map(
                        (item: any, index: number) =>
                          index === 0 ? { ...item, is_home: true } : item
                      );
                      field.onChange(updatedBranches);
                    } else {
                      const newValue = [
                        ...(field.value || []),
                        {
                          id: e,
                          name: branches?.find(
                            (branch: { id: string }) => branch.id === e
                          )?.name,
                          is_home: false,
                        },
                      ];
                      field.onChange(newValue);
                    }


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
        options={watch("branches")?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(e) => {
          if(employeeData?.[0]?.id==e){
            setChangeBranch(false);
          }else
          {
            setChangeBranch(true);
          }
          // Make is_home true for the selected branch
          const updatedBranches = watch("branches")?.map((branch: any) => ({
            ...branch,
            is_home: branch.id === e ? true : false, // Set to true only for the matching branch
          }));

          setValue("branches", updatedBranches);
          // setValue('de')

          
        }}
        value={
          watch("branches")?.length == 1
            ? watch("branches")?.[0].id
            : watch("branches")?.find((item: any) => item.is_home)?.id
        }
        disabled={watch("branches")?.length === 1}
      />
    </>
  );
};

export default Location;
