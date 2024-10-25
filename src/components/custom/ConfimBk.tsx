import { Button } from '@/components/custom/button';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { resetOrder } from '@/store/slices/orderSchema';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const ConfirmBk = ({ isOpen, setIsOpen, closeDialog, getStatusMessage }) => {
  let navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <div className="flex flex-col px-2 pt-10 pb-4 bg-white rounded-lg border border-gray-200 border-solid w-[458px] shadow-[0px_4px_19px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col w-full min-h-[193px]">
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

              <div className="flex flex-col  mt-sm w-full items-center">
                <div className="  text-mainText">
                  هل أنت متأكد أنك تريد التوقف عن التعديل؟
                </div>
                <div className="text-sm text-secText">
                  لديك تغييرات غير محفوظة. إذا خرجت الآن، فسوف تفقد تغييراتك
                </div>
                <div className="flex flex-col mt-6 w-full text-sm font-semibold text-right text-white whitespace-nowrap rounded">
                  <Button
                    onClick={() => {

                      handleBack();
                      //   closeDialog();
                    }}
                    variant={'fail'}
                    className="px-16 py-2"
                  >
                    نعم, اريد ان اتوقف عن التعديل!
                  </Button>
                  <Button
                    onClick={closeDialog}
                    variant={'outline'}
                    className="px-16 py-2 mt-sm text-mainText"
                  >
                    الغاء!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default ConfirmBk;
