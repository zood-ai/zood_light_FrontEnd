import React, { useCallback, useEffect, useState } from 'react';

import { ShopCardSummeryProps } from './ShopCardSummery.types';

import './ShopCardSummery.css';
import IconInput from '../InputWithIcon';
import { useDispatch, useSelector } from 'react-redux';
import createCrudService from '@/api/services/crudService';
import { addTax, updateField } from '@/store/slices/orderSchema';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/api/interceptors';
import Cookies from 'js-cookie';

const ShopCardSummeryPQ: React.FC<ShopCardSummeryProps> = () => {
  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: getTaxes } = createCrudService<any>('manage/taxes').useGetAll();
  const mainTax = getTaxes?.data[0];
  const dispatch = useDispatch();
  const { id: orderId } = useParams();
  const orderSchema = useSelector((state: any) => state.orderSchema);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [totalAmountIncludeAndExclude, setTotalAmountIncludeAndExclude] =
    useState(0);

  const totalCost = orderSchema.products.reduce(
    (acc, item) => acc + item.unit_price * item.quantity,
    0
  );
  const [taxAmount, setTaxAmount] = useState((subTotal * 15) / 100);

  useEffect(() => {
    dispatch(updateField({ field: 'subtotal_price', value: subTotal }));
    dispatch(
      updateField({ field: 'total_price', value: totalAmountIncludeAndExclude })
    );
    dispatch(
      updateField({
        field: 'tax_exclusive_discount_amount',
        value: taxAmount,
      })
    );
    dispatch(updateField({ field: 'discount_amount', value: discountAmount }));
    dispatch(
      addTax([
        {
          id: getTaxes?.data?.[0]?.id,
          name: getTaxes?.data?.[0]?.name,
          amount: taxAmount,
        },
      ])
    );
    dispatch(
      updateField({
        field: 'branch_id',
        value: Cookies.get('branch_id') || '',
      })
    );
    dispatch(
      updateField({
        field: 'discount_amount',
        value: discountAmount,
      })
    );
    dispatch(updateField({ field: 'customer_notes', value: discountAmount }));
  }, [
    dispatch,
    subTotal,
    totalCost,
    taxAmount,
    discountAmount,
    getTaxes?.data,
    totalAmountIncludeAndExclude,
  ]);

  useEffect(() => {
    if (orderId) {
      axiosInstance.get(`orders/${orderId}`).then((res) => {
        setDiscountAmount(res?.data?.data?.discount_amount || 0);
      });
    }
  }, [orderId]);

  const handleIncludeAndExclude = useCallback(() => {
    // const isTaxInclusive = settings?.data?.tax_inclusive_pricing !== 0;
    // const finalDiscount = discountAmount || taxAmount;
    // const calculatedAmount = isTaxInclusive
    //   ? totalCost - finalDiscount
    //   : totalCost + (taxAmount - discountAmount);

    // setTotalAmountIncludeAndExclude(calculatedAmount);
    // setSubTotal(isTaxInclusive ? totalCost - taxAmount : totalCost);

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
  }, [settings, subTotal, mainTax?.rate, discountAmount]);
  useEffect(() => {
    setTaxAmount((subTotal * 15) / 100);
  }, [subTotal, discountAmount]);
  useEffect(() => {
    if (settings?.data?.tax_inclusive_pricing === 1) {
      const holder = totalCost / (1 + mainTax?.rate / 100);
      setSubTotal(holder);
    } else {
      setSubTotal(totalCost);
    }
    handleIncludeAndExclude();
  }, [
    totalCost,
    settings?.data?.tax_inclusive_pricing,
    discountAmount,
    taxAmount,
    orderSchema,
    mainTax,
    handleIncludeAndExclude,
  ]);

  return (
    <>
      <div className="flex flex-grow flex-col   rounded-none  w-full xl:w-1/2  ">
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
                        {Math.floor(subTotal * 100) / 100 || 0}
                      </div>
                      <div className="self-start text-zinc-500">SR</div>
                    </div>
                    <IconInput
                      className="mt-4"
                      // <IconInput
                      placeholder="0.00"
                      onChange={(value) =>
                        setDiscountAmount(
                          Math.min(value.target.value, totalCost)
                        )
                      }
                      inputClassName={'w-full   '}
                      // label="ضريبة القيمة المضافة"
                      iconSrcLeft={'SR'}
                      value={
                        orderId
                          ? orderSchema?.discount_amount
                          : discountAmount || 0
                      }
                      disabled={orderId}
                    />
                    {/* </IconInput> */}
                    <div className="flex gap-5 justify-between items-start px-3 py-2 mt-4 bg-white rounded border border-solid border-zinc-300">
                      <div className="text-zinc-800">
                        {Math.floor(taxAmount * 100) / 100 || 0}
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

            <div className="flex-grow flex justify-between self-stretch mt-3 max-md:pl-4 pl-2 w-full text-sm text-right  text-zinc-800 max-md:mr-2.5 max-md:max-w-full">
              <div className="font-medium">المبلغ الإجمالي</div>
              <div className="font-bold">
                SR {Math.floor(totalAmountIncludeAndExclude * 100) / 100 || 0}
              </div>
            </div>
          </div>
          <hr
            style={{
              width: '95%',
              textAlign: 'center',
              marginLeft: 0,
              borderColor: '#D2D2D2',
              margin: '16px auto',
            }}
          />
          <div className="self-start ms-md mt-3 text-sm font-medium text-right text-zinc-500 max-md:mr-2.5">
            المبلغ المتبقي
          </div>
          <div className="self-start ms-md mt-3 text-sm font-medium text-right text-zinc-500 max-md:mr-2.5">
            SR {totalAmountIncludeAndExclude || 0}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopCardSummeryPQ;
