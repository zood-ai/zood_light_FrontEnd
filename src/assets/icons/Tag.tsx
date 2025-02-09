import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const TagIcon: React.FC<PropsIcon> = ({
  color = "var(--text-primary)",
  className = "",
  onClick,
}) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none">
      <path
        d="M16.746 2.777A1.925 1.925 0 0014.902.933l-5.023.564a1.507 1.507 0 00-1.12.418l-.01.01L1.062 9.61c-.594.595-.605 1.543-.024 2.124l4.903 4.903c.58.58 1.529.57 2.123-.025l7.69-7.69.01-.01c.295-.295.435-.708.418-1.12l.56-5.019A1.925 1.925 0 0014.899.93m-.995 5.41c-.772.773-2.01.787-2.765.033-.754-.755-.74-1.993.032-2.765.773-.772 2.01-.786 2.765-.032.754.755.74 1.992-.032 2.765z"
        stroke={color}
        strokeMiterlimit={10}
      />
    </svg>
  );
};

export default TagIcon;
