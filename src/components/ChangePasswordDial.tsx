import { useState } from 'react';
import { IconLoader } from '@tabler/icons-react';
import { AlertDialog, AlertDialogContent } from './ui/alert-dialog';
import { Button } from './custom/button';
import { Input } from './ui/input';
import { toast } from '@/components/ui/use-toast';

export default function ChangePasswordDial({ isOpen, onClose }) {
  const [data, setData] = useState({
    // currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePass = () => {
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
  };
  return (
    <div className=" ">
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-[1107px] bg-transparent border-none border     ">
          <div className="" dir="ltr">
            <div className="flex flex-col text-sm font-semibold text-right rounded max-w-[401px]">
              <div className="flex flex-col pt-6 pb-4 w-full bg-white rounded border border-gray-200 border-solid">
                <div className="self-end mr-5 text-xl text-black">
                  تغير الرقم السري
                </div>
                <div
                  dir="rtl"
                  className="flex flex-col items-start pr-5 pl-2 w-full font-medium text-zinc-500"
                >
                  <div className="self-stretch text-xs text-zinc-800 mb-2">
                    {/* يجب أن تتكون كلمة المرور الخاصة بك من 6 أحرف على الأقل ويجب
                    أن تتضمن مجموعة من الأرقام والأحرف والأحرف الخاصة (!$@%). */}
                  </div>
                  {/* <Input
                    onChange={(e) =>
                      setData({ ...data, currentPassword: e.target.value })
                    }
                    autoComplete="off"
                    type="password"
                    label="الرقم السري الحالي"
                    placeholder="الرقم السري الحالي"
                    className="  mt-2 ml-3.5 max-w-full bg-white rounded border border-solid border-zinc-300 w-[361px]"
                  /> */}

                  <Input
                    onChange={(e) =>
                      setData({ ...data, newPassword: e.target.value })
                    }
                    autoComplete="off"
                    type="password"
                    label="الرقم السري الجديد"
                    placeholder="الرقم السري الجديد"
                    className="  mt-2 ml-3.5 max-w-full bg-white rounded border border-solid border-zinc-300 w-[361px]"
                  />

                  <Input
                    onChange={(e) =>
                      setData({ ...data, confirmPassword: e.target.value })
                    }
                    type="password"
                    label="اعادة كتابة الرقم السري الجديد"
                    placeholder="اعادة كتابة الرقم السري الجديد"
                    className="  mt-2 ml-3.5 max-w-full bg-white rounded border border-solid border-zinc-300 w-[361px]"
                  />
                </div>
                <Button
                  onClick={handleChangePass}
                  className="flex flex-col justify-center items-center self-center px-6 py-1.5 mt-8 w-full text-white bg-indigo-900 rounded max-w-[361px] min-h-[39px]"
                >
                  <div className="gap-3 self-stretch">تغير الباسورد</div>
                </Button>
              </div>
            </div>
            <img
              onClick={onClose}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/86098466758eefea48c424850dc7f8dc58fa0a42b1b3b43e6d08b5eb236f964e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
              className="object-contain shrink-0 self-start mt-4 w-11 aspect-square absolute right-[-70px] top-0 cursor-pointer hover:scale-110"
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
