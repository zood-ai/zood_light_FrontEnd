import { Input } from "@/components/ui/input";
import { useState } from "react";
import useFilterQuery from "@/hooks/useFilterQuery";
import { addDays, format } from "date-fns";
import { getTextColor } from "@/utils/function";

const SingleInput = ({ row, branch, updateproduction, setItemId }) => {
  const { filterObj } = useFilterQuery();
  const [neededValue, setNeededValue] = useState(
    row.original.branches.find((b) => b.id === branch.id)?.need
  );

  const cpuBranchId = row.original.branches.find((b) => b.is_cpu)?.id;
  const date = filterObj.date || format(addDays(new Date(), 1), "yyyy-MM-dd");
  const branchData = row.original.branches.find((b) => b.id === branch.id);

  return (
    <div className="flex items-center gap-5">
      <span>
        <span
          className={`
            ${getTextColor(row.original.status, row.original.total)}`}
        >
          {row.original.branches.find((b) => b.id === branch.id)?.has}{" "}
        </span>
        {branchData.is_cpu && row.original?.unit}
      </span>
      {!branch?.is_cpu && (
        <Input
          value={neededValue || ""}
          readOnly={
            row.original.status || date < format(new Date(), "yyyy-MM-dd")
          }
          className="w-[60px] text-center"
          onChange={(e) => {
            if (+e.target.value < 0) return;
            setNeededValue(+e.target.value);
          }}
          onBlur={() => {
            if (
              row.original.status ||
              date < format(new Date(), "yyyy-MM-dd") ||
              neededValue ===
                row.original.branches.find((b) => b.id === branch.id)?.need
            )
              return;

            setItemId(branchData.item_id);
            updateproduction({
              cpuBranchId: cpuBranchId,
              itemData: {
                quantity: neededValue,
                has: branchData.has,
                date,
                branch_id: branchData.id,
                item_id: branchData.item_id,
              },
            });
          }}
        />
      )}
    </div>
  );
};

export default SingleInput;
