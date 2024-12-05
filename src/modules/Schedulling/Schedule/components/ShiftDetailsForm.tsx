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

type TShiftDetailsForm = {
  formData: z.infer<typeof formAddShiftSchema>;
  handleSetFormValues: (
    key: keyof z.infer<typeof formAddShiftSchema>,
    value: string | number | null
  ) => void;
};
const ShiftDetailsForm = ({
  formData,
  handleSetFormValues,
}: TShiftDetailsForm) => {
  const [isGetPositions, setIsGetPositions] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const { filterObj } = useFilterQuery();

  useEffect(() => {
    if (!formData.department_id) return;
    setIsGetPositions(true);
  }, [formData.department_id]);
  const {
    departmentsSelect,
    isDepartmentsLoading,
    positionsSelect,
    isPositionsLoading,
    employeesSelect,
    isEmployeesLoading,
    shiftTypesSelect,
    isShiftTypesLoading,
  } = useCommonRequests({
    getDepartments: true,
    locationId: filterObj["filter[branch]"],
    departmentId: formData.department_id,
    getPositions: isGetPositions,
    getEmployees: true,
    getShiftTypes: true,
  });

  const filterEmployees = useMemo(() => {
    if (formData.position_id && formData.department_id) {
      return employeesSelect?.filter((empl) => {
        return empl.departments.find(
          (dep) =>
            dep.id === formData.department_id &&
            dep.pivot.forecast_position_id === formData.position_id
        );
      });
    }
    return employeesSelect?.filter((empl) => {
      return empl.departments.find((dep) => dep.id === formData.department_id);
    });
  }, [employeesSelect, formData.department_id, formData.position_id]);

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
            placeHolder="Choose category"
            width="w-[200px]"
            loading={isDepartmentsLoading}
            // disabled
            value={formData.department_id}
            options={departmentsSelect}
            onValueChange={(e) => {
              handleSetFormValues("department_id", e);
              handleSetFormValues("position_id", 0);
              handleSetFormValues("employee_id", null);
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
            width="w-[200px]"
            loading={isShiftTypesLoading}
            options={shiftTypesSelect}
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
            options={filterEmployees}
            value={
              formData.employee_id === null ? "null" : formData.employee_id
            }
            loading={isEmployeesLoading}
            onValueChange={(e) => {
              if (e !== "null") {
                handleSetFormValues("employee_id", e);

                const employee = filterEmployees.find((emp) => emp.value === e);
                // employee may be exist in multiple departments
                const positionId = employee?.departments.find(
                  (dep) =>
                    dep.id === formData.department_id &&
                    dep.pivot.forecast_employee_id === e
                ).pivot.forecast_position_id;

                handleSetFormValues("position_id", positionId);
              } else {
                handleSetFormValues("employee_id", null);
                handleSetFormValues("position_id", null);
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
            // disabled={!fromOpenShift}
            value={formData.position_id === 0 ? "null" : formData.position_id}
            options={positionsSelect?.filter(
              (pos) => pos.departmentId === formData.department_id
            )}
            onValueChange={(e) => {
              if (e === "null") {
                handleSetFormValues("position_id", 0);
                handleSetFormValues("employee_id", null);
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
