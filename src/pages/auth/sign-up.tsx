import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '@/api/interceptors';
import { useToast } from '@/components/custom/useToastComp';

import SignUpForm from './components/sign-up-form';
import Register from './components/Register';

export default function SignUp() {
  const { showToast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    plan: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    business_name: '',
    city: '',
    district: '',
    streetName: '',
    postalCode: '',
    business_type_id: '',
    business_location_id: '',
    tradeRegister: null,
    emailAlert: false,
  });
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (key: string, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ formState });
    const myFormData = new FormData();
    myFormData.append('name', formState.name);
    myFormData.append('email', formState.email);
    myFormData.append('password', formState.password);
    myFormData.append('business_name', formState.business_name);
    myFormData.append('business_type_id', formState.business_type_id);
    myFormData.append('business_location_id', formState.business_location_id);
    myFormData.append('phone', formState.phone);
    setLoading(true);
    try {
      const res = await axiosInstance.post('auth/Register', myFormData);
      setResponseData(res.data);
      console.log(res.data);
      showToast({
        description: `تم التسجيل بنجاح الرقم التعريفي هو ${res?.data?.data?.user?.business_reference}`,
        duration: 100000,
        variant: 'default',
      });
      // setTimeout(() => {
      navigate('/zood-login');
      // setLoading(false);
      // }, 2000);
    } catch (e) {
      console.log({ e });
      showToast({
        description: e.response.data.message,
        duration: 4000,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const changeStep = () => {
    // setStep((prev) => prev + 1);
  };
  return (
    <div className="min-h-[100vh] overflow-hidden px-4 flex flex-col items-center sm:px-[52px]">
      <div className="w-full flex flex-row gap-5 justify-between mt-[46px]  items-center ">
        <div className="w-[213px]">
          <Link to="/">
            <img loading="lazy" src="/images/SH_LOGO.svg" alt="logo" />
          </Link>
        </div>

        <div className="flex items-center max-sm:hidden">
          <span className="flex items-center justify-center bg-main rounded-full text-center size-8 text-white text-lg">
            1
          </span>
          <span className="max-sm:w-[50px] w-[100px] bg-[#363088] h-[3px]"></span>
          <span className="flex items-center justify-center border-main border-4 rounded-full text-center size-8 text-black text-lg">
            2
          </span>
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
      {step === 1 && (
        <SignUpForm
          formState={formState}
          setFormState={setFormState}
          changeStep={changeStep}
          handleChange={handleChange}
          loading={loading}
          setLoading={setLoading}
          handleSubmit={handleSubmit}
        />
      )}
      {step === 2 && <Register responseData={responseData} />}
    </div>
  );
}
