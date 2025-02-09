import { format } from "date-fns";
import { IRequestsList } from "../types/types";
import useRequeststHttp from "../queriesHttp/RequestsHttp";
import DaliyBreakDown from "./DaliyBreakDown";
import { useFormContext } from "react-hook-form";
import CustomAlert from "@/components/ui/custom/CustomAlert";

const RequestDetailsTimeOff = ({ rowData }: { rowData?: IRequestsList }) => {
  const { HolidayBalanceData, getOverlaps } = useRequeststHttp({
    employeeId: rowData?.employee.id,
    branchId: rowData?.branch.id,
    requestid: (rowData?.id as string) ?? "",
  });

  const isPaid = rowData?.type == "2" && rowData?.details?.type;

  const { getValues } = useFormContext();

  const approveRejectUser = rowData?.approved_by?.length
    ? rowData?.approved_by[0]?.first_name ??
      " " + " " + rowData?.approved_by[0]?.last_name
    : rowData?.rejected_by?.length
    ? rowData?.rejected_by[0]?.first_name ??
      "" + " " + rowData?.rejected_by[0]?.last_name
    : "Unknown";

  const TotalBalance = HolidayBalanceData?.current_balance;

  return (
    <div>
      {rowData?.status == "1" && TotalBalance <= 0 && isPaid && (
        <CustomAlert
          bgColor="bg-[#FFF8F3]"
          className="mb-5"
          colorIcon="var(--info)"
          content={`${rowData?.employee?.first_name} doesn't have enough available leave for this request. If approved they'll be in negative balance.`}
        />
      )}
      {/* details */}
      <div className="pb-10 mb-10 border-b">
        <h3 className="mb-2 text-[17px] font-semibold text-gray-500">
          Details
        </h3>
        <div className="p-4 space-y-2 text-[15px]  bg-gray-100 border border-[#d4e2ed] rounded-lg">
          <p className="font-semibold text-gray-500 ">
            From:{" "}
            <strong className="text-[#4e667e] font-medium">
              {format(rowData?.details?.from ?? new Date(), "EEE d MMMM")}
            </strong>
          </p>
          <p className="font-semibold text-gray-500 ">
            To:{" "}
            <strong className="text-[#4e667e] font-medium">
              {format(rowData?.details?.to ?? new Date(), "EEE d MMMM")}{" "}
            </strong>
          </p>
          <p className="font-medium text-gray-500">{rowData?.details?.notes}</p>
        </div>
      </div>

      {rowData?.status == "1" ? (
        <>
          {/* daily breakdown */}
          <div className="pb-10 mb-10 border-b">
            <h3 className="mb-2 text-[17px] font-semibold text-gray-500">
              Daily breakdown
            </h3>
            <div className="bg-gray-100 border font-semibold text-gray-500 border-[#d4e2ed] rounded-lg ">
              {rowData?.details?.days?.map((day) => (
                <DaliyBreakDown
                  day={day}
                  overlabs={getOverlaps?.overlabs ?? []}
                  employeeId={rowData?.employee?.id}
                  requestedBy={
                    rowData?.employee.first_name +
                    " " +
                    rowData?.employee.last_name
                  }
                />
              ))}
            </div>
          </div>

          {/* leave entitlements */}
          {isPaid && (
            <div>
              <h3 className="mb-2 text-[17px] font-semibold text-gray-500">
                {rowData.employee.first_name} {rowData.employee.last_name}`s
                leave entitlements
              </h3>
              <div className="bg-gray-100 font-semibold text-gray-500 border border-[#d4e2ed] rounded-lg ">
                <div className="grid grid-cols-[1fr,160px] space-x-3 items-center border-b-[1px] border-[#d4e2ed] px-4">
                  <p className="">Total days requested</p>
                  <p className="border-l-[1px] border-[#d4e2ed] px-3 py-4 ">
                    {rowData?.details?.days?.length ?? 0} days
                  </p>
                </div>
                <div className="grid grid-cols-[1fr,160px] space-x-3 items-center border-b-[1px] border-[#d4e2ed] px-4">
                  <p>Current balance</p>
                  <p className="border-l-[1px] border-[#d4e2ed] px-3 py-4 ">
                    {TotalBalance ?? 0} days
                  </p>
                </div>
                <div className="grid grid-cols-[1fr,160px] space-x-3 items-center border-b-[1px] border-[#d4e2ed] px-4">
                  <p>Paid days requested</p>
                  <p className="border-l-[1px] border-[#d4e2ed] px-3 py-4 ">
                    {getValues("details")?.days?.filter((d) => d.paid).length ??
                      0}{" "}
                    days
                  </p>
                </div>
                <div className="grid grid-cols-[1fr,160px] space-x-3 items-center border-b-[1px] border-[#d4e2ed] px-4">
                  <p>Remaining days</p>
                  <p className="border-l-[1px] border-[#d4e2ed] px-3 py-4 ">
                    {(TotalBalance ?? 0) -
                      (getValues("details")?.days?.filter((d) => d.paid)
                        ?.length ?? 0)}{" "}
                    days
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // Manager`s notes
        <div className="pb-10 mb-10 border-b">
          {/* <h3 className="mb-2 text-[17px] font-semibold text-gray-500">
            Manager`s notes
          </h3>
          <div className="p-4 space-y-2 text-[15px]  bg-gray-100 border border-[#d4e2ed] rounded-lg">
            <p className="font-semibold text-gray-500 ">
              Sunday will be Unpaid
            </p>
          </div> */}
          <div className="p-4 mt-3 space-y-2 text-[15px]  bg-gray-100 border border-[#d4e2ed] rounded-lg">
            <p
              className={`font-semibold ${
                rowData?.status == "11" ? "text-success" : "text-warn"
              }`}
            >
              {rowData?.status == "11" ? "Approved" : "Rejected"} by{" "}
              <strong className="text-[#4e667e] font-medium">
                {(rowData?.status == "11" || rowData?.status == "12") &&
                  approveRejectUser}
              </strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetailsTimeOff;
