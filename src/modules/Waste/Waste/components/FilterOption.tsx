import useFilterQuery from "@/hooks/useFilterQuery";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
type IFilterOption = {
  label: string;
  group_by: string;
  isActive: boolean;
  onClick: () => void;
};

const FilterOption = ({
  label,
  group_by,
  isActive,
  onClick,
}: IFilterOption) => (
  <p
    className={`border-r-[1px] border-gray-400 p-[0.3rem] flex items-center gap-2 cursor-pointer ${
      isActive ? "bg-popover " : ""
    } ${group_by === "items" ? "border-r-0 rounded-r" : ""} ${
      group_by === "day" ? " rounded-l" : ""
    }`}
    onClick={onClick}
  >
    {isActive && <Check className="h-4 w-4 text-secondary-foreground" />}
    <span>{label}</span>
  </p>
);

const FilterOptions = () => {
  const { filterObj } = useFilterQuery();
  const [, setSearchParams] = useSearchParams();

  const filters = [
    { label: "Day", group_by: "business_date" },
    { label: "Reason", group_by: "reason.name" },
    { label: "Person", group_by: "poster.name" },
    { label: "Items", group_by: "wastable.name" },
  ];
  useEffect(() => {
    setSearchParams({ ...filterObj, group_by: "business_date" });
  }, []);

  return (
    <div className="border border-gray-400 rounded-[4px] flex justify-between items-center text-[#7F8487] text-[14px]">
      {filters.map(({ label, group_by }) => (
        <FilterOption
          key={group_by}
          label={label}
          group_by={group_by}
          isActive={filterObj?.group_by === group_by}
          onClick={() => setSearchParams({ ...filterObj, group_by })}
        />
      ))}
    </div>
  );
};

export default FilterOptions;
