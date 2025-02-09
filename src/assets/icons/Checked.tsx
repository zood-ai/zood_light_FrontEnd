import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const Checked: React.FC<PropsIcon> = ({
  color = "white",
  className = "",
  onClick,
}) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 17 13" fill="none" onClick={onClick} className={className}>
      <path
        d="M15.429 2l-9.233 9.4L2 7.127"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


const MemoChecked = React.memo(Checked);
export default MemoChecked;
