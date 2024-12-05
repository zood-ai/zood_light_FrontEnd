import WarningIcon from "@/assets/icons/Warning";
import { ReactNode } from "react";

const CustomAlert = ({
  bgColor,
  colorIcon,
  content,
  className,
}: {
  bgColor: string;
  colorIcon: string;
  className?: string;
  content: string | ReactNode;
}) => {
  return (
    <div
      className={`${bgColor} ${className} text-textPrimary mt-[11px] flex items-center gap-2  py-[14px] px-[16px] rounded-sm `}
    >
      <WarningIcon color={colorIcon} />
      <p className="tracking-wider">{content}</p>
    </div>
  );
};

export default CustomAlert;
