// Types
import { TDrawerType } from "../types/types";

// Icons
import PeopleIcon from "@/assets/icons/People";
import ClockIcon from "@/assets/icons/Clock";

const PopularShiftDrawerHeader = ({
  setDrawerType,
  setIsOpen,
  drawerType,
  isOpen,
}) => {
  const types: TDrawerType[] = ["peopleDrawer", "addShiftDrawer"];

  const handleOpenDrawer = (type: TDrawerType) => {
    if (drawerType === type && isOpen) {
      setIsOpen(false);
      return;
    }
    setDrawerType(type);
    setIsOpen(true);
  };
  const getStyle = (type: TDrawerType) => {
    if (!isOpen && drawerType === type) {
      return "flex w-full justify-center";
    }
    return "hidden";
  };

  return (
    <div className="p-2 min-h-[89px] justify-center  bg-popover flex gap-5">
      {types.map((type) => (
        <button
          key={type}
          className={` cursor-pointer items-center  ${
            isOpen ? "flex" : getStyle(type)
          }`}
          onClick={() => handleOpenDrawer(type)}
        >
          {type === "peopleDrawer" ? (
            <PeopleIcon
              color={
                drawerType === type
                  ? "rgb(116, 143, 170)"
                  : "rgb(212, 226, 237)"
              }
            />
          ) : (
            <ClockIcon
              color={
                drawerType === type
                  ? "rgb(116, 143, 170)"
                  : "rgb(212, 226, 237)"
              }
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default PopularShiftDrawerHeader;
