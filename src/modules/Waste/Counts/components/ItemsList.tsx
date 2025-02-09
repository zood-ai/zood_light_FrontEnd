import { Skeleton } from "@/components/ui/skeleton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Button } from "@/components/ui/button";
import useFilterQuery from "@/hooks/useFilterQuery";
import useCountsHttp from "../queriesHttp/useCountsHttp";
import CustomModal from "@/components/ui/custom/CustomModal";
import EmptyItemsIcon from "@/assets/icons/EmptyItems";
import { ICountHeader, ICountItem } from "../types/types";
import useCommonRequests from "@/hooks/useCommonRequests";

const ItemsList = ({
  setSteps,
  itemsData,
  isFetchingItems,
  setSelectedItemIndex,
  countId,
  handleCloseSheet,
  setOpenReport,
  setGetReport,
  getReport,
  setCountId,
  setIsFirst,
  fromReport,
}: {
  setSteps: Dispatch<SetStateAction<number>>;
  itemsData: { name: string; id: string; stock_counts: any }[];
  isFetchingItems: boolean;
  setSelectedItemIndex: Dispatch<SetStateAction<number>>;
  countId: string;
  handleCloseSheet?: () => void;
  setOpenReport?: (open: boolean) => void;
  setGetReport?: (getReport: boolean) => void;
  getReport?: boolean;
  setCountId?: (countId: string) => void;
  setIsFirst?: (isFirst: boolean) => void;
  fromReport?: boolean;
  isEdit?: boolean;
}) => {
  const { getValues } = useFormContext();

  const [modalName, setModalName] = useState("");
  const { filterObj } = useFilterQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterdItems, setFilterdItems] =
    useState<{ name: string; id: string; stock_counts: any }[]>();

  useEffect(() => {
    setFilterdItems(itemsData);
  }, [itemsData]);

  const { storageAreasSelect } = useCommonRequests({
    getStorageAreas: true,
    filterByBranch: `filter[branch_id]=${searchParams.get(
      "filter[branch]"
    )}&type=all`,
  });

  const handleConfirm = () => {
    updateCounts({
      id: countId,
      values: { ...getValues(), status: 2 },
    });
  };

  useEffect(() => {
    handleSearch(searchParams.get("search") || "");
  }, [itemsData]);

  const handleSearch = (value: string) => {
    setSearchParams({ ...filterObj, search: value });
    if (value) {
      const filteredItems: { name: string; id: string; stock_counts: any }[] =
        itemsData?.filter((item: any) =>
          item?.name.toLowerCase().includes(value.toLowerCase())
        ) ?? [];

      setFilterdItems(filteredItems);
    } else {
      setFilterdItems(itemsData);
    }
  };

  const { updateCounts, isPendingUpdate } = useCountsHttp({
    handleCloseSheet,
    countId,
    setModalName,
    setOpenReport,
    setGetReport,
    getReport,
    setCountId,
    setIsFirst,
  });

  const renderItemsList = () => {
    if (isFetchingItems) {
      return (
        <div className="flex flex-col gap-5 mt-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-4 w-[150px] bg-gray-300" key={index} />
          ))}
        </div>
      );
    }

    if (filterdItems?.length) {
      return filterdItems?.map(
        (
          item: { name: string; id: string; stock_counts: any },
          index: number
        ) => {
          const itemStock = item.stock_counts?.find(
            (sc) => sc.use_report === 1
          );

          return (
            <div
              key={item.id}
              className="flex justify-between items-center py-[15px] tracking-wider mb-3 cursor-pointer  border-b-[1px] border-[#ECF0F1] mt-3"
              onClick={() => {
                setSteps(3);
                setSelectedItemIndex(index);
              }}
            >
              <div className="flex items-center justify-between gap-2 text-textPrimary text-[14px] font-medium ">
                {item?.name}
              </div>
              {getValues("items")?.find((it) => it.id === item.id) && (
                <div className="font-bold">
                  {getValues("items")
                    ?.find((it: ICountItem) => it.id === item.id)
                    ?.array_stock_counts?.reduce(
                      (acc: number, crr: ICountHeader["stockCounts"][0]) => {
                        return acc + crr.quantity * +crr.count;
                      },
                      0
                    ) / itemStock.count || 0}{" "}
                  {itemStock?.unit ||
                    getValues("items")?.find(
                      (it: ICountItem) => it.id === item.id
                    )?.unit}
                </div>
              )}
            </div>
          );
        }
      );
    }

    return (
      <div className="flex flex-col items-center justify-center gap-2 mt-12 ">
        <EmptyItemsIcon />
        <p className="text-textPrimary font-semibold text-[20px]">No items</p>
        <span className="text-[16px] text-textPrimary">
          Your items will live here
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 ">
        <CustomSelect
          options={storageAreasSelect}
          optionDefaultLabel="All storage areas"
          width="w-[300px]"
          height="h-[40px]"
          value={searchParams.get("filter[storage_areas]") || ""}
          onValueChange={(e) => {
            if (e !== "null") {
              setSearchParams({ ...filterObj, ["filter[storage_areas]"]: e });
            } else {
              setSearchParams({ ...filterObj, ["filter[storage_areas]"]: "" });
            }
          }}
        />
        <CustomSelect
          options={[
            { label: "Food", value: "Food" },
            { label: "Beverage ", value: "Beverage" },
            { label: "Misc", value: "Misc" },
          ]}
          optionDefaultLabel="All item types"
          value={searchParams.get("filter[type]") || ""}
          onValueChange={(e) => {
            if (e !== "null") {
              setSearchParams({ ...filterObj, ["filter[type]"]: e });
            } else {
              setSearchParams({ ...filterObj, ["filter[type]"]: "" });
            }
          }}
          width="w-[300px]"
          height="h-[40px]"
        />
      </div>
      <Input
        placeholder={"Search by name"}
        searchIcon={true}
        className="w-full h-[40px]"
        value={searchParams.get("search") || ""}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      {renderItemsList()}

      <div className="absolute bottom-0 px-5 left-0  bg-white flex justify-between items-center py-[15px] cursor-pointer  border-t-[1px] border-[#ECF0F1]  w-full">
        <div className="text-[14px] text-textPrimary ">
          <strong className="text-textPrimary">
            {getValues("items")?.length ?? 0} / {itemsData?.length}{" "}
          </strong>
          items{" "}
        </div>
        <div>
          <Button
            variant={"outline"}
            className="border-none text-primary text-[16px] font-medium"
            disabled={isPendingUpdate || getValues("items")?.length === 0}
            onClick={() => {
              if (fromReport) {
                setSteps(1);
                return;
              }
              if (getValues("items")?.length === itemsData?.length) {
                handleConfirm();
                return;
              }
              setModalName("finish");
            }}
          >
            {fromReport ? "Edit Count" : "Finish"}
          </Button>
          <Button
            className="rounded-sm bg-primary font-bold text-[16px] h-[40px]"
            disabled={isPendingUpdate || !filterdItems?.length}
            onClick={() => {
              if (fromReport) {
                handleConfirm();
                return;
              }
              updateCounts({
                id: countId,
                values: getValues(),
              });
            }}
          >
            {fromReport ? "Finish update" : "Save count"}
          </Button>
        </div>
      </div>

      <CustomModal
        headerModal="Uncounted items left"
        descriptionModal={
          <p>
            You have{" "}
            <span className="font-bold">
              {itemsData?.length - getValues("items")?.length}
            </span>{" "}
            uncounted items.If you confirm the count all uncounted items will be
            assigned their should have value in the final report.
          </p>
        }
        isPending={isPendingUpdate}
        bgColor={"#FFE7CC"}
        iconColor={"#FF8800"}
        modalName={modalName}
        modalWidth="w-[466px]"
        confirmbtnText="Confirm Count"
        confirmbtnStyle="bg-primary border-none text-white h-[48px]"
        setModalName={setModalName}
        handleConfirm={handleConfirm}
      />
    </>
  );
};

export default ItemsList;
