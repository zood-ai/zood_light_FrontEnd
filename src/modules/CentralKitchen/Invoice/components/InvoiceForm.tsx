import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import moment from "moment";
import { Dispatch, SetStateAction, useState } from "react";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import useInvoiceHttp from "../queriesHttp/useInvoiceHttp";
import { CreditNotes } from "./CreditNotes";

const InvoiceForm = ({
  setIsEditItem,
  rowData,
}: {
  setIsEditItem: Dispatch<SetStateAction<boolean>>;
  rowData: string;
}) => {
  const { register, setValue, getValues } = useFormContext();

  const [date, setDate] = useState<any>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [dateReceive, setDateReceive] = useState<any>(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const { invoiceOne } = useInvoiceHttp({
    invoiceId: rowData,
    handleCloseSheet: () => {},
  });
  console.log(getValues("items"));

  return (
    <div className="pb-20">
      {/* invoice info */}
      <div className="flex justify-between bg-popover p-2 m-2 rounded-[4px]">
        <div className="flex flex-col gap-8">
          <p>
            Invoice number <span className="text-warn">*</span>
          </p>
          <p>Invoice Date</p>
          <p>Received on</p>
        </div>
        <div className="flex flex-col gap-3">
          <Input
            className="w-[150px]"
            {...register("invoice_number")}
            disabled={true}
          />
          <CustomInputDate
            disabled={true}
            date={date}
            onSelect={(selectedDate) => {}}
          />
          <CustomInputDate
            disabled={true}
            date={dateReceive}
            onSelect={(selectedDate) => {}}
          />
        </div>
      </div>
      {/* credit notes */}
      {/* Header */}
      <CreditNotes rowData={rowData} />

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
        {getValues("items")?.map((item: any) => (
          <div
            className="mt-4 flex flex-col gap-2 group"
            onClick={() => {
              if (
                getValues("creditNotices")?.some(
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
                setValue("item", { name: item?.name, id: item?.id });
              }
            }}
          >
            <div className="flex items-center justify-between border-b border-b-[#EDEDED] pb-2 cursor-pointer group-hover:text-primary">
              <div className="flex flex-col ">
                <span className="text-gray group-hover:text-primary">
                  {item?.name}
                </span>
                <span className="text-textPrimary group-hover:text-primary">
                  ({item?.unit})
                </span>
              </div>
              <div className="flex items-center gap-[112px]">
                <span
                  className={`${
                    item?.quantity == item?.invoice_quantity ? "" : "text-warn"
                  } w-[50px] group-hover:text-primary`}
                >
                  {item?.invoice_quantity} / {item?.quantity}
                </span>
                <span
                  className={`${
                    item?.old_cost == item?.cost ? "" : "text-warn"
                  } group-hover:text-primary`}
                >
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
          <span>SAR {getValues("sub_total")}</span>
          <span>SAR {getValues("total_vat")}</span>
          <span className=" font-semibold">SAR {getValues("total")}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
