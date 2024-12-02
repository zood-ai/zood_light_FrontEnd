import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
export default function ResetPassword() {
  const [check, setCheck] = useState(true);
  const [email, setEmail] = useState('');
  const [businessReference, setBusinessReference] = useState('');
  const [test, setTest] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const checkPassword = (password, confirmPassword) => {
    setTest(password !== confirmPassword);
    return password === confirmPassword;
  };
  const handleSubmitResetPass = async () => {
    if (!email) return;
    if (!businessReference) return;
    setLoading(true);
    try {
      const res = await axios.post(
        'http://zood.ai/api/v1/auth/password/email',
        {
          email,
          business_reference: businessReference,
        }
      );

      if (res.status === 200) {
        toast({
          title: 'نجاح',
          description: 'تم ارسال الرابط بنجاح',
          duration: 3000,
          variant: 'default',
        });
      }
    } finally {
      setLoading(false);
    }
    setLoading(false);
    console.log({ res });
    // setEmail(email);
    // setCheck(false);
  };

  const handleSubmit = () => {
    const check = checkPassword(password, confirmPassword);
    if (!check) {
      return;
    }
    navigate('/zood-login');
  };
  return (
    <>
      {/* <div className="min-h-[100vh] overflow-hidden px-4 flex flex-col items-center sm:px-[52px]">
       */}
      <div className="flex flex-row  justify-between sm:px-[52px] items-center ">
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
      </div>
      {/* {check ? ( */}
      <div className="flex flex-col mb-5 items-center gap-4 mt-16 pb-10">
        <h2 className="text-[32px] text-[#26262F] font-bold ">
          هل نسيت كلمة السر
        </h2>
        <span
          className="  text-[#868686] font-[600] w-[382px] leading-7 text-[14px]"
          dir="rtl"
        >
          أدخل عنوان البريد الإلكتروني و الرقم التعريفي الذي تستخدمه على zood
          ai. سنرسل إليك رابطًا لإعادة تعيين كلمة المرور الخاصة بك.
        </span>
        <div className="w-[419px] h-[56px] flex flex-col gap-4">
          <Input
            dir="rtl"
            type="email"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" w-full placeholder:text-center placeholder:text-[14px] placeholder:font-[600] placeholder:text-[#868686] px-2 py-4 border border-[#E6E6E6] rounded-sm h-[56px] "
            placeholder="البريد الاكتورني"
          />
          <Input
            dir="rtl"
            type="text"
            defaultValue={businessReference}
            onChange={(e) => setBusinessReference(e.target.value)}
            className=" w-full placeholder:text-center placeholder:text-[14px] placeholder:font-[600] placeholder:text-[#868686] px-2 py-4 border border-[#E6E6E6] rounded-sm h-[56px] "
            placeholder="الرقم التعريفي"
          />
          <Button
            disabled={!email || !businessReference || loading}
            onClick={() => handleSubmitResetPass()}
            className="px-2 py-4 text-base font-[600] text-[#FFFFFF] rounded-sm bg-[#7272F6] h-[56px]"
          >
            {loading ? 'جاري التحميل...' : 'إرسال'}
          </Button>
        </div>
      </div>
      {/* ) : (
        <div className="flex justify-center items-start mt-[60px] pb-10">
          <div className="flex flex-col mb-5 items-center gap-4">
            <h2 className="text-[32px] text-[#26262F] font-bold ">
              الرمز السري
            </h2>
            <span
              className="text-center  text-[#868686] font-[600] w-[382px] leading-7 text-[14px]"
              dir="rtl"
            >
              ادخل الرمز السري الجديد
            </span>
            <div className="w-[419px] h-[56px] flex flex-col gap-4">
              <Input
                dir="rtl"
                type="password"
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" w-full placeholder:text-center placeholder:text-[14px] placeholder:font-[600] placeholder:text-[#868686] px-2 py-4 border border-[#E6E6E6] rounded-sm h-[56px] "
                placeholder="كلمة المرور"
              />
              <Input
                dir="rtl"
                type="password"
                defaultValue={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className=" w-full placeholder:text-center placeholder:text-[14px] placeholder:font-[600] placeholder:text-[#868686] px-2 py-4 border border-[#E6E6E6] rounded-sm h-[56px] "
                placeholder="تاكيد كلمة المرور"
              />
              {test && (
                <span className="text-sm text-red-500 text-right">
                  كلمة المرور ليست متطابقة
                </span>
              )}
              <Button
                onClick={handleSubmit}
                className="px-2 py-4 text-base font-[600] text-[#FFFFFF] rounded-sm bg-[#7272F6] h-[56px]"
              >
                إعادة تعيين كلمة المرور
              </Button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
