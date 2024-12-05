import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const ArrowFill: React.FC<PropsIcon> = ({
  color = "var(--secondary-foreground)",
  className,
}) => {
  return (
    <div className={`${className} -z-10`}>
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"

      >
        <path d="M4 5L0.535899 0.5L7.4641 0.5L4 5Z" fill={color} />
      </svg>
    </div>
  );
};

const ArrowFillIcon = React.memo(ArrowFill);
export default ArrowFillIcon;
