// Components
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import CustomAlert from "@/components/ui/custom/CustomAlert";

// Hooks
import useGenetateColumns from "./hooks/useGenetateColumns";
import useProductionHttp from "./hooks/useProductionHttp";
import useFilterQuery from "@/hooks/useFilterQuery";

// Utils
import { generateTableData } from "@/utils/function";
import { addDays, format } from "date-fns";
import { useState } from "react";

const Productions = () => {
  const { filterObj } = useFilterQuery();
  const branchId = filterObj["filter[branch]"];
  const date = filterObj.date || format(addDays(new Date(), 1), "yyyy-MM-dd");

  const { ProductionData, isLoadingProduction } = useProductionHttp(branchId);
  const [isShowDropDown, setIsShowDropDown] = useState(false);

  const { isPendingUpdateStatus, updateStatus } = useProductionHttp();
  const [rowsSelectedIds, setRowsSelectedIds] = useState<string[]>([]);

  const columns = useGenetateColumns(
    ProductionData?.data,
    rowsSelectedIds,
    setRowsSelectedIds,
    setIsShowDropDown
  );
  const tableData = generateTableData(ProductionData?.data ?? {});

  const handleUpdateStatus = (option: string) => {
    const status = option === "Produce" ? 1 : 2;
    setRowsSelectedIds([]);
    updateStatus({
      cpuBranchId: branchId,
      itemData: {
        date,
        status,
        item_ids: rowsSelectedIds,
      },
    });
  };

  return (
    <div onClick={() => setIsShowDropDown(false)}>
      <HeaderPage
        title="Production"
        dropDownSelectOptions={["Produce", " Prepare for order"]}
        handleDropDownSelect={handleUpdateStatus}
        setIsShowDropDown={setIsShowDropDown}
        isShowDropDown={isShowDropDown}
        disabledDropDown={!rowsSelectedIds.length || isPendingUpdateStatus}
      />

      {date < format(new Date(), "yyyy-MM-dd") && (
        <CustomAlert
          bgColor="bg-[#FFF8F3]"
          colorIcon="var(--info)"
          className="mb-3"
          content={`Production plans in the past cannot be actioned or edited`}
        />
      )}

      <HeaderTable isCategory={true} isBranches={true} isSort={true} />

      <CustomTable
        columns={columns}
        data={tableData}
        pagination={false}
        rowStyle={(condition: boolean) =>
          condition ? "h-[32px] py-0" : "h-[55px] py-0"
        }
        conditionProp="is_main"
        customRowStyle={"border-t-[5px] h-[35px] border-white"}
        countReport
        loading={isLoadingProduction}
      />
    </div>
  );
};

export default Productions;
