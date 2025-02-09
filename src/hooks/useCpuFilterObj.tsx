import { useLocation, useNavigate } from "react-router-dom";

const useCpuFilterObj = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const modifyFilterObj = (
    filterObj,
    branchesSelect,
    branchId,
    branchkey = "filter[branch]"
  ) => {
    // check if branch is cpu
    const isCpu = !!branchesSelect.find((branch) => branch.value == branchId)
      ?.isCpu;

    // update filter obj with cpu filter to set cpu is true in the url
    const updatedFilte = {
      ...filterObj,
      [branchkey]: branchId,
      ...(isCpu && { is_cpu: isCpu }),
    };
    if (!isCpu) {
      if (pathname.includes("central-kitchen")) {
        navigate(`/purchase/receive-order?filter[branch]=${branchId}`);
      }
      delete updatedFilte["is_cpu"];
    }

    return updatedFilte;
  };

  return modifyFilterObj;
};

export default useCpuFilterObj;
