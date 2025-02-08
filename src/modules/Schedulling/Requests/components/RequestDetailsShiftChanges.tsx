import ChangeIcon from "@/assets/icons/Change";
import UserIcon from "@/assets/icons/User";
import WarningBgIcon from "@/assets/icons/WarningBg";
import Avatar from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import CustomAlert from "@/components/ui/custom/CustomAlert";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const RequestDetailsShiftChanges = ({ rowData }: { rowData: any }) => {
  const [selectData, setSelectData] = useState({
    selectValue: "1",
    employeeId: "",
  });

  const { setValue, getValues } = useFormContext();

  const { employeesSelect, isEmployeesLoading } = useCommonRequests({
    getEmployees: true,
  });

  const name = `${rowData?.employee?.first_name} ${rowData?.employee?.last_name}`;
  const employeeName = `${rowData?.shift?.employee?.first_name} ${rowData?.shift?.employee?.last_name}`;

  const isOpenShift = rowData?.type == "1";

  const rejectedBy =
    rowData?.rejected_by?.[0]?.first_name +
    " " +
    rowData?.rejected_by?.[0]?.last_name;

  const approvedBy =
    rowData?.approved_by?.[0]?.first_name +
    " " +
    rowData?.approved_by?.[0]?.last_name;
  return (
    <div>
      {/* Request owner */}

      <div>
        <h3 className="mb-5 font-semibold">
          Request made by{" "}
          {rowData?.employee?.first_name + " " + rowData?.employee?.last_name}
        </h3>
        {(rowData?.approved_by?.length > 0 ||
          rowData?.rejected_by?.length > 0) && (
          <h4 className="mb-3 font-semibold text-gray-300">
            Actioned by{" "}
            {rowData?.approved_by?.length > 0 ? approvedBy : rejectedBy}{" "}
          </h4>
        )}
        <div
          className={`flex items-center justify-between ${
            isOpenShift ? "" : "flex-row-reverse"
          }`}
        >
          <div className="flex flex-col items-center min-w-60">
            {isOpenShift ? (
              <>
                <span className="font-semibold">Open shift</span>
                <WarningBgIcon width="60" height="60" className="mt-3" />
              </>
            ) : (
              <>
                {rowData?.shift && rowData?.original_shift ? (
                  <div className="flex flex-col gap-2 min-w-60">
                    <div className="flex items-center gap-1 font-semibold">
                      <Avatar text={isOpenShift ? name : employeeName} />
                      <span>{isOpenShift ? name : employeeName}</span>
                    </div>
                    <span className="font-semibold">
                      {format(rowData?.shift?.date ?? new Date(), "EEE d MMMM")}
                    </span>
                    <span>
                      {rowData?.shift?.time_from.slice(0, 5)}-
                      {rowData?.shift?.time_to.slice(0, 5)}
                    </span>
                    <span className="text-[#748faa]">
                      {rowData?.shift?.position?.name ??
                        "No Position Adminstration"}
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold">Drop shift</span>

                    <div className="flex items-center justify-center p-4 mt-3 rounded-full bg-popover-foreground">
                      <UserIcon width="30" height="30" className="" />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <ChangeIcon />
          <div className="flex flex-col gap-2 min-w-60">
            <div className="flex items-center gap-1 font-semibold">
              <Avatar text={name} />
              <span>{name}</span>
            </div>
            <span className="font-semibold">
              {isOpenShift
                ? format(rowData?.shift?.date ?? new Date(), "EEE d MMMM")
                : format(
                    rowData?.original_shift?.date ?? new Date(),
                    "EEE d MMMM"
                  )}
            </span>
            <span>
              {isOpenShift
                ? rowData?.shift?.time_from.slice(0, 5)
                : rowData?.original_shift?.time_from.slice(0, 5)}
              -
              {isOpenShift
                ? rowData?.shift?.time_to.slice(0, 5)
                : rowData?.original_shift?.time_to.slice(0, 5)}
            </span>
            <span className="text-[#748faa]">
              {isOpenShift
                ? rowData?.shift?.position?.name || "No Position Adminstration"
                : rowData?.original_shift?.position?.name ||
                  "No Position Adminstration"}
            </span>
          </div>
        </div>
      </div>

      {/* note */}
      {rowData?.details?.notes && (
        <div className="space-y-2 my-7">
          <h3 className="font-semibold ">Notes</h3>
          <p className="">{rowData?.details?.notes}</p>
        </div>
      )}

      {/* Request details */}

      <div className="mt-5  border-b-[1px] pb-5">
        <h3 className="font-semibold">Shift change details</h3>
        <div className="mt-2 space-y-2">
          <p className="text-[#748faa] font-semibold">
            Location:{" "}
            <strong className="font-medium text-black">
              {rowData?.branch?.name}
            </strong>
          </p>
          <p className="text-[#748faa] font-semibold">
            {isOpenShift ? "Open shift" : `${name}'s shift`}:{" "}
            <strong className="font-medium text-black">
              {isOpenShift
                ? rowData?.shift?.hours
                : rowData?.original_shift && rowData?.shift
                ? rowData?.shift?.hours
                : rowData?.original_shift?.hours}{" "}
              hrs
            </strong>
          </p>
          {/* <p className="text-[#748faa] font-semibold">
            COL difference (estimated):
            <strong className="font-medium text-black">+ SAR55.52</strong>
          </p> */}
        </div>
      </div>

      {/* Request options */}

      {rowData?.type != "1" && rowData?.original_shift && !rowData?.shift && (
        <div className="mt-5">
          <RadioGroup
            disabled={rowData?.status != 1}
            defaultValue={
              rowData?.replacement_id ? "2" : selectData.selectValue
            }
            onValueChange={(e) => {
              setValue("replacement_id", "", { shouldValidate: true });
              setSelectData({
                ...selectData,
                selectValue: e,
              });
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <RadioGroupItem value={"1"} id={"1"} />
              <Label>Leave shift open for anyone</Label>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <RadioGroupItem value={"2"} id={"1"} />
              <Label>Find a replacement</Label>
            </div>
          </RadioGroup>

          {selectData.selectValue === "1" && rowData?.status == 1 && (
            <>
              <CustomAlert
                bgColor="bg-[#edfafcff]"
                colorIcon="var(--secondary-foreground)"
                content={
                  "Your team will be able to pick up this shift on a first come first serve basis."
                }
              />
              <Button variant={"line"} className="mt-2 -ml-3 text-base">
                Save and go to schedule{" "}
              </Button>
            </>
          )}

          {(selectData.selectValue === "2" || rowData?.replacement_id) && (
            <CustomSelect
              options={employeesSelect}
              disabled={rowData?.status != 1}
              value={
                rowData?.replacement_id ?? getValues("replacement_id") ?? "null"
              }
              loading={isEmployeesLoading}
              onValueChange={(e) => {
                setValue("replacement_id", e, { shouldValidate: true });
                setSelectData({
                  ...selectData,
                  employeeId: e,
                });
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RequestDetailsShiftChanges;
