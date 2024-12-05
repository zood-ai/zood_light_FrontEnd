
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

import useReceiveOrdersHttp from "../queriesHttp/useReceiveOrdersHttp";
const CancelModal = ({
  setIsEditItem,
  rowData,
  openCloseModal,
  setModalName,
  setOpenCloseModal,
  // isLoadingReceiveOrderOne,
}: {
  setIsEditItem: Dispatch<SetStateAction<boolean>>;
  rowData: any;
  openCloseModal: boolean;
  setModalName: any;
  setOpenCloseModal: Dispatch<SetStateAction<boolean>>;
  // isLoadingReceiveOrderOne?: boolean;
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
  const { receiveOrder, isLoadingReceiveOrderOne } = useReceiveOrdersHttp({
    orderId: rowData,
    handleCloseSheet: handleCloseSheet,
    setReceiveOne: (data: any) => {
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
      isLoadingForm={!isLoadingReceiveOrderOne}
      setModalName={setModalName}
      headerStyle="border-b-0 flex items-center justify-between w-full"
      contentStyle="p-0"
      onSubmit={onSubmit}
      purchaseHeader={
        <>
          Order Details
          <Badge variant="danger">{receiveOrder?.status == "3" ? "Canceled" : "Rejected"}</Badge>
        </>
      }
    >
      <>
        <div className="pb-20">
          {/* invoice info */}
          <div className="flex justify-between bg-popover p-2 m-2 rounded-[4px]">
            <div className="flex flex-col gap-8">
              {/* <p>
                invoice number <span className="text-warn">*</span>
              </p> */}
              <p>invoice Date</p>
              <p>Received on</p>
            </div>
            <div className="flex flex-col gap-3">
              {/* <Input
                className="w-[150px]"
                {...form.register("invoice_number")}
                disabled={true}
              /> */}
              <CustomInputDate
                disabled={true}
                defaultValue={form.getValues("invoice_date")}
                onSelect={(selectedDate) => {
                  form.setValue(
                    "invoice_date",
                    moment(selectedDate).format("YYYY-MM-DD")
                  );
                }}
              />
              <CustomInputDate
                disabled={true}
                defaultValue={form.getValues("business_date")}
                onSelect={(selectedDate) => {
                  form.setValue(
                    "business_date",
                    moment(selectedDate).format("YYYY-MM-DD")
                  );
                }}
              />
            </div>
          </div>

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
            {form.getValues("items")?.map((item: any) => (
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
                    receiveOrder?.creditNotices?.some(
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
                      ({item?.pack_unit})
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
              <span>SAR {form.getValues("sub_total")}</span>
              <span>SAR {form.getValues("total_tax")}</span>
              <span className=" font-semibold">
                SAR {form.getValues("total_cost")}
              </span>
            </div>
          </div>
        </div>
      </>
    </CustomSheet>
  );
};

export default CancelModal;
