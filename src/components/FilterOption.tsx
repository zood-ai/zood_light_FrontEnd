import useFilterQuery from "@/hooks/useFilterQuery";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
type Item = { label: string; group_by: string };

type IFilterOption = {
  label: string;
  group_by: string;
  isActive: boolean;
  onClick: () => void;
  filters: Item[];
};

const FilterOption = ({
  label,
  group_by,
  isActive,
  onClick,
  filters,
}: IFilterOption) => (
  <p
    className={`${
      group_by !== filters?.[filters?.length - 1]?.group_by
        ? "border-r-[1px]"
        : ""
    } border-gray-400 p-[0.3rem] flex items-center gap-2 cursor-pointer ${
      isActive ? "bg-popover rounded-s-[4px] " : "px-2"
    } ${
      group_by === filters?.[filters?.length - 1]?.group_by
        ? "border-r-0 rounded-r"
        : ""
    } ${group_by === filters?.[0]?.group_by ? " rounded-l" : ""}`}
    onClick={onClick}
  >
    {isActive && <Check className="h-4 w-4 text-secondary-foreground" />}
    <span>{label}</span>
  </p>
);

const FilterOptions = ({ filters }: { filters: Item[] }) => {
  const { filterObj } = useFilterQuery();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({ ...filterObj, group_by: filters?.[0]?.group_by });
  }, []);

  return (
    <div className="border border-gray-400 rounded-[4px] flex justify-between items-center text-[#7F8487] text-[14px]">
      {filters.map(({ label, group_by }) => (
        <FilterOption
          key={group_by}
          label={label}
          filters={filters}
          group_by={group_by}
          isActive={filterObj?.group_by === group_by}
          onClick={() => setSearchParams({ ...filterObj, group_by })}
        />
      ))}
    </div>
  );
};

export default FilterOptions;
