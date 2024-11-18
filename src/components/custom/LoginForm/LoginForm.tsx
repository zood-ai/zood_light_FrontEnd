import React, { useEffect } from 'react';

import { LoginFormProps } from './LoginForm.types';

import './LoginForm.css';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../button';
import { Input } from '@/components/ui/input';
import IconInput from '../InputWithIcon';
import back from '/icons/arrow-right-circle.svg';
import logo from '/icons/Logo.svg';
import dashboard from '/icons/Dashboard.png';
import { AuthForm } from './AuthForm';

export const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="relative pt-[87px] max-w-[100vw] overflow-hidden bg-white">
      <AuthForm />
      <div className="flex  gap-6 text-6xl text-main max-md:text-4xl justify-between items-center  ms-[55px] me-[61px] absolute left-[77vw] top-[7vh] w-full h-full z-10">
        <Link to="/" className="flex gap-2 self-start text-base text-zinc-800">
          <p className="grow my-auto font-semibold">رجوع للصفحة الرئيسية</p>
          <img
            loading="lazy"
            src={back}
            className="object-contain shrink-0 aspect-square w-[46px]"
          />
        </Link>
      </div>
      <div>
        <img
          loading="lazy"
          src="/public/images/layer.png"
          className="absolute object-cover z=10 top-0 right-0 left-0 bottom-0 w-full h-full"
        />
      </div>
      <div className="flex  gap-6 text-6xl text-main max-md:text-4xl justify-between items-center  ms-[55px] me-[61px]">
        <div className="flex justify-center items-center gap-6">
          <img
            loading="lazy"
            src={logo}
            className="object-contain shrink-0 my-auto aspect-[0.81] w-[62px]"
          />
          <div className="basis-auto max-md:text-4xl font-semibold">
            Zood Ai
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <img
            loading="lazy"
            src={dashboard}
            className="object-cover w-full h-full"
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};
