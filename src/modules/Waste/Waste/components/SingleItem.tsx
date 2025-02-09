import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import useWasteHttp from "../queriesHttp/useWasteHttp";
import { useEffect, useState } from "react";
import useCommonRequests from "@/hooks/useCommonRequests";
import moment from "moment";
import { useFormContext } from "react-hook-form";
import useReasonsHttps from "@/modules/Settings/PosSettings/Reasons/queriesHttp/useReasonsHttp";

const SingleItem = () => {
  const { setValue, watch, getValues } = useFormContext();

  const [reasonsList, setReasonsList] = useState<
    { value: string; label: string }[]
  >([]);
  const { ReasonsData, isLoadingResons } = useReasonsHttps({});

  useEffect(() => {
    const arr: { value: string; label: string }[] = [];
    ReasonsData?.data?.qty_adjust_reasons_arr?.map(
      (res: { id: string; name: string }) => {
        arr.push({ label: res.name, value: res.id });
      }
    );
    setReasonsList(arr);
  }, [ReasonsData?.data?.qty_adjust_reasons_arr]);

  const [date, setDate] = useState<any>();

  useEffect(() => {
    setDate(moment(new Date(watch("business_date"))).format("MMM DD"));
  }, [watch("business_date")]);

  const handleQuantityChange = (value: number | string, index: number) => {
    const stockCount = getValues(`array_stock_counts`);
    setValue(`array_stock_counts.${index}.quantity`, +value);
    setValue(
      `quantity`,
      stockCount
        ?.map(
          (sc: { quantity: number; count: number }) => sc.quantity * sc.count
        )
        ?.reduce((acc: number, curr: number) => acc + curr, 0)
    );

    setValue(
      `total_cost`,
      stockCount
        ?.map((sc: { quantity: number; cost: number }) => sc.quantity * sc.cost)
        ?.reduce((acc: number, curr: number) => acc + curr, 0)
    );
  };

  return (
    <div className="flex flex-col gap-3 p-[8px]">
      <div className="grid grid-cols-5 pt-[10px]">
        <div className="col-span-3 text-gray">Item</div>
        <div className="col-end-7">{watch("name")}</div>
      </div>
      <div className="grid grid-cols-5 ">
        <div className="col-span-3">Date</div>
        <div className="col-end-7">
          <CustomInputDate
            width="w-[76px] h-[40px]"
            disabledDate={(date: any) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            defaultValue={date}
            onSelect={(selectedDate) => {
              setDate(moment(selectedDate).format("MMM DD"));
              setValue(
                "business_date",
                moment(selectedDate).format("YYYY-MM-DD")
              );
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-5 pt-[10px]">
        <div className="col-span-3 text-gray">Waste qty</div>
        <div className="col-end-7">
          {watch("array_stock_counts")?.length == 0 && (
            <>{watch("quantity")} ea</>
          )}

          {watch("array_stock_counts")?.length != 0 && (
            <>
              {watch("quantity") /
                watch("array_stock_counts")?.find(
                  (item: { use_report: number }) => item?.use_report == 1
                )?.count || 0}{" "}
              (
              {watch("unit")?.length == 0
                ? "ea"
                : watch("array_stock_counts")?.find(
                    (item: { use_report: number }) => item?.use_report == 1
                  )?.unit}
              )
            </>
          )}
        </div>
      </div>

      {watch("array_stock_counts")?.map((item, index) => (
        <>
          {item?.checked == 1 && (
            <div className="grid grid-cols-2 gap-7">
              <div className="">{item?.unit}</div>
              <div className="justify-self-end">
                <Input
                  className="w-[76px] h-[40px]"
                  type="number"
                  step={"0.01"}
                  min={0}
                  value={watch(`array_stock_counts.${index}.quantity`) || 0}
                  onChange={(e) =>
                    handleQuantityChange(e?.target?.value, index)
                  }
                />
              </div>
            </div>
          )}
        </>
      ))}

      {watch("array_stock_counts")?.length == 0 && (
        <div className="grid grid-cols-2  gap-7">
          <div className="">ea</div>
          <div className="justify-self-end">
            <Input
              className="w-[76px] h-[40px]"
              type="number"
              value={watch(`quantity`)}
              min={0}
              step={"0.01"}
              onChange={(e) => {
                setValue(`quantity`, +e?.target?.value);
                setValue(`total_cost`, +e?.target?.value * watch("cost"));
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 pt-[10px]">
        <div className="col-span-3 text-gray">Value</div>
        <div className="col-end-7">SAR {watch("total_cost")}</div>
      </div>
      <div className="grid grid-cols-5 pt-[10px]">
        <div className="col-span-3">Reason</div>
        <div className="col-end-7">
          <CustomSelect
            options={ReasonsData?.data?.qty_adjust_reasons_arr?.map(
              (res: { id: string; name: string }) => ({
                label: res.name,
                value: res.id,
              })
            )}
            value={watch("reason")}
            loading={isLoadingResons}
            width="w-[160px] h-[40px]"
            onValueChange={(selected) => {
              setValue("reason", selected);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
