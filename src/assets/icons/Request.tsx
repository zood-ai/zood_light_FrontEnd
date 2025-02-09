import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const RequestIcon: React.FC<PropsIcon> = ({ color = "var(--secondary)" }) => {
  return (
    <svg width="1.2em" height="1.2em" viewBox="0 0 19 19" fill="none">
      <path
        d="M2.5 9V3a2 2 0 012-2h11a2 2 0 012 2v11a2 2 0 01-2 2h-6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 17.5l6-6m0 0v4.765M7 11.5H2.235"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default RequestIcon;
