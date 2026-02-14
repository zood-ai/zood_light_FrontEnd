import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import useIsCollapsed from '@/hooks/use-is-collapsed';
import SkipToMain from './skip-to-main';
import { useLoading } from '@/context/LoadingContext';
import TopLoadingBar from './TopLoadingBar';
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';
import { Layout } from './custom/layout';
import LanguageDropdown from '@/i18n/LanguageDropdown';
import { Button } from './custom/button';
import { UserNav } from './user-nav';
import { useDispatch, useSelector } from 'react-redux';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';
import { toggleUserNavigate } from '@/store/slices/usrNavSlice';
import { updateField } from '@/store/slices/orderSchema';
import { setSettings } from '@/store/slices/allSettings';
import createCrudService from '@/api/services/crudService';
import Cookies from 'js-cookie';
import axiosInstance from '@/api/interceptors';
import { Plus, Clock } from 'lucide-react';
import { SUBSCRIPTION_REMINDER_NAV_KEY } from '@/config/PayDialog';
interface WelcomeMessageProps {
  name: string;
}

const branchesService = createCrudService<any>('manage/branches');
const BottomNavBar = lazy(() => import('./BottomNavBar'));
const FastAddActions = lazy(() => import('./FastAddActions'));
const PayDialog = lazy(() => import('@/config/PayDialog'));

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ name }) => {
  const { t } = useTranslation();
  return (
    <section className="text-base font-thian text-right  text-neutral-500">
      <span>{t('WELCOME_BACK')}</span> <span className="font-bold">{name}</span>
    </section>
  );
};
const AppShell = () => {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const { isLoading } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const isRtl = useDirection();
  const userNav = useSelector((state: any) => state.usrNavSlice.active);
  const reFetch = useSelector((state: any) => state.allSettings.reFetch);
  const whoAmI = useSelector((state: any) => state.allSettings.value?.WhoAmI);
  const { openDialog } = useGlobalDialog();
  const dispatch = useDispatch();

  const [fastActionBtn, setFastActionBtn] = useState(false);
  const [showTopReminder, setShowTopReminder] = useState(false);
  const [topReminderText, setTopReminderText] = useState('');
  const [openRenewDialog, setOpenRenewDialog] = useState(false);
  const { data: branchData } = branchesService.useGetAll();
  const isPosRoute =
    location.pathname.includes('/zood-dashboard/individual-invoices/add') ||
    location.pathname.includes('/zood-dashboard/individual-invoices/edit/');

  useLayoutEffect(() => {
    const storedLang = window.localStorage.i18nextLng;
    const activeLang =
      i18n.resolvedLanguage || i18n.language || storedLang || 'ar';
    document.documentElement.lang = activeLang;
    document.documentElement.dir = i18n.dir(activeLang);
    document.body.dir = i18n.dir(activeLang);
  }, [i18n, i18n.language, i18n.resolvedLanguage]);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    const isMobileUA = /iPhone|iPad|iPod|Android/i.test(userAgent);

    // Feature detection: Check if touch is supported
    // const isTouchDevice =
    //   'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isMobileUA) {
      window.location.href = 'https://zood-e-invoice-flutter.vercel.app/';
    }
  }, []);

  useEffect(() => {
    if (userNav === true) {
      navigate(-1);
      openDialog('deleted');
      const timer = setTimeout(() => {
        dispatch(toggleUserNavigate(false));
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [userNav, navigate, openDialog, dispatch]);

  useEffect(() => {
    let isMounted = true;
    const fun = async () => {
      const [{ data: settings }, { data: whoAmIData }] = await Promise.all([
        axiosInstance.get('manage/settings'),
        axiosInstance.get('auth/whoami'),
      ]);
      if (!isMounted) return;
      dispatch(
        setSettings({
          settings,
          WhoAmI: whoAmIData,
        })
      );
    };

    fun();
    return () => {
      isMounted = false;
    };
  }, [reFetch, dispatch]);
  useEffect(() => {
    const defaultBranchId = branchData?.data?.[0]?.id;
    if (!defaultBranchId) return;
    dispatch(
      updateField({
        field: 'branch_id',
        value: defaultBranchId,
      })
    );
    Cookies.set('branch_id', defaultBranchId);
  }, [branchData, dispatch]);

  useEffect(() => {
    const computeReminder = () => {
      const endAt = whoAmI?.business?.end_at;
      const snoozeRaw = localStorage.getItem(SUBSCRIPTION_REMINDER_NAV_KEY);

      if (!endAt || !snoozeRaw) {
        setShowTopReminder(false);
        setTopReminderText('');
        return;
      }

      let isStillSnoozed = false;
      if (snoozeRaw === '1') {
        isStillSnoozed = true;
      } else {
        try {
          const parsed = JSON.parse(snoozeRaw) as { until?: number };
          isStillSnoozed =
            typeof parsed?.until === 'number' && Date.now() < parsed.until;
        } catch {
          localStorage.removeItem(SUBSCRIPTION_REMINDER_NAV_KEY);
          isStillSnoozed = false;
        }
      }

      if (!isStillSnoozed) {
        setShowTopReminder(false);
        setTopReminderText('');
        return;
      }

      const distance = new Date(endAt).getTime() - Date.now();
      if (distance <= 0) {
        setTopReminderText('انتهى الاشتراك');
        setShowTopReminder(true);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (days >= 16) {
        setShowTopReminder(false);
        setTopReminderText('');
        return;
      }

      setTopReminderText(
        days > 0
          ? `متبقي ${days} يوم على انتهاء الاشتراك`
          : `متبقي ${hours} ساعة على انتهاء الاشتراك`
      );
      setShowTopReminder(true);
    };

    computeReminder();
    const timer = setInterval(computeReminder, 30000);
    return () => clearInterval(timer);
  }, [whoAmI]);

  const reminderNode = showTopReminder ? (
    <div className="flex items-center justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900 min-w-[260px] max-w-[420px]">
      <div className="flex items-center gap-2 text-sm font-medium min-w-0">
        <Clock className="h-4 w-4 shrink-0" />
        <span className="truncate">{topReminderText}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          className="h-8 px-3 text-xs"
          onClick={() => {
            localStorage.removeItem(SUBSCRIPTION_REMINDER_NAV_KEY);
            setShowTopReminder(false);
            setOpenRenewDialog(true);
          }}
        >
          تجديد الآن
        </Button>
        <Button
          variant="ghost"
          className="h-8 px-2 text-xs text-amber-800 hover:text-amber-900 hover:bg-amber-100"
          onClick={() => setShowTopReminder(false)}
        >
          إخفاء
        </Button>
      </div>
    </div>
  ) : null;

  return (
    <>
      {!isPosRoute && <TopLoadingBar isLoading={isLoading} />}
      <div className="relative h-full overflow-hidden bg-background">
        {/* <SkipToMain /> */}
        {!isPosRoute && (
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            direction={isRtl ? 'rtl' : 'ltr'}
          />
        )}
        <main
          id="content"
          className={cn(
            'overflow-x-hidden transition-[margin] md:overflow-y-hidden h-full',
            isPosRoute ? 'h-[100dvh] overflow-y-hidden pt-0' : 'pt-16 md:pt-0',
            !isPosRoute &&
              (!isRtl
                ? isCollapsed
                  ? 'md:ml-14'
                  : 'md:ml-64'
                : isCollapsed
                ? 'md:mr-14'
                : 'md:mr-64')
          )}
        >
          <Layout>
            {/* ===== Top Heading ===== */}
            {!isPosRoute && (
              <Layout.Header
                className="border rounded-[8px] max-w-[95.5%] mx-auto mt-8 bg-background z-[10] flex-wrap md:flex-nowrap gap-y-2"
              >
                <h2 className="text-2xl font-bold tracking-tight flex items-center align-center gap-2 ">
                  <LanguageDropdown />
                  <div className="animate-shake">
                    <svg
                      className="animate-shake"
                      width="24"
                      height="26"
                      viewBox="0 0 24 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.3137 10.6399C10.8735 10.9044 10.3085 10.7512 10.0518 10.2976L6.94442 4.80765L5.90862 2.97767C5.64526 2.51239 4.87778 2.2302 4.09816 2.68925C3.32138 3.14662 3.18477 3.95284 3.44354 4.41003L6.03302 8.98498L8.1046 12.6449C8.36132 13.0986 8.21255 13.6806 7.77231 13.945C7.33208 14.2096 6.76709 14.0563 6.51037 13.6028L4.4388 9.94277C4.17543 9.47749 3.40795 9.19531 2.62833 9.65436C1.85155 10.1117 1.71494 10.918 1.97371 11.3752L6.63477 19.61C8.61428 23.1073 13.4991 24.2423 17.6415 21.8031C21.7812 19.3658 23.2526 14.4964 21.2777 11.0072L18.1704 5.51728C17.907 5.052 17.1395 4.76982 16.3599 5.22886C15.5833 5.68618 15.4465 6.49225 15.7052 6.94947C15.7053 6.94953 15.7053 6.94959 15.7053 6.94965L17.7768 10.6096C17.9009 10.8287 17.9348 11.0896 17.8711 11.3346C17.8074 11.5795 17.6514 11.788 17.4376 11.9139C15.5399 13.0313 14.9583 15.1918 15.7891 16.6598C16.0459 17.1133 15.8972 17.6954 15.4568 17.9599C15.0166 18.2243 14.4517 18.0711 14.1949 17.6175C12.8917 15.3151 13.7121 12.4673 15.7493 10.8017L14.1111 7.90744L11.0037 2.4175C10.7404 1.95221 9.97291 1.67003 9.19325 2.12908C8.41647 2.58645 8.27986 3.39267 8.53863 3.84986L11.646 9.33981C11.9027 9.79335 11.7539 10.3755 11.3137 10.6399ZM7.15457 1.5294C7.44356 1.1074 7.82687 0.743663 8.27753 0.478309C9.73977 -0.382681 11.7171 -0.096352 12.5979 1.4597L14.3603 4.57331C14.6444 4.17507 15.0135 3.83167 15.4442 3.57811C16.9065 2.71711 18.8839 3.00345 19.7645 4.55949L22.872 10.0494C25.4735 14.6456 23.3853 20.6113 18.5572 23.454C13.7322 26.295 7.63745 25.156 5.04055 20.5679L0.3795 12.333C-0.505826 10.7688 0.247487 8.86628 1.71261 8.0036C2.13873 7.7527 2.60859 7.59922 3.08232 7.54621L1.84933 5.36783C0.964001 3.80367 1.71731 1.90117 3.18244 1.03848C4.47507 0.277374 6.17024 0.412828 7.15457 1.5294ZM20.5284 3.68894C19.3682 2.25937 17.7134 1.73203 16.0934 2.28812C15.6375 2.44462 15.1627 2.1256 15.033 1.57555C14.9033 1.02551 15.1677 0.452733 15.6236 0.296228C17.8417 -0.465165 20.1494 0.261746 21.755 2.2401C22.0866 2.64873 22.0809 3.30432 21.7422 3.70441C21.4035 4.10449 20.86 4.09757 20.5284 3.68894ZM2.47453 20.1228C2.93057 19.8721 3.51584 20.0174 3.78177 20.4474C4.83561 22.1512 6.44669 23.4397 8.43346 24.2756C8.91554 24.4785 9.13193 25.0114 8.91677 25.4659C8.70162 25.9204 8.1364 26.1244 7.65432 25.9215C5.34555 24.9501 3.40855 23.422 2.13029 21.3553C1.86436 20.9253 2.01848 20.3735 2.47453 20.1228Z"
                        fill="#1958A8"
                      />
                    </svg>
                  </div>
                  <div className="hidden md:flex">
                    <WelcomeMessage name={`${Cookies.get('name')}`} />
                  </div>
                </h2>
                <div
                  className={`${
                    isRtl ? 'mr-auto' : 'ml-auto'
                  } flex items-center gap-2 min-w-0`}
                >
                  {isRtl && reminderNode}
                  <Button
                    style={{
                      flexDirection: isRtl ? 'row-reverse' : 'row',
                    }}
                    className="pe-[24px] gap-2 ps-[16px] pt-[8px] pb-[6px] flex shrink-0"
                    variant={'default'}
                    onClick={() => setFastActionBtn(true)}
                  >
                    <Plus size={16} /> <span>{t('FAST_CREATE')}</span>
                  </Button>
                  {!isRtl && reminderNode}
                </div>
                <UserNav />
              </Layout.Header>
            )}

            <Layout.Body
              className={cn(
                'bg-mainBg',
                isPosRoute ? 'mb-0 h-full overflow-hidden' : 'mb-14'
              )}
            >
              <Outlet />
              {!isPosRoute && (
                <div
                  style={{
                    right: !isRtl ? '1.5rem' : 'auto',
                    left: isRtl ? '1.5rem' : 'auto',
                  }}
                  className="fixed bottom-[1.5rem] left-[1.5rem]"
                >
                  <a
                    href={`https://wa.me/+966551164271`}
                    target="_blank"
                    className="flex gap-2 cursor-pointer justify-center  w-[51px] h-[51px] rounded-full bg-green-500 "
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/3769057990693e0194a9bacc9caa2588cf42c25f2fe1a813eeab42095ea7745e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                      className="object-contain   rounded-full shrink-0 w-[28px] aspect-square"
                      title="تواصل عبر الواتس اب"
                    />
                  </a>
                </div>
              )}
            </Layout.Body>
          </Layout>
        </main>
        {!isPosRoute && (
          <Suspense fallback={null}>
            <div className="flex md:hidden">
              <BottomNavBar />
            </div>
          </Suspense>
        )}
      </div>
      <Suspense fallback={null}>
        <FastAddActions
          isOpen={fastActionBtn}
          onClose={() => setFastActionBtn(false)}
        />
      </Suspense>
      <Suspense fallback={null}>
        {openRenewDialog && (
          <PayDialog
            showRemaining={true}
            ignoreSnooze={true}
            onClose={() => setOpenRenewDialog(false)}
          />
        )}
      </Suspense>
    </>
  );
};

export default AppShell;
