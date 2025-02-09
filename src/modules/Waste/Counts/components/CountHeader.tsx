import ArrowReturn from "@/assets/icons/ArrowReturn";
import { Button } from "@/components/ui/button";
import { changeFirstLetterToUpperCase } from "@/utils/function";
import useCountsHttp from "../queriesHttp/useCountsHttp";
import CustomModal from "@/components/ui/custom/CustomModal";
import { ICountHeader } from "../types/types";

const CountHeader = ({
  step,
  itemName,
  businessDate,
  dayOption,
  type,
  setStep,
  isEdit,
  countId,
  status,
  handleCloseSheet,
  modalName,
  setModalName,
  mainUnit,
  stockCounts,

  useReportCount,
  fromReport,
}: ICountHeader) => {
  const { deleteCount, isPendingDelete } = useCountsHttp({
    handleCloseSheet,
  });

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      deleteCount({ id: countId || "" });
    }
  };

  const renderCountHeader = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex items-center justify-between w-full border-b border-b-[#F1F1F1]  pb-2">
            <h1 className="text-textPrimary text-[20px]  font-medium w-full">
              {fromReport ? "Edit count type" : "Select count type"}
            </h1>
            {isEdit && !fromReport && (
              <Button
                type="button"
                disabled={isPendingDelete}
                variant="outline"
                onClick={() => setModalName("delete")}
                className="px-4 font-semibold w-fit text-warn border-warn "
              >
                Delete
              </Button>
            )}
          </div>
        );
      case 2:
        return (
          <h1 className="text-textPrimary flex items-center gap-2 pb-2 text-[20px] font-medium w-full">
            {changeFirstLetterToUpperCase(type)} count • {businessDate}
            <span className="bg-muted border border-secondary rounded-sm flex items-center justify-center w-[59px] h-[24px] text-secondary text-[12px] font-medium">
              Day {dayOption}{" "}
            </span>
          </h1>
        );

      default:
        return (
          <div className="flex items-center w-full">
            <ArrowReturn
              height="17px"
              className="cursor-pointer"
              onClick={() => {
                setStep(2);
              }}
            />
            <div className="flex text-[16px] text-textPrimary font-medium items-center justify-center w-full flex-col">
              {itemName}
              <span className="text-[14px] text-gray font-medium">
                {stockCounts?.reduce((acc, crr) => {
                  return acc + crr.quantity * crr.count;
                }, 0) / useReportCount || 0}{" "}
                {mainUnit?.unit}
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderCountHeader()}

      <CustomModal
        descriptionModal={
          modalName === "delete" ? (
            <div className="flex flex-col gap-2">
              <span>This count will be deleted</span>
              <span>Count type: {type}</span>
              <span>Count status: {status}</span>
            </div>
          ) : (
            "You should save your count first. If you exit now, you'll lose what you've counted so far."
          )
        }
        headerModal={
          modalName === "delete"
            ? "Delete count"
            : "Are you sure you want to stop counting"
        }
        modalName={modalName}
        modalWidth="w-[466px]"
        isPending={isPendingDelete}
        setModalName={setModalName}
        confirmbtnText={
          modalName === "delete" ? "Delete count" : "Stop counting"
        }
        handleConfirm={handleConfirm}
      />
    </>
  );
};

export default CountHeader;
