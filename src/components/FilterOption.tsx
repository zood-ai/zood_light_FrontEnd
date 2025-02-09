import AuthPermission from "@/guards/AuthPermission";
import useFilterQuery from "@/hooks/useFilterQuery";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
type Item = {
  label: string;
  group_by: string;
  premission?: string[];
  showBadge?: boolean;
  badgeValue?: number;
};

type IFilterOption = {
  isActive: boolean;
  onClick: () => void;
  filters: Item[];
  filter: Item;
};

const FilterOption = ({
  isActive,
  onClick,
  filters,
  filter,
}: IFilterOption) => (
  <p
    className={`relative ${
      filter.group_by !== filters?.[filters?.length - 1]?.group_by
        ? "border-r-[1px]"
        : ""
    } border-gray-400 p-[0.3rem] flex items-center gap-2 cursor-pointer ${
      isActive ? "bg-popover rounded-s-[4px] " : "px-2"
    } ${
      filter.group_by === filters?.[filters?.length - 1]?.group_by
        ? "border-r-0 rounded-r"
        : ""
    } ${filter.group_by === filters?.[0]?.group_by ? " rounded-l" : ""}`}
    onClick={onClick}
  >
    {isActive && <Check className="w-4 h-4 text-secondary-foreground" />}
    <span>{filter.label}</span>
    {filter?.showBadge && (
      <span className="absolute right-0 w-4 h-4 text-xs text-center text-white bg-red-500 rounded-full bottom-6">
        {filter?.badgeValue}
      </span>
    )}
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
      {filters.map((filter, index) => (
        <>
          {filters?.[index]?.premission ? (
            <AuthPermission permissionRequired={filters?.[index]?.premission}>
              <FilterOption
                key={filter.group_by}
                filters={filters}
                filter={filter}
                isActive={filterObj?.group_by === filter.group_by}
                onClick={() =>
                  setSearchParams({ ...filterObj, group_by: filter.group_by })
                }
              />
            </AuthPermission>
          ) : (
            <>
              <FilterOption
                key={filter.group_by}
                filters={filters}
                filter={filter}
                isActive={filterObj?.group_by === filter.group_by}
                onClick={() =>
                  setSearchParams({ ...filterObj, group_by: filter.group_by })
                }
              />
            </>
          )}
        </>
      ))}
    </div>
  );
};

export default FilterOptions;
