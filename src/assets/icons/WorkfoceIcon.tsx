import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const Workfoce: React.FC<PropsIcon> = ({ color = "var(--gray-300)" }) => {
  return (
    <svg width="1rem" height="1rem" viewBox="0 0 20 20" fill="none">
      <path
        d="M6.25 10.833a3.75 3.75 0 110-7.499 3.75 3.75 0 010 7.5zM6.25 5a2.083 2.083 0 100 4.167A2.083 2.083 0 006.25 5zm6.25 11.667A4.172 4.172 0 008.333 12.5H4.167A4.172 4.172 0 000 16.667V20h1.667v-3.333a2.5 2.5 0 012.5-2.5h4.166a2.5 2.5 0 012.5 2.5V20H12.5v-3.333zM14.583 7.5a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5zm0-5.833a2.083 2.083 0 100 4.166 2.083 2.083 0 000-4.166zM20 13.333a4.172 4.172 0 00-4.167-4.166H12.5v1.666h3.333a2.5 2.5 0 012.5 2.5v3.334H20v-3.334z"
        fill={color}
      />
    </svg>
  );
};

const WorkfoceIcon = React.memo(Workfoce);
export default WorkfoceIcon;
