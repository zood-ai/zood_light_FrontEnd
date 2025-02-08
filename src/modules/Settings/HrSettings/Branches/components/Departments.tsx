import CustomSection from "@/components/ui/custom/CustomSection";
import DepartmentModalShared from "@/sharedModals/SharedDepartmentModal";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

const Departments = () => {
  const { watch } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-3">
      <CustomSection
        title="Departments"
        description="Add new department"
        setIsOpen={setIsOpen}
        Data={watch("departments")}
        isLoading={false}
        border={false}
        body={
          <>
            {watch("departments")?.map(
              (dep: { id: string; name: string; branches: [] }) => (
                <div className="flex justify-between items-center border-b border-input px-2 py-5">
                  <div>{dep?.name}</div>
                </div>
              )
            )}
          </>
        }
      />
      <DepartmentModalShared isOpen={isOpen} setIsOpen={setIsOpen}  />
    </div>
  );
};

export default Departments;
