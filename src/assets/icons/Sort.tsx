import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const Sort: React.FC<PropsIcon> = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="7"
      fill="none"
      viewBox="0 0 6 6"
    >
      <path
        fill="var(--secondary-foreground)"
        d="M2.753 5.121a.3.3 0 0 0 .493 0l2.7-3.9A.3.3 0 0 0 5.7.75H.3a.3.3 0 0 0-.247.47z"
      ></path>
    </svg>
  );
};

const SortIcon = React.memo(Sort);
export default SortIcon;
