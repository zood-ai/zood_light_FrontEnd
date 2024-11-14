import { useSelector } from 'react-redux';

import { useState } from 'react';

import { ViewModalProps } from './ViewModal.types';

import './ViewModal.css';

export const ViewModal: React.FC<ViewModalProps> = () => {
  const data = useSelector((state: any) => state.toggleAction.data);
  console.log({ data });
  const [size, setSize] = useState('A4');
  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
  };
  return (
    <>
      <div className="flex flex-wrap gap-4 rounded-none h-[90vh] overflow-y-scroll relative ">
        <div className="flex flex-col rounded-none">
          <div className="px-11 py-a12 w-full bg-white rounded-lg border border-gray-200 border-solid max-md:px-5 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="flex flex-col w-[74%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col px-3 pt-4 pb-2 mx-auto mt-8 w-full text-sm bg-white rounded-lg border border-gray-200 border-solid text-zinc-800 max-md:mt-10 max-md:max-w-full">
                  <div className="self-center ml-4 font-semibold text-right">
                    فاتورة ضريبية مبسطة
                  </div>
                  <div className="flex flex-wrap mt-4 text-right bg-white rounded border border-gray-200 border-solid max-md:mr-1 max-md:max-w-full">
                    <div className="flex flex-col flex-1 px-5 pt-4 pb-2 bg-white rounded border border-gray-200 border-solid max-md:pl-5">
                      <div className="self-center">الرقم الضريبي</div>
                      <div className="mt-4 font-semibold">311006624700003</div>
                    </div>
                    <div className="flex z-10 flex-col flex-1 px-6 pt-4 pb-2 bg-white border border-gray-200 border-solid max-md:px-5">
                      <div className="self-center">تاريخ الفاتورة</div>
                      <div className="flex gap-2 mt-4 font-semibold whitespace-nowrap">
                        <div className="grow">01-10-2024</div>
                        <div>12:41</div>
                      </div>
                    </div>
                    <div className="flex z-10 flex-col flex-1 px-8 pt-4 pb-2 whitespace-nowrap bg-white border border-gray-200 border-solid max-md:px-5">
                      <div className="self-center">الجوال</div>
                      <div className="self-start mt-4 font-semibold">
                        0553223734
                      </div>
                    </div>
                    <div className="flex z-10 flex-col flex-1 items-center px-8 pt-4 pb-2 bg-white border border-gray-200 border-solid max-md:px-5">
                      <div>اسم العميل</div>
                      <div className="mt-4 font-semibold">احمد</div>
                    </div>
                    <div className="flex flex-col flex-1 items-center px-8 pt-4 pb-2 bg-white rounded-none border border-gray-200 border-solid max-md:px-5">
                      <div>رقم الفاتورة</div>
                      <div className="mt-4 font-semibold">INV0415</div>
                    </div>
                  </div>
                  <div className="flex z-10 flex-wrap gap-5 justify-between px-4 py-1.5 mt-4 w-full font-semibold text-right text-white rounded border border-gray-200 border-solid bg-zinc-500 max-md:mr-1 max-md:max-w-full">
                    <div className="flex gap-10 max-md:max-w-full">
                      <div>المجموع (شامل الضريبة)</div>
                      <div>سعر الوحدة</div>
                      <div>كمية</div>
                    </div>
                    <div>اسم المنتج</div>
                  </div>
                  <div className="flex flex-wrap gap-5 justify-between py-5 pr-4 pl-20 mt-0 max-w-full text-right bg-white rounded border border-gray-200 border-solid w-[802px] max-md:pl-5 max-md:mr-1">
                    <div className="flex gap-10 font-semibold">
                      <div className="flex flex-col">
                        <div>SR 53.00</div>
                        <div className="mt-1">SR 53.00</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex gap-5 justify-between">
                          <div>SR 45.05</div>
                          <div>1</div>
                        </div>
                        <div className="flex gap-5 justify-between mt-1">
                          <div>SR 45.05</div>
                          <div>1</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col self-start">
                      <div className="self-end">ملح</div>
                      <div className="mt-1">صماء دقيق</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-5 justify-between mt-10 max-md:mt-10 max-md:mr-1 max-md:max-w-full">
                    <div className="flex flex-col items-start font-semibold">
                      <div className="text-right">SR 9,489.40</div>
                      <div className="mt-4 text-right">SR 1,674.60</div>
                      <div className="mt-4 text-right">SR 11,164.00</div>
                      <div className="mt-4 text-right">- SR 0.00</div>
                      <div className="mt-4 text-right">SR 11,164.00</div>
                      <div className="mt-4 text-right">حوالة بنكية</div>
                      <div className="mt-4 text-right">SR 11,164.00</div>
                      <div className="mt-4 text-right">SR 0.00</div>
                      <div className="self-stretch mt-4">لا يوجد ملاحظات</div>
                    </div>
                    <div className="flex flex-col text-right">
                      <div>الاجمالي (باستثناء ضريبة القيمة المضافة)</div>
                      <div className="flex flex-col items-end pl-10 mt-4 max-md:pl-5">
                        <div className="self-start">
                          مجموع ضريبة القيمة المضافة %15
                        </div>
                        <div className="mt-4">المبلغ الإجمالي</div>
                        <div className="mt-4">تخفيض</div>
                        <div className="mt-4">المبلغ الإجمالي المدفوع</div>
                        <div className="mt-4">نوع الدفع</div>
                        <div className="mt-4">المبلغ المدفوع</div>
                        <div className="mt-4">إجمالي المبلغ المستحق</div>
                        <div className="mt-4">الملاحظات</div>
                      </div>
                    </div>
                  </div>
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
              <div className="flex flex-col ml-5 w-[26%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col max-md:mt-10">
                  <div className="flex flex-col w-full font-semibold text-right">
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col w-full text-zinc-800">
                        <div className="flex flex-col w-full text-sm">
                          <div className="flex self-end max-w-full min-h-[64px] w-[130px]" />
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
                            <button
                              onClick={() => handleSizeChange('80mm')}
                              className={`self-stretch my-auto`}
                            >
                              80mm
                            </button>
                            <div
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
                              className={`flex shrink-0 self-stretch my-auto w-3 h-3 ${
                                size == 'A4' && 'bg-indigo-900'
                              } rounded-full border-4 border-gray-200 border-solid`}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => console.log('PRINT')}
                          className="gap-2.5 self-end px-8 py-1 mt-4 max-w-full text-white bg-indigo-900 rounded-lg min-h-[32px] w-[100px] max-md:px-5"
                        >
                          طباعة
                        </button>
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
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0545702f8efd834df3b6f82096b53bd74059f9eaf11522eb1eb8a7fe4841708e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                        className="object-contain aspect-[0.99] w-[106px]"
                      />
                    </div>
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
