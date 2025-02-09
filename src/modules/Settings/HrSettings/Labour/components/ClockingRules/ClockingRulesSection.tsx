import { CustomSheet } from '@/components/ui/custom/CustomSheet';
import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formClockingRulesSchema } from '../../Schema/schema';
import OverTime from '../OvertimeRules/OverTimeComp';
import PenIcon from '@/assets/icons/Pen';
import ClockingRulesComp from './ClockingRulesComp';
import useShiftTypesHttps from '../../queriesHttps/useShiftTypes';

const ClockingRulesSection = () => {
  const [isEdit, setIsEdit] = React.useState(false);
  const [modalName, setModalName] = React.useState("");
  const { isLoadingClockingRules } = useShiftTypesHttps({})

  const defaultValues = {



  };
  const form = useForm<z.infer<typeof formClockingRulesSchema>>({
    resolver: zodResolver(formClockingRulesSchema),
    defaultValues,
  });
  const handleCloseSheet = () => {

    setIsEdit(false)

    form.reset(defaultValues);
    setModalName('')
  };
  const { clockingRulesEdit } = useShiftTypesHttps({
    clockingRules: isEdit,
    setClockingRulesOne: (data: any) => {
      form.reset(data)
    },
    handleCloseSheet:handleCloseSheet
  })



  const onSubmit = (values: any) => {

    clockingRulesEdit(values)
  };

  return (
    <div className=" flex flex-col gap-8 ">
      <div className='border border-input rounded-[4px] p-[20px] cursor-pointer'>
        <div className="flex justify-between items-center">
          <p className="font-bold text-[16px]">Clocking rules</p>
          <PenIcon color='var(--gray)' onClick={() => setIsEdit(true)} />

        </div>
        <p className='text-gray mt-5'>
          Set up clocking break time and clock rounding rules for your employees
        </p>

      </div>

      <CustomSheet
        isOpen={isEdit}
        isEdit={false}
        isDirty={form.formState.isDirty}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={"Clocking Rules"}
        form={form}
        isLoadingForm={isLoadingClockingRules}
        isLoading={isLoadingClockingRules}
        onSubmit={onSubmit}
        setModalName={setModalName}
        btnText='Save changes'
      >
        <ClockingRulesComp form={form} />

      </CustomSheet>
    </div>
  );
};

export default ClockingRulesSection;
