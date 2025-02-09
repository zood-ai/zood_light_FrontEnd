import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const useFilterQuery = () => {
  const [searchParams] = useSearchParams();
  const filterObj = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );
  return { filterObj };
};
export default useFilterQuery;
