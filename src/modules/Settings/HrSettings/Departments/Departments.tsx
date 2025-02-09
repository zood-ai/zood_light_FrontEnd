import CustomSection from "@/components/ui/custom/CustomSection";
import DepartmentModalShared from "@/sharedModals/SharedDepartmentModal";
import { useState } from "react";
import useDepartmentsHttps from "./queriesHttp/useDepartmentHttp";
const Departments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
    const [rowData, setRowData] = useState<any>();
  
  const handleCloseSheet = () => {
    setIsOpen(false);
    setIsEdit?.(false);
  
  };
  const { DepartmentsData, isLoadingDepartments } = useDepartmentsHttps({
    handleCloseSheet: handleCloseSheet,
    id: undefined,
    setDepartmentOne: (data: any) => {
      console.log(data);
    },
  });
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
            {DepartmentsData?.map(
              (dep: { id: string; name: string; branches: [] }) => (
                <div
                  className="flex justify-between items-center border-b border-input px-2 py-5"
                  onClick={() => {
                    setIsEdit(true);

                    setIsOpen(true);
                    setRowData(dep);
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
              )
            )}
          </>
        }
      />

      <DepartmentModalShared isOpen={isOpen} setIsOpen={setIsOpen} isEdit={isEdit} setIsEdit={setIsEdit} />
      
    </div>
  );
};

export default Departments;
