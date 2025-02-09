import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const WarningBg: React.FC<PropsIcon> = ({
  color = "#6DC6FA",
  className = "",
  onClick,
  width = "32",
  height = "32",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      onClick={onClick}
    >
      <circle cx="16" cy="16" r="16" fill="#EDFAFD" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16 22C19.3137 22 22 19.3137 22 16C22 12.6863 19.3137 10 16 10C12.6863 10 10 12.6863 10 16C10 19.3137 12.6863 22 16 22ZM24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16Z"
        fill={color}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16 11.5C16.5523 11.5 17 11.9477 17 12.5V16.5C17 17.0523 16.5523 17.5 16 17.5C15.4477 17.5 15 17.0523 15 16.5V12.5C15 11.9477 15.4477 11.5 16 11.5Z"
        fill={color}
      />
      <path
        d="M16 20.5C16.5523 20.5 17 20.0523 17 19.5C17 18.9477 16.5523 18.5 16 18.5C15.4477 18.5 15 18.9477 15 19.5C15 20.0523 15.4477 20.5 16 20.5Z"
        fill={color}
      />
    </svg>
  );
};

const WarningBgIcon = React.memo(WarningBg);
export default WarningBgIcon;
