import React, { useState } from 'react';

import { RegisterFormProps } from './RegisterForm.types';

import './RegisterForm.css';
import { Button } from '../button';
import { Input } from '@/components/ui/input';
import useDirection from '@/hooks/useDirection';
import mobilHand from '/icons/home page/mobilHand.svg';
import { useNavigate } from 'react-router-dom';
import { CardIcon } from '../CardIcon';

export const RegisterForm: React.FC<RegisterFormProps> = () => {
  const servicesOne = [
    { text: 'خياط', imgSrc: '/icons/home page/image3.svg' },
    { text: 'حداد', imgSrc: '/icons/home page/image5.svg' },
    { text: 'مشحمة', imgSrc: '/icons/home page/image6.svg' },
    { text: 'صيانة اجهزه', imgSrc: '/icons/home page/Union.svg' },
    { text: 'صيانة منزلية', imgSrc: '/icons/home page/Group 17.svg' },
    { text: 'ملحمة', imgSrc: '/icons/home page/Vector-2.svg' },
    { text: 'الاتصالات', imgSrc: '/icons/home page/Vector-1.svg' },
  ];
  const servicesTwo = [
    { text: 'حيوانات أليفة', imgSrc: '/icons/home page/Group 24.svg' },
    { text: 'بوفية ومطاعم', imgSrc: '/icons/home page/Vector-6.svg' },
    { text: 'ورود', imgSrc: '/icons/home page/Vector-5.svg' },
    { text: 'صحة ولياقة', imgSrc: '/icons/home page/Group 27.svg' },
    { text: 'لوازم رحلات', imgSrc: '/icons/home page/Vector-4.svg' },
    { text: 'عمل حر', imgSrc: '/icons/home page/Vector-8.svg' },
    { text: 'منتجات', imgSrc: '/icons/home page/image18.svg' },
    { text: 'صالون', imgSrc: '/icons/home page/Group 30.svg' },
    { text: 'خدمات', imgSrc: '/icons/home page/Vector-7.svg' },
    { text: 'محطة وقود', imgSrc: '/icons/home page/Group 32.svg' },
    { text: 'المختبرات الطبية', imgSrc: '/icons/home page/Group 37.svg' },
    { text: 'تأجير', imgSrc: '/icons/home page/Group 36.svg' },
    { text: 'مطاحن', imgSrc: '/icons/home page/Group 35.svg' },
    { text: 'مفاتيح', imgSrc: '/icons/home page/Group 34.svg' },
    { text: 'مستعمل', imgSrc: '/icons/home page/Group 33.svg' },
  ];
  const servicesTree = [
    { text: 'عسل', imgSrc: '/icons/home page/Group-1.svg' },
    { text: 'مخبز', imgSrc: '/icons/home page/Vector-9.svg' },
    { text: 'خضار وفواكه', imgSrc: '/icons/home page/Group.svg' },
  ];

  const handleSignUp = () => {
    navigate('/zood-signup')
  };
  const isRtl = useDirection();
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex flex-col rounded-none px-4 md:px-[30px] lg:px-[161px] bg-mainBg"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="flex flex-col self-start w-full   max-md:max-w-full">
          <div className="flex  justify-center">
            <div className="flex justify-center  w-full text-base font-semibold rounded-none text-zinc-100">
              <div className="flex   justify-between px-7 py-1.5 w-full bg-white rounded-lg border border-gray-200 border-solid max-md:px-5 max-md:max-w-full">
                <div className="flex flex-wrap gap-6 my-auto max-md:max-w-full">
                  <button className="flex gap-2 cursor-pointer px-5 py-3 bg-green-500 rounded-lg">
                    <div className="grow my-auto">تواصل عبر الواتس</div>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/3769057990693e0194a9bacc9caa2588cf42c25f2fe1a813eeab42095ea7745e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                      className="object-contain shrink-0 w-6 aspect-square"
                    />
                  </button>
                  <Button
                    onClick={() => navigate('/zood-login')}
                    className="cursor-pointer  gap-2 px-5 py-6   rounded-lg"
                  >
                    <div className="flex justify-center items-center gap-md">
                      <div className="grow my-auto ">تسجيل الدخول</div>
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a44193e212a35858d771ad4f2cf220c849be5bdd34776769125b0e013d3c7f94?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                        className="object-contain shrink-0 aspect-[0.96] w-[23px]"
                      />
                    </div>
                  </Button>
                  <div className="flex gap-10 shrink-0 my-auto py-1 px-3 bg-white rounded-lg border border-gray-200 border-solid justify-center items-center">
                    <svg
                      width="23"
                      height="28"
                      viewBox="0 0 23 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_1102_15674)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M17.7258 0L17.8079 0.77105C18.0139 2.69255 17.3422 4.83525 16.0134 6.5044C15.9931 6.5275 15.9697 6.54395 15.9512 6.56705C16.1725 6.55865 16.3934 6.5422 16.6229 6.5639C17.6249 6.6052 20.2584 6.98145 21.9808 9.5123L22.4483 10.2008L21.7478 10.6596C21.1447 11.0358 19.2934 12.3914 19.3186 14.9338C19.347 18.1531 21.9808 19.3333 22.2806 19.4572L22.9992 19.7543L22.758 20.4872C22.5588 21.1211 21.984 22.744 20.8616 24.3946C19.791 25.9662 18.4607 27.9241 16.2105 27.9654C15.1484 27.9916 14.4696 27.6766 13.848 27.4074C13.2566 27.1499 12.749 26.9286 11.9079 26.9286C11.0181 26.9286 10.4803 27.1583 9.85728 27.4257C9.27261 27.6766 8.60908 27.9605 7.68945 27.9986C7.64754 28.0004 7.60562 28.0004 7.56726 28.0004C5.38771 28.0004 3.87311 25.7999 2.86432 24.3355L2.7876 24.2228C0.265984 20.4757 -1.14419 14.3759 1.18277 10.3127C2.46436 8.0724 4.79665 6.6577 7.2696 6.6213C8.23292 6.608 9.11916 6.90515 9.88321 7.2023C10.0139 5.45405 10.8583 3.82305 11.7345 2.7699C13.0076 1.23165 15.1474 0.1057 16.9401 0.0329L17.7258 0ZM16.5011 8.2096C15.4102 8.09585 14.3649 8.52005 13.4349 8.88965C12.733 9.1686 12.1281 9.408 11.5669 9.408C11.0877 9.408 10.5851 9.24805 10.0622 9.04645L9.98196 9.0398L9.97876 9.01495C9.86829 8.9705 9.75747 8.92745 9.6438 8.883C8.90994 8.589 8.10398 8.20435 7.29837 8.27225C5.41684 8.30025 3.63263 9.3933 2.64232 11.1248C0.497934 14.8673 2.29208 20.5611 4.25247 23.4069C5.29465 24.9207 6.40041 26.4166 7.62338 26.3487C8.22972 26.3239 8.65206 26.1422 9.18985 25.913C9.88356 25.614 10.6711 25.2774 11.909 25.2774C13.1469 25.2774 13.859 25.606 14.5258 25.8965C15.077 26.1377 15.5342 26.3407 16.1793 26.3141C17.4576 26.291 18.3506 25.1223 19.4699 23.4745C20.2037 22.3965 20.673 21.335 20.9394 20.6269C19.8052 19.9567 17.674 18.2581 17.6438 14.9481C17.6185 12.3217 19.0831 10.6509 20.0951 9.81225C18.8319 8.46195 17.2033 8.239 16.5014 8.20925L16.5011 8.2096ZM16.1594 1.81755C15.0266 2.11645 13.8104 2.8742 13.0332 3.8136L13.0314 3.81535C12.3427 4.64415 11.6106 6.0144 11.5353 7.4242C12.7884 7.2394 13.9812 6.3777 14.6966 5.4845C15.5612 4.39985 16.0787 3.0807 16.1594 1.8179V1.81755Z"
                          fill="#37355D"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1102_15674">
                          <rect width="23" height="28" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <svg
                      width="21"
                      height="24"
                      viewBox="0 0 21 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_1102_15671)">
                        <path
                          d="M3.76286 23.9999C3.68426 23.9999 3.60566 23.9969 3.52667 23.9903C2.42473 23.9018 1.41481 23.342 0.756099 22.4548C0 21.4368 0 20.0883 0 17.4017V6.59854C0 3.91155 0 2.56307 0.756099 1.5451C1.41519 0.65787 2.42511 0.0980806 3.52705 0.0095112C4.79118 -0.0920944 5.93453 0.622595 8.2128 2.04661L16.8554 7.44819C18.919 8.738 19.9549 9.38521 20.4285 10.4898C20.8399 11.4495 20.8399 12.5507 20.4285 13.5104C19.9549 14.6146 18.9193 15.2622 16.8554 16.552L8.2128 21.9536C6.07678 23.2887 4.93841 23.9999 3.76286 24.0003V23.9999ZM3.75902 2.55617C3.74944 2.55617 3.74023 2.55617 3.73142 2.55732C3.3641 2.58684 3.02746 2.77357 2.80776 3.06918C2.55586 3.4085 2.55586 4.88658 2.55586 6.59815V17.4013C2.55586 19.1129 2.55586 20.591 2.80776 20.9303C3.02746 21.2259 3.3641 21.4126 3.73142 21.4421C4.15164 21.4759 5.4058 20.693 6.85703 19.7858L15.5 14.3838C16.8523 13.5388 17.9205 12.8709 18.0785 12.5028C18.2158 12.183 18.2158 11.8161 18.0785 11.4959C17.9205 11.1275 16.8523 10.4599 15.5 9.61488L6.85818 4.21406C5.43724 3.32569 4.2057 2.55617 3.75941 2.55617H3.75902Z"
                          fill="#37355D"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1102_15671">
                          <rect width="20.7367" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/5df027893b18a92844e73d9db4cd3230a492dd7622d809a4beffc594465749fe?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                  className="object-contain cursor-pointer shrink-0 aspect-[0.81] w-[51px] "
                />
              </div>
            </div>
          </div>
          <div className="self-center mt-12 ml-3.5 text-3xl font-bold text-slate-700 max-md:mt-10">
            اختر متجرك
          </div>
          <div className="self-start mt-8 text-2xl font-bold text-center text-slate-700 max-md:mr-2.5">
            صيانة
          </div>

          <div className="flex flex-wrap gap-5 mt-4 w-full max-md:max-w-full max-sm:justify-center">
            {servicesOne.map((service) => (
              <CardIcon
                imgSrc={service.imgSrc}
                title={service.text}
                textClass="text-indigo-900"
                iconClass={undefined}
              />
            ))}
          </div>
          <div className="self-start mt-10 text-2xl font-bold text-center text-slate-700 max-md:mr-2.5">
            منتجات وخدمات
          </div>
          <div className="flex flex-wrap gap-5 mt-4 w-full max-md:max-w-full">
            {servicesTwo.map((service) => (
              <CardIcon
                imgSrc={service.imgSrc}
                title={service.text}
                textClass="text-indigo-900"
                iconClass={undefined}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 w-full max-md:max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
            <div className="flex flex-col mt-7 w-full col-span-2">
              <div className="self-start text-2xl font-bold text-right text-slate-700 max-md:mr-2.5">
                أغذية ومشروبات
              </div>
              <div className="flex flex-wrap gap-5 mt-4 w-full max-md:max-w-full ">
                {servicesTree.map((service) => (
                  <CardIcon
                    imgSrc={service.imgSrc}
                    title={service.text}
                    textClass="text-indigo-900"
                    iconClass={undefined}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col ">
              <div className="grow mt-[60px] max-md:mt-10 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col">
                  <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
                    <Button
                      onClick={handleSignUp}
                      className="px-12 py-3 mt-48 w-full text-base font-bold text-white whitespace-nowrap bg-indigo-900 rounded-lg max-md:px-5 max-md:mt-10"
                    >
                      اشتراك
                    </Button>
                  </div>
                  <img src={mobilHand} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
