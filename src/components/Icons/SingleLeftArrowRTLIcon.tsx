const SingleLeftArrowRTLIcon = ({ isActive }: { isActive: boolean }) => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 22L20 16L14 10"
        stroke={isActive ? "#363088" : "#DCDCDC"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="16"
        cy="16"
        r="15.5"
        stroke={isActive ? "#363088" : "#DCDCDC"}
      />
    </svg>
  );
  export default SingleLeftArrowRTLIcon;
  