import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import { useTranslation } from 'react-i18next';

interface ConfirmDelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const ConfirmDelModal: React.FC<ConfirmDelModalProps> = ({
  isOpen,
  onClose,
  initialData = {},
}) => {
  const { t } = useTranslation();
  const allServiceBranch = createCrudService<any>('manage/branches');
  const { useDelete } = allServiceBranch;
  const { mutate: deleteBranch } = useDelete();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteBranch(initialData.id, {
      onSuccess: () => {
        setLoading(false);
        onClose();
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="">
          <div className="my-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline w-14 fill-red-700"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                data-original="#000000"
              />
              <path
                d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                data-original="#000000"
              />
            </svg>
            <h4 className="mt-4 text-lg font-semibold text-gray-800">
              {t('ARE_YOU_SURE_DELETE_BRANCH')}
            </h4>
            <p className="mt-4 text-sm text-gray-600">
              {t('DELETE_BRANCH_WARNING', {
                name: initialData?.name || 'this branch',
              })}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              <span className="ms-1">
                {loading ? t('DELETING') : t('DELETE')}
              </span>
            </Button>

            <Button variant="outline" onClick={onClose} disabled={loading}>
              <span className="ms-1">{t('CANCEL')}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
