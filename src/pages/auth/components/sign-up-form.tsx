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

export default function SignUpForm({
  changeStep,
  formState,
  handleChange,
  loading,
  setLoading,
  handleSubmit,
}: any) {
  const { data: businessTypes } = createCrudService<any>(
    'manage/business-types'
  ).useGetAll();
  const { data: countries } =
    createCrudService<any>('manage/countries').useGetAll();
  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-2 my-4">
        <div dir="rtl" className="flex flex-wrap justify-between gap-6 mb-6">
          <div dir="rtl" className="flex flex-col flex-grow gap-y-3">
            <Label className="align-right" htmlFor="name">
              الاسم
            </Label>
            <Input
              className="w-full border-[#DCDBDB]"
              type="text"
              id="name"
              value={formState.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div
            dir="rtl"
            className="flex flex-col flex-grow gap-y-2 max-sm:w-full"
          >
            <Label className="align-right" htmlFor="plan">
              الخطة
            </Label>
            <Select
              dir="rtl"
              onValueChange={(value) => handleChange('plan', value)}
            >
              <SelectTrigger className="border-[#DCDBDB]  sm:w-[327px]">
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
        <div dir="rtl" className="flex flex-wrap justify-between gap-6 mb-6">
          <div dir="rtl" className="flex flex-col flex-grow gap-y-3">
            <Label className="align-right" htmlFor="email">
              عنوان البريد الالكتروني
            </Label>
            <Input
              className="w-full border-[#DCDBDB]"
              type="email"
              id="email"
              value={formState.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          <div dir="rtl" className="flex flex-col flex-grow gap-y-3">
            <Label className="align-right" htmlFor="phone">
              رقم التليفون
            </Label>
            <Input
              className="w-full border-[#DCDBDB]"
              type="text"
              id="phone"
              value={formState.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>
        <div dir="rtl" className="flex flex-wrap justify-between gap-6 mb-6">
          <div className="flex gap-6">
            <div dir="rtl" className="grid max-w-sm items-center gap-1.5">
              <Label className="align-right" htmlFor="password">
                الرقم السري
              </Label>
              <Input
                className="w-full border-[#DCDBDB]"
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
                className="w-full border-[#DCDBDB]"
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
        <div dir="rtl" className="flex flex-wrap justify-between gap-6 mb-6">
          <div dir="rtl" className="flex flex-col flex-grow gap-y-3">
            <Label className="align-right" htmlFor="business_name">
              اسم المتجر
            </Label>
            <Input
              className="w-full border-[#DCDBDB]"
              type="text"
              id="business_name"
              value={formState.business_name}
              onChange={(e) => handleChange('business_name', e.target.value)}
            />
          </div>
          <div
            dir="rtl"
            className="flex flex-col flex-grow gap-y-2 max-sm:w-full"
          >
            <Label className="align-right" htmlFor="business_type_id">
              نوع المتجر
            </Label>
            <Select
              dir="rtl"
              onValueChange={(value) => handleChange('business_type_id', value)}
            >
              <SelectTrigger className="w-full sm:w-[327px] border-[#DCDBDB]">
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
        <div dir="rtl" className="flex flex-wrap justify-between gap-6 mb-6">
          <div dir="rtl" className="flex flex-col flex-grow gap-y-3">
            <Label className="align-right" htmlFor="business_location_id">
              الدولة
            </Label>
            <Select
              dir="rtl"
              onValueChange={(value) =>
                handleChange('business_location_id', value)
              }
            >
              <SelectTrigger className="w-full border-[#DCDBDB] sm:w-[327px]">
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
          <div
            dir="rtl"
            className="flex flex-col flex-grow gap-y-2 max-sm:w-full"
          >
            <Label className="align-right" htmlFor="city">
              المدينة
            </Label>
            <Input
              type="text"
              id="city"
              className="w-full border-[#DCDBDB] mt-2"
              value={formState.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>
        </div>
        <div dir="rtl" className="flex flex-wrap justify-between gap-6 mb-6">
          <div dir="rtl" className="flex flex-col flex-grow gap-y-3">
            <Label className="align-right" htmlFor="district">
              الحي
            </Label>
            <Input
              className="w-full border-[#DCDBDB]"
              type="text"
              id="district"
              value={formState.district}
              onChange={(e) => handleChange('district', e.target.value)}
            />
          </div>
          <div dir="rtl" className="flex flex-col flex-grow gap-y-3">
            <Label className="align-right" htmlFor="streetName">
              اسم الشارع
            </Label>
            <Input
              className="w-full border-[#DCDBDB]"
              type="text"
              id="streetName"
              value={formState.streetName}
              onChange={(e) => handleChange('streetName', e.target.value)}
            />
          </div>
        </div>
        <div dir="rtl" className="flex flex-wrap justify-between gap-6 mb-6">
          <div dir="rtl" className="flex flex-col flex-grow gap-y-3">
            <Label className="align-right" htmlFor="postalCode">
              رمز بريدي
            </Label>
            <Input
              className="w-full border-[#DCDBDB]"
              type="text"
              id="postalCode"
              value={formState.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div dir="rtl">
            <div className="sm:w-[327px]">
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
  );
}
