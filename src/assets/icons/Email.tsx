import { PropsIcon } from "@/types/global.type";
import { memo } from "react";

const Email: React.FC<PropsIcon> = ({ className }) => {
  return (
    <svg
      className={className}
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 2.5L6.515 5.35C6.36064 5.44671 6.18216 5.49801 6 5.49801C5.81784 5.49801 5.63936 5.44671 5.485 5.35L1 2.5M2 1H10C10.5523 1 11 1.44772 11 2V8C11 8.55228 10.5523 9 10 9H2C1.44772 9 1 8.55228 1 8V2C1 1.44772 1.44772 1 2 1Z"
        stroke="var(--primary)"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Email;
