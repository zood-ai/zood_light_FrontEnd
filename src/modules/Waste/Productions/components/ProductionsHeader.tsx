import ArrowReturn from "@/assets/icons/ArrowReturn";
import { IProductionsHeader } from "../types/types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useProductionsHttp from "../queriesHttp/useProductionsHttp";
import CustomModal from "@/components/ui/custom/CustomModal";

const ProductionsHeader = ({
  setStep,
  step,
  singleItem,
  setValue,
  getValues,
  handleCloseSheet,
  row_id,
  quantity,
  modalName,
  setModalName,
  BatchName,
  oldQuantity,
}: IProductionsHeader) => {
  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet?.();
    } else {
      deleteproduction({ row_id });
    }
  };
  const {
    deleteproduction,
    isPendingDelete,
    updateproduction,
    isPendingUpdate,
  } = useProductionsHttp({
    handleCloseSheet,
  });
  return step === 1 ? (
    <h3 className="text-textPrimary text-[20px] border-b-[#F1F1F1]  border-b-[1px] w-full pb-2 font-medium">
      Choose item
    </h3>
  ) : step === 2 ? (
    <div className="flex items-center justify-between w-full border-b-[#F1F1F1]  border-b-[1px] pb-2">
      <div className="flex items-center gap-4">
        <ArrowReturn
          height="14px"
          className="cursor-pointer"
          onClick={() => {
            setStep(1);
          }}
        />
        <div className="">Create batch</div>
      </div>
      <div
        className={` text-[20px] font-bold cursor-pointer ${"text-primary"}`}
        onClick={() => {
          const currentItems = getValues("items") || [];
          const findItem = currentItems.find(
            (item: { id: string; quantity: number; storage_unit: string }) =>
              item.id === singleItem?.id
          );

          const updatedItems = findItem
            ? currentItems.map(
              (item: {
                id: string;
                quantity: number;
                storage_unit: string;
                name: string;
              }) => {
                if (item.id === singleItem?.id) {
                  return {
                    ...item,
                    quantity: singleItem.quantity,
                  };
                } else {
                  return item;
                }
              }
            )
            : currentItems.concat(singleItem);

          setValue("items", updatedItems);
          setStep(1);
        }}
      >
        Done
      </div>
    </div>
  ) : step === 3 ? (
    <div className="flex items-center gap-2 border-b-[#F1F1F1]  border-b-[1px] pb-2 w-full">
      <ArrowReturn
        height="14px"
        className="cursor-pointer"
        onClick={() => {
          setStep(1);
        }}
      />
      <div className="text-textPrimary font-medium text-[20px]">Batch</div>
    </div>
  ) : (
    <div className="flex items-center justify-between w-full border-b-[1px] border-b-[#F1F1F1] pb-2 px-3 ">
      <h3 className="text-[20px] font-medium">Batch details</h3>
      <div className="flex gap-2">
        <Button
          disabled={
            isPendingUpdate ||
            isPendingDelete ||
            !+quantity ||
            +oldQuantity === +quantity
          }
          type="button"
          className="font-semibold px-2 min-w-20 "
          onClick={() => {
            updateproduction({
              row_id,
              quantity,
            });
          }}
        >
          {false ? <Loader2 className="animate-spin" /> : "save"}
        </Button>
        {/* <Button
          type="button"
          disabled={isPendingUpdate || isPendingDelete}
          variant="outline"
          onClick={() => setModalName("delete")}
          className="w-fit px-4 font-semibold text-warn border-warn "
        >
          Delete
        </Button> */}
      </div>
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={BatchName || ""}
        isPending={isPendingDelete}
      />
    </div>
  );
};

export default ProductionsHeader;
