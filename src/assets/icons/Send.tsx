import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const SendIcon: React.FC<PropsIcon> = ({ color = "var(--info)" }) => {
  return (
    <svg width="1.2em" height="1.2em" viewBox="0 0 19 19" fill="none">
      <path
        d="M14.75 10.167v5.5a1.833 1.833 0 01-1.833 1.833H2.833A1.833 1.833 0 011 15.667V5.583A1.833 1.833 0 012.833 3.75h5.5M12 1h5.5m0 0v5.5m0-5.5L7.417 11.083"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SendIcon;
