import Email from '@/assets/icons/Email'
import Avatar from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CustomSheet } from '@/components/ui/custom/CustomSheet'
import React from 'react'
import  { HeaderInvite, HeaderReminder } from './EditModal/Header'
import Personal from './EditModal/Personal'
import Availability from './EditModal/Availability'
import Role from './EditModal/Role'
import Documents from './EditModal/Documents'
import Attendance from './EditModal/Attendance'
import Feedback from './EditModal/Feedback'
import History from './EditModal/History'
import Permissions from './EditModal/Permissions'

const SharedPeopleEditModal = ({
    isEdit,
    setModalName,
    form,
    onSubmit,
    isLoadingEdit,
    isLoadingAdd,
    handleCloseSheet,
    employeeDataOne,
    isFetchingemployeeOne,
    feedbackData,
    isLoadingFeedback,
    resetFrom,
    employeeAttendace
}:{
    isEdit:boolean,
    setModalName:any,
    form:any,
    onSubmit:any,
    isLoadingEdit:boolean,
    handleCloseSheet:any,
    employeeDataOne:any,
    isFetchingemployeeOne:boolean,
    feedbackData:any,
    isLoadingFeedback:boolean,
    isLoadingAdd:boolean,
    resetFrom?:any
    employeeAttendace?:any
}
)=>

{
  return (
  <>
   <CustomSheet
        isOpen={isEdit}
        isDirty={isEdit}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={isEdit ? "New Warehouse" : "Edit Warehouse"}
        form={form}
        onSubmit={onSubmit}
        btnText="Save Change"
        setModalName={setModalName}
        isLoadingForm={isFetchingemployeeOne || isLoadingFeedback}
        isLoading={isLoadingEdit}
        purchaseHeader={
          <div className="flex items-center gap-2">
            <Avatar text={`${employeeDataOne?.first_name} ${employeeDataOne?.last_name}`} bg="secondary" />
            <div>
              <p>{employeeDataOne?.first_name} {employeeDataOne?.last_name}</p>
              <div className="flex items-center">
                <div className="bg-[#d3e1ff] w-5 p-1 rounded-full mt-1 mr-1">
                  <Email />
                </div>
                <p className="text-[12px]">{employeeDataOne?.email}</p>
              </div>
            </div>
          </div>
        }
        receiveOrder={
          <>
            <Button loading={isLoadingEdit} >Save Changes</Button>
          </>
        }
        inviteComponet={
          <>
            {employeeDataOne?.status == 1 &&
              <HeaderInvite name={employeeDataOne?.first_name + " " + employeeDataOne?.last_name} />}
              {employeeDataOne?.status == 3 &&
              <HeaderReminder  />}
          </>
        }
        tabs={[
          {
            name: "Personal Info",
            content: <Personal handleCloseSheet={handleCloseSheet}/>,
          },
          {
            name: "Availability",
            content: <Availability />,
          },
          {
            name: "Role",
            content: <Role />,
          },
          {
            name: "Documents",
            content: <Documents resetFrom={resetFrom} />,
          },
          {
            name: "Attendance",
            content: <Attendance employeeAttendace={employeeAttendace}/>,
          },
          {
            name: "Feedback",
            content: <Feedback feedbackData={feedbackData} />,
          },
          {
            name: "History",
            content: <History />,
          },
          {
            name: "Permissions",
            content: <Permissions />,
          },
        ]}
      />
  </>
  )
}

export default SharedPeopleEditModal