import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useFilterQuery from "@/hooks/useFilterQuery";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { handleStatus, handleTypeColor } from "../helpers/helpers";

const EditTransfer = ({
  setSteps,
  TransferOne,
  isLoadingUpdate,
}: {
  setSteps: Dispatch<SetStateAction<number>>;
  TransferOne: any;
  isLoadingUpdate: boolean;
}) => {
  const { watch, setValue } = useFormContext();
  const { filterObj } = useFilterQuery();

  return (
    <div className=" text-textPrimary px-[8px]">
      <p>
        {filterObj["filter[branch]"] == watch("branch_id") ? (
          <div className="flex justify-between pb-3">
            <p>From</p>
            <p className="capitalize">{watch("warehouse_name")}</p>
          </div>
        ) : (
          <div className="flex justify-between pb-3">
            <p>To</p>
            <p className="capitalize">{watch("branch_name")}</p>
          </div>
        )}
      </p>

      <div className="flex justify-between pb-3">
        <p>{watch("type") == 4 ? <>Requested on</> : <>Sent on</>}</p>
        <p className="capitalize">{moment(watch("created_at")).format("LL")}</p>
      </div>

      <div className="flex justify-between pb-3">
        <p>Delivery day</p>
        <p>{moment(watch("delivery_date")).format("LL")}</p>
      </div>
      <div className="flex justify-between pb-3">
        <p>Status</p>
        <p>
          {filterObj["filter[branch]"] ? (
            <Badge
              variant={
                filterObj["filter[branch]"] == TransferOne?.branch_id &&
                TransferOne?.status == 1
                  ? "info"
                  : filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                    TransferOne?.status == 1
                  ? "info"
                  : filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                    TransferOne?.status == 2
                  ? "success"
                  : filterObj["filter[branch]"] == TransferOne?.branch_id &&
                    TransferOne?.status == 2
                  ? "info"
                  : filterObj["filter[branch]"] == TransferOne?.branch_id &&
                    TransferOne?.status == 4 &&
                    TransferOne?.type == 1
                  ? "success"
                  : filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                    TransferOne?.status == 4 &&
                    TransferOne?.type == 1
                  ? "success"
                  : filterObj["filter[branch]"] == TransferOne?.branch_id &&
                    TransferOne?.status == 5 &&
                    TransferOne?.type == 4
                  ? "danger"
                  : filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                    TransferOne?.status == 5 &&
                    TransferOne?.type == 4
                  ? "danger"
                  : filterObj["filter[branch]"] == TransferOne?.branch_id &&
                    TransferOne?.status == 6 &&
                    TransferOne?.type == 4
                  ? "danger"
                  : filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                    TransferOne?.status == 6 &&
                    TransferOne?.type == 4
                  ? "danger"
                  : filterObj["filter[branch]"] == TransferOne?.branch_id &&
                    TransferOne?.status == 5 &&
                    TransferOne?.type == 1
                  ? "danger"
                  : filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                    TransferOne?.status == 5 &&
                    TransferOne?.type == 1
                  ? "danger"
                  : filterObj["filter[branch]"] == TransferOne?.branch_id &&
                    TransferOne?.status == 4 &&
                    TransferOne?.type == 4
                  ? "success"
                  : filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                    TransferOne?.status == 4 &&
                    TransferOne?.type == 4
                  ? "success"
                  : "default"
              }
            >
              {filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                TransferOne?.status == 1 &&
                `Requested`}
              {filterObj["filter[branch]"] == TransferOne?.branch_id &&
                TransferOne?.status == 1 &&
                "Requested"}

              {filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                TransferOne?.status == 2 &&
                `Sent`}
              {filterObj["filter[branch]"] == TransferOne?.branch_id &&
                TransferOne?.status == 2 &&
                "Incoming"}

              {filterObj["filter[branch]"] == TransferOne?.branch_id &&
                TransferOne?.status == 5 &&
                TransferOne?.type == 4 &&
                " Rejected "}
              {filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                TransferOne?.status == 5 &&
                TransferOne?.type == 4 &&
                `Rejected `}

              {filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                TransferOne?.status == 6 &&
                TransferOne?.type == 4 &&
                `Rejected `}
              {filterObj["filter[branch]"] == TransferOne?.branch_id &&
                TransferOne?.status == 6 &&
                TransferOne?.type == 4 &&
                `Rejected Request`}

              {filterObj["filter[branch]"] == TransferOne?.branch_id &&
                TransferOne?.status == 5 &&
                TransferOne?.type == 1 &&
                " Rejected "}
              {filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                TransferOne?.status == 5 &&
                TransferOne?.type == 1 &&
                `Rejected `}

              {filterObj["filter[branch]"] == TransferOne?.branch_id &&
                TransferOne?.status == 4 &&
                TransferOne?.type == 1 &&
                "Received"}
              {filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                TransferOne?.status == 4 &&
                TransferOne?.type == 1 &&
                "Sent"}

              {filterObj["filter[branch]"] == TransferOne?.branch_id &&
                TransferOne?.status == 4 &&
                TransferOne?.type == 4 &&
                "Received"}
              {filterObj["filter[branch]"] == TransferOne?.warehouse_id &&
                TransferOne?.status == 4 &&
                TransferOne?.type == 4 &&
                "Sent"}
            </Badge>
          ) : (
            <Badge variant={handleTypeColor(TransferOne?.status)}>
              {handleStatus(TransferOne?.status)}
            </Badge>
          )}
        </p>
      </div>
      {watch("decline_reason")?.length && (
        <div className="flex justify-between pb-3">
          <p>Reason</p>
          <p>{watch("decline_reason")}</p>
        </div>
      )}

      <div className="grid grid-cols-7  font-bold mt-4 items-center border-t border-[#ECF0F1] pt-[16px]">
        <p className="col-span-4">Item</p>
        <p className="col-span-2">Quantity</p>
        <p className="col-end-9">Value</p>
      </div>

      {watch("items")?.map((e: any) => (
        <div
          className="grid grid-cols-7 mt-4 items-center cursor-pointer "
          onClick={() => {
            if (
              (filterObj["filter[branch]"] !== watch("branch_id") &&
                TransferOne?.status == 1) ||
              (filterObj["filter[branch]"] !== watch("warehouse_id") &&
                TransferOne?.status == 2)
            ) {
              setSteps(2);

              setValue("item.name", e?.name);
              setValue("item.id", e?.id);
            }
          }}
        >
          <p className="col-span-4">{e.name}</p>
          <p className="col-span-2">
            {e.quantity !== e.quantityOld && (
              <span className="line-through text-gray">
                {e?.quantityOld}{" "}
                {
                  e.array_stock_counts?.find(
                    (item: any) => item?.use_report == 1
                  )?.unit
                }
              </span>
            )}{" "}
            {e.quantity /
              e.array_stock_counts?.find((item: any) => item?.use_report == 1)
                ?.count}{" "}
            {
              e.array_stock_counts?.find((item: any) => item?.use_report == 1)
                ?.unit
            }
          </p>
          <p className="col-end-9">
            {" "}
            {e.quantity !== e.quantityOld && (
              <span className="line-through text-gray">
                {e.unit_cost * e?.quantityOld} SAR
              </span>
            )}{" "}
            {e.unit_cost * e.quantity} SAR
          </p>
        </div>
      ))}

      {/* request + request */}
      <div className="bg-popover p-3 flex justify-between mt-3">
        <span className="font-bold uppercase">total value</span>

        <div className="font-bold ">
          {/* {watch(`items.${ItemIndex}.quantity`)} ({item?.pack_unit}) */}
          {watch("items")?.map((e: any) => e.quantity)[0] !==
            watch("items")?.map((e: any) => e.quantityOld)[0] && (
            <span className="line-through text-gray">
              {watch("items").reduce(
                (
                  acc: number,
                  curr: { unit_cost: number; quantityOld: number }
                ) => acc + +curr?.unit_cost * curr?.quantityOld,
                0
              ) || 0}{" "}
              SAR
            </span>
          )}{" "}
          {watch("items").reduce(
            (acc: number, curr: { unit_cost: number; quantity: number }) =>
              acc + +curr?.unit_cost * curr?.quantity,
            0
          ) || 0}{" "}
          SAR
        </div>
      </div>

      <>
        {filterObj["filter[branch]"] && (
          <>
            {filterObj["filter[branch]"] !== watch("branch_id") &&
              TransferOne?.status == 1 && (
                <>
                  <Button
                    className="w-[645px] absolute bottom-[56px] mb-2 ml-1 bg-primary font-semibold h-[48px] rounded-3xl"
                    loading={isLoadingUpdate}
                    onClick={() => {
                      setValue("status", 2);

                      setValue(
                        "total_amount",
                        watch("items").reduce(
                          (
                            acc: number,
                            curr: { unit_cost: number; quantity: number }
                          ) => acc + +curr?.unit_cost * curr?.quantity,
                          0
                        ) || 0
                      );
                    }}
                  >
                    Send transfer
                  </Button>
                  <Button
                    className="w-[645px] absolute bottom-0 mb-2 ml-1 font-semibold h-[48px] rounded-3xl text-warn bg-transparent border-warn border"
                    onClick={() => {
                      // setValue('status', 6)
                      setSteps(3);

                      setValue(
                        "total_amount",
                        watch("items").reduce(
                          (
                            acc: number,
                            curr: { unit_cost: number; quantity: number }
                          ) => acc + +curr?.unit_cost * curr?.quantity,
                          0
                        ) || 0
                      );
                    }}
                  >
                    Reject transfer request
                  </Button>
                </>
              )}

            {/* incoming + Send */}
            {filterObj["filter[branch]"] !== watch("warehouse_id") &&
              TransferOne?.status == 2 && (
                <>
                  <Button
                    className="w-[645px] absolute bottom-[56px] mb-2 ml-1 bg-primary font-semibold h-[48px] rounded-3xl"
                    loading={isLoadingUpdate}
                    onClick={() => {
                      setValue("status", 4);

                      setValue(
                        "total_amount",
                        watch("items").reduce(
                          (
                            acc: number,
                            curr: { unit_cost: number; quantity: number }
                          ) => acc + +curr?.unit_cost * curr?.quantity,
                          0
                        ) || 0
                      );
                    }}
                  >
                    Receive transfer
                  </Button>
                  <Button
                    className="w-[645px] absolute bottom-0 mb-2 ml-1 font-semibold h-[48px] rounded-3xl text-warn bg-transparent border-warn border"
                    onClick={() => {
                      // setValue('status', 5)
                      setSteps(3);

                      setValue(
                        "total_amount",
                        watch("items").reduce(
                          (
                            acc: number,
                            curr: { unit_cost: number; quantity: number }
                          ) => acc + +curr?.unit_cost * curr?.quantity,
                          0
                        ) || 0
                      );
                    }}
                  >
                    Reject transfer request
                  </Button>
                </>
              )}
          </>
        )}
      </>
    </div>
  );
};

export default EditTransfer;
