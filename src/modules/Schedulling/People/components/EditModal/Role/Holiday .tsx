import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import HolidayIcon from "@/assets/icons/Holiday";
import PenIcon from "@/assets/icons/Pen";
import usePeopleHttp from "../../../queriesHttp/usePeopleHttp";
import AuthPermission from "@/guards/AuthPermission";
import { PERMISSIONS } from "@/constants/constants";
import useFilterQuery from "@/hooks/useFilterQuery";
import { set } from "date-fns";

const NumberInput = ({
  value,
  onDecrement,
  onIncrement,
  onChange,
  min = 0,
}) => (
  <div className="flex items-center justify-center">
    <button
      type="button"
      className="border-[1px] px-3 h-[30px] border-gray-400"
      onClick={onDecrement}
      disabled={value <= min}
    >
      -
    </button>
    <input
      className="border-[1px] flex items-center h-[30px] w-[50px] border-gray-400 focus:outline-none text-center"
      type="number"
      value={value}
      onChange={(e) => {
        const newValue = Number(e.target.value);
        if (newValue >= min) {
          onChange(newValue); // Update value if it meets the minimum requirement
        }
      }}
      min={min}
      aria-label="Number Input"
    />
    <button
      type="button"
      className="border-[1px] px-3 h-[30px] border-gray-400"
      onClick={onIncrement}
    >
      +
    </button>
  </div>
);

const Holiday = () => {
  const { setValue, watch } = useFormContext();
  const [isEdit, setIsEdit] = useState(false);
  const { employeeDataOne } = usePeopleHttp({});
  const { filterObj } = useFilterQuery();
  const yearlyPaidEntitlements = watch("yearly_paid_entitlements");
  const carryover = watch("carryover");
  const taken = watch("taken");

  const resetValues = () => {
    setValue(
      "yearly_paid_entitlements",
      employeeDataOne?.yearly_paid_entitlements || 0
    );
    setValue("carryover", employeeDataOne?.carryover || 0);
    setValue("taken", employeeDataOne?.taken || 0);
    setIsEdit(false);
  };
const handleClose=()=>
{
    setIsEdit(false);
    setValue("current_balance",(+watch("carryover") + +watch("yearly_paid_entitlements"))-+watch("taken"));
    if(!watch("receives_holiday_entitlements"))
    {
setValue("planned",0);
setValue("current_balance",0);
setValue("taken",0);
setValue("carryover",0);
setValue("yearly_paid_entitlements",0);



    }
    
}
  const { editEmployee,isLoadingEdit } = usePeopleHttp({handleCloseSheet:handleClose});
  return (
    <>
      <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]">
          <HolidayIcon />
        </div>
        <h3 className="font-bold text-[16px]">Holiday entitlements</h3>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          className="mt-1"
          checked={!!watch("receives_holiday_entitlements")}
          onCheckedChange={(e) => {
            setValue("receives_holiday_entitlements", e);
            if (e) {
              editEmployee({
                id: filterObj?.id,
                receives_holiday_entitlements: e,
                _method: "PUT",
              }); 
            } else {
              editEmployee({
                id: filterObj?.id,
                receives_holiday_entitlements: e,
                carryover: 0,
                yearly_paid_entitlements: 0,
                taken: 0,
                planned: 0,
                current_balance: 0,
                _method: "PUT",
              });
            }
          }}
        />
        <Label>This employee receives holiday entitlements</Label>
      </div>
      {watch("receives_holiday_entitlements") ? (
        <div className="bg-popover p-[24px] rounded-[10px] mb-[13px] border border-input mt-[16px]">
          <AuthPermission
            permissionRequired={[PERMISSIONS.can_edit_holiday_entitlements]}
          >
            <div className="flex items-center gap-[32px] border-b border-b-input pb-[24px]">
              {isEdit ? (
                <div className="ml-auto gap-2">
                  <Button
                    variant="outline"
                    className="mx-2"
                    type="button"
                    loading={isLoadingEdit}
                    onClick={() => {
                      editEmployee({
                        id: filterObj?.id,
                        carryover: carryover,
                        yearly_paid_entitlements: yearlyPaidEntitlements,
                        taken: taken,
                        _method: "PUT",
                      });
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    className="mx-2"
                    type="button"
                    loading={isLoadingEdit}

                    onClick={resetValues}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="ml-auto gap-2"
                  type="button"
                  onClick={() => setIsEdit(true)}
                >
                  Edit <PenIcon color="gray" />
                </Button>
              )}
            </div>
          </AuthPermission>
          <Section title="Annual leave overview">
            <EditableListItem
              isEdit={isEdit}
              label="Carryover"
              value={carryover}
              onDecrement={() => setValue("carryover", carryover - 1)}
              onIncrement={() => setValue("carryover", carryover + 1)}
              register={{
                onChange: (newValue) => setValue("carryover", newValue),
              }}
            />
            <EditableListItem
              isEdit={isEdit}
              label="Yearly Paid Entitlements"
              value={yearlyPaidEntitlements}
              onDecrement={() =>
                setValue("yearly_paid_entitlements", yearlyPaidEntitlements - 1)
              }
              onIncrement={() =>
                setValue("yearly_paid_entitlements", yearlyPaidEntitlements + 1)
              }
              register={{
                onChange: (newValue) =>
                  setValue("yearly_paid_entitlements", newValue),
              }}
            />
          </Section>

          <Section title="Current leave Balance">
            <ListItem label="Planned" value={`${watch("planned")} days`} />
            <EditableListItem
              isEdit={isEdit}
              label="Taken"
              value={taken}
              onDecrement={() => setValue("taken", taken - 1)}
              onIncrement={() => setValue("taken", taken + 1)}
              register={{
                onChange: (newValue) => setValue("taken", newValue),
              }}
            />
            <ListItem
              label="Current Balance"
              value={`${watch("current_balance")} days`}
            />
          </Section>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const Section = ({ title, children }) => (
  <div className="pb-[24px] pt-[16px] border-b border-b-input">
    <p className="font-bold text-[16px]">{title}</p>
    <ul className="list-disc list-inside flex flex-col gap-[24px] mt-[24px]">
      {children}
    </ul>
  </div>
);

const ListItem = ({ label, value }) => (
  <li className="flex items-center justify-between">
    <p>{label}</p>
    <p>{value}</p>
  </li>
);

const EditableListItem = ({
  isEdit,
  label,
  value,
  onDecrement,
  onIncrement,
  register,
}) => (
  <li className="flex items-center justify-between">
    <p>{label}</p>
    <div className="flex gap-3 items-center">
      {isEdit ? (
        <NumberInput
          value={value}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          onChange={(newValue) => register.onChange(newValue)}
        />
      ) : (
        <p>{value}</p>
      )}
      <p>days</p>
    </div>
  </li>
);

export default Holiday;
