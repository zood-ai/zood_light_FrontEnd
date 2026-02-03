/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconInput from '@/components/custom/InputWithIcon';
import useDirection from '@/hooks/useDirection';
import personIcon from '/icons/name person.svg';
import callIcon from '/icons/call.svg';
import { Button } from '@/components/custom/button';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import createCrudService from '@/api/services/crudService';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/api/interceptors';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';
import ConfirmBk from '@/components/custom/ConfimBk';
import DelConfirm from '@/components/custom/DelConfim';
import { SelectComp } from '@/components/custom/SelectItem';
import MultiSelect from '@/components/MultiSelect';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  language: z.string().nonempty('Language is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  login_pin: z
    .string()
    .min(4, 'PIN must be at least 4 characters')
    .max(6, 'PIN must be at most 6 characters'),
  role: z.string().nonempty('Role is required'),
  branches: z.array(z.string()).min(1, 'Please select at least one branch'),
});

const UsersAdd: React.FC = () => {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();

  // Fetch services and mutations
  const crudService = createCrudService<any>('auth/users');
  const { data: Roles } = createCrudService<any>('select/roles').useGetAll();
  const { data: Branches } = createCrudService<any>(
    'select/branches?type=all&with_warehouse=1'
  ).useGetAll();
  const { useGetById, useUpdate, useCreate } = crudService;

  const { mutate: createNewUser } = useCreate();
  const { mutate: updateDataUserById } = useUpdate();
  const { data: getDataById } = useGetById(`${params?.objId ?? ''}`);

  const [loading, setLoading] = useState(false);

  // Language options
  const languageOptions = [
    {
      value: 'ar',
      label: 'Arabic',
    },
    {
      value: 'en',
      label: 'English',
    },
    {
      value: 'es',
      label: 'Espanol',
    },
    {
      value: 'fr',
      label: 'Francais',
    },
  ];

  // Role options
  const roleOptions =
    Roles?.map((el) => ({
      value: el?.id,
      label: el?.name,
    })) ?? [];

  // Dummy branch options (replace with actual API call)
  const branchOptions = Branches?.map((el) => ({
    value: el?.id,
    label: el?.name,
  })) ?? [];

  const defaultValues = useMemo(
    () =>
      isEditMode
        ? getDataById?.data
        : {
            name: '',
            language: '',
            email: '',
            password: '',
            login_pin: '',
            role: '',
            branches: [],
          },
    [getDataById, isEditMode]
  );

  // Initialize form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [currData, setcurrData] = useState<any>({});

  // Reset form when data changes
  useEffect(() => {
    if (isEditMode && getDataById?.data) {
      axiosInstance
        .get(`/auth/users/${params?.objId}`)
        .then((res) => {
          const userData = res?.data?.data;
          setcurrData(userData);
          if (userData) {
            form.setValue('name', userData?.name || '');
            form.setValue('language', userData?.lang || '');
            form.setValue('email', userData?.email || '');
            form.setValue('password', ''); // Don't pre-fill password in edit mode
            form.setValue('login_pin', userData?.login_pin || '');
            form.setValue('role', userData?.roles?.[0]?.id || '');
            form.setValue(
              'branches',
              userData?.branches?.map((el) => el?.id) || []
            );
          }
        })
        .catch((err) => {
          console.error('Failed to fetch user data', err);
        });
    } else {
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
  }, [getDataById, form, isEditMode, params?.objId]);

  const { openDialog } = useGlobalDialog();

  // Handle form submission for both add and edit scenarios
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    // Remove password from update if it's empty
    const submitData: any =
      isEditMode && !values?.password
        ? {
            ...values,
            roles: [{ id: values?.role }],
            branches: values?.branches?.map((el) => ({ id: el })) ?? [],
            password: undefined,
          }
        : {
            ...values,
            roles: [{ id: values?.role }],
            branches: values?.branches?.map((el) => ({ id: el })) ?? [],
          };
    if (submitData?.role) delete submitData?.role;
    if (isEditMode) {
      try {
        await axiosInstance.put(`/auth/users/${params?.objId}`, submitData);

        openDialog('updated');
        setLoading(false);
        navigate('/zood-dashboard/users');
      } catch (err) {
        console.error('Failed to update user', err);
        setLoading(false);
      }
    } else {
      try {
        await axiosInstance.post('/auth/users', submitData);

        openDialog('added');
        setLoading(false);
        form.reset({});
        navigate('/zood-dashboard/users');
      } catch (err) {
        console.error('Failed to create user', err);
        setLoading(false);
      }
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DetailsHeadWithOutFilter
        mainTittle={isEditMode ? t('USER') : t('ADD_USER')}
        bkAction={() => {
          setIsOpen(true);
        }}
      />
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />
      <div className="min-h-[70vh]">
        <div className="grid grid-cols-1 items-start">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="px-s4 my-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 max-w-[580px]">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-1 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label={t('NAME')}
                          iconSrc={personIcon}
                          inputClassName="w-[278px]"
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
                    <FormItem className="col-span-1 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label={t('EMAIL')}
                          inputClassName="w-[278px]"
                          type="email"
                        />
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
                    <FormItem className="col-span-1 mt-md">
                      <FormLabel>{t('LANGUAGE')}</FormLabel>
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

                {/* Role Field */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="col-span-1 mt-md">
                      <FormLabel>{t('ROLE')}</FormLabel>
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

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="col-span-1 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label={
                            isEditMode ? `${t('PASSWORD')}` : t('PASSWORD')
                          }
                          inputClassName="w-[278px]"
                          type="password"
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
                    <FormItem className="col-span-1 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label={t('LOGIN_PIN')}
                          inputClassName="w-[278px]"
                          type="text"
                          maxLength={6}
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
                    <FormItem className="md:col-span-2 mt-md">
                      <FormLabel>{t('BRANCHES')}</FormLabel>
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

              <Button
                dir="ltr"
                type="submit"
                loading={loading}
                disabled={loading}
                className="mt-4 h-[39px] w-[163px]"
              >
                {isEditMode ? t('UPDATE_USER') : t('ADD_USER')}
              </Button>
              <DelConfirm route={'auth/users'} />
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UsersAdd;
