import { Button } from "@/components/ui/button";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useReceiveOrdersHttp from "../queriesHttp/useReceiveOrdersHttp";

const Summary = ({
  setSteps,
  isLoadingReceiveOrderAction,
  setIndex
}: {
  setSteps: Dispatch<SetStateAction<number>>;
  isLoadingReceiveOrderAction: boolean;
  setIndex: Dispatch<SetStateAction<number>>;
}) => {
  const { setValue, watch, register, getValues } = useFormContext();
  const [date, setDate] = useState<any>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [dateReceive, setDateReceive] = useState<any>(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const { filterObj } = useFilterQuery();
  const { SuppliersSelect } = useCommonRequests({ getSuppliers: true });

  return (
    <>
      <div className="bg-popover p-[8px] grid ">
        <div className="flex justify-between">
          <div className="flex flex-col gap-8">
            <p>Supplier</p>
            <p>
              invoice number <span className="text-warn">*</span>
            </p>
            <p>invoice Date</p>
            <p>Received on</p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="self-end capitalize">
              {
                SuppliersSelect?.find(
                  (supplier: { value: string }) =>
                    supplier?.value == filterObj["filter[supplier]"]
                )?.label
              }
            </div>
            <Input
              className="w-[150px]"
              value={getValues("invoice_number")}
              onChange={(e) => {
                const value = e.target.value;

                setValue("invoice_number", value);
                setValue("total", +watch("total_tax") + +watch("sub_total"));
              }}
            />
            <CustomInputDate
              date={date}
              defaultValue={watch("invoice_date")}
              onSelect={(selectedDate) => {
                setDate(moment(selectedDate).format("YYYY-MM-DD"));
                setValue(
                  "invoice_date",
                  moment(selectedDate).format("YYYY-MM-DD")
                );
              }}
            />
            <CustomInputDate
              date={dateReceive}
              defaultValue={watch("business_date")}
              onSelect={(selectedDate) => {
                setDateReceive(moment(selectedDate).format("YYYY-MM-DD"));
                setValue(
                  "business_date",
                  moment(selectedDate).format("YYYY-MM-DD")
                );
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-[16px]">
        <div className="font-bold grid grid-cols-3 mb-[16px] ">
          <p>Item</p>
          <p className="justify-self-center">Invoice/ Received</p>
          <p className="justify-self-end">Total</p>
        </div>
        <div
          className="border-b-[1px] border-[#EDEDED] pb-2"

        >
          {watch("items")?.map(
            (item: {
              item_id: string,
              invoice_quantity: number;
              quantity: number;
              sub_total: number;
              unit: string;
              name: string;
            }, index: number) => (
              <div className="font-light grid grid-cols-3 items-center  py-[16px] cursor-pointer"
                onClick={() => {
                  setSteps(4);
                  setIndex(index)
                  setValue("item.name", item?.name);



                }}
              >
                <p className="text-gray capitalize text-[14px]">
                  {item?.name}{" "}
                  <span className="text-black">({item?.unit})</span>
                </p>
                <p
                  className={` justify-self-center  ${item?.quantity !== item?.invoice_quantity ? "text-warn" : ""
                    }`}
                >
                  {item?.invoice_quantity}/{item?.quantity}
                </p>
                <p className="justify-self-end"> SAR {item?.sub_total}</p>
              </div>
            )
          )}
        </div>

        {watch("creditNotes")?.length || watch("creditNotesPrice")?.length ? (
          <>
            <div className="flex flex-col gap-2 bg-warn-foreground p-3 rounded-[4px]  border border-warn text-textPrimary">
              <div className="flex items-center pb-2 justify-between font-bold ">
                <p>Credit notes</p>
                <div className="flex items-center gap-6">
                  <h2 className=" capitalize"> Type</h2>
                  <h2>Credit</h2>
                </div>
              </div>
              {watch("creditNotes")?.map(
                (credit: {
                  name: string;
                  type: string;
                  order_cost: number;
                  order: number;
                  cost: number;
                  quantity: number;
                  invoice_quantity: number;
                  order_unit: string;
                  tax_amount: string | number;
                }) => (
                  <div className="flex items-center pb-2 justify-between mt-1 border ">
                    <div className="flex gap-3">
                      <Label className="flex  flex-col gap-2 text-textPrimary">
                        {credit?.name}
                        <div className="flex gap-2 text-warn text-[12px] font-medium">
                          <span>
                            Order:{" "}
                            {credit?.type == "price" ? (
                              <>{credit?.order}</>
                            ) : (
                              <>
                                ({credit?.order_unit}) {credit?.quantity}
                              </>
                            )}
                          </span>
                          <span>
                            Invoice:{" "}
                            {credit?.type == "price" ? (
                              <>{credit?.order_cost}</>
                            ) : (
                              <>
                                ({credit?.order_unit}){" "}
                                {credit?.invoice_quantity}
                              </>
                            )}
                          </span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center gap-6">
                      <h2 className="text-textPrimary font-medium capitalize">
                        {" "}
                        {credit?.type}
                      </h2>
                      <h2 className="text-textPrimary font-medium">
                        SAR{" "}
                        {(+credit?.invoice_quantity - +credit?.quantity) *
                          credit?.cost +
                          +Math.abs(+credit?.tax_amount)}
                      </h2>
                    </div>
                  </div>
                )
              )}
              {watch("creditNotesPrice")?.map(
                (credit: {
                  name: string;
                  type: string;
                  order_cost: number;
                  cost: number;
                  quantity: number;
                  invoice_quantity: number;
                  tax_amount_price: number | string;
                }) => (
                  <div className="flex items-center pb-2 justify-between mt-1 border ">
                    <div className="flex gap-3">
                      <Label className="flex  flex-col gap-2 text-textPrimary">
                        {credit?.name}
                        <div className="flex gap-2 text-warn text-[12px] font-medium">
                          <span>
                            Order:{" "}
                            {credit?.type == "price" ? (
                              <>SAR {credit?.order_cost}</>
                            ) : (
                              <>{credit?.invoice_quantity}</>
                            )}
                          </span>
                          <span>
                            Invoice:{" "}
                            {credit?.type == "price" ? (
                              <>SAR {credit?.cost}</>
                            ) : (
                              <>{credit?.quantity}</>
                            )}
                          </span>
                          <span>
                            <>Qty: {credit?.quantity}</>
                          </span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center gap-6">
                      <h2 className="text-textPrimary font-medium capitalize">
                        {" "}
                        {credit?.type}
                      </h2>
                      <h2 className="text-textPrimary font-medium">
                        SAR
                        {
                          -(
                            (+credit?.order_cost - +credit?.cost) *
                            +credit?.quantity +
                            Math.abs(+credit?.tax_amount_price)
                          )
                        }
                      </h2>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        ) : (
          <></>
        )}

        <div className="flex justify-between mt-[40px]">
          <div className="flex flex-col gap-5">
            <p>Subtotal</p>
            <p>Total VAT</p>
            <p className="font-bold ">Total</p>
          </div>
          <div className="flex flex-col gap-5">
            <p>
              SAR{" "}
              {watch("items").reduce(
                (acc: number, curr: { sub_total: number }) =>
                  acc + +curr?.sub_total,
                0
              )}
            </p>
            <p>
              SAR{" "}
              {watch("items").reduce(
                (acc: number, curr: { tax_amount: number }) =>
                  acc + Math.abs(+curr?.tax_amount),
                0
              )}
            </p>
            <p className="font-bold">
              SAR{" "}
              {watch("items").reduce(
                (acc: number, curr: { sub_total: number }) =>
                  acc + +curr?.sub_total,
                0
              ) +
                watch("items").reduce(
                  (acc: number, curr: { tax_amount: number }) =>
                    acc + Math.abs(+curr?.tax_amount),
                  0
                )}
            </p>
          </div>
        </div>
      </div>

      <div>
        <Button
          type="button"
          className="border-primary border-[1px] bg-white text-primary font-black  w-full  my-5 p-5"
          onClick={() => {
            setSteps(3);
          }}
        >
          Add item to this order
        </Button>
      </div>
      <Button
        type="submit"
        variant="default"
        className="w-[620px] absolute mb-5 bottom-0"
        loading={isLoadingReceiveOrderAction}
      >
        Accept delivery
      </Button>
    </>
  );
};

export default Summary;
