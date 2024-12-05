import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Button } from '@/components/custom/button';
import { use } from 'i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/api/interceptors';
import { useDispatch } from 'react-redux';
import { toggleUserNavigate, userNavigate } from '@/store/slices/usrNavSlice';
import { useToast } from '@/components/custom/useToastComp';
import { titleMapping } from '@/constant/constant';

interface GlobalDialogContextType {
  openDialog: (status: 'deleted' | 'updated' | 'added' | 'del') => void;
  closeDialog: () => void;
  delRoute: any;
}

const GlobalDialogContext = createContext<GlobalDialogContextType | undefined>(
  undefined
);

export const useGlobalDialog = () => {
  const context = useContext(GlobalDialogContext);
  if (!context) {
    throw new Error(
      'useGlobalDialog must be used within a GlobalDialogProvider'
    );
  }
  return context;
};

export const GlobalDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [delRoutedelRoute, setdelRoutedelRoute] = useState('');
  const [status, setStatus] = useState<
    'deleted' | 'updated' | 'added' | 'del' | null
  >(null);
  const { showToast } = useToast();
  const getStatusMessage = (status1: any) => {
    switch (status1) {
      case 'deleted':
        return 'تم حذف العنصر بنجاح';
      case 'updated':
        return 'تم تحديث العنصر بنجاح';
      case 'added':
        return 'تم إضافة العنصر بنجاح';
      default:
        return '';
    }
  };
  const openDialog = (status: 'deleted' | 'updated' | 'added' | 'del') => {
    setStatus(status);
    const message = getStatusMessage(status);
    // setIsOpen(true);
    if (status === 'del') {
      setStatus(status);
      setIsOpen(true);
    } else {
      showToast({
        description: message,
        duration: 4000,
        variant: 'default',
      });
    }
  };
  const closeDialog = () => {
    setStatus(null);
    setIsOpen(false);
  };
  const delRoute = (route) => {
    setdelRoutedelRoute(route);
  };

  const url = window.location.href;

  // Split the URL by '/' to get an array of path segments
  const segments = url.split('/');

  // Extract the ID, which is the last segment
  const id = segments.pop();

  // Dynamically remove the last two segments to get the parent route URL
  const newUrl = segments.join('/');

  let dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  let pagePath = window.location.pathname; // Get the current path
  pagePath = pagePath.replace(/\/edit\/[^/]+$/, '/edit');

  const title = titleMapping(pagePath); // Get the title object based on the path
  const isArabic = true;
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <GlobalDialogContext.Provider value={{ openDialog, delRoute, closeDialog }}>
      {children}
      {status !== 'del' && (
        <>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
              <div className="flex flex-col px-2 pt-10 pb-4 bg-white rounded-lg border border-gray-200 border-solid w-[458px] shadow-[0px_4px_19px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col w-full min-h-[193px]">
                  <div className="object-contain self-center aspect-square w-[78px]">
                    <svg
                      width="78"
                      height="78"
                      viewBox="0 0 78 78"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M39 0C60.5391 0 78 17.4609 78 39C78 60.5391 60.5391 78 39 78C17.4609 78 0 60.5391 0 39C0 17.4609 17.4609 0 39 0ZM39 4.875C20.1533 4.875 4.875 20.1533 4.875 39C4.875 57.8467 20.1533 73.125 39 73.125C57.8467 73.125 73.125 57.8467 73.125 39C73.125 20.1533 57.8467 4.875 39 4.875ZM55.1382 28.9543C56.0901 29.9062 56.0901 31.4495 55.1382 32.4014L37.9025 49.6372C37.0186 50.5211 35.6247 50.5842 34.668 49.8266L34.4554 49.6372L24.1139 39.2957C23.162 38.3438 23.162 36.8005 24.1139 35.8486C25.0658 34.8967 26.6092 34.8967 27.5611 35.8486L36.1772 44.4647L51.6911 28.9543C52.643 28.0024 54.1863 28.0024 55.1382 28.9543Z"
                        fill="#2DAA48"
                      />
                    </svg>
                  </div>

                  <div className="flex flex-col mt-5 w-full">
                    <div className="text-base font-medium text-center text-mainText">
                      {getStatusMessage(status)}
                    </div>
                    <div className="flex flex-col mt-6 w-full text-sm font-semibold text-right text-white whitespace-nowrap rounded">
                      <Button
                        onClick={closeDialog}
                        variant={'success'}
                        className="px-16 py-2"
                      >
                        حسنا!
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
      {status == 'del' && (
        <>
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
              <div className="flex flex-col px-2 pt-10 pb-4 bg-white rounded-lg border border-gray-200 border-solid w-[458px] shadow-[0px_4px_19px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col w-full min-h-[193px] text-center">
                  <div className="object-contain self-center aspect-square w-[78px]">
                    <svg
                      width="68"
                      height="68"
                      viewBox="0 0 68 68"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M34 0C27.2754 0 20.7019 1.99407 15.1106 5.73003C9.51936 9.466 5.16149 14.7761 2.58811 20.9888C0.0147316 27.2015 -0.658582 34.0377 0.653316 40.6331C1.96521 47.2284 5.2034 53.2866 9.95838 58.0416C14.7134 62.7966 20.7716 66.0348 27.3669 67.3467C33.9623 68.6586 40.7986 67.9853 47.0113 65.4119C53.2239 62.8385 58.534 58.4807 62.27 52.8894C66.0059 47.2981 68 40.7246 68 34C67.9903 24.9856 64.405 16.3433 58.0309 9.96914C51.6568 3.59501 43.0144 0.00974973 34 0ZM34 62.3333C28.3962 62.3333 22.9183 60.6716 18.2589 57.5583C13.5995 54.445 9.96791 50.0199 7.82343 44.8427C5.67895 39.6655 5.11785 33.9686 6.2111 28.4724C7.30435 22.9763 10.0028 17.9278 13.9653 13.9653C17.9278 10.0028 22.9763 7.30433 28.4725 6.21108C33.9686 5.11784 39.6655 5.67893 44.8427 7.82341C50.02 9.9679 54.445 13.5995 57.5583 18.2588C60.6716 22.9182 62.3333 28.3962 62.3333 34C62.3251 41.5119 59.3373 48.7138 54.0256 54.0256C48.7139 59.3373 41.512 62.3251 34 62.3333Z"
                        fill="#FC3030"
                      />
                      <path
                        d="M34 14.1667C33.2486 14.1667 32.5279 14.4652 31.9965 14.9965C31.4652 15.5279 31.1667 16.2486 31.1667 17V39.6667C31.1667 40.4181 31.4652 41.1388 31.9965 41.6701C32.5279 42.2015 33.2486 42.5 34 42.5C34.7514 42.5 35.4721 42.2015 36.0035 41.6701C36.5348 41.1388 36.8333 40.4181 36.8333 39.6667V17C36.8333 16.2486 36.5348 15.5279 36.0035 14.9965C35.4721 14.4652 34.7514 14.1667 34 14.1667Z"
                        fill="#FC3030"
                      />
                      <path
                        d="M36.8333 51C36.8333 49.4352 35.5648 48.1667 34 48.1667C32.4352 48.1667 31.1667 49.4352 31.1667 51C31.1667 52.5648 32.4352 53.8333 34 53.8333C35.5648 53.8333 36.8333 52.5648 36.8333 51Z"
                        fill="#FC3030"
                      />
                    </svg>
                  </div>

                  <div className="flex flex-col mt-5 w-full ">
                    <div className="  text-mainText">
                      هل أنت متأكد أنك تريد حذف{' '}
                      <span className="mx-1">{title?.ar}</span>
                    </div>
                    <div className="text-sm text-secText">
                      لديك تغييرات غير محفوظة. إذا حذفت{' '}
                      <span className="mx-1">{title?.ar} </span>
                      الآن، فسوف تفقد تغييراتك{' '}
                    </div>
                    <div className="flex flex-col mt-6 w-full text-sm font-semibold text-right text-white whitespace-nowrap rounded">
                      <Button
                        loading={loading}
                        disabled={loading}
                        onClick={async () => {
                          setLoading(true);

                          const res = await axiosInstance.delete(
                            `${delRoutedelRoute}/${id}`
                          );

                          setLoading(false);
                          setIsOpen(false);
                          if (res.status !== 200) {
                            setLoading(false);
                            setIsOpen(false);
                            return;
                          }
                          if (res.status === 200) {
                            dispatch(
                              userNavigate((String(newUrl) as string) || '')
                            );
                            dispatch(toggleUserNavigate(true));
                          }
                          // navigate(-1);
                          // window.location.replace(newUrl);
                        }}
                        variant={'fail'}
                        className="px-16 py-2"
                      >
                        نعم, اريد الحذف{' '}
                      </Button>
                      <Button
                        onClick={() => setIsOpen(false)}
                        variant={'outline'}
                        className="px-16 py-2 mt-5"
                      >
                        الغاء{' '}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </GlobalDialogContext.Provider>
  );
};
