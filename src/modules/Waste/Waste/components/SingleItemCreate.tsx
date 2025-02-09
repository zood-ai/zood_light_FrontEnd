import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Input } from "@/components/ui/input";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import useReasonsHttps from "@/modules/Settings/PosSettings/Reasons/queriesHttp/useReasonsHttp";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const SingleItemCreate = ({
  setCheck,
}: {
  setCheck: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setValue, control, watch, getValues } = useFormContext();
  const { filterObj } = useFilterQuery();
  const [reasonsList, setReasonsList] = useState<
    { value: string; label: string }[]
  >([]);
  const { ReasonsData } = useReasonsHttps({});
  const [item, setItem] = useState<any>();

  useEffect(() => {
    const arr: { value: string; label: string }[] = [];
    ReasonsData?.data?.qty_adjust_reasons_arr?.map(
      (res: { id: string; name: string }) => {
        arr.push({ label: res.name, value: res.id });
      }
    );
    setReasonsList(arr);
  }, [ReasonsData?.data]);
  const { itemsData, batchesData, recipesData } = useCommonRequests({
    filterItem: `filter[branches][0]=${filterObj["filter[branch]"]}`,
    getRecipes: true,
    filterBatches: "type=all&include[0]=stockCounts",
  });

  useEffect(() => {
    const item = itemsData?.data
      ?.concat(batchesData?.data, recipesData?.data)
      ?.find((item: { id: string }) => item?.id === watch("item")?.id);
    setItem(item);
  }, [itemsData, batchesData, recipesData]);

  const items = useWatch({ name: "items", control });
  const recipes = useWatch({ name: "recipes", control });
  const batches = useWatch({ name: "batches", control });

  const ItemIndex =
    items?.findIndex(
      (item: { id: string }) => item?.id === watch("item")?.id
    ) || 0;

  const RecipeIndex =
    recipes?.findIndex(
      (item: { id: string }) => item?.id === watch("item")?.id
    ) || 0;

  const batchIndex =
    batches?.findIndex(
      (item: { id: string }) => item?.id === watch("item")?.id
    ) || 0;

  const validateItem = () => {
    const itemType = watch("item")?.type;
    const index =
      itemType === "item"
        ? ItemIndex
        : itemType === "batch"
        ? batchIndex
        : RecipeIndex;
    const quantity =
      itemType === "batch"
        ? watch(`batches.${index}.quantity`)
        : watch(`${itemType}s.${index}.quantity`);
    const reason =
      itemType === "batch"
        ? watch(`batches.${index}.reason`)
        : watch(`${itemType}s.${index}.reason`);

    if (quantity !== 0 && reason?.length !== 0) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  };

  useEffect(() => {
    validateItem();
  }, []);

  const handleQuantityChangeItems = (
    value: number,
    index: number,
    stock: { id: number; count: number; use_report: number; cost: number }
  ) => {
    if (value < 0) {
      return;
    }
    const stockCount = getValues(`items.${ItemIndex}.array_stock_counts`);
    setValue(`items.${ItemIndex}.array_stock_counts.${index}.quantity`, value);
    setValue(
      `items.${ItemIndex}.quantity`,
      stockCount
        ?.map(
          (sc: { quantity: number; count: number }) => sc.quantity * sc.count
        )
        ?.reduce((acc: number, curr: number) => acc + curr, 0)
    );

    setValue(
      `items.${ItemIndex}.total_cost`,
      stockCount
        ?.map((sc: { quantity: number; cost: number }) => sc.quantity * sc.cost)
        ?.reduce((acc: number, curr: number) => acc + curr, 0)
    );

    validateItem();
  };
  // batches
  const handleQuantityChangeBatches = (
    value: number,
    index: number,
    stock: { id: number; count: number; use_report: number; cost: number }
  ) => {
    const stockCount = getValues(`batches.${batchIndex}.array_stock_counts`);
    setValue(
      `batches.${batchIndex}.array_stock_counts.${index}.quantity`,
      value
    );
    setValue(
      `batches.${batchIndex}.quantity`,
      stockCount
        ?.map(
          (sc: { quantity: number; count: number }) => sc.quantity * sc.count
        )
        ?.reduce((acc: number, curr: number) => acc + curr, 0)
    );

    setValue(
      `batches.${batchIndex}.total_cost`,
      stockCount
        ?.map((sc: { quantity: number; cost: number }) => sc.quantity * sc.cost)
        ?.reduce((acc: number, curr: number) => acc + curr, 0)
    );

    validateItem();
  };

  const countUseInReportItem = getValues(
    `items.${ItemIndex}.array_stock_counts`
  )?.find((item: { use_report: number }) => item?.use_report == 1)?.count;

  const countUseInReportBatch = getValues(
    `batches.${batchIndex}.array_stock_counts`
  )?.find((item: { use_report: number }) => item?.use_report == 1)?.count;

  return (
    <>
      <div className="bg-muted p-3 flex justify-between">
        {watch("item")?.name}

        <div>
          {watch("item")?.type == "item" && (
            <>
              {+watch(`items.${ItemIndex}.quantity`) / +countUseInReportItem ||
                0}
              (
              {
                item?.stock_counts?.find(
                  (item: { use_report: number }) => item?.use_report == 1
                )?.unit
              }
              )
            </>
          )}
          {watch("item")?.type == "batch" && (
            <>
              {+watch(`batches.${batchIndex}.quantity`) /
                +countUseInReportBatch || 0}
              (
              {
                item?.stock_counts?.find(
                  (item: { use_report: number }) => item?.use_report == 1
                )?.unit
              }
              )
            </>
          )}
        </div>
      </div>

      {watch("item")?.type == "item" && (
        <div className="grid grid-cols-5 pt-[10px] m-4 gap-7">
          {item?.stock_counts?.map((stock, idx) => (
            <>
              {stock?.checked == 1 && (
                <React.Fragment key={idx}>
                  <div className="col-span-3 ">{stock?.unit}</div>
                  <div className="col-end-7">
                    <Input
                      className="w-[76px]"
                      type="number"
                      step={"0.01"}
                      value={
                        getValues(
                          `items.${ItemIndex}.array_stock_counts.${idx}.quantity`
                        ) || 0
                      }
                      onChange={(e) => {
                        if (+e.target.value < 0) {
                          return;
                        }
                        handleQuantityChangeItems(+e.target.value, idx, stock);
                      }}
                    />
                  </div>
                </React.Fragment>
              )}
            </>
          ))}
        </div>
      )}
      {watch("item")?.type == "batch" && (
        <div className="grid grid-cols-5 pt-[10px] m-4 gap-7">
          {item?.stock_counts?.map((stock, idx) => (
            <React.Fragment key={idx}>
              <div className="col-span-3 ">{stock?.unit} </div>
              <div className="col-end-7">
                <Input
                  className="w-[76px]"
                  type="number"
                  step={"0.01"}
                  value={
                    getValues(
                      `batches.${batchIndex}.array_stock_counts.${idx}.quantity`
                    ) || 0
                  }
                  onChange={(e) => {
                    if (+e.target.value < 0) {
                      return;
                    }
                    handleQuantityChangeBatches(+e.target.value, idx, stock);
                  }}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      {watch("item")?.type === "recipe" && (
        <div className="flex items-center justify-between px-4 pt-5">
          <div>ea</div>
          <div>
            <Input
              className="w-[76px]"
              type="number"
              step={"0.01"}
              value={getValues(`recipes.${RecipeIndex}.quantity`) || 0}
              onChange={(e) => {
                if (+e.target.value < 0) {
                  return;
                }
                const value = +e.target.value;
                setValue(`recipes.${RecipeIndex}.quantity`, value);
                setValue(`recipes.${RecipeIndex}.id`, watch("item")?.id);
                setValue(
                  `recipes.${RecipeIndex}.total_cost`,
                  value * getValues(`recipes.${RecipeIndex}.cost`)
                );
                validateItem();
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 pt-[10px] m-4">
        <div className="col-span-3">Reason</div>
        <div className="col-end-7">
          <CustomSelect
            options={reasonsList}
            value={
              watch("item")?.type == "item"
                ? getValues(`items.${ItemIndex}.reason`)
                : watch("item")?.type == "recipe"
                ? getValues(`recipes.${RecipeIndex}.reason`)
                : getValues(`batches.${batchIndex}.reason`)
            }
            width="w-[100px]"
            onValueChange={(e) => {
              if (e == "null") {
                const itemType = watch("item")?.type;
                const index =
                  itemType === "item"
                    ? ItemIndex
                    : itemType === "batch"
                    ? batchIndex
                    : RecipeIndex;

                itemType === "batch"
                  ? setValue(`batches.${index}.reason`, "")
                  : setValue(`${itemType}s.${index}.reason`, "");
                validateItem();
              } else {
                const itemType = watch("item")?.type;
                const index =
                  itemType === "item"
                    ? ItemIndex
                    : itemType === "batch"
                    ? batchIndex
                    : RecipeIndex;

                itemType === "batch"
                  ? setValue(`batches.${index}.reason`, e)
                  : setValue(`${itemType}s.${index}.reason`, e);
                validateItem();
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default SingleItemCreate;
