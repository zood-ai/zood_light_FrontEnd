import Card from "@/components/ui/custom/Card";
import useInventoryInsightHttp from "../queriesHttp/useInventoryHttp";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const InventoryCards = () => {
  const { InventoryInsightsData, isFetchingInventoryInsight } =
    useInventoryInsightHttp();

  const {
    actual_gp = {},
    target_gp = {},
    total_sales = {},
    variance = {},
    waste = {},
    unassigned_sales,
  } = InventoryInsightsData?.data || {};

  const cardsData = [
    {
      headerText: "Total Sales",
      mainValue: `SAR ${InventoryInsightsData?.total_sales}`,
      details: [
        {
          title: "Food.",
          total: `${total_sales?.Food?.total_sales_percentage || 0}%`,
        },
        {
          title: "Beverage.",
          total: `${total_sales?.Beverage?.total_sales_percentage || 0}%`,
        },
        {
          title: "Misc.",
          total: `${total_sales?.Misc?.total_sales_percentage || 0}%`,
        },
      ],
    },
    {
      headerText: "Target GP",
      mainValue: `SAR ${InventoryInsightsData?.target_gp}`,
      details: [
        {
          title: "Food.",
          total: `${target_gp?.Food?.total_sales_percentage || 0}%`,
        },
        {
          title: "Beverage.",
          total: `${target_gp?.Beverage?.total_sales_percentage || 0}%`,
        },
        {
          title: "Misc.",
          total: `${target_gp?.Misc?.total_sales_percentage || 0}%`,
        },
      ],
    },
    {
      headerText: "Actual GP",
      mainValue: `SAR ${InventoryInsightsData?.actual_gp}`,
      details: [
        {
          title: "Food.",
          total: `${actual_gp?.Food?.total_sales_percentage || 0}%`,
        },
        {
          title: "Beverage.",
          total: `${actual_gp?.Beverage?.total_sales_percentage || 0}%`,
        },
        {
          title: "Misc.",
          total: `${actual_gp?.Misc?.total_sales_percentage || 0}%`,
        },
      ],
    },
    {
      headerText: "Variance",
      mainValue: `SAR ${InventoryInsightsData?.variance}`,
      details: [
        {
          title: "Waste",
          total: `${variance?.waste?.total_sales_percentage || 0}%`,
          subTotal: `SAR ${variance?.waste?.total_sales?.toFixed(3) || 0}`,
        },
        {
          title: "Surplus.",
          total: `${variance?.SerPlus?.total_sales_percentage || 0}%`,
          subTotal: `SAR ${variance?.SerPlus?.total_sales?.toFixed(3) || 0}`,
        },
      ],
    },
    {
      headerText: "Waste",
      mainValue: `SAR ${variance?.waste?.total_sales || 0}`,
      details: [
        {
          title: "Accounted.",
          total: `${waste?.accounted?.total_sales_percentage || 0}%`,
          subTotal: `SAR ${waste?.accounted?.total_sales?.toFixed(3) || 0}`,
        },
        {
          title: "Unaccounted.",
          total: `${waste?.unaccounted?.total_sales_percentage || 0}%`,
          subTotal: `SAR ${waste?.unaccounted?.total_sales?.toFixed(3) || 0}`,
        },
      ],
    },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[16px] w-max">
        {cardsData.map((card, index) =>
          index == 0 && InventoryInsightsData?.unassigned_sales !== 0 ? (
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <div>
                  <Card
                    key={index}
                    isLoading={isFetchingInventoryInsight}
                    className={`w-[340px]${
                      isFetchingInventoryInsight ? "" : "border border-warn"
                    } `}
                    textColor="text-[#69777D]"
                    showChart={false}
                    showBorder={true}
                    data={{
                      totalData: {
                        headerText: card.headerText,
                        mainValue: card.mainValue,
                        subValue: "",
                      },
                      details: card.details,
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-[#4e667e] text-white text-xs z-[100] w-48"
              >
                Dot calculates your GP % based on POS sales assigned to recipes.
                SAR {InventoryInsightsData?.unassigned_sales} in sales still
                need to be assigned
              </TooltipContent>
            </Tooltip>
          ) : (
            <Card
              key={index}
              isLoading={isFetchingInventoryInsight}
              className={`w-[340px] `}
              textColor="text-[#69777D]"
              showChart={false}
              showBorder={true}
              data={{
                totalData: {
                  headerText: card.headerText,
                  mainValue: card.mainValue,
                  subValue: "",
                },
                details: card.details,
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default InventoryCards;
