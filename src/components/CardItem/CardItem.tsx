import React, { useState } from 'react';

import { CardItemProps } from './CardItem.types';

import './CardItem.css';
import PlusIcon from '../Icons/PlusIcon';
import saltImg from './salt.png';
import { Button } from '../custom/button';

export const CardItem: React.FC<CardItemProps> = ({
  setShopCardCount,
  index,
}) => {
  const [count, setCount] = useState(0);
  const incrementCount = () => {
    setShopCardCount(count + 1, 'plus');
    setCount((prev) => prev + 1);
  };
  const decrementCount = () => {
    setShopCardCount(count - 1, 'minus');
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  };
  return (
    <>
      <div className="flex flex-col pt-0 mb-md text-sm text-right rounded-none  max-w-[265px] ">
        <div className="flex flex-col pb-2 w-full bg-white rounded border border-gray-200 border-solid">
          <div className="flex flex-col px-3 w-full font-semibold bg-white rounded border border-gray-200 border-solid text-zinc-500 ">
            <div className="flex relative z-10 flex-col px-16 pt-52 pb-0.5 mt-0 mb-0 aspect-square">
              <img
                loading="lazy"
                src={saltImg}
                className="object-cover absolute inset-0 size-full z-10"
              />
            </div>
          </div>
          <div className={'px-[8px]'}>
            <div className="mt-2.5 font-semibold text-zinc-500 text-center ">
              <span className=" pe-2 text-foreground">ملح</span>
              100 gm
            </div>
            <div className="mt-0 font-semibold text-main text-center">
              SR 53
            </div>
            {count == 0 ? (
              <Button className="w-full mt-3 " onClick={incrementCount}>
                اضف
              </Button>
            ) : (
              <div className="flex gap-2 mt-3 w-full font-bold whitespace-nowrap max-w-[100%] text-zinc-800 justify-between">
                <div className="object-contain shrink-0 w-10 aspect-square">
                  <div className="flex flex-col max-w-[40px]">
                    <div
                      onClick={incrementCount}
                      className="flex flex-col justify-center items-center px-2 w-full h-10 bg-white rounded-full border border-gray-200 border-solid shadow-[0px_1px_11px_rgba(0,0,0,0.08)] cursor-pointer"
                    >
                      <PlusIcon />
                    </div>
                  </div>
                </div>

                <div className="px-[2rem] py-2 bg-white rounded border border-gray-200 border-solid font-bold">
                  {count}
                </div>
                <div className="object-contain shrink-0 w-10 aspect-square">
                  <div className="flex flex-col max-w-[40px]">
                    <div
                      onClick={decrementCount}
                      className="flex flex-col justify-center items-center px-2 w-full h-10 bg-white rounded-full border border-gray-200 border-solid shadow-[0px_1px_11px_rgba(0,0,0,0.08)] cursor-pointer"
                    >
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/9f75f8b435640cf25cc736c9ca514398a5ba566bf2f87b10c5beddfe8343173d?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                        className="object-contain aspect-[0.92] w-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
