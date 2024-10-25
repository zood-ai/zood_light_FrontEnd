import React, { useEffect, useState } from 'react';

import { ShopCardSummeryProps } from './ShopCardSummery.types';

import './ShopCardSummery.css';
import IconInput from '../InputWithIcon';
import { Button } from '../button';
import PlusIcon from '@/components/Icons/PlusIcon';
import { useDispatch, useSelector } from 'react-redux';
import createCrudService from '@/api/services/crudService';
import { addPayment, updateField } from '@/store/slices/orderSchema';

export const ShopCardSummery: React.FC<ShopCardSummeryProps> = () => {
  const [totalShopCardCount, setTotalShopCardCount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<any>([
    {
      amount: 0,
      payment_method_id: '',
    },
  ]); // State to track the active option

  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const orderSchema = useSelector((state: any) => state.orderSchema);
  const handleOptionClick = (option) => {
    setPaymentMethod(option); // Set the clicked option as active
  };
  let dispatch = useDispatch();
  const totalCost = cardItemValue.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const allService = createCrudService<any>('manage/taxes');
  const { data: branchData } =
    createCrudService<any>('manage/branches').useGetAll();
  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();
  const taxAmount = allData?.data?.[0]?.rate;
  const { data: paymentMethods } = createCrudService<any>(
    'manage/payment_methods'
  ).useGetAll();
  const handleItemChange = (index: number, field: string, value: string) => {
    setPaymentMethod((prevItems) => {
      const updatedItems = [...prevItems];
      const updatedItem = { ...updatedItems[index], [field]: value };
      updatedItems[index] = updatedItem;
      return updatedItems;
    });
  };

  useEffect(() => {
    dispatch(addPayment(paymentMethod));
    dispatch(
      updateField({
        field: 'subtotal_price',
        value: totalCost,
      })
    );
    dispatch(
      updateField({
        field: 'total_price',
        value: totalCost - taxAmount,
      })
    );
   
    dispatch(
      updateField({
        field: 'branch_id',
        value: branchData?.data?.[0]?.id,
      })
    );
    dispatch(
      updateField({
        field: 'discount_amount',
        value: taxAmount,
      })
    );
  }, [paymentMethod]);
  console.log(orderSchema);
  const totalAmount = paymentMethod.reduce((accumulator, current) => {
    return accumulator + parseFloat(current.amount);
  }, 0);
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
                    <div className="mt-7">ضريبة القيمة المضافة {'15%'}</div>
                  </div>
                </div>
                <div className="flex flex-col w-[45%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col w-full text-sm font-medium text-right whitespace-nowrap max-md:mt-10">
                    <div className="flex gap-5 justify-between px-3 py-2 bg-white rounded border border-solid border-zinc-300">
                      <div className="text-zinc-800">{totalCost}</div>
                      <div className="self-start text-zinc-500">SR</div>
                    </div>
                    <div className="flex gap-5 justify-between items-start px-3 py-2 mt-4 bg-white rounded border border-solid border-zinc-300">
                      <div className="text-zinc-800">0.00</div>
                      <div className="text-zinc-500">SR</div>
                    </div>
                    <div className="flex gap-5 justify-between items-start px-3 py-2 mt-4 bg-white rounded border border-solid border-zinc-300">
                      <div className="text-zinc-800">{taxAmount}</div>
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
              <div className="font-bold">SR {totalCost - taxAmount}</div>
            </div>
            {paymentMethod?.map((option, index) => (
              <>
                <>
                  <div className="mt-6 text-sm font-bold text-right text-black max-md:mr-2.5">
                    طريقة الدفع
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 mt-3 text-sm text-right text-zinc-500 max-md:mr-2.5">
                    {paymentMethods?.data?.map((option, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemChange(
                            index,
                            'payment_method_id',
                            option.id
                          );
                        }}
                        className={`h-[40px] w-[93px] flex items-center justify-center rounded border border-gray-200 border-solid cursor-pointer ${
                          paymentMethod[index].payment_method_id == option.id
                            ? 'bg-main text-white font-extrabold'
                            : 'bg-white'
                        }`}
                      >
                        {option.name}
                      </div>
                    ))}
                  </div>
                  <div className="flex mb-xl  items-center pt-lg">
                    <IconInput
                      type="number"
                      onChange={(e) =>
                        handleItemChange(index, 'amount', e.target.value)
                      }
                      value={Number(paymentMethod[index].amount)}
                      placeholder="0.00"
                      label="الكمية"
                      width="150px"
                    />
                    <Button
                      onClick={() => {
                        setPaymentMethod(() => {
                          return [
                            ...paymentMethod,
                            {
                              amount: 0,
                              payment_method_id: '',
                            },
                          ];
                        });
                      }}
                      variant="link"
                      className="pt-xl text-xl"
                    >
                      <PlusIcon /> اضف
                    </Button>
                    {paymentMethod.length > 1 && (
                      <>
                        <div
                          onClick={() => {
                            const newItems = [...paymentMethod];
                            newItems.splice(index, 1);
                            setPaymentMethod(newItems);
                          }}
                          className="translate-y-[18px]   cursor-pointer hover:scale-105"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.2792 2C15.1401 2 15.9044 2.55086 16.1766 3.36754L16.7208 5H20C20.5523 5 21 5.44772 21 6C21 6.55227 20.5523 6.99998 20 7L19.9975 7.07125L19.1301 19.2137C19.018 20.7837 17.7117 22 16.1378 22H7.86224C6.28832 22 4.982 20.7837 4.86986 19.2137L4.00254 7.07125C4.00083 7.04735 3.99998 7.02359 3.99996 7C3.44769 6.99998 3 6.55227 3 6C3 5.44772 3.44772 5 4 5H7.27924L7.82339 3.36754C8.09562 2.55086 8.8599 2 9.72076 2H14.2792ZM17.9975 7H6.00255L6.86478 19.0712C6.90216 19.5946 7.3376 20 7.86224 20H16.1378C16.6624 20 17.0978 19.5946 17.1352 19.0712L17.9975 7ZM10 10C10.5128 10 10.9355 10.386 10.9933 10.8834L11 11V16C11 16.5523 10.5523 17 10 17C9.48716 17 9.06449 16.614 9.00673 16.1166L9 16V11C9 10.4477 9.44771 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10ZM14.2792 4H9.72076L9.38743 5H14.6126L14.2792 4Z"
                              fill="#FC3030"
                            />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                </>
              </>
            ))}
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
            {totalCost - taxAmount - totalAmount}
          </div>
        </div>
      </div>
    </>
  );
};
