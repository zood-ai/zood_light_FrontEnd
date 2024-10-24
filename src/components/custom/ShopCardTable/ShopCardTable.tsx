import React from 'react';

import { ShopCardTableProps } from './ShopCardTable.types';
import imagePLaceHolder from '/icons/imagePLaceHolder.svg';

import './ShopCardTable.css';
import { Counter } from '../Counter';
import TrashIcon from '@/components/Icons/TrashIcon';
import { useSelector } from 'react-redux';

export const ShopCardTable: React.FC<ShopCardTableProps> = () => {
  const cardItemValue = useSelector((state: any) => state.cardItems.value);

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
          {cardItemValue?.map(
            (
              item: {
                id: string;
                qty: number;
                name: string;
                image: any;
                price: number;
              },
              index: number
            ) => (
              <tr className="bg-white border border-gray-200 border-solid">
                <td className="py-7 flex items-center rounded-bl-lg">
                  <img
                    loading="lazy"
                    src={item.image ? item?.image : imagePLaceHolder}
                    className="object-cover max-w-[79px] ms-xl"
                  />
                  <span className="ms-3">{item.name}</span>
                </td>

                <td className="py-7 ">
                  <Counter item={item} />
                </td>
                <td className="py-7 ">SR {item.price}</td>

                <td className="py-7  rounded-br-lg">
                  <TrashIcon />
                </td>
                <td className="py-7 w-[6%] "></td>
                <td className="py-7 w-[6%]"></td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
};
