import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import HolidayIcon from "@/assets/icons/Holiday";
import PenIcon from "@/assets/icons/Pen";
import usePeopleHttp from "../../../queriesHttp/usePeopleHttp";

const NumberInput = ({ value, onDecrement, onIncrement, onChange, min = 0 }) => (
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
      className="border-[1px] flex items-center h-[30px] w-[39.2px] border-gray-400 focus:outline-none text-center"
      type="number"
      value={value}
      onChange={onChange}
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
  const { setValue, watch, register, getValues } = useFormContext();
  const [isEdit, setIsEdit] = useState(false);
  const { employeeDataOne } = usePeopleHttp({});
  const yearlyPaidEntitlements = watch("yearly_paid_entitlements");
  const carryover = watch("carryover");
  const taken = watch("taken");

  const resetValues = () => {
    setValue("yearly_paid_entitlements", employeeDataOne?.yearly_paid_entitlements || 0);
    setValue("carryover", employeeDataOne?.carryover || 0);
    setValue("taken", employeeDataOne?.taken || 0);
    setIsEdit(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F1F3F5]">
          <HolidayIcon />
        </div>
        <h3 className="font-bold text-[16px]">Holiday entitlements</h3>
      </div>
      <div className="flex items-center gap-2">
        <Switch className="mt-1"
          checked={!!watch('receives_holiday_entitlements')}
          onCheckedChange={(e) => {
            console.log(e);

            setValue('receives_holiday_entitlements', e)
          }
          } />
        <Label>This employee receives holiday entitlements</Label>
      </div>

      <div className="bg-popover p-[24px] rounded-[10px] mb-[13px] border border-input mt-[16px]">
        <div className="flex items-center gap-[32px] border-b border-b-input pb-[24px]">
          {isEdit ? (
            <div className="ml-auto gap-2">
              <Button variant="outline" className="mx-2" type="button" onClick={() => setIsEdit(false)}>
                Save
              </Button>
              <Button variant="outline" className="mx-2" type="button" onClick={resetValues}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="ml-auto gap-2" type="button" onClick={() => setIsEdit(true)}>
              Edit <PenIcon color="gray" />
            </Button>
          )}
        </div>

        <Section title="Annual leave overview">
          <EditableListItem
            isEdit={isEdit}
            label="Carryover"
            value={carryover}
            onDecrement={() => setValue("carryover", carryover - 1)}
            onIncrement={() => setValue("carryover", carryover + 1)}
            register={register("carryover", { valueAsNumber: true })}
          />
          <EditableListItem
            isEdit={isEdit}
            label="Yearly Paid Entitlements"
            value={yearlyPaidEntitlements}
            onDecrement={() => setValue("yearly_paid_entitlements", yearlyPaidEntitlements - 1)}
            onIncrement={() => setValue("yearly_paid_entitlements", yearlyPaidEntitlements + 1)}
            register={register("yearly_paid_entitlements", { valueAsNumber: true })}
          />
        </Section>

        <Section title="Current leave Balance">
          <ListItem label="Planned" value="0.0 days" />
          <EditableListItem
            isEdit={isEdit}
            label="Taken"
            value={taken}
            onDecrement={() => setValue("taken", taken - 1)}
            onIncrement={() => setValue("taken", taken + 1)}
            register={register("taken", { valueAsNumber: true })}
          />
          <ListItem label="Current Balance" value="0.0 days" />
        </Section>
      </div>
    </>
  );
};

const Section = ({ title, children }) => (
  <div className="pb-[24px] pt-[16px] border-b border-b-input">
    <p className="font-bold text-[16px]">{title}</p>
    <ul className="list-disc list-inside flex flex-col gap-[24px] mt-[24px]">{children}</ul>
  </div>
);

const ListItem = ({ label, value }) => (
  <li className="flex items-center justify-between">
    <p>{label}</p>
    <p>{value}</p>
  </li>
);

const EditableListItem = ({ isEdit, label, value, onDecrement, onIncrement, register }) => (
  <li className="flex items-center justify-between">
    <p>{label}</p>
    <div className="flex gap-3">
      {isEdit ? (
        <NumberInput
          value={value}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          onChange={(e) => register.onChange(Number(e.target.value))}
        />
      ) : (
        value
      )}
      <p>days</p>
    </div>
  </li>
);

export default Holiday;
