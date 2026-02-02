import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconInput from '@/components/custom/InputWithIcon';
import useDirection from '@/hooks/useDirection';
import personIcon from '/icons/name person.svg';
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
import { ALL_PERMISSIONS, PERMISSION_GROUPS } from '../constants/Permissions';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AiOutlineInfoCircle } from 'react-icons/ai';

const formSchema = z.object({
  name: z.string().nonempty('Role name is required'),
  authorities: z
    .array(z.string())
    .min(1, 'Please select at least one permission'),
});

 const RolesAdd: React.FC = () => {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();

  // Fetch services and mutations
  const crudService = createCrudService<any>('roles');
  const { useGetById, useUpdate, useCreate } = crudService;

  const { mutate: createNewRole } = useCreate();
  const { mutate: updateRole } = useUpdate();
  const { data: getDataById } = useGetById(`${params.objId ?? ''}`);

  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(
    () =>
      isEditMode
        ? getDataById?.data
        : {
            name: '',
            authorities: [],
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
        .get(`/roles/${params.objId}`)
        .then((res) => {
          const roleData = res?.data?.data;
          setcurrData(roleData);
          if (roleData) {
            form.setValue('name', roleData.name || '');
            form.setValue('authorities', roleData.authorities || []);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch role data', err);
        });
    } else {
      form.reset({
        name: '',
        authorities: [],
      });
    }
  }, [getDataById, form, isEditMode, params.objId]);

  const { openDialog } = useGlobalDialog();

  // Handle form submission for both add and edit scenarios
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    if (isEditMode) {
      try {
        await axiosInstance.put(`/roles/${params.objId}`, values);

        openDialog('updated');
        setLoading(false);
        navigate('/zood-dashboard/roles-and-permissions');
      } catch (err) {
        console.error('Failed to update role', err);
        setLoading(false);
      }
    } else {
      try {
        await axiosInstance.post('/roles', values);

        openDialog('added');
        setLoading(false);
        form.reset({});
        navigate('/zood-dashboard/roles-and-permissions');
      } catch (err) {
        console.error('Failed to create role', err);
        setLoading(false);
      }
    }
  };

  // Toggle all permissions
  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      form.setValue('authorities', ALL_PERMISSIONS);
    } else {
      form.setValue('authorities', []);
    }
  };

  // Toggle all permissions in a group
  const handleToggleGroup = (groupKey: string, checked: boolean) => {
    const currentAuthorities = form.getValues('authorities') || [];
    const groupPermissions = PERMISSION_GROUPS[
      groupKey as keyof typeof PERMISSION_GROUPS
    ].permissions.map((p) => p.value);

    if (checked) {
      // Add all group permissions
      const newAuthorities = [
        ...new Set([...currentAuthorities, ...groupPermissions]),
      ];
      form.setValue('authorities', newAuthorities);
    } else {
      // Remove all group permissions
      const newAuthorities = currentAuthorities.filter(
        (auth) => !groupPermissions.includes(auth)
      );
      form.setValue('authorities', newAuthorities);
    }
  };

  // Toggle single permission
  const handleTogglePermission = (permission: string, checked: boolean) => {
    const currentAuthorities = form.getValues('authorities') || [];

    if (checked) {
      form.setValue('authorities', [...currentAuthorities, permission]);
    } else {
      form.setValue(
        'authorities',
        currentAuthorities.filter((auth) => auth !== permission)
      );
    }
  };

  // Check if all permissions are selected
  const isAllSelected = () => {
    const currentAuthorities = form.getValues('authorities') || [];
    return ALL_PERMISSIONS.every((perm) => currentAuthorities.includes(perm));
  };

  // Check if all permissions in a group are selected
  const isGroupSelected = (groupKey: string) => {
    const currentAuthorities = form.getValues('authorities') || [];
    const groupPermissions = PERMISSION_GROUPS[
      groupKey as keyof typeof PERMISSION_GROUPS
    ].permissions.map((p) => p.value);
    return groupPermissions.every((perm) => currentAuthorities.includes(perm));
  };

  // Check if a permission is selected
  const isPermissionSelected = (permission: string) => {
    const currentAuthorities = form.getValues('authorities') || [];
    return currentAuthorities.includes(permission);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DetailsHeadWithOutFilter
        mainTittle={isEditMode ? t('ROLE') : t('ADD_ROLE')}
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
                          label={t('ROLE_NAME')}
                          iconSrc={personIcon}
                          inputClassName="w-[278px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Permissions Section */}
              <div className="mt-8">
                <FormField
                  control={form.control}
                  name="authorities"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-lg font-bold">
                          {t('AUTHORITIES')}
                        </FormLabel>
                        <FormMessage />
                      </div>

                      <div className="border rounded-md p-6 bg-white">
                        {/* Toggle All */}
                        <div className="flex gap-2 items-center space-x-2 mb-6 pb-4 border-b">
                          <Checkbox
                            checked={isAllSelected()}
                            onCheckedChange={(checked) =>
                              handleToggleAll(checked as boolean)
                            }
                          />
                          <label className="text-base font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                            {t('TOGGLE_ALL')}
                          </label>
                        </div>

                        {/* Permission Groups */}
                        {Object.entries(PERMISSION_GROUPS).map(
                          ([groupKey, group]) => (
                            <div key={groupKey} className="mb-8">
                              {/* Group Header */}
                              <div className="flex items-center gap-2 space-x-2 mb-4 bg-gray-50 rounded">
                                <Checkbox
                                  checked={isGroupSelected(groupKey)}
                                  onCheckedChange={(checked) =>
                                    handleToggleGroup(
                                      groupKey,
                                      checked as boolean
                                    )
                                  }
                                />
                                <label className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                  {t(group.name)}
                                </label>
                              </div>

                              {/* Group Permissions */}
                              <div className="ml-8 space-y-3">
                                {group.permissions.map((permission) => (
                                  <div
                                    key={permission.value}
                                    className="flex items-center space-x-2 gap-2"
                                  >
                                    <Checkbox
                                      checked={isPermissionSelected(
                                        permission.value
                                      )}
                                      onCheckedChange={(checked) =>
                                        handleTogglePermission(
                                          permission.value,
                                          checked as boolean
                                        )
                                      }
                                    />
                                    <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer">
                                      {t(permission.label)}
                                      {permission.tooltip && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="cursor-help">
                                                <AiOutlineInfoCircle className="w-4 h-4 text-gray-500" />
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent
                                              side="right"
                                              className="max-w-xs"
                                            >
                                              <p>{permission.tooltip}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                dir="ltr"
                type="submit"
                loading={loading}
                disabled={loading}
                className="mt-6 h-[39px] w-[163px]"
              >
                {isEditMode ? t('UPDATE_ROLE') : t('ADD_ROLE')}
              </Button>
              <DelConfirm route={'roles'} />
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default RolesAdd;