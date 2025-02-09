import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const Info: React.FC<PropsIcon> = ({
  color = "var(--gray-300)",
  className,
  width = "1.3em",
  height = "1.3em",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 15 15" fill="none">
      <g
        clipPath="url(#prefix__clip0_2309_23928)"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.5 13.75a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zM7.5 10V7.5M7.5 5h.006" />
      </g>
      <defs>
        <clipPath id="prefix__clip0_2309_23928">
          <path fill="#fff" d="M0 0h15v15H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const InfoIcon = React.memo(Info);
export default InfoIcon;
