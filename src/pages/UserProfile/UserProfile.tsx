import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { Button } from '@/components/custom/button';
import ChangePasswordDial from '@/components/ChangePasswordDial';
import { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import axiosInstance from '@/api/interceptors';
import createCrudService from '@/api/services/crudService';
import Cookies from 'js-cookie';

export default function UserProfile() {
  const fileInputRef = useRef<any>(null);
  const [personalImage, setPersonalImage] = useState('');
  const [error, setError] = useState('');

  const userId = Cookies.get('userId');
  const { data } = createCrudService<any>(`/auth/users/${userId}`).useGetAll();
  console.log({ data });
  const [formDataState, setFormDataState] = useState({
    name: data?.data?.name,
    email: data?.data?.email,
    phone: data?.data?.phone,
    image: data?.data?.image,
  });

  useEffect(() => {
    setFormDataState({
      name: data?.data?.name,
      email: data?.data?.email,
      phone: data?.data?.phone,
      image: data?.data?.image,
    });
  }, [data]);

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setFormDataState((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleButtonClick = () => {
    return;
    fileInputRef.current.click();
  };
  console.log(formDataState);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('الصورة لا يمكن أن تتجاوز 2 ميجا بايت');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result?.toString().split(',')[1];
        const base64String = `data:image/*;base64,${base64}`;
        setFormDataState((prevData) => ({
          ...prevData,
          image: base64String,
        }));
      };
      reader.readAsDataURL(file);

      const imageUrl = URL.createObjectURL(file);
      setPersonalImage(imageUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (personalImage) {
        URL.revokeObjectURL(personalImage);
      }
    };
  }, [personalImage]);

  const handleSubmitData = async () => {
    try {
      const res = await axiosInstance.put(`/auth/users/${userId}`, {
        phone: formDataState.phone,
        name: formDataState.name,
        email: formDataState.email,
        image: formDataState.image,
      });

      if (res.data.success) {
        Cookies.set('name', formDataState.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col rounded-none max-w-[633px]" dir="ltr">
      <div className="pt-6 pr-7 pb-11 pl-16 w-full bg-white rounded border border-gray-200 max-md:px-5 max-md:max-w-full">
        <div className="flex gap-10 items-start max-md:flex-col">
          <div className="flex flex-col w-2/3 gap-4">
            <div className="flex flex-col items-end">
              <label className="mb-1 text-sm font-medium text-zinc-800">
                الاسم
              </label>
              <Input
                dir="rtl"
                name="name"
                defaultValue={formDataState.name}
                onChange={handleInputChanges}
                className="w-full"
              />
            </div>
            <div className="flex flex-col items-end">
              <label className="mb-1 text-sm font-medium text-zinc-800">
                الإيميل
              </label>
              <Input
                dir="rtl"
                name="email"
                defaultValue={formDataState.email}
                onChange={handleInputChanges}
                className="w-full"
              />
            </div>
            <div className="flex flex-col items-end">
              <label className="mb-1 text-sm font-medium text-zinc-800">
                رقم الموبايل
              </label>
              <Input
                dir="rtl"
                name="phone"
                defaultValue={formDataState.phone}
                onChange={handleInputChanges}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col items-center w-1/3 gap-4">
            <div
              onClick={handleButtonClick}
              className="cursor-pointer flex items-center justify-center rounded-full bg-gray-100 h-24 w-24 relative"
            >
              {personalImage ? (
                <img
                  src={personalImage}
                  alt="Uploaded preview"
                  className="rounded-full h-24 w-24 object-cover"
                />
              ) : (
                <svg
                  width="41"
                  height="36"
                  viewBox="0 0 41 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M26.6985 0C28.3529 0 29.8217 1.06251 30.345 2.63726L31.1768 5.14286H33.3124C37.558 5.14286 41 8.5968 41 12.8571V28.2857C41 32.5461 37.558 36 33.3124 36H7.6876C3.44199 36 0 32.5461 0 28.2857V12.8571C0 8.5968 3.44199 5.14286 7.6876 5.14286H9.82218L10.6555 2.63726C11.1783 1.06251 12.6471 0 14.302 0H26.699H26.6985ZM20.5003 10.2857C15.5469 10.2857 11.5314 14.3151 11.5314 19.2857C11.5314 24.2563 15.5469 28.2857 20.5003 28.2857C25.4536 28.2857 29.4691 24.2563 29.4691 19.2857C29.4691 14.3151 25.4536 10.2857 20.5003 10.2857ZM20.5003 12.8571C24.0386 12.8571 26.9066 15.7351 26.9066 19.2857C26.9066 22.8363 24.0386 25.7143 20.5003 25.7143C16.9619 25.7143 14.0939 22.8363 14.0939 19.2857C14.0939 15.7351 16.9619 12.8571 20.5003 12.8571Z"
                    fill="#999"
                  />
                </svg>
              )}
            </div>
            <Button
              disabled
              onClick={handleButtonClick}
              variant={'outlineMain'}
              className="w-full px-6 py-2 text-sm font-semibold"
            >
              تحميل الصورة
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {error && <span className="text-red-600 text-sm">{error}</span>}
          </div>
        </div>

        <Button
          onClick={handleSubmitData}
          className="mt-6 self-end px-6 py-2 text-sm font-semibold"
        >
          حفظ
        </Button>
      </div>
    </div>
  );
}
