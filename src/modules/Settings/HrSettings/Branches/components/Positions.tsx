import CustomSection from "@/components/ui/custom/CustomSection";
import PositionModalShared from "@/sharedModals/SharedPositionModal";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

const Positions = () => {
  const { watch } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [rowData, setRowData] = useState<any>();

  return (
    <div className="mx-3">
      <CustomSection
        title="Positions"
        description="Add new position"
        setIsOpen={setIsOpen}
        Data={watch("postions")}
        isLoading={false}
        border={false}
        body={
          <>
            {watch("departments")?.map((pos: any) => (
              <>
                {pos?.positions?.map((postion: any) => (
                  <div
                    key={postion.id}
                    className="flex items-center gap-3 border-b-2 border-border py-4"
                  >
                    <p>{postion.name}</p>
                  </div>
                ))}
              </>
            ))}
          </>
        }
      />
      <PositionModalShared isOpen={isOpen} setIsOpen={setIsOpen} isEdit={isEdit} setIsEdit={setIsEdit} />
    </div>
  );
};

export default Positions;
