import { Skeleton } from "@/components/ui/skeleton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import useReceiveOrdersHttp from "@/modules/purchases/ReceiveOrders/queriesHttp/useReceiveOrdersHttp";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { wasteTypes } from "@/constants/dropdownconstants";

const ItemsList = ({
  setSteps,
}: {
  setSteps: Dispatch<SetStateAction<number>>;
}) => {
  const { filterObj } = useFilterQuery();
  const { setValue, control, watch, getValues } = useFormContext();

  const [items, setItems] =
    useState<
      { label: string; value: string; pack_unit: string; cost: number }[]
    >();
  const [filterdItems, setFilterdItems] =
    useState<
      { label: string; value: string; pack_unit: string; cost: number }[]
    >();

  const {
    Items,
    batchesData,
    recipesData,
    isFetchingItems,
    isFetchingRecipes,
    isFetchingBatches,
  } = useCommonRequests({
    filterItem: `filter[branches][0]=${filterObj["filter[branch]"]}`,
    getRecipes: true,
    getItems: true,
    filterRecipe: `filter[branches][0]=${filterObj["filter[branch]"]}`,
    filterBatches: `filter[branches][0]=${filterObj["filter[branch]"]}&type=all&include[0]=stockCounts`,
  });
  console.log(filterObj["filter[branch]"]);

  const itemsLength = useWatch({ name: "items", control })?.length || 0;
  const recipesLength = useWatch({ name: "recipes", control })?.length || 0;
  const batchesLength = useWatch({ name: "batches", control })?.length || 0;
  useEffect(() => {
    const arr: {
      label: string;
      value: string;
      pack_unit: string;
      cost: number;
      type?: String;
      stock_counts: [];
    }[] = [];

    watch("type") == "item"
      ? Items?.data?.map((e: any) => {
          arr.push({
            value: e?.id,
            label: e?.name,
            pack_unit: e?.pack_unit,
            cost: e?.cost,
            type: "item",
            stock_counts: e?.stock_counts,
          });
        })
      : watch("type") == "batch"
      ? batchesData?.data?.map((e: any) => {
          arr.push({
            value: e?.id,
            label: e?.name,
            pack_unit: e?.storage_unit,
            cost: e?.cost,
            type: "batch",
            stock_counts: e?.stock_counts,
          });
        })
      : watch("type") == "recipe"
      ? recipesData?.data?.map((e: any) => {
          arr.push({
            value: e?.id,
            label: e?.name,
            pack_unit: e?.pack_unit,
            cost: e?.cost,
            type: "recipe",
            stock_counts: e?.stock_counts,
          });
        })
      : recipesData?.data
          ?.map((res: any) => ({
            value: res?.id,
            label: res?.name,
            pack_unit: res?.pack_unit,
            cost: res?.cost,
            stock_counts: res?.stock_counts,
            type: "recipe",
          }))
          .concat(
            batchesData?.data?.map((res: any) => ({
              value: res?.id,
              label: res?.name,
              pack_unit: res?.storage_unit,
              cost: res?.cost,
              stock_counts: res?.stock_counts,
              type: "batch",
            })),
            Items?.data?.map((res: any) => ({
              value: res?.id,
              label: res?.name,
              pack_unit: res?.pack_unit,
              cost: res?.cost,
              stock_counts: res?.stock_counts,

              type: "item",
            }))
          )
          ?.map((e: any) => {
            arr.push({
              value: e?.value,
              label: e?.label,
              pack_unit: e?.pack_unit,
              cost: e?.cost,
              type: e?.type,
              stock_counts: e?.stock_counts,
            });
          });

    setItems(arr);
    setFilterdItems(arr);
  }, [Items, batchesData, recipesData, watch("type")]);

  const handleSearch = (value: string) => {
    if (value) {
      const filteredItems: {
        label: string;
        value: string;
        pack_unit: string;
        cost: number;
        stock_counts?: [];
      }[] =
        items?.filter((item: any) =>
          item?.label.toLowerCase().includes(value.toLowerCase())
        ) ?? [];

      setFilterdItems(filteredItems);
    } else {
      setFilterdItems(items);
    }
  };

  return (
    <div>
      <CustomSelect
        optionDefaultLabel="All"
        width="w-full p-5 mb-2"
        options={wasteTypes}
        onValueChange={(e) => setValue("type", e, { shouldValidate: true })}
        value={getValues("type")}
      />

      <Input
        placeholder={"Search by name"}
        searchIcon={true}
        className="w-full h-[40px]"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      {isFetchingItems || isFetchingRecipes || isFetchingBatches ? (
        <div className="flex gap-5 flex-col mt-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-4 w-[150px] " key={index} />
          ))}
        </div>
      ) : filterdItems?.length ? (
        filterdItems?.map(
          (item: {
            label: string;
            value: string;
            pack_unit: string;
            storage_unit?: string;
            cost: number;
            type?: string;
            stock_counts?: [];
          }) => {
            return (
              <div
                className="flex justify-between items-center py-[15px] cursor-pointer  border-b-[1px] border-[#ECF0F1] mt-3"
                onClick={() => {
                  setSteps(2);
                  setValue("item.name", item?.label);
                  setValue("item.id", item?.value);
                  setValue("item.type", item?.type);
                  if (item?.type == "item") {
                    let currentItems =
                      (Array.isArray(watch("items")) && watch("items")) || [];
                    const oldItem = currentItems.find(
                      (i: { id: string }) => i?.id === item?.value
                    );
                    currentItems = currentItems.filter(
                      (i: { id: string }) => i?.id !== item?.value
                    );

                    const newItem = {
                      id: item?.value,
                      name: item?.label,
                      pack_unit: item?.pack_unit || "",
                      quantity: oldItem?.quantity || 0,
                      total_cost: oldItem?.total_cost || 0,
                      reason: oldItem?.reason || "",
                      cost: item?.cost || "",
                      array_stock_counts: item?.stock_counts?.map(
                        (stock: any, index: number) => {
                          return {
                            id: stock?.id,
                            count: stock?.count || 0,
                            use_report: stock?.use_report,
                            cost: stock?.cost || 0,
                            unit: stock?.unit,
                            checked: stock?.checked,
                            report_preview: stock?.report_preview,
                            show_as: stock?.show_as,
                            quantity:
                              oldItem?.array_stock_counts?.[index]?.quantity ||
                              0,
                          };
                        }
                      ),
                    };

                    setValue("items", [...currentItems, newItem]);
                  }

                  if (item?.type == "recipe") {
                    let currentItems =
                      (Array.isArray(watch("recipes")) && watch("recipes")) ||
                      [];

                    const oldItem = currentItems.find(
                      (i: { id: string }) => i?.id === item?.value
                    );
                    currentItems = currentItems.filter(
                      (i: { id: string }) => i?.id !== item?.value
                    );

                    const newItem = {
                      id: item?.value,
                      name: item?.label,
                      quantity: oldItem?.quantity || 0,
                      total_cost: oldItem?.total_cost || 0,
                      reason: oldItem?.reason || "",
                      cost: item?.cost || "",
                    };

                    setValue("recipes", [...currentItems, newItem]);
                  }

                  if (item?.type == "batch") {
                    let currentItems =
                      (Array.isArray(watch("batches")) && watch("batches")) ||
                      [];
                    const oldItem = currentItems.find(
                      (i: { id: string }) => i?.id === item?.value
                    );
                    currentItems = currentItems.filter(
                      (i: { id: string }) => i?.id !== item?.value
                    );

                    const newItem = {
                      id: item?.value,
                      name: item?.label,
                      pack_unit: item?.pack_unit || "",
                      quantity: oldItem?.quantity || 0,
                      reason: oldItem?.reason || "",
                      cost: item?.cost || "",
                      total_cost: oldItem?.total_cost || 0,
                      array_stock_counts: item?.stock_counts?.map(
                        (stock: any, index: number) => {
                          return {
                            id: stock?.id,
                            count: stock?.count || 0,
                            use_report: stock?.use_report,
                            cost: stock?.cost || 0,
                            unit: stock?.unit,
                            checked: stock?.checked,
                            report_preview: stock?.report_preview,
                            show_as: stock?.show_as,
                            quantity:
                              oldItem?.array_stock_counts?.[index]?.quantity ||
                              0,
                          };
                        }
                      ),
                    };

                    setValue("batches", [...currentItems, newItem]);
                  }
                }}
              >
                <div className="flex items-center justify-between gap-2 text-textPrimary ">
                  {item?.label}
                </div>
                <div>
                  {watch("items")?.length ? (
                    <>
                      {watch("items")?.find(
                        (itemW: { id: string }) => itemW?.id == item?.value
                      )?.quantity == undefined
                        ? ""
                        : `${
                            watch("items")?.find(
                              (itemW: { id: string }) =>
                                itemW?.id == item?.value
                            )?.quantity /
                            watch("items")
                              ?.find(
                                (itemW: { id: string }) =>
                                  itemW?.id == item?.value
                              )
                              ?.array_stock_counts?.find(
                                (item: { use_report: number }) =>
                                  item?.use_report == 1
                              )?.count
                          } ${
                            watch("items")
                              ?.find(
                                (itemW: { id: string }) =>
                                  itemW?.id == item?.value
                              )
                              ?.array_stock_counts?.find(
                                (item: { use_report: number }) =>
                                  item?.use_report == 1
                              )?.unit
                          }`}
                    </>
                  ) : (
                    <></>
                  )}
                  {watch("recipes")?.length ? (
                    <>
                      {watch("recipes")?.find(
                        (itemW: { id: string }) => itemW?.id == item?.value
                      )?.quantity == undefined
                        ? ""
                        : ` ${
                            watch("recipes")?.find(
                              (itemW: { id: string }) =>
                                itemW?.id == item?.value
                            )?.quantity
                          } ea`}
                    </>
                  ) : (
                    <></>
                  )}
                  {watch("batches")?.length ? (
                    <>
                      {watch("batches")?.find(
                        (itemW: { id: string }) => itemW?.id == item?.value
                      )?.quantity == undefined
                        ? ""
                        : `${
                            watch("batches")?.find(
                              (itemW: { id: string }) =>
                                itemW?.id == item?.value
                            )?.quantity /
                            watch("batches")
                              ?.find(
                                (itemW: { id: string }) =>
                                  itemW?.id == item?.value
                              )
                              ?.array_stock_counts?.find(
                                (item: { use_report: number }) =>
                                  item?.use_report == 1
                              )?.count
                          } ${
                            watch("batches")
                              ?.find(
                                (itemW: { id: string }) =>
                                  itemW?.id == item?.value
                              )
                              ?.array_stock_counts?.find(
                                (item: { use_report: number }) =>
                                  item?.use_report == 1
                              )?.unit
                          }`}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            );
          }
        )
      ) : (
        <div className="flex gap-5 flex-col">
          <p className="text-textPrimary">No Items</p>
        </div>
      )}

      {watch("items")?.length ||
      watch("recipes")?.length ||
      watch("batches")?.length ? (
        <div className="absolute bottom-0 pl-[28rem] bg-white  flex justify-between items-center py-[15px] cursor-pointer  border-t-[1px] border-[#ECF0F1] mt-3  w-full">
          <div className="text-[14px] text-gray text-ligh t">
            {itemsLength + batchesLength + recipesLength} item selected{" "}
            <span
              className="text-primary font-bold pr-5"
              onClick={() => {
                setSteps(3);
              }}
            >
              -Continue
            </span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ItemsList;
