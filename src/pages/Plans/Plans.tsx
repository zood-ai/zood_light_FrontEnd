import { Outlet } from 'react-router-dom';
import {
  IconBrowserCheck,
  IconExclamationCircle,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import { Separator } from '@/components/ui/separator';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';

export default function Plans() {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const { data } = createCrudService<any>('auth/whoami').useGetAll();
  return (
    <>
      <DetailsHeadWithOutFilter />

      <div
        style={{
          textAlign: isRtl ? 'right' : 'left',
        }}
        className="flex flex-col w-full text-base font-semibold text-zinc-800 max-md:mt-4 min-h-[52vh]"
      >
        <div className="self-start">{t('SUBSCRIPTION_DETAILS')}</div>
        <div className="flex flex-wrap gap-4 mt-3.5 whitespace-nowrap">
          <div className=" w-[163px] h-[71px] bg-white rounded border border-mainBorder ps-[13px] flex flex-col justify-evenly border-solid max-md:pl-5">
            <div className="  text-[14px] font-normal leading-[26.56px]">
              {t('SUBSCRIPTION_PLAN')}
            </div>
            <div className="  text-[16px] font-semibold l ">
              {data?.business?.plan[0]?.name}
            </div>
          </div>
          <div className=" w-[163px] h-[71px] bg-white rounded border border-mainBorder ps-[13px] flex flex-col justify-evenly border-solid max-md:pl-5">
            <div className="  text-[14px] font-normal leading-[26.56px]">
              {t('SUBSCRIPTION')}
            </div>
            <div className="  text-[16px] font-semibold l ">
              {data?.business?.plan[0]?.duration}
            </div>
          </div>
          <div className=" w-[173px] h-[71px] bg-white rounded border border-mainBorder ps-[13px] flex flex-col justify-evenly border-solid max-md:pl-5 ">
            <div className=" text-[14px] font-normal leading-[26.56px] ">
              {t('SUBSCRIPTION_END_DATE')}
            </div>
            <div className="  text-[16px] font-semibold l ">
              {data?.business?.plan[0]?.pivot?.to_date}
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col self-start mt-10 max-w-full text-sm w-[163px]">
          <div className="self-start   text-black max-md:ml-2.5">
            هل تريد الغاء الاشتراك؟
          </div>
          <Button
            variant={'outlineDel'}
            className="flex flex-col justify-center items-center px-6 py-1.5 mt-1.5 w-full font-semibold   min-h-[39px] max-md:px-5"
          >
            <div className="gap-3 self-stretch">الغاء الاشتراك</div>
          </Button>
        </div> */}
      </div>
    </>
  );
}
