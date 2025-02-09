import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICountItem, ISingleItem, IStockCounts } from "../types/types";
import { useFormContext } from "react-hook-form";
import useFilterQuery from "@/hooks/useFilterQuery";

const SingleItem = ({
  selectedItemIndex,
  setSelectedItemIndex,
  itemStorageAreas,
  itemsCount,
  stockCounts,
  basicUnit,
}: ISingleItem) => {
  const { getValues, setValue } = useFormContext();

  const { filterObj } = useFilterQuery();

  const onChange = (e: any, oneStock: IStockCounts) => {
    let newStoc: IStockCounts = {
      id: 0,
      item_id: "",
      unit: "",
      quantity: 0,
      use_report: 0,
      show_as: "",
      count: 0,
      checked: 0,
      report_preview: "",
      cost: 0,
    };

    let newItem: ICountItem = {
      id: "",
      quantity: 0,
      total_cost: 0,
      unit: basicUnit,
      is_estimated: 0,
      array_stock_counts: [],
    };

    // get the item that has the same item_id as the one that is being edited
    const item = getValues("items")?.find(
      (sc: any) => sc?.id === oneStock.item_id
    );

    const value = e.target.value;

    // if the item exists, update the quantity and the array_stock_counts
    if (item) {
      setValue(
        "items",
        !value && item?.array_stock_counts?.length === 1
          ? getValues("items").filter(
              (item: any) => item.id !== oneStock.item_id
            )
          : getValues("items").map((item: any) => {
              // if the item exists in the items array, update the array_stock_counts with the updated stock
              if (item?.id === oneStock.item_id) {
                // check if the stock exists in the array_stock_counts by some
                // function that checks if the id of the stock is the same as the one being edited
                // if it does, update the quantity and return the updated stock
                // if it doesn't, create a new stock with the updated quantity and return the updated stock

                item.is_estimated = 0;
                item.array_stock_counts = e.target.value
                  ? item.array_stock_counts.some(
                      (sc: IStockCounts) => sc?.id === oneStock.id
                    )
                    ? item.array_stock_counts.map((sc: IStockCounts) => {
                        if (sc?.id === oneStock.id) {
                          sc.quantity = +e.target.value || 0;
                        }
                        return sc;
                      })
                    : [
                        ...item.array_stock_counts,
                        {
                          id: oneStock.id,
                          quantity: +e.target.value || 0,
                          item_id: oneStock.item_id,
                          unit: oneStock.unit,
                          use_report: oneStock.use_report,
                          show_as: oneStock.show_as,
                          count: oneStock.count,
                          checked: oneStock.checked,
                          report_preview: oneStock.report_preview,
                          cost: oneStock.cost,
                        },
                      ]
                  : item.array_stock_counts.filter(
                      (sc) => sc.id !== oneStock.id
                    );
              }
              return item;
            }),
        {
          shouldValidate: true,
        }
      );

      // if the item doesn't exist, create a new one with the updated quantity and the array_stock_counts
    } else {
      newStoc = {
        id: oneStock.id,
        quantity: +e.target.value || 0,
        item_id: oneStock.item_id,
        unit: oneStock.unit,
        use_report: oneStock.use_report,
        show_as: oneStock.show_as,
        count: oneStock.count,
        checked: oneStock.checked,
        report_preview: oneStock.report_preview,
        cost: oneStock.cost,
      };

      newItem = {
        ...newItem,
        id: oneStock.item_id,
        quantity: 0,
        is_estimated: 0,
        total_cost: 0,
        array_stock_counts: [newStoc],
      };

      setValue("items", [...getValues("items"), newItem], {
        shouldValidate: true,
      });
    }
  };

  return (
    <div>
      <Input
        className="w-full h-[40px]"
        value={
          itemStorageAreas
            ?.filter?.(
              (sto: { name: string; branch_id: string }) =>
                sto.branch_id === filterObj["filter[branch]"]
            )
            ?.map((s: { name: string; branch_id: string }) => s.name)
            .join(", ") || "This item is not assigned to any storage area"
        }
        disabled
      />
      {stockCounts.length > 0 &&
        stockCounts
          ?.filter((st) => st.checked)
          ?.map((sc: ISingleItem["stockCounts"][0], index: number) => (
            <div
              className="flex items-center justify-between w-full mt-2"
              key={sc.id}
            >
              <span className="font-medium text-textPrimary">{sc.unit} </span>
              <Input
                className="w-[76px] h-[40px]"
                type="number"
                onChange={(e) => onChange(e, sc)}
                value={
                  getValues(`items`)
                    ?.find((s: { id: string }) => s.id == sc.item_id)
                    ?.array_stock_counts?.find(
                      (sto: { id: number }) => sto?.id === sc.id
                    )?.quantity
                }
              />
            </div>
          ))}

      <div className="absolute left-0 flex justify-between w-full bottom-4">
        <Button
          variant={"outline"}
          className=" text-primary font-medium  text-[16px] bg-transparent border-none"
          disabled={selectedItemIndex === 0}
          onClick={() => setSelectedItemIndex((prev: number) => prev - 1)}
        >
          Previous item
        </Button>
        <Button
          variant={"outline"}
          className=" text-primary font-medium  text-[16px] bg-transparent border-none"
          disabled={selectedItemIndex === itemsCount - 1}
          onClick={() => setSelectedItemIndex((prev: number) => prev + 1)}
        >
          Next item
        </Button>
      </div>
    </div>
  );
};

export default SingleItem;
