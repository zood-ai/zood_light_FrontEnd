import React from 'react';

import { GoToShopProps } from './GoToShop.types';

import './GoToShop.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const GoToShop: React.FC<GoToShopProps> = () => {
  const navigate = useNavigate();
  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const totalQty = cardItemValue.reduce((sum, item) => sum + item.qty, 0);
  return (
    <>
      <div
        onClick={() => {
          if (cardItemValue.length > 0) navigate('shop-card');
        }}
        style={{
          color: totalQty ? 'var(--main)' : 'black',
        }}
        className="cursor-pointer flex gap-2.5 col-span-4 md:col-span-1  items-center text-sm font-semibold text-right"
      >
        <div className="mb-5">
          <div
            style={{
              color: totalQty ? 'var(--main)' : 'black',
            }}
          >
            {totalQty}
          </div>
          <div className="">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 22C8.55228 22 9 21.5523 9 21C9 20.4477 8.55228 20 8 20C7.44772 20 7 20.4477 7 21C7 21.5523 7.44772 22 8 22Z"
                stroke="#363088"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 22C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20C18.4477 20 18 20.4477 18 21C18 21.5523 18.4477 22 19 22Z"
                stroke="#363088"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.05005 2.0498H4.05005L6.71005 14.4698C6.80763 14.9247 7.06072 15.3313 7.42576 15.6197C7.7908 15.908 8.24495 16.0602 8.71005 16.0498H18.49C18.9452 16.0491 19.3865 15.8931 19.7411 15.6076C20.0956 15.3222 20.3422 14.9243 20.4401 14.4798L22.09 7.0498H5.12005"
                stroke="#363088"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="">اذهب للعربة</div>
      </div>
    </>
  );
};
