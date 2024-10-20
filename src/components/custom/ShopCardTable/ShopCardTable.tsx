import React from 'react';

import { ShopCardTableProps } from './ShopCardTable.types';
import imagePLaceHolder from '/icons/imagePLaceHolder.svg';

import './ShopCardTable.css';
import { Counter } from '../Counter';
import TrashIcon from '@/components/Icons/TrashIcon';

export const ShopCardTable: React.FC<ShopCardTableProps> = () => {
  return (
    <>
      <table className="table-auto text-base font-medium text-right text-black w-full">
        {/* Header */}
        <thead className="bg-[#EAEBF5] border border-gray-200 border-solid">
          <tr className="gap-10">
            <th className="py-3.5 pr-10  ">المنتج</th>
            <th className="py-3.5 ">الكمية</th>
            <th className="py-3.5 ">السعر</th>
            <th className="py-3.5  r"></th>
            <th className="py-3.5  r"></th>
            <th className="py-3.5  r"></th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          <tr className="bg-white border border-gray-200 border-solid">
            <td className="py-7 flex items-center rounded-bl-lg">
              <img
                loading="lazy"
                src={imagePLaceHolder}
                className="object-cover max-w-[79px] ms-xl"
              />
              <span className='ms-3'>ملح</span>
            </td>

            <td className="py-7 ">
              <Counter />
            </td>
            <td className="py-7 ">SR 300.00</td>


            <td className="py-7  rounded-br-lg">
              <TrashIcon />
            </td>
            <td className="py-7 w-[6%] "></td>
            <td className="py-7 w-[6%]"></td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
