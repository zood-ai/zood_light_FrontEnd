// Hooks
import useFilterQuery from "@/hooks/useFilterQuery";
import useScheduletHttp from "./queriesHttp/ScheduleHttp";

// Components
import ChooseBranch from "@/components/ui/custom/ChooseBranch";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleTable from "./components/ScheduleTable";

// Constants
import { TABLE_STATUS } from "./constants/constants";
import { useState } from "react";

const Schedule = () => {
  const { filterObj } = useFilterQuery();

  const [showAvaliability, setShowAvaliability] = useState(false);
  const [sortEmployees, setSortEmployees] = useState(false);
  const {
    ScheduleData,
    isFetchingSchedule,
    clearSchedule,
    isClearSchedule,
    copySchedule,
    isCopySchedule,
    showHideEmployees,
    isShowHideEmployees,
  } = useScheduletHttp({
    fromTable: !!filterObj["filter[branch]"],
  });

  return !filterObj["filter[branch]"] ? (
    <ChooseBranch showHeader addDate />
  ) : (
    <>
      <ScheduleHeader
        clearSchedule={clearSchedule}
        copySchedule={copySchedule}
        isClearSchedule={isClearSchedule}
        isFetchingSchedule={isFetchingSchedule}
        tableStatus={TABLE_STATUS[ScheduleData?.table?.status] ?? "Draft"}
        setShowAvaliability={setShowAvaliability}
        showAvaliability={showAvaliability}
        sortEmployees={sortEmployees}
        setSortEmployees={setSortEmployees}
        showHideEmployees={showHideEmployees}
      />
      <ScheduleTable
        isFetchingSchedule={
          isFetchingSchedule ||
          isClearSchedule ||
          isCopySchedule ||
          isShowHideEmployees
        }
        ScheduleData={ScheduleData}
        showAvaliability={showAvaliability}
        sortEmployees={sortEmployees}
      />
    </>
  );
};

export default Schedule;
