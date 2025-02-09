import { Button } from "@/components/ui/button";
import CustomInputDate from "@/components/ui/custom/CustomInputDate";
import { Label } from "@/components/ui/label";
import moment from "moment";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useWasteHttp from "../queriesHttp/useWasteHttp";

function Summary({ isPendingCreate }: { isPendingCreate: boolean }) {
  const { setValue, watch } = useFormContext();

  useEffect(() => {
    setValue("business_date", moment(new Date()).format("YYYY-MM-DD"));
  }, []);
  return (
    <div className="p-3 text-textPrimary">
      <div className="flex flex-col gap-3">
        <Label>Created date</Label>
        <CustomInputDate
          disabledDate={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          defaultValue={watch("business_date")}
          onSelect={(selectedDate) => {
            setValue(
              "business_date",
              moment(selectedDate).format("YYYY-MM-DD")
            );
          }}
        />
      </div>

      <div className="flex justify-between font-bold mt-4 items-center">
        <p>Item name</p>
        <p>Quantity</p>
      </div>
      {watch("items")?.length ? (
        <>
          {watch("items")?.map((e: any) => (
            <div className="flex justify-between mt-4 items-center">
              <p>{e.name}</p>
              <p className="text-warn">
                {e.quantity /
                  e?.array_stock_counts?.find(
                    (item: { use_report: number }) => item?.use_report == 1
                  )?.count}{" "}
                {
                  e?.array_stock_counts?.find(
                    (item: { use_report: number }) => item?.use_report == 1
                  )?.unit
                }
              </p>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}

      {watch("recipes")?.length ? (
        <>
          {watch("recipes")?.map((e: any) => (
            <div className="flex justify-between mt-4 items-center">
              <p>{e.name}</p>
              <p className="text-warn">{e.quantity} ea</p>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}

      {watch("batches")?.length ? (
        <>
          {watch("batches")?.map((e: any) => (
            <div className="flex justify-between mt-4 items-center">
              <p>{e.name}</p>
              <p className="text-warn">
                {e.quantity /
                  e?.array_stock_counts?.find(
                    (item: { use_report: number }) => item?.use_report == 1
                  )?.count}{" "}
                {
                  e?.array_stock_counts?.find(
                    (item: { use_report: number }) => item?.use_report == 1
                  )?.unit
                }
              </p>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}

      <Button
        className="w-[625px] absolute bottom-0 mb-2 bg-primary font-semibold h-[48px] rounded-3xl"
        loading={isPendingCreate}
      >
        Log Waste
      </Button>
    </div>
  );
}

export default Summary;
