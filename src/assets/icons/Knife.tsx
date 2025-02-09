import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const Knife: React.FC<PropsIcon> = ({
  color = "var(--warn)",
  onClick,
  className,
}) => {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <path
        d="M15.8918 0.898438L0.724609 16.0683"
        stroke={color}
        stroke-miterlimit="10"
      />
      <path
        d="M18.3378 3.71484L13.49 8.56259L16.1676 11.1479C16.1676 11.1479 13.9512 13.9176 11.5043 15.35C9.05734 16.7823 6.79488 18.0736 3.51513 18.1658C3.0431 18.1658 2.4707 18.1089 2.4707 18.1089"
        stroke={color}
        stroke-miterlimit="10"
      />
      <path
        d="M10.8535 5.9375L13.4849 8.5689"
        stroke={color}
        stroke-miterlimit="10"
      />
    </svg>
  );
};

const KnifeIcon = React.memo(Knife);
export default KnifeIcon;
