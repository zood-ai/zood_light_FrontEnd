import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
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
import { Plus, Pencil, X, HelpCircle, Keyboard, LogOut, Trash2, RotateCcw } from 'lucide-react';
import SH_LOGO from '@/assets/SH_LOGO.svg';
import Cookies from 'js-cookie';
import {
  buildReceiptCompanyContext,
  buildSimplifiedTaxInvoiceHtml,
  mapApiOrderToReceiptInput,
  openAndPrintSimplifiedTaxInvoice,
  printKitchenTicketsByCategory,
  resolveReceiptQrDataUrl,
  warmupQzTrayConnection,
  type ReceiptLineItem,
} from '@/utils/simplifiedTaxInvoiceReceipt';
import { formatNumber } from '@/utils/numberFormat';
import CurrencyAmount from '@/components/custom/CurrencyAmount';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineOrdersSummary } from '@/hooks/useOfflineOrdersSummary';
import { enqueueOfflineOrder, syncPendingOrders } from '@/lib/offline/outbox';
import OfflineSyncStatusPill from '@/components/custom/OfflineSyncStatusPill';

type PaymentRow = {
  payment_method_id: string;
  name: string;
  amount: number;
};

type RefundOrder = {
  id: string;
  reference?: string;
  invoice_number?: string;
  total_price?: number;
  business_date?: string;
  created_at?: string;
  return_reason?: string | null;
  customer?: {
    name?: string;
  };
  branch_id?: string;
  branch?: {
    id?: string;
  };
};

const ONLINE_ORDER_SUBMIT_TIMEOUT_MS = 9000;

