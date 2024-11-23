import { useState, useEffect } from 'react';
import createCrudService from '@/api/services/crudService';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/api/interceptors';
export default function Settings() {
  const [taxesValue, setTaxesValue] = useState(15);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const [updateAll, setUpdateAll] = useState({
    country: settings?.data?.country || '',
    additionalNumber: '',
    streetName: '',
    postalCode: '',
    district: '',
    commercialRegesterationNumber: '',
    citySubdivisionName: '',
    city: '',
    buildingNumber: '',
    business_name: settings?.data?.business_name || '',
    phone: '',
    branch_id: '',
  });
  const [data, setData] = useState({
    country: settings?.data?.country || '',
    additionalNumber: '',
    streetName: '',
    postalCode: '',
    district: '',
    commercialRegesterationNumber: '',
    citySubdivisionName: '',
    city: '',
    buildingNumber: '',
    business_name: '',
    phone: '',
    branch_id: '',
  });
  const [fileBase64, setFileBase64] = useState<any>('');
  //TODO ==> PHONE OF BRANCH
  useEffect(function () {
    async function getSettingsData() {
      setLoadingSettings(true);
      // const phoneNumberFromBranchRoute = await axiosInstance.get(`/manage/branches/${x=051caaaa-f1c9-437f-bcd1-04a06ce569c5}`)
      const data = await axiosInstance.get(`auth/whoami`);
      // setData(JSON.parse(data?.data?.user?.branches[0]?.registered_address));
      const holder = JSON.parse(
        data?.data?.user?.branches[0]?.registered_address
      );
      setUpdateAll((prev) => ({
        ...prev,
        ...holder,
        business_name: data.data.business.name,
        phone: data.data.user.phone,
        branch_id: data.data.user.branches[0].id,
      }));
      setData({
        ...holder,
        business_name: data.data.business.name,
        phone: data.data.user.phone,
        branch_id: data.data.user.branches[0].id,
      });
      setLoadingSettings(false);
    }
    getSettingsData();
  }, []);

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

  // update Branch function

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
  };
  const handleUpdateBranch = () => {
    updateSettings({
      id: '',
      data: { tax_inclusive_pricing: updatedTaxInclusivePricing },
    });
  };

  useEffect(() => {
    if (!fileBase64) return;
    updateSettings({
      id: '',
      data: { business_logo: fileBase64 },
    });
  }, [fileBase64, updateSettings]);
  const updateTop = async () => {
    await axiosInstance.put(`manage/settings`, {
      business_name: updateAll.business_name,
    });
    const res = await axiosInstance.put(
      `manage/branches/${updateAll.branch_id}`,
      {
        phone: updateAll.phone,
        registered_address: JSON.stringify({
          buildingNumber: updateAll.buildingNumber,
          additionalNumber: updateAll.additionalNumber,
          streetName: updateAll.streetName,
          postalCode: updateAll.postalCode,
          district: data.district,
          commercialRegesterationNumber: data.commercialRegesterationNumber,
          citySubdivisionName: data.citySubdivisionName,
          city: data.city,
        }),
      }
    );
  };
  const updateBottom = async () => {
    await axiosInstance.put(`manage/settings`, {
      country: updateAll.country,
    });
    await axiosInstance.put(`manage/branches/${updateAll.branch_id}`, {
      registered_address: JSON.stringify({
        buildingNumber: data.buildingNumber,
        additionalNumber: data.additionalNumber,
        streetName: data.streetName,
        postalCode: data.postalCode,
        district: updateAll.district,
        commercialRegesterationNumber: updateAll.commercialRegesterationNumber,
        citySubdivisionName: updateAll.citySubdivisionName,
        city: updateAll.city,
      }),
    });
  };
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
          <div className="self-stretch max-md:max-w-full text-sm">
            <div className="grid grid-cols-2">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow mt-10 text-sm text-left max-md:mt-10">
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
                    onChange={(e) => {
                      setUpdateAll((prev) => ({
                        ...prev,
                        streetName: e.target.value,
                      }));
                    }}
                    value={updateAll?.streetName}
                    className="w-[327px]"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* second part */}
          <div className="flex mt-2  w-full text-sm">
            <div className="flex flex-col flex-1">
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
                className="w-[327px]"
              />
            </div>
            <div className="flex flex-col flex-1">
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
                className="w-[327px] "
              />
            </div>
          </div>
          {/* Part We Need To Start */}
          <div className="flex mt-4  w-full text-sm">
            <div className="flex flex-col flex-1">
              <div className="self-start text-zinc-500">رقم المبني</div>
              <Input
                onChange={(e) => {
                  setUpdateAll((prev) => ({
                    ...prev,
                    buildingNumber: e.target.value,
                  }));
                }}
                value={updateAll?.buildingNumber}
                className="w-[327px] "
              />
            </div>
          </div>

          <Button
            onClick={() => {
              handleUpdateBranch();
              updateTop();
            }}
            className="flex flex-col justify-center items-center px-6 py-1.5 mt-6 text-sm font-semibold text-left text-white whitespace-nowrap bg-[var(--main)] rounded border border-[var(--main)] border-solid min-h-[39px] max-md:px-5"
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
                    الدوله
                  </div>
                  <Input
                    onChange={(e) => {
                      setUpdateAll((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }));
                    }}
                    defaultValue={settings?.data?.country}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col grow mt-10 text-sm text-left max-md:mt-10 w-[40%]">
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

            <div className="flex  gap-4  justify-center w-full text-sm   max-md:max-w-full">
              <div className=" w-[50%]">
                <div className="flex flex-col grow mt-5 text-sm text-left max-md:mt-10 w-[100%]">
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
              {/*  */}
              {/*  */}
              <div className="w-[50%]">
                <div className="flex flex-col grow mt-5 text-sm text-left max-md:mt-10 w-[100%]">
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

            <div className="flex flex-col flex-1 mt-3">
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
                className="w-[327px]"
              />
            </div>
          </div>
          <div
            // style={{ textAlign: '-webkit-auto' }}
            className="self-start"
          >
            <button
              onClick={() => {
                handleUpdateBranch();
                updateBottom();
              }}
              type="button"
              className="px-6  text-sm py-1.5 mt-8 font-semibold  mr-[12px]  text-white whitespace-nowrap bg-[var(--main)] rounded min-h-[39px] max-md:px-5"
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
            src={settingsData?.business_logo}
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
