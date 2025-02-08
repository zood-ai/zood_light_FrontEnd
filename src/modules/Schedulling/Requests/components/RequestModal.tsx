import useFilterQuery from "@/hooks/useFilterQuery";
import RequestDetailsApprovals from "./RequestDetailsApprovals";
import RequestDetailsTimeOff from "./RequestDetailsTimeOff";
import RequestDetailsShiftChanges from "./RequestDetailsShiftChanges";
import { IRequestsList } from "../types/types";

const RequestModal = ({ rowData }: { rowData?: IRequestsList }) => {
  const { filterObj } = useFilterQuery();

  const renderModal = () => {
    switch (filterObj?.group_by) {
      case "4":
        return <RequestDetailsApprovals rowData={rowData} />;
      case "2":
        return <RequestDetailsTimeOff rowData={rowData} />;
      case "3":
        return <RequestDetailsShiftChanges rowData={rowData} />;
      default:
        return <RequestDetailsApprovals rowData={rowData} />;
    }
  };
  return <>{renderModal()}</>;
};

export default RequestModal;
