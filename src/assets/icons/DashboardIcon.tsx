import { PropsIcon } from "@/types/global.type";
import { memo } from "react";

const Dashboard: React.FC<PropsIcon> = ({ color = "var(--gray-300)" }) => {
  return (
    <svg width="1rem" height="1rem" viewBox="0 0 20 20" fill="none">
      <path
        d="M1 1v18h18m-3-4V7m-5 8V3M6 15v-3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const DashboardIcon = memo(Dashboard);
export default DashboardIcon;
