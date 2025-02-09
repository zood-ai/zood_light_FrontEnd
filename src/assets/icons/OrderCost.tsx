import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const OrderCost: React.FC<PropsIcon> = ({ color = "var(--text-primary)" }) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 17" fill="none">
      <path
        d="M14.263 7V5.498a1.52 1.52 0 00-.198-.75 1.487 1.487 0 00-.539-.548l-5.158-3a1.454 1.454 0 00-1.473 0l-5.158 3c-.224.132-.41.321-.54.549A1.52 1.52 0 001 5.499v6c0 .264.068.522.198.75.13.227.315.417.539.548l5.158 3a1.454 1.454 0 001.473 0l1.474-.855m1.105-8.393l-6.594-3.87m-3.14 2.07l6.419 3.75m0 0l6.418-3.75m-6.418 3.75V16m6.093-3.548L15 13.75m-.737-2.626c0 1.036-.825 1.876-1.842 1.876-1.017 0-1.842-.84-1.842-1.876 0-1.035.825-1.875 1.842-1.875 1.017 0 1.842.84 1.842 1.875z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default OrderCost;
