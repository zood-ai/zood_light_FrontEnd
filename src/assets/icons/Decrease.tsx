import * as React from "react";

function DecreaseIcon({ color = "#A8A8B4" }: { color?: string }) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 10" fill="none">
      <path
        d="M17 9l-6.8-6.8-4 4L1 1m16 8h-4.8M17 9V4.2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default DecreaseIcon;
