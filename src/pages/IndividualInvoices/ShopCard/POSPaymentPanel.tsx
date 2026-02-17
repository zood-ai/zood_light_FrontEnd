import React, { useEffect, useMemo, useState, useCallback } from 'react';
import createCrudService from '@/api/services/crudService';
import { useDispatch, useSelector } from 'react-redux';
import { addPayment, resetOrder, updateField } from '@/store/slices/orderSchema';
import CustomSearchInbox from '@/components/custom/CustomSearchInbox';
import { Button } from '@/components/custom/button';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/interceptors';
import { setCardItem } from '@/store/slices/cardItems';
import { useToast } from '@/components/custom/useToastComp';
import { useTranslation } from 'react-i18next';
import { Buffer } from 'buffer';
import QRCode from 'qrcode';
import {
  AlertDialogComp,
  AlertDialogContentComp,
  AlertDialogDescriptionComp,
  AlertDialogTitleComp,
} from '@/components/ui/alert-dialog2';
import XIcons from '@/components/Icons/XIcons';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, X, HelpCircle } from 'lucide-react';

type PaymentRow = {
  payment_method_id: string;
  name: string;
  amount: number;
};

export default function POSPaymentPanel() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activePaymentMethodId, setActivePaymentMethodId] = useState('');
  const [draftValue, setDraftValue] = useState('0');
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [lastSuccessItems, setLastSuccessItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [completedOrderData, setCompletedOrderData] = useState<any>(null);
  const [printQrDataUrl, setPrintQrDataUrl] = useState('');
  const [isPreparingPrintQr, setIsPreparingPrintQr] = useState(false);
  const [autoPrintTriggered, setAutoPrintTriggered] = useState(false);
  const [showWhatsappDialog, setShowWhatsappDialog] = useState(false);
  const [whatsappPhoneInput, setWhatsappPhoneInput] = useState('');
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [isEditCustomerMode, setIsEditCustomerMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState('');
  const [extraCustomers, setExtraCustomers] = useState<
    { value: string; label: string }[]
  >([]);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    tax_registration_number: '',
    vat_registration_number: '',
  });
  const orderSchema = useSelector((state: any) => state.orderSchema);
  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const allSettings = useSelector((state: any) => state.allSettings?.value);

  const { data: paymentMethodsData } = createCrudService<any>(
    'manage/payment_methods?filter[is_active]=1'
  ).useGetAll();
  const { data: branchesData } =
    createCrudService<any>('manage/branches').useGetAll();
  const { data: customersData } = createCrudService<any>(
    'manage/customers?perPage=100000'
  ).useGetAll();
  const { data: settingsData } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: taxesData } = createCrudService<any>('manage/taxes').useGetAll();

  const selectedCustomerId = orderSchema?.customer_id;
  const customerOptions = useMemo(() => {
    const apiCustomers = Array.isArray(customersData?.data)
      ? customersData.data.map((customer: any) => ({
          value: String(customer?.id ?? ''),
          label: customer?.name ?? '',
        }))
      : [];
    return apiCustomers.filter(
      (o: { value: string; label: string }) => o.value && o.label
    );
  }, [customersData?.data]);
  const allCustomerOptions = useMemo(
    () => [...customerOptions, ...extraCustomers],
    [customerOptions, extraCustomers]
  );
  const selectedCustomerName =
    allCustomerOptions.find((customer: any) => customer.value === selectedCustomerId)
      ?.label || '';

  const baseAmount = useMemo(
    () =>
      cardItemValue.reduce(
        (acc: number, item: any) =>
          acc + Number(item?.price || 0) * Number(item?.qty || 0),
        0
      ),
    [cardItemValue]
  );

  const totals = useMemo(() => {
    const vatRate = Number(taxesData?.data?.[0]?.rate || 15);
    const isTaxInclusive = Boolean(settingsData?.data?.tax_inclusive_pricing);
    const discountAmount = Number(orderSchema?.discount_amount || 0);
    const subtotalBeforeDiscount = isTaxInclusive
      ? baseAmount / (1 + vatRate / 100)
      : baseAmount;
    const discountOnSubtotal = isTaxInclusive
      ? discountAmount / (1 + vatRate / 100)
      : discountAmount;
    const subtotal = Math.max(0, subtotalBeforeDiscount - discountOnSubtotal);
    const tax = subtotal * (vatRate / 100);
    const total = subtotal + tax;
    return { vatRate, subtotal, tax, total };
  }, [baseAmount, orderSchema?.discount_amount, settingsData, taxesData]);

  const round2 = (value: number) => Number(value.toFixed(2));
  const isRtl = i18n.dir() === 'rtl';
  const isArabic =
    i18n.resolvedLanguage?.startsWith('ar') ||
    i18n.language?.startsWith('ar') ||
    isRtl;

  const encodeZatcaPhase1 = (
    sellerName: string,
    vatNumber: string,
    invoiceDate: string,
    totalAmount: string,
    vatAmount: string
  ) => {
    const encodeField = (tag: number, value: string) => {
      const valueBytes = Buffer.from(value, 'utf-8');
      return Buffer.concat([
        Buffer.from([tag]),
        Buffer.from([valueBytes.byteLength]),
        valueBytes,
      ]);
    };

    const encodedData = Buffer.concat([
      encodeField(1, sellerName),
      encodeField(2, vatNumber),
      encodeField(3, invoiceDate),
      encodeField(4, totalAmount),
      encodeField(5, vatAmount),
    ]);

    return encodedData.toString('base64');
  };

  useEffect(() => {
    dispatch(updateField({ field: 'subtotal_price', value: totals.subtotal }));
    dispatch(updateField({ field: 'tax_exclusive_discount_amount', value: totals.tax }));
    dispatch(updateField({ field: 'total_price', value: totals.total }));
  }, [dispatch, totals.subtotal, totals.tax, totals.total]);

  useEffect(() => {
    const firstBranchId = branchesData?.data?.[0]?.id;
    if (!firstBranchId) return;
    dispatch(updateField({ field: 'branch_id', value: firstBranchId }));
  }, [branchesData?.data, dispatch]);

  useEffect(() => {
    const payload = payments
      .filter((item) => Number(item.amount || 0) > 0)
      .map((item) => ({
      payment_method_id: item.payment_method_id,
      amount: Number(item.amount || 0),
      tendered: 180,
      tips: 0,
      added_at: new Date().toISOString(),
      business_date: new Date().toISOString(),
      meta: { external_additional_payment_info: 'pos' },
    }));
    dispatch(addPayment(payload as any));
  }, [dispatch, payments]);

  useEffect(() => {
    if (activePaymentMethodId) return;
    const firstMethod = paymentMethodsData?.data?.[0];
    if (!firstMethod) return;
    setActivePaymentMethodId(firstMethod.id);
    setDraftValue('0');
  }, [activePaymentMethodId, paymentMethodsData?.data]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const buildPrintQr = async () => {
      if (!completedOrderData) {
        setPrintQrDataUrl('');
        return;
      }

      let invoiceIsoDate = new Date().toISOString();
      try {
        const rawDate = completedOrderData?.business_date;
        if (rawDate) {
          invoiceIsoDate = new Date(rawDate).toISOString();
        }
      } catch (e) {
        console.error('Invalid date format in completedOrderData', e);
      }
      
      const currentPaid = round2(
        payments.reduce((acc, item) => acc + Number(item.amount || 0), 0)
      );
      const totalValue = Number(
        completedOrderData?.total_price ?? currentPaid ?? 0
      ).toFixed(2);
      const taxValue = Number(
        completedOrderData?.total_taxes ?? totals.tax ?? 0
      ).toFixed(2);
      const sellerName = String(
        allSettings?.settings?.data?.business_name ||
          allSettings?.WhoAmI?.business?.name ||
          'Store'
      );
      const vatNumber = String(
        allSettings?.settings?.data?.business_tax_number ||
          allSettings?.WhoAmI?.business?.tax_registration_number ||
          ''
      );
      const zatcaTlvBase64 = encodeZatcaPhase1(
        sellerName,
        vatNumber,
        invoiceIsoDate,
        totalValue,
        taxValue
      );
      const backendQr = String(completedOrderData?.qrcode || '').trim();

      setIsPreparingPrintQr(true);
      try {
        let generated = '';
        if (backendQr.startsWith('data:image/')) {
          generated = backendQr;
        } else if (backendQr) {
          generated = await QRCode.toDataURL(backendQr, { margin: 1, width: 140 });
        } else {
          generated = await QRCode.toDataURL(zatcaTlvBase64, {
            margin: 1,
            width: 140,
          });
        }

        if (!cancelled) setPrintQrDataUrl(generated);
      } catch {
        try {
          const fallback = await QRCode.toDataURL(zatcaTlvBase64, {
            margin: 1,
            width: 140,
          });
          if (!cancelled) setPrintQrDataUrl(fallback);
        } catch {
          if (!cancelled) setPrintQrDataUrl('');
        }
      } finally {
        if (!cancelled) setIsPreparingPrintQr(false);
      }
    };

    // Defer QR preparation slightly so success screen renders immediately.
    timer = setTimeout(() => {
      buildPrintQr();
    }, 120);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [completedOrderData, allSettings, totals.tax, payments]);

  const totalPaid = round2(
    payments.reduce((acc, item) => acc + Number(item.amount || 0), 0)
  );
  const diff = round2(totals.total - totalPaid);
  const remaining = diff > 0 ? diff : 0;
  const change = diff < 0 ? round2(Math.abs(diff)) : 0;

  const selectPaymentMethod = (method: any) => {
    setActivePaymentMethodId(method.id);
    setPayments((prev) => {
      const totalPaidExcludingSelected = prev
        .filter((row) => row.payment_method_id !== method.id)
        .reduce((acc, row) => acc + Number(row.amount || 0), 0);

      const autoAmount = Math.max(0, round2(totals.total - totalPaidExcludingSelected));
      const index = prev.findIndex((row) => row.payment_method_id === method.id);

      if (index < 0) {
        return [
          ...prev,
          { payment_method_id: method.id, name: method.name, amount: autoAmount },
        ];
      }

      return prev.map((row, i) =>
        i === index ? { ...row, name: method.name, amount: autoAmount } : row
      );
    });
    const totalPaidExcludingSelected = payments
      .filter((row) => row.payment_method_id !== method.id)
      .reduce((acc, row) => acc + Number(row.amount || 0), 0);
    const autoAmount = Math.max(0, round2(totals.total - totalPaidExcludingSelected));
    setDraftValue(String(autoAmount));
  };

  const upsertActivePayment = (amountValue: number) => {
    if (!activePaymentMethodId) return;
    const amount = Math.max(0, round2(amountValue));
    const methodName =
      paymentMethodsData?.data?.find((method: any) => method.id === activePaymentMethodId)
        ?.name || '';

    setPayments((prev) => {
      const index = prev.findIndex(
        (row) => row.payment_method_id === activePaymentMethodId
      );

      if (amount <= 0) {
        if (index < 0) return prev;
        return prev.filter((_, i) => i !== index);
      }

      if (index < 0) {
        return [
          ...prev,
          { payment_method_id: activePaymentMethodId, name: methodName, amount },
        ];
      }

      return prev.map((row, i) =>
        i === index ? { ...row, name: methodName, amount } : row
      );
    });
  };

  const appendDigit = (digit: string) => {
    if (!activePaymentMethodId) return;
    const base = draftValue === '0' ? '' : draftValue;
    const next = digit === '.' ? (base.includes('.') ? base : `${base}.`) : `${base}${digit}`;
    const normalized = next || '0';
    setDraftValue(normalized);
    upsertActivePayment(Number(normalized));
  };

  const addQuickAmount = (amount: number) => {
    if (!activePaymentMethodId) return;
    const current = Number(draftValue || 0);
    const next = current + amount;
    const normalized = String(Number(next.toFixed(2)));
    setDraftValue(normalized);
    upsertActivePayment(Number(normalized));
  };

  const backspaceAmount = () => {
    if (!activePaymentMethodId) return;
    const next = draftValue.slice(0, -1) || '0';
    setDraftValue(next);
    upsertActivePayment(Number(next));
  };

  const submitOrder = async () => {
    if (remaining > 0) {
      showToast({
        description: t('REMAINING_AMOUNT'),
        duration: 2500,
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      let createdOrderResponse: any = null;
      let lastError: unknown = null;

      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          createdOrderResponse = await axiosInstance.post('orders', orderSchema);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          if (attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 350));
          }
        }
      }

      if (!createdOrderResponse) {
        throw lastError || new Error('Order create failed');
      }

      const createdOrderPayload =
        createdOrderResponse?.data?.data ?? createdOrderResponse?.data ?? null;
      const createdOrderId = createdOrderPayload?.id;

      if (createdOrderPayload) {
        try {
          const daySalesKey = 'pos_day_sales_v1';
          const raw = window.localStorage.getItem(daySalesKey);
          const current = raw ? JSON.parse(raw) : [];
          const nextEntry = {
            id: createdOrderPayload?.id || `local-${Date.now()}`,
            created_at: new Date().toISOString(),
            total: Number(
              createdOrderPayload?.total_price ?? totals.total ?? 0
            ),
            discount: Number(
              createdOrderPayload?.discount_amount ?? orderSchema?.discount_amount ?? 0
            ),
            tax: Number(
              createdOrderPayload?.total_taxes ?? totals.tax ?? 0
            ),
            payments: payments.map((payment) => ({
              name: payment.name,
              amount: Number(payment.amount || 0),
            })),
          };
          window.localStorage.setItem(
            daySalesKey,
            JSON.stringify([nextEntry, ...current].slice(0, 5000))
          );
        } catch {
          // ignore local storage failures
        }
        showToast({
          description: t('ADDED_SUCCESSFULLY'),
          duration: 1600,
        });
        // Save items locally for receipt display before clearing
        setLastSuccessItems([...cardItemValue]);
        
        // Show success/payment-complete screen immediately for better UX.
        setCompletedOrderData(createdOrderPayload);
      }

      // Hydrate full order details in background without blocking UI.
      if (createdOrderId) {
        axiosInstance
          .get(`/orders?filter[id]=${createdOrderId}`)
          .then((orderRes) => {
            const fullOrder = orderRes?.data?.data?.[0];
            if (fullOrder) setCompletedOrderData(fullOrder);
          })
          .catch(() => {});
      }
    } catch {
      showToast({
        description: t('GENERAL_ERROR'),
        duration: 3000,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizeWhatsappPhone = (rawPhone: string) => {
    let digits = rawPhone.replace(/[^\d]/g, '');
    if (!digits) return '';
    if (digits.startsWith('00')) digits = digits.slice(2);
    if (digits.startsWith('0') && digits.length === 10) {
      return `966${digits.slice(1)}`;
    }
    if (digits.startsWith('5') && digits.length === 9) {
      return `966${digits}`;
    }
    return digits;
  };

  const isValidWhatsappPhone = (rawPhone: string) => {
    const normalized = normalizeWhatsappPhone(rawPhone);
    return /^9665\d{8}$/.test(normalized);
  };

  const escapeHtml = (value: any) =>
    String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const handlePrintReceipt = () => {
    if (!completedOrderData) return;
    const finishAndGoToPos = () => {
      dispatch(setCardItem([]));
      dispatch(resetOrder());
      navigate('/zood-dashboard/individual-invoices/add');
    };
    const customerName =
      completedOrderData?.customer?.name || selectedCustomerName || '-';
    const businessDate =
      completedOrderData?.business_date || new Date().toISOString();
    const invoiceNumber =
      completedOrderData?.reference ||
      completedOrderData?.invoice_number ||
      completedOrderData?.id ||
      '-';
    const totalValue = Number(
      completedOrderData?.total_price ?? totalPaid ?? 0
    ).toFixed(2);
    const subtotalValue = Number(
      completedOrderData?.subtotal_price ?? totals.subtotal ?? 0
    ).toFixed(2);
    const taxValue = Number(
      completedOrderData?.total_taxes ?? totals.tax ?? 0
    ).toFixed(2);
    const discountValue = Number(
      completedOrderData?.discount_amount ?? orderSchema?.discount_amount ?? 0
    ).toFixed(2);
    const paidValue = Number(totalPaid || 0).toFixed(2);
    const changeValue = Number(change || 0).toFixed(2);

    const fallbackItems = (lastSuccessItems.length > 0 ? lastSuccessItems : cardItemValue).map((item: any) => ({
      name: item?.name || '-',
      quantity: Number(item?.qty || 0),
      unit_price: Number(item?.price || 0),
      total_price: Number(item?.price || 0) * Number(item?.qty || 0),
    }));

    const sourceItems =
      Array.isArray(completedOrderData?.products) &&
      completedOrderData.products.length > 0
        ? completedOrderData.products
        : fallbackItems;

    const itemsHtml = sourceItems
      .map((item: any) => {
        const name = escapeHtml(
          String(
            item?.name ||
              item?.product?.name ||
              item?.product_name ||
              item?.title ||
              item?.product_id ||
              '-'
          )
        );
        const qty = Number(item?.quantity ?? item?.qty ?? item?.pivot?.quantity ?? 0);
        const unitPrice = Number(item?.unit_price ?? item?.price ?? item?.pivot?.price ?? item?.pivot?.unit_price ?? 0);
        const lineTotal = Number(
          item?.total_price ?? item?.pivot?.total_price ?? qty * unitPrice
        ).toFixed(2);
        return `
          <div class="item-row">
            <div class="item-name">${name}</div>
            <div class="item-meta">${qty} x ${unitPrice.toFixed(2)}</div>
            <div class="item-total">SR ${lineTotal}</div>
          </div>
        `;
      })
      .join('');

    const paymentsHtml = payments
      .filter((payment) => Number(payment.amount || 0) > 0)
      .map(
        (payment) => `
          <div class="line">
            <span>${escapeHtml(payment.name || (isArabic ? 'دفعة' : 'Payment'))}</span>
            <span>SR ${Number(payment.amount || 0).toFixed(2)}</span>
          </div>
        `
      )
      .join('');
    const logoUrl =
      allSettings?.settings?.data?.business_logo ||
      settingsData?.data?.business_logo ||
      '';
    const companyName = String(
      allSettings?.WhoAmI?.business?.name ||
        allSettings?.settings?.data?.business_name ||
        'Zood'
    );
    const companyPhone = String(
      allSettings?.WhoAmI?.user?.branches?.[0]?.phone ||
        allSettings?.settings?.data?.phone_number ||
        ''
    );
    const companyAddress = String(
      allSettings?.WhoAmI?.user?.branches?.[0]?.registered_address ||
        allSettings?.settings?.data?.business_address ||
        ''
    );
    const vatNumber = String(
      allSettings?.settings?.data?.business_tax_number ||
        allSettings?.WhoAmI?.business?.tax_registration_number ||
        ''
    );
    const invoiceHeader = String(
      allSettings?.settings?.data?.receipt_header ||
        settingsData?.data?.receipt_header ||
        allSettings?.settings?.data?.invoice_header ||
        settingsData?.data?.invoice_header ||
        allSettings?.settings?.data?.header_text ||
        settingsData?.data?.header_text ||
        allSettings?.settings?.data?.description ||
        settingsData?.data?.description ||
        ''
    );
    const invoiceFooter = String(
      allSettings?.settings?.data?.receipt_footer ||
        settingsData?.data?.receipt_footer ||
        allSettings?.settings?.data?.invoice_footer ||
        settingsData?.data?.invoice_footer ||
        allSettings?.settings?.data?.footer_text ||
        settingsData?.data?.footer_text ||
        allSettings?.settings?.data?.terms_and_conditions ||
        settingsData?.data?.terms_and_conditions ||
        ''
    );
    const backendQr = String(completedOrderData?.qrcode || '').trim();
    const qrCodeDataUrl =
      printQrDataUrl ||
      (backendQr.startsWith('data:image/') ? backendQr : '');

    const labels = {
      title: isArabic ? 'فاتورة ضريبية مبسطة' : 'Simplified Tax Invoice',
      subtitle: isArabic ? 'شكرا لشرائك' : 'Thank you for your purchase',
      invoice: isArabic ? 'رقم الفاتورة' : 'Invoice',
      date: isArabic ? 'التاريخ' : 'Date',
      customer: isArabic ? 'العميل' : 'Customer',
      companyName: isArabic ? 'اسم المنشأة' : 'Company',
      companyPhone: isArabic ? 'الجوال' : 'Phone',
      companyAddress: isArabic ? 'العنوان' : 'Address',
      items: isArabic ? 'الأصناف' : 'ITEMS',
      noItems: isArabic ? 'لا توجد أصناف' : 'No items',
      subtotal: isArabic ? 'المجموع الفرعي' : 'Subtotal',
      discount: isArabic ? 'الخصم' : 'Discount',
      tax: isArabic ? 'الضريبة' : 'Tax',
      total: isArabic ? 'الإجمالي' : 'Total',
      payments: isArabic ? 'المدفوعات' : 'PAYMENTS',
      paid: isArabic ? 'المدفوع' : 'Paid',
      amountPaid: isArabic ? 'المبلغ المدفوع' : 'Amount Paid',
      change: isArabic ? 'الباقي' : 'Change',
      vatNumber: isArabic ? 'الرقم الضريبي' : 'VAT Number',
      footer: isArabic ? 'مدعوم بواسطة Zood POS' : 'Powered by Zood POS',
    };

    const printWindow = window.open('', '_blank', 'width=420,height=720');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${labels.title}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
              margin: 0;
              padding: 14px;
              color: #111827;
              background: #fff;
              direction: ${isArabic ? 'rtl' : 'ltr'};
            }
            .receipt {
              width: 78mm;
              margin: 0 auto;
              border: 1px dashed #d1d5db;
              border-radius: 8px;
              padding: 12px;
            }
            .center { text-align: center; }
            .logo-wrap { margin-bottom: 6px; }
            .logo {
              width: 56px;
              height: 56px;
              object-fit: contain;
              border-radius: 8px;
            }
            .brand { font-size: 18px; font-weight: 800; letter-spacing: 0.4px; }
            .sub { color: #6b7280; font-size: 12px; margin-top: 2px; }
            .line {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              font-size: 12px;
              margin: 6px 0;
            }
            .divider {
              margin: 10px 0;
              border: 0;
              border-top: 1px dashed #d1d5db;
            }
            .section-title {
              font-size: 11px;
              letter-spacing: 0.6px;
              color: #6b7280;
              font-weight: 700;
              margin-bottom: 4px;
            }
            .item-row {
              border-bottom: 1px dotted #e5e7eb;
              padding: 6px 0;
            }
            .item-name {
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 2px;
              word-break: break-word;
            }
            .item-meta {
              font-size: 11px;
              color: #6b7280;
            }
            .item-total {
              margin-top: 2px;
              text-align: right;
              font-size: 12px;
              font-weight: 700;
            }
            .totals .line { font-size: 13px; }
            .grand {
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              font-weight: 800;
              margin-top: 8px;
            }
            .footer {
              margin-top: 12px;
              text-align: center;
              font-size: 11px;
              color: #6b7280;
            }
            .qr-wrap {
              margin-top: 10px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 6px;
            }
            .qr-image {
              width: 120px;
              height: 120px;
              object-fit: contain;
            }
            @media print {
              body { padding: 0; }
              .receipt { border: 0; border-radius: 0; width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="center">
              ${
                logoUrl
                  ? `<div class="logo-wrap"><img class="logo" src="${escapeHtml(
                      String(logoUrl)
                    )}" alt="logo" /></div>`
                  : ''
              }
              <div class="brand">${labels.title}</div>
              <div class="sub">${labels.subtitle}</div>
            </div>
            <hr class="divider" />
            <div class="line"><span>${labels.companyName}</span><span>${escapeHtml(String(companyName || '-'))}</span></div>
            <div class="line"><span>${labels.companyPhone}</span><span>${escapeHtml(String(companyPhone || '-'))}</span></div>
            <div class="line"><span>${labels.companyAddress}</span><span>${escapeHtml(String(companyAddress || '-'))}</span></div>
            <hr class="divider" />

            <div class="line"><span>${labels.invoice}</span><span>${escapeHtml(String(invoiceNumber))}</span></div>
            <div class="line"><span>${labels.date}</span><span>${new Date(businessDate).toLocaleString()}</span></div>
            <div class="line"><span>${labels.customer}</span><span>${escapeHtml(String(customerName))}</span></div>
            <div class="line"><span>${labels.vatNumber}</span><span>${escapeHtml(String(vatNumber || '-'))}</span></div>
            ${
              invoiceHeader
                ? `<div class="sub" style="margin: 8px 0; text-align: center; white-space: pre-wrap;">${escapeHtml(
                    invoiceHeader
                  )}</div>`
                : ''
            }

            <hr class="divider" />
            <div class="section-title">${labels.items}</div>
            ${itemsHtml || `<div class="sub">${labels.noItems}</div>`}

            <hr class="divider" />
            <div class="totals">
              <div class="line"><span>${labels.subtotal}</span><span>SR ${subtotalValue}</span></div>
              <div class="line"><span>${labels.discount}</span><span>SR ${discountValue}</span></div>
              <div class="line"><span>${labels.tax}</span><span>SR ${taxValue}</span></div>
              <div class="grand"><span>${labels.total}</span><span>SR ${totalValue}</span></div>
            </div>

            <hr class="divider" />
            <div class="section-title">${labels.payments}</div>
            ${paymentsHtml || `<div class="line"><span>${labels.paid}</span><span>SR ${paidValue}</span></div>`}
            <div class="line"><span>${labels.amountPaid}</span><span>SR ${paidValue}</span></div>
            <div class="line"><span>${labels.change}</span><span>SR ${changeValue}</span></div>
            ${
              qrCodeDataUrl
                ? `<div class="qr-wrap">
              <img class="qr-image" src="${qrCodeDataUrl}" alt="ZATCA QR" />
            </div>`
                : ''
            }

            <hr class="divider" />
            ${
              invoiceFooter
                ? `<div class="sub" style="margin: 8px 0; text-align: center; white-space: pre-wrap;">${escapeHtml(
                    invoiceFooter
                  )}</div><hr class="divider" />`
                : ''
            }
            <div class="footer">${labels.footer}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();

    const runPrint = () => {
      printWindow.focus();
      printWindow.print();
    };

    const images = Array.from(printWindow.document.images || []);
    if (images.length === 0) {
      runPrint();
    } else {
      const waitForImages = Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );

      Promise.race([
        waitForImages,
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]).then(() => runPrint());
    }

    printWindow.onafterprint = () => {
      printWindow.close();
      finishAndGoToPos();
    };
  };

  useEffect(() => {
    if (!completedOrderData || autoPrintTriggered || isPreparingPrintQr) return;
    setAutoPrintTriggered(true);
    const timer = setTimeout(() => {
      handlePrintReceipt();
    }, 120);

    return () => clearTimeout(timer);
  }, [completedOrderData, autoPrintTriggered, isPreparingPrintQr]);

  const handleSendWhatsapp = () => {
    if (!completedOrderData) return;
    const rawPhone =
      completedOrderData?.customer?.phone ||
      customersData?.data?.find((c: any) => c.id === selectedCustomerId)?.phone ||
      '';
    const phone = normalizeWhatsappPhone(String(rawPhone || ''));
    if (!isValidWhatsappPhone(phone)) {
      setWhatsappPhoneInput(String(rawPhone || ''));
      setShowWhatsappDialog(true);
      return;
    }

    const invoiceNumber =
      completedOrderData?.reference ||
      completedOrderData?.invoice_number ||
      completedOrderData?.id ||
      '-';
    const totalValue = Number(
      completedOrderData?.total_price ?? totalPaid ?? 0
    ).toFixed(2);
    const message = encodeURIComponent(
      isArabic
        ? `رقم الفاتورة: ${invoiceNumber}\nالإجمالي: ${totalValue} ر.س\nشكرا لزيارتكم`
        : `Invoice: ${invoiceNumber}\nTotal: SR ${totalValue}\nThank you`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const submitWhatsappFromDialog = () => {
    if (!completedOrderData) return;
    const phone = normalizeWhatsappPhone(whatsappPhoneInput);
    if (!isValidWhatsappPhone(phone)) {
      showToast({
        description: t('PHONE_NUMBER'),
        duration: 2500,
        variant: 'destructive',
      });
      return;
    }

    const invoiceNumber =
      completedOrderData?.reference ||
      completedOrderData?.invoice_number ||
      completedOrderData?.id ||
      '-';
    const totalValue = Number(
      completedOrderData?.total_price ?? totalPaid ?? 0
    ).toFixed(2);
    const message = encodeURIComponent(
      isArabic
        ? `رقم الفاتورة: ${invoiceNumber}\nالإجمالي: ${totalValue} ر.س\nشكرا لزيارتكم`
        : `Invoice: ${invoiceNumber}\nTotal: SR ${totalValue}\nThank you`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    setShowWhatsappDialog(false);
  };

  const handleDownloadReceipt = () => {
    if (!completedOrderData) return;

    const customerName =
      completedOrderData?.customer?.name || selectedCustomerName || '-';
    const businessDate =
      completedOrderData?.business_date || new Date().toISOString();
    const invoiceNumber =
      completedOrderData?.reference ||
      completedOrderData?.invoice_number ||
      completedOrderData?.id ||
      '-';
    const totalValue = Number(
      completedOrderData?.total_price ?? totalPaid ?? 0
    ).toFixed(2);
    const subtotalValue = Number(
      completedOrderData?.subtotal_price ?? totals.subtotal ?? 0
    ).toFixed(2);
    const taxValue = Number(
      completedOrderData?.total_taxes ?? totals.tax ?? 0
    ).toFixed(2);
    const discountValue = Number(
      completedOrderData?.discount_amount ?? orderSchema?.discount_amount ?? 0
    ).toFixed(2);
    const logoUrl =
      allSettings?.settings?.data?.business_logo ||
      settingsData?.data?.business_logo ||
      '';
    const companyName = String(
      allSettings?.WhoAmI?.business?.name ||
        allSettings?.settings?.data?.business_name ||
        'Zood'
    );
    const companyPhone = String(
      allSettings?.WhoAmI?.user?.branches?.[0]?.phone ||
        allSettings?.settings?.data?.phone_number ||
        ''
    );
    const companyAddress = String(
      allSettings?.WhoAmI?.user?.branches?.[0]?.registered_address ||
        allSettings?.settings?.data?.business_address ||
        ''
    );
    const vatNumber = String(
      allSettings?.settings?.data?.business_tax_number ||
        allSettings?.WhoAmI?.business?.tax_registration_number ||
        ''
    );
    const invoiceHeader = String(
      allSettings?.settings?.data?.receipt_header ||
        settingsData?.data?.receipt_header ||
        allSettings?.settings?.data?.invoice_header ||
        settingsData?.data?.invoice_header ||
        allSettings?.settings?.data?.header_text ||
        settingsData?.data?.header_text ||
        allSettings?.settings?.data?.description ||
        settingsData?.data?.description ||
        ''
    );
    const invoiceFooter = String(
      allSettings?.settings?.data?.receipt_footer ||
        settingsData?.data?.receipt_footer ||
        allSettings?.settings?.data?.invoice_footer ||
        settingsData?.data?.invoice_footer ||
        allSettings?.settings?.data?.footer_text ||
        settingsData?.data?.footer_text ||
        allSettings?.settings?.data?.terms_and_conditions ||
        settingsData?.data?.terms_and_conditions ||
        ''
    );
    const fallbackItems = (lastSuccessItems.length > 0 ? lastSuccessItems : cardItemValue).map((item: any) => ({
      name: item?.name || '-',
      quantity: Number(item?.qty || 0),
      unit_price: Number(item?.price || 0),
      total_price: Number(item?.price || 0) * Number(item?.qty || 0),
    }));
    const sourceItems =
      Array.isArray(completedOrderData?.products) &&
      completedOrderData.products.length > 0
        ? completedOrderData.products
        : fallbackItems;
    const receiptItemsHtml = sourceItems
      .map((item: any) => {
        const name = escapeHtml(
          String(
            item?.name ||
              item?.product?.name ||
              item?.product_name ||
              item?.title ||
              item?.product_id ||
              '-'
          )
        );
        const qty = Number(item?.quantity ?? item?.qty ?? item?.pivot?.quantity ?? 0);
        const unitPrice = Number(item?.unit_price ?? item?.price ?? item?.pivot?.price ?? item?.pivot?.unit_price ?? 0);
        const lineTotal = Number(
          item?.total_price ?? item?.pivot?.total_price ?? qty * unitPrice
        ).toFixed(2);
        return `<div class="line"><span>${name} (${qty} x ${unitPrice.toFixed(
          2
        )})</span><span>SR ${lineTotal}</span></div>`;
      })
      .join('');

    const html = `
      <!doctype html>
      <html lang="${isArabic ? 'ar' : 'en'}" dir="${isArabic ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${isArabic ? 'إيصال' : 'Receipt'} ${escapeHtml(
      String(invoiceNumber)
    )}</title>
        <style>
          body{font-family:Segoe UI,Tahoma,Arial,sans-serif;background:#f8fafc;color:#0f172a;padding:16px}
          .card{max-width:420px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px}
          .center{text-align:center}.line{display:flex;justify-content:space-between;margin:6px 0;font-size:14px}
          .muted{color:#64748b;font-size:12px}.strong{font-weight:700}
          .qr{display:flex;justify-content:center;margin-top:12px}
          hr{border:0;border-top:1px dashed #e2e8f0;margin:10px 0}
          img.logo{width:56px;height:56px;object-fit:contain;border-radius:8px}
          img.qr{width:130px;height:130px}
        </style>
      </head>
      <body>
        <div class="card">
          <div class="center">
            ${logoUrl ? `<img class="logo" src="${escapeHtml(String(logoUrl))}" alt="logo" />` : ''}
            <h3 style="margin:8px 0 2px">${isArabic ? 'فاتورة ضريبية مبسطة' : 'Simplified Tax Invoice'}</h3>
            <div class="muted">${new Date(businessDate).toLocaleString()}</div>
          </div>
          <hr/>
          <div class="line"><span>${isArabic ? 'رقم الفاتورة' : 'Invoice'}</span><span class="strong">${escapeHtml(
            String(invoiceNumber)
          )}</span></div>
          <div class="line"><span>${isArabic ? 'اسم المنشأة' : 'Company'}</span><span>${escapeHtml(
            String(companyName || '-')
          )}</span></div>
          <div class="line"><span>${isArabic ? 'الجوال' : 'Phone'}</span><span>${escapeHtml(
            String(companyPhone || '-')
          )}</span></div>
          <div class="line"><span>${isArabic ? 'العنوان' : 'Address'}</span><span>${escapeHtml(
            String(companyAddress || '-')
          )}</span></div>
          <div class="line"><span>${isArabic ? 'الرقم الضريبي' : 'VAT Number'}</span><span>${escapeHtml(
            String(vatNumber || '-')
          )}</span></div>
          ${
            invoiceHeader
              ? `<div style="margin: 8px 0; text-align: center; font-size: 12px; color: #64748b; white-space: pre-wrap;">${escapeHtml(
                  invoiceHeader
                )}</div>`
              : ''
          }
          <div class="line"><span>${isArabic ? 'العميل' : 'Customer'}</span><span>${escapeHtml(
            String(customerName)
          )}</span></div>
          <hr/>
          <div class="muted strong">${isArabic ? 'الأصناف' : 'Items'}</div>
          ${receiptItemsHtml || `<div class="muted">${isArabic ? 'لا توجد أصناف' : 'No items'}</div>`}
          <hr/>
          <div class="line"><span>${isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span><span>SR ${subtotalValue}</span></div>
          <div class="line"><span>${isArabic ? 'الخصم' : 'Discount'}</span><span>SR ${discountValue}</span></div>
          <div class="line"><span>${isArabic ? 'الضريبة' : 'Tax'}</span><span>SR ${taxValue}</span></div>
          <div class="line strong"><span>${isArabic ? 'الإجمالي' : 'Total'}</span><span>SR ${totalValue}</span></div>
          ${
            printQrDataUrl
              ? `<div class="qr"><img class="qr" src="${printQrDataUrl}" alt="qr" /></div>`
              : ''
          }
          <hr/>
          ${
            invoiceFooter
              ? `<div style="margin: 8px 0; text-align: center; font-size: 12px; color: #64748b; white-space: pre-wrap;">${escapeHtml(
                  invoiceFooter
                )}</div><hr/>`
              : ''
          }
          <div class="center muted">${isArabic ? 'مدعوم بواسطة Zood POS' : 'Powered by Zood POS'}</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${String(invoiceNumber).replace(/[^\w-]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const formattedPaid = Number(totalPaid || 0).toFixed(2).split('.');
  const paidInteger = formattedPaid[0];
  const paidDecimal = formattedPaid[1];
  const canSubmitWhatsapp = isValidWhatsappPhone(whatsappPhoneInput);

  const saveCustomer = async () => {
    const payloadName = newCustomerForm.name.trim();
    if (!payloadName) {
      showToast({
        description: t('CUSTOMER_NAME'),
        duration: 1800,
        variant: 'destructive',
      });
      return;
    }
    try {
      setIsCreatingCustomer(true);
      const response = isEditCustomerMode && editingCustomerId
        ? await axiosInstance.put(`/manage/customers/${editingCustomerId}`, {
            name: payloadName,
            phone: newCustomerForm.phone.trim(),
            email: newCustomerForm.email.trim(),
            notes: '-',
            tax_registration_number: newCustomerForm.tax_registration_number.trim(),
            vat_registration_number: newCustomerForm.vat_registration_number.trim(),
          })
        : await axiosInstance.post('/manage/customers', {
            name: payloadName,
            phone: newCustomerForm.phone.trim(),
            email: newCustomerForm.email.trim(),
            notes: '-',
            tax_registration_number: newCustomerForm.tax_registration_number.trim(),
            vat_registration_number: newCustomerForm.vat_registration_number.trim(),
          });
      const createdCustomer = response?.data?.data ?? response?.data ?? null;
      const newCustomerId = createdCustomer?.id
        ? String(createdCustomer.id)
        : editingCustomerId;
      if (!newCustomerId) throw new Error('Invalid customer response');

      if (!isEditCustomerMode && newCustomerForm.address.trim()) {
        await axiosInstance.post(`/manage/customers/addAddress/${newCustomerId}`, {
          name: newCustomerForm.address.trim(),
          description: '-',
        });
      }
      setExtraCustomers((prev) =>
        prev.some((customer) => customer.value === newCustomerId)
          ? prev
          : [...prev, { value: newCustomerId, label: payloadName }]
      );
      dispatch(updateField({ field: 'customer_id', value: newCustomerId }));
      setNewCustomerForm({
        name: '',
        phone: '',
        address: '',
        email: '',
        tax_registration_number: '',
        vat_registration_number: '',
      });
      setIsCreateCustomerOpen(false);
      setIsEditCustomerMode(false);
      setEditingCustomerId('');
      showToast({
        description: t('ADDED_SUCCESSFULLY'),
        duration: 1600,
      });
    } catch {
      showToast({
        description: t('GENERAL_ERROR'),
        duration: 2500,
        variant: 'destructive',
      });
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  const openCreateCustomerDialog = () => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    setIsEditCustomerMode(false);
    setEditingCustomerId('');
    setNewCustomerForm({
      name: '',
      phone: '',
      address: '',
      email: '',
      tax_registration_number: '',
      vat_registration_number: '',
    });
    setTimeout(() => setIsCreateCustomerOpen(true), 0);
  };

  const openEditCustomerDialog = () => {
    const selectedId = selectedCustomerId ? String(selectedCustomerId) : '';
    if (!selectedId) {
      showToast({
        description: t('NO_CUSTOMER_SELECTED_EDIT'),
        duration: 2000,
        variant: 'destructive',
      });
      return;
    }
    const selectedCustomer = Array.isArray(customersData?.data)
      ? customersData.data.find((customer: any) => String(customer?.id) === selectedId)
      : null;
    (document.activeElement as HTMLElement | null)?.blur?.();
    setIsEditCustomerMode(true);
    setEditingCustomerId(selectedId);
    setNewCustomerForm({
      name: selectedCustomer?.name || selectedCustomerName || '',
      phone: selectedCustomer?.phone || '',
      address:
        selectedCustomer?.address?.name ||
        selectedCustomer?.addresses?.[0]?.name ||
        '',
      email: selectedCustomer?.email || '',
      tax_registration_number: selectedCustomer?.tax_registration_number || '',
      vat_registration_number: selectedCustomer?.vat_registration_number || '',
    });
    setTimeout(() => setIsCreateCustomerOpen(true), 0);
  };

  const clearCustomerSelection = () => {
    dispatch(updateField({ field: 'customer_id', value: '' }));
  };


  const startPaymentTour = useCallback(async () => {
    try {
      const { driver } = await import('driver.js');
      await import('driver.js/dist/driver.css');

      const driverObj = driver({
        showProgress: true,
        animate: true,
        nextBtnText: 'التالي',
        prevBtnText: 'السابق',
        doneBtnText: 'إنهاء',
        steps: [
          {
            element: '#tour-payment-summary',
            popover: {
              title: t('PAYMENT_SUMMARY') || 'ملخص الدفع',
              description: t('TOUR_PAYMENT_SUMMARY_DESC') || 'هنا يظهر إجمالي المبلغ والمتبقي.',
              side: 'left',
              align: 'start',
            },
          },
          {
            element: '#tour-payment-customer',
            popover: {
              title: t('CUSTOMER') || 'العميل',
              description: t('TOUR_PAYMENT_CUSTOMER_DESC') || 'يمكنك تغيير العميل من هنا إذا لزم الأمر.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#tour-payment-methods',
            popover: {
              title: t('PAYMENT_METHODS') || 'طرق الدفع',
              description: t('TOUR_PAYMENT_METHODS_DESC') || 'اختر طريقة الدفع المناسبة (نقد، شبكة، إلخ).',
              side: 'top',
              align: 'start',
            },
          },
          {
            element: '#tour-payment-numpad',
            popover: {
              title: t('NUMPAD') || 'لوحة الأرقام',
              description: t('TOUR_PAYMENT_NUMPAD_DESC') || 'استخدم لوحة الأرقام لإدخال المبلغ المدفوع.',
              side: 'top',
              align: 'start',
            },
          },
          {
            element: '#tour-payment-confirm',
            popover: {
              title: t('CONFIRM_PAYMENT') || 'إتمام الدفع',
              description: t('TOUR_PAYMENT_CONFIRM_DESC') || 'اضغط هنا لإتمام عملية الدفع وإصدار الفاتورة.',
              side: 'top',
              align: 'start',
            },
          },
        ],
        onDestroyed: () => {
          localStorage.setItem('has_seen_pos_payment_tour_v2', 'true');
        },
      });
      driverObj.drive();
    } catch (error) {
      console.error('Failed to load tour driver:', error);
    }
  }, [t]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('has_seen_pos_payment_tour_v2');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        startPaymentTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startPaymentTour]);

  if (completedOrderData) {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#F3F4F8] p-6"
      >
        <div className="w-full max-w-[980px] text-center">
          <h2 className="text-4xl font-bold text-[#0F172A]">{t('AMOUNT_PAID')}</h2>
          <div className="mt-8 text-[170px] font-bold leading-none tracking-tight text-[#0B132F]">
            {paidInteger}
            <span className="text-[#7E8393]">.{paidDecimal}</span>
          </div>
          <div className="mx-auto mt-10 grid max-w-[980px] grid-cols-1 gap-4 md:grid-cols-4">
            <Button
              type="button"
              variant="outline"
              className="h-14 text-lg"
              disabled={isPreparingPrintQr}
              onClick={handlePrintReceipt}
            >
              {isPreparingPrintQr ? t('LOADING') : t('PRINT')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-14 text-lg"
              onClick={handleSendWhatsapp}
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path fill="#25D366" d="M19.11 17.57c-.3-.15-1.74-.86-2.01-.95-.27-.1-.47-.15-.67.15-.2.3-.77.95-.94 1.14-.17.2-.35.22-.65.07-.3-.15-1.24-.45-2.36-1.43-.87-.78-1.45-1.74-1.62-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.19-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.46 1.06 2.88 1.21 3.08.15.2 2.07 3.15 5.02 4.42.7.3 1.25.48 1.67.62.7.22 1.34.2 1.84.12.56-.08 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.08-.12-.27-.2-.57-.35z" />
                  <path fill="#25D366" d="M16.02 3.2c-7 0-12.67 5.67-12.67 12.67 0 2.24.58 4.42 1.68 6.34L3.2 28.8l6.76-1.78a12.6 12.6 0 0 0 6.06 1.55h.01c6.99 0 12.66-5.67 12.66-12.67 0-3.39-1.32-6.58-3.72-8.98a12.6 12.6 0 0 0-8.95-3.72zm0 23.2h-.01a10.48 10.48 0 0 1-5.34-1.47l-.38-.23-4.02 1.06 1.08-3.92-.25-.4a10.45 10.45 0 0 1-1.6-5.55c0-5.8 4.72-10.51 10.52-10.51 2.81 0 5.45 1.09 7.43 3.08a10.45 10.45 0 0 1 3.08 7.43c0 5.8-4.72 10.51-10.51 10.51z" />
                </svg>
                <span>{t('SEND_WHATSAPP')}</span>
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-14 text-lg"
              onClick={handleDownloadReceipt}
            >
              {t('DOWNLOAD_RECEIPT')}
            </Button>
            <Button
              type="button"
              className="h-14 text-lg"
              onClick={() => {
                dispatch(setCardItem([]));
                dispatch(resetOrder());
                navigate('/zood-dashboard/individual-invoices/add');
              }}
            >
              {t('CONTINUE')}
            </Button>
          </div>
        </div>
        {showWhatsappDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-[920px] rounded-3xl bg-white p-5 shadow-xl">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  className="text-3xl leading-none text-gray-500"
                  onClick={() => setShowWhatsappDialog(false)}
                >
                  ×
                </button>
              </div>
              <div className="flex overflow-hidden rounded-md border border-mainBorder">
                <input
                  type="text"
                  inputMode="tel"
                  value={whatsappPhoneInput}
                  onChange={(e) => setWhatsappPhoneInput(e.target.value)}
                  placeholder={isArabic ? 'رقم الجوال' : 'Phone number'}
                  className="h-[70px] w-full px-5 text-2xl outline-none"
                  dir={isArabic ? 'rtl' : 'ltr'}
                />
                <button
                  type="button"
                  onClick={submitWhatsappFromDialog}
                  disabled={!canSubmitWhatsapp}
                  className={`flex h-[70px] w-[170px] items-center justify-center transition-all ${
                    canSubmitWhatsapp
                      ? 'bg-[#25D366] text-white hover:bg-[#1fb95a]'
                      : 'cursor-not-allowed bg-primary/50 text-white'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="h-8 w-8 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M19.11 17.57c-.3-.15-1.74-.86-2.01-.95-.27-.1-.47-.15-.67.15-.2.3-.77.95-.94 1.14-.17.2-.35.22-.65.07-.3-.15-1.24-.45-2.36-1.43-.87-.78-1.45-1.74-1.62-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.19-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.46 1.06 2.88 1.21 3.08.15.2 2.07 3.15 5.02 4.42.7.3 1.25.48 1.67.62.7.22 1.34.2 1.84.12.56-.08 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.08-.12-.27-.2-.57-.35z" />
                    <path d="M16.02 3.2c-7 0-12.67 5.67-12.67 12.67 0 2.24.58 4.42 1.68 6.34L3.2 28.8l6.76-1.78a12.6 12.6 0 0 0 6.06 1.55h.01c6.99 0 12.66-5.67 12.66-12.67 0-3.39-1.32-6.58-3.72-8.98a12.6 12.6 0 0 0-8.95-3.72zm0 23.2h-.01a10.48 10.48 0 0 1-5.34-1.47l-.38-.23-4.02 1.06 1.08-3.92-.25-.4a10.45 10.45 0 0 1-1.6-5.55c0-5.8 4.72-10.51 10.52-10.51 2.81 0 5.45 1.09 7.43 3.08a10.45 10.45 0 0 1 3.08 7.43c0 5.8-4.72 10.51-10.51 10.51z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="xl:col-span-5">
        <div className="rounded-xl border border-mainBorder bg-background p-3">
          <div className="mb-2 flex items-center justify-end">
             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={startPaymentTour} title={t('HELP_TOUR')}>
                <HelpCircle className="h-4 w-4 text-secText hover:text-main" />
             </Button>
          </div>
          <div className="mb-3" id="tour-payment-customer">
            <CustomSearchInbox
              options={allCustomerOptions}
              placeholder="CUSTOMER_NAME"
              onValueChange={(value: string) =>
                dispatch(updateField({ field: 'customer_id', value }))
              }
              className="h-[40px] w-full"
              value={selectedCustomerId}
              directValue={selectedCustomerName}
              footerActions={[
                {
                  id: 'create-customer',
                  label: (
                    <div className="flex items-center justify-center gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      <span>{t('ADD_CUSTOMER')}</span>
                    </div>
                  ),
                  className:
                    'bg-main/5 border-main/20 text-main hover:bg-main/10 font-medium',
                  onClick: openCreateCustomerDialog,
                },
                {
                  id: 'edit-customer',
                  label: (
                    <div className="flex items-center justify-center gap-1">
                      <Pencil className="h-3.5 w-3.5" />
                      <span>{t('EDIT')}</span>
                    </div>
                  ),
                  onClick: openEditCustomerDialog,
                  disabled: !selectedCustomerId,
                },
                {
                  id: 'clear-customer',
                  label: (
                    <div className="flex items-center justify-center gap-1">
                      <X className="h-3.5 w-3.5" />
                      <span>{t('CLEAR_CUSTOMER')}</span>
                    </div>
                  ),
                  className:
                    'hover:bg-red-50 hover:text-red-600 hover:border-red-200',
                  onClick: clearCustomerSelection,
                },
              ]}
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3" id="tour-payment-methods">
            {paymentMethodsData?.data?.map((method: any) => {
              const isActive = activePaymentMethodId === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => selectPaymentMethod(method)}
                  className={`flex h-14 flex-col items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                    isActive
                      ? 'border-main bg-main/10 text-main shadow-sm'
                      : 'border-mainBorder bg-white hover:border-main/50'
                  }`}
                >
                  <span className="line-clamp-1">{method.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2" id="tour-payment-numpad">
            {['1', '2', '3', '+10', '4', '5', '6', '+20', '7', '8', '9', '+50', '+/-', '0', '.', '⌫'].map(
              (key) => {
                const isAction = ['+10', '+20', '+50', '⌫', '+/-'].includes(key);
                const isDelete = key === '⌫';
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (key === '⌫') return backspaceAmount();
                      if (key === '+10') return addQuickAmount(10);
                      if (key === '+20') return addQuickAmount(20);
                      if (key === '+50') return addQuickAmount(50);
                      if (key === '+/-') return;
                      appendDigit(key);
                    }}
                    className={`flex h-14 items-center justify-center rounded-lg text-lg font-semibold shadow-sm transition-all active:scale-95 ${
                      isDelete
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : isAction
                        ? 'bg-gray-100 text-secText hover:bg-gray-200'
                        : 'bg-white border border-mainBorder hover:border-main/50 text-mainText'
                    }`}
                  >
                    {isDelete ? '⌫' : key}
                  </button>
                );
              }
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 text-base font-medium"
              onClick={() => navigate('/zood-dashboard/individual-invoices/add')}
            >
              {t('RETURN')}
            </Button>
            <Button
              id="tour-payment-confirm"
              className="h-12 text-base font-bold"
              onClick={submitOrder}
              loading={loading}
            >
              {t('CONFIRM')}
            </Button>
          </div>
        </div>
      </div>
      <div className="xl:col-span-7">
        <div className="rounded-xl border border-mainBorder bg-background p-4" id="tour-payment-summary">
          <div className="text-center text-[62px] font-bold leading-none">
            {totals.total.toFixed(2)}
          </div>
          <div className="mt-5 space-y-2">
            {payments.map((row, index) => (
              <div
                key={`${row.payment_method_id}-${index}`}
                className="flex items-center justify-between rounded-md border border-mainBorder px-3 py-2"
              >
                <span>{row.name}</span>
                <div className="flex items-center gap-3">
                  <span>SR {Number(row.amount || 0).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPayments((prev) => {
                        const next = prev.filter((_, i) => i !== index);
                        return next;
                      })
                    }
                    className="text-destructive"
                  >
                    x
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t pt-4">
            <div className="flex items-center justify-between text-emerald-700">
              <span>{t('CHANGE')}</span>
              <span>SR {change.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-secText">
              <span>{t('REMAINING_AMOUNT')}</span>
              <span>SR {remaining.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <AlertDialogComp
        open={isCreateCustomerOpen}
        onOpenChange={(open) => {
          setIsCreateCustomerOpen(open);
          if (!open) {
            setIsEditCustomerMode(false);
            setEditingCustomerId('');
          }
        }}
      >
        <AlertDialogContentComp className="right-0 w-fit border-0 bg-transparent p-0 shadow-none">
          <button
            onClick={() => setIsCreateCustomerOpen(false)}
            className="absolute -left-5 top-6 z-[100] flex h-10 w-10 items-center justify-center rounded-full border border-mainBorder bg-white text-mainText shadow-sm transition hover:scale-105"
          >
            <XIcons />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[100dvh] w-[390px] max-w-[calc(100vw-48px)] overflow-y-auto bg-white"
          >
            <AlertDialogTitleComp className="sr-only">
              {isEditCustomerMode ? t('UPDATE_CUSTOMER') : t('ADD_CUSTOMER')}
            </AlertDialogTitleComp>
            <AlertDialogDescriptionComp className="sr-only">
              {t('CUSTOMER_NAME')}
            </AlertDialogDescriptionComp>
            <div className="border-b border-mainBorder px-7 py-6 text-center text-3xl font-semibold text-mainText">
              {isEditCustomerMode ? t('UPDATE_CUSTOMER') : t('ADD_CUSTOMER')}
            </div>
            <div className="space-y-4 px-7 py-6">
              <div>
                <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                  {t('CUSTOMER_NAME')}
                </label>
                <Input
                  value={newCustomerForm.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCustomerForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-11 rounded-md border-mainBorder bg-white px-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                  {t('PHONE')}
                </label>
                <Input
                  value={newCustomerForm.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCustomerForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="h-11 rounded-md border-mainBorder bg-white px-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                  {t('ADDRESS')}
                </label>
                <Input
                  value={newCustomerForm.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCustomerForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="h-11 rounded-md border-mainBorder bg-white px-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                  {t('EMAIL')}
                </label>
                <Input
                  value={newCustomerForm.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCustomerForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="h-11 rounded-md border-mainBorder bg-white px-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                  {t('TAX_REGISTRATION_NUMBER')}
                </label>
                <Input
                  value={newCustomerForm.tax_registration_number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCustomerForm((prev) => ({
                      ...prev,
                      tax_registration_number: e.target.value,
                    }))
                  }
                  className="h-11 rounded-md border-mainBorder bg-white px-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                  {t('SETTINGS_COMMERCIAL_REGISTRATION_NUMBER')}
                </label>
                <Input
                  value={newCustomerForm.vat_registration_number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCustomerForm((prev) => ({
                      ...prev,
                      vat_registration_number: e.target.value,
                    }))
                  }
                  className="h-11 rounded-md border-mainBorder bg-white px-3 text-sm"
                />
              </div>
            </div>
            <div className="sticky bottom-0 border-t border-mainBorder bg-white px-7 py-4">
              <Button
                type="button"
                loading={isCreatingCustomer}
                disabled={isCreatingCustomer}
                onClick={saveCustomer}
                className="h-11 w-full rounded-md text-base font-semibold"
              >
                {isEditCustomerMode ? t('UPDATE_CUSTOMER') : t('ADD_CUSTOMER')}
              </Button>
            </div>
          </div>
        </AlertDialogContentComp>
      </AlertDialogComp>
    </div>
  );
}
