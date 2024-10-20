import React from 'react';

import { PurchaseInvoicesAddProps } from './PurchaseInvoicesAdd.types';
import personIcon from '/icons/name person.svg';
import callIcon from '/icons/call.svg';
import './PurchaseInvoicesAdd.css';
import { useTranslation } from 'react-i18next';
import { CardItem } from '@/components/CardItem';
import { BackBtn } from '@/components/custom/BackBtn';
import { QRCodeComp } from '@/components/custom/QRCodeComp';
import IconInput from '@/components/custom/InputWithIcon';
import { SelectComp } from '@/components/custom/SelectItem';
import useDirection from '@/hooks/useDirection';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { Button } from '@/components/custom/button';
import PlusIcon from '@/components/Icons/PlusIcon';

export const PurchaseInvoicesAdd: React.FC<PurchaseInvoicesAddProps> = () => {
  const { i18n, t } = useTranslation();
  const isRtl = useDirection();
  return (
    <>
      <DetailsHeadWithOutFilter />
      <div className="flex flex-col items-start ">
        <div className="grid grid-cols-1  gap-lg mt-lg ">
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-10 ">
            <div className="">
              <SelectComp
                placeholder={'اضافة مورد جديد'}
                options={[]}
                onValueChange={function (value: string): void {}}
                label={'اضافة مورد جديد'}
              />
            </div>
            <div className="pt-[30px] translate-x-10">
              <Button variant={'link'} className="">
                <div className="flex gap-2">
                  <span>
                    <PlusIcon />
                  </span>
                  <span className="font-semibold">اضافة مورد جديد</span>
                </div>
              </Button>
            </div>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-10 ">
            <IconInput
              label="الرقم المرجعي للفاتورة أو رقم الفاتورة"
              // placeholder="ادخل اسم المورد"
              // iconSrc={callIcon}
            />
            <div className="pt-[30px] translate-x-10">
              <Button variant={'linkHover'} className="">
                <div className="flex gap-2">
                  <span>{/* <PlusIcon /> */}</span>
                  <span className="font-semibold">انشاء رقم</span>
                </div>
              </Button>
            </div>
          </div>
          <Textarea
            className={'max-w-[490px]'}
            label="وصف المشتريات"
            placeholder="ادخل وصف المشتريات"
          />
          <div className="flex gap-md bg">
            <SelectComp
              placeholder="فرز حسب التصنيف"
              options={[]}
              onValueChange={function (value: string): void {}}
              label="فرز حسب التصنيف"
            />
            <IconInput
              label="الكمية "
              // placeholder="ادخل اسم المورد"
              // iconSrc={personIcon}
              width="150px"
            />
            <IconInput
              width="150px"
              label=" السعر"
              // placeholder="ادخل اسم المورد"
              // iconSrc={personIcon}
            />
          </div>
          <Textarea  label="وصف المشتريات" placeholder="ادخل وصف المشتريات" />
          <IconInput
            label="قيمة الضريبة "
            // placeholder="ادخل اسم المورد"
            // iconSrc={personIcon}
            width="150px"
          />
          <div className="flex items-center text-sm font-semibold text-right md:translate-x-3">
            <Button variant={'link'} className="">
              <div className="flex gap-2">
                <span>
                  <PlusIcon />
                </span>
                <span className="font-semibold">اضافة صنف جديد</span>
              </div>
            </Button>
          </div>
          <div className="mt-[22px] w-[327px]">
            <SelectComp
              placeholder="اضافة صنف جديد"
              options={[]}
              onValueChange={function (value: string): void {}}
              label="اضافة صنف جديد"
            />
          </div>
          <div className="flex flex-col text-right rounded-none max-w-[499px] text-zinc-800">
            <div className="flex w-full bg-gray-200 rounded min-h-[1px] " />
            <div className="flex flex-col pl-5 mt-2.5 w-full ">
              <div className="flex gap-10  bgself-start font-extrabold justify-between ">
                <div className="text-sm">الإجمالي</div>
                <div className="text-base">SR 500.00</div>
              </div>
              <div className="mt-[22px] w-[327px]">
                <SelectComp
                  placeholder=" أختر طريقة الدفع "
                  options={[]}
                  onValueChange={function (value: string): void {}}
                  label="  أختر طريقة الدفع"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center ">
          <Button className="px-6 py-1.5 mt-8 text-sm font-semibold rounded min-h-[39px]">
            اضافة المورد
          </Button>
        </div>
      </div>
    </>
  );
};
