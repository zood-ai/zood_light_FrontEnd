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
import PositionModalShared from "@/sharedModals/SharedPositionModal";
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
 
  
  const handleCloseSheet = () => {
    setIsOpen(false);
    setIsEdit(false)
    form.reset(defaultValues);
    setModalName('')
    setRowData(undefined)
  };
  const { positionsData,
    isLoadingPositions,
    positionDelete,
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
      positionDelete(rowData?.id || "");
    }
  };

  return (
    <div className="ml-[241px] w-[645px] ">
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

     <PositionModalShared isOpen={isOpen} setIsOpen={setIsOpen} isEdit={isEdit} setIsEdit={setIsEdit} />
    </div>
  );
};

export default Departments;
