import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const ArrowDown: React.FC<PropsIcon> = ({
  color = "var(--text-primary)",
  className = "",
  onClick,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      onClick={onClick}
      className={className}
    >
      <path
        d="M1 1L5 5L9 1"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ArrowDownIcon = React.memo(ArrowDown);
export default ArrowDownIcon;
