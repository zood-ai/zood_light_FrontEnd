import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const Chart: React.FC<PropsIcon> = ({
  color = "#69777D",
  className = "flex-shrink-0",
  onClick,
}) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <path
        d="M6.00065 14.6663H10.0007C13.334 14.6663 14.6673 13.333 14.6673 9.99967V5.99967C14.6673 2.66634 13.334 1.33301 10.0007 1.33301H6.00065C2.66732 1.33301 1.33398 2.66634 1.33398 5.99967V9.99967C1.33398 13.333 2.66732 14.6663 6.00065 14.6663Z"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.3333 12.3337C11.0667 12.3337 11.6667 11.7337 11.6667 11.0003V5.00033C11.6667 4.26699 11.0667 3.66699 10.3333 3.66699C9.6 3.66699 9 4.26699 9 5.00033V11.0003C9 11.7337 9.59333 12.3337 10.3333 12.3337Z"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.66732 12.333C6.40065 12.333 7.00065 11.733 7.00065 10.9997V8.66634C7.00065 7.93301 6.40065 7.33301 5.66732 7.33301C4.93398 7.33301 4.33398 7.93301 4.33398 8.66634V10.9997C4.33398 11.733 4.92732 12.333 5.66732 12.333Z"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const ChartIcon = React.memo(Chart);
export default ChartIcon;
