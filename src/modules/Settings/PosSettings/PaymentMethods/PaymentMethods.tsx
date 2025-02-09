import CustomSection from "@/components/ui/custom/CustomSection";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import React, { useState } from "react";
import usePaymentMethodsHttps from "./queriesHttp/usePaymentsMethodsHttp";
import { Badge } from "@/components/ui/badge";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import FormPaymentMethod from "./components/FormPaymentMethod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formPaymentMethodsSchema } from "./schema/schema";
import { z } from "zod";
import CustomModal from "@/components/ui/custom/CustomModal";
import { IPaymentMethods } from "./types/types";

interface IPaymentMethod {
  name: string;
  id: string;
  name_localized: string;
  type: string;
  is_active: number;
  auto_open_drawer: number;
  code: string;
}
const PaymentMethods = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [modalName, setModalName] = useState("");
  const [rowData, setRowData] = useState<any>();

  const defaultValues = {
    name: "",
    name_localized: "",
  };
  const form = useForm<z.infer<typeof formPaymentMethodsSchema>>({
    resolver: zodResolver(formPaymentMethodsSchema),
    defaultValues,
  });
  const handleCloseSheet = () => {
    setIsEdit(false);
    setIsOpen(false);
    form.reset(defaultValues);
    setRowData({});
    setModalName("");
  };

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      deletePaymentMethod(rowData?.id);
    }
  };
  const onSubmit = (values: IPaymentMethods) => {
    if (isOpen) {
      createPatmentMethods(values);
      return;
    }
    editPaymentMethod(values);
  };

  const {
    isLoadingPaymentMethods,
    PaymentMethodsData,
    isLoadingCreatePatmentMethods,
    createPatmentMethods,
    editPaymentMethod,
    isLoadingEditPaymentMethod,

    deletePaymentMethod,
    isLoadingDeletePaymentMethod,
  } = usePaymentMethodsHttps({
    PaymentMethodId: rowData,
    handleCloseSheet: handleCloseSheet,
  });
  return (
    <div className="ml-[241px] w-[645px]">
      <HeaderPage title="Add payment method" />
      <div className="flex flex-col gap-5">
        {/*Cash */}
        <CustomSection
          title="Cash"
          onClick={() => {
            form.setValue("type", "1");
          }}
          body={
            <>
              {PaymentMethodsData?.data
                ?.filter((res: { type: string }) => res.type == "1")
                ?.map((PaymentMethod: IPaymentMethod) => (
                  <p
                    className="my-4 border-b border-input py-2 flex justify-between items-center"
                    onClick={() => {
                      form.setValue("type", "1");

                      form.reset({
                        code: PaymentMethod?.code,
                        name: PaymentMethod?.name,
                        name_localized: PaymentMethod?.name_localized,
                        type: PaymentMethod?.type,
                        is_active: PaymentMethod?.is_active,
                        auto_open_drawer: PaymentMethod?.auto_open_drawer,
                      });
                      setRowData(PaymentMethod?.id);
                      setIsEdit(true);
                    }}
                  >
                    <p>{PaymentMethod?.name}</p>
                    <p>
                      {PaymentMethod?.is_active == 1 ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Inactive</Badge>
                      )}
                    </p>
                  </p>
                ))}
            </>
          }
          description="Add new cash payment method"
          isLoading={isLoadingPaymentMethods}
          setIsOpen={setIsOpen}
          Data={PaymentMethodsData?.data?.map(
            (res: { type: string }) => res.type == "1"
          )}
        />
        {/*Card */}
        <CustomSection
          title="Card"
          onClick={() => {
            form.setValue("type", "2");
          }}
          body={
            <>
              {PaymentMethodsData?.data
                ?.filter((res: { type: string }) => res.type == "2")
                ?.map((PaymentMethod: IPaymentMethod) => (
                  <p
                    className="my-4 border-b border-input py-2 flex justify-between items-center"
                    onClick={() => {
                      form.setValue("type", "2");

                      form.reset({
                        code: PaymentMethod?.code,
                        name: PaymentMethod?.name,
                        name_localized: PaymentMethod?.name_localized,
                        type: PaymentMethod?.type,
                        is_active: PaymentMethod?.is_active,
                        auto_open_drawer: PaymentMethod?.auto_open_drawer,
                      });
                      setRowData(PaymentMethod?.id);
                      setIsEdit(true);
                    }}
                  >
                    <p>{PaymentMethod?.name}</p>
                    <p>
                      {PaymentMethod?.is_active == 1 ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Inactive</Badge>
                      )}
                    </p>
                  </p>
                ))}
            </>
          }
          description="Add new card payment method"
          isLoading={isLoadingPaymentMethods}
          setIsOpen={setIsOpen}
          Data={PaymentMethodsData?.data?.filter(
            (res: { type: string }) => res.type == "2"
          )}
        />

        {/*Other */}
        <CustomSection
          title="Other"
          onClick={() => {
            form.setValue("type", "3");
          }}
          body={
            <>
              {PaymentMethodsData?.data
                ?.filter((res: { type: string }) => res.type == "3")
                ?.map((PaymentMethod: IPaymentMethod) => (
                  <p
                    className="my-4 border-b border-input py-2 flex justify-between items-center"
                    onClick={() => {
                      setRowData(PaymentMethod?.id);
                      setIsEdit(true);

                      form.setValue("type", "3");
                    }}
                  >
                    <p>{PaymentMethod?.name}</p>
                    <p>
                      {PaymentMethod?.is_active == 1 ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Inactive</Badge>
                      )}
                    </p>
                  </p>
                ))}
            </>
          }
          description="Add new other payment method"
          isLoading={isLoadingPaymentMethods}
          setIsOpen={setIsOpen}
          Data={PaymentMethodsData?.data?.filter(
            (res: { type: string }) => res.type == "3"
          )}
        />
      </div>

      {/* Sheet */}
      <CustomSheet
        isOpen={isOpen || isEdit}
        isEdit={isEdit}
        btnText={"Create"}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={isOpen ? "New Payment Method" : "Edit Payment Method"}
        form={form}
        isLoading={
          isLoadingCreatePatmentMethods ||
          isLoadingEditPaymentMethod ||
          isLoadingDeletePaymentMethod
        }
        onSubmit={onSubmit}
        setModalName={setModalName}
      >
        <FormPaymentMethod isEdit={isEdit} />
      </CustomSheet>

      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={rowData?.name || ""}
      />
    </div>
  );
};

export default PaymentMethods;
