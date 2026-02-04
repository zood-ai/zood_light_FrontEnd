import React, { useEffect, useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import createCrudService from '@/api/services/crudService';
import { useTranslation } from 'react-i18next';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters'),
});

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  modalType?: string;
}

const AddEditModal: React.FC<AddEditModalProps> = ({
  isOpen,
  onClose,
  initialData = {},
  modalType,
}) => {
  const { t } = useTranslation();
  const allServiceBranch = createCrudService<any>('manage/branches');
  const { useUpdate, useCreate } = allServiceBranch;
  const { mutate: createNewBranch } = useCreate();
  const { mutate: updateBranch } = useUpdate();
  const [loading, setLoading] = useState(false);

  const title = modalType === 'Add' ? t('ADD_NEW_BRANCH') : t('EDIT_BRANCH');

  const defaultValues = useMemo(
    () =>
      modalType === 'Add'
        ? {
            name: '',
          }
        : {
            ...initialData,
          },
    [initialData, modalType]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (modalType === 'Add') {
      form.reset({
        name: '',
      });
    }
    if (modalType === 'Edit') {
      form.reset({
        ...initialData,
      });
    }
  }, [initialData, form, modalType]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    if (modalType === 'Add') {
      await createNewBranch(values, {
        onSuccess: () => {
          setLoading(false);
          form.reset();
          onClose();
        },
        onError: () => {
          setLoading(false);
        },
      });
    } else {
      await updateBranch(
        { id: initialData.id, data: values },
        {
          onSuccess: () => {
            setLoading(false);
            onClose();
          },
          onError: () => {
            setLoading(false);
          },
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] md:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {modalType === 'Add'
              ? t('FILL_IN_THE_DETAILS_TO_CREATE_NEW_BRANCH')
              : t('UPDATE_BRANCH_INFORMATION')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="px-4 my-5"
          >
            <div className="grid grid-cols-1 gap-y-4 px-2">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('BRANCH_NAME')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('ENTER_BRANCH_NAME')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-full mt-10 flex items-center justify-center space-x-4 md:justify-between">
              <Button
                size="lg"
                variant="default"
                type="submit"
                disabled={loading}
              >
                {loading ? t('SUBMITTING') : t('SUBMIT')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onClose}
                type="button"
              >
                {t('CANCEL')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditModal;
