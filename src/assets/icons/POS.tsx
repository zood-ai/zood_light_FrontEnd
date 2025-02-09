import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const POSIcon: React.FC<PropsIcon> = ({ color = "var(--gray-300)" }) => {
  return (
    <svg width="1.2em" height="1.2em" viewBox="0 0 24 18" fill="none">
      <path
        d="M23 4.952H1v3.263h22M2.049 1H21.95C22.531 1 23 1.47 23 2.051V15.95c0 .58-.47 1.051-1.049 1.051H2.05A1.05 1.05 0 011 15.949V2.05C1 1.471 1.47 1 2.049 1z"
        stroke={color}
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </svg>
  );
};

export default POSIcon;
