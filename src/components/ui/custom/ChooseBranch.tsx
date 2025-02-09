import useCommonRequests from "@/hooks/useCommonRequests";
import { Input } from "../input";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "../skeleton";
import { useMemo, useState } from "react";
import { SearchInList } from "@/utils/function";
import { endOfWeek, format, startOfWeek } from "date-fns";
interface IProps {
  showHeader?: boolean;
  keyBranch?: string;
  addDate?: boolean;
}

const ChooseBranch = ({
  showHeader,
  keyBranch = "filter[branch]",
  addDate = false,
}: IProps) => {
  const { branchesSelect, isBranchesLoading } = useCommonRequests({
    getBranches: true,
  });

  const [searchValue, setSearchValue] = useState("");

  const [_, setSearchParams] = useSearchParams();

  const filterdBranches = useMemo(
    () => SearchInList(branchesSelect, searchValue),
    [searchValue, branchesSelect?.length]
  );

  return (
    <>
      {showHeader && <h1 className="mb-4 font-medium">Choose a Branch</h1>}
      <div className="text-textPrimary border-[1px] p-[16px] border-gray-400 rounded-[4px] w-[440px]">
        <Input
          placeholder="Search Branch"
          searchIcon={true}
          onChange={(e) => setSearchValue(e.target.value || "")}
        />

        {isBranchesLoading ? (
          <div className="flex flex-col gap-5 pt-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton className="h-4 w-[150px] " key={index} />
            ))}
          </div>
        ) : (
          <ul className="mt-[30px]">
            {filterdBranches?.map((e: { label: string; value: string }) => (
              <li
                className="mb-[20px] cursor-pointer"
                onClick={() => {
                  const filter = addDate && {
                    from: format(startOfWeek(new Date()), "yyyy-MM-dd"),
                    to: format(endOfWeek(new Date()), "yyyy-MM-dd"),
                  };

                  setSearchParams({ [keyBranch]: e.value, ...filter });
                }}
              >
                {e?.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ChooseBranch;
