import CustomSection from '@/components/ui/custom/CustomSection';
import { CustomSheet } from '@/components/ui/custom/CustomSheet';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { formRolesSchema } from './Schema/schema';
import AddEditRole from './components/AddEditRole';
import UseRoleHttp from './queriesRolesHttp/useRolesHttps';
import CustomModal from '@/components/ui/custom/CustomModal';

const Roles = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [rowData, setRowData] = useState<any>({})
    const [modalName, setModalName] = useState("");

    const defaultValues = {
        name: "",
        authorities: []
    };
    const form = useForm<z.infer<typeof formRolesSchema>>({
        resolver: zodResolver(formRolesSchema),
        defaultValues,
    });

    const handleCloseSheet = () => {
        setIsOpen(false);
        setIsEdit(false);
        setRowData({})
        setModalName("")
    };

    const { rolesData, isLoadingAdd, isLoadingEdit, isLoadingRoles, isLoadingDelete, roleAdd, roleDelete, roleEdit } = UseRoleHttp({ handleCloseSheet: handleCloseSheet })
    useEffect(() => {
        if (Object.values(rowData || {}).length > 0) {
            form.reset(rowData);
            setIsOpen(true);
        }
    }, [Object.values(rowData || {}).length > 0, form]);


    const onSubmit = (values: { name: string, authorities: [] }) => {
        if (!isEdit) {
            roleAdd({...values,model:1})
        } else {
            roleEdit({ id: rowData?.id, ...values,model:1 })
        }


    };
    const handleConfirm = () => {
        if (modalName === "close edit") {
            handleCloseSheet();
        } else {
            roleDelete(rowData?.id || "");
        }
    };


    return (
        <div className="ml-[241px] w-[645px]">
            <CustomSection
                title="Roles"
                description="Add new Role"
                setIsOpen={setIsOpen}
                Data={rolesData?.data}
                isLoading={isLoadingRoles}
                body={
                    <>
                        {rolesData?.data?.map((role: { name: string; id: string }) => (
                            <div
                                className="flex justify-between items-center border-b border-input px-2 py-5"
                                onClick={() => {
                                    setIsEdit(true)
                                    // setIsOpen(true)
                                    setRowData(role)
                                }}
                            >
                                <div>{role?.name}</div>
                                {/* <div className="font-bold">{ </div> */}
                            </div>
                        ))}
                    </>
                }
            />

            <CustomSheet
                isOpen={isOpen || isEdit}
                isEdit={isEdit}
                btnText={"Create"}
                handleCloseSheet={handleCloseSheet}
                headerLeftText={isOpen ? "New Role" : "Edit Role"}
                form={form}
                isLoading={isLoadingAdd || isLoadingEdit || isLoadingDelete}
                onSubmit={onSubmit}
                setModalName={setModalName}

            >
                <AddEditRole />
            </CustomSheet>
            <CustomModal
                modalName={modalName}
                setModalName={setModalName}
                handleConfirm={handleConfirm}
                deletedItemName={rowData?.name || ""}
            />
        </div>
    )
}

export default Roles