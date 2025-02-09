import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils";
import { CalendarIcon } from "lucide-react";

interface ICountsForm {
  PriceChange: any;
}
const CountsForm = ({ PriceChange }: ICountsForm) => {
  return (
    <div className="pb-20">
      {/* invoice info */}
      <div className="bg-popover px-3 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between ">
          <span>invoice number</span>
          <Input
            placeholder="Invoice number"
            className="h-[40px]"
            defaultValue={PriceChange?.invoice_number}
            readOnly
          />
        </div>
        <div className="flex items-center justify-between">
          <span>invoice Date</span>
          <FormControl onClick={() => {}}>
            <Button
              type="button"
              variant={"outline"}
              className={cn(
                "py-3 pl-3 flex gap-1 text-left font-normal w-[111px] "
              )}
            >
              <span>{PriceChange?.invoice_date}</span>
              <CalendarIcon
                className="ml-auto h-4 w-4 opacity-50 shrink-0"
                color="#D4E2ED"
              />
            </Button>
          </FormControl>
        </div>
        <div className="flex items-center justify-between">
          <span>Received on</span>
          <FormControl onClick={() => {}}>
            <Button
              type="button"
              variant={"outline"}
              className={cn(
                "py-3 pl-3 flex gap-1 text-left font-normal w-[111px] "
              )}
            >
              <span>{PriceChange?.business_date}</span>
              <CalendarIcon
                className="ml-auto h-4 w-4 opacity-50 shrink-0"
                color="#D4E2ED"
              />
            </Button>
          </FormControl>{" "}
        </div>
      </div>
      {/* credit notes */}
      {PriceChange?.creditNotices?.length && (
        <div className="bg-warn-foreground border border-warn rounded-[8px] p-2 mt-2 mx-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-textPrimary font-semibold">Credit notes</h2>
            <div className="flex items-center gap-6">
              <h2 className="text-textPrimary font-semibold">Type</h2>
              <h2 className="text-textPrimary font-semibold">Credit</h2>
            </div>
          </div>

          {/* content */}
          <div className="flex flex-col gap-2">
            {PriceChange?.creditNotices?.map((item: any, index: number) => (
              <div className="flex items-center pb-2 justify-between mt-2 border border-b-warn-foreground">
                <div className="flex gap-3">
                  <Label className="flex  flex-col gap-2 text-textPrimary">
                    {item?.item?.name}
                    <span className="text-warn text-[12px] font-medium">
                      {item?.note}
                    </span>
                  </Label>
                </div>
                <div className="flex items-center gap-6">
                  <h2 className="text-textPrimary font-medium">{item?.type}</h2>
                  <h2 className="text-textPrimary font-medium">
                    SAR {item?.credit_amount}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3">
            <h3 className="text-[12px] text-textPrimary">
              Select credit note to action
            </h3>
            <Button className="bg-[#F9F5F9] text-gray-400 border border-gray-400">
              Recieve
            </Button>
          </div>
        </div>
      )}

      {/* items */}
      <div className="mt-[18px] px-2">
        <div className="flex items-center justify-between  text-[12px] text-textPrimary font-semibold">
          <span>Items</span>
          <div className="flex items-center gap-[102px]">
            <span>Invoice/ Received</span>
            <span>Total</span>
          </div>
        </div>

        {/* rows */}
        <div className="mt-4 flex flex-col gap-2">
          {PriceChange?.items?.map((item: any, index: number) => (
            <div className="flex items-center justify-between border-b border-b-[#EDEDED] pb-2">
              <div className="flex flex-col ">
                <span className="text-gray">{item?.name}</span>
                <span className="text-textPrimary">({item?.unit})</span>
              </div>
              <div className="flex items-center gap-[112px]">
                <span
                  className={`${
                    item?.pivot?.invoice_quantity !== item?.pivot?.quantity &&
                    "text-warn"
                  }`}
                >
                  {item?.pivot?.invoice_quantity}/{item?.pivot?.quantity}
                </span>
                <span className="text-textPrimary">
                  SAR {item?.pivot?.total_cost?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* price info */}
      <div className="flex justify-between items-center px-2 py-8">
        <div className="flex flex-col gap-4 text-textPrimary">
          <span>Subtotal</span>
          <span>Total VAT</span>
          <span className="text-textPrimary font-semibold">Total</span>
        </div>
        <div className="flex flex-col gap-4 text-textPrimary">
          <span>SAR {PriceChange?.sub_total.toFixed(2)}</span>
          <span>SAR {PriceChange?.total_vat.toFixed(2)}</span>
          <span className=" font-semibold">
            SAR {PriceChange?.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountsForm;
