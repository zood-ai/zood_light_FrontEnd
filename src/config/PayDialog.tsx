import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import axiosInstance from '@/api/interceptors';

const Alert = () => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 80C62.0914 80 80 62.0914 80 40C80 17.9086 62.0914 0 40 0C17.9086 0 0 17.9086 0 40C0 62.0914 17.9086 80 40 80Z"
        fill="var(--white)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M59.25 40.5C59.25 50.8553 50.8553 59.25 40.5 59.25C30.1447 59.25 21.75 50.8553 21.75 40.5C21.75 30.1447 30.1447 21.75 40.5 21.75C50.8553 21.75 59.25 30.1447 59.25 40.5ZM63 40.5C63 52.9265 52.9265 63 40.5 63C28.0736 63 18 52.9265 18 40.5C18 28.0736 28.0736 18 40.5 18C52.9265 18 63 28.0736 63 40.5ZM38.625 44.25V31.125H42.375V44.25H38.625ZM38.625 49.875V46.125H42.375V49.875H38.625Z"
        fill="white"
      />
    </svg>
  );
};
let payDialogRendered = false;
const PayDialog = ({ showRemaining = false }) => {
  const [open, setOpen] = useState(true);
  const [endDate, setEndDate] = useState('');
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!showRemaining) return;
    const fun = async () => {
      const { data: whoAmI } = await axiosInstance.get('auth/whoami');
      if (whoAmI) {
        setEndDate(whoAmI?.business?.end_at ?? '2025-10-01T01:00:00');
      }
    };
    fun();
  }, []);

  useEffect(() => {
    if (!endDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endDate).getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft('انتهى الوقت ✅');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days < 10) {
        if (days > 0) {
          setTimeLeft(`متبقي ${days} يوم`);
        } else if (hours > 0) {
          setTimeLeft(`متبقي ${hours} ساعة`);
        } else if (minutes > 0) {
          setTimeLeft(`متبقي ${minutes} دقيقة`);
        } else {
          setTimeLeft(`متبقي ${seconds} ثانية`);
        }
      } else {
        setTimeLeft('');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (showRemaining && !timeLeft) return;
  if (payDialogRendered) return null;
  payDialogRendered = true;

  if (window.location.href === '/zood-login') {
    payDialogRendered = false;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showClose={false}
        className="text-center bg-[#ff444e] outline-none border-none"
      >
        {/* <DialogHeader>
          <DialogTitle className="flex justify-center">
            <Alert />
          </DialogTitle>
        </DialogHeader> */}
        <div>
          <p dir="ltr" className="text-right text-white font-extrabold text-xl">
            {showRemaining ? (
              <>
                {timeLeft} على انتهاء الاشتراك برجاء سداد قيمة الاشتراك بقيمة
                500 ريال
              </>
            ) : (
              'تم انتهاء الاشتراك برجاه سداد قيمة الاشتراك بقيمة 500 ريال'
            )}
            <br />
            <br />
            <div
              dir="rtl"
              className="flex gap-3 text-white font-extrabold text-xl"
            >
              <span className="text-right text-white font-extrabold text-xl">
                اسم البنك:
              </span>
              <span className="text-right text-white font-extrabold text-xl">
                بنك الراجحي
              </span>
            </div>
            <div
              dir="rtl"
              className="flex gap-3 text-white font-extrabold text-xl"
            >
              <span className="text-right text-white font-extrabold text-xl">
                اسم الحساب:
              </span>
              <span className="text-right text-white font-extrabold text-xl">
                شركة يور مارت للتجارة
              </span>
            </div>
            <div
              dir="rtl"
              className="flex gap-3 text-white font-extrabold text-xl"
            >
              <span className="text-right text-white font-extrabold text-xl">
                رقم الحساب:
              </span>
              <span className="text-right text-white font-extrabold text-xl">
                622000010006080942546
              </span>
            </div>
            <div
              dir="rtl"
              className="flex gap-3 text-white font-extrabold text-xl"
            >
              <span className="text-right text-white font-extrabold text-xl">
                رقم الآيبان:
              </span>
              <span className="text-right text-white font-extrabold text-xl">
                1680000622608010942546S
              </span>
            </div>
            <br />
            في حال السداد ارسال صوره التحويل من خلال الواتساب علي هذا الرقم
            <p className="font-extrabold text-xl">+966 56 962 3465</p>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayDialog;
