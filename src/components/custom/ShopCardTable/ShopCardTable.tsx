import React from 'react';

import { ShopCardTableProps } from './ShopCardTable.types';
import imagePLaceHolder from '/icons/imagePLaceHolder.svg';

import './ShopCardTable.css';
import { Counter } from '../Counter';
import TrashIcon from '@/components/Icons/TrashIcon';
import { useDispatch, useSelector } from 'react-redux';
import { setCardItem } from '@/store/slices/cardItems';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ShopCardTable: React.FC<ShopCardTableProps> = () => {
  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const dispatch = useDispatch();
  let params = useParams();
  const { t } = useTranslation();
  return (
    <>
      <div className="flex bg-[#EAEBF5] border border-gray-200 border-solid w-full">
        <div className="py-3.5 px-10 w-1/3">{t('PRODUCTS')}</div>
        <div className="py-3.5 w-1/3">{t('QUANTITY')}</div>
        <div className="py-3.5 w-1/3">{t('PRICE')}</div>
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
                <td className="py-7 max-md:py-9 flex items-center justify-right rounded-bl-lg">
                  <img
                    loading="lazy"
                    src={item.image ? item?.image : imagePLaceHolder}
                    className="object-cover max-w-[79px] md:ms-xl ms-4 max-md:hidden"
                  />
                  <span className="ms-3">{item.name}</span>
                </td>

                <td className="py-7 w-1/3">
                  <div className="flex justify-center">
                    <Counter item={item} />
                  </div>
                </td>
                <td className="py-7 w-1/3">
                  <div className="flex justify-center">
                    SR {Number(item.price) * Number(item.qty)}
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => {
                      if (!params.id) {
                        const updatedItems = cardItemValue.filter(
                          (i: { id: string }) => i.id !== item.id
                        );
                        dispatch(setCardItem(updatedItems));
                      }
                    }}
                    className="rounded-br-lg px-10 cursor-pointer hover:scale-105 "
                  >
                    <TrashIcon />
                  </button>
                </td>
                {/* {!params.id && ( */}
                {/* )} */}
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
};
