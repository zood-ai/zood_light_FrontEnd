import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const DeviceIcon: React.FC<PropsIcon> = ({ color = "var(--text-primary)" }) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 11 19" fill="none">
      <path
        d="M10 3.267H1m3.375-1.134h2.25M10 13.467H1M2.049 1H8.95C9.531 1 10 1.473 10 2.056v14.888C10 17.527 9.53 18 8.951 18H2.05C1.469 18 1 17.527 1 16.944V2.056C1 1.473 1.47 1 2.049 1z"
        stroke={color}
        strokeWidth={0.8}
        strokeMiterlimit={10}
      />
    </svg>
  );
};

export default DeviceIcon;
