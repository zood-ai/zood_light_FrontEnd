import { useState, useEffect } from 'react';
import createCrudService from '@/api/services/crudService';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import CustomSearchInbox from '@/components/custom/CustomSearchInbox';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { setSettings } from '@/store/slices/allSettings';

export default function Settings() {
  const dispatch = useDispatch();
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
  let holder = whoami
    ? JSON.parse(whoami?.user?.branches[0]?.registered_address ?? '{}')
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
    receipt_header: settings?.data?.receipt_header || '',
    receipt_footer: settings?.data?.receipt_footer || '',
  });
  const [updatedTaxInclusivePricing, setUpdatedTaxInclusivePricing] = useState(
    settings?.data?.tax_inclusive_pricing
  );

  useEffect(() => {
    const holder = whoami
      ? JSON.parse(whoami?.user?.branches[0]?.registered_address ?? '{}')
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
      receipt_header: settings?.data?.receipt_header || '',
      receipt_footer: settings?.data?.receipt_footer || '',
    });

    setUpdatedTaxInclusivePricing(settings?.data?.tax_inclusive_pricing);
  }, [settings, whoami]);
  const taxesData = taxes?.data?.[0];
  const [taxesValue, setTaxesValue] = useState(taxes?.data?.[0]?.rate || 0);
  const brancheId = whoami?.user?.branches[0]?.id;
  const [fileBase64, setFileBase64] = useState<any>('');
  // update Branch function

  const changeTaxType = () => {
    if (settings?.data?.tax_inclusive_pricing === updatedTaxInclusivePricing)
      return;

    updateSettings({
      id: '',
      data: { tax_inclusive_pricing: updatedTaxInclusivePricing },
    });
  };
  const updateTexes = async () => {
    if (!taxesData) return;
    if (taxesData.rate === taxesValue) return;
    await updateTax({
      id: taxesData.id,
      data: {
        name: `vat ${taxesValue}%`,
        rate: taxesValue,
        applies_on_order_types: ['1', '2'],
        name_localized: `vat ${taxesValue}%`,
      },
    });
  };
  const updateBoth = async () => {
    updateSettings({
      id: '',
      data: {
        business_name: updateAll.business_name,
        business_tax_number: updateAll.business_tax_number,
        country: updateAll.country,
      },
    });
    if (updateAll.business_type !== whoami?.business?.type) {
      updateBusiness({
        id: '',
        data: { business_type_id: updateAll.business_type },
      });
    }
    await updateBranch({
      id: brancheId,
      data: {
        phone: updateAll.phone,
        registered_address: JSON.stringify({
          streetName: updateAll.streetName,
          postalCode: updateAll.postalCode,
          additionalNumber: updateAll.additionalNumber,
          buildingNumber: updateAll.buildingNumber,
          commercialRegesterationNumber:
            updateAll.commercialRegesterationNumber,
          city: updateAll.city,
          citySubdivisionName: updateAll.citySubdivisionName,
          district: updateAll.district,
        }),
      },
    });
    holder = {
      streetName: updateAll.streetName,
      postalCode: updateAll.postalCode,
      additionalNumber: updateAll.additionalNumber,
      buildingNumber: updateAll.buildingNumber,
      commercialRegesterationNumber: updateAll.commercialRegesterationNumber,
      city: updateAll.city,
      citySubdivisionName: updateAll.citySubdivisionName,
      district: updateAll.district,
    };
  };
  const updateReceipt = async () => {
    await updateSettings({
      id: '',
      data: {
        receipt_header: updateAll.receipt_header,
        receipt_footer: updateAll.receipt_footer,
      },
    });
  };

  useEffect(() => {
    const fun = async () => {
      if (!fileBase64) return;
      setUpdateAll((prev) => ({
        ...prev,
        business_logo: fileBase64,
      }));
      await updateSettings({
        id: '',
        data: { business_logo: fileBase64 },
      });
    };
    fun();
  }, [fileBase64, updateSettings]);
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col rounded-none max-w-[805px]">
        <div className="self-start text-2xl font-semibold text-left text-zinc-800 max-md:mr-2.5">
          {t('SETTINGS_TITLE')}
        </div>

        <div className="flex  flex-col items-start p-4 mt-4 w-full bg-white rounded border border-gray-200 border-solid max-md:pl-5 max-md:max-w-full max-sm:gap-y-5">
          <div
            style={{ textAlign: 'right' }}
            className="align-justify align-right"
          >
            <div className="text-base align-rigth font-semibold text-zinc-800">
              {t('SETTINGS_BASIC_INFORMATION')}
            </div>
          </div>
          <div className="flex flex-col items-start pt-4 w-full text-sm font-semibold text-left  border-solid max-md:pl-5 max-md:max-w-full">
            <div className="self-start font-medium text-zinc-500">
              {t('companyType')}
            </div>
            <div className="relative mt-2 w-full text-sm">
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
                className="md:col-span-4 min-w-[327px] w-full flex-grow"
                value={updateAll?.business_type}
                disabled={false}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full ">
            <div className="w-full flex max-sm:flex-col gap-y-4 gap-x-4">
              <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                <div className="flex flex-col grow text-sm text-left">
                  <div className="self-start font-medium text-zinc-500">
                    {t('SETTINGS_STORE_NAME')}
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
                    {t('SETTINGS_STORE_ADDRESS')}
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
                  {t('SETTINGS_ADDITIONAL_NUMBER')}
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
                  {t('SETTINGS_POSTAL_CODE')}
                </div>
                <Input
                  onChange={(e) => {
                    setUpdateAll((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }));
                  }}
                  value={updateAll?.postalCode}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full">
            <div className="w-full flex max-sm:flex-col gap-y-4 gap-x-4">
              <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                <div className="self-start text-zinc-500">
                  {t('SETTINGS_COMMERCIAL_REGISTRATION_NUMBER')}
                </div>
                <Input
                  onChange={(e) => {
                    setUpdateAll((prev) => ({
                      ...prev,
                      commercialRegesterationNumber: e.target.value,
                    }));
                  }}
                  value={updateAll?.commercialRegesterationNumber}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                <div className="self-start text-zinc-500">
                  {t('SETTINGS_BUILDING_NUMBER')}
                </div>
                <Input
                  onChange={(e) => {
                    setUpdateAll((prev) => ({
                      ...prev,
                      buildingNumber: e.target.value,
                    }));
                  }}
                  value={updateAll?.buildingNumber}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full ">
            <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
              <div className="self-start text-zinc-500">
                {t('SETTINGS_TAX_NUMBER')}
              </div>
              <Input
                onChange={(e) => {
                  setUpdateAll((prev) => ({
                    ...prev,
                    business_tax_number: e.target.value,
                  }));
                }}
                value={updateAll?.business_tax_number}
                className="w-full"
              />
            </div>
            {/* <div className="w-full">
              <button
                onClick={() => {
                  updateTop();
                }}
                type="button"
                className="px-6 text-sm py-1.5  font-semibold mr-[12px] text-white whitespace-nowrap bg-[var(--main)] rounded min-h-[39px] max-md:px-5"
              >
                {t('save')}
              </button>
            </div> */}
          </div>
          {/* Part We Need To Start */}
          <div className="flex flex-col items-start w-full text-sm font-semibold text-left max-md:pl-5 max-md:max-w-full">
            <div
              style={{ textAlign: 'right' }}
              className="align-justify align-right mt-10"
            >
              <div className="text-base align-rigth font-semibold text-zinc-800">
                {t('SETTINGS_ADDRESS_PHONE')}
              </div>
            </div>

            <div className="flex flex-col items-start w-full text-sm max-md:pl-5 max-md:max-w-full gap-y-4">
              <div className="flex flex-wrap gap-6 self-start w-full text-zinc-500 max-md:max-w-full">
                <div className="w-full flex max-sm:flex-col gap-y-4 gap-x-4">
                  <div className="flex flex-col grow sm:mt-5 text-sm text-left w-full sm:w-[40%]">
                    <div className="self-start font-medium text-zinc-500">
                      {t('country')}
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
                      {t('city')}
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

              <div className="flex max-sm:flex-col gap-x-4 justify-center w-full text-sm max-md:max-w-full">
                <div className="w-full sm:w-[50%]">
                  <div className="flex flex-col grow max-sm:mt-5 text-sm text-left w-[100%]">
                    <div className="self-start font-medium text-zinc-500">
                      {t('citySubdivisionName')}
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
                      {t('district')}
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
                  {t('phone')}
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
            <div className="self-start">
              <button
                onClick={() => {
                  // updateBottom();
                  updateBoth();
                }}
                type="button"
                className="px-6 text-sm py-1.5 mt-8 font-semibold mr-[6px] text-white whitespace-nowrap bg-[var(--main)] rounded min-h-[39px] max-md:px-5"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>

        {/* الفاتورة */}
        <div className="flex flex-col items-start py-4 pr-2.5 pl-5 mt-7 w-full text-sm font-semibold text-left bg-white rounded border border-gray-200 border-solid max-md:pl-5 max-md:max-w-full">
          <div className="text-base text-zinc-800 max-md:mr-2">
            {t('INVOICE')}
          </div>
          <div className="mt-2 font-medium text-zinc-500 max-md:mr-2">
            {t('receipt_header')}
          </div>
          <div className="relative">
            <Input
              type="text"
              onChange={(e) => {
                setUpdateAll((prev) => ({
                  ...prev,
                  receipt_header: e.target.value,
                }));
              }}
              defaultValue={
                updateAll?.receipt_header?.includes('Dot')
                  ? 'Welcome'
                  : updateAll?.receipt_header
              }
            />
          </div>

          <div className="mt-4 font-medium text-zinc-500 max-md:mr-2">
            {t('receipt_footer')}
          </div>
          <div className="flex gap-5 items-center mt-2 max-w-full text-zinc-800 w-[1c 48px] max-md:mr-2">
            <div className="relative">
              <Input
                type="text"
                defaultValue={updateAll?.receipt_footer}
                onChange={(e) => {
                  setUpdateAll((prev) => ({
                    ...prev,
                    receipt_footer: e.target.value,
                  }));
                }}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center px-6 py-1.5 mt-8 text-white whitespace-nowrap bg-[var(--main)] rounded min-h-[39px] mr-2.5 max-md:px-5">
            <button
              onClick={() => {
                updateReceipt();
              }}
              className="gap-3 self-stretch"
            >
              {t('save')}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start py-4 pr-2.5 pl-5 mt-7 w-full text-sm font-semibold text-left bg-white rounded border border-gray-200 border-solid max-md:pl-5 max-md:max-w-full">
          <div className="text-base text-zinc-800 max-md:mr-2">{t('tax')}</div>
          <div className="mt-2 font-medium text-zinc-500 max-md:mr-2">
            {t('tax_rate')}
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
            {t('tax_method')}
          </div>
          <div className="flex gap-5 items-center mt-2 max-w-full text-zinc-800 w-[1c 48px] max-md:mr-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="taxOption"
                value="inclusive"
                onClick={() => {
                  setUpdatedTaxInclusivePricing(true);
                }}
                defaultChecked={updatedTaxInclusivePricing}
              />
              <span className="text-zinc-800">{t('inclusive')}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="taxOption"
                value="exclusive"
                onClick={() => {
                  setUpdatedTaxInclusivePricing(false);
                }}
                defaultChecked={!updatedTaxInclusivePricing}
              />
              <span className="text-zinc-800">{t('exclusive')}</span>
            </label>
          </div>

          <div className="flex flex-col justify-center items-center px-6 py-1.5 mt-8 text-white whitespace-nowrap bg-[var(--main)] rounded min-h-[39px] mr-2.5 max-md:px-5">
            <button
              onClick={() => {
                changeTaxType();
                updateTexes();
              }}
              className="gap-3 self-stretch"
            >
              {t('save')}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start self-start mt-4 max-w-full text-sm text-left w-[223px]">
          <img
            className="mb-5 rounded-full aspect-square object-contain size-[150px]"
            src={updateAll?.business_logo}
            alt=""
          />
          <div className="font-medium text-zinc-500 ">{t('upload_logo')}</div>
          <div className="flex gap-2 items-center">
            <label className="flex flex-1 justify-center items-center font-semibold bg-gray-200 rounded border border-solid border-zinc-300 w-[117px] h-[39px] text-mainText cursor-pointer">
              <span className="text-[14px]">{t('choose_file')}</span>
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
          </div>

          <Button
            variant={'outlineDel'}
            className="flex flex-col justify-center items-center px-6 py-1.5 mt-10 font-semibold text-red-500 bg-white rounded border border-red-500 border-solid min-h-[39px] max-md:px-5"
          >
            <div className="gap-3 self-stretch">{t('delete_account')}</div>
          </Button>
        </div>
      </div>
    </>
  );
}
