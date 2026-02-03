import React from 'react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { ViewModal } from '@/components/custom/ViewModal';
import { useDispatch } from 'react-redux';
import { toggleActionView } from '@/store/slices/toggleAction';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  initialData = {},
}) => {
  const dispatch = useDispatch();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[1107px] bg-transparent border-none">
        <div className="">
          <div className="relative">
            <ViewModal title="" data={initialData} />
            <img
              onClick={onClose}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/86098466758eefea48c424850dc7f8dc58fa0a42b1b3b43e6d08b5eb236f964e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
              className="object-contain shrink-0 self-start mt-4 w-11 aspect-square absolute right-[-70px] no-print top-0 cursor-pointer hover:scale-110"
              alt="Close"
            />
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
