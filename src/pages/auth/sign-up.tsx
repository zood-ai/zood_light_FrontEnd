import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axiosInstance from '@/api/interceptors';
import { Button } from '@/components/custom/button';
import { CheckboxWithText } from '@/components/custom/CheckboxWithText';
import createCrudService from '@/api/services/crudService';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';
import { useToast } from '@/components/custom/useToastComp';

export default function SignUp() {
  const { data: businessTypes } = createCrudService<any>(
    'manage/business-types'
  ).useGetAll();
  const { data: countries } =
    createCrudService<any>('manage/countries').useGetAll();
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
      console.log(res.data);
      showToast({
        description: `تم التسجيل بنجاح الرقم التعريفي هو ${res?.data?.data?.user?.business_reference}`,
        duration: 4000,
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
  return (
    <div className="flex justify-center py-10">
      <form onSubmit={handleSubmit}>
        <div className="mx-2 my-4">
          <div dir="rtl" className="flex gap-6 mb-6">
            <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
              <Label className="align-right" htmlFor="name">
                الاسم
              </Label>
              <Input
                className=""
                type="text"
                id="name"
                value={formState.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
              <Label className="align-right" htmlFor="plan">
                الخطة
              </Label>
              <Select
                dir="rtl"
                onValueChange={(value) => handleChange('plan', value)}
              >
                <SelectTrigger className="w-[327px]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="a">a</SelectItem>
                    <SelectItem value="b">b</SelectItem>
                    <SelectItem value="c">c</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div dir="rtl" className="flex gap-6 mb-6">
            <div className="flex gap-6">
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="email">
                  عنوان البريد الالكتروني
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="phone">
                  رقم التليفون
                </Label>
                <Input
                  type="text"
                  id="phone"
                  value={formState.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div dir="rtl" className="flex gap-6 mb-6">
            <div className="flex gap-6">
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="password">
                  الرقم السري
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={formState.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
              </div>
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="confirmPassword">
                  تاكيد الرقم السري
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={formState.confirmPassword}
                  onChange={(e) =>
                    handleChange('confirmPassword', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div dir="rtl" className="flex gap-6 mb-6">
            <div className="flex gap-6">
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="business_name">
                  اسم المتجر
                </Label>
                <Input
                  type="text"
                  id="business_name"
                  value={formState.business_name}
                  onChange={(e) =>
                    handleChange('business_name', e.target.value)
                  }
                />
              </div>
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="business_type_id">
                  نوع المتجر
                </Label>
                <Select
                  dir="rtl"
                  onValueChange={(value) =>
                    handleChange('business_type_id', value)
                  }
                >
                  <SelectTrigger className="w-[327px]">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {businessTypes &&
                        businessTypes?.data.map((e) => (
                          <SelectItem value={e.id}>{e.name}</SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div dir="rtl" className="flex gap-6 mb-6">
            <div className="flex gap-6">
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="business_location_id">
                  الدولة
                </Label>
                <Select
                  dir="rtl"
                  onValueChange={(value) =>
                    handleChange('business_location_id', value)
                  }
                >
                  <SelectTrigger className="w-[327px]">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {countries &&
                        countries?.data.map((e) => (
                          <SelectItem value={e.id}>{e.name_en}</SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="city">
                  المدينة
                </Label>
                <Input
                  type="text"
                  id="city"
                  value={formState.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div dir="rtl" className="flex gap-6 mb-6">
            <div className="flex gap-6">
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="district">
                  الحي
                </Label>
                <Input
                  type="text"
                  id="district"
                  value={formState.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                />
              </div>
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="streetName">
                  اسم الشارع
                </Label>
                <Input
                  type="text"
                  id="streetName"
                  value={formState.streetName}
                  onChange={(e) => handleChange('streetName', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div dir="rtl" className="flex gap-6 mb-6">
            <div className="flex">
              <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
                <Label className="align-right" htmlFor="postalCode">
                  رمز بريدي
                </Label>
                <Input
                  type="text"
                  id="postalCode"
                  value={formState.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div dir="rtl">
              <div className="w-[327px]">
                <div className="flex flex-col items-start self-start mt-4 max-w-full text-sm text-left w-[223px]">
                  <div className="font-medium text-zinc-500">
                    تحميل السجل التجاري
                  </div>
                  <div className="flex gap-2   max-w-full items-center">
                    <label className="flex flex-1 justify-center items-center font-semibold bg-gray-200 rounded border border-solid border-zinc-300 w-[117px] h-[39px] text-mainText cursor-pointer">
                      <span className="text-[14px]">اختر الملف</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleChange(
                            'tradeRegister',
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </label>
                  </div>
                  <span className="text-gray-500 text-md">
                    {formState.tradeRegister?.name || 'no file chosen'}
                  </span>
                </div>
              </div>
            </div>
            <div dir="rtl">
              <CheckboxWithText
                className=""
                label="ارسال تنبيه للبريد الالكتروني"
                checked={formState.emailAlert}
                onChange={(e) => handleChange('emailAlert', e)}
              />
            </div>
            <div dir="rtl">
              <Button
                loading={loading}
                disabled={loading}
                type="submit"
                className="px-4 py-2 w-[150px] text-sm"
              >
                {!loading && 'اضافة'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
