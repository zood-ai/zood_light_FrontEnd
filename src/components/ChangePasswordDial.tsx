import { IconLoader } from '@tabler/icons-react';
import { AlertDialog, AlertDialogContent } from './ui/alert-dialog';
import { Button } from './custom/button';
import { Input } from './ui/input';

export default function ChangePasswordDial({ isOpen, onClose }) {
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
                <div className="flex flex-col items-start pr-5 pl-2 w-full font-medium text-zinc-500">
                  <div className="self-stretch text-xs text-zinc-800">
                    يجب أن تتكون كلمة المرور الخاصة بك من 6 أحرف على الأقل ويجب
                    أن تتضمن مجموعة من الأرقام والأحرف والأحرف الخاصة (!$@%).
                  </div>
                  <Input className="  mt-4 ml-3.5 max-w-full bg-white rounded border border-solid border-zinc-300 w-[361px]"/>
                  
                  <Input className="  mt-4 ml-3.5 max-w-full bg-white rounded border border-solid border-zinc-300 w-[361px]"/>
                   
                  <Input className="  mt-4 ml-3.5 max-w-full bg-white rounded border border-solid border-zinc-300 w-[361px]"/>
                  
                  <div className="self-end mt-2 text-indigo-900">
                    هل نسيت الرقم السري؟
                  </div>
                </div>
                <Button className="flex flex-col justify-center items-center self-center px-6 py-1.5 mt-8 w-full text-white bg-indigo-900 rounded max-w-[361px] min-h-[39px]">
                  <div className="gap-3 self-stretch">تغير الباسورد</div>
                </Button>
              </div>
            </div>
            <img
              onClick={onClose}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/86098466758eefea48c424850dc7f8dc58fa0a42b1b3b43e6d08b5eb236f964e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
              className="object-contain shrink-0 self-start mt-4 w-11 aspect-square absolute left-[-60px] top-0 cursor-pointer hover:scale-110"
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
