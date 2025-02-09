import FilterOptions from "@/components/FilterOption";
import Avatar from "@/components/ui/avatar";
import useFilterQuery from "@/hooks/useFilterQuery";
import React from "react";

const DetailsTimeCard = ({ timeCardOne }: any) => {
  const { filterObj } = useFilterQuery();
  return (
    <>
      <div className="flex justify-end gap-2">
        <FilterOptions
          filters={[
            { label: "Time card", group_by: "time_card" },
            { label: "All shift changes", group_by: "shift_changes" },
          ]}
        />
      </div>

      {filterObj?.group_by == "time_card" ? (
        <>
          {timeCardOne?.histories?.length == 0 ? (
            <div className="flex items-center justify-center mt-9">
              <div>👀</div>
              There’s no records to display
            </div>
          ) : (
            <>
              {timeCardOne?.histories?.map((history) => (
                <>
                  <div className="flex items-center gap-2 mt-5">
                    <Avatar text="  Saad Achwa" bg="secondary" />
                    <div className="text-sm flex justify-between w-full items-center">
                      <p> {history?.user}</p>
                      <p className="text-[12px] text-gray-300">
                        {history?.created_at}
                      </p>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 pt-5 py-2 mx-2 text-[14px] font-bold capitalize">
                    {history?.name}
                  </div>
                </>
              ))}
            </>
          )}
        </>
      ) : (
        <>
          {timeCardOne?.shift_histories?.length == 0 ? (
            <div className="flex items-center justify-center mt-9">
              <div>👀</div>
              There’s no records to display
            </div>
          ) : (
            <>
              {timeCardOne?.shift_histories?.map((history) => (
                <>
                  <div className="flex items-center gap-2 mt-5">
                    <Avatar text="  Saad Achwa" bg="secondary" />
                    <div className="text-sm flex justify-between w-full items-center">
                      <p> {history?.user}</p>
                      <p className="text-[12px] text-gray-300">
                        {history?.created_at}
                      </p>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 pt-5 py-2 mx-2 text-[14px] font-bold capitalize">
                    {history?.name}
                  </div>
                </>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
};

export default DetailsTimeCard;
