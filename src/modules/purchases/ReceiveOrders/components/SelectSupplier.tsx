import { useSearchParams } from "react-router-dom";

// Hooks
import useFilterQuery from "@/hooks/useFilterQuery";

// Icons
import ArrowRightIcon from "@/assets/icons/ArrowRight";
import { Skeleton } from "@/components/ui/skeleton";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import usePurchaseOrderHttp from "../../PurchaseOrders/queriesHttp/usePurchaseOrderHttp";

const SuppliersList = ({
  setSteps,
}: {
  setSteps: Dispatch<SetStateAction<number>>;
}) => {
  const [_, setSearchParams] = useSearchParams();
  const { filterObj } = useFilterQuery();
  const handleCloseSheet = () => {};
  const { SuppliersSelect, isFetching } = usePurchaseOrderHttp({
    handleCloseSheet: handleCloseSheet,
  });
  const { setValue, watch } = useFormContext();

  return (
    <div>
      {isFetching ? (
        <div className="flex gap-5 flex-col">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-4 w-[150px] " key={index} />
          ))}
        </div>
      ) : SuppliersSelect?.length > 0 ? (
        SuppliersSelect?.map(
          (supplier: {
            label: string;
            value: string;
            accept_price_change: boolean;
          }) => {
            return (
              <div
                className="flex justify-between items-center py-[15px] cursor-pointer  border-b-[1px] border-[#ECF0F1]"
                onClick={() => {
                  setSearchParams({
                    ...filterObj,
                    "filter[supplier]": supplier.value,
                  });
                  setValue("branch", filterObj["filter[branch]"]);
                  setValue("supplier", supplier.value);

                  setValue(
                    "accept_price_change_from_supplier",
                    supplier?.accept_price_change
                  );
                  setSteps(2);
                }}
              >
                <div className="flex items-center gap-2 text-textPrimary">
                  <span className="w-[32px] h-[32px] font-semibold flex items-center justify-center text-[#E0A16A] bg-[#FEF8F3] rounded-full">
                    {supplier?.label.slice(0, 2).toUpperCase()}
                  </span>
                  {supplier?.label}
                </div>
                <ArrowRightIcon className=" w-5 h-5 " />
              </div>
            );
          }
        )
      ) : (
        <div className="flex gap-5 flex-col">
          <p className="text-textPrimary">
            <div>👀</div>
            No Suppliers Found
          </p>
        </div>
      )}
    </div>
  );
};

export default SuppliersList;
