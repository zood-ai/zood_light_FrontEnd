import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const ArrowFilled: React.FC<PropsIcon> = ({
  color = "#68A798",
  className = "",
  onClick,
}) => {
  return (
    <svg
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={` ${className}`}
      onClick={onClick}
    >
      <path
        d="M4 6.99382e-07L7.4641 4.5L0.535898 4.5L4 6.99382e-07Z"
        fill={color}
      />
    </svg>
  );
};

const ArrowFilledIcon = React.memo(ArrowFilled);
export default ArrowFilledIcon;
