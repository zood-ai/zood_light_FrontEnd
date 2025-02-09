import WarningIcon from "@/assets/icons/Warning";
import { format } from "date-fns";

interface DeliveryWarningProps {
  deliveryDate: {
    order_date: string;
    time: string;
    order_day: string;
    delivery_date: string;
  };
  shoppingCart?: boolean;
}
const DeliveryWarning = ({
  deliveryDate,
  shoppingCart = false,
}: DeliveryWarningProps) => {
  return (
    <div
      className={`bg-[#E9F9FC] flex gap-2 items-center p-2 border border-[#ECECEC] rounded-[4px] ${
        !shoppingCart && "mt-3"
      }  text-textPrimary`}
    >
      <WarningIcon />
      <p>
        Earliest delivery on{" "}
        <strong>
          {format(deliveryDate?.delivery_date || new Date(), "dd MMMM")}
        </strong>{" "}
        if ordered before <strong>{deliveryDate?.time}</strong> on{" "}
        <strong>
          {deliveryDate?.order_day} (
          {format(new Date(deliveryDate?.order_date || new Date()), "dd MMMM")})
        </strong>{" "}
        .
      </p>
    </div>
  );
};

export default DeliveryWarning;
