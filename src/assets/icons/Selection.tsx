import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const SelectionIcon: React.FC<PropsIcon> = ({
  color = "var(--text-primary)",
  className = "",
  onClick,
}) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 14" fill="none">
      <path
        d="M11 2.8c0 .994-2.239 1.8-5 1.8s-5-.806-5-1.8m10 0C11 1.806 8.761 1 6 1s-5 .806-5 1.8m10 0v8.4c0 .996-2.222 1.8-5 1.8s-5-.804-5-1.8V2.8M11 7c0 .996-2.222 1.8-5 1.8S1 7.996 1 7"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SelectionIcon;
