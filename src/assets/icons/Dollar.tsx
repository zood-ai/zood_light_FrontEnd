import { PropsIcon } from "@/types/global.type";
import { memo } from "react";

const Dollar: React.FC<PropsIcon> = ({
  color = "var(--secondary-foreground)",
}) => {
  return (
    <svg
      width="10"
      height="15"
      viewBox="0 0 10 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 1V14.3333M8.33333 3H3.33333C2.7145 3 2.121 3.24583 1.68342 3.68342C1.24583 4.121 1 4.71449 1 5.33333C1 5.95217 1.24583 6.54566 1.68342 6.98325C2.121 7.42083 2.7145 7.66667 3.33333 7.66667H6.66667C7.28551 7.66667 7.879 7.9125 8.31658 8.35008C8.75417 8.78767 9 9.38116 9 10C9 10.6188 8.75417 11.2123 8.31658 11.6499C7.879 12.0875 7.28551 12.3333 6.66667 12.3333H1"
        stroke="#2F3D4C"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const DollarIcon = memo(Dollar);
export default DollarIcon;
