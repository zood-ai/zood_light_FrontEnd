import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const Export: React.FC<PropsIcon> = ({
  color = "white",
  className = "",
  onClick,
}) => {
  return (
    <svg width="1.5em" height="1.5em" viewBox="0 0 16 20" fill="none" className={className}>
      <path
        d="M10 1v5.4h5.4m-7.2 9V10m0 5.4l-2.7-2.7m2.7 2.7l2.7-2.7M10.45 1H2.8A1.8 1.8 0 001 2.8v14.4A1.8 1.8 0 002.8 19h10.8a1.8 1.8 0 001.8-1.8V5.95L10.45 1z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Export;
