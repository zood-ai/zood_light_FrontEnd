import { useState, useEffect } from 'react';
import createCrudService from '@/api/services/crudService';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/api/interceptors';
import { set } from 'zod';
import CustomSearchInbox from '@/components/custom/CustomSearchInbox';
import Cookies from 'js-cookie';

export default function Settings() {
  const userId = Cookies.get('userId');
  const [selectedFileName, setSelectedFileName] = useState('');
  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: allBusinessTypes } = createCrudService<any>(
    'manage/business-types'
  ).useGetAll();
  const { mutate: updateSettings } =
    createCrudService<any>('manage/settings').useUpdate();
  const { data: whoami } = createCrudService<any>('auth/whoami').useGetAll();
  const { data: taxes } = createCrudService<any>('manage/taxes').useGetAll();
  const { mutate: updateTax } =
    createCrudService<any>('manage/taxes').useUpdateNoDialog();
  const { mutate: updateBranch } =
    createCrudService<any>('manage/branches').useUpdate();
  const { mutate: updateBusiness } = createCrudService<any>(
    `auth/users/${userId}`
  ).useUpdate();
  const holder = whoami
    ? JSON.parse(whoami?.user?.branches[0]?.registered_address)
    : {};
  const [updateAll, setUpdateAll] = useState({
    country: settings?.data?.country || '',
    additionalNumber: holder?.additionalNumber || '',
    streetName: holder?.streetName || '',
    postalCode: holder?.postalCode || '',
    district: holder?.district || '',
    commercialRegesterationNumber: holder?.commercialRegesterationNumber || '',
    citySubdivisionName: holder?.citySubdivisionName || '',
    city: holder?.city || '',
    buildingNumber: holder?.buildingNumber || '',
    business_name: settings?.data?.business_name || '',
    phone: whoami?.user?.branches[0]?.phone || '',
    business_logo: settings?.data?.business_logo || '',
    business_tax_number: settings?.data?.business_tax_number || '',
    business_type: settings?.data?.business_type || '',
  });
  const [updatedTaxInclusivePricing, setUpdatedTaxInclusivePricing] = useState(
    settings?.data?.tax_inclusive_pricing
  );

  useEffect(() => {
    const holder = whoami
      ? JSON.parse(whoami?.user?.branches[0]?.registered_address)
      : {};
    setUpdateAll({
      country: settings?.data?.country || '',
      additionalNumber: holder?.additionalNumber || '',
      streetName: holder?.streetName || '',
      postalCode: holder?.postalCode || '',
      district: holder?.district || '',
      commercialRegesterationNumber:
        holder?.commercialRegesterationNumber || '',
      citySubdivisionName: holder?.citySubdivisionName || '',
      city: holder?.city || '',
      buildingNumber: holder?.buildingNumber || '',
      business_name: settings?.data?.business_name || '',
      phone: whoami?.user?.branches[0]?.phone || '',
      business_logo: settings?.data?.business_logo || '',
      business_tax_number: settings?.data?.business_tax_number || '',
      business_type: whoami?.business?.type || '',
    });

    setUpdatedTaxInclusivePricing(settings?.data?.tax_inclusive_pricing);
  }, [settings, whoami]);
  const taxesData = taxes?.data?.[0];
  const [taxesValue, setTaxesValue] = useState(taxes?.data?.[0]?.rate || 0);
  const brancheId = whoami?.user?.branches[0]?.id;
  const [fileBase64, setFileBase64] = useState<any>('');
  // update Branch function
  console.log({ updateAll, whoami });

  const changeTaxType = () => {
    if (settings?.data?.tax_inclusive_pricing === updatedTaxInclusivePricing)
      return;

    updateSettings({
      id: '',
      data: { tax_inclusive_pricing: updatedTaxInclusivePricing },
    });
  };
  const updateTexes = () => {
    if (!taxesData) return;
    if (taxesData.rate === taxesValue) return;
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
  const updateBusinessType = () => {
    if (updateAll.business_type === whoami?.business?.type) return;
    updateBusiness({
      id: '',
      data: { business_type_id: updateAll.business_type },
    });
  };
  const updateBothData = async () => {
    updateSettings({
      id: '',
      data: {
        country: updateAll.country,
        business_name: updateAll.business_name,
        business_tax_number: updateAll.business_tax_number,
      },
    });

    updateBranch({
      id: brancheId,
      data: {
        phone: updateAll.phone,
        registered_address: JSON.stringify({
          buildingNumber: updateAll.buildingNumber,
          additionalNumber: updateAll.additionalNumber,
          commercialRegesterationNumber:
            updateAll.commercialRegesterationNumber,
          postalCode: updateAll.postalCode,
          streetName: updateAll.streetName,
          district: updateAll.district,
          citySubdivisionName: updateAll.citySubdivisionName,
          city: updateAll.city,
        }),
      },
    });
  };

  useEffect(() => {
    if (!fileBase64) return;
    setUpdateAll((prev) => ({
      ...prev,
      business_logo: fileBase64,
    }));
    updateSettings({
      id: '',
      data: { business_logo: fileBase64 },
    });
  }, [fileBase64, updateSettings]);

  return (
    <>
      <div className="flex flex-col rounded-none max-w-[805px]">
        <div className="self-start text-2xl font-semibold text-left text-zinc-800 max-md:mr-2.5">
          الاعدادات
        </div>

        <div className="flex flex-col items-start p-4 mt-4 w-full bg-white rounded border border-gray-200 border-solid max-md:pl-5 max-md:max-w-full max-sm:gap-y-5">
          <div
            style={{ textAlign: 'right' }}
            className="align-justify  align-right"
          >
            <div className="text-base align-rigth font-semibold text-zinc-800">
              البيانات الاساسية
            </div>
          </div>
          <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full">
            <div className="w-full flex max-sm:flex-col gap-y-4 gap-x-4">
              <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                <div className="flex flex-col grow text-sm text-left">
                  <div className="self-start font-medium text-zinc-500">
                    اسم المتجر
                  </div>
                  <Input
                    onChange={(e) => {
                      setUpdateAll((prev) => ({
                        ...prev,
                        business_name: e.target.value,
                      }));
                    }}
                    value={updateAll?.business_name}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                <div className="flex flex-col grow text-sm text-left">
                  <div className="self-start font-medium text-zinc-500">
                    عنوان المتجر
                  </div>
                  <Input
                    onChange={(e) => {
                      setUpdateAll((prev) => ({
                        ...prev,
                        streetName: e.target.value,
                      }));
                    }}
                    value={updateAll?.streetName}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* second part */}
          <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full">
            <div className="w-full flex max-sm:flex-col gap-y-4 gap-x-4">
              <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                <div className="self-start font-medium text-zinc-500">
                  الرقم الاضافي
                </div>
                <Input
                  onChange={(e) => {
                    setUpdateAll((prev) => ({
                      ...prev,
                      additionalNumber: e.target.value,
                    }));
                  }}
                  value={updateAll?.additionalNumber}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                <div className="self-start font-medium text-zinc-500">
                  الرمز البريدي
                </div>
                <Input
                  onChange={(e) => {
                    setUpdateAll((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }));
                  }}
                  value={updateAll?.postalCode}
                  className="w-full "
                />
              </div>
            </div>
          </div>
          {/* Part We Need To Start */}
          <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full">
            <div className="w-full flex max-sm:flex-col gap-y-4 gap-x-4">
              <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                <div className="self-start text-zinc-500">
                  رقم السجل التجاري
                </div>
                <Input
                  onChange={(e) => {
                    setUpdateAll((prev) => ({
                      ...prev,
                      commercialRegesterationNumber: e.target.value,
                    }));
                  }}
                  value={updateAll?.commercialRegesterationNumber}
                  className="w-full "
                />
              </div>
              <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                <div className="self-start text-zinc-500">رقم المبني</div>
                <Input
                  onChange={(e) => {
                    setUpdateAll((prev) => ({
                      ...prev,
                      buildingNumber: e.target.value,
                    }));
                  }}
                  value={updateAll?.buildingNumber}
                  className="w-full "
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full">
            <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
              <div className="self-start text-zinc-500">الرقم الضريبي</div>
              <Input
                onChange={(e) => {
                  setUpdateAll((prev) => ({
                    ...prev,
                    business_tax_number: e.target.value,
                  }));
                }}
                value={updateAll?.business_tax_number}
                className="w-full "
              />
            </div>
          </div>
          <div
            style={{ textAlign: 'right' }}
            className="align-justify  align-right mt-10"
          >
            <div className="text-base align-rigth font-semibold text-zinc-800">
              العنوان والهاتف
            </div>
          </div>
          <div className="flex flex-col items-start  pl-5 w-full text-sm max-md:pl-5 max-md:max-w-full gap-y-4">
            <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full">
              <div className="w-full flex max-sm:flex-col gap-y-4 gap-x-4">
                <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                  <div className="self-start font-medium text-zinc-500">
                    الدوله
                  </div>
                  <Input
                    onChange={(e) => {
                      setUpdateAll((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }));
                    }}
                    defaultValue={updateAll?.country}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                  <div className="self-start font-medium text-zinc-500">
                    المدينه
                  </div>
                  <Input
                    onChange={(e) => {
                      setUpdateAll((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }));
                    }}
                    value={updateAll?.city}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex max-sm:flex-col gap-x-4  justify-center w-full text-sm   max-md:max-w-full">
              <div className="w-full sm:w-[50%]">
                <div className="flex flex-col grow max-sm:mt-5 text-sm text-left  w-[100%]">
                  <div className="self-start font-medium text-zinc-500">
                    citySubdivisionName
                  </div>
                  <Input
                    onChange={(e) => {
                      setUpdateAll((prev) => ({
                        ...prev,
                        citySubdivisionName: e.target.value,
                      }));
                    }}
                    value={updateAll?.citySubdivisionName}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="w-full sm:w-[50%]">
                <div className="flex flex-col grow max-sm:mt-5 text-sm text-left w-[100%]">
                  <div className="self-start font-medium text-zinc-500">
                    الحي
                  </div>
                  <Input
                    onChange={(e) => {
                      setUpdateAll((prev) => ({
                        ...prev,
                        district: e.target.value,
                      }));
                    }}
                    value={updateAll?.district}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 mt-3 w-full">
              <div className="self-start font-medium text-zinc-500">
                رقم الهاتف
              </div>
              <Input
                onChange={(e) => {
                  setUpdateAll((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }));
                }}
                defaultValue={updateAll?.phone}
                className="w-full"
              />
            </div>
          </div>
          <div
            // style={{ textAlign: '-webkit-auto' }}
            className="self-start"
          >
            <button
              onClick={() => {
                updateBothData();
              }}
              type="button"
              className="px-6  text-sm py-1.5 mt-8 font-semibold  mr-[12px]  text-white whitespace-nowrap bg-[var(--main)] rounded min-h-[39px] max-md:px-5"
            >
              حفظ
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start py-4 pr-2.5 pl-20 mt-7 w-full text-sm font-semibold text-left bg-white rounded border border-gray-200 border-solid max-md:pl-5 max-md:max-w-full">
          <div className="text-base text-zinc-800 max-md:mr-2">نوع الشركة </div>
          <div className="mt-2 font-medium text-zinc-500 max-md:mr-2">
            اختر نوع الشركة
          </div>
          <div className="relative mt-2">
            <CustomSearchInbox
              options={allBusinessTypes?.data?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder=""
              onValueChange={(value) => {
                setUpdateAll((prev) => ({
                  ...prev,
                  business_type: value,
                }));
              }}
              // label="اسم العميل"
              className=" md:col-span-4 min-w-[327px] flex-grow"
              value={updateAll?.business_type}
              disabled={false}
            />
          </div>

          <div className="flex flex-col justify-center items-center px-6 py-1.5 mt-8 text-white whitespace-nowrap bg-[var(--main)] rounded min-h-[39px] max-md:px-5">
            <button
              onClick={() => {
                updateBusinessType();
              }}
              className="gap-3 self-stretch"
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
              type="number"
              min={0}
              max={100}
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

          <div className="flex flex-col justify-center items-center px-6 py-1.5 mt-8 text-white whitespace-nowrap bg-[var(--main)] rounded min-h-[39px] max-md:px-5">
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
          <img
            className="mb-5 rounded-full aspect-square size-[150px]"
            src={updateAll?.business_logo}
            alt=""
          />
          <div className="font-medium text-zinc-500 ">Upload logo</div>
          {/* {fileBase64 && <img src={fileBase64} />} */}
          <div className="flex gap-2 items-center">
            <label className="flex flex-1 justify-center items-center  font-semibold bg-gray-200 rounded border border-solid border-zinc-300 w-[117px]  h-[39px] text-mainText cursor-pointer  ">
              <span className="text-[14px]">اختر الملف</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith('image/')) {
                    alert('Please upload a valid image file.');
                    return;
                  }
                  const fileName = file.name || 'No file chosen';
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64 = reader.result?.toString().split(',')[1];
                    setFileBase64(`data:image/png;base64,${base64}`);
                    setSelectedFileName(fileName);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {/* <div className="   bg font-medium text-zinc-500" id="file-name">
              {selectedFileName}
            </div> */}
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
