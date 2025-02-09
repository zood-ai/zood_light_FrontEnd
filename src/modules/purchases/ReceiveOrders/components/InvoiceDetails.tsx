import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";

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
      {watch("items")?.length ? (
        <div className="bg-popover flex justify-between p-[15px]">
          <div className="flex flex-col ">
            <div className="flex  items-center mb-2">
              <Label className="mr-[78px]">Invoice number</Label>
              <Label className="mr-[95px]">Invoice Date</Label>
              <Label className="mr-[100px]">Received on</Label>
              <Label>Total (ex.tax)</Label>
            </div>
            <div className="flex gap-[24px] items-center ">
              <Input
                required
                className="w-[151px]"
                type="number"
                step={"0.0000001"}
                onChange={(e) => {
                  setValue("invoice_number", +e.target.value);
                  trigger("total");
                }}
              />

              <CustomInputDate
                defaultValue={moment(watch("invoice_date")).format("MMM DD")}
                onSelect={(selectedDate) => {
                  setValue(
                    "invoice_date",
                    moment(selectedDate).format("YYYY-MM-DD")
                  );
                }}
              />

              <CustomInputDate
                date={watch("business_date")}
                defaultValue={moment(watch("business_date")).format("MMM DD")}
                onSelect={(selectedDate) => {
                  setValue(
                    "business_date",
                    moment(selectedDate).format("YYYY-MM-DD")
                  );
                }}
              />

              <div>
                <div className="h-8">
                  <Input
                    step={"0.00000001"}
                    min={0}
                    required
                    textLeft="SAR"
                    type="number"
                    className="w-[151px]"
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue("total", +value, { shouldValidate: true });

                      if (+value > 0) {
                        trigger("sub_total");
                        trigger("total");
                      }
                    }}
                  />
                  <div className="text-warn text-[10px]">
                    {typeof formState?.errors?.total?.message === "string"
                      ? formState.errors.total.message
                      : null}
                  </div>
                </div>
              </div>
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
      ) : (
        <></>
      )}
    </>
  );
};

export default InvoiceDetails;
