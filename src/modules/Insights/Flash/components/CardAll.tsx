import Card from "@/components/ui/custom/Card";
import useFlashHttp from "../queriesHttp/useFlashHttp";

const FlashCard = () => {
  const { FlashsData, isFetchingFlashs } = useFlashHttp();

  const cardDetails = [
    {
      headerText: "Actual sales",
      mainValue: `SAR ${FlashsData?.total_sales}`,
      subValue: "vs forecast",
    },
    {
      headerText: "Theoretical CoGS",
      mainValue: `SAR ${FlashsData?.actual_gp?.toFixed(2)}`,
      subValue: "vs forecast",
    },
    {
      headerText: "Actual COL",
      mainValue: `SAR ${FlashsData?.labour?.toFixed(2)}`,
      subValue: "vs Planned",
    },
    {
      headerText: "Flash profit",
      mainValue: `SAR ${FlashsData?.profit?.toFixed(2)}`,
      subValue: "vs forecast",
    },
  ];

  return (
    <div className="overflow-x-auto mb-5">
      <div className="flex gap-[16px] w-max h-[120px]">
        {cardDetails.map((card, index) => (
          <Card
            key={index}
            className="w-[340px] h-[94px]"
            textColor="text-[#69777D]"
            showChart={false}
            isLoading={isFetchingFlashs}
            data={{
              totalData: {
                headerText: card.headerText,
                mainValue: card.mainValue,
                subValue: card.subValue,
              },
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashCard;
