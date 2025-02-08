import CloseIcon from "@/assets/icons/Close";
import PositionIcon from "@/assets/icons/Position";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import { PERMISSIONS } from "@/constants/constants";
import { wageTypes } from "@/constants/dropdownconstants";
import AuthPermission from "@/guards/AuthPermission";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useFieldArray, useFormContext } from "react-hook-form";

const Position = () => {
  const { watch, getValues, setValue, control, register, formState } =
    useFormContext();
  const { departmentsDataList, isDepartmentsLoadingList } = useCommonRequests({
    getBranches: true,
    locationList: watch("branches")?.map((item: any) => item?.id),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "departments",
  });

  return (
    <>
      <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]">
          <PositionIcon />
        </div>
        <h3 className="font-bold text-[16px]">Positions</h3>
      </div>

      {fields?.map((item, index) => (
        <>
          <div className=" bg-popover p-[16px] rounded-[10px] mb-[13px] border border-input">
            <div className="flex items-center gap-[32px]">
              <CustomSelect
                required
                options={departmentsDataList?.map((dep) => ({
                  label: dep.name,
                  value: dep.id,
                }))}
                label="Department"
                width="w-[250px]"
                value={watch(`departments.[${index}].id`)}
                loading={isDepartmentsLoadingList}
                onValueChange={(e) => {
                  if (e == "null") {
                    setValue(`departments.[${index}].id`, "");
                    return;
                  }
                  setValue(`departments.[${index}].id`, e, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
              <CustomSelect
                required
                key={JSON.stringify(
                  departmentsDataList
                    ?.filter(
                      (dep) => dep?.id == getValues(`departments.[${index}].id`)
                    )
                    ?.map((dep) => dep?.positions)
                    ?.flat()
                    ?.map((pos) => ({ label: pos?.name, value: pos?.id }))
                )}
                options={departmentsDataList
                  ?.filter(
                    (dep) => dep?.id == getValues(`departments.[${index}].id`)
                  )
                  ?.map((dep) => dep?.positions)
                  ?.flat()
                  ?.map((pos) => ({ label: pos?.name, value: pos?.id }))}
                loading={isDepartmentsLoadingList}
                label="Position"
                width="w-[250px]"
                value={watch(`departments.[${index}].forecast_position_id`)}
                onValueChange={(e) =>
                  setValue(`departments.[${index}].forecast_position_id`, +e, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </div>
            {index == 0 && (
              <AuthPermission permissionRequired={[PERMISSIONS.can_edit_waste]}>
                <div className="flex items-center gap-2">
                  <Input
                    label="Wage"
                    textLeft="SAR"
                    className="w-[100px]"
                    type="number"
                    value={getValues("wage")}
                    required
                    onChange={(e: any) => {
                      setValue("wage", +e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                  />
                  <CustomSelect
                    options={wageTypes}
                    width="w-[170px] mt-11"
                    value={watch("wage_type")}
                    onValueChange={(e) =>
                      setValue("wage_type", e, { shouldValidate: true })
                    }
                  />
                </div>
              </AuthPermission>
            )}
            {index !== 0 && (
              <div className="text-right w-full mt-5">
                <Button
                  className="border border-warn bg-transparent text-warn font-semibold"
                  variant="outline"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </>
      ))}
      <p
        className="text-primary text-end mb-[42px] cursor-pointer"
        onClick={() => {
          append({
            id: "",
            forecast_position_id: "",
          });
        }}
      >
        + Add another position
      </p>

      <div className="flex items-center gap-[20px]">
        <div>
          <Input
            label="Payroll ID"
            className="w-[140px]"
            type="number"
            onChange={(e) => {
              if (e.target.value.length == 0) {
                setValue("payroll_id", null, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              } else {
                setValue("payroll_id", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
            errorText={
              <p className="text-warn text-[10px] w-[140px]">
                {typeof formState?.errors?.payroll_id?.message === "string"
                  ? formState.errors.payroll_id.message
                  : ""}
              </p>
            }
          />
        </div>
        <Input
          label="Timecard ID"
          className="w-[140px]"
         

          onChange={(e) => {
            if (e.target.value.length == 0) {
              setValue("timecard_id", null, {
                shouldValidate: true,
                shouldDirty: true,
              });
            } else {
              setValue("timecard_id", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }
          }}
          type="number"
          errorText={
            <p className="text-warn text-[10px] w-[140px]">
              {typeof formState?.errors?.timecard_id?.message === "string"
                ? formState.errors.timecard_id.message
                : ""}
            </p>
          }
        />
        <div className="flex items-cente">
          <Input
            label="Punch clock ID"
            className="w-[140px]"
            {...register("pin")}
            disabled
          />

          <Button
            variant="line"
            type="button"
            className="mt-10"
            onClick={() => {
              setValue("pin", Math.random().toFixed(4).slice(2, 6));
            }}
          >
            Unique PINs
          </Button>
        </div>
      </div>
    </>
  );
};

export default Position;
