import PlusIcon from "@/assets/icons/Plus";
import useFilterQuery from "@/hooks/useFilterQuery";

const UnAvaliabileShift = ({
  employeeShiftLength,
  isAddingShift,
  setIsCreateShiftDrawerOpen,
  employeeId,
  positionId,
  departmentId,
  date,
  resetForm,
}) => {
  const { filterObj } = useFilterQuery();
  return (
    <button
      className={`flex relative group  ${
        employeeShiftLength ? "mt-2" : ""
      } items-center  w-full bg-gray-100 rounded-sm h-[50px] `}
    >
      <div className="flex items-center justify-center w-full">
        <span className="">Unavailable ⏰</span>
      </div>
      <div className="absolute z-50 -translate-x-1/2 left-1/2  hidden gap-2 -bottom-[8px]  group-hover:flex">
        <button disabled={isAddingShift}>
          <PlusIcon
            className="w-3 h-3 "
            onClick={(e) => {
              e.stopPropagation();
              setIsCreateShiftDrawerOpen(true);
              const values = {
                employee_id: employeeId ?? null,
                position_id: positionId,
                department_id: departmentId,
                date,
                branch_id: filterObj["filter[branch]"],
              };

              resetForm(values);
            }}
          />
        </button>
      </div>
    </button>
  );
};

export default UnAvaliabileShift;
