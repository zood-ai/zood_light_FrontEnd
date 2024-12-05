import { useState } from 'react';
import { IconLoader } from '@tabler/icons-react';
import { AlertDialog, AlertDialogContent } from './ui/alert-dialog';
import { Button } from './custom/button';
import { Input } from './ui/input';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/api/interceptors';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
export default function ChangePasswordDial({ isOpen, onClose, userId }) {
  const { t } = useTranslation();
  const [data, setData] = useState({
    // currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    business_reference: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChangePass = async () => {
    console.log(data);
    if (data.newPassword.length < 6) {
      toast({
        title: 'خطأ',
        description: 'يجب أن تتكون كلمة المرور الخاصة بك من 6 أحرف على الأقل',
        duration: 3000,
        variant: 'destructive',
      });
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'الرقم السري الجديد غير متطابق',
        duration: 3000,
        variant: 'destructive',
      });
      return;
    }

    const res = await axiosInstance.put(`/auth/users/${userId}`, {
      // email: data.email,
      // business_reference: data.business_reference,
      password: data.newPassword,
      // token: Cookies.get('accessToken'),
    });
    if (res.status === 200) {
      toast({
        title: 'نجاح',
        description: 'تم تغير الرقم السري بنجاح',
        duration: 3000,
        variant: 'default',
      });
    } else {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ ما',
        duration: 3000,
        variant: 'destructive',
      });
    }
    console.log({ res });
  };
  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-[1107px] bg-transparent border-none border">
          <div className="flex flex-col text-sm font-semibold text-right rounded max-w-[401px]">
            <form
              onSubmit={(e) => e.preventDefault()}
              autoComplete="off"
              className="flex flex-col pt-6 pb-4 w-full bg-white rounded border border-gray-200 border-solid"
            >
              <div className="self-center mb-4 text-xl text-black">
                {t('CHANGE_PASSWORD_TITLE')}
              </div>
              <div className="flex flex-col items-start pr-5 pl-2 w-full font-medium text-zinc-500">
                <Input
                  onChange={(e) =>
                    setData({ ...data, newPassword: e.target.value })
                  }
                  autoComplete="off"
                  type="password"
                  label={t('CURRENT_PASSWORD')}
                  placeholder={t('CURRENT_PASSWORD')}
                  className="mt-2 max-w-full bg-white rounded border border-solid border-zinc-300 w-[361px]"
                />

                <Input
                  onChange={(e) =>
                    setData({ ...data, newPassword: e.target.value })
                  }
                  autoComplete="off"
                  type="password"
                  label={t('NEW_PASSWORD')}
                  placeholder={t('NEW_PASSWORD')}
                  className="mt-2 max-w-full bg-white rounded border border-solid border-zinc-300 w-[361px]"
                />

                <Input
                  onChange={(e) =>
                    setData({ ...data, confirmPassword: e.target.value })
                  }
                  type="password"
                  label={t('CONFIRM_NEW_PASSWORD')}
                  placeholder={t('CONFIRM_NEW_PASSWORD')}
                  className="mt-2 max-w-full bg-white rounded border border-solid border-zinc-300 w-[361px]"
                />
              </div>
              <Button
                onClick={handleChangePass}
                className="flex flex-col justify-center items-center self-center px-6 py-1.5 mt-8 w-full text-white bg-main rounded max-w-[361px] min-h-[39px]"
              >
                <div className="gap-3 self-stretch">
                  {t('CHANGE_PASSWORD_BUTTON')}
                </div>
              </Button>
            </form>
          </div>
          <img
            onClick={onClose}
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/86098466758eefea48c424850dc7f8dc58fa0a42b1b3b43e6d08b5eb236f964e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
            className="object-contain shrink-0 self-start mt-4 w-11 aspect-square absolute right-[-70px] top-0 cursor-pointer hover:scale-110"
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
