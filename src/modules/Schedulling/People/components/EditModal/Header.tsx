import { Button } from "@/components/ui/button";
import React from "react";
import usePeopleHttp from "../../queriesHttp/usePeopleHttp";
import useFilterQuery from "@/hooks/useFilterQuery";

export const HeaderInvite = ({ name }: { name: string }) => {
  const {editEmployee,isLoadingEdit} =usePeopleHttp({})
  const {filterObj}=useFilterQuery()
  return (
    <div className="relative mb-[40px]">
      <img src="../../src/assets/Header.png" />
      <p className="absolute top-3 left-24 w-72 text-[13px] leading-5 text-textPrimary">
        {name} needs to be invited to Dot to see schedules and make
        requests.
      </p>
      <Button className="absolute right-0 bottom-5 mx-3" 
      type="button"
      loading={isLoadingEdit}
      onClick={() => {
        editEmployee({id:filterObj?.id,send_invitation:1, _method: "PUT" })
      }}>
        Save
      </Button>
    </div>
  );
};

export const HeaderReminder = () => {
  return (
    <div className="flex items-center gap-2 bg-muted mb-[40px] p-4 rounded-lg">
    
      <p className="w-full text-[13px] leading-5 text-textPrimary">
      1 more document needed to finish onboarding.
      Send a reminder to speed this up ⚡️
      </p>
      <Button className="mx-3" variant="outline" >
        Send Reminder
        </Button>
    </div>
  );
};



