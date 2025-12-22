import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef } from 'react';
import { ViewModalProps } from './ViewModal.types';
import { useReactToPrint } from 'react-to-print';
import './ViewModal.css';
import { useLocation } from 'react-router-dom';
import { QRCodeComp } from '@/components/custom/QRCodeComp';
import { currencyFormated } from '@/utils/currencyFormated';
import axiosInstance from '@/api/interceptors';
import { toast } from '@/components/ui/use-toast';
import { toggleActionView } from '@/store/slices/toggleAction';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';
import { useTranslation } from 'react-i18next';
import { Pointer } from 'lucide-react';

const animationStyles = `
    @keyframes buttonPulse {
      0% {
        box-shadow: 0 0 0 0 rgba(89, 81, 200, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(89, 81, 200, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(89, 81, 200, 0);
      }
    }

    @keyframes pointerPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
    }

    .button-send-zatca {
      animation: buttonPulse 2s infinite;
    }

    .pointer-icon-animation {
      animation: pointerPulse 1.5s ease-in-out infinite;
      display: inline-block;
    }
  `;

export const ViewModal: React.FC<ViewModalProps> = ({ title }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const data = useSelector((state: any) => state.toggleAction.data);
  const allSettings = useSelector((state: any) => state.allSettings.value);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [isConnectedLoading, setIsConnectedLoading] = useState(false);

  const customerInfo = { data: data?.customer };
  const supplierInfo = { data: data?.get_supplier };
  const { pathname } = useLocation();
  const Corporate = pathname === '/zood-dashboard/purchase-invoices';
  const [zatcaStatus, setZatcaStatus] = useState<string | undefined>(
    data?.zatca_report_status
  );
  const Another = !Corporate;
  const ShowCar =
    allSettings.WhoAmI?.business?.business_type?.toLowerCase() === 'workshop';
  const Data = { data };
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState('A4');
  const queryClient = useQueryClient();
  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
  };
  const handlePrint = () => {
    reactToPrintFn();
  };
  const handleReturn = async () => {
    if (!data) return;
    setLoading(true);
    try {
      await axiosInstance.put(`/orders/${data?.id}/refund`);
      toast({
        title: 'Returned',
        description: 'Item returned successfully',
        duration: 3000,
        variant: 'default',
      });
      queryClient.invalidateQueries(['/orders']);
      dispatch(toggleActionView(false));
    } catch (error) {
      toast({
        title: 'somthing went wrong',
        description: 'somthing went wrong',
        duration: 3000,
        variant: 'destructive',
      });
    }
  };

  const handleSendToZatca = async () => {
    if (!data) return;
    try {
      setIsConnectedLoading(true);
      const res = await axiosInstance.post(`zatca/orders/${data?.id}/report`);
      toast({
        title: t('REPORT'),
        description: res.data.message || 'Sent to Zatca successfully',
        duration: 3000,
        variant: 'default',
      });
    } catch (err) {
      console.error('Zatca Error: ', err);
    } finally {
      setIsConnectedLoading(false);
      queryClient.invalidateQueries(['/orders']);
      dispatch(toggleActionView(false));
    }
  };

  const customerAddressLength = data?.customer?.addresses[0]?.name?.length > 35;

  return (
    <>
      <div className="flex flex-wrap gap-4 rounded-lg-none h-[90vh] max-w-[80vw] overflow-y-auto relative bg-white">
        <div className="flex flex-col rounded-lg-none ">
          <div className="px-11 py-a12 w-full bg-white rounded-lg-lg  border-solid   max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col myDiv">
              <div
                ref={contentRef}
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  margin: 'auto',
                  padding: '20px',
                }}
                className={`${size === 'A4' ? 'a4-size' : 'small-receipt'
                  } flex flex-col w-[74%] max-md:ml-0 max-md:w-full`}
              >
                {size === 'A4' ? (
                  <div className="flex print-content flex-col   pt-4 pb-2 mx-auto w-full text-sm bg-white rounded-lg-lg  text-zinc-800 max-md:mt-10 max-md:max-w-full">
                    <p className="text-center mb-2">
                      {allSettings.settings?.data?.receipt_header}
                    </p>
                    <div className="w-full flex justify-between items-center mb-4">
                      <div>
                        <div className="flex items-center gap-5">
                          <img
                            className="size-[80px]"
                            src={`${allSettings.settings?.data?.business_logo}`}
                            alt="Logo"
                          />
                          <p className="font-semibold text-2xl">
                            {allSettings.WhoAmI?.business?.name}
                          </p>
                        </div>
                        <p className="mt-4 leading-[30.18px]">
                          {allSettings.WhoAmI?.user?.branches[0]
                            ?.registered_address &&
                            JSON.parse(
                              allSettings.WhoAmI?.user?.branches[0]
                                ?.registered_address
                            )?.streetName}
                        </p>
                        <p className="w-[277px]">
                          {allSettings.settings?.data?.business_tax_number}
                        </p>
                        <p className="w-[277px]">
                          {allSettings.WhoAmI?.user?.branches[0]?.phone}
                        </p>
                      </div>
                      <QRCodeComp settings={allSettings.settings} Data={Data} />
                    </div>
                    <div className="self-center ml-4 font-semibold text-right">
                      {title}
                    </div>
                    <div className="flex flex-wrap mt-4 text-right bg-white rounded-lg border border-[#ECECEC] border-solid max-md:mr-1 max-md:max-w-full">
                      <div className="flex flex-col flex-1 items-center   min-w-fit pt-4 pb-2 bg-white rounded-lg-none border border-[#ECECEC] border-solid   justify-between">
                        {Corporate && 'اسم المورد'}
                        {Another && 'اسم العميل'}
                        <div className="mt-4 font-semibold w-full text-center">
                          {Corporate ? data?.get_supplier?.name : ''}
                          {Another ? data?.customer?.name : ''}
                        </div>
                      </div>
                      <div className="flex z-10 flex-col flex-1   min-w-fit pt-4 pb-2 whitespace-nowrap bg-white border border-[#ECECEC] border-solid   justify-between">
                        <div className="self-center">الجوال</div>
                        <div className="self-start mt-4 w-full text-center font-semibold">
                          {Corporate ? supplierInfo?.data?.phone : ''}
                          {Another ? customerInfo?.data?.phone : ''}
                        </div>
                      </div>

                      <div className="flex flex-col flex-1  min-w-fit pt-4 pb-2 bg-white rounded-lg border border-[#ECECEC] border-solid max-md:pl-5 justify-between">
                        <div className="self-center">الرقم الضريبي</div>
                        <div className="mt-4 text-center font-semibold">
                          {Corporate
                            ? supplierInfo?.data?.tax_registration_number
                            : ''}
                          {Another
                            ? customerInfo?.data?.tax_registration_number
                            : ''}
                        </div>
                      </div>
                      <div className="flex z-10 flex-col flex-1  min-w-fit pt-4 pb-2 bg-white border border-[#ECECEC] border-solid   justify-between">
                        <div className="self-center">تاريخ الفاتورة</div>
                        <div className="flex gap-2 mt-4 font-semibold whitespace-nowrap justify-between">
                          {data?.business_date?.split(' ')[0] && (
                            <div className="grow text-center">
                              {data?.business_date?.split(' ')[0]}
                            </div>
                          )}
                          {data?.business_date?.split(' ')[1]?.slice(0, 5) && (
                            <div className="grow text-center">
                              {data?.business_date?.split(' ')[1]?.slice(0, 5)}
                            </div>
                          )}
                        </div>
                      </div>
                      {title === 'فاتورة  شراء' && (
                        <div className="flex flex-col flex-1 items-center   min-w-fit pt-4 pb-2 bg-white rounded-lg-none border border-[#ECECEC] border-solid   justify-between">
                          <div>الرقم المرجعي</div>
                          <div className="mt-4 font-semibold w-full text-center">
                            {data?.invoice_number || ''}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col flex-1 items-center   min-w-fit pt-4 pb-2 bg-white rounded-lg-none border border-[#ECECEC] border-solid  justify-between">
                        <div>{title === "عرض سعر" ? "رقم عرض السعر" : "رقم الفاتورة"}</div>
                        <div className="mt-4 font-semibold w-full text-center">
                          {data?.reference || ''}
                        </div>
                      </div>
                    </div>
                    {Another &&
                      customerAddressLength &&
                      data?.customer?.addresses[0]?.name && (
                        <div className="flex flex-wrap mt-4 text-right bg-white rounded-lg border border-[#ECECEC] border-solid max-md:mr-1 max-md:max-w-full">
                          <div className="flex z-10 flex-col flex-1   min-w-fit pt-4 pb-2 whitespace-nowrap bg-white border border-[#ECECEC] border-solid   justify-between">
                            <div className="self-center">عنوان العميل</div>
                            <div className="self-start mt-4 w-full text-center font-semibold">
                              {Another
                                ? data?.customer?.addresses[0]?.name
                                : ''}
                            </div>
                          </div>
                        </div>
                      )}
                    <div className="flex">
                      {!customerAddressLength &&
                        Another &&
                        data?.customer?.addresses[0]?.name && (
                          <div className="flex flex-col flex-1 items-center   min-w-fit pt-4 pb-2 bg-white rounded-lg-none border border-[#ECECEC] border-solid   justify-between">
                            <div>عنوان العميل</div>
                            <div className="mt-4 font-semibold w-full text-center">
                              {Another
                                ? data?.customer?.addresses[0]?.name
                                : '---'}
                            </div>
                          </div>
                        )}
                      {ShowCar && data?.kitchen_received_at && (
                        <div className="flex flex-col flex-1 items-center   min-w-fit pt-4 pb-2 bg-white rounded-lg-none border border-[#ECECEC] border-solid   justify-between">
                          <div>نوع السيارة</div>
                          <div className="mt-4 font-semibold w-full text-center">
                            {data?.kitchen_received_at || ''}
                          </div>
                        </div>
                      )}

                      {ShowCar && data?.kitchen_done_at && (
                        <div className="flex flex-col flex-1 items-center  min-w-fit pt-4 pb-2 bg-white rounded-lg-none border border-[#ECECEC] border-solid   justify-between">
                          <div>رقم اللوحة</div>
                          <div className="mt-4 font-semibold w-full text-center">
                            {data?.kitchen_done_at || ''}
                          </div>
                        </div>
                      )}
                    </div>

                    {!Corporate && data?.kitchen_notes && (
                      <div className="mt-6 flex flex-1 items-center min-w-fit bg-white rounded-lg-none border border-[#ECECEC] border-solid  justify-between">
                        <div className="flex-grow p-4 font-semibold text-base w-[100px] flex items-center justify-center">
                          ملاحظات
                        </div>
                        <div className="p-4 border-r-2 border-r-[#ECECEC] font-normal text-base w-full">
                          {data?.kitchen_notes || ''}
                          {/* الابواب الخشبية وتصليح الاقفال وعمل ديكور السقف فك
                          القديم وتركيب جديد 60+60 ابيض عمل نظافة داخل البيت
                          كاملوالحمامات والمطبخ تركيبسيراميكالجدران والارضية مع
                          المواد السباك ومواد النجار */}
                        </div>
                      </div>
                    )}
                    {Corporate && data?.notes && (
                      <div className="mt-6 flex flex-1 items-center min-w-fit bg-white rounded-lg-none border border-[#ECECEC] border-solid   justify-between">
                        <div className="flex-grow py-4   font-semibold text-base min-w-[100px] flex items-center justify-center text-nowrap">
                          وصف المشتريات
                        </div>
                        <div className="p-4 border-r-2 border-r-[#ECECEC] font-normal text-base w-full">
                          {data?.notes || ''}
                          {/* الابواب الخشبية وتصليح الاقفال وعمل ديكور السقف فك
                          القديم وتركيب جديد 60+60 ابيض عمل نظافة داخل البيت
                          كاملوالحمامات والمطبخ تركيبسيراميكالجدران والارضية مع
                          المواد السباك ومواد النجار */}
                        </div>
                      </div>
                    )}
                    <div className="flex z-10 flex-wrap gap-5 justify-between   py-1.5 mt-4 w-full font-semibold text-right text-white rounded-lg border border-[#ECECEC] border-solid bg-[#868686] max-md:mr-1 max-md:max-w-full">
                      <div className="flex w-full items-center text-center">
                        <div className={`${Corporate ? 'w-1/2' : 'w-1/3'}`}>
                          اسم المنتج
                        </div>
                        <div className="w-[110px]">كمية</div>
                        <div className="w-[110px]">سعر الوحدة</div>
                        {!Corporate && (
                          <div className="w-[200px]">المجموع الكلي</div>
                        )}
                        {!Corporate && (
                          <div className="w-[150px]">قيمة الضريبة</div>
                        )}
                        <div className="w-[140px]   py-4">
                          المجموع <br />
                          <span className="text-[10px] font-bold">
                            (غير شامل الضريبة)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-5 justify-between py-5 mt-0  bg-white rounded-lg border border-[#ECECEC] border-solid w-[802px] max-w-full max-md:mr-1   text-right">
                      {Data?.data?.order_product?.map((e) => {
                        return (
                          <div className="flex font-semibold w-full">
                            <div className="w-1/3 flex justify-center items-center">
                              {e?.kitchen_notes
                                ? e?.kitchen_notes
                                : Data?.data?.products?.find(
                                  (test) => test.id === e.product_id
                                )?.name}
                            </div>
                            <div className="w-[120px] flex justify-center items-center">
                              {currencyFormated(e?.quantity)}
                            </div>
                            <div className="w-[120px] flex justify-center items-center">
                              {currencyFormated(e?.unit_price)}
                            </div>
                            <div className="w-[230px] flex justify-center items-center">
                              {currencyFormated(
                                parseFloat(e?.unit_price) *
                                parseFloat(e?.quantity)
                              )}
                            </div>

                            {!Corporate && (
                              <div className="w-[120px] flex justify-center items-center">
                                {currencyFormated(e?.taxes?.[0]?.pivot?.amount)}
                              </div>
                            )}
                            <div className="w-[140px] flex justify-center items-center">
                              {currencyFormated(
                                parseFloat(e?.unit_price) *
                                parseFloat(e?.quantity) +
                                e?.taxes?.[0]?.pivot?.amount *
                                (e?.is_tax_included ? -1 : 0)
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {Data?.data?.items?.map((e) => (
                        <div className="flex font-semibold w-full">
                          <div className="w-1/2 flex justify-center items-center">
                            {e?.name === 'sku-zood-20001'
                              ? e?.pivot?.kitchen_notes
                              : e?.name}
                          </div>
                          <div className="max-w-[120px] flex-grow flex justify-center items-center">
                            {currencyFormated(e?.pivot?.quantity)}
                          </div>
                          <div className="max-w-[120px] flex-grow flex justify-center items-center">
                            {currencyFormated(e?.pivot?.cost)}
                          </div>
                          <div className="max-w-[120px] flex-grow flex justify-center items-center">
                            {currencyFormated(
                              e?.pivot?.quantity * e?.pivot?.cost
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3 mt-10 makeEvenOddBg">
                      {Data?.data?.subtotal_price ? (
                        <div className="flex justify-between p-2 rounded-lg items-center">
                          <div>الإجمالي الفرعي</div>
                          <div>
                            SR {currencyFormated(Data?.data?.subtotal_price)}
                          </div>
                        </div>
                      ) : null}
                      {Data?.data?.discount_amount ? (
                        <div className="flex justify-between p-2 rounded-lg items-center">
                          <div>خصم</div>
                          <div>
                            SR {currencyFormated(Data?.data?.discount_amount)}
                          </div>
                        </div>
                      ) : null}
                      {Data?.data?.items ? (
                        <div className="flex justify-between p-2 rounded-lg items-center">
                          <div>المبلغ الإجمالي غير شامل الضريبة</div>
                          <div>
                            SR{' '}
                            {currencyFormated(
                              Data?.data?.items?.reduce(
                                (sum, item) => sum + item?.pivot?.total_cost,
                                0
                              )
                            )}
                          </div>
                        </div>
                      ) : null}
                      {Data?.data?.tax_exclusive_discount_amount ? (
                        <div className="flex justify-between p-2 rounded-lg items-center">
                          <div>مجموع ضريبة القيمة المضافة 15%</div>
                          <div>
                            SR{' '}
                            {currencyFormated(
                              Data.data.tax_exclusive_discount_amount
                            )}
                          </div>
                        </div>
                      ) : null}
                      {Corporate ? (
                        <div className="flex justify-between p-2 rounded-lg items-center">
                          <div>مجموع ضريبة القيمة المضافة 15%</div>
                          <div>
                            SR{' '}
                            {currencyFormated(
                              parseFloat(Data.data.paid_tax || 0)
                            )}
                          </div>
                        </div>
                      ) : null}

                      {Data?.data?.total_price ? (
                        <div className="flex justify-between p-2 rounded-lg items-center">
                          <div>المبلغ الإجمالي</div>
                          <div>
                            SR {currencyFormated(Data?.data?.total_price)}
                          </div>
                        </div>
                      ) : null}
                      {Data?.data?.items ? (
                        <div className="flex justify-between p-2 rounded-lg items-center">
                          <div>المبلغ الإجمالي شامل الضريبة</div>
                          <div>
                            SR{' '}
                            {currencyFormated(
                              parseFloat(Data.data.paid_tax || 0) +
                              Data?.data?.items?.reduce(
                                (sum, item) => sum + item?.pivot?.total_cost,
                                0
                              )
                            )}
                          </div>
                        </div>
                      ) : null}
                      {Data?.data?.payments?.map((e) => {
                        if (e?.payment_method_id) {
                          return (
                            <div className="flex justify-between p-2 rounded-lg items-center">
                              <div>{e?.payment_method?.name}</div>
                              <div>SR {currencyFormated(e?.amount)}</div>
                            </div>
                          );
                        }
                      })}
                      {Data?.data?.payments?.length > 0 ? (
                        <div className="flex justify-between p-2 rounded-lg items-center">
                          <div>المبلغ الإجمالي المدفوع</div>
                          <div>
                            SR{' '}
                            {currencyFormated(
                              Data?.data?.payments.reduce(
                                (sum, item) => sum + item?.amount,
                                0
                              )
                            )}
                          </div>
                        </div>
                      ) : null}
                      {Data?.data?.payments?.length > 0 &&
                        Data?.data?.total_price &&
                        Data?.data?.payments?.reduce(
                          (sum, item) => sum + item?.amount,
                          0
                        ) -
                        Data?.data?.total_price >
                        0 ? (
                        <div className="flex justify-between p-2 rounded-lg items-center">
                          <div>إجمالي المبلغ المتبقي</div>
                          <div>
                            SR{' '}
                            {(Data?.data?.payments?.reduce(
                              (sum, item) => sum + item?.amount,
                              0
                            ) > Data?.data?.total_price
                              ? currencyFormated(
                                Data?.data?.payments?.reduce(
                                  (sum, item) => sum + item?.amount,
                                  0
                                ) - Data?.data?.total_price
                              )
                              : Number(0).toFixed(2)) || 0}
                          </div>
                        </div>
                      ) : null}
                      {Data?.data?.total_price &&
                        Data.data.total_price -
                        Data?.data?.payments?.reduce(
                          (sum, item) => sum + item.amount,
                          0
                        ) >
                        0 ? (
                        <div className="flex justify-between p-2 rounded-lg items-center">
                          <div>إجمالي المبلغ المستحق</div>
                          <div>
                            SR{' '}
                            {((Data?.data?.payments?.reduce(
                              (sum, item) => sum + item.amount,
                              0
                            ) || 0) <= Data.data.total_price
                              ? currencyFormated(
                                Data.data.total_price -
                                Data?.data?.payments?.reduce(
                                  (sum, item) => sum + item.amount,
                                  0
                                )
                              )
                              : 0) || 0}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex justify-between items-center">
                      {/* <p className="text-sm w-[50%] mt-[30px] text-[#26262F]">
                        الشروط والاحكام
                      </p> */}
                      {/* <div className="justify-items-end">
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
                      </div> */}
                    </div>
                    {/* {data?.kitchen_notes ? (
                      <div className="flex flex-col pt-4 pb-2 bg-white rounded-lg-none  max-md:px-5 justify-between">
                        <div>ملاحظات : {data?.kitchen_notes || ''}</div>
                      </div>
                    ) : null} */}
                    <p className="text-center">
                      {allSettings.settings?.data?.receipt_footer}
                    </p>
                  </div>
                ) : (
                  <div className="flex print-content2 flex-col w-[80mm]  mx-auto text-righ text-sm p-1  ">
                    <p className="text-center mb-2">
                      {allSettings.settings?.data?.receipt_header}
                    </p>
                    <img
                      className="mx-auto size-[80px]"
                      src={`${allSettings.settings?.data?.business_logo}`}
                      alt="Logo"
                    />
                    <p className="font-semibold text-sm text-center pt-2 pb-5">
                      {allSettings.WhoAmI?.business?.name}
                    </p>
                    <div className="text-center text-sm leading-6 mb-4">
                      {allSettings.WhoAmI?.user?.branches[0]
                        ?.registered_address &&
                        JSON.parse(
                          allSettings.WhoAmI?.user?.branches[0]
                            ?.registered_address
                        )?.streetName}
                    </div>
                    <div className="text-center font-semibold text-lg my-6">
                      {title}
                    </div>
                    <div className="flex flex-col gap-3 mb-2">
                      <div className="flex justify-between">
                        <p>
                          {Another && 'اسم العميل'}
                          {Corporate && 'اسم المورد'}
                        </p>
                        <p>
                          {Corporate ? data?.get_supplier?.name : ''}
                          {Another ? data?.customer?.name : ''}
                        </p>
                      </div>
                      {/* <div className="flex justify-between">
                        <p>
                          {Another && 'عنوان العميل'}
                          {Corporate && 'عنوان المورد'}
                        </p>
                        <p>
                          {Corporate
                            ? data?.get_supplier?.addresses[0]?.name
                            : ''}
                          {Another ? data?.customer?.addresses[0]?.name : ''}
                        </p>
                      </div> */}
                      <div className="flex justify-between">
                        <p>الجوال </p>
                        <p>
                          {Corporate ? supplierInfo?.data?.phone : ''}
                          {Another ? customerInfo?.data?.phone : ''}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>الرقم الضريبي </p>
                        <p>
                          {Corporate
                            ? supplierInfo?.data?.tax_registration_number
                            : ''}
                          {Another
                            ? customerInfo?.data?.tax_registration_number
                            : ''}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>تاريخ الفاتورة </p>
                        <p>{data?.business_date?.split(' ')[0]}</p>
                      </div>
                      <div className="flex justify-between">
                        <p> {title === "عرض سعر" ? "رقم عرض السعر" : "رقم الفاتورة"} </p>
                        <p>{data?.reference}</p>
                      </div>
                      {title === 'فاتورة  شراء' && (
                        <div className="flex justify-between">
                          <p>الرقم المرجعي</p>
                          <p>{data?.invoice_number || ''}</p>
                        </div>
                      )}
                      {ShowCar && data?.kitchen_received_at && (
                        <div className="flex justify-between">
                          <p>نوع السيارة</p>
                          <p>{data?.kitchen_received_at || ''}</p>
                        </div>
                      )}
                      {ShowCar && data?.kitchen_done_at && (
                        <div className="flex justify-between">
                          <p>رقم اللوحة</p>
                          <p>{data?.kitchen_done_at || ''}</p>
                        </div>
                      )}
                    </div>
                    <div className=" py-5">
                      <div className="flex font-semibold justify-between text-black text-xs  mb-2">
                        <div className="!w-[80px] self-end text-center">
                          اسم المنتج
                        </div>
                        <div className="!w-[70px]  self-end text-center">
                          كمية
                        </div>
                        <div className="!w-[70px]  self-end text-center">
                          سعر الوحدة
                        </div>
                        {!Corporate && (
                          <div className="!w-[70px]  self-end text-center">
                            قيمة الضريبة
                          </div>
                        )}
                        <div className="!w-[70px] text-center">
                          المجموع (غير شامل الضريبة)
                          {/* المجموع (شامل الضريبة) */}
                        </div>
                      </div>
                      <div className="flex border-t-2 border-b-black/20 flex-col bg-white rounded-lg py-2   text-sm">
                        {Data?.data?.order_product?.map(
                          (orderProduct, index) => {
                            return (
                              <div
                                key={index}
                                className="flex justify-between border-b-2 border-b-black/20"
                              >
                                <div className="!w-[80px] flex-grow items-center text-[12px]">
                                  {orderProduct?.kitchen_notes
                                    ? orderProduct?.kitchen_notes
                                    : Data?.data?.products?.find(
                                      (test) =>
                                        test.id === orderProduct.product_id
                                    )?.name}
                                </div>
                                <div className="!w-[70px] flex-grow items-center flex justify-center text-[12px]">
                                  <p>
                                    {currencyFormated(orderProduct?.quantity)}
                                  </p>
                                </div>
                                <div className="!w-[70px] flex-grow items-center flex justify-center text-[12px]">
                                  <p>
                                    {currencyFormated(orderProduct?.unit_price)}
                                  </p>
                                </div>
                                {!Corporate && (
                                  <div className="!w-[70px] flex-grow items-center flex justify-center text-[12px]">
                                    <p>
                                      {currencyFormated(
                                        orderProduct?.taxes?.[0]?.pivot
                                          ?.amount || 0
                                      )}
                                    </p>
                                  </div>
                                )}
                                <div className="!w-[70px] flex-grow items-center flex justify-center text-[12px]">
                                  <p>
                                    {currencyFormated(
                                      parseFloat(orderProduct?.unit_price) *
                                      parseFloat(orderProduct?.quantity) +
                                      orderProduct?.taxes?.[0]?.pivot
                                        ?.amount *
                                      (orderProduct?.is_tax_included
                                        ? -1
                                        : 0)
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                        )}
                        {Data?.data?.items?.map((product, index) => (
                          <div
                            key={index}
                            className="flex justify-between border-b-2 border-b-black/20"
                          >
                            <div
                              style={{ width: `calc(100%/3)` }}
                              className="!w-[70px] items-center text-[12px]"
                            >
                              {product?.name === 'sku-zood-20001'
                                ? product?.pivot?.kitchen_notes
                                : product?.name}
                            </div>
                            <div className="!w-[70px] items-center flex justify-center text-[12px]">
                              <p>
                                {currencyFormated(product?.pivot?.quantity)}
                              </p>
                            </div>
                            <div className="!w-[70px] items-center flex justify-center text-[12px]">
                              <p>{currencyFormated(product?.pivot?.cost)}</p>
                            </div>
                            <div className="!w-[70px] items-center flex justify-center text-[12px]">
                              <p>
                                {currencyFormated(
                                  product?.pivot?.quantity *
                                  product?.pivot?.cost
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col mt-4 gap-4">
                      <div className="flex flex-col gap-2">
                        {Data?.data?.subtotal_price ? (
                          <div className="flex justify-between items-center">
                            <p className="w-[50%]">الإجمالي الفرعي</p>
                            <p>
                              SR {currencyFormated(Data?.data?.subtotal_price)}
                            </p>
                          </div>
                        ) : null}
                        {Data?.data?.items ? (
                          <div className="flex justify-between items-center">
                            <p className="w-[50%]">الاجمالي</p>
                            <p>
                              SR{' '}
                              {currencyFormated(
                                Data?.data?.items?.reduce(
                                  (sum, item) => sum + item?.pivot?.total_cost,
                                  0
                                )
                              )}
                            </p>
                          </div>
                        ) : null}
                        {Data?.data?.discount_amount ? (
                          <div className="flex justify-between items-center">
                            <div>خصم</div>
                            <p>
                              SR {currencyFormated(Data?.data?.discount_amount)}
                            </p>
                          </div>
                        ) : null}
                        {Data?.data?.tax_exclusive_discount_amount ? (
                          <div className="flex justify-between items-center">
                            <p>مجموع ضريبة القيمة المضافة 15%</p>
                            <p>
                              SR{' '}
                              {currencyFormated(
                                Data?.data?.tax_exclusive_discount_amount
                              )}
                            </p>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-4">
                        {Data?.data?.total_price ? (
                          <div className="flex justify-between items-center">
                            <p>المبلغ الإجمالي</p>
                            <p>
                              SR {currencyFormated(Data?.data?.total_price)}
                            </p>
                          </div>
                        ) : null}
                        {Data?.data?.payments?.length > 0 ? (
                          <div className="flex justify-between items-center">
                            <p>المبلغ الإجمالي المدفوع</p>
                            <p>
                              SR{' '}
                              {currencyFormated(
                                Data?.data?.payments.reduce(
                                  (sum, item) => sum + item?.amount,
                                  0
                                )
                              )}
                            </p>
                          </div>
                        ) : null}
                      </div>
                      {Data?.data?.payments?.length > 0 &&
                        Data?.data?.total_price &&
                        Data?.data?.payments?.reduce(
                          (sum, item) => sum + item?.amount,
                          0
                        ) -
                        Data?.data?.total_price >
                        0 ? (
                        <div className="flex justify-between items-center">
                          <div>إجمالي المبلغ المتبقي</div>
                          <p>
                            SR{' '}
                            {Data?.data?.payments?.reduce(
                              (sum, item) => sum + item?.amount,
                              0
                            ) > Data?.data?.total_price
                              ? currencyFormated(
                                Data?.data?.payments?.reduce(
                                  (sum, item) => sum + item?.amount,
                                  0
                                ) - Data?.data?.total_price
                              )
                              : Number(0).toFixed(2)}
                          </p>
                        </div>
                      ) : null}
                      {Data?.data?.payments?.length > 0 &&
                        Data?.data?.total_price &&
                        Data?.data?.total_price -
                        Data?.data?.payments?.reduce(
                          (sum, item) => sum + item?.amount,
                          0
                        ) >
                        0 ? (
                        <div className="flex justify-between rounded-lg items-center">
                          <p>إجمالي المبلغ المستحق</p>
                          <div>
                            SR{' '}
                            {(Data?.data?.payments?.reduce(
                              (sum, item) => sum + item?.amount,
                              0
                            ) <= Data?.data?.total_price
                              ? currencyFormated(
                                Data?.data?.total_price -
                                Data?.data?.payments?.reduce(
                                  (sum, item) => sum + item?.amount,
                                  0
                                )
                              )
                              : 0) || 0}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {data?.kitchen_notes ? (
                      <div className="flex flex-col pt-8 pb-2 bg-white rounded-lg-none   justify-between">
                        <div>ملاحظات : {data?.kitchen_notes || ''}</div>
                      </div>
                    ) : null}
                    <div className="  my-6">
                      {/* <img
                        src="/icons/parCodeIn80.webp"
                        alt="Barcode"
                        className="w-[381px] h-[57px]"
                      /> */}
                      <div className="  my-4 flex justify-center">
                        <QRCodeComp
                          settings={allSettings.settings}
                          Data={Data}
                        />
                      </div>
                      <p className="text-center mt-2">
                        {allSettings.settings?.data?.receipt_footer}
                      </p>
                      <div className="w-1 h-1"></div>
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
                        </div>
                        <div className="mt-8 text-base">طباعة الفاتورة</div>
                      </div>
                      <div className="flex flex-col justify-center self-end mt-3 max-w-full text-sm whitespace-nowrap w-full">
                        <div className="flex gap-4 items-center w-full flex-grow text-zinc-800">
                          <div className="flex gap-2 items-center self-stretch my-auto">
                            <button
                              disabled={loading}
                              onClick={() => handleSizeChange('80mm')}
                              className={`self-stretch my-auto`}
                            >
                              80mm
                            </button>
                            <div
                              onClick={() => handleSizeChange('80mm')}
                              className={`flex shrink-0 self-stretch my-auto w-3 h-3 ${size == '80mm' ? 'bg-indigo-900' : 'bg-white'
                                } rounded-lg-full border-4 border-gray-200 border-solid`}
                            />
                          </div>
                          <div className="flex gap-2 items-center self-stretch my-auto">
                            <button
                              disabled={loading}
                              onClick={() => handleSizeChange('A4')}
                              className={`self-stretch my-auto `}
                            >
                              A4
                            </button>
                            <div
                              onClick={() => handleSizeChange('A4')}
                              className={`flex shrink-0 self-stretch my-auto w-3 h-3 ${size == 'A4' && 'bg-indigo-900'
                                } rounded-lg-full border-4 border-gray-200 border-solid`}
                            />
                          </div>
                        </div>
                        <button
                          disabled={loading}
                          onClick={handlePrint}
                          className="gap-2.5 self-end  py-1 mt-4 max-w-full text-white bg-indigo-900 rounded-lg-lg min-h-[32px] mx-auto w-[100px]  "
                        >
                          طباعة
                        </button>
                      </div>
                    </div>
                    {Another && (
                      <div className="flex flex-grow gap-4 flex-col self-end mt-28 mx-auto text-sm text-red-500 whitespace-nowrap rounded-lg-lg  max-md:mt-10">
                        {zatcaStatus !== 'PASS' && (
                          <Button
                            disabled={isConnectedLoading}
                            className="px-2.5 py-1 gap-2 text-white bg-[#5951C8] rounded-lg border border-[#5951C8] border-solid max-md:px-5 hover:text-white transition-all duration-200 ease-out hover:scale-105 active:scale-95 cursor-pointer hover:shadow-md hover:shadow-[#5951C8]/30 button-send-zatca"
                            onClick={() => {
                              handleSendToZatca();
                            }}
                          >
                            <Pointer
                              size={15}
                              className="pointer-icon-animation"
                            />
                            <span>{t('SEND_TO_ZATCA')}</span>
                          </Button>
                        )}

                        <button
                          disabled={loading}
                          onClick={handleReturn}
                          className="px-2.5 py-1 bg-white rounded-lg-lg border border-red-500 border-solid max-md:px-5 w-[100px]"
                        >
                          استرجاع
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
