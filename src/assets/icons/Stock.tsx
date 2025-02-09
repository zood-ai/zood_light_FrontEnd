import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const Stock: React.FC<PropsIcon> = ({
  color = "var(--text-primary)",
  className = "",
  onClick,
}) => {
  return (
    <svg
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <path
        d="M10.1009 10.7996L11.5011 12.1997L14.3014 9.39943M13.6013 6.59914V5.19899C13.601 4.95346 13.5362 4.71231 13.4133 4.49974C13.2905 4.28716 13.1139 4.11064 12.9012 3.98787L8.00072 1.18758C7.78787 1.0647 7.54642 1 7.30065 1C7.05487 1 6.81342 1.0647 6.60057 1.18758L1.70007 3.98787C1.48743 4.11064 1.31082 4.28716 1.18794 4.49974C1.06507 4.71231 1.00025 4.95346 1 5.19899V10.7996C1.00025 11.0451 1.06507 11.2863 1.18794 11.4988C1.31082 11.7114 1.48743 11.8879 1.70007 12.0107L6.60057 14.811C6.81342 14.9339 7.05487 14.9986 7.30065 14.9986C7.54642 14.9986 7.78787 14.9339 8.00072 14.811L9.40086 14.0129M10.451 6.17909L4.18533 2.56672M1.20302 4.49892L7.30065 7.99928M7.30065 7.99928L13.3983 4.49892M7.30065 7.99928V15"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const StockIcon = React.memo(Stock);
export default StockIcon;
