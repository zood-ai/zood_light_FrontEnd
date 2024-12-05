// Icons
import ArrowDownIcon from "@/assets/icons/ArrowDown";
import ChartIcon from "@/assets/icons/Chart";
import TemplateIcon from "@/assets/icons/Template";
import UserProfileIcon from "@/assets/icons/UserProfile";

// Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import useScheduletHttp from "../queriesHttp/ScheduleHttp";
import useFilterQuery from "@/hooks/useFilterQuery";

const ScheduleHeader = ({ isFetchingSchedule }) => {
  const { filterObj } = useFilterQuery();
  const { updateScheduleStatus, isUpdateScheduleStatus } = useScheduletHttp({});
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex gap-5">
        <h2 className="text-xl font-semibold">Schedule</h2>
        <div className="flex items-center gap-2 font-medium text-gray-500 text-ms">
          <TemplateIcon />
          Templates
        </div>
        <div className="flex items-center gap-2 font-medium text-gray-500 text-ms ">
          <ChartIcon />
          {isFetchingSchedule ? (
            <Skeleton className="h-[15px] w-[60px]" />
          ) : (
            "  SAR 27,692"
          )}
        </div>
        <div className="flex items-center gap-2 font-medium text-gray-500 text-ms ">
          <UserProfileIcon />
          {isFetchingSchedule ? (
            <Skeleton className="h-[15px] w-[60px]" />
          ) : (
            " 20% SAR 5,538"
          )}
        </div>
      </div>
      <div className="flex items-center gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={isUpdateScheduleStatus}
              variant="outline"
              className="relative flex items-center gap-2"
            >
              Draft <ArrowDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-black bg-white ">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  updateScheduleStatus({
                    branch_id: filterObj["filter[branch]"],
                    from: filterObj.from,
                    to: filterObj.to,
                    status: 3,
                  });
                }}
              >
                <span>Submit for Approval</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  updateScheduleStatus({
                    branch_id: filterObj["filter[branch]"],
                    from: filterObj.from,
                    to: filterObj.to,
                    status: 2,
                  });
                }}
              >
                <span>Publish</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ScheduleHeader;
