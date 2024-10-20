import React from 'react';

import { DetailsHeadWithOutFilterProps } from './DetailsHeadWithOutFilter.types';

import './DetailsHeadWithOutFilter.css';
import { BackBtn } from '../BackBtn';

export const DetailsHeadWithOutFilter: React.FC<DetailsHeadWithOutFilterProps> = () => {
    return (<>
    
    <div className="grid grid-cols-1  ">
        <BackBtn />
        <div className="flex flex-col items-start rounded-none max-w-[580px] my-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-full text-right text-zinc-800 w-[284px] ">
            <div className="grow shrink text-2xl col-span-1 font-semibold w-[102px]">
              فاتورة
            </div>
            <div className="flex flex-a1 gap-px md:translate-x-2 items-center my-auto text-sm font-medium mt-[10px]">
              <span>{' pm '}</span>
              <div className="self-stretch my-auto ms-1">{' 12:00 '}</div>
              {' - '}
              <div className="self-stretch my-auto">10/06/2024</div>
            </div>
          </div>
        </div>
      </div>
    </>)
};
