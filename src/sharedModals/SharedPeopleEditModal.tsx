import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { HeaderInvite, HeaderReminder } from "../modules/Schedulling/People/components/EditModal/Header";
import Personal from "../modules/Schedulling/People/components/EditModal/Personal";
import Availability from "../modules/Schedulling/People/components/EditModal/Availability";
import Role from "../modules/Schedulling/People/components/EditModal/Role";
import Documents from "../modules/Schedulling/People/components/EditModal/Documents";
import Attendance from "../modules/Schedulling/People/components/EditModal/Attendance";
import Feedback from "../modules/Schedulling/People/components/EditModal/Feedback";
import History from "../modules/Schedulling/People/components/EditModal/History";
import Permissions from "../modules/Schedulling/People/components/EditModal/Permissions";
import AuthPermission from "@/guards/AuthPermission";
import { PERMISSIONS } from "@/constants/constants";
import React from "react";
import Email from "@/assets/icons/Email";
import PhoneIcon from "@/assets/icons/Phone";
import { handleStatus, handleStatusShap } from "../modules/Schedulling/People/helpers/helpers";
import { Badge } from "@/components/ui/badge";

interface SharedPeopleEditModalProps {
  isEdit: boolean;
  setModalName: React.Dispatch<React.SetStateAction<string>>;
  form: any;
  onSubmit: (data: any) => void;
  isLoadingEdit: boolean;
  isLoadingAdd: boolean;
  handleCloseSheet: () => void;
  employeeDataOne: any;
  isFetchingemployeeOne: boolean;
  isLoadingFeedback: boolean;
  resetFrom?: (data: Record<string, any>) => void;
  employeeAttendace?: any;
  setAttendanceDays?: React.Dispatch<React.SetStateAction<any>>;
  attendanceDays?: string;
  isFetchingemployeeAttendace?: boolean;
  historyData?: any;
}

const SharedPeopleEditModal = ({
  isEdit,
  setModalName,
  form,
  onSubmit,
  isLoadingEdit,
  handleCloseSheet,
  employeeDataOne,
  isFetchingemployeeOne,
  resetFrom,
  employeeAttendace,
  setAttendanceDays,
  attendanceDays,
  isFetchingemployeeAttendace,
  historyData,
}: SharedPeopleEditModalProps) => {
  return (
    <CustomSheet
      width="w-[850px]"
      isOpen={isEdit}
      isDirty={isEdit}
      handleCloseSheet={handleCloseSheet}
      form={form}
      onSubmit={onSubmit}
      btnText="Save Change"
      setModalName={setModalName}
      isLoadingForm={isFetchingemployeeOne}
      isLoading={isLoadingEdit}
      disableSheet={employeeDataOne?.status == 6}
      purchaseHeader={
        <div className="flex items-center gap-2">
          {employeeDataOne?.image == null ? (
            <Avatar
              text={`${employeeDataOne?.first_name} ${employeeDataOne?.last_name}`}
              bg="secondary"
            />
          ) : (
            <img
              src={employeeDataOne?.image}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p>
              {employeeDataOne?.first_name} {employeeDataOne?.last_name}{" "}
              <Badge variant={handleStatusShap(employeeDataOne?.status)}>
                {handleStatus(employeeDataOne?.status)}
              </Badge>
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <div className="bg-[#d3e1ff] w-5 p-1 rounded-full mt-1 mr-1">
                  <Email />
                </div>
                <p className="text-[12px]">{employeeDataOne?.email}</p>
              </div>
              {employeeDataOne?.phone && (
                <div className="flex items-center">
                  <div className="bg-[#d3e1ff] w-5 p-1 rounded-full mt-1 mr-1">
                    <PhoneIcon />
                  </div>
                  <p className="text-[12px]">{employeeDataOne?.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      }
      receiveOrder={
        <AuthPermission
          permissionRequired={[
            PERMISSIONS.can_edit_permissions_for_users,
            PERMISSIONS.can_see_and_edit_employee_wages,
            PERMISSIONS.can_see_and_upload_employee_documents,
          ]}
        >
          <Button
            loading={isLoadingEdit}
            disabled={!form.formState.isValid || employeeDataOne?.status == 6}
          >
            Save Changes
          </Button>
        </AuthPermission>
      }
      inviteComponet={
        <>
          <AuthPermission permissionRequired={[]}>
            {[1, 7].includes(employeeDataOne?.status) && (
              <HeaderInvite
                name={
                  employeeDataOne?.first_name + " " + employeeDataOne?.last_name
                }
                handleCloseSheet={handleCloseSheet}
              />
            )}
            {[2].includes(employeeDataOne?.status) && (
              <HeaderInvite
                name={
                  employeeDataOne?.first_name + " " + employeeDataOne?.last_name
                }
                handleCloseSheet={handleCloseSheet}
                btnTxt={'Resend invite'}
                image="../../src/assets/header-re.png"
                message="has been invited to Dot."
                              />
            )}
             {[6].includes(employeeDataOne?.status) && (
              <HeaderInvite
                name={
                  employeeDataOne?.first_name + " " + employeeDataOne?.last_name
                }
                handleCloseSheet={handleCloseSheet}
                btnTxt={'Reactivate'}
                image="../../src/assets/header-de.png"
                message="has been removed as an employee. They no longer have access to Dot."
                              />
            )}
            {employeeDataOne?.status == 3 &&
              employeeDataOne?.documents?.length > 0 && <HeaderReminder pending_documents={employeeDataOne?.pending_documents}/>}
          </AuthPermission>
        </>
      }
      tabs={[
        {
          name: "Personal Info",
          content: (
            <AuthPermission
              permissionRequired={[PERMISSIONS.can_view_personal_info]}
            >
              <Personal handleCloseSheet={handleCloseSheet} />
            </AuthPermission>
          ),
        },
        {
          name: "Availability",
          content: <Availability />,
        },
        {
          name: "Role",
          content: <Role employeeData={employeeDataOne?.branches} />,
        },
        {
          name: "Documents",
          content: <Documents resetFrom={resetFrom} />,
        },
        {
          name: "Attendance",
          content: (
            <Attendance
              employeeAttendace={employeeAttendace}
              setAttendanceDays={setAttendanceDays || (() => {})}
              attendanceDays={attendanceDays || ""}
              isFetchingemployeeAttendace={isFetchingemployeeAttendace}
            />
          ),
        },
        {
          name: "Feedback",
          content: <Feedback />,
        },
        {
          name: "History",
          content: <History historyData={historyData} />,
        },
        {
          name: "Permissions",
          content: <Permissions />,
        },
      ]}
    />
  );
};

export default SharedPeopleEditModal;
