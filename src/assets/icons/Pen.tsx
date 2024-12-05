import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const Pen: React.FC<PropsIcon> = ({
  color = "var(--info)",
  className = "",
  onClick,
}) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <path
        d="M11.4 1L14 3.6M4.575 13.025L12.05 5.55L9.45 2.95L1.975 10.425L1 14L4.575 13.025Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const PenIcon = React.memo(Pen);
export default PenIcon;
