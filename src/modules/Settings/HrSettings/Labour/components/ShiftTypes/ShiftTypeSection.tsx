import CustomSection from '@/components/ui/custom/CustomSection';
import { CustomSheet } from '@/components/ui/custom/CustomSheet';
import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ShiftType from './ShiftTypeComp';
import { formShiftTypeSchema } from '../../Schema/schema';
import useShiftTypesHttps from '../../queriesHttps/useShiftTypes';
import CustomModal from '@/components/ui/custom/CustomModal';

const ShiftTypeSection = () => {
    const [isOpenShift, setIsOpenShift] = React.useState(false);
    const [isEdit, setIsEdit] = React.useState(false);
    const [modalName, setModalName] = React.useState("");
    const [rowData, setRowData] = React.useState<any>();



    const defaultValues = {
        name: "",
        icon: "🚀",
        is_paid: false,
        include_employee_working_hours: false,
        employee_need_to_punch: false,
        deleted_when_schedule_cleared: true
    };
    const form = useForm<z.infer<typeof formShiftTypeSchema>>({
        resolver: zodResolver(formShiftTypeSchema),
        defaultValues,
    });
    const handleCloseSheet = () => {
        setIsOpenShift(false);
        setIsEdit(false)

        form.reset(defaultValues);
        setModalName('')
        setRowData(undefined)
    };
    const { ShiftTypesData, isLoadingShiftTypes, shiftTypeAdd, isLoadingAdd, shiftTypeDelete, shiftTypeEdit, isLoadingEdit, isLoadingShiftTypeOne,isLoadingDelete } =
        useShiftTypesHttps({
            handleCloseSheet: handleCloseSheet, shiftId: rowData,
            setShiftTypeOne: (data: any) => {
                form.reset(data)
            }
        })
    const onSubmit = (values: z.infer<typeof formShiftTypeSchema>) => {

        if (isEdit) {
            shiftTypeEdit({ ...values, shiftType_id: rowData })
            return;
        }
        shiftTypeAdd(values)
    };

    const handleConfirm = () => {
        if (modalName === "close edit") {
            handleCloseSheet();
        } else {
            shiftTypeDelete(rowData || "");
        }
    };



    return (
        <div className=" flex flex-col gap-8 ">

            <CustomSection
                title="Shift types"
                description="Add new shift type"
                setIsOpen={setIsOpenShift}
                Data={ShiftTypesData?.data?.filter((item: any) => item.type =="custom")?.map((item: any) => ({
                    name: item.name,
                    type: item.is_paid ? "Paid" : "Unpaid",
                    id: item.id,
                    icon: item.icon
                }))}
                isLoading={isLoadingShiftTypes}
                onClick={() => {
                    setIsOpenShift(true);

                }}
                onEdit={(e: any) => {
                    setRowData(e)
                    setIsOpenShift(true);
                    setIsEdit(true);
                }}
            />
            <CustomSheet
                isOpen={isOpenShift}
                isEdit={isEdit}
                isDirty={form.formState.isDirty}
                btnText={"Create"}
                handleCloseSheet={handleCloseSheet}
                headerLeftText={"Shift types"}
                form={form}
                isLoadingForm={isLoadingShiftTypeOne}
                isLoading={isLoadingAdd || isLoadingEdit}
                onSubmit={onSubmit}
                setModalName={setModalName}
            >
                <ShiftType />
            </CustomSheet>

            <CustomModal
                modalName={modalName}
                setModalName={setModalName}
                handleConfirm={handleConfirm}
                isPending={isLoadingDelete}
                deletedItemName={rowData?.name || ""}
            />
        </div>
    );
};

export default ShiftTypeSection;
