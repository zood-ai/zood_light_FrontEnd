import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const ArrowRight: React.FC<PropsIcon> = ({
  color = "var(--primary)",
  className = "",
  onClick,
  height = "32px",
  width = "32px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M12 24L20 16L12 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ArrowRightIcon = React.memo(ArrowRight);
export default ArrowRightIcon;
