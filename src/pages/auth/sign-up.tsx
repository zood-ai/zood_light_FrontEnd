import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '@/api/interceptors';
import { useToast } from '@/components/custom/useToastComp';

import BusinessReference from './components/BusinessReference';
import SignUpForm from './components/sign-up-form';
import Plans from './components/plans';

export default function SignUp() {
  const { showToast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    package_id: '830f735a-eb95-4592-a61c-e78b2b2e8a4b',
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
    business_location_id: '70c4bc20-1fe4-48b2-87c5-26407fe09cde',
    tradeRegister: null,
    emailAlert: false,
  });
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
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
    console.log({ businessType: formState.business_location_id });
    const myFormData = new FormData();
    myFormData.append('name', formState.name);
    myFormData.append('email', formState.email);
    myFormData.append('password', formState.password);
    myFormData.append('business_name', formState.business_name);
    myFormData.append('business_type_id', formState.business_type_id);
    myFormData.append(
      'business_location_id',
      formState.business_location_id ?? 'a2968fb8-28e8-4818-9bf6-33671265c09d'
    );
    myFormData.append('phone', formState.phone);
    setLoading(true);
    try {
      const res = await axiosInstance.post('auth/Register', myFormData);
      setResponseData(res.data);
      // changeStep();
    } catch (e: any) {
      showToast({
        description: e?.response?.data?.message || 'حدث خطأ ما',
        duration: 4000,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogIn = () => {
    navigate('/zood-login');
  };
  const changeStep = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 flex flex-col items-center sm:px-8 lg:px-16">
      {/* Header */}
      <div className="w-full max-w-7xl flex flex-row gap-4 justify-between mt-8 items-center">
        <div className="w-[180px] sm:w-[213px]">
          <Link to="/">
            <img loading="lazy" src="/images/SH_LOGO.svg" alt="logo" />
          </Link>
        </div>

        {/* Progress Stepper - Improved */}
        <div className="flex flex-row-reverse items-center gap-3">
          {/* Step 1 */}
          <div
            className={`flex items-center gap-2 transition-all duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-50'
              }`}
          >
            <div
              className={`flex flex-col items-center gap-1 ${step === 1 ? 'scale-110' : ''
                } transition-transform duration-300`}
            >
              <div
                className={`flex items-center justify-center rounded-full text-center size-10 font-bold transition-all duration-300 ${step > 1
                  ? 'bg-green-500 text-white shadow-lg'
                  : step === 1
                    ? 'bg-[#7272F6] text-white shadow-lg ring-4 ring-[#7272F6]/20'
                    : 'bg-gray-300 text-gray-600'
                  }`}
              >
                {step > 1 ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  '1'
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${step === 1 ? 'text-[#7272F6]' : 'text-gray-600'
                  }`}
              >
                الخطة
              </span>
            </div>
          </div>

          {/* Connector Line */}
          <div
            className={`w-12 sm:w-20 h-1 rounded-full transition-all duration-500 ${step > 1
              ? 'bg-gradient-to-l from-green-500 to-[#7272F6]'
              : 'bg-gray-300'
              }`}
          ></div>

          {/* Step 2 */}
          <div
            className={`flex items-center gap-2 transition-all duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-50'
              }`}
          >
            <div
              className={`flex flex-col items-center gap-1 ${step === 2 ? 'scale-110' : ''
                } transition-transform duration-300`}
            >
              <div
                className={`flex items-center justify-center rounded-full text-center size-10 font-bold transition-all duration-300 ${step > 2
                  ? 'bg-green-500 text-white shadow-lg'
                  : step === 2
                    ? 'bg-[#7272F6] text-white shadow-lg ring-4 ring-[#7272F6]/20'
                    : 'bg-gray-300 text-gray-600'
                  }`}
              >
                {step > 2 ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  '2'
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${step === 2 ? 'text-[#7272F6]' : 'text-gray-600'
                  }`}
              >
                البيانات
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="flex gap-2 items-center text-right hover:opacity-80 transition-opacity duration-200"
        >
          <div className="text-sm sm:text-base text-gray-700 font-medium">
            رجوع للصفحة الرئيسية
          </div>
          <svg
            width="40"
            height="40"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-10 sm:h-10"
          >
            <path
              d="M23.0007 42.1668C33.5861 42.1668 42.1673 33.5856 42.1673 23.0002C42.1673 12.4147 33.5861 3.8335 23.0007 3.8335C12.4152 3.8335 3.83398 12.4147 3.83398 23.0002C3.83398 33.5856 12.4152 42.1668 23.0007 42.1668Z"
              stroke="#7272F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 30.6668L30.6667 23.0002L23 15.3335"
              stroke="#7272F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.334 23H30.6673"
              stroke="#7272F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Content */}
      <div className="w-full flex-1 flex items-center justify-center">
        {step === 1 && <Plans changeStep={changeStep} />}
        {step === 2 && (
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
      </div>

      {step >= 2 && responseData && (
        <BusinessReference
          number={responseData?.data?.user?.business_reference}
          handleLogIn={handleLogIn}
        />
      )}
    </div>
  );
}
