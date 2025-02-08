import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useEffect, useMemo, useState } from "react";
import PopularShiftInput from "./PopularShiftInput";
import { z } from "zod";
import { formAddShiftSchema } from "../Schema/schema";
import { TDepartment } from "../types/types";

type TShiftDetailsForm = {
  departments?: TDepartment[];
  formData: z.infer<typeof formAddShiftSchema>;
  handleSetFormValues: (
    key: keyof z.infer<typeof formAddShiftSchema>,
    value: string | number | null
  ) => void;
  fromOpenShift?: boolean;
  isEdit?: boolean;
};
const ShiftDetailsForm = ({
  formData,
  handleSetFormValues,
  departments,
  fromOpenShift,
  isEdit,
}: TShiftDetailsForm) => {
  const [focusedInput, setFocusedInput] = useState("");
  const { filterObj } = useFilterQuery();

  const {
    departmentsSelect,
    isDepartmentsLoading,
    employeesSelect,
    isEmployeesLoading,
    shiftTypesSelect,
    isShiftTypesLoading,
    positionsSelect,
    isPositionsLoading,
  } = useCommonRequests({
    getDepartments: true,
    getPositions: true,
    departmentId: formData.department_id ? formData.department_id : undefined,
    locationId: filterObj["filter[branch]"],
    getEmployees: true,
    getShiftTypes: true,
  });

  useEffect(() => {
    if (shiftTypesSelect && !isEdit) {
      handleSetFormValues(
        "shift_type_id",
        shiftTypesSelect?.find((shift) => shift?.type === "regular")?.value
      );
    }
  }, [shiftTypesSelect?.length]);

  // incase of employee select get the department and position of the employee
  const departmentsOptions = useMemo(
    () =>
      formData.employee_id
        ? employeesSelect
            ?.find((emp) => emp.value === formData.employee_id)
            ?.departments?.map((dep) => {
              return {
                value: dep.id,
                label: dep.name,
                positions: [
                  {
                    value: dep.positions?.id,
                    label: dep.positions?.name,
                  },
                ],
              };
            })
        : departmentsSelect,
    [formData.employee_id, employeesSelect, departmentsSelect]
  );

  const employeesOptions = useMemo(
    () =>
      formData.department_id
        ? employeesSelect?.filter((emp) =>
            emp.departments?.find((dep) => dep.id === formData.department_id)
          )
        : employeesSelect,
    [employeesSelect, formData.department_id]
  );

  const positionsOptions = useMemo(() => {
    if (formData.employee_id) {
      let employeePositions = employeesOptions
        ?.find((emp) => emp.value === formData.employee_id)
        ?.positions?.map((pos) => {
          return {
            value: pos.pivot.forecast_position_id,
            label: pos.name,
            departmentId: pos.forecast_department_id,
          };
        });
      if (formData.department_id) {
        employeePositions = employeePositions?.filter(
          (pos) => pos.departmentId === formData.department_id
        );
      }

      return employeePositions;
    }
    return positionsSelect;
  }, [employeesOptions, positionsSelect, formData.employee_id]);

  const shiftTypeOptions = fromOpenShift
    ? shiftTypesSelect?.filter(
        (shift) =>
          shift?.type !== "time_off" &&
          shift?.type !== "sick_day" &&
          shift?.type !== "holiday"
      )
    : shiftTypesSelect;

  return (
    <>
      <div className="flex items-center gap-[54px]">
        <FormItem className="items-center gap-2 mt-2 mb-4">
          <Label htmlFor="name" className="font-bold">
            Date
          </Label>
          <CustomInputDate
            disabled
            defaultValue={formData.date}
            onSelect={() => {}}
          />
        </FormItem>
        <div className="">
          <Label htmlFor="from" className="font-bold">
            Time
          </Label>
          <div className="flex items-center gap-5">
            <FormItem className="flex items-center gap-2 mt-2 mb-4">
              <Label htmlFor="from" className="font-bold">
                From
              </Label>
              <PopularShiftInput
                className="w-[80px]"
                name="first"
                formkey="time_from"
                setFocusedInput={setFocusedInput}
                focusedInput={focusedInput}
              />
            </FormItem>
            <FormItem className="flex items-center gap-2 mt-2 mb-4">
              <Label htmlFor="to" className="font-bold">
                to
              </Label>
              <PopularShiftInput
                className="w-[80px]"
                name="last"
                formkey="time_to"
                setFocusedInput={setFocusedInput}
                focusedInput={focusedInput}
              />
            </FormItem>
          </div>
        </div>
      </div>

      <div>
        <FormItem className="items-center gap-2 mt-2 mb-4 ">
          <Label htmlFor="department" className="font-bold">
            Department
          </Label>
          <CustomSelect
            placeHolder="Choose department"
            // removeDefaultOption={!fromOpenShift}
            key={JSON.stringify(departmentsOptions)}
            width="w-[200px]"
            loading={isDepartmentsLoading}
            value={formData.department_id ?? "null"}
            options={departmentsOptions}
            onValueChange={(e) => {
              if (e === "null") {
                handleSetFormValues("department_id", null);
                handleSetFormValues("position_id", null);
                handleSetFormValues("employee_id", null);
              } else {
                handleSetFormValues("department_id", e);
                handleSetFormValues("position_id", null);
              }
            }}
          />
        </FormItem>

        <FormItem className="items-center gap-2 mt-2 mb-4 ">
          <Label htmlFor="station" className="font-bold">
            Station
            {/* <span className="text-warn text-[18px]">*</span> */}
          </Label>
          <CustomSelect
            placeHolder="No station"
            width="w-[200px]"
            options={[]}
            onValueChange={() => {}}
          />
        </FormItem>
        <FormItem className="items-center gap-2 mt-2 mb-4 ">
          <Label htmlFor="shiftType" className="font-bold">
            Shift Type
          </Label>
          <CustomSelect
            placeHolder="Regular"
            removeDefaultOption
            width="w-[200px]"
            loading={isShiftTypesLoading}
            options={shiftTypeOptions}
            value={formData.shift_type_id}
            onValueChange={(e) => {
              handleSetFormValues("shift_type_id", e);
            }}
          />
        </FormItem>
      </div>

      <hr className="my-6" />

      <div className="flex items-center gap-[54px]">
        <FormItem className="items-center gap-2 mt-2 mb-4 ">
          <Label htmlFor="employee" className="font-bold">
            Employee
            {/* <span className="text-warn text-[18px]">*</span> */}
          </Label>
          <CustomSelect
            placeHolder="Select"
            width="w-[200px]"
            // disabled={!fromOpenShift}
            options={employeesOptions}
            value={
              formData.employee_id === null ? "null" : formData.employee_id
            }
            loading={isEmployeesLoading}
            onValueChange={(e) => {
              if (e !== "null") {
                handleSetFormValues("employee_id", e);

                const employeeDepartments = employeesOptions.find(
                  (emp) => emp.value === e
                )?.departments;

                if (formData.department_id) {
                  const positionId = employeeDepartments?.find(
                    (dep) => dep.id === formData.department_id
                  )?.pivot.forecast_position_id;
                  handleSetFormValues("position_id", positionId);
                }

                // handleSetFormValues("position_id", departmen);

                // const employee = filterEmployees.find((emp) => emp.value === e);
                // employee may be exist in multiple departments
                // const positionId = employee?.departments.find(
                //   (dep) =>
                //     dep.id === formData.department_id &&
                //     dep.pivot.forecast_employee_id === e
                // ).pivot.forecast_position_id;

                // handleSetFormValues("position_id", positionId);
              } else {
                handleSetFormValues("employee_id", null);
                handleSetFormValues("position_id", null);
                handleSetFormValues("department_id", null);
              }
            }}
          />
        </FormItem>
        <FormItem className="items-center gap-2 mt-2 mb-4 ">
          <Label htmlFor="position" className="font-bold">
            Position
          </Label>
          <CustomSelect
            placeHolder="Select"
            width="w-[200px]"
            loading={isPositionsLoading}
            key={JSON.stringify(positionsOptions)}
            value={!formData.position_id ? "null" : formData.position_id}
            options={positionsOptions}
            onValueChange={(e) => {
              if (e === "null") {
                handleSetFormValues("position_id", 0);
                return;
              }
              handleSetFormValues("position_id", +e);

              // filter employees select
            }}
          />
        </FormItem>
      </div>

      <hr className="my-5" />

      <FormItem className="items-center gap-2 mt-2 mb-4 ">
        <Label htmlFor="notes" className="font-bold">
          Shift Notes
        </Label>
        <Textarea
          value={formData.notes || ""}
          onChange={(e) => handleSetFormValues("notes", e.target.value)}
        />
      </FormItem>
    </>
  );
};

export default ShiftDetailsForm;
