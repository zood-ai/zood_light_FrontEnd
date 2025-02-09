import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import useInvoiceHttp from "../../Invoice/queriesHttp/useInvoiceHttp";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { CreditNotes } from "../../Invoice/components/CreditNotes";
import { Label } from "@/components/ui/label";
const InvoiceForm = ({
  setIsEditItem,
  rowDataInvoice,
  openCloseModal,
  setModalName,
  setOpenCloseModal,
}: {
  setIsEditItem: Dispatch<SetStateAction<boolean>>;
  rowDataInvoice: any;
  openCloseModal: boolean;
  setModalName: any;
  setOpenCloseModal: Dispatch<SetStateAction<boolean>>;
}) => {



  const defaultValues = {
    item: { name: "", id: "" },
    invoice_number: "",
    purchase_order_id: "",
    invoice_date: "",
    business_date: "",
    total_tax: 0,
    sub_total: 0,
    status: "4",
    branch: "",
    total: 0,
    creditNotes: [],
    credit_notes_price: [],
    accept_price_change_from_supplier: 0,
    items: [],
    image: "",
  };
  const handleCloseSheet = () => {
    form.reset(defaultValues);
    setOpenCloseModal(false);
  };
  const { invoiceOne, isPendingInvoiceOne } = useInvoiceHttp({
    invoiceId: rowDataInvoice,
    handleCloseSheet: handleCloseSheet,
    setInvoiceOne: (data: any) => {
      form.reset(data);
    },
  });

  const form = useForm({});
  const onSubmit = (values: any) => { };

  return (
    <CustomSheet
      isOpen={openCloseModal}
      handleCloseSheet={handleCloseSheet}
      headerLeftText={"Waste details"}
      form={form}
      isLoadingForm={isPendingInvoiceOne}
      setModalName={setModalName}
      headerStyle="border-b-0 flex items-center justify-between w-full"
      contentStyle="p-0"
      onSubmit={onSubmit}
      purchaseHeader={
        <>
          Order Details #{invoiceOne?.invoice_number}
          <Badge variant="success">Closed</Badge>
          {(invoiceOne?.accept_price_change_from_supplier == 1) && (
            <Badge variant="success">Price change</Badge>
          )}
        </>
      }
    >
      <>
        <div className="pb-20">
          {/* invoice info */}
          <div className="flex justify-between bg-popover p-2 m-2 rounded-[4px]">
            <div className="flex flex-col gap-8">
              <p>
                invoice number <span className="text-warn">*</span>
              </p>
              <p>invoice Date</p>
              <p>Received on</p>
            </div>
            <div className="flex flex-col gap-3">
              <Input
                className="w-[150px]"
                defaultValue={invoiceOne?.invoice_number}
                disabled={true}
              />
              <CustomInputDate
                disabled={true}
                defaultValue={invoiceOne?.invoice_date}
                onSelect={(selectedDate) => { }}

              />
              <CustomInputDate
                disabled={true}
                defaultValue={invoiceOne?.business_date}
                onSelect={(selectedDate) => { }}

              />
            </div>
          </div>
          {/* credit notes */}
          <>
            {invoiceOne?.creditNotices?.filter(
              (item: { status: number }) => item?.status == 1
            )?.length ||
              invoiceOne?.creditNotices?.filter(
                (item: { status: number }) => item?.status == 2
              )?.length ? (
              <>
                <div className="bg-warn-foreground border border-warn rounded-[8px] p-2 mt-2 mx-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-textPrimary font-semibold">
                      Credit notes
                    </h2>
                    <div className="flex items-center gap-6">
                      <h2 className="text-textPrimary font-semibold">Type</h2>
                      <h2 className="text-textPrimary font-semibold">Credit</h2>
                    </div>
                  </div>
                  {/* receive */}
                  {invoiceOne?.creditNotices
                    ?.filter((item: { status: number }) => item?.status == 1)
                    ?.map(
                      (credit: {
                        status: number;
                        id: number;
                        type: string;
                        credit_amount: number;
                        name: string;
                        cost: number;
                        invoice_quantity: number;
                        note: string;
                        quantity: number;
                        old_cost: number;
                      }) => (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center pb-2 justify-between mt-2 border-warn-foreground border-b-[1px]">
                            <div className="flex gap-3">
                              <Label className="flex  flex-col gap-2 text-textPrimary">
                                {credit?.name}
                                <div className="flex gap-2">
                                  <span className="text-warn text-[12px] font-medium">
                                    {credit.note}
                                  </span>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center gap-6">
                              <h2 className="text-textPrimary font-medium capitalize">
                                {credit?.type}
                              </h2>
                              <h2 className="text-textPrimary font-medium">
                                SAR {credit?.credit_amount}
                              </h2>
                            </div>
                          </div>
                        </div>
                      )
                    )}

                  {invoiceOne?.creditNotices?.filter(
                    (item: { status: number }) => item?.status == 2
                  )?.length ? (
                    <div className="border-t-[1px] py-2 mt-2">
                      <p className="font-bold">Received</p>
                      {/* un */}
                      {invoiceOne?.creditNotices
                        ?.filter(
                          (item: { status: number }) => item?.status == 2
                        )
                        ?.map((credit: any) => (
                          <>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center pb-2 justify-between mt-2">
                                <div className="flex gap-3">
                                  <Label className="flex  flex-col gap-2 text-textPrimary">
                                    {credit?.name}
                                    <div className="flex gap-2">
                                      <span className="text-warn text-[12px] font-medium">
                                        Order:{" "}
                                        {credit.type == "price" ? (
                                          <>{credit?.cost}</>
                                        ) : (
                                          <>{credit?.invoice_quantity}</>
                                        )}
                                      </span>
                                      <span className="text-warn text-[12px] font-medium ">
                                        Invoice:{" "}
                                        {credit.type == "price" ? (
                                          <>{credit?.old_cost}</>
                                        ) : (
                                          <>{credit?.quantity}</>
                                        )}
                                      </span>
                                      {credit.type !== "price" && (
                                        <span className="text-warn text-[12px] font-medium">
                                          Qty: {credit?.invoice_quantity}
                                        </span>
                                      )}
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center gap-6">
                                  <h2 className="text-textPrimary font-medium capitalize">
                                    {credit?.type}
                                  </h2>
                                  <h2 className="text-textPrimary font-medium">
                                    SAR {credit?.credit_amount}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
          </>

          {/* items */}
          <div className="mt-[18px] px-3">
            <div className="flex items-center justify-between  text-[15px] text-textPrimary font-semibold">
              <span>Items</span>
              <div className="flex items-center gap-[102px]">
                <span>Invoice/ Received</span>
                <span>Total</span>
              </div>
            </div>

            {/* rows */}
            {invoiceOne?.items?.map((item: any) => (
              <div
                className="mt-4 flex flex-col gap-2"
                onClick={() => {
                  if (
                    form
                      .getValues("creditNotices")
                      ?.some(
                        (creditNotice: { status: number }) =>
                          creditNotice.status === 2
                      ) ||
                    invoiceOne?.creditNotices?.some(
                      (creditNotice: { status: number }) =>
                        creditNotice.status === 2
                    )
                  ) {
                    return;
                  } else {
                    setIsEditItem(true);
                    form.setValue("item", { name: item?.name, id: item?.id });
                  }
                }}
              >
                <div className="flex items-center justify-between border-b border-b-[#EDEDED] pb-2 cursor-pointer">
                  <div className="flex flex-col ">
                    <span className="text-gray">{item?.name}</span>
                    <span className="text-textPrimary">
                      ({item?.unit})
                    </span>
                  </div>
                  <div className="flex items-center gap-[112px]">
                    <span
                      className={`${item?.quantity == item?.invoice_quantity
                        ? ""
                        : "text-warn"
                        } w-[50px] `}
                    >
                      {item?.invoice_quantity} / {item?.quantity}
                    </span>
                    <span className="text-textPrimary">
                      SAR {item?.sub_total}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* price info */}
          <div className="flex justify-between items-center px-3 py-8">
            <div className="flex flex-col gap-4 text-textPrimary">
              <span>Subtotal</span>
              <span>Total VAT</span>
              <span className="text-textPrimary font-semibold">Total</span>
            </div>
            <div className="flex flex-col gap-4 text-textPrimary">
              <span>SAR {invoiceOne?.sub_total}</span>
              <span>SAR {invoiceOne?.total_vat}</span>
              <span className=" font-semibold">SAR {invoiceOne?.total}</span>
            </div>
          </div>
        </div>
      </>
    </CustomSheet>
  );
};

export default InvoiceForm;
