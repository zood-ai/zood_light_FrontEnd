import React from 'react';

import { DetailsHeadWithOutFilterProps } from './DetailsHeadWithOutFilter.types';

import './DetailsHeadWithOutFilter.css';
import { BackBtn } from '../BackBtn';
import { titleMapping } from '@/constant/constant';
import useDirection from '@/hooks/useDirection';
// titleMapping.ts

export default titleMapping;

export const DetailsHeadWithOutFilter: React.FC<any> = ({
  bkAction,
  mainTittle = 'Title Not Found',
  subTitle = '',
}) => {
  const pagePath = window.location.pathname; // Get the current path
  const title = titleMapping(pagePath); // Get the title object based on the path
  const isArabic = useDirection(); // Set this based on your app's localization logic
  return (
    <>
      <div className="grid grid-cols-1">
        <div>
          <BackBtn bkAction={bkAction} />
        </div>
        <div className=" max-w-[580px] my-4">
          <div className="flex gap-3 max-w-full text-right text-zinc-800  shrink grow">
            <div className="    text-2xl  font-semibold ">
              {title ? (isArabic ? title?.ar : title.en) : mainTittle}
            </div>
            <div className="flex  gap-px  items-center  text-sm font-medium mt-[10px] shrink grow">
              <span>{subTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
