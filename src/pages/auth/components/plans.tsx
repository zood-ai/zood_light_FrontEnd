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

export default function Plans({ changeStep }) {
  return (
    <>
      <div className="flex flex-col items-center gap-8 mt-10 mb-12">
        <div className="text-center space-y-2">
          <h3 className="font-bold text-3xl text-[#26262F]">
            اختر خطة الاشتراك
          </h3>
          <p className="text-gray-600 text-base">
            اختر الخطة المناسبة لاحتياجات عملك
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-stretch gap-6 w-full max-w-6xl px-4">
          {/* الخطة الممتازة */}
          <Card className="group flex flex-col items-center relative border-2 border-gray-200 hover:border-[#7272F6] rounded-xl w-full sm:w-[335px] h-[400px] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white">
            <CardHeader className="w-full text-center pt-8">
              <CardTitle className="font-bold text-2xl text-[#26262F]">
                الممتازة
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 justify-center items-center flex-1 w-full px-6">
              <div className="bg-gradient-to-br from-[#F5F5FF] to-[#E1E0F0] w-full py-4 rounded-xl border-2 border-[#7272F6]/20 group-hover:border-[#7272F6]/40 transition-all duration-300">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[24px] font-bold text-[#7272F6] mt-1">
                    SR
                  </span>
                  <span className="text-5xl font-bold text-[#7272F6]">
                    627
                  </span>
                </div>
              </div>
              <p className="text-center text-gray-600 font-medium text-base">
                كل 6 شهور
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 w-full px-6 pb-6">
              <div className="flex items-center gap-3 justify-center">
                <img
                  className="w-4 h-4"
                  src={CheckIcon}
                  alt="check icon"
                />
                <p className="text-sm text-gray-600">
                  جميع الأسعار شاملة ضريبة القيمة المضافة
                </p>
              </div>

              <Button
                onClick={changeStep}
                className="w-full h-12 rounded-lg text-white bg-[#7272F6] hover:bg-[#5656E8] font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300"
              >
                اختر الخطة
              </Button>
            </CardFooter>
          </Card>

          {/* الخطة الشاملة - Featured */}
          <Card className="group flex flex-col items-center relative bg-gradient-to-br from-[#7272F6] via-[#6363F0] to-[#5656E8] rounded-xl w-full sm:w-[335px] h-[420px] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0">
            <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold px-6 py-2 rounded-full text-sm shadow-lg">
                الأكثر مبيعاً
              </span>
            </div>

            <CardHeader className="w-full text-center pt-10">
              <CardTitle className="font-bold text-2xl text-white">
                الشاملة
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 justify-center items-center flex-1 w-full px-6">
              <div className="bg-white w-full py-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[24px] font-bold text-[#7272F6] mt-1">
                    SR
                  </span>
                  <span className="text-5xl font-bold text-[#7272F6]">
                    999
                  </span>
                </div>
              </div>
              <p className="text-center text-white/90 font-medium text-base">
                كل 12 شهور
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 w-full px-6 pb-6">
              <div className="flex items-center gap-3 justify-center">
                <img
                  className="w-4 h-4 brightness-0 invert"
                  src={CheckIcon}
                  alt="check icon"
                />
                <p className="text-sm text-white/95">
                  جميع الأسعار شاملة ضريبة القيمة المضافة
                </p>
              </div>

              <Button
                onClick={changeStep}
                className="w-full h-12 rounded-lg bg-white text-[#7272F6] hover:bg-gray-50 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
              >
                اختر الخطة
              </Button>
            </CardFooter>
          </Card>

          {/* الخطة الأساسية */}
          <Card className="group flex flex-col items-center relative border-2 border-gray-200 hover:border-[#7272F6] rounded-xl w-full sm:w-[335px] h-[400px] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white">
            <CardHeader className="w-full text-center pt-8">
              <CardTitle className="font-bold text-2xl text-[#26262F]">
                الأساسية
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 justify-center items-center flex-1 w-full px-6">
              <div className="bg-gradient-to-br from-[#F5F5FF] to-[#E1E0F0] w-full py-4 rounded-xl border-2 border-[#7272F6]/20 group-hover:border-[#7272F6]/40 transition-all duration-300">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[24px] font-bold text-[#7272F6] mt-1">
                    SR
                  </span>
                  <span className="text-5xl font-bold text-[#7272F6]">
                    373
                  </span>
                </div>
              </div>
              <p className="text-center text-gray-600 font-medium text-base">
                كل 3 أشهر
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 w-full px-6 pb-6">
              <div className="flex items-center gap-3 justify-center">
                <img
                  className="w-4 h-4"
                  src={CheckIcon}
                  alt="check icon"
                />
                <p className="text-sm text-gray-600">
                  جميع الأسعار شاملة ضريبة القيمة المضافة
                </p>
              </div>

              <Button
                onClick={changeStep}
                className="w-full h-12 rounded-lg text-white bg-[#7272F6] hover:bg-[#5656E8] font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300"
              >
                اختر الخطة
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
