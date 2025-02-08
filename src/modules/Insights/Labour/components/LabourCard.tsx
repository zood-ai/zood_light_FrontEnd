import DecreaseIcon from "@/assets/icons/Decrease";
import IncreaseIcon from "@/assets/icons/Increase";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  showBorder?: boolean;
  className?: string;
  isLoading?: boolean;
  data?: {
    headerText: string;
    increase?: boolean;
    mainValue: string;
    profit?: string;
    text: string;
  };
}
const LabourCard = ({ showBorder, className, isLoading, data }: Props) => {
  return (
    <div className={`${className} border p-5 w-[400px] mt-3 rounded-[4px]`}>
      <div
        className={`flex justify-between ${
          showBorder ? "border-b border-b-[#F0F2F2]" : ""
        }  pb-3`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-bold text-[#1A3353] w-full">
              {isLoading ? (
                <Skeleton className="w-[120px] h-[20px] mb-2" />
              ) : (
                <div className="flex items-center gap-2">
                  <p>{data?.mainValue}</p>
                  <p className="flex items-center space-x-1 text-sm font-medium">
                    {data?.profit && (
                      <span
                        className={`p-0.5  items-center text-xs flex gap-1 ${
                          data?.increase
                            ? "text-[#8bc5bd] bg-[#d2f9f4]"
                            : "text-[#eb6793] bg-[#fff5f8]"
                        }  rounded-sm`}
                      >
                        {data?.increase ? (
                          <IncreaseIcon color="var(--success)" />
                        ) : (
                          <DecreaseIcon color={"var(--warn)"} />
                        )}
                        {data?.profit}
                      </span>
                    )}

                    <span> {data?.text}</span>
                  </p>
                </div>
              )}
            </h1>
          </div>
          <p className="flex items-center gap-2 text-textPrimary">
            {data?.headerText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LabourCard;
