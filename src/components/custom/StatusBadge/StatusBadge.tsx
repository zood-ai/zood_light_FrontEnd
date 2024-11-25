import React from 'react';

import { StatusBadgeProps } from './StatusBadge.types';

import './StatusBadge.css';

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  type,
}: any) => {
  return (
    <>
      {status === 'pending' && (
        <div className="flex gap-2 text-sm font-medium text-[#195EAD] rounded-none max-w-[181px]">
          <div className="object-contain shrink-0 my-auto w-1.5 aspect-[0.55] capitalize">
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.91 11.0544L1 6.14437L5.91 1.23437"
                stroke="#1B74DA"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div className="gap-2.5 self-stretch px-2 rounded border py-1 border-[#1B74DA] border-solid bg-[#E1EBFA66] bg-opacity-40 shadow-[0px_1px_6px_rgba(0,0,0,0.08)] capitalize">
            {text}
          </div>
        </div>
      )}
      {status === 'reported' && (
        <div className="flex flex-col justify-center py-xs text-sm font-semibold text-teal-500 whitespace-nowrap max-w-[81px]">
          <div className="gap-2.5 capitalize self-stretch px-2 py-1 bg-[#D2F9F4] rounded border border-[#1BDAC0] border-solid">
            {text}
          </div>
        </div>
      )}
      {status === 'active' && (
        <div
          className={`flex flex-col justify-center py-xs text-sm font-semibold text-teal-500 whitespace-nowrap ${
            type ? 'max-w-[100px]' : 'max-w-[81px]'
          } `}
        >
          <div className="gap-2.5 capitalize self-stretch py-1 px-2 bg-[#D2F9F4] rounded border border-[#1BDAC0] border-solid">
            {text}
          </div>
        </div>
      )}
      {status === 'Inactive' && (
        <div className="flex gap-2 text-sm font-medium text-[#C4DA1B] rounded-none max-w-[181px]">
          <div className="gap-2.5 self-stretch px-2 rounded border py-1 border-[#C4DA1B] border-solid bg-[#F3F9D2] bg-opacity-40 shadow-[0px_1px_6px_rgba(0,0,0,0.08)] capitalize">
            {text}
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col justify-center py-xs pb-2 text-sm font-semibold text-[#BC1B1B] whitespace-nowrap max-w-[81px]">
          <div className="gap-2.5 capitalize self-stretch px-2 pt-[2px] bg-[#F9D2D2] rounded border border-[#DA1B1B] border-solid">
            {text}
          </div>
        </div>
      )}
    </>
  );
};
