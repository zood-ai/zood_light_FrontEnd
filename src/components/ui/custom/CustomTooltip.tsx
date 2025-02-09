import TooltipIcon from "@/assets/icons/Tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

const CustomTooltip = ({
  tooltipContent,
  tooltipIcon = <TooltipIcon />,
}: {
  tooltipContent: string;
  tooltipIcon?: React.ReactNode;
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger>{tooltipIcon}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-[#4e667e] text-white text-xs z-[100] p-2 w-auto mt-2 rounded-md "
        >
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
