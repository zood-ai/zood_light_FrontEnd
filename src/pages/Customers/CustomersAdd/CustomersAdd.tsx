import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconInput from '@/components/custom/InputWithIcon';
import personIcon from '/icons/name person.svg';
import callIcon from '/icons/call.svg';
import { Button } from '@/components/custom/button';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { currencyFormated } from '@/utils/currencyFormated';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  taxNum: z.string().min(15, { message: 'Tax number is must be 15 number' }).optional(),
  coTax: z.string().optional().nullable(),
});

const inputFullWidth = 'w-full min-w-0';

type CustomerInsights = {
  total_credit?: number;
  total_debit?: number;
  account_balance?: number;
};

function formatInsightAmount(value: unknown): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return currencyFormated(n);
}

function CustomerFormSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      {[1, 2, 3].map((section) => (
        <Card key={section} className="border-mainBorder/80">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-[72px] w-full rounded-lg" />
            <Skeleton className="h-[72px] w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const CustomersAdd: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      email: '',
      taxNum: '',
      coTax: '',
    },
  });

  const [currData, setcurrData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(
    () => isEditMode && Boolean(params.objId)
  );
  const [insights, setInsights] = useState<CustomerInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      form.reset({
        name: '',
        phone: '',
        address: '',
        email: '',
        taxNum: '',
        coTax: '',
      });
      setcurrData({});
      setCustomerLoading(false);
      setInsights(null);
      setInsightsError(false);
      return;
    }

    if (!params.objId) {
      setCustomerLoading(false);
      return;
    }

    setCustomerLoading(true);
    axiosInstance
      .get(`/manage/customers/${params.objId}`)
      .then((res) => {
        const customerData = res?.data?.data;
        setcurrData(customerData);
        if (customerData) {
          form.reset({
            name: customerData.name || '',
            phone: customerData.phone || '',
            taxNum: customerData.tax_registration_number || '',
            coTax: customerData.vat_registration_number || '',
            email: customerData.email || '',
            address: customerData.addresses?.[0]?.name || '',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch customer data', err);
      })
      .finally(() => {
        setCustomerLoading(false);
      });
  }, [isEditMode, params.objId, form]);

  useEffect(() => {
    if (!isEditMode || !params.objId) {
      setInsights(null);
      setInsightsError(false);
      setInsightsLoading(false);
      return;
    }

    setInsightsLoading(true);
    setInsightsError(false);
    axiosInstance
      .get(`/manage/customer_insights/${params.objId}`)
      .then((res) => {
        const payload = res?.data?.data as CustomerInsights | undefined;
        setInsights(payload ?? null);
      })
      .catch(() => {
        setInsights(null);
        setInsightsError(true);
      })
      .finally(() => {
        setInsightsLoading(false);
      });
  }, [isEditMode, params.objId]);

  const { openDialog } = useGlobalDialog();

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    if (isEditMode) {
      try {
        const res = await axiosInstance.put(
          `/manage/customers/${params.objId}`,
          {
            ...values,
            notes: '-',
            tax_registration_number: values.taxNum,
            vat_registration_number: values.coTax,
          }
        );

        if (values.address)
          await axiosInstance.post(
            `/manage/customers/addAddress/${res?.data?.data.id}`,
            {
              name: values.address,
              description: '-',
            }
          );
        else
          await axiosInstance.post(
            `/manage/customers/updateAddress/${
              currData?.addresses?.[0]?.id || ''
            }`,
            {
              name: values.address,
            }
          );

        openDialog('updated');
        setLoading(false);
        navigate('/zood-dashboard/customers');
      } catch (err) {
        form.reset({});
        setLoading(false);
      }
    } else {
      try {
        const res = await axiosInstance.post('/manage/customers', {
          ...values,
          notes: '-',
          tax_registration_number: values.taxNum,
          vat_registration_number: values.coTax,
        });

        if (values.address)
          await axiosInstance.post(
            `/manage/customers/addAddress/${res?.data?.data.id}`,
            {
              name: values.address,
              description: '-',
            }
          );

        openDialog('added');
        setLoading(false);
        form.reset({});
        navigate('/zood-dashboard/customers');
      } catch (err) {
        form.reset({});
        setLoading(false);
      }
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DetailsHeadWithOutFilter
        mainTittle={isEditMode ? t('UPDATE_CUSTOMER') : t('ADD_CUSTOMER')}
        subTitle={
          isEditMode && currData?.name ? String(currData.name) : undefined
        }
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
        <div className="mx-auto max-w-3xl px-s4 pb-10 pt-1">
          {customerLoading ? (
            <CustomerFormSkeleton />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-6"
              >
                <Card className="border-mainBorder shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-mainText">
                      {t('CUSTOMER_SECTION_BASIC')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                label={t('CUSTOMER_NAME')}
                                iconSrc={personIcon}
                                inputClassName={inputFullWidth}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                label={t('PHONE')}
                                iconSrc={callIcon}
                                inputClassName={inputFullWidth}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-mainBorder shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-mainText">
                      {t('CUSTOMER_SECTION_CONTACT')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                label={t('ADDRESS')}
                                inputClassName={inputFullWidth}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                label={t('EMAIL')}
                                inputClassName={inputFullWidth}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-mainBorder shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-mainText">
                      {t('CUSTOMER_SECTION_TAX')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="coTax"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                label={t('SETTINGS_COMMERCIAL_REGISTRATION_NUMBER')}
                                inputClassName={inputFullWidth}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="taxNum"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                label={t('TAX_REGISTRATION_NUMBER')}
                                inputClassName={inputFullWidth}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {isEditMode && (
                  <Card className="border-mainBorder shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold text-mainText">
                        {t('CUSTOMER_ACCOUNT_SUMMARY')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {insightsLoading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <Skeleton className="h-14 w-full rounded-lg" />
                          <Skeleton className="h-14 w-full rounded-lg" />
                          <Skeleton className="h-14 w-full rounded-lg" />
                        </div>
                      ) : insightsError ? (
                        <p className="text-sm text-muted-foreground">
                          {t('CUSTOMER_INSIGHTS_ERROR')}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div className="rounded-xl border border-mainBorder bg-mainBg/50 px-4 py-3">
                            <div className="text-xs font-medium text-secText">
                              {t('TOTAL_CREDIT')}
                            </div>
                            <div
                              className="mt-1 text-lg font-bold tabular-nums text-mainText"
                              dir="ltr"
                            >
                              {formatInsightAmount(insights?.total_credit)}
                            </div>
                          </div>
                          <div className="rounded-xl border border-mainBorder bg-mainBg/50 px-4 py-3">
                            <div className="text-xs font-medium text-secText">
                              {t('TOTAL_DEBIT')}
                            </div>
                            <div
                              className="mt-1 text-lg font-bold tabular-nums text-mainText"
                              dir="ltr"
                            >
                              {formatInsightAmount(insights?.total_debit)}
                            </div>
                          </div>
                          <div className="rounded-xl border border-mainBorder bg-mainBg/50 px-4 py-3">
                            <div className="text-xs font-medium text-secText">
                              {t('ACCOUNT_BALANCE_LABEL')}
                            </div>
                            <div
                              className="mt-1 text-lg font-bold tabular-nums text-main"
                              dir="ltr"
                            >
                              {formatInsightAmount(insights?.account_balance)}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    dir="ltr"
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    className="h-[39px] min-w-[163px]"
                  >
                    {isEditMode ? t('UPDATE_CUSTOMER') : t('ADD_CUSTOMER')}
                  </Button>
                  <DelConfirm route={'manage/customers'} />
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </>
  );
};
