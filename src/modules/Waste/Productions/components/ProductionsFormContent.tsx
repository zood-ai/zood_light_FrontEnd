import { Input } from "@/components/ui/input";
import { ICreateValues, IProductionsFormContent } from "../types/types";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EmptyItemsIcon from "@/assets/icons/EmptyItems";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import useProductionsHttp from "../queriesHttp/useProductionsHttp";
import useFilterQuery from "@/hooks/useFilterQuery";

const ProductionsFormContent = ({
  step,
  setStep,
  singleItem,
  setSingleItem,
  setSelectedItemIndex,
  selectedItemIndex,
  rowData,
  setRowData,
  handleCloseSheet,
}: IProductionsFormContent) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filterObj } = useFilterQuery();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { getValues, watch, control } = useFormContext();

  const { createproduction, isPendingCreate } = useProductionsHttp({
    handleCloseSheet,
  });

  const [filterdBatches, setFilterdBatches] = useState<
    {
      name: string;
      id: string;
      storage_unit: string;
      storage_to_ingredient: number;
    }[]
  >();

  const { batchesData, isFetchingBatches } = useCommonRequests({
    filterBatches: `filter[branches][0]=${searchParams.get(
      "filter[branch]"
    )}&type=all`,
  });

  useEffect(() => {
    handleSearch(searchParams.get("search") || "");
  }, [batchesData]);

  const handleSearch = (value: string) => {
    if (value) {
      const filteredItems: {
        name: string;
        id: string;
        storage_to_ingredient: number;
        storage_unit: string;
      }[] =
        batchesData?.data?.filter((item: any) =>
          item?.name.toLowerCase().includes(value.toLowerCase())
        ) ?? [];

      setFilterdBatches(filteredItems);
      setSearchParams({ ...filterObj, search: value });
    } else {
      setFilterdBatches(batchesData?.data);
    }
  };

  return (
    <div className="">
      {step === 1 ? (
        <>
          {" "}
          <Input
            placeholder={"Search by name"}
            searchIcon={true}
            className="h-[40px]  w-full"
            value={filterObj["search"] ?? ""}
            onChange={(e) => {
              if (e.target.value.length == 0) {
                delete filterObj["search"];
                setSearchParams({ ...filterObj, search: "" });
              } else {
                setSearchParams({
                  ...filterObj,
                  search: e.target.value,
                });
              }
              handleSearch(e.target.value);
            }}
          />
          {isFetchingBatches ? (
            <div className="flex gap-5 flex-col mt-10">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton className="h-4  w-[150px] " key={index} />
              ))}
            </div>
          ) : filterdBatches?.length ? (
            filterdBatches?.map(
              (
                batch: {
                  name: string;
                  id: string;
                  storage_to_ingredient: number;
                  storage_unit: string;
                },
                index: number
              ) => {
                const batchData = getValues("items").find(
                  (item: any) => item?.id === batch.id
                );
                return (
                  <div
                    key={batch.id}
                    className="flex justify-between items-center py-[15px] mb-3 cursor-pointer  border-b-[1px] border-[#ECF0F1] mt-3"
                    onClick={() => {
                      setStep(2);

                      setSingleItem({
                        id: batch.id,
                        quantity:
                          batchData?.quantity || batch?.storage_to_ingredient,
                        storage_unit: batch?.storage_unit,
                        name: batch?.name,
                      });
                      setSelectedItemIndex(index);
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 text-textPrimary text-[14px] font-medium tracking-wider">
                      {batch?.name}
                    </div>
                    <div className="font-semibold text-[14px]">
                      {batchData?.quantity} {batchData?.storage_unit}
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <div className=" flex items-center justify-center flex-col gap-2 mt-12">
              <EmptyItemsIcon />
              <p className="text-textPrimary font-semibold text-[20px]">
                No items
              </p>
              <span className="text-[16px] text-textPrimary">
                Your items will live here
              </span>
            </div>
          )}
          {watch("items")?.length > 0 && (
            <div className="absolute bottom-0 left-0 bg-white flex justify-end items-center py-2  cursor-pointer  border-t-[1px] border-[#ECF0F1]  w-full">
              <div className="text-[14px] text-gray flex gap-4 me-4">
                <span className="text-[#748faa] text-[16px]">
                  {watch("items")?.length} items selected
                </span>
                <span>-</span>
                <span
                  className="text-primary font-bold text-[16px]"
                  onClick={() => {
                    setStep(3);
                  }}
                >
                  Continue
                </span>
              </div>
            </div>
          )}
        </>
      ) : step === 2 ? (
        <div>
          <h3 className="bg-muted py-4 px-2 text-textPrimary text-[16px] font-semibold">
            {filterdBatches?.[selectedItemIndex]?.name}
          </h3>
          <div className="flex justify-between items-center mt-[23px] px-2">
            <span>Batch qty</span>
            <div className="flex">
              <Input
                type="number"
                min={1}
                value={
                  singleItem?.quantity || 1
                  // filterdBatches?.[selectedItemIndex]?.storage_to_ingredient
                }
                className="w-[98px] h-[48px]"
                onChange={(e) => {
                  if (+e.target.value < 0) {
                    return;
                  }
                  setSingleItem({
                    id: filterdBatches?.[selectedItemIndex]?.id || "",
                    quantity: +e.target.value || 1,
                    name: filterdBatches?.[selectedItemIndex]?.name || "",
                    storage_unit:
                      filterdBatches?.[selectedItemIndex]?.storage_unit || "",
                  });
                }}
              />
              <Input
                className="w-[52px] h-[40px]"
                readOnly
                value={filterdBatches?.[selectedItemIndex]?.storage_unit || ""}
              />
            </div>
          </div>
        </div>
      ) : step === 3 ? (
        <div className="px-2 mt-6">
          {/* date picker */}
          <FormField
            control={control}
            name="business_date"
            render={({ field }) => (
              <FormItem className="flex flex-col  relative">
                <FormLabel className="text-textPrimary font-semibold mb-2">
                  Create date
                </FormLabel>
                <FormControl onClick={() => setShowDatePicker(!showDatePicker)}>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "py-3 pl-3 h-[40px] text-left font-normal w-[197px] ",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {format(field.value ? field.value : new Date(), "dd MMMM")}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>

                {showDatePicker && (
                  <Calendar
                    mode="single"
                    className="absolute z-10 bg-white top-16"
                    selected={field.value ? new Date(field.value) : new Date()}
                    onSelect={(date) => {
                      if (!date) {
                        return;
                      }
                      field.onChange(format(date, "yyyy-MM-dd"));
                      setShowDatePicker(false);
                    }}
                    toDate={new Date()}
                  />
                )}
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center font-semibold text-textPrimary tracking-wider my-6 ">
            <span>Item name</span>
            <span>Quantity</span>
          </div>

          {getValues("items")?.map((item: any, index: number) => (
            <div
              className="flex justify-between items-center mt-3 mb-3 tracking-wider"
              key={index}
            >
              <span className="text-textPrimary font-medium">
                {item.name || "sdfsf"}
              </span>
              <span className="text-textPrimary font-medium">
                {item.quantity} {item.storage_unit}
              </span>
            </div>
          ))}
          <div className="flex items-end justify-center absolute bottom-1 px-2 left-0 w-full">
            <Button
              className="bg-primary font-semibold h-[48px] w-full rounded-3xl"
              disabled={isPendingCreate}
              onClick={() => {
                createproduction(getValues() as ICreateValues);
                setSearchParams({ ...filterObj, search: "" });
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-[24px] px-2">
          <div className="flex items-center justify-between mb-5">
            <span className="text-gray">Item</span>
            <span className="text-textPrimary">{rowData?.name}</span>
          </div>
          <div className="flex items-center justify-between  mb-5">
            <span className="text-gray">Date</span>
            <span className="text-textPrimary">
              {format(rowData?.business_date, "dd MMMM, yyyy")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-textPrimary">Quantity</span>
            <div className="flex items-center gap-2">
              <Label>{rowData?.storage_unit}</Label>
              <Input
                className="w-[76px] h-[40px]"
                value={rowData?.quantity}
                type="number"
                min={1}
                onChange={(e) => {
                  if (+e.target.value < 0) {
                    return;
                  }
                  setRowData({ ...rowData, quantity: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionsFormContent;
