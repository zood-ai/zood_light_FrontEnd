import RequestIcon from "@/assets/icons/Request";
import { Badge } from "@/components/ui/badge";
import useTransferHttp from "../queriesHttp/useTransferHttp";
import {
  handleStatus,
  handleStatusAll,
  handleTypeColor,
} from "../helpers/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import SendIcon from "@/assets/icons/Send";
import useFilterQuery from "@/hooks/useFilterQuery";
import { Dispatch, SetStateAction } from "react";
import { FilterObj, TransferData } from "../types/types";

interface ContantTransferProps {
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  setId: Dispatch<SetStateAction<string>>;
}
const ContantTransfer = ({ setIsEdit, setId }: ContantTransferProps) => {
  const { TransferSelect, isFetching } = useTransferHttp({});
  const { filterObj } = useFilterQuery();

  const getBadgeVariant = (filterObj: FilterObj, e: TransferData) => {
    const { branch_id } = filterObj || {};
    const { branch, warehouse, status, type } = e || {};

    if (branch_id == branch?.id || branch_id == warehouse?.id) {
      switch (status) {
        case 1:
          return "info";
        case 2:
          return branch_id == warehouse?.id ? "success" : "info";
        case 4:
          return type == 1 || type == 4 ? "success" : "default";
        case 5:
        case 6:
          if (type == 4 || type == 1) {
            return "danger";
          }
          break;
        default:
          return "default";
      }
    }
    return "default";
  };

  const getBadgeLabel = (filterObj: FilterObj, e: TransferData) => {
    const { branch_id } = filterObj || {};
    const { branch, warehouse, status, type } = e || {};

    if (branch_id == branch?.id || branch_id == warehouse?.id) {
      if (status == 1) return "Requested";
      if (status == 2) return branch_id == branch?.id ? "Incoming" : "Sent";
      if (status == 4 && type == 1)
        return branch_id == branch?.id ? "Received" : "Sent";
      if (status == 4 && type == 4)
        return branch_id == branch?.id ? "Received" : "Sent";
      if ((status == 5 || status == 6) && type == 4)
        return branch_id == branch?.id ? "Rejected Request" : "Rejected";
      if (status == 5 && type == 1) return "Rejected";
    }
    return "";
  };

  return (
    <>
      {isFetching ? (
        <div className="flex gap-5 flex-col mt-2 ">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton className="h-4 w-full mt-2" key={index} />
          ))}
        </div>
      ) : (
        <>
          {TransferSelect?.data?.length ? (
            <>
              {TransferSelect?.data?.map((e: TransferData) => (
                <div
                  key={e.id}
                  className="border-b  flex justify-between items-center cursor-pointer"
                  onClick={() => {
                    setIsEdit(true);
                    setId(e?.id);
                  }}
                >
                  <div className="my-[24px] flex items-center text-textPrimary gap-[4px] ">
                    {filterObj["filter[branch]"] == e?.warehouse?.id ? (
                      <div className="p-2 bg-[#FFFAF5] rounded-full w-max">
                        <SendIcon />
                      </div>
                    ) : (
                      <div className="p-2 bg-muted rounded-full w-max">
                        <RequestIcon />
                      </div>
                    )}

                    <div>
                      <p className="font-bold">
                        {!filterObj["filter[branch]"] && (
                          <>To {e?.branch?.name} </>
                        )}
                        {filterObj["filter[branch]"] == e?.branch?.id &&
                          e?.type == 4 &&
                          ` From ${e?.warehouse?.name} `}

                        {filterObj["filter[branch]"] == e?.warehouse?.id &&
                          e?.type == 4 &&
                          ` To ${e?.branch?.name} `}

                        {filterObj["filter[branch]"] == e?.warehouse?.id &&
                          e?.type == 1 &&
                          ` To ${e?.branch?.name} `}

                        {filterObj["filter[branch]"] == e?.branch?.id &&
                          e?.type == 1 &&
                          ` From ${e?.warehouse?.name} `}
                      </p>
                      <p className="text-[12px]">
                        {moment(e?.delivery_date).format("LL")} •{" "}
                        {handleStatus(e?.status)}
                      </p>
                    </div>
                  </div>
                  <div>
                    {filterObj["filter[branch]"]?.length ? (
                      <Badge
                        variant={
                          filterObj["filter[branch]"] == e?.branch?.id &&
                          e.status == 1
                            ? "info"
                            : filterObj["filter[branch]"] == e?.warehouse?.id &&
                              e.status == 1
                            ? "info"
                            : filterObj["filter[branch]"] == e?.warehouse?.id &&
                              e.status == 2
                            ? "success"
                            : filterObj["filter[branch]"] == e?.branch?.id &&
                              e.status == 2
                            ? "info"
                            : filterObj["filter[branch]"] == e?.branch?.id &&
                              e.status == 4 &&
                              e.type == 1
                            ? "success"
                            : filterObj["filter[branch]"] == e?.warehouse?.id &&
                              e.status == 4 &&
                              e.type == 1
                            ? "success"
                            : filterObj["filter[branch]"] == e?.branch?.id &&
                              e.status == 5 &&
                              e.type == 4
                            ? "danger"
                            : filterObj["filter[branch]"] == e?.warehouse?.id &&
                              e.status == 5 &&
                              e.type == 4
                            ? "danger"
                            : filterObj["filter[branch]"] == e?.branch?.id &&
                              e.status == 6 &&
                              e.type == 4
                            ? "danger"
                            : filterObj["filter[branch]"] == e?.warehouse?.id &&
                              e.status == 6 &&
                              e.type == 4
                            ? "danger"
                            : filterObj["filter[branch]"] == e?.branch?.id &&
                              e.status == 5 &&
                              e.type == 1
                            ? "danger"
                            : filterObj["filter[branch]"] == e?.warehouse?.id &&
                              e.status == 5 &&
                              e.type == 1
                            ? "danger"
                            : filterObj["filter[branch]"] == e?.branch?.id &&
                              e.status == 4 &&
                              e.type == 4
                            ? "success"
                            : filterObj["filter[branch]"] == e?.warehouse?.id &&
                              e.status == 4 &&
                              e.type == 4
                            ? "success"
                            : "default"
                        }
                      >
                        {filterObj["filter[branch]"] == e?.warehouse?.id &&
                          e.status == 1 &&
                          `Requested`}
                        {filterObj["filter[branch]"] == e?.branch?.id &&
                          e.status == 1 &&
                          "Requested"}
                        {filterObj["filter[branch]"] == e?.warehouse?.id &&
                          e.status == 2 &&
                          `Sent`}
                        {filterObj["filter[branch]"] == e?.branch?.id &&
                          e.status == 2 &&
                          "Incoming"}
                        {filterObj["filter[branch]"] == e?.branch?.id &&
                          e.status == 5 &&
                          e.type == 4 &&
                          " Rejected "}
                        {filterObj["filter[branch]"] == e?.warehouse?.id &&
                          e.status == 5 &&
                          e.type == 4 &&
                          `Rejected `}
                        {filterObj["filter[branch]"] == e?.branch?.id &&
                          e.status == 5 &&
                          e.type == 1 &&
                          " Rejected "}
                        {filterObj["filter[branch]"] == e?.warehouse?.id &&
                          e.status == 5 &&
                          e.type == 1 &&
                          `Rejected `}
                        {filterObj["filter[branch]"] == e?.warehouse?.id &&
                          e.status == 6 &&
                          e.type == 4 &&
                          `Rejected `}
                        {filterObj["filter[branch]"] == e?.branch?.id &&
                          e.status == 6 &&
                          e.type == 4 &&
                          `Rejected Request`}
                        {filterObj["filter[branch]"] == e?.branch?.id &&
                          e.status == 4 &&
                          e.type == 1 &&
                          "Received"}
                        {filterObj["filter[branch]"] == e?.warehouse?.id &&
                          e.status == 4 &&
                          e.type == 1 &&
                          "Sent"}
                        {filterObj["filter[branch]"] == e?.branch?.id &&
                          e.status == 4 &&
                          e.type == 4 &&
                          "Received"}
                        {filterObj["filter[branch]"] == e?.warehouse?.id &&
                          e.status == 4 &&
                          e.type == 4 &&
                          "Sent"}
                      </Badge>
                    ) : (
                      // <Badge variant={getBadgeVariant(filterObj, e)}>
                      //   {getBadgeLabel(filterObj, e)}
                      // </Badge>
                      <Badge variant={handleTypeColor(e.status)}>
                        {handleStatusAll(e.status)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-start justify-center mt-24">
              <div>👀</div>
              There’s no records to display
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ContantTransfer;
