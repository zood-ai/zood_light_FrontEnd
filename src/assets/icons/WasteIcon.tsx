import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const Waste: React.FC<PropsIcon> = ({ color = "var(--gray-300)" }) => {
  return (
    <svg width="1rem" height="1rem" viewBox="0 0 20 22" fill="none">
      <path
        d="M14.5 8.398l-9-5.19m-4.21 2.79l8.71 5m0 0l8.71-5m-8.71 5v10m9-6v-8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4a2 2 0 00-1 1.73v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4a2 2 0 001-1.73z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const WasteIcon = React.memo(Waste);
export default WasteIcon;
