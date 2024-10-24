import React from 'react';

import { ViewModalProps } from './ViewModal.types';

import './ViewModal.css';

export const ViewModal: React.FC<ViewModalProps> = () => {
  return (
    <>
      <div className="flex flex-wrap gap-4 rounded-none h-[90vh] overflow-y-scroll relative max-w-[950px]">
        <div className="flex flex-wrap gap-4 rounded-none">
          <div className="flex flex-col grow shrink-0 justify-center items-center px-16 pt-0 rounded-lg border border-gray-200 border-solid basis-0 bg-zinc-50 min-h-[850px] shadow-[0px_4px_26px_rgba(0,0,0,0.18)] w-fit max-md:px-5 max-md:max-w-full">
            <div className="flex flex-warap gap-9 items-end max-md:max-w-full">
              <div
                className="flex flex-col min-w-[240px] w-[293px] bg"
                dir="ltr"
              >
                <div className="flex flex-col w-full font-semibold text-right">
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col w-full text-zinc-800">
                      <div className="flex flex-col w-full text-sm">
                        <div className="flex self-end max-w-full min-h-[63px] w-[130px]" />
                        <div className="mt-3.5">
                          شركة حلول التطبيقات لتقنية المعلوماتحي النخيل الرياض
                          المملكة العربية السعودية0123, 31951
                        </div>
                      </div>
                      <div className="mt-8 text-base">طباعة الفاتورة</div>
                    </div>
                    <div className="flex flex-col justify-center self-end mt-3 max-w-full text-sm whitespace-nowrap w-[148px]">
                      <div className="flex gap-4 items-center w-full text-zinc-800">
                        <div className="flex gap-2 items-center self-stretch my-auto">
                          <div className="self-stretch my-auto">Mobile</div>
                          <div className="flex shrink-0 self-stretch my-auto w-3 h-3 bg-white rounded-full border-4 border-gray-200 border-solid" />
                        </div>
                        <div className="flex gap-2 items-center self-stretch my-auto">
                          <div className="self-stretch my-auto">A4</div>
                          <div className="flex shrink-0 self-stretch my-auto w-3 h-3 bg-indigo-900 rounded-full border-4 border-gray-200 border-solid" />
                        </div>
                      </div>
                      <div className="gap-2.5 self-end px-8 py-1 mt-4 max-w-full text-white bg-indigo-900 rounded-lg min-h-[32px] w-[100px] max-md:px-5">
                        طباعة
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col self-end mt-28 max-w-full text-sm text-red-500 whitespace-nowrap rounded-lg w-[100px] max-md:mt-10">
                    <div className="px-2.5 py-1 bg-white rounded-lg border border-red-500 border-solid max-md:px-5">
                      استرجاع
                    </div>
                  </div>
                </div>
                <div className="flex flex-col self-end mt-24 max-w-full rounded-none w-[154px] max-md:mt-10">
                  <div className="flex flex-col justify-center px-4 py-5 bg-white rounded-lg border border-gray-200 border-solid max-md:px-5">
                    <img
                      loading="lazy"
                      src="/images/QRCode.png"
                      className="object-contain aspect-[0.99] w-[106px]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5 items-center px-6 py-5 text-sm bg-white rounded-lg border border-gray-200 border-solid min-h-[775px] min-w-[240px] text-zinc-800 w-[480px] max-md:px-5 max-md:max-w-full">
                <div className="flex flex-col self-stretch my-auto min-w-[240px] w-[426px] mt-0">
                  <div
                    className="flex flex-col w-full max-md:max-w-full"
                    dir="ltr"
                  >
                    <div className="flex flex-col w-full max-md:max-w-full">
                      <div className="flex flex-col w-full max-md:max-w-full">
                        <div className="font-semibold text-center max-md:max-w-full">
                          فاتورة ضريبية مبسطة
                        </div>
                        <div className="flex flex-col mt-3.5 w-full text-right max-md:max-w-full">
                          <hr
                            style={{
                              width: '100%',
                              textAlign: 'center',
                              marginLeft: 0,
                              borderColor: '#D2D2D2',
                              margin: '0 auto',
                            }}
                          />
                          <div className="flex flex-col justify-center mt-5 w-full max-md:max-w-full">
                            <div className="flex flex-col self-end max-w-full w-[400px]">
                              <div className="flex gap-10 justify-between items-center self-end max-w-full w-[337px]">
                                <div className="self-stretch my-auto font-semibold">
                                  INV0415
                                </div>
                                <div className="self-stretch my-auto">
                                  رقم الفاتورة
                                </div>
                              </div>
                              <div className="flex flex-col mt-1 w-full">
                                <div className="flex gap-10 justify-between items-center w-full">
                                  <div className="flex gap-2 items-center self-stretch my-auto font-semibold whitespace-nowrap">
                                    <div className="self-stretch my-auto">
                                      01-10-2024
                                    </div>
                                    <div className="self-stretch my-auto">
                                      12:41
                                    </div>
                                  </div>
                                  <div className="self-stretch my-auto">
                                    تاريخ الفاتورة
                                  </div>
                                </div>
                                <div className="flex flex-col mt-1 w-full">
                                  <div className="flex gap-10 justify-between items-center w-full">
                                    <div className="self-stretch my-auto font-semibold">
                                      311006624700003
                                    </div>
                                    <div className="self-stretch my-auto">
                                      الرقم الضريبي
                                    </div>
                                  </div>
                                  <div className="flex flex-col self-end mt-1 max-w-full w-[360px]">
                                    <div className="flex gap-10 justify-between items-center self-end max-w-full w-[310px]">
                                      <div className="self-stretch my-auto font-semibold">
                                        احمد
                                      </div>
                                      <div className="self-stretch my-auto">
                                        اسم العميل
                                      </div>
                                    </div>
                                    <div className="flex gap-10 justify-between items-center mt-1 w-full whitespace-nowrap">
                                      <div className="self-stretch my-auto font-semibold">
                                        0553223734
                                      </div>
                                      <div className="self-stretch my-auto">
                                        الجوال
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr
                              style={{
                                width: '100%',
                                textAlign: 'center',
                                marginLeft: 0,
                                borderColor: '#D2D2D2',
                                margin: '0 auto',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col mt-2 w-full text-right max-md:max-w-full">
                        <div className="flex flex-col w-full max-md:max-w-full">
                          <div className="flex flex-col w-full max-md:max-w-full">
                            <div className="flex flex-col items-end w-full max-md:max-w-full">
                              <div className="flex gap-9 items-center self-stretch w-full max-md:max-w-full">
                                <div className="self-stretch my-auto">
                                  المجموع (شامل الضريبة)
                                </div>
                                <div className="self-stretch my-auto">
                                  سعر الوحدة
                                </div>
                                <div className="self-stretch my-auto">كمية</div>
                                <div className="self-stretch my-auto">
                                  اسم المنتج
                                </div>
                              </div>
                              <div className="flex gap-10 items-center mt-1">
                                <div className="self-stretch my-auto font-semibold">
                                  SR 53.00
                                </div>
                                <div className="flex gap-10 items-center self-stretch my-auto">
                                  <div className="self-stretch my-auto font-semibold">
                                    SR 45.05
                                  </div>
                                  <div className="flex gap-10 justify-between items-center self-stretch my-auto whitespace-nowrap w-[123px]">
                                    <div className="self-stretch my-auto font-semibold">
                                      1
                                    </div>
                                    <div className="self-stretch my-auto">
                                      ملح
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-10 items-center mt-1">
                                <div className="flex gap-10 items-center self-stretch my-auto font-semibold">
                                  <div className="self-stretch my-auto">
                                    SR 53.00
                                  </div>
                                  <div className="self-stretch my-auto">
                                    SR 45.05
                                  </div>
                                </div>
                                <div className="flex gap-10 justify-between items-center self-stretch my-auto w-[123px]">
                                  <div className="self-stretch my-auto font-semibold">
                                    1
                                  </div>
                                  <div className="self-stretch my-auto">
                                    صماء دقيق
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col mt-4 w-full max-md:max-w-full">
                              <div className="flex flex-col items-end w-full max-md:max-w-full">
                                <hr
                                  style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    marginLeft: 0,
                                    borderColor: '#D2D2D2',
                                    margin: '0 auto',
                                  }}
                                />
                                <div className="flex flex-col mt-2 max-w-full w-[357px]">
                                  <div className="flex gap-10 justify-between items-start w-full">
                                    <div className="font-semibold">
                                      SR 9,489.40
                                    </div>
                                    <div className="leading-5">
                                      الاجمالي
                                      <br />
                                      الخاضع للضريبة
                                    </div>
                                  </div>
                                  <div className="flex gap-10 justify-between items-start mt-2.5 w-full">
                                    <div className="font-semibold">
                                      SR 1,674.60
                                    </div>
                                    <div className="leading-5">
                                      مجموع ضريبة <br />
                                      القيمة المضافة %15
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr
                            style={{
                              width: '100%',
                              textAlign: 'center',
                              marginLeft: 0,
                              borderColor: '#D2D2D2',
                              margin: '0 auto',
                            }}
                          />
                        </div>
                        <div className="flex flex-col self-end mt-2 max-w-full w-[365px]">
                          <div className="flex gap-10 justify-between items-center w-full">
                            <div className="self-stretch my-auto font-semibold">
                              SR 11,164.00
                            </div>
                            <div className="self-stretch my-auto">الإجمالي</div>
                          </div>
                          <div className="flex flex-col mt-1 w-full">
                            <div className="flex gap-10 justify-between items-center self-end max-w-full w-[339px]">
                              <div className="self-stretch my-auto font-semibold">
                                - SR 0.00
                              </div>
                              <div className="self-stretch my-auto">تخفيض</div>
                            </div>
                            <div className="flex flex-col mt-1 w-full">
                              <div className="flex gap-10 justify-between items-center w-full">
                                <div className="self-stretch my-auto font-semibold">
                                  SR 11,164.00
                                </div>
                                <div className="self-stretch my-auto">
                                  الإجمالي
                                </div>
                              </div>
                              <div className="flex gap-10 justify-between items-center self-end mt-1 w-full">
                                <div className="self-stretch my-auto font-semibold">
                                  حوالة بنكية
                                </div>
                                <div className="self-stretch my-auto">
                                  نوع الدفع
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col mt-4 w-full text-right max-md:max-w-full">
                      <div className="flex flex-col w-full max-md:max-w-full">
                        <hr
                          style={{
                            width: '100%',
                            textAlign: 'center',
                            marginLeft: 0,
                            borderColor: '#D2D2D2',
                            margin: '0 auto',
                          }}
                        />
                        <div className="flex flex-col self-end mt-4 max-w-full w-[365px]">
                          <div className="flex gap-10 justify-between items-center w-full">
                            <div className="self-stretch my-auto font-semibold">
                              SR 11,164.00
                            </div>
                            <div className="self-stretch my-auto">
                              المبلغ المدفوع
                            </div>
                          </div>
                          <div className="flex gap-10 justify-between items-center self-end mt-1 max-w-full w-[329px]">
                            <div className="self-stretch my-auto font-semibold">
                              SR 0.00
                            </div>
                            <div className="self-stretch my-auto">
                              مبلغ مستحق
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          marginLeft: 0,
                          borderColor: '#D2D2D2',
                          margin: '0 auto',
                        }}
                      />
                    </div>
                  </div>
                  <img
                    loading="lazy"
                    srcSet="/images/QR.png"
                    className="object-contain self-center mt-1 aspect-[1.74] w-[99px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
