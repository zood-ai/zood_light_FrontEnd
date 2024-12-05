import Avatar from "@/components/ui/avatar";
import CustomCircle from "@/components/ui/custom/CustomCircle";
import { useFormContext } from "react-hook-form";

interface ICreditNotes {
  code: string;
  name: string;
  unit: string;
  invoice_unit: number;
  invoice_quantity: number;
  quantity: number;
  cost: number;
  order_cost: number;
  order_price_per_unit: number;
  tax_rate: number;
  tax_amount: number;
  total_credit: number;
  total_credit_price: number;
  reasonQty: string;
  reasonQtyPrice: string;
  id: string;
  type: string;
  tax_amount_price: number;
}
export const CreditNotes = () => {
  const { watch } = useFormContext();

  return (
    <>
      {watch("credit_notes_price")?.length || watch("credit_notes")?.length ? (
        <>
          <p className={`text-[16px] font-bold py-[10px] border-t `}>
            Credit Notes
          </p>
          <div className="bg-warn-foreground px-[19px] pt-[19px] border-x-warn border-t-warn border-[1px] rounded-t-[4px]">
            <div className="grid grid-cols-11 gap-4 font-bold   mb-[25px]">
              <div>Item code</div>
              <div>item name</div>
              <div>Order unit</div>
              <div>Invoice qty</div>
              <div>Received qty</div>
              <div>Invoice price per unit</div>
              <div>Order price per unit</div>
              <div>Tax rate</div>
              <div>Tax value</div>
              <div>Total credit</div>
              <div>Credit reason</div>
            </div>
          </div>

          <div className="bg-warn-foreground p-[19px] border-x-warn border-b-warn border-[1px] rounded-b-[4px] pt-7">
            {watch("credit_notes_price")?.map((e: ICreditNotes) => (
              <div className="grid grid-cols-11 gap-4  pb-2  mb-[27px] font-light border-[1px] border-transparent border-b-[#edf1f2ff]">
                <div>{e?.code}</div>
                <div>
                  <CustomCircle text={e?.name} />
                </div>
                <div>{e?.unit}</div>
                <div>{e?.invoice_quantity}</div>
                <div>
                  {e?.quantity}{" "}
                  {e?.type == "quantity" ? (
                    <div className="text-warn text-[13px] font-light">
                      (Credit SAR {+e?.total_credit?.toFixed(2)})
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div>{e?.cost} </div>
                <div>
                  {e?.order_cost}{" "}
                  {e?.type == "price" ? (
                    <div className="text-warn text-[13px] font-light">
                      (Credit SAR {+e?.total_credit_price?.toFixed(2)})
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div>{e?.tax_rate * 100} %</div>
                <div>
                  SAR{" "}
                  {e?.tax_amount_price > 0
                    ? e?.tax_amount_price
                    : -e?.tax_amount_price}
                </div>
                <div>
                  SAR{" "}
                  {(e?.total_credit_price + e?.tax_amount_price)?.toFixed(2)}
                </div>
                <div>
                  {e?.type == "quantity" ? (
                    <>Qty discrepancy</>
                  ) : (
                    <>Price discrepancy</>
                  )}
                </div>
              </div>
            ))}
            {watch("credit_notes")?.map((e: ICreditNotes) => (
              <div className="grid grid-cols-11 gap-4  pb-2  mb-[27px] font-light border-[1px] border-transparent border-b-[#edf1f2ff]">
                <div>{e?.code}</div>
                <div>
                  {" "}
                  <CustomCircle text={e?.name} />
                </div>
                <div>{e?.unit}</div>
                <div>{e?.invoice_quantity}</div>
                <div>
                  {e?.quantity}{" "}
                  {e?.type == "quantity" ? (
                    <div className="text-warn text-[13px] font-light">
                      (Credit SAR {+e?.total_credit?.toFixed(2)})
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div>{e?.cost} </div>
                <div>
                  {e?.order_cost}{" "}
                  {e?.type == "price" ? (
                    <div className="text-warn text-[13px] font-light">
                      (Credit SAR {+e?.total_credit_price?.toFixed(2)})
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div>{(+e?.tax_rate * 100).toFixed(0)} %</div>
                <div>
                  SAR {e?.tax_amount > 0 ? e?.tax_amount : -e?.tax_amount || 0}
                </div>
                <div>SAR {-(+e?.total_credit?.toFixed(2) + e?.tax_amount)}</div>
                <div>
                  {e?.type == "quantity" ? (
                    <>Qty discrepancy</>
                  ) : (
                    <>Price discrepancy</>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
