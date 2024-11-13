import React from 'react';

import { ShopCardTableProps } from './ShopCardTable.types';
import imagePLaceHolder from '/icons/imagePLaceHolder.svg';

import './ShopCardTable.css';
import { Counter } from '../Counter';
import TrashIcon from '@/components/Icons/TrashIcon';
import { useDispatch, useSelector } from 'react-redux';
import { setCardItem } from '@/store/slices/cardItems';
import { useParams } from 'react-router-dom';

export const ShopCardTable: React.FC<ShopCardTableProps> = () => {
  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const dispatch = useDispatch();
  let params = useParams();
  return (
    <>
      <div className="flex bg-[#EAEBF5] border border-gray-200 border-solid w-full">
        <div className="py-3.5 text-center flex-grow">المنتج</div>
        <div className="py-3.5 text-center flex-grow">الكمية</div>
        <div className="py-3.5 text-center flex-grow">السعر</div>
      </div>
      <table className="table-auto text-base font-medium text-right text-black w-full">
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
                <td className="py-7 max-md:py-9 flex items-center justify-center rounded-bl-lg">
                  <img
                    loading="lazy"
                    src={item.image ? item?.image : imagePLaceHolder}
                    className="object-cover max-w-[79px] md:ms-xl ms-4 max-md:hidden"
                  />
                  <span className="ms-3">{item.name}</span>
                </td>

                <td className="py-7">
                  <div className="flex justify-center">
                    <Counter item={item} />
                  </div>
                </td>
                <td className="py-7 text-center">
                  SR {Number(item.price) * Number(item.qty)}
                </td>

                {/* {!params.id && ( */}
                <td
                  onClick={() => {
                    if (!params.id) {
                      const updatedItems = cardItemValue.filter(
                        (i: { id: string }) => i.id !== item.id
                      );
                      dispatch(setCardItem(updatedItems));
                    }
                  }}
                  className="py-7  rounded-br-lg cursor-pointer hover:scale-105 "
                >
                  <TrashIcon />
                </td>
                {/* )} */}
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
