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

const formSchema = z.object({
  name: z.string().nonempty('Branch name is required'),
  reference: z.string().nonempty('Reference is required'),
});

const BranchesAdd: React.FC = () => {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();

  // Fetch services and mutations
  const crudService = createCrudService<any>('manage/branches');
  const { useGetById, useUpdate, useCreate } = crudService;

  const { mutate: createNewBranch } = useCreate();
  const { mutate: updateBranch } = useUpdate();
  const { data: getDataById } = useGetById(`${params.objId ?? ''}`);

  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(
    () =>
      isEditMode
        ? getDataById?.data
        : {
            name: '',
            reference: '',
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
        .get(`/manage/branches/${params.objId}`)
        .then((res) => {
          const branchData = res?.data?.data;
          setcurrData(branchData);
          if (branchData) {
            form.setValue('name', branchData.name || '');
            form.setValue('reference', branchData.reference || '');
          }
        })
        .catch((err) => {
          console.error('Failed to fetch branch data', err);
        });
    } else {
      form.reset({
        name: '',
        reference: '',
      });
    }
  }, [getDataById, form, isEditMode, params.objId]);

  const handleGenerateReference = async () => {
    try {
      const res = await axiosInstance.post('/manage/generate_reference', {
        model: 'branches',
      });

      form.setValue('reference', String(res.data.data), {
        shouldValidate: true,
      });
    } catch (err) {
      console.error('Failed to generate reference', err);
    }
  };

  const { openDialog } = useGlobalDialog();

  // Handle form submission for both add and edit scenarios
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    if (isEditMode) {
      try {
        await axiosInstance.put(`/manage/branches/${params.objId}`, values);

        openDialog('updated');
        setLoading(false);
        navigate('/zood-dashboard/branches');
      } catch (err) {
        console.error('Failed to update branch', err);
        setLoading(false);
      }
    } else {
      try {
        await axiosInstance.post('/manage/branches', values);

        openDialog('added');
        setLoading(false);
        form.reset({});
        navigate('/zood-dashboard/branches');
      } catch (err) {
        console.error('Failed to create branch', err);
        setLoading(false);
      }
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DetailsHeadWithOutFilter
        mainTittle={isEditMode ? t('BRANCH') : t('ADD_BRANCH')}
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
                          label={t('BRANCH_NAME')}
                          iconSrc={personIcon}
                          inputClassName="w-[278px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem className="col-span-1 mt-md">
                    <FormControl>
                      <div className="flex items-end gap-2">
                        <IconInput
                          {...field}
                          label={t('REFERENCE')}
                          disabled
                          inputClassName="w-[200px]"
                        />

                        <Button
                          type="button"
                          onClick={handleGenerateReference}
                          className="h-[39px]"
                        >
                          {t('GENERATE')}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                dir="ltr"
                type="submit"
                loading={loading}
                disabled={loading}
                className="mt-4 h-[39px] w-[163px]"
              >
                {isEditMode ? t('UPDATE_BRANCH') : t('ADD_BRANCH')}
              </Button>
              <DelConfirm route={'manage/branches'} />
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default BranchesAdd;
