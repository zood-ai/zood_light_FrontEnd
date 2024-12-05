import { useState } from "react";

// Types
import { TDrawerType, TEmployee, TPopularShift } from "../types/types";

// Components
import PopularShiftDrawerHeader from "./PopularShiftDrawerHeader";
import PopularShiftDrawerBody from "./PopularShiftDrawerBody";

type TPopularShiftDrawer = {
  employees: TEmployee[];
  PopularShifts: TPopularShift[];
};
const PopularShiftDrawer = ({
  employees,
  PopularShifts,
}: TPopularShiftDrawer) => {
  const [drawerType, setDrawerType] = useState<TDrawerType>("addShiftDrawer");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border border-[#d4e2ed]  transition-[width] duration-300 ease-out ${
        !isOpen ? "w-[24px] bg-[#f0f5f9]" : "w-[200px]"
      }`}
    >
      <PopularShiftDrawerHeader
        setDrawerType={setDrawerType}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        drawerType={drawerType}
      />

      <PopularShiftDrawerBody
        isOpen={isOpen}
        drawerType={drawerType}
        employees={employees}
        PopularShifts={PopularShifts}
      />
    </div>
  );
};

export default PopularShiftDrawer;
