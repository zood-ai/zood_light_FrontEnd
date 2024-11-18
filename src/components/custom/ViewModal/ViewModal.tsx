import { useSelector } from 'react-redux';
import { useState, useRef } from 'react';
import { ViewModalProps } from './ViewModal.types';
import createCrudService from '@/api/services/crudService';
import { useReactToPrint } from 'react-to-print';
import './ViewModal.css';
import { useLocation } from 'react-router-dom';

export const ViewModal: React.FC<ViewModalProps> = () => {
  const data = useSelector((state: any) => state.toggleAction.data);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const { pathname } = useLocation();

  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: Taxes } = createCrudService<any>('manage/taxes').useGetAll();
  const { data: customerInfo } = createCrudService<any>(
    'manage/customers'
  ).useGetById(`${data?.customer?.id || data?.get_supplier?.id}`);
  const { data: supplierInfo } = createCrudService<any>(
    `inventory/suppliers`
  ).useGetById(`${data?.get_supplier?.id}`);
  const { data: OrderData } = createCrudService<any>('orders').useGetById(
    `${data?.id}`
  );
  const { data: purchsingInfo } = createCrudService<any>(
    'inventory/purchasing'
  ).useGetById(`${data?.id}`);

  const Data = OrderData ? { ...OrderData } : { ...purchsingInfo };
  console.log({
    data,
    settings,
    supplierInfo,
    customerInfo,
    Data,
    Taxes,
    purchsingInfo,
  });
  const [size, setSize] = useState('A4');
  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
  };
  const handlePrint = () => {
    reactToPrintFn();
  };
  return (
    <>
      <div className="flex flex-wrap gap-4 rounded-none h-[90vh] max-w-[80vw] overflow-y-scroll relative ">
        <div className="flex flex-col rounded-none">
          <div className="px-11 py-a12 w-full bg-white rounded-lg border border-gray-200 border-solid max-md:px-5 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div
                id="myDiv"
                ref={contentRef}
                className={`${"size === 'A4' ? 'a4-size' : 'small-receipt'"} print-content flex flex-col w-[74%] max-md:ml-0 max-md:w-full`}
              >
                {size === 'A4' ? (
                  <div className="flex flex-col px-3 pt-4 pb-2 mx-auto w-full text-sm bg-white rounded-lg border border-gray-200 border-solid text-zinc-800 max-md:mt-10 max-md:max-w-full">
                    <div className="w-full flex justify-between items-center mb-4">
                      <div>
                        <img src="/icons/logo.webp" alt="Logo" />
                        <p className="mt-4 w-[277px] leading-[30.18px]">
                          شركة حلول التطبيقات لتقنية المعلومات حي النخيل الرياض
                          المملكة العربية السعودية 0123, 31951
                        </p>
                      </div>
                      <img
                        src="/icons/ParCode.webp"
                        className="w-[100px] h-[100px]"
                        alt="ParCode"
                      />
                    </div>
                    <div className="self-center ml-4 font-semibold text-right">
                      فاتورة ضريبية{' '}
                      {pathname !== '/zood-dashboard/corporate-invoices' &&
                        'مبسطة'}
                    </div>
                    <div className="flex flex-wrap mt-4 text-right bg-white rounded border border-gray-200 border-solid max-md:mr-1 max-md:max-w-full">
                      {settings?.data?.business_tax_number && (
                        <div className="flex flex-col flex-1 px-5 pt-4 pb-2 bg-white rounded border border-gray-200 border-solid max-md:pl-5 justify-between">
                          <div className="self-center">الرقم الضريبي</div>
                          <div className="mt-4 text-center font-semibold">
                            {settings?.data?.business_tax_number || ''}
                          </div>
                        </div>
                      )}
                      {data?.business_date && (
                        <div className="flex z-10 flex-col flex-1 px-6 pt-4 pb-2 bg-white border border-gray-200 border-solid max-md:px-5 justify-between">
                          <div className="self-center">تاريخ الفاتورة</div>
                          <div className="flex gap-2 mt-4 font-semibold whitespace-nowrap justify-between">
                            {data?.business_date?.split(' ')[0] && (
                              <div className="grow text-center">
                                {data?.business_date?.split(' ')[0]}
                              </div>
                            )}
                            {data?.business_date
                              ?.split(' ')[1]
                              ?.slice(0, 5) && (
                              <div className="grow text-center">
                                {data?.business_date
                                  ?.split(' ')[1]
                                  ?.slice(0, 5)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {customerInfo?.data?.phone && (
                        <div className="flex z-10 flex-col flex-1 px-8 pt-4 pb-2 whitespace-nowrap bg-white border border-gray-200 border-solid max-md:px-5 justify-between">
                          <div className="self-center">الجوال</div>
                          <div className="self-start mt-4 w-full text-center font-semibold">
                            {customerInfo?.data?.phone}
                          </div>
                        </div>
                      )}
                      {supplierInfo?.data?.phone && (
                        <div className="flex z-10 flex-col flex-1 px-8 pt-4 pb-2 whitespace-nowrap bg-white border border-gray-200 border-solid max-md:px-5 justify-between">
                          <div className="self-center">الجوال</div>
                          <div className="self-start mt-4 w-full text-center font-semibold">
                            {supplierInfo?.data?.phone}
                          </div>
                        </div>
                      )}
                      {data?.customer?.name && (
                        <div className="flex z-10 flex-col flex-1 items-center px-8 pt-4 pb-2 bg-white border border-gray-200 border-solid max-md:px-5 justify-between">
                          <div>اسم العميل</div>
                          <div className="mt-4 font-semibold w-full text-center">
                            {data?.customer?.name || ''}
                          </div>
                        </div>
                      )}
                      {data?.get_supplier?.name && (
                        <div className="flex z-10 flex-col flex-1 items-center px-8 pt-4 pb-2 bg-white border border-gray-200 border-solid max-md:px-5 justify-between">
                          <div>اسم المورد</div>
                          <div className="mt-4 font-semibold w-full text-center">
                            {data?.get_supplier?.name || ''}
                          </div>
                        </div>
                      )}
                      {data?.reference && (
                        <div className="flex flex-col flex-1 items-center px-8 pt-4 pb-2 bg-white rounded-none border border-gray-200 border-solid max-md:px-5 justify-between">
                          <div>رقم الفاتورة</div>
                          <div className="mt-4 font-semibold w-full text-center">
                            {data?.reference || ''}
                          </div>
                        </div>
                      )}
                      {data?.kitchen_received_at && (
                        <div className="flex flex-col flex-1 items-center px-8 pt-4 pb-2 bg-white rounded-none border border-gray-200 border-solid max-md:px-5 justify-between">
                          <div>نوع السيارة</div>
                          <div className="mt-4 font-semibold w-full text-center">
                            {data?.kitchen_received_at || ''}
                          </div>
                        </div>
                      )}
                      {data?.kitchen_done_at && (
                        <div className="flex flex-col flex-1 items-center px-8 pt-4 pb-2 bg-white rounded-none border border-gray-200 border-solid max-md:px-5 justify-between">
                          <div>رقم اللوحة</div>
                          <div className="mt-4 font-semibold w-full text-center">
                            {data?.kitchen_done_at || ''}
                          </div>
                        </div>
                      )}
                      {data?.kitchen_notes && (
                        <div className="flex flex-col flex-1 items-center px-8 pt-4 pb-2 bg-white rounded-none border border-gray-200 border-solid max-md:px-5 justify-between">
                          <div>ملاحظات</div>
                          <div className="mt-4 font-semibold w-full text-center">
                            {data?.kitchen_notes || ''}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex z-10 flex-wrap gap-5 justify-between px-4 py-1.5 mt-4 w-full font-semibold text-right text-white rounded border border-gray-200 border-solid bg-zinc-500 max-md:mr-1 max-md:max-w-full">
                      <div className="flex w-full  text-center">
                        <div className="w-1/3">المجموع</div>
                        <div className="w-1/3">سعر الوحدة</div>
                        <div className="w-1/3">كمية</div>
                        <div className="w-1/3">اسم المنتج</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-5 justify-between py-5 mt-0  bg-white rounded border border-gray-200 border-solid w-[802px] max-w-full max-md:mr-1 text-center px-3">
                      {Data?.data?.products?.map((e) => (
                        <div className="flex font-semibold w-full">
                          <div className="w-1/3">{e?.pivot?.total_price}</div>
                          <div className="w-1/3">{e?.pivot?.unit_price}</div>
                          <div className="w-1/3">{e?.pivot?.quantity}</div>
                          <div className="w-1/3">
                            {e.sku === 'sku-zood-20001'
                              ? e.pivot.kitchen_notes
                              : e.name}
                          </div>
                        </div>
                      ))}
                      {Data?.data?.items?.map((e) => (
                        <div className="flex font-semibold w-full">
                          <div className="w-1/3">{e?.pivot?.total_cost}</div>
                          <div className="w-1/3">{e?.pivot?.cost}</div>
                          <div className="w-1/3">{e?.pivot?.quantity}</div>
                          <div className="w-1/3">
                            {e.sku === 'sku-zood-20001'
                              ? e.pivot.kitchen_notes
                              : e.name}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* CODING HERE */}
                    <div className="flex flex-col gap-3 mt-10">
                      {Data?.data?.subtotal_price && (
                        <div className="flex justify-between p-2 bg-[#F1F1F1] rounded items-center">
                          <div>SR {Data.data.subtotal_price}</div>
                          <div>الاجمالي</div>
                        </div>
                      )}
                      {Data?.data?.total_taxes && (
                        <div className="flex justify-between p-2 rounded items-center">
                          <div>SR {Data.data.total_taxes}</div>
                          <div>مجموع ضريبة القيمة المضافة</div>
                        </div>
                      )}
                      {Data?.data?.total_price && (
                        <div className="flex justify-between p-2 bg-[#F1F1F1] rounded items-center">
                          <div>SR {Data.data.total_price}</div>
                          <div>المبلغ الإجمالي</div>
                        </div>
                      )}
                      {Data?.data?.total_cost && (
                        <div className="flex justify-between p-2 bg-[#F1F1F1] rounded items-center">
                          <div>SR {Data.data.total_cost}</div>
                          <div>المبلغ الإجمالي</div>
                        </div>
                      )}
                      {Data?.data?.discount_amount && (
                        <div className="flex justify-between p-2 rounded items-center">
                          <div>SR {Data.data.discount_amount}</div>
                          <div>تخفيض</div>
                        </div>
                      )}
                      {Data?.data?.payments?.length > 0 && (
                        <div className="flex justify-between p-2 bg-[#F1F1F1] rounded items-center">
                          <div>
                            SR{' '}
                            {Data.data.payments.reduce(
                              (sum, item) => sum + item.amount,
                              0
                            )}
                          </div>
                          <div>المبلغ الإجمالي المدفوع</div>
                        </div>
                      )}
                      {Data?.data?.payments?.length > 0 &&
                        Data?.data?.total_price && (
                          <div className="flex justify-between p-2 rounded items-center">
                            <div>
                              SR{' '}
                              {(Data.data.payments.reduce(
                                (sum, item) => sum + item.amount,
                                0
                              ) > Data.data.total_price
                                ? Data.data.payments.reduce(
                                    (sum, item) => sum + item.amount,
                                    0
                                  ) - Data.data.total_price
                                : 0) || 0}
                            </div>
                            <div>إجمالي المبلغ المستحق</div>
                          </div>
                        )}
                    </div>

                    {/* CODE DELETED HERE */}
                    <div className="flex justify-between items-center">
                      <p className="text-sm w-[50%] mt-[30px] text-[#26262F]">
                        الشروط والاحكام
                      </p>
                      <div className="justify-items-end">
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f427b12df7330067f0a9d705f3491cda199d05af240961b0cade6a24ca16fbb?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                          className="object-contain mt-4 w-full aspect-[1000] max-md:max-w-full"
                        />
                        <img
                          loading="lazy"
                          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                          className="object-contain self-center mt-2 aspect-[1.74] w-[99px]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col w-[390px]  mx-auto text-right border border-gray-300 text-sm p-1 px-10">
                    {/* الشعار */}
                    <div className="text-center mb-4">
                      <img
                        src="/icons/logo.webp"
                        alt="Logo"
                        className="mx-auto"
                      />
                    </div>

                    {/* معلومات الشركة */}
                    <div className="text-center text-sm leading-6 mb-4">
                      <p>
                        شركة حلول التطبيقات لتقنية المعلومات
                        <br />
                        حي النخيل الرياض، المملكة العربية السعودية
                        <br />
                        0123, 31951
                      </p>
                    </div>

                    {/* عنوان الفاتورة */}
                    <div className="text-center font-semibold text-lg my-6">
                      فاتورة ضريبية مبسطة
                    </div>

                    {/* معلومات الفاتورة */}
                    <div className="flex flex-col gap-3 mb-2">
                      {data?.reference && (
                        <div className="flex justify-between">
                          <p>رقم الفاتورة </p>
                          <p>{data.reference}</p>
                        </div>
                      )}
                      {data?.business_date?.split(' ')[0] && (
                        <div className="flex justify-between">
                          <p>تاريخ الفاتورة </p>
                          <p>{data.business_date.split(' ')[0]}</p>
                        </div>
                      )}
                      {settings?.data?.business_tax_number && (
                        <div className="flex justify-between">
                          <p>الرقم الضريبي </p>
                          <p>{settings.data.business_tax_number}</p>
                        </div>
                      )}
                      {data?.customer?.name && (
                        <div className="flex justify-between">
                          <p>اسم العميل </p>
                          <p>{data.customer.name}</p>
                        </div>
                      )}
                      {data?.get_supplier?.name && (
                        <div className="flex justify-between">
                          <p>اسم العميل </p>
                          <p>{data.get_supplier.name}</p>
                        </div>
                      )}
                      {customerInfo?.data?.phone && (
                        <div className="flex justify-between">
                          <p>الجوال </p>
                          <p>{customerInfo.data.phone}</p>
                        </div>
                      )}
                    </div>

                    {/* جدول المنتجات */}
                    <div className="">
                      {/* رأس الجدول */}
                      <div className="flex font-semibold  gap-8 text-black  mb-2">
                        <div className="w-full self-end text-center">
                          اسم المنتج
                        </div>
                        <div className=" self-end text-center">كمية</div>
                        <div className=" ml-[10px] self-end text-center">
                          سعر الوحدة
                        </div>
                        <div className=" text-center">
                          المجموع (شامل الضريبة)
                        </div>
                      </div>

                      {/* بيانات الجدول */}
                      <div className="flex border-t-2 border-b-black/20 flex-col bg-white border border-gray-200 rounded py-2   text-sm">
                        {Data?.data?.products?.map((product, index) => (
                          <div
                            key={index}
                            className="flex justify-between border-b-2 border-b-black/20"
                          >
                            <div className="w-1/4 flex-grow items-center text-[12px]">
                              {product.sku === 'sku-zood-20001'
                                ? product.pivot.kitchen_notes
                                : product.name}
                            </div>
                            <div className="w-1/4 flex-grow items-center flex justify-center text-[12px]">
                              <p>{product?.pivot?.quantity}</p>
                            </div>
                            <div className="w-1/4 flex-grow items-center flex justify-center text-[12px]">
                              <p>{product?.pivot?.unit_price}</p>
                            </div>
                            <div className="w-1/4 flex-grow items-center flex justify-center text-[12px]">
                              <p>{product?.pivot?.total_price}</p>
                            </div>
                          </div>
                        ))}
                        {Data?.data?.items?.map((product, index) => (
                          <div
                            key={index}
                            className="flex justify-between border-b-2 border-b-black/20"
                          >
                            <div className="w-1/4 flex-grow items-center text-[12px]">
                              {product.sku === 'sku-zood-20001'
                                ? product.pivot.kitchen_notes
                                : product.name}
                            </div>
                            <div className="w-1/4 flex-grow items-center flex justify-center text-[12px]">
                              <p>{product?.pivot?.quantity}</p>
                            </div>
                            <div className="w-1/4 flex-grow items-center flex justify-center text-[12px]">
                              <p>{product?.pivot?.cost}</p>
                            </div>
                            <div className="w-1/4 flex-grow items-center flex justify-center text-[12px]">
                              <p>{product?.pivot?.total_cost}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* معلومات الدفع */}
                    <div className="flex flex-col mt-4 gap-4">
                      {/* first col div */}
                      <div className="flex flex-col gap-2">
                        {Data?.data?.subtotal_price && (
                          <div className="flex justify-between items-center">
                            <p className="w-[50%]">الاجمالي</p>
                            <p>SR {Data.data.subtotal_price}</p>
                          </div>
                        )}
                        {Data?.data?.total_cost && (
                          <div className="flex justify-between items-center">
                            <p className="w-[50%]">الاجمالي</p>
                            <p>SR {Data.data.total_cost}</p>
                          </div>
                        )}
                        {Data?.data?.total_taxes && (
                          <div className="flex justify-between items-center">
                            <p>مجموع ضريبة القيمة المضافة</p>
                            <p>SR {Data.data.total_taxes}</p>
                          </div>
                        )}
                      </div>
                      {/* end col div */}
                      {/* first col div */}
                      <div className="flex flex-col gap-4">
                        {Data?.data?.total_price && (
                          <div className="flex justify-between items-center">
                            <p>المبلغ الإجمالي</p>
                            <p>SR {Data.data.total_price}</p>
                          </div>
                        )}
                        {Data?.data?.discount_amount && (
                          <div className="flex justify-between items-center">
                            <p>تخفيض</p>
                            <p>SR {Data.data.discount_amount}</p>
                          </div>
                        )}
                        {Data?.data?.payments?.length > 0 && (
                          <div className="flex justify-between items-center">
                            <p>المبلغ الإجمالي المدفوع</p>
                            <p>
                              SR{' '}
                              {Data.data.payments.reduce(
                                (sum, item) => sum + item.amount,
                                0
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                      {Data?.data?.payments?.length > 0 &&
                        Data?.data?.total_price && (
                          <div className="flex justify-between items-center">
                            <p>إجمالي المبلغ المستحق</p>
                            <p>
                              SR{' '}
                              {Data.data.payments.reduce(
                                (sum, item) => sum + item.amount,
                                0
                              ) > Data.data.total_price
                                ? Data.data.payments.reduce(
                                    (sum, item) => sum + item.amount,
                                    0
                                  ) - Data.data.total_price
                                : 0}
                            </p>
                          </div>
                        )}
                    </div>

                    {/* الباركود */}
                    <div className="  my-6">
                      <img
                        src="/icons/parCodeIn80.webp"
                        alt="Barcode"
                        className="w-[381px] h-[57px]"
                      />
                    </div>
                    <div className="  my-4 flex justify-center">
                      <img
                        src="/icons/ParCode.webp"
                        alt="Barcode"
                        className="w-[76px] h-[77px]"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="no-print flex flex-col ml-5 w-[26%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col max-md:mt-10">
                  <div className="flex flex-col w-full font-semibold text-right">
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col w-full text-zinc-800">
                        <div className="flex flex-col w-full text-sm">
                          <div className="flex self-end max-w-full min-h-[64px] w-[130px]" />
                          {/* <div className="mt-3.5">
                            شركة حلول التطبيقات لتقنية المعلوماتحي النخيل الرياض
                            المملكة العربية السعودية0123, 31951
                          </div>  */}
                        </div>
                        <div className="mt-8 text-base">طباعة الفاتورة</div>
                      </div>
                      <div className="flex flex-col justify-center self-end mt-3 max-w-full text-sm whitespace-nowrap w-full">
                        <div className="flex gap-4 items-center w-full flex-grow text-zinc-800">
                          <div className="flex gap-2 items-center self-stretch my-auto">
                            <button
                              onClick={() => handleSizeChange('80mm')}
                              className={`self-stretch my-auto`}
                            >
                              80mm
                            </button>
                            <div
                              onClick={() => handleSizeChange('80mm')}
                              className={`flex shrink-0 self-stretch my-auto w-3 h-3 ${
                                size == '80mm' ? 'bg-indigo-900' : 'bg-white'
                              } rounded-full border-4 border-gray-200 border-solid`}
                            />
                          </div>
                          <div className="flex gap-2 items-center self-stretch my-auto">
                            <button
                              onClick={() => handleSizeChange('A4')}
                              className={`self-stretch my-auto `}
                            >
                              A4
                            </button>
                            <div
                              onClick={() => handleSizeChange('A4')}
                              className={`flex shrink-0 self-stretch my-auto w-3 h-3 ${
                                size == 'A4' && 'bg-indigo-900'
                              } rounded-full border-4 border-gray-200 border-solid`}
                            />
                          </div>
                        </div>
                        <button
                          onClick={handlePrint}
                          className="gap-2.5 self-end px-8 py-1 mt-4 max-w-full text-white bg-indigo-900 rounded-lg min-h-[32px] mx-auto w-[100px] max-md:px-5"
                        >
                          طباعة
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-grow flex-col self-end mt-28 mx-auto text-sm text-red-500 whitespace-nowrap rounded-lg  max-md:mt-10">
                      <button className="px-2.5 py-1 bg-white rounded-lg border border-red-500 border-solid max-md:px-5 w-[100px]">
                        استرجاع
                      </button>
                    </div>
                  </div>
                  {/* <div className="flex flex-col self-end mx-auto items-center max-w-full rounded-none w-[154px] mt-10">
                    <div className="flex flex-col justify-center px-4 py-5 bg-white rounded-lg border border-gray-200 border-solid max-md:px-5">
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0545702f8efd834df3b6f82096b53bd74059f9eaf11522eb1eb8a7fe4841708e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                        className="object-contain aspect-[0.99] w-[106px]"
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
