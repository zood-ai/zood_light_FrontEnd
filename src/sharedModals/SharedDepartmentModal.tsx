import LocationForm from '@/components/LocationForm';
import CustomModal from '@/components/ui/custom/CustomModal';
import { CustomSheet } from '@/components/ui/custom/CustomSheet';
import { Input } from '@/components/ui/input';
import useDepartmentsHttps from '@/modules/Settings/HrSettings/Departments/queriesHttp/useDepartmentHttp';
import { formDepartmentSchema } from '@/modules/Settings/HrSettings/Departments/Schema/schema';
import { IDepartment } from '@/modules/Settings/HrSettings/Departments/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const DepartmentModalShared = ({isOpen,setIsOpen,isEdit,setIsEdit}:{
  isOpen:boolean,
  setIsOpen:React.Dispatch<React.SetStateAction<boolean>>,
  isEdit?:boolean,
  setIsEdit?:React.Dispatch<React.SetStateAction<boolean>>
}) => {

  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<any>();
  const defaultValues = {
    name: "",
    branches: [],
  };
  const handleCloseSheet = () => {
    setIsOpen(false);
    setIsEdit?.(false);
    form.reset(defaultValues);
    setModalName("");
    setRowData(undefined);
  };
  const form = useForm<z.infer<typeof formDepartmentSchema>>({
    resolver: zodResolver(formDepartmentSchema),
    defaultValues,
  });
  const {
    departmentAdd,
    isLoadingAdd,
    departmentEdit,
    isLoadingEdit,
    departmentDelete,
    isLoadingDelete,
    isLoadingDepartmentSingle,
  } = useDepartmentsHttps({
    handleCloseSheet: handleCloseSheet,
    id: rowData?.id,
    setDepartmentOne: (data: any) => {
      form.reset(data);
    },
  });
  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      departmentDelete(rowData?.id || "");
    }
  };
  const onSubmit = (values: IDepartment) => {
    if (isEdit) {
      departmentEdit({ id: rowData?.id, ...values });
    } else {
      departmentAdd(values);
    }
  };
  return (
    <>
    <CustomSheet
    width='w-[700px]'
    isOpen={isOpen}
    isEdit={isEdit}
    btnText={"Create"}
    handleCloseSheet={handleCloseSheet}
    isDirty={form.formState.isDirty}
    headerLeftText={isOpen ? "New Department" : "Edit Department"}
    form={form}
    isLoadingForm={isLoadingDepartmentSingle}
    isLoading={isLoadingAdd || isLoadingDelete || isLoadingEdit}
    onSubmit={onSubmit}
    setModalName={setModalName}
    tabs={[
      {
        name: "Details",
        content:
          <Input
            label="Department name"
            type="text"
            value={form.watch("name")}
            className="w-[300px]"
            placeholder="Enter name"
            onChange={(e) => {
              form.setValue("name", e.target.value,{ shouldValidate: true,shouldDirty: true });
            }}
          />

      },
      {
        name: "Locations",
        content: (
          <>
            <LocationForm />
          </>
        ),
      },
    ]}
  />
  <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={rowData?.name}
      />
  </>
  )
}

export default DepartmentModalShared