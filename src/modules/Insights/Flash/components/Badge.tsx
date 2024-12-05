import IncreaseIcon from "@/assets/icons/Increase";
import useFilterQuery from "@/hooks/useFilterQuery";
import React, { useState } from "react";
import DecreaseIcon from "../../../../assets/icons/Decrease";
import LocationIcon from "@/assets/icons/Location";

type Item = {
  icon?: React.ReactNode;
  name: string;
  value: number;
};
type ItemListProps = {
  items: Item[];
};
const Badge = ({ items }: ItemListProps) => {
  const { filterObj } = useFilterQuery();
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-wrap gap-[16px] cursor-pointer">
      {items?.map(({ name, value }: Item, index: number) => (
        <div
          onClick={() => setActive(index)}
          className={`flex justify-center items-center gap-[8px] border-[1px] border-[#CBD5E1] rounded-[19.5px] p-[8px] h-[32px] ${
            active == index && filterObj?.group_by === "asc"
              ? "bg-warn-foreground border-warn text-secondary-foreground"
              : active == index && filterObj?.group_by === "desc"
              ? "bg-[#CDF7EF] border-[#CBD5E1]"
              : "text-textPrimary"
          }`}
        >
          <span>
            {index == 0 ? (
              <>
                <LocationIcon />
              </>
            ) : (
              <>
                {filterObj?.group_by === "asc" ? (
                  <DecreaseIcon
                    color={active == index ? "var(--warn)" : "#A8A8B4"}
                  />
                ) : (
                  <IncreaseIcon />
                )}
              </>
            )}
          </span>
          <span className="text-textPrimary font-[500]">{name}</span>
          <span className=" text-black font-bold text-[16px]">{value}</span>
        </div>
      ))}
    </div>
  );
};

export default Badge;
