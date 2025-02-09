import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFilterQuery from "@/hooks/useFilterQuery";
import React from "react";
import { useFormContext } from "react-hook-form";

const RejectTransfer = ({
  TransferOne,
  isLoadingUpdate,
}: {
  TransferOne: any;
  isLoadingUpdate: boolean;
}) => {
  const { watch, setValue, register } = useFormContext();
  const { filterObj } = useFilterQuery();

  return (
    <>
      <Input
        className="w-[645px] h-[80px] m-5"
        {...register("decline_reason")}
      />
      {/* requested reject */}
      {filterObj["filter[branch]"] !== watch("branch_id") &&
        TransferOne?.status == 1 && (
          <Button
            className="w-[645px] absolute bottom-0 mb-2 ml-3 font-semibold h-[48px] rounded-3xl text-warn bg-transparent border-warn border"
            loading={isLoadingUpdate}
            onClick={() => {
              setValue("status", 6);
            }}
            disabled={!watch("decline_reason")?.length}
          >
            Confirm Rejection
          </Button>
        )}

      {/* reject */}
      {filterObj["filter[branch]"] !== watch("warehouse_id") &&
        TransferOne?.status == 2 && (
          <Button
            className="w-[645px] absolute bottom-0 mb-2 ml-1 font-semibold h-[48px] rounded-3xl text-warn bg-transparent border-warn border"
            loading={isLoadingUpdate}
            onClick={() => {
              setValue("status", 5);
            }}
            disabled={!watch("decline_reason")?.length}
          >
            Confirm Rejection
          </Button>
        )}
    </>
  );
};

export default RejectTransfer;
