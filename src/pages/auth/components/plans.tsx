import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { Button } from '@/components/ui/button';
import CheckIcon from '/icons/checkIcon.svg';
import CheckIconWhite from '/icons/checkIconWhite.svg';
export default function Plans({ changeStep }) {
  return (
    <>
      <div className="flex flex-col items-center gap-6 mt-10">
        <h3 className="text-center font-bold   place-content-center text-[24px] text-[#26262F]">
          اختر خطة الاشتراك
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-4    h-[50vh]">
          {/* <Carousel className="relative w-full"> */}
          {/* <CarouselContent className="flex-shrink-0 w-[350px]"> */}
          {/* <CarouselItem> */}
          <Card className="flex flex-col items-center relative border border-[#D2D2D2]    rounded-md w-[317px] h-[335px] ">
            <CardHeader>
              <CardTitle className="font-bold text-2xl leading-10  ">
                الممتازة
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2   justify-center">
              <Button
                onClick={changeStep}
                className="bg-white w-[257px] leading-9 h-[62px] rounded-[8px] text-[#7272F6] text-[36px] font-bold"
                variant="outline"
              >
                <span className="text-[22px] mt-[4px] mr-[2px] font-bold   leading-7">
                  SR
                </span>
                720
              </Button>

              <p className="text-center   font-[500]">كل 6 شهور</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4  mt-auto">
              <div className="flex items-center gap-2 w-[106%]">
                <p className="font-[400] text-[14px]   leading-6">
                  جميع الاسعار شاملة ضريبة القيمة المضافه
                </p>
                <img
                  className="w-[14px] h-[14px]"
                  src={CheckIconWhite}
                  alt="icon page"
                />
              </div>

              <Button
                onClick={changeStep}
                className="w-[112%] rounded-md text-white bg-[#7272F6]"
                variant="outline"
              >
                شراء
              </Button>
            </CardFooter>
          </Card>
          {/* </CarouselItem> */}
          {/* <CarouselItem> */}
          <Card className="flex flex-col items-center relative  bg-[#7272F6] rounded-md w-[335px] h-[353px]   ">
            <CardHeader>
              <span className="font-bold absolute right-[13px] top-[21px] text-right text-[14px] text-[#FFFFFF]">
                اكثر بيع
              </span>

              <CardTitle className="font-bold mt-[16px] text-2xl leading-10 text-[#FFFFFF]">
                الشاملة
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2   justify-center">
              <Button
                onClick={changeStep}
                className="bg-white w-[257px] leading-9 h-[62px] rounded-[8px] text-[#7272F6] text-[36px] font-bold"
                variant="outline"
              >
                <span className="text-[22px] mt-[4px] mr-[2px] font-bold   leading-7">
                  SR
                </span>
                720
              </Button>

              <p className="text-center text-[#E1E0F0] font-[500]">كل 6 شهور</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4  mt-auto">
              <div className="flex items-center w-[106%] gap-2">
                <p className="font-[400] text-[14px] text-[#F5F5F5] leading-6">
                  جميع الاسعار شاملة ضريبة القيمة المضافه
                </p>
                <img
                  className="w-[14px] h-[14px]"
                  src={CheckIcon}
                  alt="icon page"
                />
              </div>

              <Button
                onClick={changeStep}
                className="w-[112%] rounded-md bg-white text-[#7272F6]"
                variant="outline"
              >
                شراء
              </Button>
            </CardFooter>
          </Card>
          {/* </CarouselItem> */}
          {/* <CarouselItem> */}
          <Card className="flex flex-col items-center relative  border border-[#D2D2D2] rounded-md w-[317px] h-[335px] ">
            <CardHeader>
              <CardTitle className="font-bold text-2xl leading-10">
                الاساسية{' '}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2   justify-center">
              <Button
                onClick={changeStep}
                className="bg-white w-[257px] leading-9 h-[62px] rounded-[8px] text-[#7272F6] text-[36px] font-bold"
                variant="outline"
              >
                <span className="text-[22px] mt-[4px] mr-[2px] font-bold   leading-7">
                  SR
                </span>
                720
              </Button>

              <p className="text-center   font-[500]">كل 3 اشهر</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4  mt-auto">
              <div className="flex items-center w-[106%] gap-2">
                <p className="font-[400] text-[14px]   leading-6">
                  جميع الاسعار شاملة ضريبة القيمة المضافه
                </p>
                <img
                  className="w-[14px] h-[14px]"
                  src={CheckIconWhite}
                  alt="icon page"
                />
              </div>

              <Button
                onClick={changeStep}
                className="w-[112%] bg-[#7272F6] rounded-md text-[#FFFFFF]"
                variant="outline"
              >
                شراء
              </Button>
            </CardFooter>
          </Card>
          {/* </CarouselItem> */}
          {/* </CarouselContent> */}
          {/* <CarouselPrevious className="bg-[#7272F6] text-white text-[14px] hover:bg-[#7f7ff0]" /> */}
          {/* <CarouselNext className="bg-[#7272F6] text-white text-[14px] hover:bg-[#7f7ff0]" /> */}
          {/* </Carousel> */}
        </div>
      </div>
    </>
  );
}
