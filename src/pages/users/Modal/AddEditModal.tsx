import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
import { SelectComp } from '@/components/custom/SelectItem';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import createCrudService from '@/api/services/crudService';
import MultiSelect from '@/components/MultiSelect';
import { useTranslation } from 'react-i18next';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  language: z.string().min(1, 'Please select a language'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  login_pin: z
    .string()
    .min(4, 'PIN must be at least 4 characters')
    .max(6, 'PIN must be at most 6 characters'),
  role: z.string().min(1, 'Please select a role'),
  branches: z.array(z.string()).min(1, 'Please select at least one branch'),
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
  const allServiceUser = createCrudService<any>('auth/users');
  const { useGetById, useUpdate, useCreate } = allServiceUser;
  const { mutate: createNewUser } = useCreate();
  const { mutate: updateDataUserById } = useUpdate();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const title = modalType === 'Add' ? t('ADD_NEW_USER') : t('EDIT_USER');

  // Language options
  const languageOptions = [
    { value: 'ar', label: 'العربية' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
  ];

  // Role options
  const roleOptions = [
    { value: 'admin', label: t('ADMIN') },
    { value: 'owner', label: t('OWNER') },
  ];

  // Dummy branch options (replace with actual API call)
  const branchOptions = [
    { value: 'branch_1', label: t('MAIN_BRANCH') },
    { value: 'branch_2', label: t('NORTH_BRANCH') },
    { value: 'branch_3', label: t('SOUTH_BRANCH') },
    { value: 'branch_4', label: t('EAST_BRANCH') },
    { value: 'branch_5', label: t('WEST_BRANCH') },
  ];

  const defaultValues = useMemo(
    () =>
      modalType === 'Add'
        ? {
            name: '',
            language: '',
            email: '',
            password: '',
            login_pin: '',
            role: '',
            branches: [],
          }
        : {
            ...initialData,
            password: '', // Don't pre-fill password in edit mode
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
        language: '',
        email: '',
        password: '',
        login_pin: '',
        role: '',
        branches: [],
      });
    }
    if (modalType === 'Edit') {
      form.reset({
        ...initialData,
        password: '',
      });
    }
  }, [initialData, form, modalType]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    // Remove password from update if it's empty
    const submitData =
      modalType === 'Edit' && !values.password
        ? { ...values, password: undefined }
        : values;

    if (modalType === 'Add') {
      await createNewUser(submitData, {
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
      await updateDataUserById(
        { id: initialData.id, data: submitData },
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
      <DialogContent className="w-[98vw] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {modalType === 'Add'
              ? t('FILL_IN_THE_DETAILS_TO_CREATE_NEW_USER')
              : t('UPDATE_USER_INFORMATION')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="px-4 my-5"
          >
            <div className="grid h-[400px] grid-cols-1 gap-y-4 overflow-x-hidden overflow-y-scroll px-2 md:w-auto md:grid-cols-2 md:gap-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('NAME')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('ENTER_NAME')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Language Field */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('LANGUAGE')} *</FormLabel>
                    <FormControl>
                      <SelectComp
                        {...field}
                        options={languageOptions}
                        onValueChange={field.onChange}
                        placeholder={t('SELECT_LANGUAGE')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('EMAIL')} *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('ENTER_EMAIL')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('PASSWORD')}{' '}
                      {modalType === 'Add'
                        ? '*'
                        : `(${t('LEAVE_EMPTY_TO_KEEP_CURRENT')})`}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('ENTER_PASSWORD')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Login PIN Field */}
              <FormField
                control={form.control}
                name="login_pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('LOGIN_PIN')} *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t('ENTER_PIN')}
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Field */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('ROLE')} *</FormLabel>
                    <FormControl>
                      <SelectComp
                        {...field}
                        options={roleOptions}
                        onValueChange={field.onChange}
                        placeholder={t('SELECT_ROLE')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Branches Field */}
              <FormField
                control={form.control}
                name="branches"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t('BRANCHES')} *</FormLabel>
                    <FormControl>
                      <MultiSelect
                        {...field}
                        options={branchOptions}
                        onValueChange={field.onChange}
                        value={field.value}
                        placeholder={t('SELECT_BRANCHES')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-full mt-10 flex items-center justify-center space-x-4 md:justify-between md:px-8">
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
