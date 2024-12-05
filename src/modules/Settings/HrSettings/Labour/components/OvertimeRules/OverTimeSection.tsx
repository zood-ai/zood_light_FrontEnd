import CustomSection from '@/components/ui/custom/CustomSection';
import { CustomSheet } from '@/components/ui/custom/CustomSheet';
import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formOverTimeRulesSchema } from '../../Schema/schema';
import OverTime from './OverTimeComp';
import { use } from 'i18next';
import useShiftTypesHttps from '../../queriesHttps/useShiftTypes';
import CustomModal from '@/components/ui/custom/CustomModal';

const OverTimeSection = () => {
    const [isOpenShift, setIsOpenShift] = React.useState(false);
    const [isOpenOverTime, setIsOpenOverTime] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [modalName, setModalName] = React.useState("");
    const [rowData, setRowData] = React.useState<any>();



    const defaultValues: any = {
        name: "",
        scenario: "1",
        paid_rate: 0,
        day: "",
        hours_per_week: 0,
        applies_to_hourly: true,
        applies_to_daily: true,
        applies_to_salaried: true,
    };
    const form = useForm<z.infer<typeof formOverTimeRulesSchema>>({
        resolver: zodResolver(formOverTimeRulesSchema),
        defaultValues,
    });
    const handleCloseSheet = () => {
        setIsOpenShift(false);
        setIsOpenOverTime(false)
        setIsEdit(false)

        form.reset(defaultValues);
        setModalName('')
        setRowData(undefined)
    };
    const { OverTimeRulesData, isLoadingOverTimeRules, overTimeRuleAdd,
        overTimeRuleEdit, overTimeRuleDelete, isLoadingOverTimeAdd,
        isLoadingOverTimeEdit, isLoadingOverTimeDelete, isLoadingOverTimeRulesOne } =
        useShiftTypesHttps({
            handleCloseSheet: handleCloseSheet, overTimeRuleId: rowData,
            setOverTimeRuleOne: (data: any) => {
                form.reset(data)
            }
        })
    const handleConfirm = () => {
        if (modalName === "close edit") {
            handleCloseSheet();
        } else {
            overTimeRuleDelete(rowData || "");
        }
    };

    const onSubmit = (values: z.infer<typeof formOverTimeRulesSchema>) => {

        if (isEdit) {
            overTimeRuleEdit({ ...values, id: rowData })
            return;
        }
        overTimeRuleAdd(values)
    };
    console.log(form.formState.errors)


    return (
        <div className=" flex flex-col gap-8 ">
            <CustomSection
                title="Overtime rules"
                description="Add new overtime rule"
                setIsOpen={setIsOpenOverTime}
                Data={OverTimeRulesData?.data}
                isLoading={isLoadingOverTimeRules}
                onClick={() => {
                    setIsOpenOverTime(true);
                }}
                onEdit={(e: any) => {
                    setRowData(e)
                    setIsOpenOverTime(true);
                    setIsEdit(true);
                }}
            />

            <CustomSheet
                isOpen={isOpenOverTime}
                isEdit={isEdit}
                isDirty={form.formState.isDirty}
                btnText={"Create"}
                handleCloseSheet={handleCloseSheet}
                headerLeftText={"Overtime rules"}
                form={form}
                isLoadingForm={isLoadingOverTimeRulesOne}
                isLoading={isLoadingOverTimeAdd || isLoadingOverTimeEdit || isLoadingOverTimeDelete}
                onSubmit={onSubmit}
                setModalName={setModalName}
            >
                <OverTime />

            </CustomSheet>
            <CustomModal
                modalName={modalName}
                setModalName={setModalName}
                handleConfirm={handleConfirm}
                deletedItemName={rowData?.name || ""}
            />
        </div>
    );
};

export default OverTimeSection;
