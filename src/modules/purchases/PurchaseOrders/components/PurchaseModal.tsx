// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

interface PurchaseModalProps {
  modalName: string;
  setModalName: React.Dispatch<React.SetStateAction<string>>;
  handleConfirm: () => void;
  orderValue: number;
  isPending: boolean;
  suplierName: string;
  selectedDeliveredDate: string;
  deliveryDate: string;
}
const PurchaseModal = ({
  modalName,
  setModalName,
  handleConfirm,
  orderValue,
  isPending,
  suplierName,
  selectedDeliveredDate,
  deliveryDate,
}: PurchaseModalProps) => {
  const min_order = modalName === "min_order";
  const max_order = modalName === "max_order";
  const different_date = modalName === "different_date";
  const date_min = modalName === "date&min";
  const date_max = modalName === "date&max";

  return (
    <AlertDialog open={!!modalName}>
      <AlertDialogContent className="w-[448px] pb-2">
        <AlertDialogHeader>
          <AlertDialogDescription>
            <div className="text-center text-[18px] text-textPrimary font-semibold">
              {date_min
                ? "Order below minimum value and outside of delivery dates"
                : min_order
                ? "Order below minimum value"
                : date_max
                ? "Order above maximum value and outside of delivery dates"
                : max_order
                ? "Order above maximum value"
                : "Order outside delivery dates"}
            </div>
            <div className="text-center text-[16px] font-medium">
              {date_min
                ? `${suplierName} only deliver orders above SAR ${orderValue}. They might not be able to deliver your order on ${selectedDeliveredDate}. For orders placed now, the earliest delivery day is ${deliveryDate}`
                : min_order
                ? `${suplierName} only delivery orders above ${orderValue}. if you place the order, it might not be fulfilled by the supplier`
                : date_max
                ? `Orders from ${suplierName} are restricted to SAR ${orderValue} or less. 
                They might not be able to deliver your order on ${selectedDeliveredDate}. For orders placed now, the earliest delivery day is ${deliveryDate}.`
                : max_order
                ? `Orders from ${suplierName} are restricted to SAR ${orderValue} or less`
                : `${suplierName} might not be able to deliver your order on ${selectedDeliveredDate}. For orders placed now, the earliest delivery day is ${deliveryDate}`}
            </div>

            <div className="text-center text-[16px] font-medium">
              {min_order || date_min
                ? "Do you want to continue?"
                : max_order || date_max
                ? `To place this order, contact your manager, or reduce the order below SAR ${orderValue}`
                : ""}{" "}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {(min_order || different_date || date_min) && (
            <AlertDialogAction
              disabled={isPending}
              onClick={() => handleConfirm()}
              className="bg-primary border-none text-white text-[16px] h-[48px]"
            >
              Yes place order
            </AlertDialogAction>
          )}

          <AlertDialogCancel
            disabled={isPending}
            onClick={() => setModalName("")}
            className="text-primary h-[48px]"
          >
            {min_order || different_date || date_min
              ? "let me edit the order first"
              : "Edit order"}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PurchaseModal;
