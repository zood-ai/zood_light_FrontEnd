import { useSelector } from 'react-redux';
import { useState } from 'react';
import { ViewModalProps } from './ViewModal.types';
import createCrudService from '@/api/services/crudService';

import './ViewModal.css';

function printDiv(pageSize) {
  const content = document.getElementById('myDiv').innerHTML;
  const printWindow = window.open('', '_blank', 'width=600,height=400');

  // Set up styles based on the page size
  let pageStyle = '';
  const tailwindStylesheet = `
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  `;

  if (pageSize === 'A4') {
    pageStyle = `
      .print-content {
        width: 210mm;
        height: 297mm;
        padding: 20mm;
        box-sizing: border-box;
      }
    `;
  } else if (pageSize === '80mm') {
    pageStyle = `
      .print-content {
        width: 80mm;
        padding: 5mm;
        box-sizing: border-box;
      }
    `;
  }

  // Create the print window content
  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        ${tailwindStylesheet} <!-- Import Tailwind CSS -->
        <style>
          body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          ${pageStyle} /* Apply the chosen style */
        </style>
      </head>
      <body>
        <div class="print-content">${content}</div>
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
}

export const ViewModal: React.FC<ViewModalProps> = () => {
  const data = useSelector((state: any) => state.toggleAction.data);

  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: Taxes } = createCrudService<any>('manage/taxes').useGetAll();
  const { data: customerInfo } = createCrudService<any>(
    'manage/customers'
  ).useGetById(`${data?.customer?.id}`);
  const { data: orderInfo } = createCrudService<any>('orders').useGetById(
    `${data?.id}`
  );
  console.log({ data, settings, customerInfo, orderInfo, Taxes });
  const [size, setSize] = useState('A4');
  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
  };

  const handlePrint = () => {
    printDiv(size);
    // Set custom print styles based on size
    // const printWindow = window.open('', '_blank');
    // printWindow.document.write(`
    //   <html>
    //     <head>
    //       <style>
    //         /* Hide elements with class no-print */
    //         .no-print { display: none !important; }
    //         /* Set paper size styles */
    //         @media print {
    //           body { margin: 0; }
    //           ${
    //             size === '80mm'
    //               ? '@page { size: 80mm auto; }'
    //               : '@page { size: A5; }'
    //           }
    //         }
    //       </style>
    //     </head>
    //     <body onload="window.print(); window.close();">
    //       ${document.querySelector('.printable').outerHTML}
    //     </body>
    //   </html>
    // `);
    // printWindow.document.close();
    // window.print();
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 rounded-none h-[90vh] max-w-[80vw] overflow-y-scroll relative ">
        <div className="flex flex-col rounded-none">
          <div className="px-11 py-a12 w-full bg-white rounded-lg border border-gray-200 border-solid max-md:px-5 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div
                id="myDiv"
                className="print-content flex flex-col w-[74%] max-md:ml-0 max-md:w-full"
              >
                <div className="flex flex-col px-3 pt-4 pb-2 mx-auto mt-8 w-full text-sm bg-white rounded-lg border border-gray-200 border-solid text-zinc-800 max-md:mt-10 max-md:max-w-full">
                  <div className="self-center ml-4 font-semibold text-right">
                    فاتورة ضريبية مبسطة
                  </div>
                  <div className="flex flex-wrap mt-4 text-right bg-white rounded border border-gray-200 border-solid max-md:mr-1 max-md:max-w-full">
                    {settings?.data?.business_tax_number && (
                      <div className="flex flex-col flex-1 px-5 pt-4 pb-2 bg-white rounded border border-gray-200 border-solid max-md:pl-5 justify-between">
                        <div className="self-center">الرقم الضريبي</div>
                        <div className="mt-4 font-semibold">
                          {settings?.data?.business_tax_number || ''}
                        </div>
                      </div>
                    )}
                    {data?.business_date && (
                      <div className="flex z-10 flex-col flex-1 px-6 pt-4 pb-2 bg-white border border-gray-200 border-solid max-md:px-5 justify-between">
                        <div className="self-center">تاريخ الفاتورة</div>
                        <div className="flex gap-2 mt-4 font-semibold whitespace-nowrap">
                          <div className="grow">
                            {data?.business_date?.split(' ')[0] || ''}
                          </div>
                          <div>
                            {data?.business_date?.split(' ')[1].slice(0, 5) ||
                              ''}
                          </div>
                        </div>
                      </div>
                    )}
                    {customerInfo?.data?.phone && (
                      <div className="flex z-10 flex-col flex-1 px-8 pt-4 pb-2 whitespace-nowrap bg-white border border-gray-200 border-solid max-md:px-5 justify-between">
                        <div className="self-center">الجوال</div>
                        <div className="self-start mt-4 font-semibold">
                          {customerInfo?.data?.phone}
                        </div>
                      </div>
                    )}
                    {data?.customer?.name && (
                      <div className="flex z-10 flex-col flex-1 items-center px-8 pt-4 pb-2 bg-white border border-gray-200 border-solid max-md:px-5 justify-between">
                        <div>اسم العميل</div>
                        <div className="mt-4 font-semibold">
                          {data?.customer?.name || ''}
                        </div>
                      </div>
                    )}
                    {data?.reference && (
                      <div className="flex flex-col flex-1 items-center px-8 pt-4 pb-2 bg-white rounded-none border border-gray-200 border-solid max-md:px-5 justify-between">
                        <div>رقم الفاتورة</div>
                        <div className="mt-4 font-semibold">
                          {data?.reference || ''}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex z-10 flex-wrap gap-5 justify-between px-4 py-1.5 mt-4 w-full font-semibold text-right text-white rounded border border-gray-200 border-solid bg-zinc-500 max-md:mr-1 max-md:max-w-full">
                    <div className="flex w-full text-center">
                      <div className="w-1/3">المجموع (شامل الضريبة)</div>
                      <div className="w-1/3">سعر الوحدة</div>
                      <div className="w-1/3">كمية</div>
                      <div className="w-1/3">اسم المنتج</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-5 justify-between py-5 mt-0  bg-white rounded border border-gray-200 border-solid w-[802px] max-w-full max-md:mr-1 text-center px-3">
                    {orderInfo?.data?.products.map((e) => (
                      <div className="flex font-semibold w-full">
                        <div className="w-1/3">{e?.pivot?.total_price}</div>
                        <div className="w-1/3">{e?.pivot?.unit_price}</div>
                        <div className="w-1/3">{e?.pivot?.quantity}</div>
                        <div className="w-1/3">{e.name}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-5 justify-between mt-10 max-md:mt-10 max-md:mr-1 max-md:max-w-full">
                    <div className="flex flex-col items-start font-semibold">
                      <div className="text-right">
                        SR {orderInfo?.data?.total_price || 0}
                      </div>
                      <div className="mt-4 text-right">
                        SR {orderInfo?.data?.total_taxes || 0}
                      </div>
                      <div className="mt-4 text-right">
                        SR {orderInfo?.data?.subtotal_price || 0}
                      </div>
                      <div className="mt-4 text-right">
                        SR {orderInfo?.data?.discount_amount || 0}
                      </div>
                      <div className="mt-4 text-right">
                        SR{' '}
                        {orderInfo?.data?.payments?.reduce(
                          (sum, item) => sum + item.amount,
                          0
                        ) || 0}
                      </div>

                      {orderInfo?.data?.payments?.map((e) => (
                        <>
                          <div className="mt-4 text-right">
                            {e.payment_method?.name || '----'}
                          </div>
                          <div className="mt-4 text-right">
                            SR {e.amount || 0}
                          </div>
                        </>
                      ))}

                      {/* <div className="mt-4 text-right">
                        {orderInfo?.data?.payments[0]?.payment_method?.name ||
                          '----'}
                      </div>
                      <div className="mt-4 text-right">
                        SR {orderInfo?.data?.payments[0]?.amount || 0}
                      </div> */}

                      <div className="mt-4 text-right">
                        SR{' '}
                        {(orderInfo?.data?.payments.reduce(
                          (sum, item) => sum + item.amount,
                          0
                        ) > orderInfo?.data?.total_price
                          ? orderInfo?.data?.payments.reduce(
                              (sum, item) => sum + item.amount,
                              0
                            ) - orderInfo?.data?.total_price
                          : 0) || 0}
                      </div>
                      {/* <div className="self-stretch mt-4">لا يوجد ملاحظات</div> */}
                    </div>
                    <div className="flex flex-col text-right">
                      <div className="">
                        الاجمالي (باستثناء ضريبة القيمة المضافة)
                      </div>
                      <div className="flex flex-col items-end  mt-4 max-md:pl-5">
                        <div className="">
                          مجموع ضريبة القيمة المضافة %{Taxes?.data[0]?.rate}
                        </div>
                        <div className="mt-4">المبلغ الإجمالي</div>
                        <div className="mt-4">تخفيض</div>
                        <div className="mt-4">المبلغ الإجمالي المدفوع</div>
                        {orderInfo?.data?.payments?.map((e, idx) => (
                          <>
                            <div className="mt-4"> نوع الدفع </div>
                            <div className="mt-4">المبلغ المدفوع </div>
                          </>
                        ))}
                        <div className="mt-4">إجمالي المبلغ المستحق</div>
                        {/* <div className="mt-4">الملاحظات</div> */}
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
                  <div className="flex flex-col self-end mx-auto items-center max-w-full rounded-none w-[154px] mt-10">
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
