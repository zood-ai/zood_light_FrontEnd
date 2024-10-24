import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/custom/button';

interface GlobalDialogContextType {
  openDialog: (status: 'deleted' | 'updated' | 'added') => void;
  closeDialog: () => void;
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
  const [status, setStatus] = useState<'deleted' | 'updated' | 'added' | null>(null);

  const openDialog = (status: 'deleted' | 'updated' | 'added') => {
    setStatus(status);
    setIsOpen(true);
  };
  const closeDialog = () => {
    setStatus(null);
    setIsOpen(false);
  };

  const getStatusMessage = () => {
    switch (status) {
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

  return (
    <GlobalDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
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
                  {getStatusMessage()}
                </div>
                <div className="flex flex-col mt-6 w-full text-sm font-semibold text-right text-white whitespace-nowrap rounded">
                  <Button onClick={closeDialog} variant={'success'} className="px-16 py-2">
                    حسنا!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </GlobalDialogContext.Provider>
  );
};
