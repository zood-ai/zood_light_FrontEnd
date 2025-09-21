import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthFormProps } from './AuthForm.types';
import './AuthForm.css';
import IconInput from '../../InputWithIcon';
import { Button } from '../../button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import createCrudService from '@/api/services/crudService';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

// Define the zod schema for form validation
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

export const AuthForm: React.FC<AuthFormProps> = () => {
  const { t } = useTranslation();
  // Use react-hook-form and zod for form handling
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      business_reference: '',
      password: '',
    },
  });

  // Handle form submission
  const handleFormSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);

    const x = await login(data);

    if (x.success === true) {
      navigate('/zood-dashboard');
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
    <>
      <div className="absolute left-[67vw] top-[20vh] w-full h-full z-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 text-end me-[61px] ">
            <div className="bg-slatea-500">
              <div className="flex gap-2 mt-5 text-2xl text-black text-end">
                <div className="grow">مرحبًا بعودتك</div>
                <img
                  loading="lazy"
                  src="/icons/hand.svg"
                  className="object-contain shrink-0 my-auto aspect-[0.92] w-[33px]"
                />
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleFormSubmit)}
                  className="px-s4 my-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>email</FormLabel> */}
                        <FormControl>
                          <IconInput
                            placeholder={t('EMAIL')}
                            className="ps-5 py-3.5 text-base rounded  w-[418px] "
                            width="418px"
                            inputClassName="h-[56px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="relative top-10 " />
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
                            className="ps-5 py-3.5 text-base roundedw-[418px]"
                            width="418px"
                            inputClassName="h-[56px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="relative top-10 " />
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
                              className="ps-5 py-3.5  mtext-base rounded w-[418px]"
                              width="418px"
                              inputClassName="h-[56px]"
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-1 top-[50%] left-[8%] h-6 w-6 -translate-y-1/2 rounded-md text-muted-foreground"
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
                        <FormMessage className="relative top-10 " />
                      </FormItem>
                    )}
                  />

                  <br />
                  {/* <div className=" text-sm text-main cursor-pointer">
                    هل نسيت كلمة المرور؟
                  </div> */}
                  <Button
                    loading={isLoading}
                    type="submit"
                    className="px-16 h-[44px] mt-10 max-w-full text-base text-white rounded w-[418px] max-md:px-5 max-md:mt-10"
                  >
                    تسجيل الدخول
                  </Button>
                </form>
              </Form>
              <Button
                variant="outline"
                className="px-16 h-[44px] mt-0 mb-0 max-w-full text-base border-solid w-[418px] max-md:px-5 max-md:mb-2.5"
              >
                الدخول كمشرف
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AuthForm;
