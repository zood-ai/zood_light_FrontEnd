import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const RightCircle: React.FC<PropsIcon> = ({
  color = "#46A193",
  className = "",
  onClick,
}) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 15.0588C4.1072 15.0588 0.9412 11.8926 0.9412 8C0.9412 4.1074 4.1072 0.9412 8 0.9412C11.8928 0.9412 15.0588 4.1074 15.0588 8C15.0588 11.8926 11.8926 15.0588 8 15.0588ZM8 0C3.5888 0 0 3.5888 0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4112 0 8 0ZM7.1196 9.6498L4.8588 7.389L4.1934 8.0544L7.1196 10.9806L12.12 5.9802L11.4546 5.3148L7.1196 9.6498Z"
        fill={color}
      />
    </svg>
  );
};

const RightCircleIcon = React.memo(RightCircle);
export default RightCircleIcon;
