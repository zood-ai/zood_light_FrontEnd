import React, { useEffect, useRef, useState } from 'react';
import { Roles } from './roles';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';
import Logo from '@/assets/SH_LOGO.svg';
import axiosInstance from '@/api/interceptors';
import Loader from '@/components/loader';

let counter = 0;

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

const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: JSX.Element;
  requiredRole: Roles;
}) => {
  const [open, setOpen] = useState(false);
  // const [counter, setCounter] = useState(0);
  const [whoAmI, setWhoAmI] = useState();
  const initialized = useRef(false); // Prevent multiple useEffect runs

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const fun = async () => {
      const { data: whoAmI } = await axiosInstance.get('auth/whoami');
      setWhoAmI(whoAmI.business.reference);
    };

    fun();
    setOpen(true);
    counter++;
  }, []);

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }
  if (!whoAmI)
    return (
      <div className="bg-white z-[10000000] w-screen h-screen absolute top-0 left-0 flex items-center justify-center text-2xl">
        <div className="flex gap-10">
          <p className="text-nowrap">الرجاء الانتظار</p>
          <Loader />
        </div>
      </div>
    );
  const validReferences = [
    987884, 131764, 619467, 872412, 691610, 987824, 154734, 357348, 195390,
    177050, 123358, 322324, 589503, 981382, 215742, 421994, 322331, 497155,
    142367, 891678, 820366, 268152, 635219, 947509, 107550, 457632, 906751,
    685322, 983388, 909630, 176730, 566829, 997778, 293383, 317584, 583391,
    721113, 356314, 165543, 510458, 280979, 932061, 128652, 708836, 940209,
    176934, 457632, 906751, 685322, 997778, 293383, 165543, 510458, 280979,
    176934, 150581, 795271, 258425, 619467, 540491, 212882, 260477, 681801,
    590796, 674933, 868249, 519472, 643709, 282921, 973304,
  ];

  return (
    <>
      {whoAmI && validReferences.includes(whoAmI) && counter === 1 && (
        <div>
          <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent
              showClose={false}
              className="text-center bg-red-500 outline-none border-none"
            >
              <DialogHeader>
                <DialogTitle className="flex justify-center">
                  <Alert />
                </DialogTitle>
              </DialogHeader>
              <p className=" text-white px-4 font-extrabold text-xl">
                برجاء سداد قيمه الاشتراك
                <br />
                <br />
                في حال السداد ارسال صوره التحويل علي هذا الرقم
                <br />
                <p dir="ltr" className="flex justify-center gap-2 pt-2">
                  <p className=" font-extrabold text-xl">من خلال الواتساب</p>
                  <p className=" font-extrabold text-xl">+966 56 962 3465</p>
                </p>
              </p>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
