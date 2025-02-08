import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import { count } from "console";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const ChooseQuantity = ({
  setCheck,
  isEdit,
}: {
  setCheck: Dispatch<SetStateAction<boolean>>;
  isEdit?: boolean;
}) => {
  const [item, setItem] = useState<any>();
  const { watch, getValues, setValue, control } = useFormContext();
  
  const { itemsData, isFetchingItems } = useCommonRequests({
    filterItem: `join_branches[0]=${watch("branch_id")}&join_branches[1]=${watch("warehouse_id")}`

  });
  const items = useWatch({ name: "items", control });
  const ItemIndex =
    items?.findIndex(
      (item: { id: string }) => item?.id === watch("item")?.id
    ) || 0;

  useEffect(() => {
    const item = itemsData?.data?.find(
      (item: { id: string }) => item?.id == watch("item")?.id
    );

    setItem(item);
  }, [itemsData?.data]);

  const validateItem = () => {
    if (watch(`items.${ItemIndex}`)?.quantity !== 0) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  };

  useEffect(() => {
    validateItem();
  }, [ItemIndex]);

  const handleQuantityChange = (
    value: number,
    index: number,
    stock: { id: number; count: number; use_report: number; cost: number }
  ) => {
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

    setValue(
      "total_amount",
      watch("items")?.reduce(
        (acc: number, curr: { quantity: number }) => acc + +curr?.quantity,
        0
      )
    );
    validateItem();
  };

  
  return (
    <>
      {isFetchingItems ? (
        <div className="flex gap-5 flex-col mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton className="h-4 w-[150px] bg-gray-300" key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="bg-muted p-3 flex justify-between mt-[8px]">
            <span className="font-bold">{watch("item")?.name}</span>
            <div>
              {watch(`items.${ItemIndex}.quantity`) /
                watch(`items.${ItemIndex}.array_stock_counts`)?.find(
                  (item: { use_report: number }) => item?.use_report == 1
                )?.count || 0}{" "}
              (
              {
                item?.stock_counts?.find(
                  (item: { use_report: number }) => item?.use_report == 1
                )?.unit
              }
              )
            </div>
          </div>

          <div className="grid grid-cols-5 pt-[10px] m-[8px] gap-[8px]">
            {item?.stock_counts?.map((stock: any, index: number) => (
              <>
                {stock?.checked == 1 && (
                  <div key={index} className="col-span-5 flex justify-between">
                    <div className="col-span-3">{stock?.unit}</div>
                    <div className="col-end-7">
                      <Input
                        className="h-[40px] w-[76px]"
                        type="number"
                        value={
                          getValues(
                            `items.${ItemIndex}.array_stock_counts.${index}.quantity`
                          ) || null
                        }
                        onChange={(e) =>
                          handleQuantityChange(+e.target.value, index, stock)
                        }
                        min={0}
                      />
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ChooseQuantity;
