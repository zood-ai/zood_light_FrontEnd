import Cookies from "js-cookie";
import { useFormContext } from "react-hook-form";

const History = ({ historyData }: { historyData?: any }) => {
  const {watch} = useFormContext();
  return (
    <>
      <p className="font-bold  text-[18px] mb-[16px]">Employee history</p>

      <div>
        {historyData?.history?.map((item: any) => (
          <div className="flex items-center gap-5 mb-9">
            {item?.type == 1 ? (
              <div className="bg-[#F0F5F9] p-5 rounded-full"> </div>
            ) : item?.type == 2 ? (
              <div className="bg-[#F0F5F9] p-2 rounded-full">🕒</div>
            ) : [3, 5].includes(item?.type) ? (
              <div className="bg-[#F0F5F9] p-2 rounded-full">🏝️</div>
            ) : item?.type == 4 ? (
              <div className="bg-[#F0F5F9] p-2 rounded-full">🏠</div>
            ) : item?.type == 6 ? (
              <div className="bg-[#F0F5F9] p-2 rounded-full">✉️</div>
            ) : item?.type == 7 ? (
              <div className="bg-[#F0F5F9] p-2 rounded-full">📞</div>
            ) : item?.type == 8 ? (
              <div className="bg-[#F0F5F9] p-2 rounded-full">📍</div>
            ) : item?.type == 9 ? (
              <div className="bg-[#F0F5F9] p-2 rounded-full">💼</div>
            ) : item?.type == 10 ? (
              <div className="bg-[#F0F5F9] p-2 rounded-full">🔑</div>
            ) : item?.type == 12 ? (
              <div className="bg-[#F0F5F9] p-2 rounded-full">🧷</div>
            ) : (
              <div className="bg-[#F0F5F9] p-2 rounded-full">⌛ </div>
            )}
            {item?.type == 1 ? (
              <div className=" items-center gap-1">
                <span className="font-bold text-black">
                  {watch("first_name")} {watch("last_name")} {" "}
                </span>
                started employment as{" "}
                <span className="font-bold text-black">{item?.from}</span>
                <div>
                  on <span className="font-bold "> {item?.created_at}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 ">
                <div className="text-[#777777]">
                  {item?.name} change from{" "} 
                  <span className="font-bold text-black">
                    {item?.from == null ? ",,,," : item?.from}
                  </span>{" "}
                  to <span className="font-bold text-black">{item?.to}</span>
                </div>
                <div className="text-[#9A9FA6]">
                  {item?.user} on{" "}
                  <span className="font-bold"> {item?.created_at}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default History;
