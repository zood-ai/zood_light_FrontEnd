import { Dispatch, SetStateAction, useState } from "react";
import { Skeleton } from "../skeleton";

type ISection = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onClick?: () => void;
  Data: any[]; // Changed from [] to any[] to allow array elements
  isLoading: boolean;
  title: string;
  description: string;
  body?: JSX.Element;
  onEdit?: (a: any) => void;
  border?: boolean;
  className?: string;
};

const CustomSection = ({
  setIsOpen,
  Data,
  isLoading,
  title,
  description,
  body,
  onClick,
  onEdit,
  border = true,
  className,
}: ISection) => {
  const [showMore, setShowMore] = useState(false);

  const displayedData = showMore ? Data : Data?.slice(0, 4);


  return (
    <div className={`${border == false ? "" : "border border-input rounded-[4px] p-[20px]"} ${className} cursor-pointer relative`}>
      <div className="flex justify-between items-center">
        <p className="font-bold text-[16px]">{title}</p>
        <p onClick={onClick}>
          <p
            className="text-[30px] text-gray"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            +
          </p>
        </p>
      </div>
      {Data?.length === 0 ? (
        <div
          className="flex justify-center items-center pt-9"
          onClick={onClick}
        >
          <p
            className="font-bold text-primary text-[16px] capitalize"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            {description}
          </p>
        </div>
      ) : (
        <>
          {isLoading ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton className="h-4 w-full mt-2" key={index} />
              ))}
            </>
          ) : (
            <>
              {body ?
                <>{body}</> :
                <>
                  {displayedData?.map((item: { name: string; type: string, id: string, icon?: string }, index) => (
                    <div
                      className="flex justify-between items-center border-b border-input px-2 py-5"
                      onClick={() => onEdit?.(item?.id)}
                    >
                      <div> {item?.icon} {item?.name}</div>
                      <div className="font-bold">{item?.type} </div>
                    </div>
                  ))}
                  {Data?.length > 4 && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className={`text-primary font-bold mt-4 absolute bottom-5 ${showMore ? "" : "p-3"} backdrop-blur-[2px] bg-white/80 w-fill-available`}
                    >
                      {showMore ? "Show Less" : "Show More"}
                    </button>
                  )}
                </>
              }
            </>

          )}
        </>
      )}
    </div>
  );
};

export default CustomSection;
