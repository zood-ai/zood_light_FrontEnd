import React, { useCallback, useEffect, useState } from 'react';

import { ShopCardSummeryProps } from './ShopCardSummery.types';

import './ShopCardSummery.css';
import IconInput from '../InputWithIcon';
import { Button } from '../button';
import PlusIcon from '@/components/Icons/PlusIcon';
import { useDispatch, useSelector } from 'react-redux';
import createCrudService from '@/api/services/crudService';
import {
  addPayment,
  updateField,
  updatePayment,
  addTax,
} from '@/store/slices/orderSchema';
import { useParams } from 'react-router-dom';
import { SelectComp } from '../SelectItem';
import axios from 'axios';
import axiosInstance from '@/api/interceptors';
import { paymentmethod } from '@/constant/constant';

export const ShopCardSummery: React.FC<ShopCardSummeryProps> = () => {
  const [totalShopCardCount, setTotalShopCardCount] = useState(0);

  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const [paymentMethod, setPaymentMethod] = useState<any>([
    {
      tendered: 180,
      amount: 0,
      tips: 0,
      notadd: true,
      meta: {
        external_additional_payment_info: 'some info',
      },
      payment_method_id: '',
    },
  ]);
  const orderSchema = useSelector((state: any) => state.orderSchema);
  let params = useParams();
  useEffect(() => {
    if (params.id) {
      // alert(params.id)
      setPaymentMethod(orderSchema?.payments || []);
    }
  }, [orderSchema.payments]);

  const handleOptionClick = (option) => {
    setPaymentMethod(option); // Set the clicked option as active
  };
  let dispatch = useDispatch();
  const totalCost = cardItemValue.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const { data: Taxes } = createCrudService<any>('manage/taxes').useGetAll();
  const mainTax = Taxes?.data[0];
  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: paymentMethods } = createCrudService<any>(
    'manage/payment_methods?filter[is_active]=1'
  ).useGetAll();
  const [discountAmount, setdiscountAmount] = useState(0);
  const { data: branchData } =
    createCrudService<any>('manage/branches').useGetAll();

  const handleItemChange = (index: number, field: string, value: string) => {
    setPaymentMethod((prevItems) => {
      const updatedItems = [...prevItems];
      const updatedItem = { ...updatedItems[index], [field]: value };
      updatedItems[index] = updatedItem;
      return updatedItems;
    });
  };
  const [subTotal, setSubTotal] = useState(0);

  const [totalAmountIncludeAndExclude, setTotalAmountIncludeAndExclude] =
    useState(0);
  const [taxAmount, setTaxAmount] = useState((subTotal * 15) / 100);

  useEffect(() => {
    setTaxAmount((subTotal * 15) / 100);
  }, [subTotal, discountAmount]);

  useEffect(() => {
    // if(!paymentMethod)return;
    const holder = [...paymentMethod];
    holder.pop();
    if (!params.id) dispatch(addPayment(holder));
    dispatch(
      updateField({
        field: 'subtotal_price',
        value: subTotal,
      })
    );
    dispatch(
      updateField({
        field: 'total_price',
        value: totalAmountIncludeAndExclude,
      })
    );
    dispatch(
      updateField({
        field: 'tax_exclusive_discount_amount',
        value: taxAmount,
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
        value: discountAmount,
      })
    );
    dispatch(
      updateField({
        field: 'customer_notes',
        value: discountAmount,
      })
    );
  }, [paymentMethod, taxAmount, discountAmount, totalAmountIncludeAndExclude]);
  const [paymentMethodinit, setPaymentMethodinit] = useState([]);

  useEffect(() => {
    if (params.id) {
      axiosInstance.get(`orders/${params.id}`).then((res) => {
        setPaymentMethod(res?.data?.data?.payments || []);
        setPaymentMethodinit(res?.data?.data?.payments || []);
        setdiscountAmount(res?.data?.data?.customer_notes || 0);
      });
      // setdiscountAmount(orderSchema?.customer_notes || 0);
    }
  }, []);


  const [totalAmount, setTotalAmount] = useState(
    params.id
      ? paymentMethod?.reduce((accumulator, current, i) => {
          return accumulator + parseFloat(current.amount || 0);
        }, 0)
      : 1
  );

  useEffect(() => {
    let allSum = 0;
    let someSum = 0;
    paymentMethod.forEach((e) => {
      allSum += parseFloat(e.amount || 0);
    });
    paymentMethod.forEach((e) => {
      if (e?.notadd) someSum += 0;
      else someSum += parseFloat(e.amount || 0);
    });
    setTotalAmount(params.id ? allSum : someSum);
  }, [params.id, paymentMethod, paymentMethod.length]);

  // const [SubTotalAfterDiscount, setSubTotalAfterDiscount] = useState(0);

  const handleIncludeAndExclude = useCallback(() => {
    let finalDiscount = 0;
    let SubTotalAfterDiscount = 0;
    if (settings?.data?.tax_inclusive_pricing === 1) {
      // const totalCostWithTax = totalCost - taxAmount;
      finalDiscount = discountAmount / (1 + mainTax?.rate / 100);
      SubTotalAfterDiscount = subTotal - finalDiscount;
    } else {
      finalDiscount = discountAmount;
      SubTotalAfterDiscount = subTotal - finalDiscount;
    }
    const Drepa = SubTotalAfterDiscount * (mainTax?.rate / 100);
    setTaxAmount(Drepa);
    setTotalAmountIncludeAndExclude(SubTotalAfterDiscount + Drepa);
  }, [subTotal, cardItemValue, discountAmount, mainTax]);

  useEffect(() => {
    if (settings?.data?.tax_inclusive_pricing === 1) {
      const holder = totalCost / (1 + mainTax?.rate / 100);
      setSubTotal(holder);
    } else {
      setSubTotal(totalCost);
    }
    handleIncludeAndExclude();
  }, [discountAmount, taxAmount, orderSchema, mainTax]);
  return (
    <>
      <div className="flex mt-5 flex-col   rounded-none min-w-[302px]  ">
        <div className="flex flex-col pt-6 pb-12 w-full bg-white rounded border border-solid border-zinc-300 max-md:max-w-full">
          <div className="flex flex-col items-start px-3 w-full max-md:max-w-full">
            <div className="self-stretch max-md:mr-2.5 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col ">
                <div className="flex flex-col ml-5 w-[55%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col self-stretch my-auto text-sm font-medium text-start text-zinc-500 max-md:mt-10">
                    <div className="flex flex-col items-start pl-8 max-md:pl-5">
                      <div>المجموع الفرعي</div>
                      <div className="mt-7">خصم</div>
                    </div>
                    <div className="mt-7">
                      ضريبة القيمة المضافة {mainTax?.rate}%
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-[45%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col w-full text-sm font-medium text-right whitespace-nowrap max-md:mt-10">
                    <div className="flex gap-5 justify-between px-3 py-2 bg-white rounded border border-solid border-zinc-300">
                      <div className="text-zinc-800">
                        {Math.floor(subTotal * 100) / 100}
                      </div>
                      <div className="self-start text-zinc-500">SR</div>
                    </div>
                    <IconInput
                      className="flex-grow mt-4"
                      // <IconInput
                      placeholder="0.00"
                      onChange={(value) =>
                        setdiscountAmount(
                          Math.min(value.target.value, totalCost)
                        )
                      }
                      inputClassName={'w-full flex-grow '}
                      // label="ضريبة القيمة المضافة"
                      iconSrcLeft={'SR'}
                      value={Number(
                        params.id ? orderSchema?.customer_notes : discountAmount
                      )}
                      disabled={params.id}
                    />
                    {/* </IconInput> */}
                    <div className="flex gap-5 justify-between items-start px-3 py-2 mt-4 bg-white rounded border border-solid border-zinc-300">
                      <div className="text-zinc-800">
                        {Math.floor(taxAmount * 100) / 100}
                      </div>
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

            <div className=" flex gap-5 justify-between self-stretch mt-3 px-2 w-full text-sm text-right text-zinc-800 max-md:max-w-full">
              <div className="font-medium">المبلغ الإجمالي</div>
              <div className="font-bold">
                SR {Math.floor(totalAmountIncludeAndExclude * 100) / 100}
              </div>
            </div>
            {/* <div className="mt-6 text-sm font-bold text-right text-black max-md:mr-2.5">
              طريقة الدفع
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3 text-sm text-right text-zinc-500 max-md:mr-2.5">
              {paymentMethods?.data?.map((option, index2) => (
                <button
                  key={index2}
                  onClick={() => {
                    // handleItemChange(index2, 'payment_method_id', option.id);
                    setCurrentPayment({
                      id: option.id,
                      name: option.name,
                      amount: option.amount,
                      tendered: 180,
                      tips: 0,
                      meta: {
                        external_additional_payment_info: 'some info',
                      },
                      payment_method_id: option.id,
                    });
                    // setPaymentMethod(() => {
                    //   return paymentMethod.map((item, i) => {
                    //     if (i === index1) {
                    //       return {
                    //         id: option.id,
                    //         name: option.name,
                    //         amount: option.amount,
                    //         tendered: 180,
                    //         tips: 0,
                    //         meta: {
                    //           external_additional_payment_info: 'some info',
                    //         },
                    //         payment_method_id: option.id,
                    //       };
                    //     }
                    //     return item;
                    //   });
                    // });
                  }}
                  className={`h-[40px] w-[93px] whitespace-nowrap min-w-fit  px-md  flex items-center justify-center rounded border border-gray-200 border-solid cursor-pointe flex-grow ${
                    currentPayment.payment_method_id === option.id
                      ? 'bg-main text-white font-extrabold'
                      : 'bg-white'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div> */}
            {/* {paymentMethod?.map((option1, index1) => ( */}
            <>
              <div className="mt-6 text-sm font-bold text-right text-black max-md:mr-2.5">
                طريقة الدفع
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3 text-sm text-right text-zinc-500 max-md:mr-2.5">
                {paymentMethods?.data?.map((option, index2) => (
                  <button
                    disabled={params.id ? true : false}
                    key={index2}
                    onClick={() => {
                      if (params.id) return;
                      handleItemChange(index2, 'payment_method_id', option.id);
                      setPaymentMethod(() => {
                        return paymentMethod.map((item, i) => {
                          if (i === paymentMethod.length - 1) {
                            return {
                              id: option.id,
                              name: option.name,
                              amount: option.amount,
                              tendered: 180,
                              tips: 0,
                              notadd: true,
                              meta: {
                                external_additional_payment_info: 'some info',
                              },
                              payment_method_id: option.id,
                            };
                          }
                          return item;
                        });
                      });
                    }}
                    className={`h-[40px] w-[93px] whitespace-nowrap min-w-fit  px-md  flex items-center justify-center rounded border border-gray-200 border-solid cursor-pointe flex-grow ${
                      params.id ? 'opacity-50' : ''
                    } ${
                      paymentMethod[paymentMethod.length - 1]
                        ?.payment_method_id === option.id
                        ? 'bg-main text-white font-extrabold'
                        : 'bg-white'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>

              <div className="flex  my-md items-center  gap-x-2  ">
                <IconInput
                  type="number"
                  onChange={(e) => {
                    handleItemChange(
                      paymentMethod.length - 1,
                      'amount',
                      e.target.value
                    );
                  }}
                  value={
                    !params.id
                      ? Number(
                          paymentMethod[paymentMethod.length - 1]?.amount
                        ) || 'NaN'
                      : 'NaN'
                  }
                  placeholder="0.00"
                  min={0}
                  label="المبلغ"
                  width="150px"
                  disabled={
                    params.id && paymentMethodinit[paymentMethod.length - 1]
                  }
                />
              </div>
            </>
            {/* ))} */}

            {paymentMethod?.map((option1, index1) => {
              if (index1 === paymentMethod?.length - 1 && !params.id) return;
              return (
                <div className="flex gap-3 items-center" key={index1}>
                  <p>{option1?.amount}</p>
                  <p>{option1?.name || option1?.payment_method?.name}</p>
                  {paymentMethod?.length > 1 && !params?.id && (
                    <>
                      <div
                        onClick={() => {
                          const newItems = [...paymentMethod];
                          newItems.splice(index1, 1);
                          setPaymentMethod(newItems);
                        }}
                        className="cursor-pointer hover:scale-105 flex items-center"
                      >
                        <svg
                          width="18"
                          height="18"
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
                  {paymentMethod.length > 1 &&
                    params?.id &&
                    !paymentMethodinit[index1] && (
                      <>
                        <div
                          onClick={() => {
                            const newItems = [...paymentMethod];
                            newItems.splice(index1, 1);
                            setPaymentMethod(newItems);
                          }}
                          className="cursor-pointer hover:scale-105 flex items-center"
                        >
                          <svg
                            width="18"
                            height="18"
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
              );
            })}

            {!params.id && (
              <div className="flex">
                <Button
                  onClick={() => {
                    if (
                      !paymentMethod[paymentMethod.length - 1].payment_method_id
                    )
                      return;
                    if (!paymentMethod[paymentMethod.length - 1].amount) return;
                    setPaymentMethod(() => {
                      const holder = paymentMethod.map((el) => ({
                        ...el,
                        notadd: false,
                      }));
                      return [
                        ...holder,
                        {
                          amount: 0,
                          payment_method_id: '',
                          tendered: 180,
                          tips: 0,
                          notadd: true,
                          meta: {
                            external_additional_payment_info: 'some info',
                          },
                        },
                      ];
                    });
                  }}
                  variant="link"
                  className="mb-5  text-xl"
                >
                  <PlusIcon /> اضف
                </Button>
              </div>
            )}
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
            {totalAmountIncludeAndExclude - totalAmount}
          </div>
        </div>
      </div>
    </>
  );
};
