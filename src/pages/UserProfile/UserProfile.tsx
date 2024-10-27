import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { Button } from '@/components/custom/button';
import ChangePasswordDial from '@/components/ChangePasswordDial';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

export default function UserProfile() {
  const [fastActionBtn, setFastActionBtn] = useState(false);
  const fileInputRef = useRef<any>(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const fileName = e.target.files?.[0]?.name || 'No file chosen';
    console.log(fileName); // You can display this in your UI if desired
  };

  return (
    <>
      <DetailsHeadWithOutFilter />

      <div className="flex flex-col rounded-none max-w-[633px]" dir="ltr">
        <div className="pt-6 pr-7 pb-11 pl-16 w-full bg-white rounded border border-gray-200 border-solid max-md:px-5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-[79%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col mt-4 w-full text-sm text-right max-md:mt-10">
                <div className="flex flex-col items-end self-end max-w-full font-medium text-zinc-800 w-[278px]">
                  <div>الاسم</div>
                  <Input className=" w-[278px] mt-xs" />

                  <div className="mt-4">الرقم السري</div>
                </div>
                <div className="flex gap-2 font-semibold ">
                  <div
                    onClick={() => setFastActionBtn(true)}
                    className="grow my-auto text-indigo-900 cursor-pointer"
                  >
                    تغير الرقم السري
                  </div>
                  <Input className="grow   w-[278px] mt-xs" />
                  {/* ********
                  </Input> */}
                </div>
              </div>
            </div>

            <div className="flex flex-col ml-5 w-[21%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow max-md:mt-10">
                <div
                  onClick={handleButtonClick}
                  className=" cursor-pointer flex flex-col items-center rounded-full bg-black bg-opacity-10 h-[91px] w-[91px] max-md:mx-2 relative"
                >
                  <div className="flex shrink-0 rounded-full bg-black bg-opacity-40 h-[91px] w-[91px]" />
                  <div className="absolute top-[30%] z-10">
                    <svg
                      width="41"
                      height="36"
                      viewBox="0 0 41 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M26.6985 0C28.3529 0 29.8217 1.06251 30.345 2.63726L31.1768 5.14286H33.3124C37.558 5.14286 41 8.5968 41 12.8571V28.2857C41 32.5461 37.558 36 33.3124 36H7.6876C3.44199 36 0 32.5461 0 28.2857V12.8571C0 8.5968 3.44199 5.14286 7.6876 5.14286H9.82218L10.6555 2.63726C11.1783 1.06251 12.6471 0 14.302 0H26.699H26.6985ZM20.5003 10.2857C15.5469 10.2857 11.5314 14.3151 11.5314 19.2857C11.5314 24.2563 15.5469 28.2857 20.5003 28.2857C25.4536 28.2857 29.4691 24.2563 29.4691 19.2857C29.4691 14.3151 25.4536 10.2857 20.5003 10.2857ZM20.5003 12.8571C24.0386 12.8571 26.9066 15.7351 26.9066 19.2857C26.9066 22.8363 24.0386 25.7143 20.5003 25.7143C16.9619 25.7143 14.0939 22.8363 14.0939 19.2857C14.0939 15.7351 16.9619 12.8571 20.5003 12.8571Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="absolute top-[20%] ">
                    <svg
                      width="50"
                      height="53"
                      viewBox="0 0 50 53"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M24.7399 7.09797e-07C21.5057 -0.000989837 18.3562 1.0348 15.7539 2.95534C13.1516 4.87589 11.2335 7.58004 10.281 10.6709C9.32856 13.7617 9.39197 17.0765 10.4619 20.1287C11.5319 23.1808 13.5521 25.8096 16.2259 27.6292C11.5853 29.3313 7.5602 32.3832 4.66867 36.3921C1.77714 40.4011 0.151486 45.1836 0.000928982 50.1242C-0.0154813 50.6713 0.186079 51.2024 0.561269 51.6008C0.936459 51.9992 1.45454 52.2322 2.00155 52.2486C2.54856 52.265 3.07969 52.0635 3.47808 51.6883C3.87648 51.3131 4.10952 50.795 4.12593 50.248C4.28969 44.8895 6.53344 39.8053 10.3817 36.0729C14.23 32.3404 19.3803 30.253 24.7413 30.253C30.1023 30.253 35.2526 32.3404 39.1009 36.0729C42.9492 39.8053 45.1929 44.8895 45.3567 50.248C45.3588 50.5226 45.4157 50.794 45.5241 51.0464C45.6325 51.2987 45.7902 51.5268 45.9879 51.7174C46.1856 51.908 46.4195 52.0571 46.6756 52.1561C46.9318 52.2551 47.2051 52.302 47.4796 52.2939C47.7541 52.2859 48.0243 52.2231 48.2742 52.1092C48.5241 51.9954 48.7488 51.8327 48.935 51.6309C49.1212 51.4291 49.2652 51.1921 49.3587 50.9338C49.4521 50.6756 49.493 50.4013 49.4789 50.127C49.3289 45.1859 47.7035 40.4028 44.8119 36.3933C41.9204 32.3838 37.895 29.3315 33.2539 27.6292C35.9278 25.8096 37.948 23.1808 39.0179 20.1287C40.0879 17.0765 40.1513 13.7617 39.1989 10.6709C38.2464 7.58004 36.3283 4.87589 33.7259 2.95534C31.1236 1.0348 27.9742 -0.000989837 24.7399 7.09797e-07ZM13.7399 15.125C13.7399 12.2076 14.8989 9.40973 16.9618 7.34683C19.0247 5.28393 21.8225 4.125 24.7399 4.125C27.6573 4.125 30.4552 5.28393 32.5181 7.34683C34.581 9.40973 35.7399 12.2076 35.7399 15.125C35.7399 18.0424 34.581 20.8403 32.5181 22.9032C30.4552 24.9661 27.6573 26.125 24.7399 26.125C21.8225 26.125 19.0247 24.9661 16.9618 22.9032C14.8989 20.8403 13.7399 18.0424 13.7399 15.125Z"
                        fill="#868686"
                        fill-opacity="0.33"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-1.5 text-sm text-right text-zinc-800 max-md:mx-1">
                  الصورة الشخصية
                </div>
                <Button
                  onClick={handleButtonClick}
                  variant={'outlineMain'}
                  className="flex flex-col justify-center items-center px-6 py-1.5 mt-1.5 w-full text-sm font-semibold  "
                >
                  <div className="gap-3 self-stretch">تحميل</div>
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
        <Button className="mt-5 mb-3.5 w-[78px] max-md:mt-10 max-md:mb-5 self-end">
          حفظ{' '}
        </Button>
      </div>
      <ChangePasswordDial
        isOpen={fastActionBtn}
        onClose={() => setFastActionBtn(false)}
      />
    </>
  );
}
