import React from 'react';

import { DetailsHeadWithOutFilterProps } from './DetailsHeadWithOutFilter.types';

import './DetailsHeadWithOutFilter.css';
import { BackBtn } from '../BackBtn';
import { titleMapping } from '@/constant/constant';
// titleMapping.ts
 

export default titleMapping;

export const DetailsHeadWithOutFilter: React.FC<
  DetailsHeadWithOutFilterProps
> = ({ bkAction , mainTittle = 'Title Not Found' }) => {
  const pagePath = window.location.pathname; // Get the current path
  const title = titleMapping[pagePath]; // Get the title object based on the path
  const isArabic = true; // Set this based on your app's localization logic
  return (
    <>
      <div className="grid grid-cols-1">
        <div onClick={bkAction ? bkAction : () => {}}>
          <BackBtn bkAction={bkAction} />
        </div>
        <div className=" max-w-[580px] my-4">
          <div className="flex gap-3 max-w-full text-right text-zinc-800  shrink grow">
            <div className="    text-2xl  font-semibold ">
              {title ? (isArabic ? title.ar : title.en) : mainTittle}
            </div>
            <div className="flex  gap-px  items-center  text-sm font-medium mt-[10px] shrink grow">
              <span>{' pm '}</span>
              <div className="  ms-1">{' 12:00 '}</div>
              {' - '}
              <div className=" ">10/06/2024</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
