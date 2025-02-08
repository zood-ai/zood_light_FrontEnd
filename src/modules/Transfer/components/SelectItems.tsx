import { Skeleton } from "@/components/ui/skeleton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";

const ItemsList = ({
  setSteps,
}: {
  setSteps: Dispatch<SetStateAction<number>>;
}) => {
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
      pack_unit: string;
      cost: number;
      stock_counts: [];
    }[]
  >();
  const [filterdItems, setFilterdItems] = useState<
    {
      label: string;
      value: string;
      pack_unit: string;
      cost: number;
      stock_counts: [];
    }[]
  >();
  const { filterObj } = useFilterQuery();
  const { setValue, watch } = useFormContext();

  const { itemsData, isFetchingItems } = useCommonRequests({
    filterItem: `join_branches[0]=${watch("branch_id")}&join_branches[1]=${watch("warehouse_id")}`

  });
  useEffect(() => {
    const arr: {
      label: string;
      value: string;
      pack_unit: string;
      cost: number;
      stock_counts: [];
    }[] = [];
    itemsData?.data?.map((e: any) => {
      arr.push({
        value: e?.id,
        label: e?.name,
        pack_unit: e?.pack_unit,
        cost: e?.cost,
        stock_counts: e?.stock_counts,
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
        pack_unit: string;
        cost: number;
        stock_counts: [];
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
    <div className="mx-[28px]">
      <div className="mt-[8px] mb-[40px]">
        <Input
          placeholder={"Search by name"}
          searchIcon={true}
          className="w-full h-[40px]"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
      {isFetchingItems ? (
        <div className="flex gap-5 flex-col mt-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-4 w-[150px] bg-gray-300" key={index} />
          ))}
        </div>
      ) : filterdItems?.length ? (
        filterdItems?.map(
          (item: {
            label: string;
            value: string;
            pack_unit: string;
            cost: number;
            stock_counts: [];
          }) => {
            return (
              <div
                className="flex justify-between items-center py-[15px] cursor-pointer  border-b-[1px] border-[#ECF0F1] mt-3 tracking-wider"
                onClick={() => {
                  setSteps(5);
                  setValue("item.name", item?.label);
                  setValue("item.id", item?.value);
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
                    total_cost: oldItem?.total_cost,
                    pack_unit: item?.pack_unit,
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
                            oldItem?.array_stock_counts?.[index]?.quantity || 0,
                        };
                      }
                    ),
                    quantity: oldItem?.quantity || 0,
                  };

                  setValue("items", [...currentItems, newItem]);
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
                            watch("items")
                              ?.find(
                                (itemW: { id: string }) =>
                                  itemW?.id == item?.value
                              )
                              ?.array_stock_counts?.find(
                                (item: { use_report: number }) =>
                                  item?.use_report == 1
                              )?.unit
                          } ${
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
              - Continue
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
