import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const Time: React.FC<PropsIcon> = ({
  color = "#8D6FC9",
  className,
  width = "10",
  height = "10",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" r="7" fill="white" />
      <path
        d="M7 0C3.13425 0 0 3.13425 0 7C0 10.8657 3.13425 14 7 14C10.8657 14 14 10.8657 14 7C14 3.13425 10.8657 0 7 0ZM7.58333 7.58333H2.91375C2.59292 7.58333 2.33333 7.32375 2.33333 7.00292V6.9965C2.33333 6.67625 2.59292 6.41667 2.91375 6.41667H6.41667V1.74708C6.41667 1.42625 6.67625 1.16667 6.99708 1.16667H7.0035C7.32375 1.16667 7.58333 1.42625 7.58333 1.74708V7.58333Z"
        fill={color}
      />
    </svg>
  );
};

const TimeIcon = React.memo(Time);
export default TimeIcon;
