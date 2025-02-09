import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const Chat: React.FC<PropsIcon> = ({ color = "var(--gray-300)" }) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none">
      <path
        d="M19 13a2 2 0 01-2 2H5l-4 4V3a2 2 0 012-2h14a2 2 0 012 2v10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ChatIcon = React.memo(Chat);
export default ChatIcon;
