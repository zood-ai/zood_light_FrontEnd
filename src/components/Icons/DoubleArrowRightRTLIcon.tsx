const DoubleArrowRightRTLIcon = ({ isActive }: { isActive: boolean }) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.5 22L15.5 16L21.5 10"
        stroke={isActive ? "#363088" : "#DCDCDC"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10.5V22"
        stroke={isActive ? "#363088" : "#DCDCDC"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="16"
        cy="16"
        r="15.5"
        stroke={isActive ? "#363088" : "#DCDCDC"}
      />
    </svg>
  );
  export default DoubleArrowRightRTLIcon;
  