import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import React, { useState } from "react";
import TaxForm from "./components/TaxForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formTaxesGroupSchema, formTaxesSchema } from "./Schema/schems";
import { z } from "zod";
import useTaxesHttps from "./queriesHttp/useTaxesHttp";
import { Skeleton } from "@/components/ui/skeleton";
import CustomSection from "@/components/ui/custom/CustomSection";
import { ITax, ITaxGroup } from "./Types/types";
import CustomModal from "@/components/ui/custom/CustomModal";
import TaxGroupForm from "./components/TaxGroupForm";

const Taxes = () => {
  const [isOpenTax, setIsOpenTax] = useState(false);
  const [isEditTax, setIsEditTax] = useState(false);
  const [isOpenTaxGroup, setIsOpenTaxGroup] = useState(false);
  const [isEditTaxGroup, setIsEditTaxGroup] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<ITax>();
  const [rowDataTaxGroup, setRowDataTaxGroup] = useState<ITaxGroup>();

  const handleCloseSheet = () => {
    setIsOpenTax(false);
    setIsEditTax(false);
    setIsOpenTaxGroup(false);
    setIsEditTaxGroup(false);
    setModalName("");
    form.reset({
      name: "",
      name_localized: "",
      rate: 0,
      applies_on_order_types: [],
    });
    formTaxGroup.reset({
      name: "",
      name_localized: "",
      reference: "",
      taxes: [],
    });
  };

  const defaultValues = isOpenTaxGroup
    ? {
        name: "",
        name_localized: "",
        reference: "",
        taxes: [],
      }
    : {
        name: "",
        name_localized: "",
        rate: 0,
        applies_on_order_types: [],
      };

  const form = useForm<z.infer<typeof formTaxesSchema>>({
    resolver: zodResolver(formTaxesSchema),
    defaultValues,
  });

  const formTaxGroup = useForm<z.infer<typeof formTaxesGroupSchema>>({
    resolver: zodResolver(formTaxesGroupSchema),
    defaultValues,
  });

  const onSubmit = (values: z.infer<typeof formTaxesSchema>) => {
    if (isEditTax) {
      taxEdit(values);
      return;
    }
    taxCreate(values);
  };

  console.log(formTaxGroup.formState.errors);

  const onSubmitTaxGroup = (values: z.infer<typeof formTaxesGroupSchema>) => {
    if (isOpenTaxGroup) {
      taxGroupCreate(values);
      return;
    }
    taxGroupEdit(values);
  };

  const {
    TaxesData,
    TaxGroupsData,
    isLoadingTaxes,
    isLoadingTaxGroups,
    taxCreate,
    isLoadingCreate,
    taxEdit,
    isLoadingEdit,
    isLoadingTaxOne,
    taxDelete,
    isLoadingDelete,
    taxGroupCreate,
    isLoadingCreateTaxGroup,
    taxGroupEdit,
    isLoadingEditTaxGroup,
    taxGroupDelete,
    isLoadingTaxGroupOne,
    isLoadingDeleteTaxGroup,
  } = useTaxesHttps({
    handleCloseSheet: handleCloseSheet,
    taxId: rowData?.id,
    taxGroupId: rowDataTaxGroup?.id,
    setTaxOne: (data: any) => {
      form.reset(data);
    },
    setTaxGroupOne: (data: any) => {
      formTaxGroup.reset(data);
    },
  });

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      taxDelete(rowData?.id);
    }
  };
  const handleConfirmTaxGroup = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      taxGroupDelete(rowDataTaxGroup?.id);
    }
  };

  return (
    <div className="ml-[241px] w-[645px]">
      <HeaderPage title="Taxes & Tax group" />
      {/******************************************************************** taxes  /********************************************************************/}

      <CustomSection
        title="Taxes"
        description="Add new tax"
        setIsOpen={setIsOpenTax}
        isLoading={isLoadingTaxes}
        Data={TaxesData?.data}
        body={
          <>
            {TaxesData?.data?.map(
              (tax: { name: string; rate: number; id: string }) => (
                <div
                  className="flex justify-between items-center border-b border-input px-2 py-5"
                  onClick={() => {
                    setIsEditTax(true);
                    setRowData(tax);
                  }}
                >
                  <div>{tax?.name}</div>
                  <div className="font-bold">{tax?.rate} %</div>
                </div>
              )
            )}
          </>
        }
      />
      {/******************************************************************** taxes Group /********************************************************************/}
      <div className="mt-5">
        <CustomSection
          title="Tax Group"
          description="Add new tax group"
          setIsOpen={setIsOpenTaxGroup}
          isLoading={isLoadingTaxGroups}
          Data={TaxGroupsData?.data}
          body={TaxGroupsData?.data?.map((tax: any) => (
            <div
              className="flex justify-between items-center border-b border-input px-2 py-5"
              onClick={() => {
                setIsEditTaxGroup(true);
                setRowDataTaxGroup(tax);
              }}
            >
              <div>{tax?.name}</div>
              <div className="flex gap-2">
                {tax?.taxes
                  ?.slice(0, 3)
                  ?.map((tag: { id: string; name: string }) => (
                    <div
                      key={tag?.id}
                      className="flex gap-1 w-fit p-2 h-[30px] rounded-[4px] items-center border-[#91DFF2] bg-muted-foreground justify-center"
                    >
                      {tag?.name}
                    </div>
                  ))}{" "}
                {tax?.taxes?.length > 3 && (
                  <div className="h-7 w-7 rounded-full border-[3px] border-[#7AE0F6] text-center pt-[2px] px-[1px] text-[13px] font-bold">
                    {" "}
                    <span className="text-[#7AE0F6]">+</span>{" "}
                    {tax?.taxes?.length - 3}
                  </div>
                )}
              </div>
            </div>
          ))}
        />
      </div>

      {/******************************************************************** taxes  /********************************************************************/}

      <CustomSheet
        isOpen={isOpenTax || isEditTax}
        isEdit={isEditTax}
        btnText={"Create"}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={isOpenTax ? "New Tax" : "Edit Tax"}
        form={form}
        isLoadingForm={isLoadingTaxOne}
        isLoading={isLoadingCreate || isLoadingEdit || isLoadingDelete}
        onSubmit={onSubmit}
        setModalName={setModalName}
      >
        <TaxForm />
      </CustomSheet>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={isEditTaxGroup ? handleConfirmTaxGroup : handleConfirm}
        deletedItemName={rowData?.name || rowDataTaxGroup?.name}
      />

      {/******************************************************************** taxes group  /********************************************************************/}

      <CustomSheet
        isOpen={isOpenTaxGroup || isEditTaxGroup}
        isEdit={isEditTaxGroup}
        btnText={"Create"}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={isOpenTaxGroup ? "New Tax Group" : "Edit Tax Group"}
        form={formTaxGroup}
        isLoadingForm={isLoadingTaxGroupOne}
        isLoading={
          isLoadingCreateTaxGroup ||
          isLoadingEditTaxGroup ||
          isLoadingDeleteTaxGroup
        }
        onSubmit={onSubmitTaxGroup}
        setModalName={setModalName}
      >
        <TaxGroupForm />
      </CustomSheet>
    </div>
  );
};

export default Taxes;
