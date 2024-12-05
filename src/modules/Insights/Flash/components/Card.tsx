import LinkIcon from "@/assets/icons/Link";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_INSIGHTS_DATE } from "@/constants/constants";
import useFilterQuery from "@/hooks/useFilterQuery";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useNavigate } from "react-router-dom";

type IDetailsCard = {
  title: string;
  cost: number | string;
  percent?: number;
  forcastCost: number;
  url: string;
};

type ICardItem = {
  branch: string;
  branch_id: string;
  total_sales: number;
  actual_gp: number;
  labour: number;
  profit: number;
};

const DetailsCard = ({
  title,
  cost,
  percent,
  forcastCost,
  url,
}: IDetailsCard) => {
  const nagivate = useNavigate();
  return (
    <>
      <div
        className="flex items-center mt-[16px]  cursor-pointer"
        onClick={() => {
          nagivate(url);
        }}
      >
        <p className="text-[#606C72] text-[14px] mr-[8px]">{title}</p>
        <LinkIcon />
      </div>

      <p className="flex justify-between items-center font-[600] text-[20px]">
        <span>SAR {cost}</span>
        {percent && <span>{percent}%</span>}
      </p>
      <div className="text-[#606C72] bg-[#EDF3F8] p-[8px] rounded-[8px] mt-[8px] text-[12px]">
        <p>Week Forecast</p>
        <p>SAR {forcastCost}</p>
      </div>

      <div className="h-[0.7px] w-[206px] bg-[#EDF3F8] mt-[24px]"></div>
    </>
  );
};

const Card = ({ items, loading }: { items: ICardItem[]; loading: boolean }) => {
  const { filterObj } = useFilterQuery();
  const success = filterObj?.["group_by"] === "desc";
  const warm = filterObj?.["group_by"] === "asc";

  return (
    <>
      {loading ? (
        <>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-[500px]  w-[238px] mt-[20px] " key={index} />
          ))}
        </>
      ) : (
        <>
          {items && items.length ? (
            <>
              {items.map((item: ICardItem, index) => (
                //   ${
                //   success
                //     ? "border-[#70DCC7] shadow-lg shadow-[#70DCC780]"
                //     : warm
                //     ? "border-warn shadow-lg shadow-[var(--warn)26]"
                //     : "border-gray-400"
                // }
                <div
                  key={index}
                  className={`border 
                    
                  
                  rounded-[16px] p-[16px] w-[238px] mt-[20px] text-[#3A4145]`}
                >
                  <p className="text-[14px]">{item.branch}</p>

                  {[
                    {
                      title: "Sales",
                      cost: item.total_sales,
                      url: `/insights/sales?${DEFAULT_INSIGHTS_DATE}&filter[branch]=${item.branch_id}`,
                    },
                    {
                      title: "CoGS",
                      cost: item.actual_gp,
                      url: `/insights/sales?${DEFAULT_INSIGHTS_DATE}&filter[branch]=${item.branch_id}`,
                    },
                    {
                      title: "Labour",
                      cost: item.labour,
                      url: `/insights/sales?${DEFAULT_INSIGHTS_DATE}&filter[branch]=${item.branch_id}`,
                    },
                    {
                      title: "Flash profit",
                      cost: item.profit,
                      url: `/insights/sales?${DEFAULT_INSIGHTS_DATE}&filter[branch]=${item.branch_id}`,
                    },
                  ].map((detail, idx) => (
                    <DetailsCard
                      key={idx}
                      title={detail?.title}
                      cost={detail?.cost}
                      url={detail.url}
                      forcastCost={0}
                    />
                  ))}
                </div>
              ))}
            </>
          ) : (
            <div className="flex  flex-col items-center justify-center mt-56 ">
              <div>👀</div>
              There’s no records to display
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Card;
