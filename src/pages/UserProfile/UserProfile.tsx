import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { Button } from '@/components/custom/button';
import ChangePasswordDial from '@/components/ChangePasswordDial';
import { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

export default function UserProfile() {
  const [fastActionBtn, setFastActionBtn] = useState(false);
  const fileInputRef = useRef<any>(null);
  const [personalImage, setPersonalImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    image: '',
  });

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setFormData((prevData) => ({
          ...prevData,
          image: base64String,
        }));
      };
      reader.onerror = (error) => {
        console.error('Error converting file to Base64: ', error);
      };
      reader.readAsDataURL(file);
      const imageUrl = URL.createObjectURL(file);
      setPersonalImage(imageUrl);
    } else {
      setPersonalImage('');
    }
  };

  useEffect(() => {
    return () => {
      if (personalImage) {
        URL.revokeObjectURL(personalImage);
      }
    };
  }, [personalImage]);

  const handleSubmitData = () => {
  };

  return (
    <>
      <DetailsHeadWithOutFilter />

      <div className="flex flex-col rounded-none max-w-[633px]" dir="ltr">
        <div className="pt-6 pr-7 pb-11 pl-16 w-full bg-white rounded border border-gray-200 border-solid max-md:px-5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-[79%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col mt-4 w-full text-sm text-right max-md:mt-10">
                <div className="flex flex-col items-end self-end max-w-full font-medium text-zinc-800">
                  <div>الاسم</div>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChanges}
                    className="grow w-[120%] mt-xs"
                  />

                  <div className="mt-4">الرقم السري</div>
                </div>
                <div className="flex gap-2 font-semibold">
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleInputChanges}
                    className="grow w-[278px] mt-xs"
                  />
                </div>
                <div
                  onClick={() => setFastActionBtn(true)}
                  className="grow gap-2 my-2 text-indigo-900 cursor-pointer"
                >
                  تغير الرقم السري
                </div>
              </div>
            </div>

            <div className="flex flex-col ml-5 w-[21%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow max-md:mt-10 items-center">
                <div
                  onClick={handleButtonClick}
                  className="cursor-pointer flex flex-col items-center rounded-full bg-black bg-opacity-10 h-[91px] w-[91px] max-md:mx-2 relative "
                >
                  {personalImage ? (
                    <img
                      src={personalImage}
                      alt="Uploaded preview"
                      className="rounded-full h-[91px] w-[91px] object-cover"
                    />
                  ) : (
                    <>
                      <div className="flex shrink-0 rounded-full bg-black bg-opacity-40 h-[91px] w-[91px]" />
                      <div className="absolute top-[30%] z-10">
                        {/* HERE */}
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
                    </>
                  )}
                </div>
                <div className="w-full mt-1.5 text-sm text-right text-zinc-800 max-md:mx-1">
                  الصورة الشخصية
                </div>
                <Button
                  onClick={handleButtonClick}
                  variant={'outlineMain'}
                  className="flex flex-col justify-center items-center px-6 py-1.5 mt-1.5  text-sm font-semibold w-full "
                >
                  <div className="gap-3">تحميل</div>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmitData}
            className="mt-5 mb-3.5 w-[78px] max-md:mt-10 max-md:mb-5 self-end"
          >
            حفظ{' '}
          </Button>
        </div>
      </div>
      <ChangePasswordDial
        isOpen={fastActionBtn}
        onClose={() => setFastActionBtn(false)}
      />
    </>
  );
}
