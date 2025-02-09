import CustomSection from "@/components/ui/custom/CustomSection";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formStationsSchema } from "./Schema/schema";
import StationForm from "./components/StationForm";
import useStationHttp from "./queriesHttp/useStationHttp";
import CustomModal from "@/components/ui/custom/CustomModal";
const Stations = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");

  const [deletedId, setDeletedId] = useState("");

  const handleCloseSheet = () => {
    setIsOpen(false);
    setIsEdit(false);
    setModalName("");
    setDeletedId("");
    form.reset(defaultValues);
  };

  const {
    StationData,
    isLoadingStation,

    StationAdd,
    isLoadingAdd,

    isLoadingDelete,
    stationDelete,
  } = useStationHttp({
    handleCloseSheet,
  });
  const defaultValues = {
    name: "",
    department_id: "",
  };
  const form = useForm<z.infer<typeof formStationsSchema>>({
    resolver: zodResolver(formStationsSchema),
    defaultValues,
  });

  const onSubmit = (data: z.infer<typeof formStationsSchema>) => {
    StationAdd(data);
  };

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      stationDelete(deletedId);
    }
  };
  return (
    <div className="ml-[241px] w-[645px]">
      <CustomSection
        title="Stations"
        description="Add new station"
        setIsOpen={setIsOpen}
        Data={StationData?.data}
        isLoading={isLoadingStation}
        body={
          <>
            {StationData?.data?.map(
              (station: {
                name: string;
                id: string;
                department_id: string;
              }) => (
                <div
                  className="flex items-center justify-between px-2 py-5 border-b border-input"
                  onClick={() => {
                    setIsEdit(true);
                    setIsOpen(true);
                    setDeletedId(station?.id);
                    form.setValue("department_id", station?.department_id);
                    form.setValue("name", station?.name);
                  }}
                >
                  <div>{station?.name}</div>
                  {/* <div className="font-bold">{station?.department?.name} </div> */}
                </div>
              )
            )}
          </>
        }
      />

      <CustomSheet
        isOpen={isOpen}
        isEdit={isEdit}
        isDirty={form.formState.isDirty}
        btnText={"Create"}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={!isEdit ? "New Station" : "Edit Station"}
        form={form}
        isLoading={isLoadingAdd || isLoadingDelete}
        onSubmit={onSubmit}
        setModalName={setModalName}
      >
        <StationForm isEdit={isEdit} />
      </CustomSheet>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        isPending={isLoadingDelete}
        headerModal="Are you sure you want to delete this station"
        confirmbtnText="Yes , Delete this station"
        deletedItemName="This station"
        descriptionModal="  "
      />
    </div>
  );
};

export default Stations;
