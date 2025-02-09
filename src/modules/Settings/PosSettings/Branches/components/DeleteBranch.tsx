import { Button } from "@/components/ui/button";
import CustomModal from "@/components/ui/custom/CustomModal";
import { useState } from "react";
import useBranchesHttps from "../queriesHttp/useBranchesHttps";
import { useFormContext } from "react-hook-form";

const DeleteDevice = ({
  setIsEdit,
}: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [deleteBranch, setDeleteBranch] = useState("");
  const { getValues } = useFormContext();
  const handleClose = () => {
    setDeleteBranch("");
    setIsEdit(false);
  };
  const { branchDelete, branchDeleteOrder, branchDeleteTransaction } =
    useBranchesHttps({
      branchId: getValues("id"),
      handleCloseSheet: handleClose,
    });
  return (
    <div className="border border-warn p-[16px] rounded-[4px] flex flex-col gap-3 mt-5">
      <div className="flex justify-between items-center border-b border-input pb-3">
        <div>
          <p className="font-bold pb-3">Delete branch order</p>
          <p className="text-warn">
            If you delete this branch orders, all the data will be permanently
            deleted.
          </p>
        </div>
        <div>
          <Button
            className="border border-warn text-warn bg-white"
            type="button"
            onClick={() => {
              setDeleteBranch("delete order");
            }}
          >
            Delete order
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center border-b border-input pb-3">
        <div>
          <p className="font-bold pb-3">Delete Branch Inventory Transaction</p>
          <p className="text-warn">
            If you delete this branch inventory transactions, all the data will
            be permanently deleted.
          </p>
        </div>
        <div>
          <Button
            className="border border-warn text-warn bg-white"
            type="button"
            onClick={() => {
              setDeleteBranch("delete transaction");
            }}
          >
            Delete transaction
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center border-b border-input pb-3">
        <div>
          <p className="font-bold pb-3">Delete Branch</p>
          <p className="text-warn">
            If you delete this branch, all of its data will be permanently
            deleted.
          </p>
        </div>
        <div>
          <Button
            className="border border-warn  bg-warn text-white"
            type="button"
            onClick={() => {
              setDeleteBranch("delete branch");
            }}
          >
            Delete branch
          </Button>
        </div>
      </div>

      <CustomModal
        modalName={deleteBranch}
        setModalName={setDeleteBranch}
        handleConfirm={() => {
          if (deleteBranch == "delete order") {
            branchDeleteOrder();
          }

          if (deleteBranch == "delete transaction") {
            branchDeleteTransaction();
          }
          if (deleteBranch == "delete branch") {
            branchDelete();
          }
        }}
        deletedItemName={""}
      />
    </div>
  );
};

export default DeleteDevice;
