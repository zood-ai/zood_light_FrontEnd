import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card } from '@/components/ui/card';
import logo from '/icons/Logo.svg';
import { useNavigate, Link } from 'react-router-dom';
import back from '/icons/arrow-right-circle.svg';
import { Button } from '@/components/custom/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import IconInput from '@/components/custom/InputWithIcon';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { getToken } from '@/utils/auth';
import PayDialog from '@/config/PayDialog';
import moment from 'moment';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  business_reference: z
    .string()
    .min(6, { message: 'ID must be at least 6 characters' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type AuthFormValues = z.infer<typeof formSchema>;
export default function SignIn2() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [expired, setExpired] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      business_reference: '',
      password: '',
    },
  });

  // useEffect(() => {
  //   const token = getToken();
  //   if (token) navigate('/zood-dashboard');
  // }, []);

  // Handle SignUp
  const handleSignUp = () => {
    navigate('/zood-signup');
  };

  // Handle form submission
  const handleFormSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    setExpired(false);
    const x = await login(data);
    if (x.success === true) {
      navigate('/zood-dashboard');
    }

    if (x.errorCode === 401) {
      setExpired(true);
    }

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  };
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-[100vh] overflow-hidden px-4 flex flex-col items-center sm:px-[52px]">
      {expired && <PayDialog showAllTime={true} />}
      <div className="w-full flex flex-row gap-5 justify-between mt-[46px]  items-center ">
        <div className="w-[213px]">
          <Link to="/">
            <img loading="lazy" src="/images/SH_LOGO.svg" alt="logo" />
          </Link>
        </div>

        <Link to="/" className="flex gap-2 items-center text-right">
          <div className="">رجوع للصفحة الرئيسية</div>
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.0007 42.1668C33.5861 42.1668 42.1673 33.5856 42.1673 23.0002C42.1673 12.4147 33.5861 3.8335 23.0007 3.8335C12.4152 3.8335 3.83398 12.4147 3.83398 23.0002C3.83398 33.5856 12.4152 42.1668 23.0007 42.1668Z"
              stroke="#363088"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M23 30.6668L30.6667 23.0002L23 15.3335"
              stroke="#363088"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.334 23H30.6673"
              stroke="#363088"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Link>
      </div>
      <div
        dir="rtl"
        className="flex flex-col items-center justify-center mt-10"
      >
        <div className=" font-bold leading-[60px] text-[46px] text-center w-full sm:w-[326px]   text-black mb-16">
          تسجيل الدخول
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>email</FormLabel> */}
                  <FormControl>
                    <IconInput
                      placeholder={t('EMAIL')}
                      className=""
                      inputClassName="w-full sm:w-[418px] h-[56px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_reference"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>business_reference</FormLabel> */}
                  <FormControl>
                    <IconInput
                      placeholder="الرقم التعريفي"
                      className="my-md"
                      inputClassName="w-full sm:w-[418px] h-[56px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>password</FormLabel> */}
                  <FormControl>
                    <div className="relative">
                      <IconInput
                        placeholder="كلمة المرور"
                        className=""
                        inputClassName="w-full sm:w-[418px] h-[56px]"
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute left-1 top-[50%] bottom-[50%] h-6 w-6 -translate-y-1/2 rounded-md text-muted-foreground"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <IconEye size={18} />
                        ) : (
                          <IconEyeOff size={18} />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div dir="ltr" className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-sm text-main cursor-pointer mt-[10px] text-end"
              >
                هل نسيت كلمة المرور؟
              </Link>
            </div>
            <div className=" mb-[20px] mt-[40px] ">
              <Button
                loading={isLoading}
                disabled={isLoading}
                type="submit"
                className="w-full sm:w-[418px] h-[56px]"
              >
                تسجيل الدخول
              </Button>
            </div>
            <div className="  ">
              <Button
                onClick={handleSignUp}
                variant={'outline'}
                loading={false}
                type="button"
                className="w-full sm:w-[418px] h-[56px] mb-10"
              >
                تسجيل
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
