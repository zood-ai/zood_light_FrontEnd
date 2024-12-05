// Hooks
import useFilterQuery from "@/hooks/useFilterQuery";
import useScheduletHttp from "./queriesHttp/ScheduleHttp";

// Components
import ChooseBranch from "@/components/ui/custom/ChooseBranch";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleTable from "./components/ScheduleTable";

const Schedule = () => {
  const { filterObj } = useFilterQuery();
  const { ScheduleData, isFetchingSchedule } = useScheduletHttp({
    fromTable: true && !!filterObj["filter[branch]"],
  });

  return !filterObj["filter[branch]"] ? (
    <ChooseBranch showHeader addDate />
  ) : (
    <>
      <ScheduleHeader isFetchingSchedule={isFetchingSchedule} />
      <ScheduleTable
        isFetchingSchedule={isFetchingSchedule}
        ScheduleData={ScheduleData}
      />
    </>
  );
};

export default Schedule;
