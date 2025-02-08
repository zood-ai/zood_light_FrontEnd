import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const BarIcon: React.FC<PropsIcon> = ({ color = "var(--gray-300)" }) => {
    return (
        <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M0 0.25C0 0.111929 0.111929 0 0.25 0H3.75C3.88807 0 4 0.111929 4 0.25V12.748C4 12.8861 3.88807 12.998 3.75 12.998H0.25C0.111929 12.998 0 12.8861 0 12.748V0.25Z' fill='#748FAA' /><path fill-rule='evenodd' clip-rule='evenodd' d='M5 0.25C5 0.111929 5.11193 0 5.25 0H8.75C8.88807 0 9 0.111929 9 0.25V12.723C9 12.8611 8.88807 12.973 8.75 12.973H5.25C5.11193 12.973 5 12.8611 5 12.723V0.25Z' fill='#748FAA' /><path fill-rule='evenodd' clip-rule='evenodd' d='M10 0.25C10 0.111929 10.1119 0 10.25 0H13.75C13.8881 0 14 0.111929 14 0.25V12.769C14 12.9071 13.8881 13.019 13.75 13.019H10.25C10.1119 13.019 10 12.9071 10 12.769V0.25Z' fill='#748FAA' /></svg>
    );
};

export default BarIcon;
