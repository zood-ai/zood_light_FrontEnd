import CustomSection from "@/components/ui/custom/CustomSection";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formLocationGroupsSchema } from "./Schema/schema";
import CustomModal from "@/components/ui/custom/CustomModal";
import useLocationGroupHttp from "./queriesHttp/useLocationGroupHttp";
import LocationGroupForm from "./components/LocationGroupForm";
const LocationGroup = () => {
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
    LocationGroupData,
    isLoadingLocationGroup,

    LocationGroupAdd,
    isLoadingAdd,

    isLoadingDelete,
    LocationGroupDelete,

    LocationGroupEdit,
    isLoadingEdit,
  } = useLocationGroupHttp({
    handleCloseSheet,
  });
  const defaultValues = {
    name: "",
    branches: [],
  };
  const form = useForm<z.infer<typeof formLocationGroupsSchema>>({
    resolver: zodResolver(formLocationGroupsSchema),
    defaultValues,
  });

  const onSubmit = (data: z.infer<typeof formLocationGroupsSchema>) => {
    if (isEdit) {
      LocationGroupEdit({ ...data, id: deletedId });
      return;
    }
    LocationGroupAdd(data);
  };

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      LocationGroupDelete(deletedId);
    }
  };
  return (
    <div className="ml-[241px] w-[645px]">
      <CustomSection
        title="LocationGroups"
        description="Add new Location Group"
        setIsOpen={setIsOpen}
        Data={LocationGroupData}
        isLoading={isLoadingLocationGroup}
        body={
          <>
            {LocationGroupData?.map(
              (LocationGroup: {
                name: string;
                id: string;
                branches: Array<{
                  id: string;
                }>;
              }) => (
                <div
                  className="flex items-center justify-between px-2 py-5 border-b border-input"
                  onClick={() => {
                    setIsEdit(true);
                    setIsOpen(true);
                    setDeletedId(LocationGroup?.id);
                    form.setValue(
                      "branches",
                      LocationGroup?.branches?.map((branch) => ({
                        id: branch.id,
                      }))
                    );
                    form.setValue("name", LocationGroup?.name);
                  }}
                >
                  <div>{LocationGroup?.name}</div>
                  {/* <div className="font-bold">{LocationGroup?.department?.name} </div> */}
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
        headerLeftText={!isEdit ? "New LocationGroup" : "Edit LocationGroup"}
        form={form}
        isLoading={isLoadingAdd || isLoadingDelete || isLoadingEdit}
        onSubmit={onSubmit}
        setModalName={setModalName}
      >
        <LocationGroupForm />
      </CustomSheet>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        isPending={isLoadingDelete}
        headerModal="Are you sure you want to delete this Location Group"
        confirmbtnText="Yes , Delete this Location Group"
        deletedItemName="This LocationGroup"
        descriptionModal="  "
      />
    </div>
  );
};

export default LocationGroup;
