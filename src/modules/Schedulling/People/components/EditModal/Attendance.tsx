import AlertIcon from "@/assets/icons/Alert";
import InfoIcon from "@/assets/icons/Info";
import moment from "moment";

interface AttendanceData {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  late_mins: number;
}

interface Attends {
  total_mins: number;
  lates: number;
  data: Record<string, AttendanceData[]>;
}

interface EmployeeAttendance {
  data: {
    attends: Attends;
  };
}

interface AttendanceProps {
  employeeAttendace: EmployeeAttendance | null;
}

const Attendance: React.FC<AttendanceProps> = ({ employeeAttendace }) => {
  const attend = employeeAttendace?.data?.attends;

  return (
    <>
      <div className="flex items-center gap-3 mt-[30px] mb-[13px]">
        <div className="border border-input rounded-[4px] p-[16px] w-[200px]">
          <p className="font-bold text-[24px]">{attend?.total_mins}</p>
          <p className="text-[14px] text-[#A2A4A6]">Total shifts scheduled</p>
        </div>

        <div className="border border-input rounded-[4px] p-[16px] w-[170px]">
          <p className="font-bold text-[24px] flex items-center">
            <InfoIcon color="var(--info)" width="20px" height="20px" />
            <span>{attend?.lates}</span>
          </p>
          <p className="text-[14px] text-[#A2A4A6]">Lates</p>
        </div>

        <div className="border border-input rounded-[4px] p-[16px] w-[170px]">
          <p className="font-bold text-[24px] flex items-center">
            <InfoIcon color="var(--warn)" width="20px" height="20px" />
            <span>0</span>
          </p>
          <p className="text-[14px] text-[#A2A4A6]">Sick</p>
        </div>

        <div className="border border-input rounded-[4px] p-[16px] w-[170px]">
          <p className="font-bold text-[24px] flex items-center">
            <InfoIcon color="var(--warn)" width="20px" height="20px" />
            <span>0</span>
          </p>
          <p className="text-[14px] text-[#A2A4A6]">No show</p>
        </div>
      </div>

      {attend ? (
        <>
          {Object.entries(attend.data || {}).map(([key, attends]) => (
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
                    })}{"   "}

                    {moment(attend.start_time, "HH:mm:ss").format("h:mm:ss A")}
                    -  {moment(attend.end_time, "HH:mm:ss").format("h:mm:ss A")}
                  </p>
                  <div className="flex items-center gap-3">
                    {attend.late_mins === 0 ? (
                      <div className="flex items-center gap-2">
                        <InfoIcon color="var(--warn)" width="20px" height="20px" />
                        <p>No Show</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <InfoIcon color="var(--info)" width="20px" height="20px" />
                        <p>Late</p>
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
          <p>There are no notes for this employee yet. Add a note in the box above.</p>
        </div>
      )}
    </>
  );
};

export default Attendance;
