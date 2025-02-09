function PositionIcon({ color = "#A8A8B4" }: { color?: string }) {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.2 15V2.55556C12.2 2.143 12.0314 1.74733 11.7314 1.45561C11.4313 1.16389 11.0243 1 10.6 1H7.4C6.97565 1 6.56869 1.16389 6.26863 1.45561C5.96857 1.74733 5.8 2.143 5.8 2.55556V15M2.6 4.11111H15.4C16.2837 4.11111 17 4.80756 17 5.66667V13.4444C17 14.3036 16.2837 15 15.4 15H2.6C1.71634 15 1 14.3036 1 13.4444V5.66667C1 4.80756 1.71634 4.11111 2.6 4.11111Z"
        stroke="#72727B"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default PositionIcon;
