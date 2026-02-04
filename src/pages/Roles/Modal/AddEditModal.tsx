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
import { ALL_PERMISSIONS, PERMISSION_GROUPS } from '../constants/Permissions';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AiOutlineInfoCircle } from 'react-icons/ai';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  authorities: z
    .array(z.string())
    .min(1, 'Please select at least one permission'),
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
  const allServiceRole = createCrudService<any>('roles');
  const { useUpdate, useCreate } = allServiceRole;
  const { mutate: createNewRole } = useCreate();
  const { mutate: updateRole } = useUpdate();
  const [loading, setLoading] = useState(false);

  const title = modalType === 'Add' ? t('ADD_NEW_ROLE') : t('EDIT_ROLE');

  const defaultValues = useMemo(
    () =>
      modalType === 'Add'
        ? {
            name: '',
            authorities: [],
          }
        : {
            name: initialData?.name || '',
            authorities: initialData?.authorities || [],
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
        authorities: [],
      });
    }
    if (modalType === 'Edit') {
      form.reset({
        name: initialData?.name || '',
        authorities: initialData?.authorities || [],
      });
    }
  }, [initialData, form, modalType]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    if (modalType === 'Add') {
      await createNewRole(values, {
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
      await updateRole(
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
    const currentAuthorities = form.getValues('authorities');
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
    const currentAuthorities = form.getValues('authorities');

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] md:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {modalType === 'Add'
              ? t('FILL_IN_THE_DETAILS_TO_CREATE_NEW_ROLE')
              : t('UPDATE_ROLE_INFORMATION')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="px-4 my-5"
          >
            <div className="grid grid-cols-1 gap-y-4 px-2 mb-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('ROLE_NAME')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('ENTER_ROLE_NAME')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Permissions Section */}
            <div className="h-[400px] overflow-y-auto border rounded-md p-4">
              <FormField
                control={form.control}
                name="authorities"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base font-bold">
                        {t('AUTHORITIES')}
                      </FormLabel>
                      <FormMessage />
                    </div>

                    {/* Toggle All */}
                    <div className="flex items-center space-x-2 mb-4 pb-2 border-b">
                      <Checkbox
                        checked={isAllSelected()}
                        onCheckedChange={(checked) =>
                          handleToggleAll(checked as boolean)
                        }
                      />
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t('TOGGLE_ALL')}
                      </label>
                    </div>

                    {/* Permission Groups */}
                    {Object.entries(PERMISSION_GROUPS).map(
                      ([groupKey, group]) => (
                        <div key={groupKey} className="mb-6">
                          {/* Group Header */}
                          <div className="flex items-center space-x-2 mb-3">
                            <Checkbox
                              checked={isGroupSelected(groupKey)}
                              onCheckedChange={(checked) =>
                                handleToggleGroup(groupKey, checked as boolean)
                              }
                            />
                            <label className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {t(group.name)}
                            </label>
                          </div>

                          {/* Group Permissions */}
                          <div className="ml-6 space-y-2">
                            {group.permissions.map((permission) => (
                              <div
                                key={permission.value}
                                className="flex items-center space-x-2"
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
                                <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                                  {t(permission.label)}
                                  {permission.tooltip && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-help">
                                            <AiOutlineInfoCircle className="w-4 h-4 text-gray-500" />
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="max-w-xs">
                                            {permission.tooltip}
                                          </p>
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
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-full mt-6 flex items-center justify-center space-x-4 md:justify-between">
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
