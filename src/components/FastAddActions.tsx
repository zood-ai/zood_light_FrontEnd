import { IconLoader } from '@tabler/icons-react';
import { AlertDialog, AlertDialogContent } from './ui/alert-dialog';
import { Button } from './custom/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FastAddActions({ isOpen, onClose }) {
  let navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className=" ">
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-[1107px] bg-transparent border-none border     ">
          <div className="">
            <div className="relative">
              <div className="flex flex-col rounded-none max-w-[553px]">
                <div className="flex flex-col px-8 py-8 w-full bg-white rounded max-md:px-5 max-md:max-w-full">
                  <div className="self-center text-xl font-medium text-right text-black">
                    اضافة سريعة
                  </div>
                  <div className="mt-7 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col">
                      <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col items-center grow px-2 pt-8 pb-2 w-full text-sm font-medium text-right text-white bg-white rounded border border-gray-200 border-solid max-md:mt-6">
                          <div className=" ">
                            <svg
                              width="39"
                              height="52"
                              viewBox="0 0 39 52"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M31.9239 3.45265C28.728 3.45265 28.728 0 25.5321 0C22.3362 0 22.3362 3.45265 19.1402 3.45265C15.9443 3.45265 15.9443 0 12.7484 0C9.55246 0 9.55246 3.45265 6.35654 3.45265C3.16061 3.45265 3.19593 0 0 0V52C3.19593 52 3.19593 48.5474 6.39185 48.5474C9.58778 48.5474 9.58778 52 12.7837 52C15.9796 52 15.9796 48.5474 19.1756 48.5474C22.3715 48.5474 22.3715 52 25.5674 52C28.7633 52 28.7633 48.5474 31.9593 48.5474C35.1552 48.5474 35.1552 52 38.3511 52V0C35.1552 0 35.1552 3.45265 31.9593 3.45265H31.9239ZM32.8421 38.61H5.19117V34.0533H32.8421V38.61ZM32.8421 28.4274H5.19117V23.8706H32.8421V28.4274ZM32.8421 18.3674H5.19117V13.8106H32.8421V18.3674Z"
                                fill="#363088"
                              />
                            </svg>
                          </div>
                          <Button
                            onClick={() => {
                              onClose();
                              navigate('/zood-dashboard/products/add');
                            }}
                            className="flex flex-col justify-center items-center px-6 py-1.5 mt-10 w-full  rounded min-h-[39px] max-md:px-5 max-md:mt-10"
                          >
                            <div className="gap-3 self-stretch">
                              {t('ADD_PRODUCT')}
                            </div>
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col items-center grow px-2 pt-8 pb-2 w-full text-sm font-medium text-right text-white bg-white rounded border border-gray-200 border-solid max-md:mt-6">
                          <div className=" ">
                            <svg
                              width="51"
                              height="51"
                              viewBox="0 0 51 51"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M25.5 0C11.4154 0 0 11.2 0 25.0189C0 38.8377 11.4154 50.0377 25.5 50.0377C39.5846 50.0377 51 38.8377 51 25.0189C51 11.2 39.5846 0 25.5 0ZM25.5 7.47766C30.1669 7.47766 33.944 11.1835 33.944 15.7624C33.944 20.3412 30.1669 24.0471 25.5 24.0471C20.8331 24.0471 17.0727 20.3412 17.0727 15.7624C17.0727 11.2 20.8499 7.47766 25.5 7.47766ZM25.5 43.4989C20.8499 43.4989 16.6027 41.8354 13.3124 39.0848C12.5066 38.4095 12.0533 37.4377 12.0533 36.4001C12.0533 31.7718 15.8808 28.0495 20.5981 28.0495H30.4187C35.1527 28.0495 38.9467 31.7554 38.9467 36.4001C38.9467 37.4377 38.4934 38.4095 37.6876 39.0848C34.3973 41.8354 30.1501 43.4989 25.5 43.4989Z"
                                fill="#363088"
                              />
                            </svg>
                          </div>
                          <Button
                            onClick={() => {
                              onClose();

                              navigate('/zood-dashboard/customers/add');
                            }}
                            className="flex flex-col justify-center items-center px-6 py-1.5 mt-10 w-full  rounded min-h-[39px] max-md:px-5 max-md:mt-10"
                          >
                            <div className="gap-3 self-stretch">
                              {t('ADD_CUSTOMER')}
                            </div>
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col items-center grow px-2 pt-8 pb-2 w-full text-sm font-medium text-right text-white bg-white rounded border border-gray-200 border-solid max-md:mt-6 mt-2">
                          <div className=" ">
                            <svg
                              width="52"
                              height="40"
                              viewBox="0 0 52 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M26.7722 1.4836L34.2256 16.7127L52 11.8836L47.9963 0.130877L26.7722 1.4836Z"
                                fill="#363088"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M25.2278 1.36727L17.7744 16.5818L0 11.7673L4.00375 0L25.2278 1.36727Z"
                                fill="#363088"
                              />
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.01405 17.1782V34.3854L26.0605 39.7091L47.1598 33.6436L47.049 16.8L31.8375 20.3927L26.0605 8.75635L18.2747 21.1345L6.01405 17.1782Z"
                                fill="#363088"
                              />
                            </svg>
                          </div>
                          <Button
                            onClick={() => {
                              onClose();

                              navigate(
                                '/zood-dashboard/individual-invoices/add'
                              );
                            }}
                            className="flex flex-col justify-center items-center px-6 py-1.5 mt-10 w-full  rounded min-h-[39px] max-md:px-5 max-md:mt-10"
                          >
                            <div className="gap-3 self-stretch">
                              {t('ADD_INVOICE')}
                            </div>{' '}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <img
                onClick={onClose}
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/86098466758eefea48c424850dc7f8dc58fa0a42b1b3b43e6d08b5eb236f964e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                className="object-contain shrink-0 self-start mt-4 w-11 aspect-square absolute right-[-70px] top-0 cursor-pointer hover:scale-110"
              />
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
