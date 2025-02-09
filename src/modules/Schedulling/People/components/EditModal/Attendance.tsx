import AlertIcon from "@/assets/icons/Alert";
import InfoIcon from "@/assets/icons/Info";
import CustomDropDown from "@/components/ui/custom/CustomDropDown";
import useFilterQuery from "@/hooks/useFilterQuery";
import moment from "moment";
import usePeopleHttp from "../../queriesHttp/usePeopleHttp";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomTooltip from "@/components/ui/custom/CustomTooltip";

interface AttendanceData {
  id: number;
  date: string;
  time_from: string;
  time_to: string;
  late_mins: number;
  show_as?: string;
}

interface Attends {
  count: number;
  lates: number;
  not_show: number;
  sick: number;
  data: Record<string, AttendanceData[]>;
}

interface EmployeeAttendance {
  data: {
    attends: Attends;
  };
}

interface AttendanceProps {
  employeeAttendace: EmployeeAttendance | null;
  setAttendanceDays: (days: string) => void;
  isFetchingemployeeAttendace?: boolean;
  attendanceDays: string;
}

const Attendance: React.FC<AttendanceProps> = ({
  employeeAttendace,
  setAttendanceDays,
  isFetchingemployeeAttendace,
  attendanceDays,
}) => {
  const attend = employeeAttendace?.data?.attends;
  return (
    <>
      <div className="w-full flex justify-end">
        <CustomSelect
          options={[
            { label: "Last 30 days", value: "30" },
            { label: "Last 90 days", value: "90" },
            { label: "Last 180 days", value: "180" },
            { label: "Last 365 days", value: "365" },
          ]}
          value={attendanceDays}
          className="w-[150px]"
          onValueChange={(e) => {
            setAttendanceDays(e);
          }}
        />
      </div>

      {isFetchingemployeeAttendace ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin" size={30} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
            <div className="border border-input rounded-[4px] p-[16px] w-[200px]">
              <p className="font-bold text-[24px]">{attend?.count}</p>
              <p className="text-[14px] text-[#A2A4A6]">
                Total shifts scheduled
              </p>
            </div>

            <div className="border border-input rounded-[4px] p-[16px] w-[170px]">
              <p className="font-bold text-[24px] flex items-center">
                <CustomTooltip
                  tooltipContent={`Based on shifts with a late punch-in time`}
            
                  tooltipIcon={
                    <InfoIcon color="var(--info)" width="20px" height="20px" />
                  }
                />

                <span>{attend?.lates}</span>
              </p>
              <p className="text-[14px] text-[#A2A4A6]">Lates</p>
            </div>

            <div className="border border-input rounded-[4px] p-[16px] w-[170px]">
              <p className="font-bold text-[24px] flex items-center">
              <CustomTooltip
                  tooltipContent={`Based on shifts marked as sick by a manager`}
                  tooltipIcon={
                    <InfoIcon color="var(--warn)" width="20px" height="20px" />                  }
                />
            
                <span>{attend?.sick}</span>
              </p>
              <p className="text-[14px] text-[#A2A4A6]">Sick</p>
            </div>

            <div className="border border-input rounded-[4px] p-[16px] w-[170px]">
              <p className="font-bold text-[24px] flex items-center">
              <CustomTooltip
                  tooltipContent={`Based on scheduled shifts whithout an approved timecard`}
                  tooltipIcon={
                    <InfoIcon color="var(--warn)" width="20px" height="20px" />                  }
                />
               {" "}
                <span>{attend?.not_show}</span>
              </p>
              <p className="text-[14px] text-[#A2A4A6]">No show</p>
            </div>
          </div>

          {attend?.data ? (
            <>
              {Object.entries(attend.data || {}).map(([key, attends]: any) => (
                <div key={key} className="flex flex-col gap-4">
                  <div className="p-2 bg-popover font-bold">
                    {moment(key).format("MMMM YYYY")}
                  </div>
                  {attends.map((attend) => (
                    <div
                      key={attend.id}
                      className="grid grid-cols-2 gap-3 border-b border-border py-4"
                    >
                      <p>
                        {new Date(attend.date).toLocaleString("en-US", {
                          weekday: "short",
                        })}
                        {"   "}
                        {moment(attend.time_from, "HH:mm:ss").format(
                          "h:mm:ss A"
                        )}
                        -{" "}
                        {moment(attend.time_to, "HH:mm:ss").format("h:mm:ss A")}
                      </p>
                      <div className="flex items-center gap-3">
                        {attend.show_as === "Late" ? (
                          <div className="flex items-center gap-2">
                            <CustomTooltip
                              tooltipContent={`Punched in at 
                              ${ moment(attend?.attend?.start_time, "HH:mm:ss").format(
                                "h:mm:ss A"
                              )}
                              
                              `}
                              tooltipIcon={
                                <div className="flex items-center gap-2">
                                  <InfoIcon
                                    color="var(--info)"
                                    width="20px"
                                    height="20px"
                                  />
                                  <p>Late</p>
                                  <span className="text-xs text-gray-500">
                                    ({attend?.attend?.total_mins} min)
                                  </span>
                                </div>
                              }
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <InfoIcon
                              color="var(--warn)"
                              width="20px"
                              height="20px"
                            />
                            <p>No Show</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <div className="mt-[45px] flex flex-col justify-center items-center text-[#595959] text-[14px]">
              <p>👀</p>
              <p>
                There are no notes for this employee yet. Add a note in the box
                above.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Attendance;
