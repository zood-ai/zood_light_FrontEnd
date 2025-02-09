import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const Cart: React.FC<PropsIcon> = ({
  color = "var(--text-primary)",
  className = "",
  onClick,
}) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <path
        d="M1 1H2.0978L3.55788 7.81736C3.61145 8.06704 3.75037 8.29023 3.95074 8.44852C4.15111 8.60682 4.4004 8.69031 4.65569 8.68463H10.024C10.2738 8.68423 10.516 8.59861 10.7106 8.44192C10.9053 8.28524 11.0406 8.06686 11.0943 7.82285L12 3.74451H2.68513M4.81487 11.4017C4.81487 11.7048 4.56912 11.9506 4.26597 11.9506C3.96282 11.9506 3.71707 11.7048 3.71707 11.4017C3.71707 11.0985 3.96282 10.8528 4.26597 10.8528C4.56912 10.8528 4.81487 11.0985 4.81487 11.4017ZM10.8528 11.4017C10.8528 11.7048 10.607 11.9506 10.3039 11.9506C10.0007 11.9506 9.75499 11.7048 9.75499 11.4017C9.75499 11.0985 10.0007 10.8528 10.3039 10.8528C10.607 10.8528 10.8528 11.0985 10.8528 11.4017Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CartIcon = React.memo(Cart);
export default CartIcon;
