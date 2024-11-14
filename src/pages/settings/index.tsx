import { useState, useEffect } from 'react';
import createCrudService from '@/api/services/crudService';
import { Button } from '@/components/custom/button';
import { SelectComp } from '@/components/custom/SelectItem';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/api/interceptors';
export default function Settings() {
  const [taxesValue, setTaxesValue] = useState(15);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [phone, setPhone] = useState('');
  const [data, setData] = useState<any>({});
  useEffect(function () {
    async function getSettingsData() {
      setLoadingSettings(true);
      const data = await axiosInstance.get(`auth/whoami`);
      setPhone(data?.data?.user?.branches[0]?.phone);
      setData(JSON.parse(data?.data?.user?.branches[0]?.registered_address));
      console.log('FETCH');
      setLoadingSettings(false);
    }
    getSettingsData();
  }, []);
  console.log(data);
  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: branches } =
    createCrudService<any>('manage/branches').useGetAll();
  const { data: taxes } = createCrudService<any>('manage/taxes').useGetAll();
  const settingsData = settings?.data;
  const taxesData = taxes?.data?.[0];
  const branchesData = branches?.data?.[0];
  const [updatedTaxInclusivePricing, setUpdatedTaxInclusivePricing] = useState(
    settingsData?.tax_inclusive_pricing
  );
  const { mutate: updateBranch } =
    createCrudService<any>('manage/branches').useUpdate();
  const { mutate: updateSettings } =
    createCrudService<any>('manage/settings').useUpdate();
  const { mutate: updateTax } =
    createCrudService<any>('manage/taxes').useUpdateNoDialog();
  const changeTaxType = () => {
    if (!settingsData) return;

    updateSettings({
      id: '',
      data: { tax_inclusive_pricing: updatedTaxInclusivePricing },
    });
  };
  const updateTexes = () => {
    updateTax({
      id: taxesData.id,
      data: {
        name: `vat ${taxesValue}%`,
        rate: taxesValue,
        applies_on_order_types: ['1', '2'],
        name_localized: `vat ${taxesValue}%`,
      },
    });
    console.log(taxesValue);
  };
  const handleUpdateBranch = () => {
    console.log({data});
  };
  console.log(taxesData?.rate);
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
                    defaultValue={settingsData?.business_name}
                    className="w-[327px]"
                  />
                </div>
              </div>
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow mt-10 text-sm text-left max-md:mt-10">
                  <div className="self-start font-medium text-zinc-500">
                    عنوان المتجر
                  </div>
                  <Input
                    defaultValue={data?.streetName}
                    className="w-[327px]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 max-w-full text-sm text-left ">
            <div className="flex flex-col flex-1">
              <div className="self-start font-medium text-zinc-500">
                الرقم الاضافي
              </div>
              <Input
                defaultValue={data?.additionalNumber}
                className="w-[117px] "
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="self-start font-medium text-zinc-500">
                الرمز البريدي
              </div>
              <Input defaultValue={data?.postalCode} className="w-[117px] " />
            </div>
            <div className="flex flex-col flex-1">
              <div className="self-start font-medium text-zinc-500">
                رقم المبني
              </div>
              <Input
                defaultValue={data?.buildingNumber}
                className="w-[117px] "
              />
            </div>
          </div>
          <Button
            onClick={handleUpdateBranch}
            className="flex flex-col justify-center items-center px-6 py-1.5 mt-6 text-sm font-semibold text-left text-white whitespace-nowrap bg-indigo-900 rounded border border-indigo-900 border-solid min-h-[39px] max-md:px-5"
          >
            <div className="gap-3 self-stretch">حفظ</div>
          </Button>
        </div>

        {/* one */}
        {/* two */}
        {/* three */}
        {/* four */}
        <div className="flex flex-col py-4 mt-6  text-left bg-white rounded border border-gray-200 border-solid max-md:max-w-full">
          <div
            style={{ textAlign: 'right' }}
            className="align-justify mr-[10px] align-right"
          >
            <div className="text-base align-rigth font-semibold text-zinc-800">
              العنوان والهاتف
            </div>
          </div>
          <div className="flex flex-col items-start pr-4 pl-5 w-full text-sm max-md:pl-5 max-md:max-w-full">
            <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full">
              <div className="w-full flex gap-4">
                <div className="flex flex-col grow mt-10 text-sm text-left max-md:mt-10 w-[40%]">
                  <div className="self-start font-medium text-zinc-500">
                    المدينه
                  </div>
                  <Input defaultValue={data?.city} className="w-full" />
                </div>

                <div className="flex flex-col grow mt-10 text-sm text-left max-md:mt-10 w-[40%]">
                  <div className="self-start font-medium text-zinc-500">
                    citySubdivisionName
                  </div>
                  <Input
                    defaultValue={data?.citySubdivisionName}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col grow mt-4 text-sm text-left max-md:mt-4 w-6/12">
              <div className="self-start font-medium text-zinc-500">الحي</div>
              <Input defaultValue={data?.district} className="w-[96%]" />
            </div>
            <div className="flex flex-col grow mt-4 text-sm text-left max-md:mt-4 w-6/12">
              <div className="self-start font-medium text-zinc-500">
                رقم الهاتف
              </div>
              <Input defaultValue={phone || ''} className="w-[96%]" />
            </div>
          </div>
          <div
            style={{ textAlign: '-webkit-auto' }}
            className=" direction-reverse"
          >
            <button
              onClick={handleUpdateBranch}
              type="button"
              className="px-6  text-sm py-1.5 mt-8 font-semibold  mr-[12px]  text-white whitespace-nowrap bg-indigo-900 rounded min-h-[39px] max-md:px-5"
            >
              حفظ
            </button>
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
            onClick={() => console.log('DELETE')}
          >
            <div className="gap-3 self-stretch">حذف الحساب</div>
          </Button>
        </div>
      </div>
    </>
  );
}
