import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const ArrowLeft: React.FC<PropsIcon> = ({
  color = "var(--primary)",
  className = "",
  onClick,
  height = "32",
  width = "32",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <path
        d="M20 24L12 16L20 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ArrowLeftIcon = React.memo(ArrowLeft);
export default ArrowLeftIcon;
