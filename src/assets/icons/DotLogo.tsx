import { PropsIcon } from "@/types/global.type";
import { memo } from "react";

const Logo: React.FC<PropsIcon> = ({ className, height = "32px", width = "32px" }) => {
  return (
    <svg
      className={`svg-icon ${className}`}
      style={{
        width: width,
        height: height,
        verticalAlign: "middle",
        fill: "currentColor",
        overflow: "hidden",
      }}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M512 520.064m-414.464 0a3.238 3.238 0 1 0 828.928 0 3.238 3.238 0 1 0-828.928 0Z" />
    </svg>
  );
};

const DotLogo = memo(Logo);
export default DotLogo;
