import { Skeleton } from "@/components/ui/skeleton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import useReceiveOrdersHttp from "../queriesHttp/useReceiveOrdersHttp";

const ItemsList = ({
  setSteps,
}: {
  setSteps: Dispatch<SetStateAction<number>>;
}) => {
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
      unit: string;
      pack_per_case: number;
      pack_size: number;
    }[]
  >();
  const [filterdItems, setFilterdItems] = useState<
    {
      label: string;
      value: string;
      unit: string;
      pack_per_case: number;
      pack_size: number;
    }[]
  >();

  const { itemsData, isFetchingItems } = useReceiveOrdersHttp({});
  useEffect(() => {
    const arr: {
      label: string;
      value: string;
      unit: string;
      pack_per_case: number;
      pack_size: number;
    }[] = [];
    itemsData?.itemDailyUsage?.map((e: any) => {
      arr.push({
        value: e?.id,
        label: e?.name,
        unit: e?.unit,
        pack_per_case: e?.pack_per_case,
        pack_size: e?.pack_size,
      });
    });
    setItems(arr);
    setFilterdItems(arr);
  }, [itemsData]);

  const handleSearch = (value: string) => {
    if (value) {
      const filteredItems: {
        label: string;
        value: string;
        unit: string;
        pack_per_case: number;
        pack_size: number;
      }[] =
        items?.filter((item: any) =>
          item?.label.toLowerCase().includes(value.toLowerCase())
        ) ?? [];

      setFilterdItems(filteredItems);
    } else {
      setFilterdItems(items);
    }
  };
  const { setValue, control, watch } = useFormContext();

  return (
    <div className="">
      <Input
        placeholder={"Search by name"}
        searchIcon={true}
        className="w-full h-[40px]"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      {isFetchingItems ? (
        <div className="flex gap-5 flex-col mt-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-4 w-[150px] " key={index} />
          ))}
        </div>
      ) : filterdItems?.length ? (
        filterdItems?.map(
          (item: { label: string; value: string; unit: string }) => {
            return (
              <div
                className="flex justify-between items-center py-[15px] cursor-pointer  border-b-[1px] border-[#ECF0F1] mt-3"
                onClick={() => {
                  setSteps(4);
                  setValue("item.name", item?.label);
                  setValue("item.id", item?.value);
                  setValue("item.unit", item?.unit);
                  let currentItems =
                    (Array.isArray(watch("items")) && watch("items")) || [];
                  const oldItem = currentItems.find(
                    (i: { item_id: string; unit: string }) =>
                      i?.item_id === item?.value && i?.unit == item?.unit
                  );
                  currentItems = currentItems.filter(
                    (i: { item_id: string; unit: string }) =>
                      !(i?.item_id === item?.value && i?.unit === item?.unit)
                  );
                  console.log(watch("items"), "oldItem");

                  const newItem = {
                    item_id: item?.value,
                    name: item?.label,
                    unit: item?.unit,

                    tax_group_id: oldItem?.tax_group_id
                      ? oldItem?.tax_group_id
                      : itemsData?.itemDailyUsage?.find(
                        (itemDaily: { id: string }) =>
                          itemDaily?.id === item?.value
                      )?.tax_group?.id,
                    order_cost: itemsData?.itemDailyUsage?.find(
                      (itemDaily: { id: string }) =>
                        itemDaily?.id === item?.value
                    )?.cost,
                    cost: oldItem?.cost
                      ? oldItem?.cost
                      : itemsData?.itemDailyUsage?.find(
                        (itemDaily: { id: string }) =>
                          itemDaily?.id === item?.value
                      )?.cost,
                    quantity: oldItem?.quantity,
                    invoice_quantity: oldItem?.invoice_quantity,

                    tax_amount: oldItem?.tax_amount
                      ? oldItem?.tax_amount
                      : +itemsData?.itemDailyUsage?.find(
                        (itemDaily: { id: string }) =>
                          itemDaily?.id === item?.value
                      )?.tax_rat / 100,

                    sub_total: oldItem?.sub_total,
                    total_cost: oldItem?.total_cost,
                    pack_size: itemsData?.itemDailyUsage?.find(
                      (itemDaily: { id: string }) =>
                        itemDaily?.id === item?.value
                    )?.pack_size,
                    pack_per_case: itemsData?.itemDailyUsage?.find(
                      (itemDaily: { id: string }) =>
                        itemDaily?.id === item?.value
                    )?.pack_per_case,
                    supplier_item_id: itemsData?.itemDailyUsage?.find(
                      (itemDaily: { id: string }) =>
                        itemDaily?.id === item?.value
                    )?.supplier_item_id
                  };
                  setValue("items", [...currentItems, newItem]);
                }}
              >
                <div className="flex items-center justify-between gap-2 text-textPrimary ">
                  {item?.label} ({item?.unit})
                </div>
                <div>
                  {watch("items")?.length ? (
                    <>
                      {watch("items")?.find(
                        (itemW: { item_id: string; unit: string }) =>
                          itemW?.item_id == item?.value && itemW?.unit == item?.unit
                      )?.total_cost == undefined
                        ? ""
                        : `SAR ${watch("items")?.find(
                          (itemW: { item_id: string; unit: string }) =>
                            itemW?.item_id == item?.value &&
                            itemW?.unit == item?.unit
                        )?.sub_total
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
      {watch("items")?.length ? (
        <div className="absolute bottom-0 pl-80 bg-white  flex justify-between items-center py-[15px] cursor-pointer  border-t-[1px] border-[#ECF0F1] mt-3  w-full">
          <div className="text-[14px] text-gray text-ligh t">
            {watch("items")?.length} item selected{" "}
            <span
              className="text-primary font-bold pr-5"
              onClick={() => {
                setSteps(6);

              }}
            >
              - View Summary
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
