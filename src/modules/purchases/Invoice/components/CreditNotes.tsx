import React, { useEffect, useState } from "react";
import useInvoiceHttp from "../queriesHttp/useInvoiceHttp";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import InfoIcon from "@/assets/icons/Info";

export const CreditNotes = ({ rowData }: { rowData: any }) => {
  const [creditList, setCreditList] = useState<any>([]);
  const [check, setCheck] = useState<number>();
  const { watch, setValue } = useFormContext();

  const {
    receiveCreditNotice,
    invoiceOne,
    isLoadingReceive,
    isLoadingUnReceive,
    UnreceiveCreditNotice,
  } = useInvoiceHttp({
    invoiceId: rowData,
    handleCloseSheet: () => {},
    setCheck: setCheck,
  });

  useEffect(() => {
    setValue("creditNotices", invoiceOne?.creditNotices);
  }, [invoiceOne]);

  return (
    <>
      {watch("creditNotices")?.filter(
        (item: { status: number }) => item?.status == 1
      )?.length ||
      watch("creditNotices")?.filter(
        (item: { status: number }) => item?.status == 2
      )?.length ? (
        <>
          <div className="bg-warn-foreground border border-warn rounded-[8px] p-2 mt-2 mx-2">
            <div className="flex items-center justify-between">
              <h2 className="text-textPrimary font-semibold">Credit notes</h2>
              <div className="flex items-center gap-6">
                <h2 className="text-textPrimary font-semibold">Type</h2>
                <h2 className="text-textPrimary font-semibold">Credit</h2>
              </div>
            </div>
            {/* receive */}
            {watch("creditNotices")
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
                        <Checkbox
                          className="text-textPrimary font-semibold"
                          disabled={check == 2}
                          checked={creditList?.includes(credit?.id)}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              setCheck(credit?.status);

                              setCreditList((prev: any) => [
                                ...prev,
                                credit?.id,
                              ]);
                            } else {
                              setCheck(0);

                              setCreditList((prev: any) =>
                                prev.filter((id: any) => id !== credit?.id)
                              );
                            }
                          }}
                        />
                        <Label className="flex  flex-col gap-2 text-textPrimary">
                          {credit?.name}
                          <div className="flex gap-2">
                            <span className="text-warn text-[12px] font-medium">
                              {credit.type == "price" ? (
                                <>
                                  Order: SAR {credit?.old_cost} , Invoice: SAR{" "}
                                  {credit?.cost} Qty:{credit?.quantity}{" "}
                                </>
                              ) : (
                                <>
                                  Order: {credit?.quantity} , Invoice:{" "}
                                  {credit?.invoice_quantity}{" "}
                                </>
                              )}
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

            {watch("creditNotices")?.filter(
              (item: { status: number }) => item?.status == 2
            )?.length ? (
              <div className="border-t-[1px] py-2 mt-2">
                <p className="font-semibold">Received</p>
                {/* un */}
                {watch("creditNotices")
                  ?.filter((item: { status: number }) => item?.status == 2)
                  ?.map((credit: any) => (
                    <>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center pb-2 justify-between mt-2">
                          <div className="flex gap-3">
                            <Checkbox
                              className="text-textPrimary font-semibold"
                              disabled={check == 1}
                              checked={creditList?.includes(credit?.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setCheck(credit?.status);

                                  setCreditList((prev: any) => [
                                    ...prev,
                                    credit?.id,
                                  ]);
                                } else {
                                  setCheck(0);
                                  setCreditList((prev: any) =>
                                    prev.filter((id: any) => id !== credit?.id)
                                  );
                                }
                              }}
                            />
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

            {watch("creditNotices")?.filter(
              (item: { status: number }) => item?.status == 1
            )?.length > 0 && check !== 2 ? (
              <div className="flex items-center justify-between mt-3">
                <h3 className="text-[12px] text-textPrimary">
                  Select credit note to action
                </h3>
                <Button
                  type="button"
                  loading={isLoadingReceive || isLoadingUnReceive}
                  disabled={
                    !creditList?.length || [1, 2].includes(invoiceOne?.status)
                  }
                  onClick={async () => {
                    await receiveCreditNotice(creditList);
                    setCreditList([]);
                  }}
                >
                  Receive
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mt-3">
                  <h3 className="text-[12px] text-textPrimary">
                    Select credit note to action
                  </h3>
                  <Button
                    type="button"
                    loading={isLoadingReceive || isLoadingUnReceive}
                    disabled={
                      !creditList?.length || [1, 2].includes(invoiceOne?.status)
                    }
                    onClick={async () => {
                      await UnreceiveCreditNotice(creditList);
                      setCreditList([]);
                    }}
                  >
                    UnReceive
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      {watch("creditNotices")?.filter(
        (item: { status: number }) => item?.status == 2
      )?.length ? (
        <div className="p-2 rounded-[8px] bg-muted mt-3 flex items-center ml-2 mr-2">
          <InfoIcon color="#8CD9ED" className="px-2" />
          <p className="px-2">
            Items on this invoice can't be edited because one or more credit
            notes have been marked as received
          </p>
        </div>
      ) : invoiceOne?.status == 2 ? (
        <div className="p-5 rounded-[8px] bg-muted mt-2 flex items-center">
          <InfoIcon color="#8CD9ED" className="px-2" />
          <p className="px-2">
            Items on this invoice can't be edited because the invoice has
            already been exported
          </p>
        </div>
      ) : invoiceOne?.status == 1 ? (
        <div className="p-5 rounded-[8px] bg-muted mt-2 flex items-center">
          <InfoIcon color="#8CD9ED" className="px-2" />
          <p className="px-2">
            Items on this invoice can't be edited because the invoice has been
            approved. Unapprove this invoice to make edits.
          </p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
