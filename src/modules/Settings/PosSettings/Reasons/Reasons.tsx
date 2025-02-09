import CustomSection from "@/components/ui/custom/CustomSection";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import React, { useState } from "react";
import useReasonsHttps from "./queriesHttp/useReasonsHttp";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import FormReason from "./components/FormReason";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formReasonSchema } from "./Schema/schema";
import { z } from "zod";
import { IReason } from "./types/type";
import CustomModal from "@/components/ui/custom/CustomModal";

const Reasons = () => {
  const [isOpenVoid, setIsOpenVoid] = useState(false);
  const [isOpenWaste, setIsOpenWaste] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isEditVoid, setIsEditVoid] = useState(false);
  const [isEditWaste, setIsEditWaste] = useState(false);
  const [isEditDrawer, setIsEditDrawer] = useState(false);
  const [rowData, setRowData] = useState<any>();
  const [modalName, setModalName] = useState("");
  const defaultValues = { name: "", name_localized: "" };
  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      deleteReason(rowData);
    }
  };
  const form = useForm<z.infer<typeof formReasonSchema>>({
    resolver: zodResolver(formReasonSchema),
    defaultValues,
  });

  const handleCloseSheet = () => {
    setIsOpenVoid(false);
    setIsOpenWaste(false);
    setIsOpenDrawer(false);
    setIsEditDrawer(false);
    setIsEditWaste(false);
    setIsEditVoid(false);
    form.reset(defaultValues);
    setModalName("");
  };
  const {
    ReasonsData,
    isLoadingResons,
    isLoadingCreateReason,
    createReason,
    isLoadingEditReason,
    isLoadingReasonOne,
    editReason,
    deleteReason,
    isLoadingDeleteReason,
  } = useReasonsHttps({
    handleCloseSheet: handleCloseSheet,
    reasonId: rowData,
    setReasonOne: (data: any) => {
      form.reset(data);
    },
  });
  const onSubmit = (values: IReason) => {
    if (isEditVoid) {
      editReason({ type: 1, ...values });
    }
    if (isEditWaste) {
      editReason({ type: 2, ...values });
    }
    if (isEditDrawer) {
      editReason({ type: 3, ...values });
    }

    if (isOpenVoid) {
      createReason({ type: 1, ...values });
    }
    if (isOpenWaste) {
      createReason({ type: 2, ...values });
    }
    if (isOpenDrawer) {
      createReason({ type: 3, ...values });
    }
  };

  console.log(isEditWaste);

  return (
    <div className="ml-[241px] w-[645px]">
      <HeaderPage title="Reasons" />
      <div className="flex flex-col gap-5">
        {/* Void Reason */}
        <CustomSection
          title="Void and Return Reason"
          body={
            <>
              {ReasonsData?.data?.void_reasons_arr?.map(
                (reason: { name: string; id: string }) => (
                  <p
                    className="my-4 border-b border-input py-2"
                    onClick={() => {
                      setIsEditVoid(true);
                      setRowData(reason?.id);
                    }}
                  >
                    {reason?.name}
                  </p>
                )
              )}
            </>
          }
          description="Add new reason"
          isLoading={isLoadingResons}
          setIsOpen={setIsOpenVoid}
          Data={ReasonsData?.data?.void_reasons_arr}
        />
        {/* Waste Reason */}
        <CustomSection
          title="Waste Reason"
          body={
            <>
              {ReasonsData?.data?.qty_adjust_reasons_arr?.map(
                (reason: { name: string; id: string }) => (
                  <p
                    className="my-4 border-b border-input py-2"
                    onClick={() => {
                      setIsEditWaste(true);
                      setRowData(reason?.id);
                    }}
                  >
                    {reason?.name}
                  </p>
                )
              )}
            </>
          }
          description="Add new reason"
          isLoading={isLoadingResons}
          setIsOpen={setIsOpenWaste}
          Data={ReasonsData?.data?.void_reasons_arr}
        />{" "}
        {/* Drawer Operation Reason */}
        <CustomSection
          title="Drawer Operation Reason"
          body={
            <>
              {ReasonsData?.data?.drawer_operation_arr?.map(
                (reason: { name: string; id: string }) => (
                  <p
                    className="my-4 border-b border-input py-2"
                    onClick={() => {
                      setIsEditDrawer(true);
                      setRowData(reason?.id);
                    }}
                  >
                    {reason?.name}
                  </p>
                )
              )}
            </>
          }
          description="Add new reason"
          isLoading={isLoadingResons}
          setIsOpen={setIsOpenDrawer}
          Data={ReasonsData?.data?.drawer_operation_arr}
        />
        {/* Sheet */}
        <CustomSheet
          isOpen={
            isOpenWaste ||
            isOpenDrawer ||
            isOpenVoid ||
            isEditVoid ||
            isEditWaste ||
            isEditDrawer
          }
          isEdit={isEditVoid || isEditWaste || isEditDrawer}
          btnText={"Create"}
          handleCloseSheet={handleCloseSheet}
          headerLeftText={
            isOpenWaste || isOpenDrawer || isOpenVoid
              ? "New Reason"
              : "Edit Reason"
          }
          form={form}
          isLoadingForm={isLoadingReasonOne}
          isLoading={
            isLoadingCreateReason ||
            isLoadingEditReason ||
            isLoadingDeleteReason
          }
          onSubmit={onSubmit}
          setModalName={setModalName}
        >
          <FormReason />
        </CustomSheet>
      </div>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={rowData?.name || ""}
      />
    </div>
  );
};

export default Reasons;
