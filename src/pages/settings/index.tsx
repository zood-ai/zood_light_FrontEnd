import { useState } from 'react';
import createCrudService from '@/api/services/crudService';
import { Button } from '@/components/custom/button';
import { SelectComp } from '@/components/custom/SelectItem';
import { Input } from '@/components/ui/input';

export default function Settings() {
  const [taxesValue, setTaxesValue] = useState(15);
  const [selectedFileName, setSelectedFileName] = useState('');
  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: branches } =
    createCrudService<any>('manage/branches').useGetAll();
  const { data: taxes } = createCrudService<any>('manage/taxes').useGetAll();
  const settingsData = settings?.data;
  const taxesData = taxes?.data?.[0];
  const branchesData = branches?.data?.[0];
  const { mutate: updateSettings } =
    createCrudService<any>('manage/settings').useUpdateNoDialog();
  const { mutate: updateTax } =
    createCrudService<any>('manage/taxes').useUpdateNoDialog();

  const [updatedTaxInclusivePricing, setUpdatedTaxInclusivePricing] = useState(
    settingsData?.tax_inclusive_pricing || false
  );
  const changeTaxType = async () => {
    // if (!settingsData) return;

    // const updatedTaxInclusivePricing = !settingsData.tax_inclusive_pricing;

    await updateSettings({
      id: '',
      data: { tax_inclusive_pricing: updatedTaxInclusivePricing },
    });
    updateTax({
      id: taxesData.id,
      data: {
        name: `vat ${taxesValue}%`,
        rate: taxesValue,
        applies_on_order_types: ['1', '2'],
        name_localized: `vat ${taxesValue}%`,
      },
    });
  };
  function updateTexes() {
    // updateTax({
    //   id: taxesData.id,
    //   data: {
    //     name: `vat ${taxesValue}%`,
    //     rate: taxesValue,
    //     applies_on_order_types: ['1', '2'],
    //     name_localized: `vat ${taxesValue}%`,
    //   },
    // });
  }
  console.log(settingsData, taxesData, branchesData, 'settingsData');
  return (
    <>
      <div className="flex flex-col rounded-none max-w-[805px]">
        <div className="self-start text-2xl font-semibold text-left text-zinc-800 max-md:mr-2.5">
          الاعدادات
        </div>

        <div className="flex flex-col items-start py-4 pr-4 pl-16 mt-4 w-full bg-white rounded border border-gray-200 border-solid max-md:pl-5 max-md:max-w-full">
          <div className="text-s font-semibold text-zinc-800">
            البيانات الاساسية
          </div>
          <div className="self-stretch max-md:max-w-full">
            <div className="grid grid-cols-2">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow mt-10 text-sm text-left max-md:mt-10">
                  <div className="self-start font-medium text-zinc-500">
                    اسم المتجر
                  </div>
                  <Input
                    value={settingsData?.business_name}
                    className="w-[327px]"
                  />
                </div>
              </div>
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow mt-10 text-sm text-left max-md:mt-10">
                  <div className="self-start font-medium text-zinc-500">
                    عنوان المتجر
                  </div>
                  <Input value={branchesData?.name} className="w-[327px]" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 max-w-full text-sm text-left ">
            <div className="flex flex-col flex-1">
              <div className="self-start font-medium text-zinc-500">
                الرقم الاضافي
              </div>
              <Input className="w-[117px] " />
            </div>
            <div className="flex flex-col flex-1">
              <div className="self-start font-medium text-zinc-500">
                الرمز البريدي
              </div>
              <Input value={branchesData?.postal_code} className="w-[117px] " />
            </div>
            <div className="flex flex-col flex-1">
              <div className="self-start font-medium text-zinc-500">
                رقم المبني
              </div>
              <Input className="w-[117px] " />
            </div>
          </div>
          <Button className="flex flex-col justify-center items-center px-6 py-1.5 mt-6 text-sm font-semibold text-left text-white whitespace-nowrap bg-indigo-900 rounded border border-indigo-900 border-solid min-h-[39px] max-md:px-5">
            <div className="gap-3 self-stretch">حفظ</div>
          </Button>
        </div>
        <div className="flex flex-col py-4 mt-6 w-full text-left bg-white rounded border border-gray-200 border-solid max-md:max-w-full">
          <div className="flex flex-col self-start max-md:mr-2.5">
            <div className="text-base font-semibold text-zinc-800">
              العنوان والهاتف
            </div>
            <div className="self-start mt-2 text-sm font-medium text-zinc-500 max-md:mr-2">
              الدولة
            </div>
          </div>
          <div className="flex flex-col items-start pr-4 pl-20 w-full text-sm max-md:pl-5 max-md:max-w-full">
            <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full">
              <Input className=" " />

              <Input className=" " />
            </div>
            <div className="mt-4 font-medium text-zinc-500">الحي</div>
            <Input className=" " />

            <div className="mt-4 font-medium text-zinc-500">رقم الهاتف</div>
            <Input className=" " />

            <div className="flex flex-col justify-center items-center px-6 py-1.5 mt-8 font-semibold text-white whitespace-nowrap bg-indigo-900 rounded min-h-[39px] max-md:px-5">
              <div className="gap-3 self-stretch">حفظ</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start py-4 pr-2.5 pl-20 mt-7 w-full text-sm font-semibold text-left bg-white rounded border border-gray-200 border-solid max-md:pl-5 max-md:max-w-full">
          <div className="text-base text-zinc-800 max-md:mr-2">الضريبة</div>
          <div className="mt-2 font-medium text-zinc-500 max-md:mr-2">
            نسبة الضريبة
          </div>
          <div className="relative">
            <Input
              defaultValue={taxesData?.rate}
              onChange={(e) => setTaxesValue(+e.target.value)}
              className="pr-6"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
              %
            </span>
          </div>

          <div className="mt-4 font-medium text-zinc-500 max-md:mr-2">
            طريقة حساب الضريبة
          </div>
          <div className="flex gap-5 items-center mt-2 max-w-full text-zinc-800 w-[1c 48px] max-md:mr-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="taxOption"
                value="inclusive"
                className=" "
                onClick={() => {
                  setUpdatedTaxInclusivePricing(true);
                }}
                defaultChecked={updatedTaxInclusivePricing}
              />

              <span className="text-zinc-800">السعر شامل الضريبة</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="taxOption"
                value="exclusive"
                className=" "
                onClick={() => {
                  setUpdatedTaxInclusivePricing(false);
                }}
                defaultChecked={updatedTaxInclusivePricing ? false : true}
              />

              <span className="text-zinc-800">السعر غير شامل الضريبة</span>
            </label>
          </div>

          <div className="flex flex-col justify-center items-center px-6 py-1.5 mt-8 text-white whitespace-nowrap bg-indigo-900 rounded min-h-[39px] max-md:px-5">
            <button
              onClick={() => {
                changeTaxType();
                updateTexes();
              }}
              className="gap-3 self-stretch"
            >
              حفظ
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start self-start mt-4 max-w-full text-sm text-left w-[223px]">
          <div className="font-medium text-zinc-500 ">Upload logo</div>
          <div className="flex gap-2 items-center">
            <label className="flex flex-1 justify-center items-center  font-semibold bg-gray-200 rounded border border-solid border-zinc-300 w-[117px]  h-[39px] text-mainText cursor-pointer  ">
              <span className="text-[14px]">اختر الملف</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const fileName =
                    e.target.files?.[0]?.name || 'No file chosen';
                  setSelectedFileName(fileName);
                }}
              />
            </label>
            <div className="   bg font-medium text-zinc-500" id="file-name">
              {selectedFileName}
            </div>
          </div>

          <Button
            variant={'outlineDel'}
            className="flex flex-col justify-center items-center px-6 py-1.5 mt-10 font-semibold text-red-500 bg-white rounded border border-red-500 border-solid min-h-[39px] max-md:px-5"
          >
            <div className="gap-3 self-stretch">حذف الحساب</div>
          </Button>
        </div>
      </div>
    </>
  );
}
