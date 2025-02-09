import CloseIcon from "@/assets/icons/Close";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import Cookies from "js-cookie";
import { useState } from "react";
import useMyScheduleHttps from "./queriesHttps/useMyScheduleHttp";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";

interface ShiftType {
  type: string;
  icon: string;
}

interface Position {
  name: string;
}

interface Attendance {
  shift_type: ShiftType;
  position?: Position;
  time_from: string;
  time_to: string;
}

interface MyScheduleData {
  [date: string]: Attendance[];
}

const MySchedule = () => {
  const [show, setShow] = useState(false);

  const { myScheduleData, isLoadingMyScheduleData }: {
    myScheduleData?: { data: MyScheduleData };
    isLoadingMyScheduleData: boolean;
  } = useMyScheduleHttps({
    userId: Cookies.get("id"),
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">{Cookies.get("name")}</h1>
        <CustomDatePicker showType={false} />
      </div>
      {!show && (
        <div className="bg-primary w-full p-4 rounded-sm mt-5">
          <div className="flex items-center p-3">
            <img src="../../src/assets/phone.png" alt="schedule" />
            <p className="text-sm text-white font-medium p-3">
              Keep track of your schedule, hours and holidays with the Dot
              mobile app. Download now!
            </p>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-5 mx-6 mt-3">
              <img src="../../src/assets/apple.png" className="h-8" />
              <img src="../../src/assets/play.png" className="h-8" />
            </div>
            <CloseIcon
              color="white"
              onClick={() => setShow(true)}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="mt-5  border border-gray-400 p-5 rounded-sm">
        {isLoadingMyScheduleData ? (
          <>
            <div className="flex gap-5 mt-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton className="h-14 w-full  mt-2  -z-50" key={index} />
              ))}
            </div>
            <div className="flex gap-5 mt-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton className="h-14 w-full  mt-2  -z-50" key={index} />
              ))}
            </div>
          </>
        ) : (
          <>
            {myScheduleData?.data ? (
              <>
                <div className="grid grid-cols-7 gap-5 justify-center items-center">
                  {Object.entries(myScheduleData?.data).map(([key]) => (
                    <div key={key} className="text-center">
                      <p className="text-lg font-bold">
                        {moment(key).format("ddd")}
                      </p>
                      <p className="text-sm text-gray-300">
                        {moment(key).format("DD MMM ")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-5 justify-center items-start mt-5">
                  {Object.entries(myScheduleData.data).map(([key, attends]) => (
                    <div key={key}>
                      {attends?.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {attends.map((attend, index) => (
                            <div key={index}>
                             
                                <div
                                  className={`class="false bg-[repeating-linear-gradient(135deg,_#e7e1f480_0px,_#e7e1f480_4px,_#ded7fe80_4px,_#ded7fe80_8px)] flex relative group  items-center  w-full null  rounded-sm h-[60px] false  
                                   }`}
                                >
                                  <div className="flex items-center justify-between w-full">

                                    <div className="flex flex-col items-start gap-1 pl-2">
                                      <div className="flex flex-col  justify-between w-full">
                                        <div className="flex items-center justify-between w-full">

                                        <span className="text-gray-300">{attend?.position?.name}</span>
                                        <span >{attend?.shift_type?.icon}</span>
                                        </div>
                                        <span className="flex items-center gap-1 font-medium "> {moment(attend?.time_from, "HH:mm:ss").format("h:mm A")} - {moment(attend?.time_to, "HH:mm:ss").format("h:mm A")} </span>
                                        </div>
                                      </div>
                                
                                 
                                  
                                  
                                  </div>
                                </div>
                            
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex relative group  items-center  w-full bg-gray-100 rounded-sm h-[60px] 3">
                         <div className="flex items-center justify-center w-full">
                          <span>Unavailable ⏰</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default MySchedule;
