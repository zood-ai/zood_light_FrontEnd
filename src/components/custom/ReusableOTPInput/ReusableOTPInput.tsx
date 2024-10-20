import React, { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
export const ReusableOTPInput = ({
  maxLength = 11,
  onChange,
  ...props
}: any) => {
  const [otpValues, setOtpValues] = useState(Array(maxLength).fill(""));

  const handleChange = (value: any, index: any) => {
    // const newOtpValues = [...otpValues];
    // newOtpValues[index] = value;
    // setOtpValues(newOtpValues);
    console.log("OTP Values:", value);

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <InputOTP
      maxLength={maxLength}
      onChange={handleChange}
      value={otpValues}
      {...props}
    >
      <InputOTPGroup>
        {otpValues.map((value, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
