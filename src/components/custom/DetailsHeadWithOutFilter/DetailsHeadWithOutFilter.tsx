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
    <div className="flex items-center gap-4 mb-6 mt-4">
      <div className="shrink-0">
        <BackBtn bkAction={bkAction} className="mb-0" />
      </div>

      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight leading-none">
          {title ? (isArabic ? title?.ar : title.en) : mainTittle}
        </h1>
        {subTitle && (
          <p className="text-sm text-muted-foreground mt-1">{subTitle}</p>
        )}
      </div>
    </div>
  );
};
