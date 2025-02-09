import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import CustomTooltip from "@/components/ui/custom/CustomTooltip";

const InvoiceDetails = () => {
  const { watch, register, setValue, getValues, formState, trigger } =
    useFormContext();

  const previousItemsRef = useRef(watch("items"));
  const taxAmount = +watch("items")?.reduce(
    (acc: number, curr: { tax_amount: number }) => acc + +curr?.tax_amount,
    0
  );
  const subTotalCost = +watch("items")?.reduce(
    (acc: number, curr: { sub_total: number }) => acc + +curr?.sub_total,
    0
  );

  useEffect(() => {
    setValue("total", 0);

    if (
      watch("items")?.length !== previousItemsRef?.current?.length ||
      watch("total") > 0
    ) {
      trigger("total");
    }
  }, [watch("items").length]);



  return (
    <>
      <div className="bg-popover flex justify-between p-[15px]">
        <div className="flex flex-col ">
          <div className="flex  items-center mb-2">
            <Label className="mr-[95px] flex items-center gap-2">
              <p>Order Date</p>
              <CustomTooltip tooltipContent="The date on the document, used for export the reconcilication." />{" "}
            </Label>
            <Label className="mr-[95px] flex items-center gap-2">
              <p>Delivery due</p>
              <CustomTooltip tooltipContent="The date the goods were received, used for stock management and reports." />{" "}
            </Label>
          </div>
          <div className="flex gap-[24px] items-center ">
            <CustomInputDate
              defaultValue={moment(watch("delivery_date")).format("MMM DD")}
              disabled={true}
              onSelect={(selectedDate) => {
                setValue(
                  "invoice_date",
                  moment(selectedDate).format("YYYY-MM-DD")
                );
              }}
            />

            <CustomInputDate
              date={watch("business_date")}
              disabled={watch("status") !== 2}
              defaultValue={moment(watch("business_date")).format("MMM DD")}
              onSelect={(selectedDate) => {
                setValue(
                  "business_date",
                  moment(selectedDate).format("YYYY-MM-DD"),
                  { shouldDirty: true }
                );
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[7px] bg-[#FFFFFF] border-[1px] border-gray-400 p-[8px] rounded-[4px]">
          <div className="flex gap-[87px] justify-between">
            <p>Subtotal</p>
            <p>SAR {(watch("items")?.length && subTotalCost) || 0}</p>
          </div>
          <div className="flex gap-[87px] justify-between">
            <p>Total tax</p>
            <p>SAR {(watch("items")?.length && taxAmount) || 0}</p>
          </div>
          <div className="flex gap-[87px] justify-between font-bold">
            <p>Total</p>
            <p>SAR {taxAmount + subTotalCost}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetails;
