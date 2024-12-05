import CustomSection from "@/components/ui/custom/CustomSection";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LocationForm from "@/components/LocationForm";
import { formPositionSchema } from "./Schema/schema";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import useCommonRequests from "@/hooks/useCommonRequests";
import usePositionsHttps from "./queriesHttp/usePositionsHttp";
import CustomModal from "@/components/ui/custom/CustomModal";
import useFilterQuery from "@/hooks/useFilterQuery";
const Departments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<any>();
  const [isEdit, setIsEdit] = useState(false);
const {filterObj}=useFilterQuery()

  const defaultValues = {
    name: "",
    forecast_department_id: ""
  };
  const form = useForm<z.infer<typeof formPositionSchema>>({
    resolver: zodResolver(formPositionSchema),
    defaultValues,
  });
  const { departmentsData } = useCommonRequests({ getDepartments: true, locationId: filterObj['filter[branch]'] })
 
  console.log(filterObj["filter ['branch']"]);
  
  const handleCloseSheet = () => {
    setIsOpen(false);
    setIsEdit(false)
    form.reset(defaultValues);
    setModalName('')
    setRowData(undefined)
  };
  const { positionsData,
    isLoadingPositions,
    departmentDelete,
    isLoadingPositionSingle,
    positionsAdd, isLoadingAdd,
    isLoadingEdit,
    positionsEdit,
    isLoadingDelete } = usePositionsHttps({
      handleCloseSheet: handleCloseSheet, id: rowData?.id,
      setPositionsOne: (data: any) => {
        form.reset(data);
      }
    })
  const onSubmit = (values: any) => {
    if (isEdit) {
      positionsEdit({ id: rowData?.id, ...values })
    } else {
      positionsAdd(values)
    }
  };

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      departmentDelete(rowData?.id || "");
    }
  };

  console.log(form.formState.errors)
  return (
    <div className="ml-[241px] w-[645px]">
      <CustomSection
        title="Positions"
        description="Add new position"
        setIsOpen={setIsOpen}
        Data={positionsData}
        isLoading={isLoadingPositions}
        body={
          <>
            {positionsData?.map((position: { name: string; id: string, department: { name: string } }) => (
              <div
                className="flex justify-between items-center border-b border-input px-2 py-5"
                onClick={() => {
                  setIsEdit(true);
                  setIsOpen(true);
                  setRowData(position)
                }}
              >
                <div>{position?.name}</div>
                <div className="font-bold">{position?.department?.name} </div>
              </div>
            ))}
          </>
        }
      />

      <CustomSheet
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
    </div>
  );
};

export default Departments;