export default function POSPaymentPanel() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activePaymentMethodId, setActivePaymentMethodId] = useState('');
  const [draftValue, setDraftValue] = useState('0');
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const submitOrderInFlightRef = useRef(false);
  const paidAmountPulseRef = useRef<HTMLDivElement | null>(null);
  const paidAmountAnimationRef = useRef<Animation | null>(null);
  const [lastSuccessItems, setLastSuccessItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [completedOrderData, setCompletedOrderData] = useState<any>(null);
  const [printQrDataUrl, setPrintQrDataUrl] = useState('');
  const [isPreparingPrintQr, setIsPreparingPrintQr] = useState(false);
  const [autoPrintTriggered, setAutoPrintTriggered] = useState(false);
  const [showWhatsappDialog, setShowWhatsappDialog] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [whatsappPhoneInput, setWhatsappPhoneInput] = useState('');
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [isEditCustomerMode, setIsEditCustomerMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState('');
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isLoadingRefundOrders, setIsLoadingRefundOrders] = useState(false);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [isPrintingRefund, setIsPrintingRefund] = useState(false);
  const [refundOrders, setRefundOrders] = useState<RefundOrder[]>([]);
  const [refundSearch, setRefundSearch] = useState('');
  const [selectedRefundOrderId, setSelectedRefundOrderId] = useState('');
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
  const { isOnline } = useNetworkStatus();
  const { pendingCount, failedCount } = useOfflineOrdersSummary();

  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } = createCrudService<any>(
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
  const canRefund = useMemo(
    () =>
      [
        'orders:manage',
        'purchasing:drafts:manage',
        'purchasing:closed:manage',
        'purchasing_from_po:drafts:manage',
        'po:drafts:manage',
        'po:posted:manage',
        'po:approved:manage',
        'po:approved:receive',
      ].some((permission) =>
        allSettings?.WhoAmI?.user?.roles
          ?.flatMap((role: any) =>
            Array.isArray(role?.permissions)
              ? role.permissions.map((perm: any) => perm?.name)
              : []
          )
          ?.includes(permission)
      ),
    [allSettings?.WhoAmI?.user?.roles]
  );

  const baseAmount = useMemo(
    () =>
      cardItemValue.reduce(
        (acc: number, item: any) =>
          acc + (Number(item?.price || 0) * Number(item?.qty || 0) - (Number(item?.discount_amount || 0) * Number(item?.qty || 0))),
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
    void warmupQzTrayConnection().catch(() => {});
  }, []);

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

    if (totals.total > 0 || cardItemValue.length === 0) {
      setActivePaymentMethodId(firstMethod.id);
      const initialAmount = totals.total;
      setDraftValue(String(initialAmount));
      // Removed auto-add to payments list to avoid confusion
      setPayments([]);
    }
  }, [activePaymentMethodId, paymentMethodsData?.data, totals.total, cardItemValue.length]);

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

    // Calculate total paid by OTHER methods to find what the "Auto/Default" amount would be
    const totalPaidOthers = payments
      .filter((p) => p.payment_method_id !== activePaymentMethodId)
      .reduce((acc, p) => acc + Number(p.amount || 0), 0);
      
    const remainingExpected = Math.max(0, totals.total - totalPaidOthers);
    
    // If current value matches the expected remaining amount (auto-filled value), overwrite it.
    // Use small epsilon for float comparison.
    const isAutoFilledValue = Math.abs(Number(draftValue) - remainingExpected) < 0.01;

    let next;
    if (isAutoFilledValue && digit !== '.') {
      next = digit;
    } else {
      const base = draftValue === '0' ? '' : draftValue;
      next = digit === '.' ? (base.includes('.') ? base : `${base}.`) : `${base}${digit}`;
    }

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
    if (loading || submitOrderInFlightRef.current) return;
    submitOrderInFlightRef.current = true;

    // Check if we need to auto-apply the draft amount as a payment
    let finalPayments = [...payments];
    const draftAmount = Number(draftValue || 0);
    const currentPaid = finalPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
    const currentRemaining = round2(totals.total - currentPaid);

    // If there is a remaining amount and the draft input essentially covers it, auto-add it.
    if (currentRemaining > 0 && Math.abs(currentRemaining - draftAmount) < 0.1 && activePaymentMethodId) {
        const method = paymentMethodsData?.data?.find((m: any) => m.id === activePaymentMethodId);
        if (method) {
             finalPayments.push({
                 payment_method_id: method.id,
                 name: method.name,
                 amount: draftAmount
             });
        }
    }

    const finalTotalPaid = finalPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
    const finalRemaining = round2(totals.total - finalTotalPaid);

    if (finalRemaining > 0) {
      showToast({
        description: t('REMAINING_AMOUNT'),
        duration: 2500,
        variant: 'destructive',
      });
      submitOrderInFlightRef.current = false;
      return;
    }

    // Construct the payload with the updated payments
    const paymentsPayload = finalPayments
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

    const clientOrderId =
      String(orderSchema?.client_order_id || '').trim() ||
      (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `client-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

    const finalOrderSchema = {
      ...orderSchema,
      payments: paymentsPayload,
      client_order_id: clientOrderId,
    };

    const buildPendingCompletedOrder = (
      localId: string,
      mode: 'offline' | 'online' = 'offline'
    ) => ({
      id: localId,
      reference: localId,
      business_date: new Date().toISOString(),
      total_price: totals.total,
      subtotal_price: totals.subtotal,
      total_taxes: totals.tax,
      discount_amount: Number(finalOrderSchema?.discount_amount || 0),
      qrcode: '',
      products: cardItemValue.map((item: any) => ({
        name: item?.name || '-',
        quantity: Number(item?.qty || 0),
        unit_price: Number(item?.price || 0),
        discount_amount: Number(item?.discount_amount || 0),
      })),
      sync_status: mode === 'offline' ? 'pending' : 'syncing',
      is_offline_order: mode === 'offline',
    });

    const triggerKitchenPrint = async (reference?: string, businessDate?: string) => {
      try {
        await printKitchenTicketsByCategory({
          items: cardItemValue,
          reference,
          businessDate,
        });
      } catch {
        // Kitchen printing should not block checkout flow.
      }
    };

    if (!isOnline) {
      try {
        setLoading(true);
        const queuedOrder = await enqueueOfflineOrder(finalOrderSchema);
        void triggerKitchenPrint(queuedOrder.local_id, new Date().toISOString());
        setLastSuccessItems([...cardItemValue]);
        setCompletedOrderData(buildPendingCompletedOrder(queuedOrder.local_id, 'offline'));
        setPayments(finalPayments);
        showToast({
          description:
            'Order saved offline. It will sync automatically when internet is back.',
          duration: 2800,
        });
      } catch {
        showToast({
          description: t('GENERAL_ERROR'),
          duration: 3000,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
        submitOrderInFlightRef.current = false;
      }
      return;
    }

    try {
      setLoading(true);
      const optimisticLocalId = `pending-online-${Date.now()}`;
      setLastSuccessItems([...cardItemValue]);
      setCompletedOrderData(buildPendingCompletedOrder(optimisticLocalId, 'online'));
      setPayments(finalPayments);

      const submitController = new AbortController();
      const submitTimeout = setTimeout(() => {
        submitController.abort();
      }, ONLINE_ORDER_SUBMIT_TIMEOUT_MS);
      let createdOrderResponse: any;
      try {
        createdOrderResponse = await axiosInstance.post('orders', finalOrderSchema, {
          headers: {
            'X-Idempotency-Key': clientOrderId,
          },
          signal: submitController.signal,
        });
      } catch (error: any) {
        const isTimeoutAbort =
          error?.code === 'ERR_CANCELED' ||
          error?.name === 'CanceledError' ||
          error?.message === 'canceled';
        if (!isTimeoutAbort) {
          const queuedOrder = await enqueueOfflineOrder(finalOrderSchema);
          void triggerKitchenPrint(queuedOrder.local_id, new Date().toISOString());
          setCompletedOrderData(buildPendingCompletedOrder(queuedOrder.local_id, 'offline'));
          showToast({
            description: isArabic
              ? 'تعذر إتمام الطلب أونلاين، تم حفظه أوفلاين وسيتم مزامنته تلقائياً.'
              : 'Could not complete online. Order was saved offline and will sync automatically.',
            duration: 3200,
          });
          void syncPendingOrders();
          return;
        }
        const queuedOrder = await enqueueOfflineOrder(finalOrderSchema);
        void triggerKitchenPrint(queuedOrder.local_id, new Date().toISOString());
        setCompletedOrderData(buildPendingCompletedOrder(queuedOrder.local_id, 'offline'));
        showToast({
          description: isArabic
            ? 'الشبكة بطيئة، تم حفظ الطلب أوفلاين وسيتم مزامنته تلقائياً.'
            : 'Network is slow. Order was saved offline and will sync automatically.',
          duration: 3200,
        });
        void syncPendingOrders();
        return;
      } finally {
        clearTimeout(submitTimeout);
      }

      const createdOrderPayload =
        createdOrderResponse?.data?.data ?? createdOrderResponse?.data ?? null;
      const createdOrderId = createdOrderPayload?.id;

      if (createdOrderPayload) {
        void triggerKitchenPrint(
          String(
            createdOrderPayload?.reference ||
              createdOrderPayload?.invoice_number ||
              createdOrderPayload?.id ||
              ''
          ),
          String(createdOrderPayload?.business_date || new Date().toISOString())
        );
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
              createdOrderPayload?.discount_amount ?? finalOrderSchema?.discount_amount ?? 0
            ),
            tax: Number(
              createdOrderPayload?.total_taxes ?? totals.tax ?? 0
            ),
            payments: finalPayments.map((payment) => ({
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
          duration: 1200,
        });

        // Replace optimistic completion payload with real server payload.
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
      void syncPendingOrders();
    } catch {
      showToast({
        description: t('GENERAL_ERROR'),
        duration: 3000,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      submitOrderInFlightRef.current = false;
    }
  };

  const handleContinueAfterCompletion = useCallback(() => {
    const branchId = orderSchema?.branch_id || Cookies.get('branch_id') || '';
    try {
      window.localStorage.removeItem(`pos_current_cart_v1_${branchId || 'default'}`);
    } catch {
      // ignore
    }
    dispatch(setCardItem([]));
    dispatch(resetOrder());
    navigate('/zood-dashboard/individual-invoices/add');
  }, [dispatch, navigate, orderSchema?.branch_id]);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return true;
      }
      return Boolean(target.closest('[contenteditable="true"]'));
    };

    const handlePaymentShortcuts = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const isTyping = isTypingTarget(event.target);

      if (!event.ctrlKey && !event.altKey && !event.metaKey && event.key === 'F1') {
        event.preventDefault();
        setIsShortcutsHelpOpen(true);
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        if (showWhatsappDialog) {
          setShowWhatsappDialog(false);
          return;
        }
        if (isCreateCustomerOpen) {
          setIsCreateCustomerOpen(false);
          return;
        }
        if (isRefundDialogOpen) {
          setIsRefundDialogOpen(false);
          return;
        }
        if (completedOrderData) {
          handleContinueAfterCompletion();
          return;
        }
        navigate('/zood-dashboard/individual-invoices/add');
        return;
      }

      const canConfirmPayment =
        !completedOrderData &&
        !isCreateCustomerOpen &&
        !isRefundDialogOpen &&
        !showWhatsappDialog &&
        !isTyping;

      if (event.ctrlKey && !event.altKey && !event.metaKey && event.key === 'Enter') {
        if (!canConfirmPayment) return;
        event.preventDefault();
        void submitOrder();
        return;
      }

      if (!event.ctrlKey && !event.altKey && !event.metaKey && canConfirmPayment) {
        if (event.key === 'F7') {
          event.preventDefault();
          addQuickAmount(10);
          return;
        }
        if (event.key === 'F8') {
          event.preventDefault();
          addQuickAmount(20);
          return;
        }
        if (event.key === 'F9') {
          event.preventDefault();
          addQuickAmount(50);
          return;
        }
        if (event.key === 'Backspace' || event.key.toLowerCase() === 'x') {
          event.preventDefault();
          backspaceAmount();
          return;
        }
        if (event.key === 'Delete' || event.key.toLowerCase() === 'c') {
          event.preventDefault();
          setDraftValue('0');
          upsertActivePayment(0);
          return;
        }
        if (/^[0-9]$/.test(event.key) || event.key === '.') {
          event.preventDefault();
          appendDigit(event.key);
          return;
        }
      }

      if (event.ctrlKey || event.altKey || event.metaKey || isTyping) return;

      if (event.key === 'F4' && canConfirmPayment) {
        event.preventDefault();
        void submitOrder();
      }
    };

    window.addEventListener('keydown', handlePaymentShortcuts);
    return () => window.removeEventListener('keydown', handlePaymentShortcuts);
  }, [
    addQuickAmount,
    appendDigit,
    backspaceAmount,
    completedOrderData,
    handleContinueAfterCompletion,
    isCreateCustomerOpen,
    isRefundDialogOpen,
    navigate,
    showWhatsappDialog,
    submitOrder,
    upsertActivePayment,
  ]);

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

  /** Same HTML as thermal print (`buildSimplifiedTaxInvoiceHtml`) for print + download. */
  const buildCompletedPosReceiptHtml = async (): Promise<string | null> => {
    if (!completedOrderData) return null;

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
    );
    const subtotalValue = Number(
      completedOrderData?.subtotal_price ?? totals.subtotal ?? 0
    );
    const taxValue = Number(
      completedOrderData?.total_taxes ?? totals.tax ?? 0
    );
    const discountValue = Number(
      completedOrderData?.discount_amount ?? orderSchema?.discount_amount ?? 0
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

    const receiptLines: ReceiptLineItem[] = sourceItems.map((item: any) => {
      const qty = Number(item?.quantity ?? item?.qty ?? item?.pivot?.quantity ?? 0);
      const unitPrice = Number(item?.unit_price ?? item?.price ?? item?.pivot?.price ?? item?.pivot?.unit_price ?? 0);
      const discountAmt = Number(item?.discount_amount ?? item?.pivot?.discount_amount ?? 0);
      return {
        name: String(
          item?.name ||
            item?.product?.name ||
            item?.product_name ||
            item?.title ||
            item?.product_id ||
            '-'
        ),
        quantity: qty,
        unitPrice,
        discountPerUnit: discountAmt,
      };
    });

    const ctx = buildReceiptCompanyContext(allSettings, settingsData);
    const backendQr = String(completedOrderData?.qrcode || '').trim();
    let qrCodeDataUrl =
      printQrDataUrl ||
      (backendQr.startsWith('data:image/') ? backendQr : '');
    if (!qrCodeDataUrl) {
      let invoiceIsoDate = new Date().toISOString();
      try {
        const rawDate = completedOrderData?.business_date;
        if (rawDate) invoiceIsoDate = new Date(rawDate).toISOString();
      } catch {
        // keep default
      }
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
      const totalStr = Number(
        completedOrderData?.total_price ?? totalPaid ?? 0
      ).toFixed(2);
      const taxStr = Number(
        completedOrderData?.total_taxes ?? totals.tax ?? 0
      ).toFixed(2);
      qrCodeDataUrl = await resolveReceiptQrDataUrl({
        qrcodeRaw: backendQr,
        sellerName,
        vatNumber,
        invoiceIsoDate,
        totalAmount: totalStr,
        taxAmount: taxStr,
      });
    }

    return buildSimplifiedTaxInvoiceHtml({
      isArabic,
      ...ctx,
      customerName,
      invoiceNumber: String(invoiceNumber),
      businessDate,
      items: receiptLines,
      subtotal: subtotalValue,
      tax: taxValue,
      discount: discountValue,
      total: totalValue,
      payments: payments
        .filter((payment) => Number(payment.amount || 0) > 0)
        .map((p) => ({
          name: p.name || (isArabic ? 'دفعة' : 'Payment'),
          amount: Number(p.amount || 0),
        })),
      paidAmount: Number(totalPaid || 0),
      changeAmount: Number(change || 0),
      qrCodeDataUrl,
    });
  };

  const handlePrintReceipt = async () => {
    if (!completedOrderData) return;
    const finishAndGoToPos = () => {
      const branchId = orderSchema?.branch_id || Cookies.get('branch_id') || '';
      try {
        window.localStorage.removeItem(`pos_current_cart_v1_${branchId || 'default'}`);
      } catch {
        // ignore
      }
      dispatch(setCardItem([]));
      dispatch(resetOrder());
      navigate('/zood-dashboard/individual-invoices/add');
    };
    const html = await buildCompletedPosReceiptHtml();
    if (!html) return;
    openAndPrintSimplifiedTaxInvoice(html, {
      onAfterPrint: finishAndGoToPos,
    });
  };

  useEffect(() => {
    if (!completedOrderData || autoPrintTriggered || isPreparingPrintQr) return;
    setAutoPrintTriggered(true);
    const timer = setTimeout(() => {
      void handlePrintReceipt();
    }, 120);

    return () => clearTimeout(timer);
  }, [completedOrderData, autoPrintTriggered, isPreparingPrintQr]);

  useEffect(() => {
    const amountEl = paidAmountPulseRef.current;
    if (!completedOrderData || !amountEl || typeof amountEl.animate !== 'function') {
      return;
    }

    paidAmountAnimationRef.current?.cancel();
    const animation = amountEl.animate(
      [
        { transform: 'scale(0.985)' },
        { transform: 'scale(1.02)' },
        { transform: 'scale(0.985)' },
      ],
      {
        duration: 1600,
        iterations: Infinity,
        easing: 'ease-in-out',
      }
    );
    paidAmountAnimationRef.current = animation;

    return () => {
      animation.cancel();
      if (paidAmountAnimationRef.current === animation) {
        paidAmountAnimationRef.current = null;
      }
    };
  }, [completedOrderData]);

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
        : `Invoice: ${invoiceNumber}\nTotal: ﷼ ${totalValue}\nThank you`
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
        : `Invoice: ${invoiceNumber}\nTotal: ﷼ ${totalValue}\nThank you`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    setShowWhatsappDialog(false);
  };

  const handleDownloadReceipt = async () => {
    const html = await buildCompletedPosReceiptHtml();
    if (!html || !completedOrderData) return;
    const invoiceNumber =
      completedOrderData?.reference ||
      completedOrderData?.invoice_number ||
      completedOrderData?.id ||
      '-';
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

  const groupedPaid = formatNumber(totalPaid, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [paidInteger, paidDecimal = '00'] = groupedPaid.split('.');
  const canSubmitWhatsapp = isValidWhatsappPhone(whatsappPhoneInput);

  const shortcutsHelpModal = isShortcutsHelpOpen ? (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 p-4"
      onClick={() => setIsShortcutsHelpOpen(false)}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-mainBorder bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-mainText">
            {isRtl ? 'اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts'}
          </h3>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3"
            onClick={() => setIsShortcutsHelpOpen(false)}
          >
            {t('CLOSE')}
          </Button>
        </div>
        <div className="grid gap-3 text-sm text-mainText md:grid-cols-2">
          <div className="rounded-lg border border-mainBorder bg-gray-50 p-3">
            <div className="mb-2 text-xs font-bold text-secText">
              {isRtl ? 'شاشة البيع' : 'POS Sales Screen'}
            </div>
            <div className="space-y-1.5">
              <div><span className="font-semibold">F1</span> - {isRtl ? 'عرض الاختصارات' : 'Open shortcuts help'}</div>
              <div><span className="font-semibold">Ctrl + F</span> - {isRtl ? 'تركيز البحث' : 'Focus product search'}</div>
              <div><span className="font-semibold">Ctrl + E</span> - {isRtl ? 'فتح تعديل الصنف المحدد' : 'Open selected item edit'}</div>
              <div><span className="font-semibold">Enter / F2</span> - {isRtl ? 'الذهاب للدفع' : 'Proceed to payment'}</div>
              <div><span className="font-semibold">+</span> - {isRtl ? 'زيادة الكمية' : 'Increase selected item qty'}</div>
              <div><span className="font-semibold">-</span> - {isRtl ? 'تقليل الكمية' : 'Decrease selected item qty'}</div>
              <div><span className="font-semibold">Delete</span> - {isRtl ? 'حذف العنصر المحدد' : 'Delete selected cart item'}</div>
              <div><span className="font-semibold">Ctrl + 1 / 2 / 3</span> - {isRtl ? 'اختيار كمية / سعر / خصم أثناء تعديل الصنف' : 'Select qty / price / discount in item edit'}</div>
              <div><span className="font-semibold">0-9 / . / Backspace / Delete</span> - {isRtl ? 'إدخال الأرقام في شاشة تعديل الصنف' : 'Numeric edit input in item edit mode'}</div>
              <div><span className="font-semibold">F7 / F8 / F9</span> - {isRtl ? '+10 / +20 / +50 في تعديل الصنف' : '+10 / +20 / +50 in item edit'}</div>
              <div><span className="font-semibold">C / X</span> - {isRtl ? 'مسح كامل / حذف رقم واحد' : 'Clear all / delete one digit'}</div>
              <div><span className="font-semibold">Esc</span> - {isRtl ? 'إلغاء تعديل الصنف' : 'Cancel item edit (no save)'}</div>
            </div>
          </div>
          <div className="rounded-lg border border-mainBorder bg-gray-50 p-3">
            <div className="mb-2 text-xs font-bold text-secText">
              {isRtl ? 'شاشة الدفع' : 'Payment Screen'}
            </div>
            <div className="space-y-1.5">
              <div><span className="font-semibold">F1</span> - {isRtl ? 'عرض الاختصارات' : 'Open shortcuts help'}</div>
              <div><span className="font-semibold">Ctrl + Enter / F4</span> - {isRtl ? 'تأكيد الدفع' : 'Confirm payment'}</div>
              <div><span className="font-semibold">0-9 / . / Backspace / Delete</span> - {isRtl ? 'إدخال مبلغ الدفع' : 'Payment numpad input'}</div>
              <div><span className="font-semibold">F7 / F8 / F9</span> - {isRtl ? '+10 / +20 / +50 في الدفع' : '+10 / +20 / +50 in payment'}</div>
              <div><span className="font-semibold">C / X</span> - {isRtl ? 'مسح كامل / حذف رقم واحد' : 'Clear all / delete one digit'}</div>
              <div><span className="font-semibold">Esc</span> - {isRtl ? 'رجوع أو إغلاق النافذة' : 'Back or close modal'}</div>
            </div>
          </div>
          <div className="rounded-lg border border-mainBorder bg-gray-50 p-3 md:col-span-2">
            <div className="mb-2 text-xs font-bold text-secText">
              {isRtl ? 'بعد اكتمال الدفع' : 'After Payment Complete'}
            </div>
            <div className="grid gap-1.5 md:grid-cols-2">
              <div><span className="font-semibold">Enter</span> - {isRtl ? 'متابعة' : 'Continue'}</div>
              <div><span className="font-semibold">Esc</span> - {isRtl ? 'متابعة' : 'Continue'}</div>
              <div><span className="font-semibold">Ctrl + P</span> - {isRtl ? 'طباعة' : 'Print receipt'}</div>
              <div><span className="font-semibold">Ctrl + D</span> - {isRtl ? 'تنزيل الإيصال' : 'Download receipt'}</div>
              <div><span className="font-semibold">Ctrl + M</span> - {isRtl ? 'إرسال واتساب' : 'Send WhatsApp'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  useEffect(() => {
    if (!completedOrderData) return;

    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return true;
      }
      return Boolean(target.closest('[contenteditable="true"]'));
    };

    const handleCompletedScreenShortcuts = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const isTyping = isTypingTarget(event.target);
      const keyLower = event.key.toLowerCase();
      const code = event.code;

      if (!event.ctrlKey && !event.altKey && !event.metaKey && event.key === 'Enter' && !isTyping) {
        event.preventDefault();
        handleContinueAfterCompletion();
        return;
      }

      if (!event.ctrlKey || event.altKey || event.metaKey || isTyping) return;

      const isPrintShortcut = keyLower === 'p' || code === 'KeyP';
      if (isPrintShortcut) {
        event.preventDefault();
        if (!isPreparingPrintQr) {
          void handlePrintReceipt();
        }
        return;
      }

      const isDownloadShortcut = keyLower === 'd' || code === 'KeyD';
      if (isDownloadShortcut) {
        event.preventDefault();
        void handleDownloadReceipt();
        return;
      }

      const isWhatsappShortcut = keyLower === 'm' || code === 'KeyM';
      if (isWhatsappShortcut) {
        event.preventDefault();
        handleSendWhatsapp();
      }
    };

    window.addEventListener('keydown', handleCompletedScreenShortcuts);
    return () => window.removeEventListener('keydown', handleCompletedScreenShortcuts);
  }, [
    completedOrderData,
    handleContinueAfterCompletion,
    handleDownloadReceipt,
    handlePrintReceipt,
    handleSendWhatsapp,
    isPreparingPrintQr,
  ]);

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

  const fetchRefundableOrders = useCallback(async () => {
    try {
      setIsLoadingRefundOrders(true);
      const response = await axiosInstance.get(
        '/orders?filter[type]=1&filter[status]=4&sort=-created_at&perPage=100',
        { timeout: 10000 }
      );
      const list = Array.isArray(response?.data?.data)
        ? (response.data.data as RefundOrder[])
        : [];
      const currentBranchId = String(
        orderSchema?.branch_id || Cookies.get('branch_id') || ''
      ).trim();
      const filtered = list
        .filter((order) => {
          const orderBranchId = String(
            order?.branch_id ?? order?.branch?.id ?? ''
          ).trim();
          if (currentBranchId && orderBranchId && orderBranchId !== currentBranchId) {
            return false;
          }
          return true;
        })
        .slice(0, 40);
      setRefundOrders(filtered);
      setSelectedRefundOrderId((prev) => {
        if (prev && filtered.some((order) => String(order.id) === prev)) return prev;
        return filtered[0]?.id ? String(filtered[0].id) : '';
      });
    } catch {
      showToast({
        description: t('GENERAL_ERROR'),
        duration: 2500,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingRefundOrders(false);
    }
  }, [orderSchema?.branch_id, showToast, t]);

  useEffect(() => {
    if (!isRefundDialogOpen) return;
    void fetchRefundableOrders();
  }, [isRefundDialogOpen]);

  const filteredRefundOrders = useMemo(() => {
    const needle = refundSearch.trim().toLowerCase();
    if (!needle) return refundOrders;
    return refundOrders.filter((order) => {
      const ref = String(order?.reference ?? order?.invoice_number ?? '').toLowerCase();
      const customerName = String(order?.customer?.name ?? '').toLowerCase();
      return ref.includes(needle) || customerName.includes(needle);
    });
  }, [refundOrders, refundSearch]);

  const handleRefundOrder = async () => {
    if (!selectedRefundOrderId || isSubmittingRefund) return;
    try {
      setIsSubmittingRefund(true);
      await axiosInstance.put(`/orders/${selectedRefundOrderId}/refund`);
      showToast({
        description: t('VIEW_MODAL_RETURN_SUCCESS_DESC'),
        duration: 2200,
      });
      setIsRefundDialogOpen(false);
      setRefundSearch('');
      setSelectedRefundOrderId('');
      await fetchRefundableOrders();
    } catch {
      showToast({
        description: t('GENERAL_ERROR'),
        duration: 2500,
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  const handlePrintSelectedRefund = async () => {
    if (!selectedRefundOrderId || isPrintingRefund) return;
    try {
      setIsPrintingRefund(true);
      const response = await axiosInstance.get(
        `/orders?filter[id]=${selectedRefundOrderId}`,
        { timeout: 10000 }
      );
      const orderData =
        response?.data?.data?.[0] ??
        refundOrders.find((order) => String(order?.id || '') === selectedRefundOrderId);
      if (!orderData) {
        showToast({
          description: t('GENERAL_ERROR'),
          duration: 2200,
          variant: 'destructive',
        });
        return;
      }

      let invoiceIsoDate = new Date().toISOString();
      try {
        if (orderData?.business_date) {
          invoiceIsoDate = new Date(orderData.business_date).toISOString();
        }
      } catch {
        // keep default
      }

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
      const totalStr = Number(orderData?.total_price ?? 0).toFixed(2);
      const taxStr = Number(orderData?.total_taxes ?? 0).toFixed(2);
      const qrDataUrl = await resolveReceiptQrDataUrl({
        qrcodeRaw: String(orderData?.qrcode || ''),
        sellerName,
        vatNumber,
        invoiceIsoDate,
        totalAmount: totalStr,
        taxAmount: taxStr,
      });

      const ctx = buildReceiptCompanyContext(allSettings, settingsData);
      const input = mapApiOrderToReceiptInput(orderData, ctx, isArabic, qrDataUrl);
      const html = buildSimplifiedTaxInvoiceHtml(input);
      openAndPrintSimplifiedTaxInvoice(html);
    } catch {
      showToast({
        description: t('GENERAL_ERROR'),
        duration: 2500,
        variant: 'destructive',
      });
    } finally {
      setIsPrintingRefund(false);
    }
  };

  const formatRefundOrderDate = (order: RefundOrder) => {
    const raw = order?.business_date || order?.created_at;
    if (!raw) return '-';
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString(i18n.language?.startsWith('ar') ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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
              title: t('PAYMENT_SUMMARY'),
              description: t('TOUR_PAYMENT_SUMMARY_DESC'),
              side: 'left',
              align: 'start',
            },
          },
          {
            element: '#tour-payment-customer',
            popover: {
              title: t('CUSTOMER'),
              description: t('TOUR_PAYMENT_CUSTOMER_DESC'),
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#tour-payment-methods',
            popover: {
              title: t('PAYMENT_METHODS'),
              description: t('TOUR_PAYMENT_METHODS_DESC'),
              side: 'top',
              align: 'start',
            },
          },
          {
            element: '#tour-payment-numpad',
            popover: {
              title: t('NUMPAD'),
              description: t('TOUR_PAYMENT_NUMPAD_DESC'),
              side: 'top',
              align: 'start',
            },
          },
          {
            element: '#tour-payment-confirm',
            popover: {
              title: t('CONFIRM_PAYMENT'),
              description: t('TOUR_PAYMENT_CONFIRM_DESC'),
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
          <div
            ref={paidAmountPulseRef}
            className="pointer-events-none mt-8 text-[96px] font-bold leading-none tracking-tight text-[#0B132F] will-change-transform sm:text-[130px] lg:text-[170px]"
          >
            {paidInteger}
            <span className="text-[#7E8393]">.{paidDecimal}</span>
          </div>
          <div className="mx-auto mt-10 grid w-full max-w-[980px] grid-cols-2 gap-4 md:grid-cols-4">
            <Button
              type="button"
              variant="outline"
              className="h-16 rounded-xl text-lg font-semibold"
              disabled={isPreparingPrintQr}
              onClick={() => void handlePrintReceipt()}
            >
              {isPreparingPrintQr ? t('LOADING') : t('PRINT')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-16 rounded-xl text-lg font-semibold"
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
              className="h-16 rounded-xl text-lg font-semibold"
              onClick={() => void handleDownloadReceipt()}
            >
              {t('DOWNLOAD_RECEIPT')}
            </Button>
            <Button
              type="button"
              className="h-16 rounded-xl text-xl font-bold"
              onClick={handleContinueAfterCompletion}
            >
              {t('CONTINUE')}
            </Button>
          </div>
          {completedOrderData?.is_offline_order && (
            <div className="mt-4 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700">
              {isArabic
                ? 'محفوظ أوفلاين - بانتظار المزامنة'
                : 'Saved offline - pending sync'}
            </div>
          )}
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
        {shortcutsHelpModal}
      </div>
    );
  }


  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="fixed inset-0 z-50 flex h-full w-full flex-col overflow-hidden bg-background md:flex-row md:flex-nowrap">
      {/* Left Panel: Cart Summary (Consistent with POS Main) */}
      <div className="flex w-full shrink-0 flex-col border-b border-mainBorder bg-background md:h-full md:w-[300px] md:border-b-0 md:border-e lg:w-[340px] xl:w-[380px]">
        {/* Header */}
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-mainBorder bg-white px-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img src={SH_LOGO} alt="Logo" className="h-8 w-auto object-contain" />
            <span className="text-sm font-semibold text-mainText hidden sm:block">
              {t('CART_ITEMS')}
            </span>
            <span className="rounded-full bg-main/10 px-2 py-0.5 text-xs font-bold text-main">
              {cardItemValue.length}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden p-2">
          {/* Cart Items List */}
          <div className="flex-1 space-y-2 overflow-y-auto">
            {cardItemValue.length === 0 ? (
              <div className="flex h-full items-center justify-center text-secText/50">
                {t('CART_EMPTY')}
              </div>
            ) : (
              cardItemValue.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-mainBorder bg-white p-3 shadow-sm"
                >
                  <div className="flex-1">
                    <div className="font-medium text-mainText">{item.name}</div>
                    <div className="text-xs text-secText">
                      {item.qty} x {formatNumber(item.price || 0)}
                      {Number(item.discount_amount) > 0 && (
                        <span className="mx-1 rounded bg-emerald-50 px-1 text-[10px] font-bold text-emerald-600">
                          -{formatNumber(item.discount_amount)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="font-bold text-mainText">
                      <CurrencyAmount
                        value={
                          Number(item.price || 0) * Number(item.qty || 0) -
                          Number(item.discount_amount || 0) * Number(item.qty || 0)
                        }
                      />
                    </div>
                    {Number(item.discount_amount) > 0 && (
                      <div className="text-[10px] text-secText line-through decoration-red-400">
                        <CurrencyAmount
                          value={Number(item.price || 0) * Number(item.qty || 0)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Area: Totals & Back Button */}
          <div className="mt-auto border-t border-mainBorder p-4 bg-white">
            {/* Compact Totals */}
            <div className="mb-4 space-y-1.5 px-1">
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>{t('SUBTOTAL')}</span>
                <span>
                  <CurrencyAmount value={totals.subtotal} />
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>{t('DISCOUNT')}</span>
                <span>
                  <CurrencyAmount value={orderSchema?.discount_amount || 0} />
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>{t('TAX')}</span>
                <span>
                  <CurrencyAmount value={totals.tax} />
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-mainText pt-2 border-t border-dashed border-gray-200">
                <span>{t('TOTAL')}</span>
                <span>
                  <CurrencyAmount value={totals.total} />
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate('/zood-dashboard/individual-invoices/add')}
              className="w-full h-12 text-base font-semibold text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300"
            >
              <LogOut className={`h-5 w-5 me-2 ${isRtl ? '' : 'rotate-180'}`} />
              {t('RETURN')}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel: Payment Controls (Consistent with POS Main Right Area) */}
      <div className="flex h-full flex-1 flex-col overflow-hidden bg-gray-50/50">
        {/* Header */}
        <div className="z-10 flex w-full flex-col border-b border-mainBorder bg-white shadow-sm h-[60px] justify-center">
          <div className="flex items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-mainText">
                {t('PAYMENT')}
              </span>
              <OfflineSyncStatusPill
                isOnline={isOnline}
                pendingCount={pendingCount}
                failedCount={failedCount}
              />
            </div>
            <div className="flex items-center gap-2">
              {canRefund && (
                <Button
                  variant="outline"
                  className="h-8 border-destructive/30 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setIsRefundDialogOpen(true)}
                >
                  <RotateCcw className="me-1 h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">{t('POS_REFUND')}</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/zood-dashboard/individual-invoices/add')}
                className="h-8 w-8 text-secText hover:bg-destructive/10 hover:text-destructive"
                title={t('RETURN')}
              >
                <LogOut className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Button>
              <div className="hidden h-6 w-[1px] bg-gray-200 sm:block" />
              <Button
                variant="ghost"
                size="icon"
                onClick={startPaymentTour}
                className="h-8 w-8 text-secText hover:bg-main/10 hover:text-main"
                title={t('HELP_TOUR')}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShortcutsHelpOpen(true)}
                className="h-8 w-8 text-secText hover:bg-main/10 hover:text-main"
                title="F1"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Content Area */}
        <div className="flex-1 overflow-hidden bg-[#F8F9FD] p-6">
          <div className="mx-auto grid h-full max-w-5xl gap-6 md:grid-cols-12">
            
            {/* Right Column (Inputs) - Order 1 in source, Right in RTL */}
            <div className="flex h-full flex-col gap-4 md:col-span-8">
              {/* 1. Customer Selection */}
              <div className="shrink-0 rounded-xl border border-gray-100 bg-white p-1 shadow-sm" id="tour-payment-customer">
                <CustomSearchInbox
                  options={allCustomerOptions}
                  placeholder="CUSTOMER_NAME"
                  onValueChange={(value: string) =>
                    dispatch(updateField({ field: 'customer_id', value }))
                  }
                  className="h-[50px] w-full"
                  triggerClassName="h-[50px] w-full border-0 bg-transparent text-lg font-medium px-4 focus:ring-0"
                  value={selectedCustomerId}
                  directValue={selectedCustomerName}
                  footerActions={[
                    {
                      id: 'create-customer',
                      label: (
                        <div className="flex items-center justify-center gap-1">
                          <Plus className="h-4 w-4" />
                          <span>{t('ADD_CUSTOMER')}</span>
                        </div>
                      ),
                      className:
                        'bg-main/5 border-main/20 text-main hover:bg-main/10 font-medium py-3',
                      onClick: openCreateCustomerDialog,
                    },
                    {
                      id: 'edit-customer',
                      label: (
                        <div className="flex items-center justify-center gap-1">
                          <Pencil className="h-4 w-4" />
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
                          <X className="h-4 w-4" />
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

              {/* 2. Payment Methods - Scrollable Area */}
                <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4" id="tour-payment-methods">
                  {paymentMethodsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[80px] animate-pulse rounded-xl border border-gray-100 bg-gray-100"
                      />
                    ))
                  ) : (
                  paymentMethodsData?.data?.map((method: any, index: number) => {
                    const isActive = activePaymentMethodId === method.id;
                    const styleIndex = index % 6; // We have 6 color variants
                    
                    const colorStyles = [
                      { active: 'bg-purple-600 text-white border-purple-600 ring-purple-200', inactive: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
                      { active: 'bg-blue-600 text-white border-blue-600 ring-blue-200', inactive: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
                      { active: 'bg-emerald-600 text-white border-emerald-600 ring-emerald-200', inactive: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
                      { active: 'bg-amber-600 text-white border-amber-600 ring-amber-200', inactive: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
                      { active: 'bg-rose-600 text-white border-rose-600 ring-rose-200', inactive: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
                      { active: 'bg-indigo-600 text-white border-indigo-600 ring-indigo-200', inactive: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' },
                    ][styleIndex];

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => selectPaymentMethod(method)}
                        className={`flex h-[80px] items-center justify-center rounded-xl border text-base font-semibold transition-all shadow-sm active:scale-95 ${
                          isActive
                            ? `${colorStyles.active} ring-2 ring-offset-1`
                            : `${colorStyles.inactive} hover:border-transparent`
                        }`}
                      >
                        <span className="line-clamp-1 px-2">{method.name}</span>
                      </button>
                    );
                  })
                  )}
                </div>
              </div>

              {/* 3. Numpad */}
              <div className="mt-auto grid shrink-0 grid-cols-4 gap-4" id="tour-payment-numpad" dir="ltr">
                {['1', '2', '3', '+10', '4', '5', '6', '+20', '7', '8', '9', '+50', '.', '0', 'C', '⌫'].map(
                  (key) => {
                    const isQuickAction = ['+10', '+20', '+50'].includes(key);
                    const isAction = ['C', '⌫'].includes(key);
                    const isDelete = key === '⌫';
                    const isClear = key === 'C';
                    
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (key === '⌫') return backspaceAmount();
                          if (key === 'C') {
                            setDraftValue('0');
                            upsertActivePayment(0);
                            return;
                          }
                          if (key === '+10') return addQuickAmount(10);
                          if (key === '+20') return addQuickAmount(20);
                          if (key === '+50') return addQuickAmount(50);
                          appendDigit(key);
                        }}
                        className={`flex h-[80px] items-center justify-center rounded-xl text-2xl font-bold shadow-sm transition-all active:scale-95 border ${
                          isDelete
                            ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                            : isClear
                            ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'
                            : isQuickAction
                            ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 text-xl'
                            : 'bg-white border-gray-100 text-gray-800 hover:border-main/30'
                        }`}
                      >
                        {isDelete ? <X className="h-8 w-8" /> : key}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Left Column (Amount & Confirm) - Order 2 in source, Left in RTL */}
            <div className="flex h-full flex-col gap-4 md:col-span-4">
              {/* Amount Box */}
              <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {/* Main Amount */}
                  <div className="flex shrink-0 flex-col items-center justify-center p-6 text-center">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{t('TOTAL')}</div>
                    <div className="text-[5rem] font-bold text-[#5D5FEF] leading-none tracking-tighter">
                      {formatNumber(totals.total)}
                    </div>
                  </div>

                  {/* Stats Footer */}
                  <div className="bg-gray-50 border-t border-gray-100">
                    <div className="grid grid-cols-3 divide-x divide-gray-200 divide-x-reverse">
                        {/* Paid */}
                        <div className="flex flex-col items-center justify-center p-3">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase mb-1">{t('PAID')}</span>
                          <span className="text-base font-bold text-emerald-600" dir="ltr">{formatNumber(totalPaid)}</span>
                        </div>
                        {/* Remaining */}
                        <div className="flex flex-col items-center justify-center p-3">
                          <span className="text-[10px] font-bold text-red-500 uppercase mb-1">{t('REMAINING')}</span>
                          <span className="text-base font-bold text-red-500" dir="ltr">{formatNumber(remaining)}</span>
                        </div>
                        {/* Change */}
                        <div className="flex flex-col items-center justify-center p-3">
                          <span className="text-[10px] font-bold text-blue-600 uppercase mb-1">{t('CHANGE')}</span>
                          <span className="text-base font-bold text-blue-600" dir="ltr">{formatNumber(change)}</span>
                        </div>
                    </div>
                  </div>
                  
                  {/* Partial Payments List */}
                  {payments.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/50 p-4 overflow-y-auto max-h-[385px]">
                        {payments.map((p, i) => (
                          <div key={i} className="flex shrink-0 items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-3 shadow-sm">
                              <span className="font-semibold text-gray-700">{p.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900" dir="ltr">{formatNumber(p.amount)}</span>
                                <button 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setPayments(prev => prev.filter((_, idx) => idx !== i));
                                  }}
                                  className="rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                  title={t('DELETE')}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                              </div>
                          </div>
                        ))}
                    </div>
                  )}
              </div>
              
              {/* Confirm Button */}
              <Button
                id="tour-payment-confirm"
                className="h-[80px] w-full rounded-2xl bg-[#5D5FEF] text-2xl font-bold text-white shadow-lg shadow-indigo-200 hover:bg-[#4B4DDB] active:scale-[0.98] transition-transform"
                onClick={submitOrder}
                loading={loading}
              >
                {loading ? t('POS_FINALIZING_INVOICE') : t('CONFIRM_PAYMENT')}
              </Button>
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
      {isRefundDialogOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-mainBorder bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-mainText">{t('POS_REFUND_TITLE')}</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setIsRefundDialogOpen(false);
                  setRefundSearch('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-3">
              <Input
                value={refundSearch}
                onChange={(e) => setRefundSearch(e.target.value)}
                placeholder={t('POS_REFUND_SEARCH_PLACEHOLDER')}
                className="h-11"
              />
            </div>
            <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-xl border border-mainBorder bg-gray-50/40 p-2">
              {isLoadingRefundOrders ? (
                <div className="py-14 text-center text-sm text-secText">{t('LOADING')}</div>
              ) : filteredRefundOrders.length === 0 ? (
                <div className="py-14 text-center text-sm text-secText">
                  {t('POS_REFUND_EMPTY')}
                </div>
              ) : (
                filteredRefundOrders.map((order) => {
                  const orderId = String(order?.id || '');
                  const isSelected = selectedRefundOrderId === orderId;
                  const isRefunded = Boolean(order?.return_reason);
                  const ref =
                    order?.reference || order?.invoice_number || String(order?.id || '-');
                  return (
                    <button
                      key={orderId}
                      type="button"
                      onClick={() => {
                        if (isRefunded) return;
                        setSelectedRefundOrderId(orderId);
                      }}
                      className={`w-full rounded-xl border px-4 py-3 text-start transition-colors ${
                        isRefunded
                          ? 'cursor-not-allowed border-amber-200 bg-amber-50/70'
                          : isSelected
                          ? 'border-destructive/60 bg-destructive/5'
                          : 'border-mainBorder bg-white hover:border-main/30'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-mainText">{ref}</span>
                          {isRefunded && (
                            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                              {t('RETURN_PAYMENT')}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-secText">
                          {formatRefundOrderDate(order)}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="text-secText">
                          {order?.customer?.name || t('CUSTOMER')}
                        </span>
                        <span className="font-bold text-mainText" dir="ltr">
                          <CurrencyAmount value={order?.total_price || 0} />
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsRefundDialogOpen(false);
                  setRefundSearch('');
                }}
              >
                {t('CANCEL')}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={
                  !selectedRefundOrderId ||
                  isPrintingRefund ||
                  isLoadingRefundOrders ||
                  isSubmittingRefund
                }
                loading={isPrintingRefund}
                onClick={() => void handlePrintSelectedRefund()}
              >
                {isPrintingRefund ? t('LOADING') : t('PRINT')}
              </Button>
              <Button
                type="button"
                className="bg-destructive text-white hover:bg-destructive/90"
                disabled={
                  !selectedRefundOrderId ||
                  isSubmittingRefund ||
                  isLoadingRefundOrders ||
                  Boolean(
                    refundOrders.find(
                      (item) => String(item?.id || '') === selectedRefundOrderId
                    )?.return_reason
                  )
                }
                loading={isSubmittingRefund}
                onClick={() => void handleRefundOrder()}
              >
                {isSubmittingRefund ? t('POS_REFUNDING') : t('POS_REFUND_CONFIRM')}
              </Button>
            </div>
          </div>
        </div>
      )}
      {shortcutsHelpModal}
    </div>
  );
}
