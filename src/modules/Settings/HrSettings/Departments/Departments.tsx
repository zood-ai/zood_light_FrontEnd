import CustomSection from "@/components/ui/custom/CustomSection";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formDepartmentSchema } from "./Schema/schema";
import LocationForm from "@/components/LocationForm";
import useDepartmentsHttps from "./queriesHttp/useDepartmentHttp";
import CustomModal from "@/components/ui/custom/CustomModal";
import { IDepartment } from "./types/types";
const Departments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<any>();
  const [isEdit, setIsEdit] = useState(false);
  const defaultValues = {
    name: "",
    branches: []
  };
  const handleCloseSheet = () => {
    setIsOpen(false);
    setIsEdit(false)
    form.reset(defaultValues);
    setModalName('')
    setRowData(undefined)
  };
  const form = useForm<z.infer<typeof formDepartmentSchema>>({
    resolver: zodResolver(formDepartmentSchema),
    defaultValues,
  });
  const { DepartmentsData, isLoadingDepartments, departmentAdd, isLoadingAdd, departmentEdit, isLoadingEdit, departmentDelete, isLoadingDelete, isLoadingDepartmentSingle }
    = useDepartmentsHttps({
      handleCloseSheet: handleCloseSheet, id: rowData?.id, setDepartmentOne: (data: any) => {
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
      departmentEdit({ id: rowData?.id, ...values })
    } else {
      departmentAdd(values)
    }

  };

  console.log(form.watch("name"));


  return (
    <div className="ml-[241px] w-[645px]">
      <CustomSection
        title="Departments"
        description="Add new department"
        setIsOpen={setIsOpen}
        Data={DepartmentsData}
        isLoading={isLoadingDepartments}
        body={
          <>
            {DepartmentsData?.map((dep: { id: string, name: string; branches: [] }) => (
              <div
                className="flex justify-between items-center border-b border-input px-2 py-5"
                onClick={() => {
                  setIsEdit(true);

                  setIsOpen(true);
                  setRowData(dep)
                }}
              >
                <div>{dep?.name}</div>
                <div className="flex gap-2">
                  {dep?.branches
                    ?.slice(0, 3)
                    ?.map((tag: { id: string; name: string }) => (
                      <div
                        key={tag?.id}
                        className="flex gap-1 w-fit p-2 h-[30px] rounded-[4px] items-center border-[#91DFF2] bg-muted-foreground justify-center"
                      >
                        {tag?.name}
                      </div>
                    ))}{" "}
                  {dep?.branches?.length > 3 && (
                    <div className="h-7 w-7 rounded-full border-[3px] border-[#7AE0F6] text-center pt-[2px] px-[1px] text-[13px] font-bold">
                      {" "}
                      <span className="text-[#7AE0F6]">+</span>{" "}
                      {dep?.branches?.length - 3}
                    </div>
                  )}
                </div>


              </div>
            ))}
          </>
        }
      />

      <CustomSheet
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
                  form.setValue("name", e.target.value);
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
    </div>
  );
};

export default Departments;
