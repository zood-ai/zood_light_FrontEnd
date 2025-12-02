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
import { Combobox } from '@/components/ui/combobox';
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
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">
      <div className="mx-auto my-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#26262F] mb-2">
            أكمل بياناتك
          </h2>
          <p className="text-gray-600">قم بملء البيانات التالية لإنشاء حسابك</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
          {/* الاسم */}
          <div dir="rtl" className="mb-6">
            <Label
              className="text-base font-semibold text-gray-700 mb-2 block"
              htmlFor="name"
            >
              الاسم الكامل
            </Label>
            <Input
              className="h-12 border-gray-300 focus:border-[#7272F6] focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
              type="text"
              id="name"
              placeholder="أدخل اسمك الكامل"
              value={formState.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          {/* البريد الإلكتروني و رقم الهاتف */}
          <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div dir="rtl" className="flex flex-col gap-y-2">
              <Label
                className="text-base font-semibold text-gray-700"
                htmlFor="email"
              >
                البريد الإلكتروني
              </Label>
              <Input
                className="h-12 border-gray-300 focus:border-[#7272F6] focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
                type="email"
                id="email"
                placeholder="example@email.com"
                value={formState.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div dir="rtl" className="flex flex-col gap-y-2">
              <Label
                className="text-base font-semibold text-gray-700"
                htmlFor="phone"
              >
                رقم الهاتف
              </Label>
              <Input
                className="h-12 border-gray-300 focus:border-[#7272F6] focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
                type="text"
                id="phone"
                placeholder="+966 5X XXX XXXX"
                value={formState.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div dir="rtl" className="mb-6">
            <Label
              className="text-base font-semibold text-gray-700 mb-2 block"
              htmlFor="password"
            >
              كلمة المرور
            </Label>
            <Input
              className="h-12 border-gray-300 focus:border-[#7272F6] focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
              type="password"
              id="password"
              placeholder="أدخل كلمة مرور قوية"
              value={formState.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-gray-200"></div>

          {/* اسم المتجر و نوع المتجر */}
          <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div dir="rtl" className="flex flex-col gap-y-2">
              <Label
                className="text-base font-semibold text-gray-700"
                htmlFor="business_name"
              >
                اسم المتجر
              </Label>
              <Input
                className="h-12 border-gray-300 focus:border-[#7272F6] focus:ring-2 focus:ring-[#7272F6]/20 transition-all duration-200"
                type="text"
                id="business_name"
                placeholder="أدخل اسم متجرك"
                value={formState.business_name}
                onChange={(e) => handleChange('business_name', e.target.value)}
              />
            </div>
            <div dir="rtl" className="flex flex-col gap-y-2">
              <Label
                className="text-base font-semibold text-gray-700"
                htmlFor="business_type_id"
              >
                نوع المتجر
              </Label>
              <Combobox
                dir="rtl"
                value={formState.business_type_id}
                onValueChange={(value) =>
                  handleChange('business_type_id', value)
                }
                options={
                  businessTypes?.data.map((e) => ({
                    value: e.id,
                    label: e.name,
                  })) || []
                }
                placeholder="اختر نوع المتجر"
                searchPlaceholder="ابحث عن نوع المتجر..."
                emptyText="لا توجد نتائج"
              />
            </div>
          </div>

          {/* الدولة */}
          <div dir="rtl" className="mb-6">
            <Label
              className="text-base font-semibold text-gray-700 mb-2 block"
              htmlFor="business_location_id"
            >
              الدولة
            </Label>
            <Combobox
              dir="rtl"
              value={
                formState.business_location_id ||
                'a2968fb8-28e8-4818-9bf6-33671265c09d'
              }
              onValueChange={(value) =>
                handleChange('business_location_id', value)
              }
              options={
                countries?.data.map((e) => ({
                  value: e.id,
                  label: e.name_en,
                })) || []
              }
              placeholder="اختر الدولة"
              searchPlaceholder="ابحث عن الدولة..."
              emptyText="لا توجد نتائج"
            />
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-gray-200"></div>

          {/* تحميل السجل التجاري */}
          <div dir="rtl" className="mb-6">
            <Label className="text-base font-semibold text-gray-700 mb-3 block">
              تحميل السجل التجاري
            </Label>
            <div className="flex flex-col gap-3">
              <label className="group flex items-center justify-center gap-2 h-12 px-6 font-semibold bg-gradient-to-r from-gray-50 to-gray-100 hover:from-[#7272F6]/5 hover:to-[#7272F6]/10 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#7272F6] text-gray-700 cursor-pointer transition-all duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-base">اختر الملف</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleChange('tradeRegister', e.target.files?.[0] || null)
                  }
                />
              </label>
              {formState.tradeRegister && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">
                    {formState.tradeRegister?.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* التنبيهات */}
          <div dir="rtl" className="mb-8">
            <CheckboxWithText
              className="text-base"
              label="إرسال تنبيه للبريد الإلكتروني"
              checked={formState.emailAlert}
              onChange={(e) => handleChange('emailAlert', e)}
            />
          </div>

          {/* زر الإرسال */}
          <div dir="rtl" className="flex justify-center">
            <Button
              loading={loading}
              disabled={loading}
              type="submit"
              className="h-12 px-12 text-base font-semibold bg-gradient-to-r from-[#7272F6] to-[#5656E8] hover:from-[#5656E8] hover:to-[#7272F6] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {!loading && 'إنشاء الحساب'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
