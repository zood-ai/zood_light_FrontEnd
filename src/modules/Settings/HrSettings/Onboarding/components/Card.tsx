import React from "react";
import useOnboardingHttps from "../queriesHttps/useOnboardingHttp";
import { Skeleton } from "@/components/ui/skeleton";

const Card = ({
  title,
  description,
  onClick,
  type,
  onEdit,
}: {
  title?: string;
  description: string;
  onClick?: () => void;
  type?: number;
  onEdit?: (id: string) => void; // Update the type to accept an id
}) => {
  const { OnboardingData, isLoadingOnboarding } = useOnboardingHttps({
    typeDoc: type,
  });

  return (
    <div className="border rounded-[4px] border-input p-[16px] mt-[16px] text-textPrimary">
      <p className="font-bold py-[10px] text-[16px]"> {title}</p>
      <p className="pr-[7px] pb-[16px] text-[14px] text-[#606C72]">{description}</p>
      {isLoadingOnboarding ? (
        <div className="flex gap-5 flex-col">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton className="h-4 w-[full]" key={index} />
          ))}
        </div>
      ) : (
        <>
          {OnboardingData?.data?.map((item: { id: string; name: string }, index) => (
            <React.Fragment key={index}>
              <p
                className="py-[16px] hover:text-primary hover:cursor-pointer"
                onClick={() => onEdit && onEdit(item.id)} // Pass the id to onEdit
              >
                {item.name}
              </p>
              <hr />
            </React.Fragment>
          ))}
        </>
      )}
      <p className="text-primary text-center cursor-pointer mt-5" onClick={onClick}>
        + Add document
      </p>
    </div>
  );
};

export default Card;
