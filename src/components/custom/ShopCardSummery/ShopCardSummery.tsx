import React, { useState } from 'react';

import { ShopCardSummeryProps } from './ShopCardSummery.types';

import './ShopCardSummery.css';
import IconInput from '../InputWithIcon';
import { Button } from '../button';
import PlusIcon from '@/components/Icons/PlusIcon';

export const ShopCardSummery: React.FC<ShopCardSummeryProps> = () => {
 
  const [totalShopCardCount, setTotalShopCardCount] = useState(0);
  const [activeOption, setActiveOption] = useState('كاش'); // State to track the active option

  const handleOptionClick = (option) => {
    setActiveOption(option); // Set the clicked option as active
  };
  return (
    <>
      <div className="flex  flex-col rounded-none  md:w-[502px] md:translate-x-[100px]">
        <div className="flex flex-col pt-6 pb-12 w-full bg-white rounded border border-solid border-zinc-300 max-md:max-w-full">
          <div className="flex flex-col items-start px-3 w-full max-md:max-w-full">
            <div className="self-stretch max-md:mr-2.5 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col ">
                <div className="flex flex-col ml-5 w-[55%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col self-stretch my-auto text-sm font-medium text-start text-zinc-500 max-md:mt-10">
                    <div className="flex flex-col items-start pl-8 max-md:pl-5">
                      <div>المجموع الفرعي</div>
                      <div className="mt-7">تخفيض</div>
                    </div>
                    <div className="mt-7">٪ضريبة القيمة المضافة 15</div>
                  </div>
                </div>
                <div className="flex flex-col w-[45%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col w-full text-sm font-medium text-right whitespace-nowrap max-md:mt-10">
                    <div className="flex gap-5 justify-between px-3 py-2 bg-white rounded border border-solid border-zinc-300">
                      <div className="text-zinc-800">999.00</div>
                      <div className="self-start text-zinc-500">SR</div>
                    </div>
                    <div className="flex gap-5 justify-between items-start px-3 py-2 mt-4 bg-white rounded border border-solid border-zinc-300">
                      <div className="text-zinc-800">0.00</div>
                      <div className="text-zinc-500">SR</div>
                    </div>
                    <div className="flex gap-5 justify-between items-start px-3 py-2 mt-4 bg-white rounded border border-solid border-zinc-300">
                      <div className="text-zinc-800">150</div>
                      <div className="text-zinc-500">SR</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <hr
              style={{
                width: '100%',
                textAlign: 'center',
                marginLeft: 0,
                borderColor: '#D2D2D2',
                margin: '0 auto',
              }}
            />

            <div className=" flex gap-5 justify-between self-stretch mt-3 ml-4 w-full text-sm text-right max-w-[458px] text-zinc-800 max-md:mr-2.5 max-md:max-w-full">
              <div className="font-medium">المبلغ الإجمالي</div>
              <div className="font-bold">SR 1148.85</div>
            </div>
            <div className="mt-6 text-sm font-bold text-right text-black max-md:mr-2.5">
              طريقة الدفع
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 mt-3 text-sm text-right text-zinc-500 max-md:mr-2.5">
              {['انستا باي', 'ماستر كارد', 'فيزا', 'كاش'].map(
                (option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`h-[40px] w-[93px] flex items-center justify-center rounded border border-gray-200 border-solid cursor-pointer ${
                      activeOption === option
                        ? 'bg-main text-white font-extrabold'
                        : 'bg-white'
                    }`}
                  >
                    {option}
                  </div>
                )
              )}
            </div>
            <div className="flex mb-xl  items-center pt-lg">
              <IconInput placeholder="0.00" label="الكمية" width="150px" />
              <Button variant="link" className="pt-xl text-xl">
                <PlusIcon /> اضف
              </Button>
            </div>
          </div>
          <hr
            style={{
              width: '95%',
              textAlign: 'center',
              marginLeft: 0,
              borderColor: '#D2D2D2',
              margin: '0 auto',
            }}
          />
          <div className="self-start ms-md mt-3 text-sm font-medium text-right text-zinc-500 max-md:mr-2.5">
            المبلغ المتبقي
          </div>
          <div className="self-start ms-md mt-3 text-sm font-medium text-right text-zinc-500 max-md:mr-2.5">
            0.00
          </div>
        </div>
      </div>
    </>
  );
};
