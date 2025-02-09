import RequestIcon from "@/assets/icons/Request";
import SendIcon from "@/assets/icons/Send";
import React, { Dispatch, SetStateAction } from "react";

const NewTransfer = ({
  setSteps,
  setModalName,
}: {
  setSteps: Dispatch<SetStateAction<number>>;
  setModalName: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="mt-[16px]">
      <div
        className="border border-gray-400 flex items-center p-[16px] gap-[8px] rounded-[4px] mb-[16px] cursor-pointer mx-[8px]"
        onClick={() => {
          setSteps(3);
          setModalName("request");
        }}
      >
        <div className="p-2 bg-muted rounded-full">
          <RequestIcon />
        </div>
        <div>
          <p>Request</p>
          <p className="text-gray text-[14px]">
            Ask another location to send you stock
          </p>
        </div>
      </div>

      <div
        className="border border-gray-400 flex items-center p-[16px] gap-[8px] rounded-[4px] cursor-pointer  mx-[8px]"
        onClick={() => {
          setSteps(2);
          setModalName("send");
        }}
      >
        <div className="p-2 bg-[#FFFAF5] rounded-full">
          <SendIcon />
        </div>
        <div>
          <p>Send</p>
          <p className="text-gray text-[14px]">
            Send stock to another location
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewTransfer;
