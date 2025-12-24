import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import CheckIcon from '/icons/checkIcon.svg';
import { currencyFormated } from '@/utils/currencyFormated';
import CurrencySybmole from './CurrencyIcon';

export default function Plans({ changeStep }) {
  return (
    <>
      <div className="flex flex-col items-center gap-8 mt-10 mb-12">
        <div className="text-center  ">
          <h3 className="font-bold text-3xl text-[#26262F]">
            شراء خطة الاشتراك
          </h3>
        </div>

        {/* Promotional Banner */}
        <div className="w-full max-w-4xl px-4">
          <div className="bg-gradient-to-r from-[#9b8af5] via-[#8c7df3] to-[#7d6ff1] rounded-2xl p-6 text-center shadow-lg">
            <h4 className="text-white font-bold text-xl mb-2">
              عروض وخصومات رائعة على جميع الباقات
            </h4>
            <p className="text-white/60 text-sm">
              لا تفوت الفرصة! ابدأ الآن ووفر الكثير
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-stretch gap-6 w-full max-w-6xl px-4">


          {/* الخطة الممتازة */}
          <Card className="group flex flex-col items-center relative border-2 border-gray-200 hover:border-[#7272F6] rounded-xl w-full sm:w-[335px] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white">
            {/* <div className="absolute -top-3 left-4">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold px-4 py-1 rounded-full text-xs shadow-md">
                وفر %16
              </span>
            </div> */}

            <CardHeader className="w-full text-center pt-8">
              <CardTitle className="font-bold text-2xl text-[#26262F]">
                المتقدمة
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 w-full px-6 pt-4">
              <div className="bg-gradient-to-br from-[#F5F5FF] to-[#E1E0F0] w-full py-4 rounded-xl border-2 border-[#7272F6]/20 group-hover:border-[#7272F6]/40 transition-all duration-300">
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-5xl font-bold text-[#7272F6]">
                      199
                    </span>

                    <span className="text-lg font-bold text-[#7272F6]">
                      شهرياً
                    </span>
                    <span className="text-lg font-bold text-[#7272F6]">
                      /  <CurrencySybmole size="24px" />
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-sm text-gray-600">
                      سنوياً
                    </span>
                    <span className="text-sm text-gray-600">
                      <CurrencySybmole className='text-gray-600' size="16px" /> 1999
                    </span>

                    <span className="text-sm text-gray-600">
                      أو
                    </span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="flex flex-col gap-2 mt-2" dir="rtl">
                <div className="flex items-start gap-2">
                  <img
                    className="w-4 h-4 mt-0.5 shrink-0"
                    src={CheckIcon}
                    alt="check"
                  />
                  <p className="text-xs text-gray-700">
                    إصدار فواتير مبسطة للعملاء بسهولة
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-4 h-4 mt-0.5 shrink-0"
                    src={CheckIcon}
                    alt="check"
                  />
                  <p className="text-xs text-gray-700">
                    إصدار فواتير ضريبية متوافقة مع الانظمة
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-4 h-4 mt-0.5 shrink-0"
                    src={CheckIcon}
                    alt="check"
                  />
                  <p className="text-xs text-gray-700">
                    انشاء عروض اسعار احترافية
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-4 h-4 mt-0.5 shrink-0"
                    src={CheckIcon}
                    alt="check"
                  />
                  <p className="text-xs text-gray-700">
                    تسجيل وإدارة فواتير المشتريات
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-4 h-4 mt-0.5 shrink-0"
                    src={CheckIcon}
                    alt="check"
                  />
                  <p className="text-xs text-gray-700">
                    نظام ادارة المخزون
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 w-full px-6 pb-6 mt-auto">
              <div className="flex items-center gap-2 justify-center" dir="rtl">
                <img className="w-3 h-3" src={CheckIcon} alt="check icon" />
                <p className="text-xs text-gray-500">
                  جميع الأسعار شاملة ضريبة القيمة المضافة
                </p>
              </div>

              <Button
                onClick={changeStep}
                className="w-full h-11 rounded-lg text-white bg-[#7272F6] hover:bg-[#5656E8] font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300"
              >
                جرب الان مجاناً
              </Button>
            </CardFooter>
          </Card>


          {/* الخطة الشاملة - Featured */}
          <Card className="group flex flex-col items-center relative bg-gradient-to-br from-[#7272F6] via-[#6363F0] to-[#5656E8] rounded-xl w-full sm:w-[335px] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0">
            <div className="absolute -top-3 right-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-4 py-1 rounded-full text-xs shadow-lg">
                الأكثر مبيعاً
              </span>
            </div>
            {/* <div className="absolute -top-3 left-4">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold px-4 py-1 rounded-full text-xs shadow-md">
                وفر %16
              </span>
            </div> */}

            <CardHeader className="w-full text-center pt-10">
              <CardTitle className="font-bold text-2xl text-white">
                المتوسطة
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 w-full px-6 pt-4">
              <div className="bg-white w-full py-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-5xl font-bold text-[#7272F6]">
                      129
                    </span>

                    <span className="text-lg font-bold text-[#7272F6]">
                      شهرياً
                    </span>
                    <span className="text-lg font-bold text-[#7272F6]">
                      /   <CurrencySybmole size="24px" />
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-sm text-gray-600">
                      سنوياً
                    </span>
                    <span className="text-sm text-gray-600">
                      <CurrencySybmole className='text-gray-600' size="16px" /> 1299
                    </span>
                    <span className="text-sm text-gray-600">
                      أو
                    </span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="flex flex-col gap-2 mt-2" dir="rtl">
                <div className="flex items-start gap-2">
                  <img
                    className="w-4 h-4 mt-0.5 shrink-0 brightness-10"
                    src={CheckIcon}
                    alt="check"
                  />
                  <p className="text-xs text-white opacity-70">
                    إصدار فواتير مبسطة للعملاء بسهولة
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-4 h-4 mt-0.5 shrink-0 brightness-10"
                    src={CheckIcon}
                    alt="check"
                  />
                  <p className="text-xs text-white opacity-70">
                    إصدار فواتير ضريبية متوافقة مع الانظمة
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-4 h-4 mt-0.5 shrink-0 brightness-10"
                    src={CheckIcon}
                    alt="check"
                  />
                  <p className="text-xs text-white opacity-70">
                    إنشاء عروض أسعار احترافية
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 w-full px-6 pb-6 mt-auto">
              <div className="flex items-center gap-2 justify-center" dir="rtl">
                <img
                  className="w-3 h-3 brightness-10"
                  src={CheckIcon}
                  alt="check icon"
                />
                <p className="text-xs text-white opacity-70">
                  جميع الأسعار شاملة ضريبة القيمة المضافة
                </p>
              </div>

              <Button
                onClick={changeStep}
                className="w-full h-11 rounded-lg bg-white text-[#7272F6] hover:bg-gray-50 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                جرب الان مجاناً
              </Button>
            </CardFooter>
          </Card>

          {/* الخطة الأساسية */}
          <Card className="group flex flex-col items-center relative border-2 border-gray-200 hover:border-[#7272F6] rounded-xl w-full sm:w-[335px] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white">
            {/* <div className="absolute -top-3 left-4">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold px-4 py-1 rounded-full text-xs shadow-md">
                وفر %15
              </span>
            </div> */}

            <CardHeader className="w-full text-center pt-8">
              <CardTitle className="font-bold text-2xl text-[#26262F]">
                الأساسية
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 w-full px-6 pt-4">
              <div className="bg-gradient-to-br from-[#F5F5FF] to-[#E1E0F0] w-full py-4 rounded-xl border-2 border-[#7272F6]/20 group-hover:border-[#7272F6]/40 transition-all duration-300">
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-5xl font-bold text-[#7272F6]">
                      69
                    </span>
                    <span className="text-lg font-bold text-[#7272F6]">
                      شهرياً
                    </span>
                    <span className="text-lg font-bold text-[#7272F6]">
                      / <CurrencySybmole size="24px" />
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-sm text-gray-600">
                      سنوياً
                    </span>
                    <span className="text-sm text-gray-600">
                      <CurrencySybmole className='text-gray-600' size="16px" /> 699
                    </span>
                    <span className="text-sm text-gray-600">
                      أو
                    </span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="flex flex-col gap-2 mt-2" dir="rtl">
                <div className="flex items-start gap-2">
                  <img
                    className="w-4 h-4 mt-0.5 shrink-0"
                    src={CheckIcon}
                    alt="check"
                  />
                  <p className="text-xs text-gray-700">
                    إصدار فواتير مبسطة للعملاء بسهولة
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    className="w-4 h-4 mt-0.5 shrink-0"
                    src={CheckIcon}
                    alt="check"
                  />
                  <p className="text-xs text-gray-700">
                    إصدار فواتير ضريبية متوافقة مع الانظمة
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 w-full px-6 pb-6 mt-auto">
              <div className="flex items-center gap-2 justify-center" dir="rtl">
                <img className="w-3 h-3" src={CheckIcon} alt="check icon" />
                <p className="text-xs text-gray-500">
                  جميع الأسعار شاملة ضريبة القيمة المضافة
                </p>
              </div>

              <Button
                onClick={changeStep}
                className="w-full h-11 rounded-lg text-white bg-[#7272F6] hover:bg-[#5656E8] font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300"
              >
                جرب الان مجاناً
              </Button>
            </CardFooter>
          </Card>



        </div>
      </div>
    </>
  );
}
