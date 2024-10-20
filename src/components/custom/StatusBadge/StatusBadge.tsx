import React from 'react';

import { StatusBadgeProps } from './StatusBadge.types';

import './StatusBadge.css';

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
}: any) => {
  return (
    <>
      {status === 'pending' && (
        <div className="flex gap-2 text-sm font-medium text-sky-700 rounded-none max-w-[181px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/229ef97a04c98a8ef2a4c96d40f58953cfa33ef2cf3e3a9f519ee8b58c76c75f?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
            className="object-contain shrink-0 my-auto w-1.5 aspect-[0.55] capitalize"
          />
          <div className="gap-2.5 self-stretch px-2 h-6 rounded border pt-[2px] border-blue-600 border-solid bg-indigo-100 bg-opacity-40 shadow-[0px_1px_6px_rgba(0,0,0,0.08)] capitalize">
            {text}
          </div>
        </div>
      )}
      {status === 'reported' && (
        <div className="flex flex-col justify-center py-xs text-sm font-semibold text-teal-500 whitespace-nowrap max-w-[81px]">
          <div className="gap-2.5 capitalize self-stretch px-2 h-6 pt-[2px] bg-teal-100 rounded border border-teal-400 border-solid">
            {text}
          </div>
        </div>
      )}
    </>
  );
};
