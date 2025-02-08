import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import usePeopleHttp from "../../queriesHttp/usePeopleHttp";
import useFilterQuery from "@/hooks/useFilterQuery";
import moment from "moment";
import { useFormContext } from "react-hook-form";

export const HeaderInvite = ({
  name,
  handleCloseSheet,
  btnTxt = "Save",
  image = "../../src/assets/Header.png",
  message = "needs to be invited to Dot to see schedules and make requests.",
}: {
  name: string;
  handleCloseSheet: () => void;
  btnTxt?: string;
  image?: string;
  message?: string;
}) => {
  const { editEmployee, isLoadingEdit, sendReminder } = usePeopleHttp({
    handleCloseSheet: handleCloseSheet,
  });
  const { filterObj } = useFilterQuery();
  return (
    <div className="relative mb-[40px]">
      <div className="flex items-center">
        <img src={image} />
        <p
          className={`absolute  left-28 w-72 text-[13px] leading-5 text-textPrimary`}
        >
          <span className="font-bold capitalize">{name}</span> {message}
        </p>
      </div>
      <Button
        className="absolute right-0 bottom-5 mx-3"
        type="button"
        loading={isLoadingEdit}
        onClick={() => {
          editEmployee({
            id: filterObj?.id,
            send_invitation: 1,
            _method: "PUT",
          });
        }}
      >
        {btnTxt}
      </Button>
    </div>
  );
};

export const HeaderReminder = ({
  pending_documents,
}: {
  pending_documents: number;
}) => {
  const {watch,setValue}=useFormContext()
  const { isLoadingSendReminder, sendReminder } = usePeopleHttp({
    handleCloseSheet: () => {
      setValue("check",true);
    },
  });
  const { filterObj } = useFilterQuery();

  return (
    <div className="flex items-center gap-2 bg-muted mb-[40px] p-4 rounded-lg">
      <p className="w-full text-[13px] leading-5 text-textPrimary">
        {watch("check") ? (
          <>
            ⚡️ Reminder sent on {moment(new Date(), "HH:mm").format("h:mm A")} on {moment(new Date()).format("MMM D, YYYY")}
          </>
        ) : (
          <>
            {pending_documents} more document needed to finish onboarding. Send
            a reminder to speed this up ⚡️
          </>
        )}
      </p>
      {!watch("check") &&<Button
        className="mx-3"
        variant="outline"
        type="button"
        loading={isLoadingSendReminder}
        onClick={() => {
          sendReminder(filterObj?.id);
        }}
      >
        Send Reminder
      </Button>}
      
    </div>
  );
};
