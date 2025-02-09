import { Button } from "@/components/ui/button";
import useCommonRequests from "@/hooks/useCommonRequests";
import moment from "moment";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import useTransferHttp from "../queriesHttp/useTransferHttp";
import { count } from "console";
type ItemType = {
  name: string;
  quantity: number;
  total_cost: number;
  pack_unit: string;
  cost: number;
  array_stock_counts: {
    use_report: number;
    count: number;
    unit: string;
  }[];
};
const TransferDetails = ({
  modalName,
  isLoadingCreate,
}: {
  setSteps: Dispatch<SetStateAction<number>>;
  modalName: string;
  isLoadingCreate;
}) => {
  const { watch } = useFormContext();
  const { branchesSelect } = useCommonRequests({
    getBranches: true,
  });

  return (
    <div className="text-textPrimary px-[8px] mt-[32px]">
      <div className="border-b pb-[16px] ">
        <div className="flex justify-between items-center mb-[14px]">
          <p> {modalName == "send" ? <>Sent to</> : <>Requested from</>} </p>
          <p>
            {modalName == "send"
              ? branchesSelect?.find(
                  (branch: any) => branch?.value == watch("branch_id")
                )?.label
              : branchesSelect?.find(
                  (branch: any) => branch?.value == watch("warehouse_id")
                )?.label}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p>Delivery day</p>
          <p>{moment(watch("delivery_date")).format("LL")}</p>
        </div>
      </div>
      <div className="grid grid-cols-8 font-bold pt-[10px]">
        <div className="col-span-5">Items</div>
        <div className="col-span-2">Quantity</div>
        <div className="col-end-10">Values</div>
      </div>

      {watch("items")?.map((item: ItemType) => (
        <div className="grid grid-cols-8 my-[25px] " key={item.name}>
          <div className="col-span-5">{item?.name}</div>
          <div className="col-span-2">
            {(() => {
              const stockCount = item?.array_stock_counts?.find(
                (stock: { use_report: number }) => stock?.use_report === 1
              );
              return stockCount
                ? `${item?.quantity / stockCount?.count} (${stockCount?.unit})`
                : ``;
            })()}
          </div>
          <div className="col-end-10">SAR {item?.total_cost}</div>
        </div>
      ))}

      <div className="bg-popover font-bold p-[18px] rounded-[4px] flex justify-between items-center mt-[16px]">
        <p className="uppercase">Total value:</p>
        <p>
          SAR{" "}
          {watch("items")?.reduce(
            (acc: number, curr: { total_cost: number }) =>
              acc + +curr?.total_cost,
            0
          )}
        </p>
      </div>

      <Button
        className="w-[645px] absolute bottom-0 mb-2 ml-1 bg-primary font-semibold h-[48px] rounded-3xl"
        loading={isLoadingCreate}
      >
        {" "}
        {modalName == "send" ? <>Send transfer</> : <>Request transfer</>}
      </Button>
    </div>
  );
};

export default TransferDetails;
