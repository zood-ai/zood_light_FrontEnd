// Icons
import ArrowDownIcon from "@/assets/icons/ArrowDown";

// Components
import { Button } from "@/components/ui/button";

import useScheduletHttp from "../queriesHttp/ScheduleHttp";
import useFilterQuery from "@/hooks/useFilterQuery";
import AuthPermission from "@/guards/AuthPermission";
import { PERMISSIONS } from "@/constants/constants";
import { useRef, useState } from "react";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { useForm } from "react-hook-form";
import {
  formApproveScheduleSchema,
  formPublishScheduleSchema,
} from "../Schema/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ActionModal from "./ActionModal";
import useClickOutside from "@/hooks/useClickOutside";
import CustomDropDown from "@/components/ui/custom/CustomDropDown";
import MoreIcon from "@/assets/icons/More";
import { useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { TABLE_STATUS } from "../constants/constants";
import ScreenIcon from "@/assets/icons/Screen";
import MinimizeIcon from "@/assets/icons/Minimize";

type TScheduleHeader = {
  isFetchingSchedule: boolean;

  tableStatus: string;
  clearSchedule: any;
  isClearSchedule: boolean;
  copySchedule: any;
  setShowAvaliability: React.Dispatch<React.SetStateAction<boolean>>;
  showAvaliability: boolean;
  sortEmployees: boolean;
  setSortEmployees: React.Dispatch<React.SetStateAction<boolean>>;
  showHideEmployees: any;
};
const ScheduleHeader = ({
  clearSchedule,
  copySchedule,
  setShowAvaliability,
  showAvaliability,
  sortEmployees,
  setSortEmployees,
  tableStatus,
  showHideEmployees,
}: TScheduleHeader) => {
  const { filterObj } = useFilterQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  const [openShiftScreen, setOpenShiftScreen] = useState(false);

  const [modalType, setModalType] = useState<string>("");

  const dropDownRef = useRef(null);

  const [showMenu, setShowMenu] = useState(false);
  useClickOutside({
    enabled: showMenu,
    ref: dropDownRef,
    cb: () => setShowMenu(false),
  });
  const handleCloseSheet = () => {
    setModalType("");
  };
  const { updateScheduleStatus, isUpdateScheduleStatus } = useScheduletHttp({
    handleCloseSheet,
  });

  const schema =
    modalType === "approve"
      ? formApproveScheduleSchema
      : formPublishScheduleSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      approvals: [],
      notes: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (modalType === "approve") {
      updateScheduleStatus({
        branch_id: filterObj["filter[branch]"],
        from: filterObj.from,
        to: filterObj.to,
        status: 3,
        ...data,
      });
      return;
    }

    updateScheduleStatus({
      branch_id: filterObj["filter[branch]"],
      from: filterObj.from,
      to: filterObj.to,
      status: 2,
      ...data,
    });
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById("print"),
      canvas = await html2canvas(element as HTMLElement),
      data = canvas.toDataURL("image/jpg"),
      link = document.createElement("a");

    link.href = data;
    link.download = "downloaded-image.jpg";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    setOpenShiftScreen(true);
    const element = document.documentElement; // Select the entire webpage
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      // Safari
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      // IE11
      (element as any).msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      // Safari
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      // IE11
      (document as any).msExitFullscreen();
    }
    setOpenShiftScreen(false);
  };
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-5">
          <h2 className="text-xl font-semibold">Schedule</h2>

          {/* <div className="flex items-center gap-2 font-medium text-gray-500 text-ms">
          <TemplateIcon />
          Templates
        </div> */}
          {/* <div className="flex items-center gap-2 font-medium text-gray-500 text-ms ">
          <ChartIcon />
          {isFetchingSchedule ? (
            <Skeleton className="h-[15px] w-[60px]" />
          ) : (
            "  SAR 27,692"
          )}
        </div>
        <div className="flex items-center gap-2 font-medium text-gray-500 text-ms ">
          <UserProfileIcon />
          {isFetchingSchedule ? (
            <Skeleton className="h-[15px] w-[60px]" />
          ) : (
            " 20% SAR 5,538"
          )}
        </div> */}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-xl font-semibold"
            onClick={!openShiftScreen ? handleFullscreen : exitFullscreen}
          >
            {!openShiftScreen? <ScreenIcon />:<MinimizeIcon/>}
           
          </button>

          <Button
            disabled={isUpdateScheduleStatus}
            variant="outline"
            className="relative flex items-center gap-2"
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            {tableStatus} <ArrowDownIcon />
            <AuthPermission
              permissionRequired={[PERMISSIONS.can_approve_schedule]}
            >
              {showMenu && tableStatus !== TABLE_STATUS[2] && (
                <div
                  ref={dropDownRef}
                  className="absolute text-black bg-white flex flex-col  gap-2  top-10 -right-2 z-50 w-[200px] p-2 rounded-md shadow-md"
                >
                  {tableStatus === TABLE_STATUS[1] && (
                    <Button
                      variant={"destructive"}
                      className="flex justify-start w-full font-normal rounded-sm hover:bg-primary-foreground hover:text-white"
                      onClick={() => {
                        setModalType("approve");
                      }}
                    >
                      Submit for Approval
                    </Button>
                  )}

                  {tableStatus !== TABLE_STATUS[2] && (
                    <Button
                      variant={"destructive"}
                      className="flex justify-start w-full font-normal rounded-sm hover:bg-primary-foreground hover:text-white"
                      onClick={() => {
                        setModalType("publish");
                      }}
                    >
                      Publish
                    </Button>
                  )}
                </div>
              )}
            </AuthPermission>
          </Button>

          <CustomDropDown
            defaultValue={
              <div className="py-2">
                <MoreIcon />
              </div>
            }
            className="cursor-pointer"
            options={[
              { label: "Clear Schedule", value: 1 },
              { label: "Copy Schedule to next week", value: 2 },
              {
                label: showAvaliability
                  ? "Hide employee availability"
                  : "Show employee availability",
                value: 3,
              },
              {
                label: filterObj.homeOnly
                  ? "Show shared employees"
                  : "Hide shared employees",
                value: 4,
              },
              { label: "Show Hidden employees", value: 5 },
              { label: "Sort employees list", value: 6 },
              { label: "Download as image", value: 7 },
            ]}
            onValueChange={(e) => {
              if (e === 1) {
                clearSchedule({
                  branch_id: filterObj["filter[branch]"],
                  from: filterObj.from,
                  to: filterObj.to,
                });
              }
              if (e === 2) {
                copySchedule({
                  branch_id: filterObj["filter[branch]"],
                  from: filterObj.from,
                  to: filterObj.to,
                });
              }

              if (e === 3) {
                setShowAvaliability(!showAvaliability);
              }

              if (e === 4) {
                if (filterObj.homeOnly === "true") {
                  delete filterObj.homeOnly;
                  setSearchParams(filterObj);
                  return;
                }
                setSearchParams({
                  ...filterObj,
                  homeOnly: "true",
                });
              }

              if (e === 5) {
                showHideEmployees({
                  branch_id: filterObj["filter[branch]"],
                  from: filterObj.from,
                  to: filterObj.to,
                });
              }

              if (e === 6) {
                setSortEmployees(!sortEmployees);
              }
              if (e === 7) {
                handleDownloadImage();
              }
            }}
          />
        </div>
      </div>
      <CustomSheet
        isOpen={modalType === "approve" || modalType === "publish"}
        isEdit={false}
        form={form}
        isDirty={true}
        onSubmit={onSubmit}
        isLoading={isUpdateScheduleStatus}
        btnText={modalType === "approve" ? "Submit" : "Confirm"}
        headerLeftText={
          modalType === "approve" ? "Submit for approval" : "Publish schedule"
        }
        handleCloseSheet={handleCloseSheet}
        purchaseHeader={
          <div className="flex items-center justify-between w-full">
            <h3>
              {modalType === "approve"
                ? "Submit for approval"
                : "Publish schedule"}
            </h3>
            <Button
              className="ml-auto"
              type="submit"
              onClick={() => onSubmit(form.getValues())}
              disabled={isUpdateScheduleStatus}
            >
              {modalType === "approve" ? "Submit" : "Confirm"}
            </Button>
          </div>
        }
      >
        <ActionModal modalType={modalType} />
      </CustomSheet>
    </>
  );
};

export default ScheduleHeader;
