import LocationForm from '@/components/LocationForm';
import CustomModal from '@/components/ui/custom/CustomModal';
import CustomSelect from '@/components/ui/custom/CustomSelect';
import { CustomSheet } from '@/components/ui/custom/CustomSheet';
import { Input } from '@/components/ui/input';
import useCommonRequests from '@/hooks/useCommonRequests';
import usePositionsHttps from '@/modules/Settings/HrSettings/Positions/queriesHttp/usePositionsHttp';
import { formPositionSchema } from '@/modules/Settings/HrSettings/Positions/Schema/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const PositionModalShared = ({isOpen,setIsOpen,isEdit,setIsEdit}:{
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
  const form = useForm<z.infer<typeof formPositionSchema>>({
    resolver: zodResolver(formPositionSchema),
    defaultValues,
  });
  const {
   positionsData,
    isLoadingAdd,
   positionsEdit,
    isLoadingEdit,
    positionsAdd,
    isLoadingDelete,
    isLoadingPositionSingle,
    positionDelete
  } = usePositionsHttps({
    handleCloseSheet: handleCloseSheet,
    id: rowData?.id,
    setPositionsOne: (data: any) => {
      form.reset(data);
    },
  });
  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
        positionDelete(rowData?.id || "");
    }
  };
  const onSubmit = (values: any) => {
    if (isEdit) {
        positionsEdit({ id: rowData?.id, ...values });
    } else {
      positionsAdd(values);
    }
  };
  const { departmentsData } = useCommonRequests({ getDepartments: true})
  return (
    <>
     <CustomSheet
     width='w-[700px]'
        isOpen={isOpen}
        isEdit={isEdit}
        isDirty={form.formState.isDirty}
        btnText={"Create"}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={(isOpen && isEdit) ? "Edit Position" : "New Position"}
        form={form}
        isLoadingForm={isLoadingPositionSingle}
        isLoading={isLoadingEdit || isLoadingDelete || isLoadingAdd}
        onSubmit={onSubmit}
        setModalName={setModalName}
      >
        <>
          <Input
            type="text"
            label="Name Position"
            value={form.watch("name")}
            className="w-[300px]"
            placeholder="Enter name"
            onChange={(e) => {
              form.setValue("name", e.target.value, { shouldValidate: true, shouldDirty: true });
            }}
          />
          <CustomSelect
            label="Department"
            name="forecast_department_id"
            options={departmentsData?.map((dep) => ({ label: dep.name, value: dep.id }))}
            width="w-[300px]"
            value={form.watch("forecast_department_id")}
            optionDefaultLabel="Select Department"
            onValueChange={(e) =>
              form.setValue(`forecast_department_id`, e, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }

          />
        </>
      </CustomSheet>
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={rowData?.name}
      />
  </>
  )
}

export default PositionModalShared