import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { IndividualInvoicesAddProps } from './IndividualInvoicesAdd.types';

import './IndividualInvoicesAdd.css';
import { useTranslation } from 'react-i18next';
import { CardItem } from '@/components/CardItem';
import { useDispatch, useSelector, useStore } from 'react-redux';
import ConfirmBk from '@/components/custom/ConfimBk';
import { resetOrder, updateField } from '@/store/slices/orderSchema';
import { CardGridSkeleton } from '@/components/CardItem/components/CardGridSkeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/interceptors';
import { Input } from '@/components/ui/input';
import { setCardItem } from '@/store/slices/cardItems';
import { useToast } from '@/components/custom/useToastComp';
import { Button } from '@/components/custom/button';
import { useNavigate } from 'react-router-dom';
import createCrudService from '@/api/services/crudService';
import CustomSearchInbox from '@/components/custom/CustomSearchInbox';
import {
  AlertDialogComp,
  AlertDialogContentComp,
  AlertDialogDescriptionComp,
  AlertDialogTitleComp,
} from '@/components/ui/alert-dialog2';
import XIcons from '@/components/Icons/XIcons';
import {
  ShoppingBasket,
  ScanBarcode,
  Search,
  LogOut,
  PauseCircle,
  PlayCircle,
  Trash2,
  Tag,
  Plus,
  Pencil,
  X,
  HelpCircle,
  Keyboard,
  RotateCcw,
  Lock,
  Delete,
  Image as ImageIcon,
  Layers,
  Percent,
  RefreshCw,
} from 'lucide-react';
import PinLoginScreen from '../components/PinLoginScreen';
import SH_LOGO from '@/assets/SH_LOGO.svg';
import Cookies from 'js-cookie';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineOrdersSummary } from '@/hooks/useOfflineOrdersSummary';
import OfflineSyncStatusPill from '@/components/custom/OfflineSyncStatusPill';
import {
  getIndexedProductByBarcode,
  getLocalCatalogProductCount,
  syncCatalogIndexIfDue,
  upsertProductIndexFromApiProducts,
} from '@/lib/offline/catalogIndex';
import {
  buildReceiptCompanyContext,
  buildSimplifiedTaxInvoiceHtml,
  mapApiOrderToReceiptInput,
  openAndPrintSimplifiedTaxInvoice,
  resolveReceiptQrDataUrl,
  warmupQzTrayConnection,
} from '@/utils/simplifiedTaxInvoiceReceipt';
import { formatNumber } from '@/utils/numberFormat';
import CurrencyAmount from '@/components/custom/CurrencyAmount';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { isRefundOrderInDateRange } from '@/utils/ordersBusinessDateQuery';

const { RangePicker } = DatePicker;

const CATEGORY_COLOR_PALETTE = [
  { bg: '#BDEAE8', border: '#A2D7D4', activeBg: '#A6D9D5', activeBorder: '#86C6C1' },
  { bg: '#EBCBA3', border: '#DCB686', activeBg: '#E1BC8E', activeBorder: '#D3A96F' },
  { bg: '#BFE3C1', border: '#A1CFA3', activeBg: '#A9D3AC', activeBorder: '#89BE8D' },
  { bg: '#E9A7A7', border: '#D98F8F', activeBg: '#DE9595', activeBorder: '#CC7474' },
  { bg: '#C7D7F0', border: '#ACBFDF', activeBg: '#B4C8E8', activeBorder: '#96ADD5' },
  { bg: '#E4C8EB', border: '#D3ADDC', activeBg: '#D9B6E2', activeBorder: '#C595D2' },
] as const;

const CATEGORY_TEXT_COLOR = '#1D2735';
const POS_LAST_SYNCED_ROWS_KEY = 'pos_last_synced_rows_v1';
const POS_CATALOG_SYNC_ACTIVE_KEY = 'pos_catalog_sync_active_v1';
const posAutoCatalogWarmSessionKey = (branchKey: string) =>
  `pos_auto_catalog_warm_v1_${branchKey || 'default'}`;
const POS_BARCODE_NAME_FALLBACK_KEY = 'pos_barcode_name_fallback_enabled_v1';
const POS_ACTIVE_TAB_KEY = 'pos_active_tab_v1';
const POS_TAB_LOCK_TTL_MS = 10000;

type RefundOrder = {
  id: string;
  reference?: string;
  invoice_number?: string;
  total_price?: number;
  business_date?: string;
  created_at?: string;
  return_reason?: string | null;
  customer?: { name?: string };
  branch_id?: string;
  branch?: { id?: string };
};

type QuickProductForm = {
  name: string;
  sku: string;
  price: string;
  quantity: string;
  category_id: string;
};

const getCategoryStyle = (category: string) => {
  if (category === 'all') {
    return {
      bg: '#EEF2F7',
      border: '#D4DDE8',
      activeBg: '#DDE7F4',
      activeBorder: '#B8C8DE',
    };
  }

  const normalized = category.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
  }

  return CATEGORY_COLOR_PALETTE[hash % CATEGORY_COLOR_PALETTE.length];
};

export const IndividualInvoicesAdd: React.FC<
  IndividualInvoicesAddProps
> = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [discountValue, setDiscountValue] = useState<string>('0');
  // const [discountAmount, setDiscountAmount] = useState(0); // Deprecated in favor of calculated
  const [activeCategory, setActiveCategory] = useState('all');
  const [lastScanStatus, setLastScanStatus] = useState<
    'ready' | 'scanning' | 'success' | 'error'
  >('ready');
  const [lastScanMessage, setLastScanMessage] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [parkedOrders, setParkedOrders] = useState<any[]>([]);
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isEditTagMode, setIsEditTagMode] = useState(false);
  const [editingTagId, setEditingTagId] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [isEditCustomerMode, setIsEditCustomerMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState('');
  const [isCatalogSyncing, setIsCatalogSyncing] = useState(false);
  const [catalogSyncProgress, setCatalogSyncProgress] = useState<{
    currentPage: number;
    totalPages: number;
    fetchedRows: number;
    syncedRows: number;
  } | null>(null);
  const [lastSyncedRows, setLastSyncedRows] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(POS_LAST_SYNCED_ROWS_KEY);
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  });
  const [catalogSyncInterrupted, setCatalogSyncInterrupted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(POS_CATALOG_SYNC_ACTIVE_KEY) === '1';
  });
  const [localCatalogCount, setLocalCatalogCount] = useState<number | null>(null);
  const [barcodeNameFallbackEnabled, setBarcodeNameFallbackEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(POS_BARCODE_NAME_FALLBACK_KEY) === '1';
  });
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isLoadingRefundOrders, setIsLoadingRefundOrders] = useState(false);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [isPrintingRefund, setIsPrintingRefund] = useState(false);
  const [refundOrdersRaw, setRefundOrdersRaw] = useState<RefundOrder[]>([]);
  const [refundSearch, setRefundSearch] = useState('');
  const [refundDateRange, setRefundDateRange] = useState<[Dayjs, Dayjs]>(() => [
    dayjs(),
    dayjs(),
  ]);
  const [selectedRefundOrderId, setSelectedRefundOrderId] = useState('');
  const [isPosLockedByAnotherTab, setIsPosLockedByAnotherTab] = useState(false);
  const [barcodeSuggestion, setBarcodeSuggestion] = useState<{
    open: boolean;
    barcode: string;
  }>({ open: false, barcode: '' });
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isBarcodeLookupLoading, setIsBarcodeLookupLoading] = useState(false);
  const [barcodeLookupStatus, setBarcodeLookupStatus] = useState<
    'idle' | 'loading' | 'success' | 'not_found' | 'error'
  >('idle');
  const [barcodeLookupMessage, setBarcodeLookupMessage] = useState('');
  const [quickProductImage, setQuickProductImage] = useState<File | null>(null);
  const [quickProductImageLookupUrl, setQuickProductImageLookupUrl] = useState('');
  const [quickProductImagePreview, setQuickProductImagePreview] = useState('');
  const [quickProductForm, setQuickProductForm] = useState<QuickProductForm>({
    name: '',
    sku: '',
    price: '',
    quantity: '1',
    category_id: '',
  });
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    tax_registration_number: '',
    vat_registration_number: '',
  });
  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const orderSchema = useSelector((state: any) => state.orderSchema);
  const allSettings = useSelector((state: any) => state.allSettings?.value);
  const currentCashier = useSelector((state: any) => state.posCashier?.currentCashier);
  const branchId = orderSchema?.branch_id || Cookies.get('branch_id') || '';
  const refundBranchIdRef = useRef('');
  refundBranchIdRef.current = String(branchId || '').trim();
  const parkedOrdersKey = `pos_parked_orders_v1_${branchId || 'default'}`;
  const currentCartKey = `pos_current_cart_v1_${branchId || 'default'}`;
  const selectedCustomerId = orderSchema?.customer_id;
  const [selectedCartItemId, setSelectedCartItemId] = useState<string | null>(null);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { showToast } = useToast();
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;
  const tRef = useRef(t);
  tRef.current = t;
  const { isOnline } = useNetworkStatus();
  const { pendingCount, failedCount } = useOfflineOrdersSummary();
  const queryClient = useQueryClient();
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

  const refreshLocalCatalogCount = useCallback(async () => {
    try {
      const n = await getLocalCatalogProductCount();
      setLocalCatalogCount(n);
    } catch {
      setLocalCatalogCount(0);
    }
  }, []);

  useEffect(() => {
    void refreshLocalCatalogCount();
  }, [branchId, refreshLocalCatalogCount]);

  useEffect(() => {
    if (isCatalogSyncing) return;
    void refreshLocalCatalogCount();
  }, [isCatalogSyncing, refreshLocalCatalogCount]);

  // Prefetch payment methods so they appear instantly on the payment page
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['manage/payment_methods?filter[is_active]=1', {}],
      queryFn: async () => {
        const res = await axiosInstance.get('manage/payment_methods?filter[is_active]=1');
        return res.data;
      },
    });
  }, [queryClient]);

  useEffect(() => {
    void warmupQzTrayConnection().catch(() => {});
  }, []);

  useEffect(() => {
    void syncCatalogIndexIfDue();
  }, []);

  useEffect(() => {
    if (orderSchema?.discount_amount) {
      setDiscountValue(String(orderSchema.discount_amount));
      setDiscountType('fixed');
    }
  }, []); // Run only on mount to restore from Redux if available

  const { data: tagsData } = createCrudService<any>(
    'manage/tags?perPage=100'
  ).useGetAll();
  const [extraTags, setExtraTags] = useState<{ value: string; label: string }[]>([]);

  const tagOptions = useMemo(() => {
    const list = tagsData?.data;
    if (!Array.isArray(list)) return [];
    return list
      .map((item: any) => ({
        value: String(item?.id ?? ''),
        label: item?.name ?? item?.name_ar ?? item?.name_en ?? String(item?.id ?? ''),
      }))
      .filter((o: { value: string }) => o.value);
  }, [tagsData?.data]);

  const allTagOptions = useMemo(
    () => [...tagOptions, ...extraTags],
    [tagOptions, extraTags]
  );

  const scannerBufferRef = useRef('');
  const posTabIdRef = useRef(
    `pos-tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
  const scannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoLookupAttemptedSkuRef = useRef('');
  const quickProductImageInputRef = useRef<HTMLInputElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const cartListRef = useRef<HTMLDivElement | null>(null);
  const prevCartIdsRef = useRef<string[]>([]);
  const barcodeCacheRef = useRef<Map<string, any>>(new Map());
  const notFoundBarcodeCacheRef = useRef<Map<string, number>>(new Map());
  const barcodeQueueRef = useRef<string[]>([]);
  const pendingCountByBarcodeRef = useRef<Map<string, number>>(new Map());
  const rawBarcodeByKeyRef = useRef<Map<string, string>>(new Map());
  const productSearchInputRef = useRef<HTMLInputElement | null>(null);
  const barcodeInputRef = useRef<HTMLInputElement | null>(null);
  const parsedScaleBarcodeMetaRef = useRef<
    Map<
      string,
      {
        lookupCandidates: string[];
        plu: string;
        quantityPerScan: number | null;
        encodedPrice: number | null;
      }
    >
  >(new Map());
  const inFlightBarcodesRef = useRef<Set<string>>(new Set());
  const activeRequestsRef = useRef(0);
  const lastEnqueuedScanRef = useRef<{ key: string; at: number }>({
    key: '',
    at: 0,
  });
  const PAGE_SIZE = 50;
  const MAX_CONCURRENT_SCANS = 3;
  const SCAN_REQUEST_TIMEOUT_MS = 1500;
  const NOT_FOUND_CACHE_TTL_MS = 15000;
  const store = useStore<any>();
  const navigate = useNavigate();
  const cartItemsCount = cardItemValue.reduce(
    (acc: number, item: any) => acc + Number(item?.qty || 0),
    0
  );
  const cartTotal = cardItemValue.reduce(
    (acc: number, item: any) =>
      acc + (Number(item?.price || 0) * Number(item?.qty || 0) - (Number(item?.discount_amount || 0) * Number(item?.qty || 0))),
    0
  );
  const { data: settingsData } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: taxesData } = createCrudService<any>('manage/taxes').useGetAll();
  const vatRate = Number(taxesData?.data?.[0]?.rate || 15);
  const isTaxInclusive = Boolean(settingsData?.data?.tax_inclusive_pricing);
  
  const dispatch = useDispatch();

  const subtotalAmountBeforeDiscount = useMemo(() => {
    return cardItemValue.reduce((acc: number, item: any) => {
        const itemTotal = (Number(item.price || 0) * Number(item.qty || 0)) - 
                          (Number(item.discount_amount || 0) * Number(item.qty || 0));
        return acc + itemTotal;
    }, 0);
  }, [cardItemValue]);

  // Use discountAmount from the memoized calculation
  // const [discountAmount, setDiscountAmount] = useState(0); // This was causing the conflict/error because it was commented out but referred to.
  // Re-declared to satisfy linter if needed, but logic uses the memoized variable above.
  
  const discountAmount = useMemo(() => {
      const base = isTaxInclusive
        ? subtotalAmountBeforeDiscount
        : subtotalAmountBeforeDiscount; // Logic depends on tax settings, simplifying for now
      
      const val = Number(discountValue || 0);
      if (val <= 0) return 0;

      let calculated = 0;
      if (discountType === 'percent') {
          calculated = (base * val) / 100;
      } else {
          calculated = val;
      }
      return Math.min(calculated, base);
  }, [subtotalAmountBeforeDiscount, discountValue, discountType, isTaxInclusive]);

  // Sync to Redux
  useEffect(() => {
      if(dispatch) {
        dispatch(updateField({ field: 'discount_amount', value: discountAmount }));
      }
  }, [discountAmount, dispatch]);

  const subtotalAmount = useMemo(() => {
    const sub = isTaxInclusive
      ? (subtotalAmountBeforeDiscount - discountAmount) / (1 + vatRate / 100)
      : subtotalAmountBeforeDiscount - discountAmount;
    return Math.max(0, sub);
  }, [subtotalAmountBeforeDiscount, discountAmount, isTaxInclusive, vatRate]);
  const vatAmount = subtotalAmount * (vatRate / 100);
  const grandTotal = subtotalAmount + vatAmount;
  const visibleProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(
      (product: any) => String(product?.category?.id) === activeCategory
    );
  }, [activeCategory, products]);

  const { data: categoriesData } = createCrudService<any>(
    'menu/categories?not_default=1&per_page=1000'
  ).useGetAll();

  const categoryOptions = useMemo(() => {
    // Priority: Use fetched categories
    if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      return [
        { id: 'all', name: 'all' },
        ...categoriesData.data.map((cat: any) => ({
          id: String(cat.id),
          name: cat.name || cat.name_en || '',
        })),
      ];
    }

    // Fallback: Extract from loaded products (only useful if full list loaded)
    const map = new Map<string, string>();
    products.forEach((product: any) => {
      const catId = String(product?.category?.id || '');
      const catName =
        product?.category?.name ||
        product?.category_name ||
        product?.category?.name_en ||
        '';
      if (catId && catName) {
        map.set(catId, catName);
      }
    });
    return [
      { id: 'all', name: 'all' },
      ...Array.from(map.entries()).map(([id, name]) => ({ id, name })),
    ];
  }, [products, categoriesData]);
  const productCategoryOptions = useMemo(
    () => categoryOptions.filter((category: any) => category.id !== 'all'),
    [categoryOptions]
  );

  // Prefetch 50 products from each category in background for instant category switching
  const MAX_CATEGORIES_TO_PREFETCH = 15;
  const PRODUCTS_PER_CATEGORY = 50;
  useEffect(() => {
    const categories = categoriesData?.data;
    if (!Array.isArray(categories) || categories.length === 0) return;
    const categoryIds = categories
      .slice(0, MAX_CATEGORIES_TO_PREFETCH)
      .map((cat: any) => String(cat.id))
      .filter(Boolean);
    categoryIds.forEach((catId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['individual-invoices-products', '', 1, catId],
        queryFn: async () => {
          const res = await axiosInstance.get('menu/products', {
            params: {
              not_default: 1,
              per_page: PRODUCTS_PER_CATEGORY,
              page: 1,
              sort: '-created_at',
              'filter[category_id]': catId,
            },
          });
          return res.data;
        },
        staleTime: 1000 * 60 * 5,
      });
    });
  }, [categoriesData?.data, queryClient]);

  const { data: customersData } = createCrudService<any>(
    'manage/customers?perPage=100000'
  ).useGetAll();

  const [extraCustomers, setExtraCustomers] = useState<
    { value: string; label: string }[]
  >([]);

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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['individual-invoices-products', debouncedSearch, page, activeCategory],
    queryFn: async () => {
      // Smart Loading Strategy:
      // 1. "All" view: Load small chunks (50) for fast initial render.
      // 2. Specific Category: Load larger chunks (200) to show most items immediately without scrolling.
      const dynamicPageSize = activeCategory === 'all' ? 50 : 200;

      const params: any = {
        not_default: 1,
        per_page: dynamicPageSize,
        sort: '-created_at',
        page,
        ...(debouncedSearch ? { 'filter[name]': debouncedSearch } : {}),
        ...(activeCategory !== 'all' ? { 'filter[category_id]': activeCategory } : {}),
      };
      const response = await axiosInstance.get('menu/products', { params });
      return response.data;
    },
    // Smart Caching:
    // Keep data fresh for 5 minutes. Switching between categories will be instant (from memory).
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,
  });


  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, hasMore]
  );

  const startTour = useCallback(async () => {
    try {
      // Dynamic import to prevent loading issues
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
            element: '#tour-categories',
            popover: {
              title: 'الفئات (Categories)',
              description: 'أصبحت الفئات ملونة دائماً لسهولة التمييز والوصول السريع.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#tour-products',
            popover: {
              title: 'المنتجات (Products)',
              description: 'اضغط على أي منتج لإضافته للسلة مباشرة.',
              side: 'left',
              align: 'start',
            },
          },
          {
            element: '#tour-customer',
            popover: {
              title: 'العميل (Customer)',
              description: 'يمكنك اختيار العميل أو إضافته من هنا بسرعة.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#tour-cart-list',
            popover: {
              title: 'التحكم بالسلة (Cart Controls)',
              description: 'مهم جداً: اضغط على أي منتج داخل السلة لتظهر لك خيارات تعديل الكمية والحذف.',
              side: 'right',
              align: 'start',
            },
          },
          {
            element: '#tour-payment',
            popover: {
              title: 'الدفع (Payment)',
              description: 'اضغط هنا لإنهاء الطلب والانتقال للدفع.',
              side: 'top',
              align: 'start',
            },
          },
        ],
        onDestroyed: () => {
          localStorage.setItem('has_seen_pos_tour_v2', 'true');
        },
      });
      driverObj.drive();
    } catch (error) {
      console.error('Failed to load tour driver:', error);
    }
  }, []);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('has_seen_pos_tour_v2');
    if (!hasSeenTour) {
      // Delay to ensure elements are rendered
      const timer = setTimeout(() => {
        startTour();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(parkedOrdersKey);
      if (!saved) {
        setParkedOrders([]);
        return;
      }
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setParkedOrders(parsed);
      } else {
        setParkedOrders([]);
      }
    } catch {
      setParkedOrders([]);
    }
  }, [parkedOrdersKey]);
  useEffect(() => {
    window.localStorage.setItem(parkedOrdersKey, JSON.stringify(parkedOrders));
    // parkedOrdersKey intentionally omitted: when branch changes, load effect updates parkedOrders first; save runs on next render with correct key
  }, [parkedOrders]); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore cart from localStorage FIRST on mount (before save overwrites it)
  const hasRestoredCartRef = useRef(false);
  useEffect(() => {
    if (hasRestoredCartRef.current || cardItemValue.length > 0) return;
    hasRestoredCartRef.current = true;
    try {
      const saved = window.localStorage.getItem(currentCartKey);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        dispatch(setCardItem(parsed));
      }
    } catch {
      // ignore parse errors
    }
  }, [currentCartKey, cardItemValue.length, dispatch]);

  // Persist current cart to localStorage - skip first run to avoid overwriting before restore
  const isFirstSaveRef = useRef(true);
  useEffect(() => {
    if (isFirstSaveRef.current) {
      isFirstSaveRef.current = false;
      return;
    }
    if (Array.isArray(cardItemValue)) {
      try {
        window.localStorage.setItem(currentCartKey, JSON.stringify(cardItemValue));
      } catch {
        // ignore quota or parse errors
      }
    }
  }, [cardItemValue, currentCartKey]);
  useEffect(() => {
    dispatch(
      updateField({
        field: 'discount_amount',
        value: Number(discountAmount.toFixed(2)),
      })
    );
  }, [discountAmount, dispatch]);

  const addOrIncrementCardItem = useCallback(
    (product: any, incrementBy = 1) => {
      const latestCardItems = store.getState()?.cardItems?.value || [];
      const existingItem = latestCardItems.find(
        (cartItem: { id: string }) => cartItem.id === product.id
      );

      const resolvedStock =
        product.quantity ?? product.stock_quantity ?? product.available_quantity;

      if (existingItem) {
        const updatedItems = latestCardItems.map((cartItem: any) =>
          cartItem.id === product.id
            ? {
                ...cartItem,
                qty: Number(cartItem.qty || 0) + incrementBy,
                category_id:
                  cartItem.category_id ??
                  product?.category_id ??
                  product?.category?.id ??
                  '',
                category_name:
                  cartItem.category_name ??
                  product?.category_name ??
                  product?.category?.name ??
                  '',
                stock_quantity:
                  resolvedStock !== undefined && resolvedStock !== null
                    ? resolvedStock
                    : cartItem.stock_quantity,
              }
            : cartItem
        );
        dispatch(setCardItem(updatedItems));
        return;
      }

      dispatch(
        setCardItem([
          ...latestCardItems,
          {
            id: product.id,
            name: product.name,
            image: product.image || product.images || '',
            price: Number(product.price || 0),
            qty: incrementBy,
            discount_value: 0,
            discount_type: 'fixed',
            discount_amount: 0,
            category_id:
              product?.category_id ??
              product?.category?.id ??
              '',
            category_name:
              product?.category_name ??
              product?.category?.name ??
              '',
            ...(resolvedStock !== undefined && resolvedStock !== null
              ? { stock_quantity: resolvedStock }
              : {}),
          },
        ])
      );
    },
    [dispatch, store]
  );

  // Deprecated in favor of modal editing, keeping for compatibility if needed
  const updateCartItemDiscount = (id: string, value: string, type: 'fixed' | 'percent') => {
    // ... logic moved to modal
  };

  // Numpad Logic for Item Edit
  const handleNumpadInput = (key: string) => {
    if (!editingItem) return;

    const targetField = editingItem._activeField || 'qty';
    const isDiscountValue = targetField === 'discount_value';
    const isPriceValue = targetField === 'price';
    const rawField = editingItem[targetField];
    const currentValue =
      isDiscountValue || isPriceValue
        ? rawField === undefined || rawField === null || rawField === ''
          ? ''
          : String(rawField)
        : String(rawField ?? '0');

    let nextValue = currentValue;

    if (key === 'backspace') {
      nextValue =
        currentValue.length > 1
          ? currentValue.slice(0, -1)
          : isDiscountValue || isPriceValue
            ? ''
            : '0';
    } else if (key === 'clear') {
      nextValue = isDiscountValue || isPriceValue ? '' : '0';
    } else if (key === '+10' || key === '+20' || key === '+50') {
      const increment = Number(key.replace('+', ''));
      const currentNum = Number(currentValue || 0);
      if (
        isDiscountValue &&
        editingItem.discount_type === 'percent' &&
        currentNum + increment > 100
      ) {
        nextValue = '100';
      } else {
        nextValue = String(currentNum + increment);
      }
    } else if (key === '.') {
      if (!currentValue.includes('.')) {
        nextValue = currentValue === '' ? '0.' : currentValue + '.';
      }
    } else {
      if (currentValue === '0' && key !== '.') {
        nextValue = key;
      } else {
        nextValue = currentValue + key;
      }
    }

    updateEditingItem(targetField, nextValue);
  };

  const setActiveField = (field: string) => {
    setEditingItem((prev: any) => ({ ...prev, _activeField: field }));
  };

  const openEditItemModal = (item: any) => {
    setEditingItem({
        ...item,
        price: item.price ?? 0,
        discount_type: item.discount_type || 'fixed',
        discount_value: item.discount_value || 0,
        _activeField: 'qty' // Start editing quantity by default
    });
    setIsEditItemOpen(true);
  };

  const handleSaveEditItem = () => {
    if (!editingItem) return;
    
    const latestCardItems = store.getState()?.cardItems?.value || [];
    const updatedItems = latestCardItems.map((item: any) => {
        if (item.id === editingItem.id) {
             const rawPrice = editingItem.price;
             const price = Math.max(
               0,
               Number(
                 rawPrice === '' || rawPrice === undefined || rawPrice === null
                   ? item.price
                   : rawPrice
               )
             );
             const qty = Number(editingItem.qty || 0);
             const numericValue = Number(editingItem.discount_value || 0);
             let calculatedPerUnit = 0;

              if (editingItem.discount_type === 'percent') {
                calculatedPerUnit = (price * numericValue) / 100;
              } else {
                if (qty > 0) {
                    calculatedPerUnit = numericValue / qty;
                }
              }
              calculatedPerUnit = Math.min(calculatedPerUnit, price);
              
            return {
                ...item,
                price,
                qty: qty,
                discount_value: numericValue,
                discount_type: editingItem.discount_type,
                discount_amount: Number(calculatedPerUnit.toFixed(4)),
                note: editingItem.note,
                stock_quantity: editingItem.stock_quantity ?? item.stock_quantity,
            };
        }
        return item;
    });
    
    dispatch(setCardItem(updatedItems));
    setIsEditItemOpen(false);
    setEditingItem(null);
  };

  const updateEditingItem = (field: string, value: any) => {
    setEditingItem((prev: any) => {
        if (!prev) return null;
        const next = { ...prev, [field]: value };
        
        // Auto-calculate discount amount for preview
        if (
          field === 'discount_value' ||
          field === 'discount_type' ||
          field === 'qty' ||
          field === 'price'
        ) {
             let calculatedPerUnit = 0;
             const numericValue = Number(next.discount_value || 0);
             const type = next.discount_type;
             const rawP = next.price;
             const priceNum =
               rawP === '' || rawP === undefined || rawP === null
                 ? 0
                 : Number(rawP);
             const price = Number.isFinite(priceNum) ? Math.max(0, priceNum) : 0;
             const qty = Number(next.qty || 0);

              if (type === 'percent') {
                calculatedPerUnit = (price * numericValue) / 100;
              } else {
                if (qty > 0) {
                    calculatedPerUnit = numericValue / qty;
                }
              }
              calculatedPerUnit = Math.min(calculatedPerUnit, price);
              next.discount_amount = Number(calculatedPerUnit.toFixed(4));
        }
        return next;
    });
  };

  const normalizeBarcode = (value: string) => value.trim().toLowerCase();

  const parseScaleBarcodeMeta = (rawBarcode: string) => {
    const digitsOnly = String(rawBarcode || '').replace(/\D/g, '');
    if (!/^\d{13}$/.test(digitsOnly)) return null;

    const prefix = digitsOnly.slice(0, 2);
    const isWeightPrefix = ['20', '21', '22', '23', '24', '99'].includes(prefix);
    const isPricePrefix = ['25', '26', '27', '28', '29'].includes(prefix);
    if (!isWeightPrefix && !isPricePrefix) return null;

    const pluRaw = digitsOnly.slice(2, 7);
    const pluTrimmed = pluRaw.replace(/^0+/, '');
    const lookupCandidates = Array.from(
      new Set(
        [pluRaw, pluTrimmed]
          .map((value) => normalizeBarcode(value))
          .filter(Boolean)
      )
    );
    if (!lookupCandidates.length) return null;

    const embeddedValue = Number(digitsOnly.slice(7, 12));
    if (!Number.isFinite(embeddedValue) || embeddedValue <= 0) return null;

    if (isWeightPrefix) {
      const quantityPerScan = embeddedValue / 1000;
      if (!Number.isFinite(quantityPerScan) || quantityPerScan <= 0) return null;
      return {
        lookupCandidates,
        plu: pluRaw,
        quantityPerScan,
        encodedPrice: null,
      };
    }

    return {
      lookupCandidates,
      plu: pluRaw,
      quantityPerScan: null,
      encodedPrice: embeddedValue / 100,
    };
  };

  const formatScanQtyLabel = (value: number) =>
    Number.isInteger(value)
      ? String(value)
      : String(Number(value.toFixed(3)));

  const buildScanSuccessMessage = (
    productName: string,
    incrementBy: number,
    scaleMeta?: {
      plu: string;
      quantityPerScan: number | null;
      encodedPrice: number | null;
    } | null
  ) => {
    const qtyLabel = formatScanQtyLabel(incrementBy);
    if (!scaleMeta) return `${productName} x${qtyLabel}`;
    const pluLabel = String(scaleMeta.plu || '').trim() || '-';
    if (scaleMeta.quantityPerScan) {
      return `${productName} | PLU ${pluLabel} | ${qtyLabel} kg`;
    }
    if (scaleMeta.encodedPrice) {
      return `${productName} | PLU ${pluLabel} | Qty ${qtyLabel}`;
    }
    return `${productName} x${qtyLabel}`;
  };

  const playScannerTone = (type: 'success' | 'error') => {
    try {
      const AudioCtx = window.AudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = type === 'success' ? 'sine' : 'triangle';
      oscillator.frequency.value = type === 'success' ? 920 : 220;
      gainNode.gain.value = 0.04;

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + (type === 'success' ? 0.08 : 0.14));
    } catch (error) {
      // Ignore audio failures to keep scanner flow uninterrupted.
    }
  };

  const processQueuedBarcode = useCallback(
    async (barcodeKey: string) => {
      const rawBarcode = rawBarcodeByKeyRef.current.get(barcodeKey) || barcodeKey;
      const parsedScaleMeta = parsedScaleBarcodeMetaRef.current.get(barcodeKey);
      const lookupCandidates = Array.from(
        new Set([
          normalizeBarcode(rawBarcode),
          barcodeKey,
          ...(parsedScaleMeta?.lookupCandidates || []),
        ])
      ).filter(Boolean);
      try {
        const online = typeof navigator === 'undefined' ? true : navigator.onLine;
        let matchedProduct: any = null;

        if (!online) {
          const indexedRows = await Promise.all(
            lookupCandidates.map((candidate) =>
              getIndexedProductByBarcode(candidate)
            )
          );
          matchedProduct = indexedRows.find(Boolean) || null;
        } else {
          const indexedLookup = () =>
            Promise.all(
              lookupCandidates.map((candidate) =>
                getIndexedProductByBarcode(candidate)
              )
            ).then((rows) => rows.find(Boolean) || null);

          const skuLookup = () =>
            Promise.all(
              lookupCandidates.map(async (candidate) => {
                try {
                  const skuResponse = await axiosInstance.get('menu/products', {
                    timeout: SCAN_REQUEST_TIMEOUT_MS,
                    params: {
                      not_default: 1,
                      per_page: 1,
                      'filter[sku]': candidate,
                    },
                  });
                  return skuResponse?.data?.data?.[0] || null;
                } catch {
                  return null;
                }
              })
            ).then((rows) => rows.find(Boolean) || null);

          // Local-first (Odoo-like): if the product is in IndexedDB, skip HTTP entirely.
          const indexedMatch = await indexedLookup();
          if (indexedMatch) {
            matchedProduct = indexedMatch;
          } else {
            const apiSkuMatch = await skuLookup();
            if (apiSkuMatch) {
              matchedProduct = apiSkuMatch;
              void upsertProductIndexFromApiProducts([apiSkuMatch]);
            } else {
              const allowNameFallback =
                typeof window !== 'undefined' &&
                window.localStorage.getItem(POS_BARCODE_NAME_FALLBACK_KEY) === '1';
              if (allowNameFallback) {
                try {
                  const nameResponse = await axiosInstance.get('menu/products', {
                    timeout: SCAN_REQUEST_TIMEOUT_MS,
                    params: {
                      not_default: 1,
                      per_page: 1,
                      'filter[name]': rawBarcode,
                    },
                  });
                  const nameHit = nameResponse?.data?.data?.[0];
                  if (nameHit) {
                    matchedProduct = nameHit;
                    void upsertProductIndexFromApiProducts([nameHit]);
                  }
                } catch {
                  matchedProduct = null;
                }
              }
            }
          }
        }

        const pendingCount = pendingCountByBarcodeRef.current.get(barcodeKey) || 0;

        pendingCountByBarcodeRef.current.delete(barcodeKey);
        rawBarcodeByKeyRef.current.delete(barcodeKey);
        parsedScaleBarcodeMetaRef.current.delete(barcodeKey);

        if (matchedProduct && pendingCount > 0) {
          const sku = String(matchedProduct?.sku || '');
          if (sku) {
            barcodeCacheRef.current.set(normalizeBarcode(sku), matchedProduct);
          }
          for (const candidate of lookupCandidates) {
            barcodeCacheRef.current.set(candidate, matchedProduct);
          }
          notFoundBarcodeCacheRef.current.delete(barcodeKey);
          for (const candidate of lookupCandidates) {
            notFoundBarcodeCacheRef.current.delete(candidate);
          }
          let incrementBy = pendingCount;
          if (parsedScaleMeta?.quantityPerScan) {
            incrementBy = parsedScaleMeta.quantityPerScan * pendingCount;
          } else if (
            parsedScaleMeta?.encodedPrice &&
            Number(matchedProduct?.price || 0) > 0
          ) {
            const derivedQty =
              parsedScaleMeta.encodedPrice / Number(matchedProduct.price || 0);
            if (Number.isFinite(derivedQty) && derivedQty > 0) {
              incrementBy = derivedQty * pendingCount;
            }
          }
          addOrIncrementCardItem(matchedProduct, incrementBy);
          setLastScanStatus('success');
          const successMsg = buildScanSuccessMessage(
            String(matchedProduct?.name || '-'),
            incrementBy,
            parsedScaleMeta
          );
          setLastScanMessage(successMsg);
          if (parsedScaleMeta) {
            showToast({ description: successMsg, duration: 1400 });
          }
          playScannerTone('success');
          return;
        }

        notFoundBarcodeCacheRef.current.set(barcodeKey, Date.now());
        for (const candidate of lookupCandidates) {
          notFoundBarcodeCacheRef.current.set(candidate, Date.now());
        }
        setLastScanStatus('error');
        setLastScanMessage(rawBarcode);
        playScannerTone('error');
        showToast({
          description: t('PRODUCT_NOT_FOUND_BY_BARCODE'),
          duration: 1800,
          variant: 'destructive',
        });
        suggestAddProductForBarcode(rawBarcode);
      } catch (error) {
        const pendingCount = pendingCountByBarcodeRef.current.get(barcodeKey) || 0;
        let localFallback: any = null;
        const fallbackRows = await Promise.all(
          lookupCandidates.map((candidate) =>
            getIndexedProductByBarcode(candidate)
          )
        );
        localFallback = fallbackRows.find(Boolean) || null;
        pendingCountByBarcodeRef.current.delete(barcodeKey);
        rawBarcodeByKeyRef.current.delete(barcodeKey);
        parsedScaleBarcodeMetaRef.current.delete(barcodeKey);

        if (localFallback && pendingCount > 0) {
          let incrementBy = pendingCount;
          if (parsedScaleMeta?.quantityPerScan) {
            incrementBy = parsedScaleMeta.quantityPerScan * pendingCount;
          } else if (
            parsedScaleMeta?.encodedPrice &&
            Number(localFallback?.price || 0) > 0
          ) {
            const derivedQty =
              parsedScaleMeta.encodedPrice / Number(localFallback.price || 0);
            if (Number.isFinite(derivedQty) && derivedQty > 0) {
              incrementBy = derivedQty * pendingCount;
            }
          }
          addOrIncrementCardItem(localFallback, incrementBy);
          setLastScanStatus('success');
          const successMsg = buildScanSuccessMessage(
            String(localFallback?.name || '-'),
            incrementBy,
            parsedScaleMeta
          );
          setLastScanMessage(successMsg);
          if (parsedScaleMeta) {
            showToast({ description: successMsg, duration: 1400 });
          }
          playScannerTone('success');
        } else {
          setLastScanStatus('error');
          setLastScanMessage(rawBarcode);
          playScannerTone('error');
          showToast({
            description: t('BARCODE_SEARCH_FAILED'),
            duration: 1800,
            variant: 'destructive',
          });
          suggestAddProductForBarcode(rawBarcode);
        }
      } finally {
        parsedScaleBarcodeMetaRef.current.delete(barcodeKey);
        inFlightBarcodesRef.current.delete(barcodeKey);
        activeRequestsRef.current = Math.max(0, activeRequestsRef.current - 1);
      }
    },
    [addOrIncrementCardItem, showToast, t]
  );

  const drainBarcodeQueue = useCallback(() => {
    while (
      activeRequestsRef.current < MAX_CONCURRENT_SCANS &&
      barcodeQueueRef.current.length > 0
    ) {
      const nextKey = barcodeQueueRef.current.shift();
      if (!nextKey) continue;
      if (inFlightBarcodesRef.current.has(nextKey)) continue;

      const pendingCount = pendingCountByBarcodeRef.current.get(nextKey) || 0;
      if (pendingCount <= 0) continue;

      inFlightBarcodesRef.current.add(nextKey);
      activeRequestsRef.current += 1;
      void processQueuedBarcode(nextKey).finally(() => {
        setIsScanningBarcode(
          activeRequestsRef.current > 0 || barcodeQueueRef.current.length > 0
        );
        drainBarcodeQueue();
      });
    }

    setIsScanningBarcode(
      activeRequestsRef.current > 0 || barcodeQueueRef.current.length > 0
    );
  }, [processQueuedBarcode]);

  const enqueueBarcode = useCallback(
    (barcodeValue?: string) => {
      const barcode = (barcodeValue ?? barcodeInput).trim();
      if (!barcode) return;
      setLastScanStatus('scanning');
      setLastScanMessage(barcode);

      const barcodeKey = normalizeBarcode(barcode);
      const parsedScaleMeta = parseScaleBarcodeMeta(barcode);
      const lookupCandidates = parsedScaleMeta?.lookupCandidates || [];
      const now = Date.now();
      // Prevent accidental double processing of the same Enter event.
      if (
        lastEnqueuedScanRef.current.key === barcodeKey &&
        now - lastEnqueuedScanRef.current.at < 80
      ) {
        setBarcodeInput('');
        return;
      }
      lastEnqueuedScanRef.current = { key: barcodeKey, at: now };
      const cachedProduct =
        barcodeCacheRef.current.get(barcodeKey) ||
        lookupCandidates
          .map((candidate) => barcodeCacheRef.current.get(candidate))
          .find(Boolean);
      if (cachedProduct) {
        let incrementBy = 1;
        if (parsedScaleMeta?.quantityPerScan) {
          incrementBy = parsedScaleMeta.quantityPerScan;
        } else if (
          parsedScaleMeta?.encodedPrice &&
          Number(cachedProduct?.price || 0) > 0
        ) {
          const derivedQty =
            parsedScaleMeta.encodedPrice / Number(cachedProduct.price || 0);
          if (Number.isFinite(derivedQty) && derivedQty > 0) {
            incrementBy = derivedQty;
          }
        }
        addOrIncrementCardItem(cachedProduct, incrementBy);
        setLastScanStatus('success');
        const successMsg = buildScanSuccessMessage(
          String(cachedProduct?.name || '-'),
          incrementBy,
          parsedScaleMeta
        );
        setLastScanMessage(successMsg);
        if (parsedScaleMeta) {
          showToast({ description: successMsg, duration: 1400 });
        }
        playScannerTone('success');
        setBarcodeInput('');
        return;
      }

      const lastNotFoundAt = notFoundBarcodeCacheRef.current.get(barcodeKey);
      const lookupRecentlyNotFound = lookupCandidates.some((candidate) => {
        const ts = notFoundBarcodeCacheRef.current.get(candidate);
        return Boolean(ts && Date.now() - ts < NOT_FOUND_CACHE_TTL_MS);
      });
      if (
        (lastNotFoundAt &&
          Date.now() - lastNotFoundAt < NOT_FOUND_CACHE_TTL_MS) ||
        lookupRecentlyNotFound
      ) {
        setLastScanStatus('error');
        setLastScanMessage(barcode);
        playScannerTone('error');
        showToast({
          description: t('PRODUCT_NOT_FOUND_BY_BARCODE'),
          duration: 1200,
          variant: 'destructive',
        });
        setBarcodeInput('');
        return;
      }

      const prevCount = pendingCountByBarcodeRef.current.get(barcodeKey) || 0;
      pendingCountByBarcodeRef.current.set(barcodeKey, prevCount + 1);
      if (!rawBarcodeByKeyRef.current.has(barcodeKey)) {
        rawBarcodeByKeyRef.current.set(barcodeKey, barcode);
      }
      if (parsedScaleMeta) {
        parsedScaleBarcodeMetaRef.current.set(barcodeKey, parsedScaleMeta);
      }

      const isAlreadyQueued = barcodeQueueRef.current.includes(barcodeKey);
      const isInFlight = inFlightBarcodesRef.current.has(barcodeKey);
      if (!isAlreadyQueued && !isInFlight) {
        barcodeQueueRef.current.push(barcodeKey);
      }

      setBarcodeInput('');
      drainBarcodeQueue();
    },
    [addOrIncrementCardItem, barcodeInput, drainBarcodeQueue, showToast, t]
  );

  const removeCartItem = (id: string) => {
    const latestCardItems = store.getState()?.cardItems?.value || [];
    dispatch(setCardItem(latestCardItems.filter((item: any) => item.id !== id)));
  };
  const adjustCartItemQty = (id: string, delta: number) => {
    const latestCardItems = store.getState()?.cardItems?.value || [];
    const updatedItems = latestCardItems
      .map((item: any) =>
        item.id === id
          ? { ...item, qty: Math.max(0, Number(item.qty || 0) + delta) }
          : item
      )
      .filter((item: any) => Number(item.qty || 0) > 0);
    dispatch(setCardItem(updatedItems));
  };
  const setCartItemQty = (id: string, rawQty: string) => {
    const nextQty = Math.max(0, Number(rawQty || 0));
    const latestCardItems = store.getState()?.cardItems?.value || [];
    const updatedItems = latestCardItems
      .map((item: any) => (item.id === id ? { ...item, qty: nextQty } : item))
      .filter((item: any) => Number(item.qty || 0) > 0);
    dispatch(setCardItem(updatedItems));
  };
  const buildParkedOrder = (items: any[]) => ({
    id: `park-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer_id: selectedCustomerId || '',
    customer_name: selectedCustomerName || '',
    tags: Array.isArray(orderSchema?.tags) ? [...orderSchema.tags] : [],
    discount_amount: Number(discountAmount || 0),
    items,
    total: items.reduce(
      (acc: number, item: any) =>
        acc + Number(item?.price || 0) * Number(item?.qty || 0),
      0
    ),
  });
  const parkCurrentOrder = () => {
    const latestCardItems = store.getState()?.cardItems?.value || [];
    if (!latestCardItems.length) return;

    const parkedOrder = buildParkedOrder(latestCardItems);
    setParkedOrders((prev) => [parkedOrder, ...prev]);
    dispatch(resetOrder());
    dispatch(setCardItem([]));
    setDiscountValue('0');
    showToast({
      description: t('ORDER_PARKED'),
      duration: 1800,
    });
  };
  const resumeParkedOrder = (parkedId: string) => {
    const parkedOrder = parkedOrders.find((order) => order.id === parkedId);
    if (!parkedOrder) return;
    const latestCardItems = store.getState()?.cardItems?.value || [];

    if (latestCardItems.length > 0) {
      const autoParkedCurrentOrder = buildParkedOrder(latestCardItems);
      setParkedOrders((prev) => [
        autoParkedCurrentOrder,
        ...prev.filter((order) => order.id !== parkedId),
      ]);
      showToast({
        description: t('ORDER_PARKED'),
        duration: 1200,
      });
    } else {
      setParkedOrders((prev) => prev.filter((order) => order.id !== parkedId));
    }

    dispatch(resetOrder());
    dispatch(setCardItem(parkedOrder.items || []));
    dispatch(
      updateField({
        field: 'customer_id',
        value: parkedOrder.customer_id || '',
      })
    );
    if (Array.isArray(parkedOrder.tags) && parkedOrder.tags.length > 0) {
      dispatch(updateField({ field: 'tags', value: parkedOrder.tags }));
    }
    setDiscountType('fixed');
    setDiscountValue(String(parkedOrder.discount_amount || 0));
  };
  const deleteParkedOrder = (parkedId: string) => {
    setParkedOrders((prev) => prev.filter((order) => order.id !== parkedId));
  };

  const saveTag = async () => {
    const trimmed = newTagName.trim();
    if (!trimmed) {
      showToast({
        description: t('ENTER_NEW_ORDER_TAG_NAME'),
        duration: 1800,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreatingTag(true);
      const sampleTag = Array.isArray(tagsData?.data) ? tagsData.data[0] : null;
      const payload: Record<string, any> = {};
      if (sampleTag && 'title' in sampleTag) {
        payload.title = trimmed;
      } else {
        payload.name = trimmed;
      }
      // type is required by backend - use sampleTag.type if available, else ORDER (4) for POS order tags
      payload.type = sampleTag && 'type' in sampleTag && sampleTag?.type
        ? sampleTag.type
        : 4;
      if (sampleTag && 'name_ar' in sampleTag) payload.name_ar = trimmed;
      if (sampleTag && 'name_en' in sampleTag) payload.name_en = trimmed;

      const response = isEditTagMode && editingTagId
        ? await axiosInstance.put(`manage/tags/${editingTagId}`, payload)
        : await axiosInstance.post('manage/tags', payload);
      const created = response?.data?.data ?? response?.data ?? null;
      const newId = created?.id ? String(created.id) : editingTagId;
      const newLabel =
        created?.name ?? created?.name_ar ?? created?.name_en ?? trimmed;
      if (!newId) throw new Error('Invalid tag response');

      setExtraTags((prev) =>
        prev.some((tag) => tag.value === newId)
          ? prev.map((tag) => (tag.value === newId ? { ...tag, label: newLabel } : tag))
          : [...prev, { value: newId, label: newLabel }]
      );
      dispatch(
        updateField({
          field: 'tags',
          value: [{ id: newId }],
        })
      );
      setNewTagName('');
      setIsCreateTagOpen(false);
      setIsEditTagMode(false);
      setEditingTagId('');
      showToast({
        description: t('ADDED_SUCCESSFULLY'),
        duration: 1600,
      });
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;
      const firstErrorMessage =
        (Array.isArray(apiErrors) && apiErrors[0]?.message) ||
        (apiErrors && typeof apiErrors === 'object'
          ? Object.values(apiErrors)?.[0]
          : null);
      const normalizedMessage = Array.isArray(firstErrorMessage)
        ? firstErrorMessage[0]
        : firstErrorMessage;

      showToast({
        description:
          String(normalizedMessage || error?.response?.data?.message || t('GENERAL_ERROR')),
        duration: 3500,
        variant: 'destructive',
      });
    } finally {
      setIsCreatingTag(false);
    }
  };

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

  const openCreateTagDialog = () => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    setIsEditTagMode(false);
    setEditingTagId('');
    setNewTagName('');
    setTimeout(() => setIsCreateTagOpen(true), 0);
  };

  const openEditTagDialog = () => {
    const selectedId =
      Array.isArray(orderSchema?.tags) && orderSchema.tags[0]
        ? String(orderSchema.tags[0].id)
        : '';
    if (!selectedId) {
      showToast({
        description: t('NO_ORDER_TAG_SELECTED_EDIT'),
        duration: 2000,
        variant: 'destructive',
      });
      return;
    }
    const selectedLabel =
      allTagOptions.find((tag) => tag.value === selectedId)?.label || '';
    (document.activeElement as HTMLElement | null)?.blur?.();
    setIsEditTagMode(true);
    setEditingTagId(selectedId);
    setNewTagName(selectedLabel);
    setTimeout(() => setIsCreateTagOpen(true), 0);
  };

  const clearTagSelection = () => {
    dispatch(updateField({ field: 'tags', value: [] }));
  };

  const formatSyncCount = useCallback((value: number) => {
    const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
    return new Intl.NumberFormat(undefined).format(safe);
  }, []);

  const syncButtonToneClass = isCatalogSyncing
    ? 'border-indigo-300 bg-indigo-50/70 text-indigo-800 hover:bg-indigo-100/70'
    : catalogSyncInterrupted
      ? 'border-amber-300 bg-amber-50/70 text-amber-800 hover:bg-amber-100/70'
      : 'border-mainBorder bg-white text-mainText hover:bg-gray-50';

  const syncMetaLabel = isCatalogSyncing && catalogSyncProgress
    ? `${t('POS_SYNC_LIVE_LABEL')}: ${formatSyncCount(catalogSyncProgress.fetchedRows)} ${t('POS_SYNC_PRODUCT_UNIT')}`
    : catalogSyncInterrupted
      ? t('POS_SYNC_INTERRUPTED_SHORT')
      : lastSyncedRows !== null
        ? `${formatSyncCount(lastSyncedRows)} ${t('POS_SYNC_PRODUCT_UNIT')}`
        : '';

  function suggestAddProductForBarcode(barcode: string) {
    const clean = String(barcode || '').trim();
    if (!clean) return;
    setBarcodeSuggestion({ open: true, barcode: clean });
  }

  const openCreateProductDialogFromSuggestion = useCallback(() => {
    const clean = String(barcodeSuggestion.barcode || '').trim();
    if (!clean) return;
    setBarcodeLookupStatus('idle');
    setBarcodeLookupMessage(t('POS_BARCODE_LOOKUP_HINT'));
    setQuickProductImage(null);
    setQuickProductImageLookupUrl('');
    setQuickProductForm({
      name: '',
      sku: clean,
      price: '',
      quantity: '1',
      category_id: productCategoryOptions?.[0]?.id
        ? String(productCategoryOptions[0].id)
        : '',
    });
    setBarcodeSuggestion({ open: false, barcode: '' });
    setTimeout(() => setIsCreateProductOpen(true), 0);
  }, [barcodeSuggestion.barcode, productCategoryOptions, t]);

  const lookupBarcodeDetails = useCallback(
    async (
      barcodeValue?: string,
      options?: { silent?: boolean; force?: boolean }
    ) => {
      const barcode = String(barcodeValue ?? quickProductForm.sku ?? '').trim();
      if (!barcode) return;
      const silent = Boolean(options?.silent);
      if (isBarcodeLookupLoading) return;
      if (silent && !options?.force && autoLookupAttemptedSkuRef.current === barcode) {
        return;
      }
      autoLookupAttemptedSkuRef.current = barcode;
      try {
        setIsBarcodeLookupLoading(true);
        setBarcodeLookupStatus('loading');
        setBarcodeLookupMessage(t('POS_BARCODE_LOOKUP_LOADING'));

        let resolvedName = '';
        let resolvedImageUrl = '';

        const customLookupUrl = String(
          import.meta.env.VITE_BARCODE_LOOKUP_URL || ''
        ).trim();
        const customLookupKey = String(
          import.meta.env.VITE_BARCODE_LOOKUP_KEY || ''
        ).trim();

        if (customLookupUrl) {
          const customRes = await axiosInstance.get(customLookupUrl, {
            timeout: 6000,
            params: { barcode },
            headers: customLookupKey
              ? { 'X-API-Key': customLookupKey }
              : undefined,
          });
          const payload = customRes?.data ?? {};
          resolvedName = String(
            payload?.name ||
              payload?.product_name ||
              payload?.product?.name ||
              payload?.data?.name ||
              payload?.data?.product_name ||
              ''
          ).trim();
          resolvedImageUrl = String(
            payload?.image ||
              payload?.image_url ||
              payload?.product?.image ||
              payload?.product?.image_url ||
              payload?.data?.image ||
              payload?.data?.image_url ||
              ''
          ).trim();
        }

        if (!resolvedName || !resolvedImageUrl) {
          const fallbackRes = await fetch(
            `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
              barcode
            )}.json`
          );
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            resolvedName =
              resolvedName ||
              String(
                fallbackData?.product?.product_name ||
                  fallbackData?.product?.generic_name ||
                  fallbackData?.product?.product_name_en ||
                  ''
              ).trim();
            resolvedImageUrl =
              resolvedImageUrl ||
              String(
                fallbackData?.product?.image_front_url ||
                  fallbackData?.product?.image_url ||
                  fallbackData?.product?.image_small_url ||
                  ''
              ).trim();
          }
        }

        if (resolvedName || resolvedImageUrl) {
          setQuickProductForm((prev) => ({
            ...prev,
            name: prev.name.trim() ? prev.name : resolvedName,
          }));
          if (resolvedImageUrl && !quickProductImage) {
            setQuickProductImageLookupUrl(resolvedImageUrl);
          }
          setBarcodeLookupStatus('success');
          setBarcodeLookupMessage(t('POS_BARCODE_LOOKUP_FOUND'));
          if (!silent) {
            showToast({
              description: t('POS_BARCODE_LOOKUP_FOUND'),
              duration: 1800,
            });
          }
        } else {
          if (silent) {
            setBarcodeLookupStatus('idle');
            setBarcodeLookupMessage(t('POS_BARCODE_LOOKUP_HINT'));
          } else {
            setBarcodeLookupStatus('not_found');
            setBarcodeLookupMessage(t('POS_BARCODE_LOOKUP_NOT_FOUND'));
          }
          if (!silent) {
            showToast({
              description: t('POS_BARCODE_LOOKUP_NOT_FOUND'),
              duration: 2000,
              variant: 'destructive',
            });
          }
        }
      } catch {
        if (silent) {
          setBarcodeLookupStatus('idle');
          setBarcodeLookupMessage(t('POS_BARCODE_LOOKUP_HINT'));
        } else {
          setBarcodeLookupStatus('error');
          setBarcodeLookupMessage(t('POS_BARCODE_LOOKUP_ERROR'));
        }
        if (!silent) {
          showToast({
            description: t('POS_BARCODE_LOOKUP_ERROR'),
            duration: 2000,
            variant: 'destructive',
          });
        }
      } finally {
        setIsBarcodeLookupLoading(false);
      }
    },
    [isBarcodeLookupLoading, quickProductForm.sku, quickProductImage, showToast, t]
  );

  const saveQuickProduct = async () => {
    const payloadName = quickProductForm.name.trim();
    const payloadSku = quickProductForm.sku.trim();
    const payloadCategory = String(quickProductForm.category_id || '').trim();
    const payloadPrice = Number(quickProductForm.price || 0);
    const payloadQty = Number(quickProductForm.quantity || 0);

    if (!payloadName || !payloadSku || !payloadCategory || !Number.isFinite(payloadPrice) || payloadPrice <= 0) {
      showToast({
        description: t('POS_PRODUCT_REQUIRED_FIELDS'),
        duration: 2200,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreatingProduct(true);
      const productPayload = {
        name: payloadName,
        name_localized: payloadName,
        description: '-',
        category_id: payloadCategory,
        sku: payloadSku,
        price: payloadPrice,
        is_stock_product: true,
        image: quickProductImage ?? quickProductImageLookupUrl ?? '',
        costing_method: 2,
        cost: 0,
        pricing_method: 1,
        selling_method: 1,
      };

      const productRes = await axiosInstance.post('menu/products', productPayload);
      const createdProduct = productRes?.data?.data ?? productRes?.data ?? null;
      const itemPivotId = createdProduct?.ingredients?.[0]?.pivot?.item_id;
      const branch = Cookies.get('branch_id');

      if (branch && itemPivotId && Number.isFinite(payloadQty) && payloadQty >= 0) {
        const invRes = await axiosInstance.post('inventory/inventory-count', {
          branch,
          items: [{ id: itemPivotId }],
        });
        const inventoryId = invRes?.data?.id;
        if (inventoryId) {
          await axiosInstance.post(
            `inventory/inventory-count/update_item/${inventoryId}`,
            {
              items: [{ id: itemPivotId, quantity: payloadQty }],
            }
          );
          await axiosInstance.put(`inventory/inventory-count/${inventoryId}`, {
            status: 2,
            branch,
          });
        }
      }

      if (createdProduct) {
        void upsertProductIndexFromApiProducts([createdProduct]);
        addOrIncrementCardItem(createdProduct, 1);
      }

      setIsCreateProductOpen(false);
      setQuickProductForm({
        name: '',
        sku: '',
        price: '',
        quantity: '1',
        category_id: '',
      });
      setBarcodeLookupStatus('idle');
      setBarcodeLookupMessage(t('POS_BARCODE_LOOKUP_HINT'));
      setQuickProductImage(null);
      setQuickProductImageLookupUrl('');
      showToast({
        description: t('ADDED_SUCCESSFULLY'),
        duration: 1800,
      });
    } catch {
      showToast({
        description: t('GENERAL_ERROR'),
        duration: 2500,
        variant: 'destructive',
      });
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const readPosTabLock = useCallback(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(POS_ACTIVE_TAB_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { tabId?: string; updatedAt?: number };
      if (!parsed?.tabId || !Number.isFinite(parsed?.updatedAt)) return null;
      return { tabId: String(parsed.tabId), updatedAt: Number(parsed.updatedAt) };
    } catch {
      return null;
    }
  }, []);

  const writePosTabLock = useCallback((tabId: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        POS_ACTIVE_TAB_KEY,
        JSON.stringify({ tabId, updatedAt: Date.now() })
      );
    } catch {
      // ignore storage write failures
    }
  }, []);

  const clearOwnPosTabLock = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const existing = readPosTabLock();
      if (existing?.tabId !== posTabIdRef.current) return;
      window.localStorage.removeItem(POS_ACTIVE_TAB_KEY);
    } catch {
      // ignore storage clear failures
    }
  }, [readPosTabLock]);

  const acquirePosTabLock = useCallback(() => {
    const existing = readPosTabLock();
    const now = Date.now();
    if (
      existing &&
      existing.tabId !== posTabIdRef.current &&
      now - existing.updatedAt < POS_TAB_LOCK_TTL_MS
    ) {
      return false;
    }
    writePosTabLock(posTabIdRef.current);
    return true;
  }, [readPosTabLock, writePosTabLock]);

  const syncAllProductsCatalog = async () => {
    if (isCatalogSyncing) return;
    if (!isOnline) {
      showToast({
        description: t('POS_SYNC_REQUIRES_ONLINE'),
        duration: 2200,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCatalogSyncing(true);
      setCatalogSyncInterrupted(false);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(POS_CATALOG_SYNC_ACTIVE_KEY, '1');
      }
      setCatalogSyncProgress(null);
      const result = await syncCatalogIndexIfDue(
        true,
        true,
        (progress) => setCatalogSyncProgress(progress)
      );
      setLastSyncedRows(result.syncedRows);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          POS_LAST_SYNCED_ROWS_KEY,
          String(result.syncedRows)
        );
      }
      showToast({
        description:
          `${t('POS_SYNC_ALL_PRODUCTS_DONE')} (${result.syncedRows})`,
        duration: 2800,
      });
    } catch {
      showToast({
        description: t('GENERAL_ERROR'),
        duration: 2500,
        variant: 'destructive',
      });
    } finally {
      setIsCatalogSyncing(false);
      setCatalogSyncProgress(null);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(POS_CATALOG_SYNC_ACTIVE_KEY);
      }
    }
  };

  // Once per tab session + branch: pull catalog into IndexedDB so barcode scans resolve locally first.
  useEffect(() => {
    if (!isOnline || !branchId) return;
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
    const warmKey = posAutoCatalogWarmSessionKey(String(branchId));
    if (sessionStorage.getItem(warmKey)) return;
    sessionStorage.setItem(warmKey, '1');

    let cancelled = false;
    const run = async () => {
      try {
        setIsCatalogSyncing(true);
        setCatalogSyncInterrupted(false);
        window.localStorage.setItem(POS_CATALOG_SYNC_ACTIVE_KEY, '1');
        setCatalogSyncProgress(null);
        const result = await syncCatalogIndexIfDue(true, false, (progress) => {
          if (!cancelled) setCatalogSyncProgress(progress);
        });
        if (!cancelled) {
          setLastSyncedRows(result.syncedRows);
          window.localStorage.setItem(
            POS_LAST_SYNCED_ROWS_KEY,
            String(result.syncedRows)
          );
        }
      } catch {
        if (!cancelled) setCatalogSyncInterrupted(true);
      } finally {
        if (!cancelled) {
          setIsCatalogSyncing(false);
          setCatalogSyncProgress(null);
        }
        window.localStorage.removeItem(POS_CATALOG_SYNC_ACTIVE_KEY);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [branchId, isOnline]);

  useEffect(() => {
    if (!isCatalogSyncing || typeof window === 'undefined') return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [isCatalogSyncing]);

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
      const currentBranchId = refundBranchIdRef.current;
      const branchFiltered = list.filter((order) => {
        const orderBranchId = String(
          order?.branch_id ?? order?.branch?.id ?? ''
        ).trim();
        if (currentBranchId && orderBranchId && orderBranchId !== currentBranchId) {
          return false;
        }
        return true;
      });
      setRefundOrdersRaw(branchFiltered);
    } catch {
      showToastRef.current({
        description: tRef.current('GENERAL_ERROR'),
        duration: 2500,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingRefundOrders(false);
    }
  }, []);

  const refundOrders = useMemo(
    () =>
      refundOrdersRaw
        .filter((order) => isRefundOrderInDateRange(order, refundDateRange))
        .slice(0, 40),
    [refundOrdersRaw, refundDateRange]
  );

  useEffect(() => {
    if (!isRefundDialogOpen) return;
    void fetchRefundableOrders();
  }, [isRefundDialogOpen, branchId, fetchRefundableOrders]);

  useEffect(() => {
    if (!isRefundDialogOpen) return;
    setSelectedRefundOrderId((prev) => {
      if (prev && refundOrders.some((order) => String(order.id) === prev)) return prev;
      return refundOrders[0]?.id ? String(refundOrders[0].id) : '';
    });
  }, [refundOrders, isRefundDialogOpen]);

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

      const isArabic =
        i18n.resolvedLanguage?.startsWith('ar') || i18n.language?.startsWith('ar');
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
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (!lastScanMessage) {
      setLastScanMessage(t('POS_READY_TO_SCAN'));
    }
  }, [lastScanMessage, t]);

  useEffect(() => {
    const currentIds = cardItemValue.map((item: any) => String(item.id));
    const previousIds = prevCartIdsRef.current;
    const newIds = currentIds.filter((id) => !previousIds.includes(id));

    if (newIds.length > 0 && cartListRef.current) {
      const lastNewId = newIds[newIds.length - 1];
      const newItemElement = cartListRef.current.querySelector(
        `[data-cart-item-id="${lastNewId}"]`
      ) as HTMLElement | null;

      if (newItemElement) {
        newItemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setSelectedCartItemId(lastNewId);
      } else {
        cartListRef.current.scrollTo({
          top: cartListRef.current.scrollHeight,
          behavior: 'smooth',
        });
        setSelectedCartItemId(lastNewId);
      }
    }

    if (currentIds.length === 0) {
      setSelectedCartItemId(null);
    } else if (
      selectedCartItemId &&
      !currentIds.includes(String(selectedCartItemId))
    ) {
      setSelectedCartItemId(currentIds[currentIds.length - 1]);
    }

    prevCartIdsRef.current = currentIds;
  }, [cardItemValue, selectedCartItemId]);

  useEffect(() => {
    products.forEach((product: any) => {
      const sku = String(product?.sku || '').trim();
      if (!sku) return;
      barcodeCacheRef.current.set(normalizeBarcode(sku), product);
    });
  }, [products]);

  useEffect(() => {
    const clearScannerBuffer = () => {
      scannerBufferRef.current = '';
      if (scannerTimerRef.current) {
        clearTimeout(scannerTimerRef.current);
        scannerTimerRef.current = null;
      }
    };

    const handleGlobalScanner = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      if (event.key === 'Enter') {
        const scannedValue = scannerBufferRef.current.trim();
        if (!scannedValue || scannedValue.length < 3) {
          clearScannerBuffer();
          return;
        }
        event.preventDefault();
        setBarcodeInput(scannedValue);
        enqueueBarcode(scannedValue);
        clearScannerBuffer();
        return;
      }

      if (event.key.length === 1) {
        scannerBufferRef.current += event.key;
        if (scannerTimerRef.current) {
          clearTimeout(scannerTimerRef.current);
        }
        scannerTimerRef.current = setTimeout(() => {
          clearScannerBuffer();
        }, 120);
      }
    };

    window.addEventListener('keydown', handleGlobalScanner);
    return () => {
      window.removeEventListener('keydown', handleGlobalScanner);
      if (scannerTimerRef.current) {
        clearTimeout(scannerTimerRef.current);
      }
    };
  }, [enqueueBarcode]);

  useEffect(() => {
    const canFocusBarcode =
      !isEditItemOpen &&
      !isOpen &&
      !isCreateTagOpen &&
      !isCreateProductOpen &&
      !isCreateCustomerOpen &&
      !isRefundDialogOpen &&
      !barcodeSuggestion.open &&
      !isLocked;

    if (!canFocusBarcode) return;

    const focusTimer = window.setTimeout(() => {
      barcodeInputRef.current?.focus();
      barcodeInputRef.current?.select();
    }, 40);

    return () => window.clearTimeout(focusTimer);
  }, [
    barcodeSuggestion.open,
    isCreateCustomerOpen,
    isCreateProductOpen,
    isCreateTagOpen,
    isEditItemOpen,
    isLocked,
    isOpen,
    isRefundDialogOpen,
  ]);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return true;
      }
      return Boolean(target.closest('[contenteditable="true"]'));
    };

    const handlePosShortcut = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const keyLower = event.key.toLowerCase();
      const isTyping = isTypingTarget(event.target);

      if (!event.ctrlKey && !event.altKey && !event.metaKey && event.key === 'F1') {
        event.preventDefault();
        setIsShortcutsHelpOpen(true);
        return;
      }

      if (event.ctrlKey && !event.altKey && !event.metaKey && keyLower === 'f') {
        event.preventDefault();
        productSearchInputRef.current?.focus();
        productSearchInputRef.current?.select();
        return;
      }

      if (
        event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        keyLower === 'e' &&
        !isEditItemOpen &&
        !isTyping
      ) {
        event.preventDefault();
        const activeItem =
          selectedCartItemId
            ? cardItemValue.find((item: any) => String(item.id) === String(selectedCartItemId))
            : cardItemValue[cardItemValue.length - 1];
        if (activeItem) {
          openEditItemModal(activeItem);
        }
        return;
      }

      if (isEditItemOpen && event.key === 'Escape') {
        event.preventDefault();
        setIsEditItemOpen(false);
        setEditingItem(null);
        return;
      }

      if (isEditItemOpen && editingItem && !isTyping) {
        if (event.ctrlKey && !event.altKey && !event.metaKey) {
          if (event.key === '1') {
            event.preventDefault();
            setActiveField('qty');
            return;
          }
          if (event.key === '2') {
            event.preventDefault();
            setActiveField('price');
            return;
          }
          if (event.key === '3') {
            event.preventDefault();
            setActiveField('discount_value');
            return;
          }
        }

        if (event.key === 'F7') {
          event.preventDefault();
          handleNumpadInput('+10');
          return;
        }
        if (event.key === 'F8') {
          event.preventDefault();
          handleNumpadInput('+20');
          return;
        }
        if (event.key === 'F9') {
          event.preventDefault();
          handleNumpadInput('+50');
          return;
        }

        if (keyLower === 'c') {
          event.preventDefault();
          handleNumpadInput('clear');
          return;
        }
        if (keyLower === 'x') {
          event.preventDefault();
          handleNumpadInput('backspace');
          return;
        }

        if (event.key === 'Backspace') {
          event.preventDefault();
          handleNumpadInput('backspace');
          return;
        }

        if (event.key === 'Delete') {
          event.preventDefault();
          handleNumpadInput('clear');
          return;
        }

        if (/^[0-9]$/.test(event.key) || event.key === '.') {
          event.preventDefault();
          handleNumpadInput(event.key);
          return;
        }
      }

      if (event.ctrlKey || event.altKey || event.metaKey) return;

      const canProceedToPayment = event.key === 'F2' || (event.key === 'Enter' && !isTyping);
      if (canProceedToPayment) {
        event.preventDefault();
        if (isEditItemOpen && editingItem) {
          handleSaveEditItem();
          return;
        }
        if (cardItemValue.length === 0) return;
        navigate('shop-card');
        return;
      }

      if (isTyping || isEditItemOpen) return;

      const activeCartItemId =
        selectedCartItemId && cardItemValue.some((item: any) => String(item.id) === String(selectedCartItemId))
          ? String(selectedCartItemId)
          : cardItemValue.length > 0
            ? String(cardItemValue[cardItemValue.length - 1].id)
            : null;

      if (!activeCartItemId) return;

      if (event.key === 'Delete') {
        event.preventDefault();
        removeCartItem(activeCartItemId);
        return;
      }

      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        adjustCartItemQty(activeCartItemId, 1);
        return;
      }

      if (event.key === '-') {
        event.preventDefault();
        adjustCartItemQty(activeCartItemId, -1);
      }
    };

    window.addEventListener('keydown', handlePosShortcut);
    return () => window.removeEventListener('keydown', handlePosShortcut);
  }, [
    adjustCartItemQty,
    cardItemValue,
    editingItem,
    handleNumpadInput,
    handleSaveEditItem,
    isEditItemOpen,
    navigate,
    removeCartItem,
    setActiveField,
    selectedCartItemId,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // 1. Search Change: Clear everything (fresh search)
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [debouncedSearch]);

  // 2. Category Change: Optimistic update
  useEffect(() => {
    setPage(1);
    
    if (activeCategory === 'all') {
      setProducts([]); 
    } else {
      // Optimistic UI: Filter current visible products to show relevant ones IMMEDIATELY
      // while fetching the full list from server. This prevents empty screen flash.
      setProducts((prev) => prev.filter((p: any) => String(p?.category?.id) === activeCategory));
    }
    
    setHasMore(true);
  }, [activeCategory]);

  useEffect(() => {
    if (!data) return;

    const pageItems = data?.data || [];
    setProducts((prev) => (page === 1 ? pageItems : [...prev, ...pageItems]));

    const currentPage = Number(data?.meta?.current_page || 1);
    const lastPage = Number(data?.meta?.last_page || 1);
    setHasMore(currentPage < lastPage);
  }, [data, page]);

  useEffect(() => {
    const refreshTabLockState = () => {
      const acquired = acquirePosTabLock();
      setIsPosLockedByAnotherTab(!acquired);
    };

    refreshTabLockState();

    const keepAlive = window.setInterval(() => {
      refreshTabLockState();
    }, 2500);

    const onStorage = (event: StorageEvent) => {
      if (event.key !== POS_ACTIVE_TAB_KEY) return;
      refreshTabLockState();
    };

    const onBeforeUnload = () => {
      clearOwnPosTabLock();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.clearInterval(keepAlive);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('beforeunload', onBeforeUnload);
      clearOwnPosTabLock();
    };
  }, [acquirePosTabLock, clearOwnPosTabLock]);

  useEffect(() => {
    if (!quickProductImage) {
      setQuickProductImagePreview('');
      return;
    }
    const localPreviewUrl = URL.createObjectURL(quickProductImage);
    setQuickProductImagePreview(localPreviewUrl);
    return () => {
      URL.revokeObjectURL(localPreviewUrl);
    };
  }, [quickProductImage]);

  useEffect(() => {
    if (!isCreateProductOpen) {
      autoLookupAttemptedSkuRef.current = '';
      return;
    }
    if (!quickProductForm.sku?.trim()) return;
    if (quickProductForm.name?.trim()) return;
    void lookupBarcodeDetails(quickProductForm.sku, { silent: true });
  }, [isCreateProductOpen, quickProductForm.sku, quickProductForm.name, lookupBarcodeDetails]);

  return (
    <>
      {isPosLockedByAnotherTab ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 p-6">
          <div className="w-full max-w-lg rounded-2xl border border-mainBorder bg-white p-6 text-center shadow-xl">
            <h2 className="text-xl font-bold text-mainText">
              {t('POS_TAB_LOCK_TITLE')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-secText">
              {t('POS_TAB_LOCK_DESC')}
            </p>
            <div className="mt-5">
              <Button
                type="button"
                className="h-10 rounded-lg px-5"
                onClick={() => navigate('/zood-dashboard/individual-invoices')}
              >
                {t('POS_TAB_LOCK_ACTION')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      {barcodeSuggestion.open ? (
        <div className="fixed inset-0 z-[121] flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-mainBorder bg-white p-5 shadow-xl">
            <h3 className="text-base font-bold text-mainText">
              {t('POS_BARCODE_NOT_FOUND_TITLE')}
            </h3>
            <p className="mt-2 text-sm leading-6 text-secText">
              {t('POS_BARCODE_NOT_FOUND_DESC')}
            </p>
            <div className="mt-3 rounded-lg border border-mainBorder bg-gray-50 px-3 py-2 text-sm font-medium text-mainText">
              {barcodeSuggestion.barcode}
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBarcodeSuggestion({ open: false, barcode: '' })}
              >
                {t('CANCEL')}
              </Button>
              <Button type="button" onClick={openCreateProductDialogFromSuggestion}>
                {t('POS_ADD_PRODUCT_WITH_BARCODE')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="pos-container fixed inset-0 z-50 flex h-full w-full flex-col overflow-hidden bg-background md:flex-row md:flex-nowrap">
        {/* Left Side: Cart & Actions */}
        <div className="flex w-full shrink-0 flex-col border-b border-mainBorder bg-background md:h-full md:w-[300px] md:border-b-0 md:border-e lg:w-[340px] xl:w-[380px]">
          <div className="flex shrink-0 items-center border-b border-mainBorder bg-white px-3 py-2 shadow-sm">
            <div className="flex h-11 w-full items-center overflow-hidden rounded-2xl border border-mainBorder bg-white shadow-sm">
              <div className="flex h-full shrink-0 items-center gap-2 bg-gray-50 px-3">
                <span className="text-sm font-semibold text-mainText">
                  {t('POS')}
                </span>
                <img src={SH_LOGO} alt="Logo" className="h-8 w-auto object-contain" />
              </div>
              <span className="my-2 h-auto w-px bg-mainBorder/70" />
              <div className="shrink-0 px-2">
                <OfflineSyncStatusPill
                  isOnline={isOnline}
                  pendingCount={pendingCount}
                  failedCount={failedCount}
                  compact
                />
              </div>
              <span className="my-2 h-auto w-px bg-mainBorder/70" />
              <button
                type="button"
                disabled
                className="flex h-full min-w-0 flex-1 items-center gap-1.5 bg-gray-100 px-3 text-sm font-medium text-gray-400 cursor-not-allowed opacity-70"
                title={t('EMPLOYEE_LOGIN')}
              >
                <Lock className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {t('EMPLOYEE_LOGIN')}
                </span>
              </button>
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden p-2">
            {/* Cart Header Actions */}
            <div className="mb-2 space-y-2 border-b border-mainBorder/50 pb-2">
              <div className="grid grid-cols-2 gap-2">
                {/* Customer Selector - Explicit */}
                <div id="tour-customer" className="flex-1">
                  <CustomSearchInbox
                    options={allCustomerOptions}
                    placeholder="CUSTOMER_NAME"
                    onValueChange={(value: string) =>
                      dispatch(updateField({ field: 'customer_id', value }))
                    }
                    className="h-full w-full"
                    triggerClassName="h-9 w-full justify-between rounded border border-mainBorder bg-white px-2 text-xs text-mainText shadow-sm hover:bg-gray-50 focus:ring-1 focus:ring-main/20"
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
                {/* Tag Selector - Explicit */}
                <div className="flex-1">
                  <CustomSearchInbox
                    options={allTagOptions}
                    placeholder="ORDER_TAGS"
                    onValueChange={(value: string) =>
                      dispatch(
                        updateField({
                          field: 'tags',
                          value: value ? [{ id: value }] : [],
                        })
                      )
                    }
                    className="h-full w-full"
                    triggerClassName="h-9 w-full justify-between rounded border border-mainBorder bg-white px-2 text-xs text-mainText shadow-sm hover:bg-gray-50 focus:ring-1 focus:ring-main/20"
                    value={
                      Array.isArray(orderSchema?.tags) && orderSchema.tags[0]
                        ? orderSchema.tags[0].id
                        : ''
                    }
                    footerActions={[
                      {
                        id: 'create-tag',
                        label: (
                          <div className="flex items-center justify-center gap-1">
                            <Plus className="h-3.5 w-3.5" />
                            <span>{t('CREATE_NEW_ORDER_TAG')}</span>
                          </div>
                        ),
                        className:
                          'bg-main/5 border-main/20 text-main hover:bg-main/10 font-medium',
                        onClick: openCreateTagDialog,
                      },
                      {
                        id: 'edit-tag',
                        label: (
                          <div className="flex items-center justify-center gap-1">
                            <Pencil className="h-3.5 w-3.5" />
                            <span>{t('EDIT')}</span>
                          </div>
                        ),
                        onClick: openEditTagDialog,
                        disabled:
                          !Array.isArray(orderSchema?.tags) || !orderSchema.tags[0]?.id,
                      },
                      {
                        id: 'clear-tag',
                        label: (
                          <div className="flex items-center justify-center gap-1">
                            <X className="h-3.5 w-3.5" />
                            <span>{t('CLEAR_ORDER_TAG')}</span>
                          </div>
                        ),
                        className:
                          'hover:bg-red-50 hover:text-red-600 hover:border-red-200',
                        onClick: clearTagSelection,
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Park Order Action - Explicit Button */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-center text-xs font-medium hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"
                  onClick={parkCurrentOrder}
                  disabled={cardItemValue.length === 0}
                >
                  <PauseCircle className="mr-1.5 h-3.5 w-3.5" />
                  {t('PARK_ORDER')}
                </Button>
                <div className="flex h-9 items-center justify-center rounded border border-mainBorder bg-gray-50 px-2 text-xs font-medium text-secText">
                  {t('PARKED_ORDERS')}: <span className="mx-1 font-bold text-mainText">{parkedOrders.length}</span>
                </div>
              </div>
            </div>

            {/* Parked Orders List (Collapsible/Conditional) */}
            {parkedOrders.length > 0 && (
              <div className="mb-2 max-h-[100px] space-y-1 overflow-y-auto rounded bg-orange-50/50 p-1">
                {parkedOrders.map((order) => {
                  const tagLabels = (order.tags || [])
                    .map((tag: any) =>
                      allTagOptions.find((opt) => opt.value === (tag?.id ?? tag))?.label
                    )
                    .filter(Boolean);
                  const orderLabel =
                    order.customer_name ||
                    (tagLabels.length > 0 ? tagLabels.join(', ') : t('GUEST'));
                  return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded bg-white px-2 py-1 text-[10px] shadow-sm"
                  >
                    <div className="truncate text-mainText">
                      <span className="font-semibold">{orderLabel}</span>
                      <span className="mx-1 text-secText">-</span>
                      <span>
                        <CurrencyAmount value={order.total || 0} />
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="text-emerald-600 hover:text-emerald-700"
                        onClick={() => resumeParkedOrder(order.id)}
                        title={t('RESUME_ORDER')}
                      >
                        <PlayCircle className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => deleteParkedOrder(order.id)}
                        title={t('DELETE')}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}

            <div
              id="tour-cart-list"
              ref={cartListRef}
              className="mt-1 flex-1 space-y-1 overflow-y-auto pe-1"
            >
              {cardItemValue.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-3 text-secText/40">
                  <ShoppingBasket className="h-16 w-16 opacity-20" strokeWidth={1} />
                  <div className="text-sm font-medium">{t('POS_CART_EMPTY')}</div>
                </div>
              ) : (
                cardItemValue.map((item: any) => (
                  <div
                    key={item.id}
                    data-cart-item-id={item.id}
                    onClick={() => openEditItemModal(item)}
                    className={`group flex cursor-pointer items-center justify-between rounded border border-transparent px-2 py-2 transition-all hover:border-mainBorder hover:shadow-sm ${
                      selectedCartItemId === item.id ? 'bg-blue-50/50' : 'bg-white'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        className="truncate text-sm font-medium text-mainText"
                        title={item.name}
                      >
                        {item.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                        <span className="flex items-center justify-center rounded bg-gray-100 px-1.5 py-0.5 font-bold text-mainText">
                          {item.qty}
                        </span>
                        <span className="text-secText/60">x</span>
                        <span className="font-semibold text-main">
                          <CurrencyAmount value={item.price || 0} />
                        </span>
                        {item.discount_amount > 0 && (
                          <span className="rounded bg-emerald-50 px-1 font-semibold text-emerald-600">
                             -{formatNumber(item.discount_amount)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end shrink-0 ms-2">
                       <div className="text-sm font-bold text-mainText">
                          <CurrencyAmount
                            value={
                              Number(item.price || 0) * Number(item.qty || 0) -
                              Number(item.discount_amount || 0) * Number(item.qty || 0)
                            }
                          />
                       </div>
                       {item.discount_amount > 0 && (
                         <div className="text-[10px] text-secText line-through decoration-red-400 decoration-1">
                          <CurrencyAmount
                            value={Number(item.price || 0) * Number(item.qty || 0)}
                          />
                         </div>
                       )}
                    </div>
                    
                    <div
                      className={`flex items-center gap-2 transition-opacity duration-200 ${
                        selectedCartItemId === item.id
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCartItem(item.id);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-secText opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                        title={t('DELETE')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Fixed Bottom Section for Totals & Action */}
          <div className="mt-auto p-2">
            <div className="rounded-md bg-[#F7F8FC] px-3 py-2 text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-secText">{t('QUANTITY')}</span>
                <span className="font-medium">{cartItemsCount}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-secText">{t('SUBTOTAL')}</span>
                <span className="font-medium">
                  <CurrencyAmount value={subtotalAmount} />
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-secText">{t('DISCOUNT')}</span>
                  <div className="flex h-10 w-fit items-center overflow-hidden rounded-lg border border-mainBorder bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => setDiscountType('fixed')}
                      className={`h-full min-w-[46px] px-3 text-sm font-bold transition-colors active:scale-[0.98] ${
                        discountType === 'fixed'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      ﷼
                    </button>
                    <div className="h-full w-[1px] bg-mainBorder" />
                    <button
                      type="button"
                      onClick={() => setDiscountType('percent')}
                      className={`h-full min-w-[46px] px-3 text-sm font-bold transition-colors active:scale-[0.98] ${
                        discountType === 'percent'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      %
                    </button>
                  </div>
                </div>
                <div className="w-[118px]">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={discountValue}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setDiscountValue(val);
                    }}
                    className="!h-10 !w-full rounded-lg border-mainBorder bg-white px-3 text-right text-sm font-semibold tabular-nums shadow-sm focus:ring-1 focus:ring-main/20"
                    placeholder={discountType === 'percent' ? '%' : '﷼'}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-secText">
                  {t('TAX')} {vatRate}%
                </span>
                <span className="font-medium">
                  <CurrencyAmount value={vatAmount} />
                </span>
              </div>
              <div className="my-1 border-t border-mainBorder/50" />
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold">{t('TOTAL_AMOUNT')}</span>
                <span className="font-bold">
                  <CurrencyAmount value={grandTotal} />
                </span>
              </div>
            </div>
            <Button
              id="tour-payment"
              type="button"
              onClick={() => {
                if (isEditItemOpen && editingItem) {
                  handleSaveEditItem();
                  return;
                }
                navigate('shop-card');
              }}
              disabled={!isEditItemOpen && cardItemValue.length === 0}
              className="mt-2 h-12 w-full text-base font-semibold"
            >
              {isEditItemOpen ? t('RETURN') : t('POS_PROCEED_PAYMENT')}
            </Button>
          </div>
        </div>

        {/* Right Side: Products Grid */}
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-gray-50/50 relative">
          {isEditItemOpen && editingItem ? (
            <div className="flex h-full w-full overflow-hidden bg-[#F8F9FD] p-6 relative">
                <div className="mx-auto grid h-full w-full gap-6 md:grid-cols-12 max-w-7xl">
            
              {/* Right Column (Inputs) - Matches Payment Page Logic (Numpad + Selectors) */}
              <div className="flex h-full flex-col gap-4 md:col-span-8">
                 {/* Selectors - Replacing Payment Methods */}
                 <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveField('qty')}
                      className={`relative flex h-[110px] flex-col items-center justify-center gap-1 rounded-2xl border transition-all shadow-sm active:scale-95 overflow-hidden group ${
                        editingItem?._activeField === 'qty'
                          ? 'bg-[#5D5FEF] text-white ring-2 ring-offset-1 ring-[#5D5FEF] border-transparent'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-[#5D5FEF]/30'
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-wider ${editingItem?._activeField === 'qty' ? 'text-white/80' : 'text-gray-400'}`}>
                        {t('QUANTITY')}
                      </span>
                      <span className="text-4xl font-black tracking-tight leading-none mt-1">
                        {editingItem?.qty || 0}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveField('price')}
                      className={`relative flex h-[110px] flex-col items-center justify-center gap-1 rounded-2xl border transition-all shadow-sm active:scale-95 overflow-hidden group px-1 ${
                        editingItem?._activeField === 'price'
                          ? 'bg-[#5D5FEF] text-white ring-2 ring-offset-1 ring-[#5D5FEF] border-transparent'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-[#5D5FEF]/30'
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-wider ${editingItem?._activeField === 'price' ? 'text-white/80' : 'text-gray-400'}`}>
                        {t('UNIT_PRICE')}
                      </span>
                      <div className="flex items-baseline gap-0.5 mt-1 max-w-full">
                        <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none truncate max-w-full">
                          {editingItem?._activeField === 'price'
                            ? String(
                                editingItem?.price === '' ||
                                  editingItem?.price === null ||
                                  editingItem?.price === undefined
                                  ? '0'
                                  : editingItem.price
                              )
                            : formatNumber(editingItem?.price ?? 0)}
                        </span>
                        <span className="text-sm font-bold opacity-60 shrink-0">
                          {t('SAR', '﷼')}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveField('discount_value')}
                      className={`relative flex h-[110px] flex-col items-center justify-center gap-1 rounded-2xl border transition-all shadow-sm active:scale-95 overflow-hidden group ${
                        editingItem?._activeField === 'discount_value'
                          ? 'bg-[#5D5FEF] text-white ring-2 ring-offset-1 ring-[#5D5FEF] border-transparent'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-[#5D5FEF]/30'
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-wider ${editingItem?._activeField === 'discount_value' ? 'text-white/80' : 'text-gray-400'}`}>
                        {t('DISCOUNT')}
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-4xl font-black tracking-tight leading-none">
                          {editingItem?.discount_value || 0}
                        </span>
                        <span className="text-sm font-bold opacity-60">
                          {editingItem?.discount_type === 'percent' ? '%' : t('SAR', '﷼')}
                        </span>
                      </div>
                    </button>
                 </div>

                 {/* Discount Type Toggles (Only visible when Discount is active) */}
                 {editingItem?._activeField === 'discount_value' && (
                    <div className="grid grid-cols-2 gap-4">
                       <button
                         type="button"
                         onClick={(e) => { e.stopPropagation(); updateEditingItem('discount_type', 'fixed'); }}
                         className={`flex h-[80px] items-center justify-center rounded-xl border text-xl font-bold transition-all shadow-sm active:scale-95 ${
                           editingItem?.discount_type !== 'percent'
                             ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-offset-1 ring-blue-200'
                             : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                         }`}
                       >
                         {t('SAR', '﷼')}
                       </button>
                       <button
                         type="button"
                         onClick={(e) => { e.stopPropagation(); updateEditingItem('discount_type', 'percent'); }}
                         className={`flex h-[80px] items-center justify-center rounded-xl border text-xl font-bold transition-all shadow-sm active:scale-95 ${
                           editingItem?.discount_type === 'percent'
                             ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-offset-1 ring-emerald-200'
                             : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                         }`}
                       >
                         %
                       </button>
                    </div>
                 )}

                 {/* Note Input */}
                 <div className="mt-4">
                    <label className="mb-2 block text-sm font-bold text-gray-700">{t('NOTES')}</label>
                    <textarea
                      rows={2}
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-[#5D5FEF] focus:outline-none focus:ring-1 focus:ring-[#5D5FEF]"
                      placeholder={t('ADD_NOTE_PLACEHOLDER')}
                      value={editingItem?.note || ''}
                      onChange={(e) => updateEditingItem('note', e.target.value)}
                    />
                 </div>

                 {/* Numpad */}
                 <div className="mt-auto grid shrink-0 grid-cols-4 gap-4 h-full max-h-[420px]" dir="ltr">
                    {['1', '2', '3', '+10', '4', '5', '6', '+20', '7', '8', '9', '+50', '.', '0', 'C', 'backspace'].map((key) => {
                      const isQuickAction = ['+10', '+20', '+50'].includes(key);
                      const isDelete = key === 'backspace';
                      const isClear = key === 'C';
                      
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                             if (key === 'backspace') { handleNumpadInput('backspace'); return; }
                             if (key === 'C') { handleNumpadInput('clear'); return; }
                             if (key === '+10') { handleNumpadInput('+10'); return; }
                             if (key === '+20') { handleNumpadInput('+20'); return; }
                             if (key === '+50') { handleNumpadInput('+50'); return; }
                             handleNumpadInput(key);
                          }}
                          className={`flex items-center justify-center rounded-xl text-2xl font-bold shadow-sm transition-all active:scale-95 border ${
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
                    })}
                 </div>
              </div>

              {/* Left Column (Info & Actions) - Matches Payment Page Amount & Confirm */}
              <div className="flex h-full flex-col gap-4 md:col-span-4">
                {/* Product Info & Amount Box */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                   <div className="border-b border-gray-100 p-6 bg-gray-50/10">
                      <h3 className="text-xl font-bold text-mainText line-clamp-2 text-center mb-2" title={editingItem?.name}>{editingItem?.name}</h3>
                      <div
                        className={`text-center text-sm font-medium text-secText ${
                          editingItem?._activeField === 'price'
                            ? 'rounded-lg px-2 py-1 ring-2 ring-[#5D5FEF]/80 ring-offset-1'
                            : ''
                        }`}
                      >
                        {t('UNIT_PRICE')}:{' '}
                        <span className="font-bold text-main">
                          <CurrencyAmount
                            value={
                              editingItem?._activeField === 'price'
                                ? String(
                                    editingItem?.price === '' ||
                                      editingItem?.price === null ||
                                      editingItem?.price === undefined
                                      ? '0'
                                      : editingItem.price
                                  )
                                : editingItem?.price ?? 0
                            }
                          />
                        </span>
                      </div>
                      {(() => {
                        const raw = editingItem?.stock_quantity;
                        if (
                          raw === undefined ||
                          raw === null ||
                          raw === ''
                        ) {
                          return null;
                        }
                        const stockNum = Number(raw);
                        if (!Number.isFinite(stockNum)) return null;
                        const qtyNum = Number(editingItem?.qty || 0);
                        const exceeds = qtyNum > stockNum;
                        return (
                          <div className="mt-2 text-center text-sm font-medium text-secText">
                            {t('AVAILABLE_QUANTITY')}:{' '}
                            <span
                              className={`font-bold ${
                                exceeds ? 'text-red-600' : 'text-main'
                              }`}
                            >
                              {stockNum.toLocaleString()}
                            </span>
                          </div>
                        );
                      })()}
                   </div>

                   <div className="flex shrink-0 flex-col items-center justify-center p-6 text-center flex-1 bg-white relative">
                      {editingItem?.image ? (
                        <div className="relative h-56 w-56 overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white mb-6 transform transition-transform hover:scale-105 duration-300">
                          <img 
                            src={editingItem.image.startsWith('http') ? editingItem.image : `${settingsData?.data?.domain || ''}${editingItem.image}`} 
                            alt={editingItem.name} 
                            className="h-full w-full object-contain p-2"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-300">
                             <ImageIcon className="h-20 w-20" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-300 mb-6">
                          <ImageIcon className="h-20 w-20" />
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center w-full">
                         <div className="text-4xl font-bold text-[#5D5FEF] tracking-tight">
                           <CurrencyAmount
                             value={
                               Number(editingItem?.price || 0) *
                                 Number(editingItem?.qty || 0) -
                               Number(editingItem?.discount_amount || 0) *
                                 Number(editingItem?.qty || 0)
                             }
                           />
                         </div>
                         {Number(editingItem?.discount_amount) > 0 && (
                            <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600 border border-emerald-100">
                              {t('SAVING')}{' '}
                              <CurrencyAmount
                                value={editingItem.discount_amount * editingItem.qty}
                              />
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-12 gap-3">
                    <Button
                      type="button"
                      onClick={() => {
                        handleSaveEditItem();
                        navigate('shop-card');
                      }}
                      className="col-span-12 min-h-[70px] rounded-xl bg-[#5D5FEF] px-4 py-3 text-center text-base font-bold leading-tight whitespace-normal text-white shadow-lg shadow-indigo-200 hover:bg-[#4B4DDB] active:scale-[0.98] sm:text-lg"
                    >
                      {t('SAVE_AND_PROCEED_PAYMENT')}
                    </Button>
                </div>
              </div>
              
            </div>
            
            {/* Close Button Absolute - Left Side */}
             <button
              type="button"
              onClick={() => {
                if (editingItem) {
                  handleSaveEditItem();
                  return;
                }
                setIsEditItemOpen(false);
              }}
              className="absolute top-6 left-6 rounded-full bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shadow-sm ring-1 ring-gray-100 z-10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          ) : (
            <>
          {/* Odoo-style Header: Compact & Clean */}
          <div className="z-10 flex w-full flex-col border-b border-mainBorder bg-white shadow-sm">
            {/* Top Row: Navigation & Search */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-11 w-full min-w-0 items-stretch overflow-hidden rounded-2xl border border-mainBorder bg-white shadow-sm">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={startTour}
                  className="h-11 w-11 shrink-0 rounded-none border-0 text-secText hover:bg-main/10 hover:text-main"
                  title={t('HELP_TOUR')}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsShortcutsHelpOpen(true)}
                  className="h-11 w-11 shrink-0 rounded-none border-0 text-secText hover:bg-main/10 hover:text-main"
                  title="F1"
                >
                  <Keyboard className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(true)}
                  className="h-11 w-11 shrink-0 rounded-none border-0 text-secText hover:bg-destructive/10 hover:text-destructive"
                  title={t('POS_EXIT')}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <span className="my-2 h-auto w-px bg-mainBorder/70" />
                <Button
                  type="button"
                  variant="outline"
                  className={`order-1 h-11 shrink-0 gap-2 rounded-none border-0 border-s-0 px-3 shadow-none ${syncButtonToneClass}`}
                  onClick={() => void syncAllProductsCatalog()}
                  disabled={isCatalogSyncing || !isOnline}
                  title={
                    isCatalogSyncing && catalogSyncProgress
                      ? `${catalogSyncProgress.currentPage}/${catalogSyncProgress.totalPages || '?'}`
                      : undefined
                  }
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 shrink-0 ${isCatalogSyncing ? 'animate-spin text-indigo-600' : 'text-secText'}`}
                  />
                  <span className="text-xs font-semibold whitespace-nowrap">
                    {isCatalogSyncing
                      ? t('POS_SYNC_ALL_PRODUCTS_LOADING')
                      : t('POS_SYNC_ALL_PRODUCTS')}
                  </span>
                  {syncMetaLabel ? (
                    <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold leading-none">
                      {syncMetaLabel}
                    </span>
                  ) : null}
                </Button>
                <span className="my-2 h-auto w-px bg-mainBorder/70" />
                {/* Search Field */}
                <div className="relative order-4 min-w-0 flex-1">
                  <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center justify-center text-secText/50">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input
                    ref={productSearchInputRef}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchInput(e.target.value)
                    }
                    defaultValue=""
                    placeholder={t('POS_SEARCH_PLACEHOLDER')}
                    className="h-11 w-full rounded-none border-0 bg-white pl-9 text-sm shadow-none focus:bg-white focus:ring-0"
                  />
                </div>
                <span className="my-2 h-auto w-px bg-mainBorder/70" />

                {canRefund && (
                  <>
                  <Button
                    type="button"
                    variant="outline"
                    className="order-3 h-11 shrink-0 rounded-none border-0 border-destructive/30 bg-white px-3 text-destructive shadow-none hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setIsRefundDialogOpen(true)}
                  >
                    <RotateCcw className="me-1 h-3.5 w-3.5" />
                    <span className="text-xs font-semibold">{t('POS_REFUND')}</span>
                  </Button>
                  <span className="my-2 h-auto w-px bg-mainBorder/70" />
                  </>
                )}

                {/* Barcode Field */}
                <div className="relative order-5 w-[34%] min-w-[170px]">
                  <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center justify-center text-secText/50">
                    <ScanBarcode className="h-4 w-4" />
                  </div>
                  <Input
                    ref={barcodeInputRef}
                    autoFocus
                    value={barcodeInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBarcodeInput(e.target.value)
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        enqueueBarcode();
                      }
                    }}
                    placeholder={lastScanMessage || t('SCAN')}
                    className={`h-11 w-full rounded-none border-0 pl-9 text-sm shadow-none transition-all duration-300 focus:ring-0 ${
                      lastScanStatus === 'success'
                        ? 'border-emerald-500 bg-emerald-50/30 text-emerald-900 placeholder:text-emerald-700/50'
                        : lastScanStatus === 'error'
                        ? 'border-red-500 bg-red-50/30 text-red-900 placeholder:text-red-700/50'
                        : 'bg-gray-50/50 focus:bg-white'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-mainBorder/40 bg-gray-50/60 px-3 py-1.5">
              <span
                className={`inline-flex max-w-[min(100%,28rem)] items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-tight ${
                  isCatalogSyncing
                    ? 'bg-indigo-100 text-indigo-900'
                    : localCatalogCount !== null && localCatalogCount > 0
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-950'
                }`}
              >
                {isCatalogSyncing
                  ? t('POS_CATALOG_LOADING_SHORT')
                  : localCatalogCount !== null && localCatalogCount > 0
                    ? t('POS_CATALOG_READY_COUNT', {
                        count: localCatalogCount,
                      })
                    : t('POS_CATALOG_EMPTY_HINT')}
              </span>
              <label
                className="flex cursor-pointer select-none items-center gap-1.5 text-[11px] text-mainText"
                title={t('POS_BARCODE_NAME_FALLBACK_HINT')}
              >
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-mainBorder text-main accent-main"
                  checked={barcodeNameFallbackEnabled}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setBarcodeNameFallbackEnabled(on);
                    if (typeof window !== 'undefined') {
                      window.localStorage.setItem(
                        POS_BARCODE_NAME_FALLBACK_KEY,
                        on ? '1' : '0'
                      );
                    }
                  }}
                />
                <span className="whitespace-nowrap">{t('POS_BARCODE_NAME_FALLBACK')}</span>
              </label>
            </div>

            {/* Categories Row - Touch-first */}
            <div
              id="tour-categories"
              className="flex w-full snap-x snap-mandatory items-center gap-2 overflow-x-auto whitespace-nowrap border-t border-mainBorder/50 px-3 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {categoryOptions.map((category: any) => {
                const isActive = activeCategory === category.id;
                const categoryStyle = getCategoryStyle(category.name);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    style={{
                      backgroundColor: isActive ? categoryStyle.activeBg : categoryStyle.bg,
                      borderColor: isActive ? categoryStyle.activeBorder : categoryStyle.border,
                      color: CATEGORY_TEXT_COLOR,
                    }}
                    className={`relative flex h-11 min-w-[108px] snap-start shrink-0 items-center justify-center rounded-lg border px-3.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? 'shadow-sm ring-1 ring-black/5'
                        : 'opacity-95 hover:opacity-100 hover:shadow-sm'
                    }`}
                  >
                    <span className="capitalize">
                      {category.id === 'all' ? t('ALL') : category.name}
                    </span>
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-1.5 right-1.5 h-[3px] rounded-full"
                        style={{ backgroundColor: categoryStyle.activeBorder }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Products Area */}
          <div className="flex-1 overflow-y-auto p-3">
            <div id="tour-products" className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 pb-20">
              {isLoading && products.length === 0 ? (
                <CardGridSkeleton count={12} />
              ) : (
                visibleProducts?.map((item: any, index: any) => (
                  <CardItem key={item.id} index={index} item={item} />
                ))
              )}
            </div>
            {hasMore && <div ref={lastElementRef} className="h-4 w-full opacity-0" />}
            {isFetching && products.length > 0 && (
              <div className="flex w-full justify-center pb-4 pt-2">
                <span className="text-sm font-medium text-secText">
                  {t('LOADING')}...
                </span>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </div>
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
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <label className="mb-1.5 block text-sm font-medium text-secText">
                  {t('POS_REFUND_DATE_RANGE')}
                </label>
                <RangePicker
                  value={refundDateRange}
                  onChange={(dates) => {
                    if (dates?.[0] && dates?.[1]) {
                      setRefundDateRange([dates[0], dates[1]]);
                    }
                  }}
                  className="h-11 w-full min-w-0 border-mainBorder"
                  placeholder={[t('START_DATE'), t('END_DATE')]}
                />
              </div>
              <div className="min-w-0 flex-1">
                <label className="mb-1.5 block text-sm font-medium text-secText opacity-0 select-none">
                  {'\u00a0'}
                </label>
                <Input
                  value={refundSearch}
                  onChange={(e) => setRefundSearch(e.target.value)}
                  placeholder={t('POS_REFUND_SEARCH_PLACEHOLDER')}
                  className="h-11"
                />
              </div>
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
      {isShortcutsHelpOpen && (
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
      )}
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />
      <AlertDialogComp open={isCreateTagOpen} onOpenChange={setIsCreateTagOpen}>
        <AlertDialogContentComp className="right-0 w-fit border-0 bg-transparent p-0 shadow-none">
          <button
            onClick={() => setIsCreateTagOpen(false)}
            className="absolute -left-5 top-6 z-[100] flex h-10 w-10 items-center justify-center rounded-full border border-mainBorder bg-white text-mainText shadow-sm transition hover:scale-105"
          >
            <XIcons />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[100dvh] w-[390px] max-w-[calc(100vw-48px)] overflow-x-hidden overflow-y-auto bg-white"
          >
            <AlertDialogTitleComp className="sr-only">
              {t('CREATE_NEW_ORDER_TAG')}
            </AlertDialogTitleComp>
            <AlertDialogDescriptionComp className="sr-only">
              {t('ENTER_NEW_ORDER_TAG_NAME')}
            </AlertDialogDescriptionComp>
            <div className="border-b border-mainBorder px-7 py-6 text-center">
              <div className="text-3xl font-semibold text-mainText">
                {isEditTagMode ? t('EDIT') : t('CREATE_NEW_ORDER_TAG')}
              </div>
              <div className="mt-2 text-sm text-secText">
                {t('ENTER_NEW_ORDER_TAG_NAME')}
              </div>
            </div>
            <div className="px-7 py-6">
              <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                {t('ORDER_TAGS')}
              </label>
              <Input
                value={newTagName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewTagName(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveTag();
                  }
                }}
                placeholder={t('ENTER_NEW_ORDER_TAG_NAME')}
                className="h-11 rounded-md border-mainBorder bg-white px-3 text-sm"
              />
            </div>
            <div className="sticky bottom-0 border-t border-mainBorder bg-white px-7 py-4">
              <Button
                type="button"
                loading={isCreatingTag}
                disabled={isCreatingTag}
                onClick={saveTag}
                className="h-11 w-full rounded-md text-base font-semibold"
              >
                {isEditTagMode ? t('EDIT') : t('CREATE_NEW_ORDER_TAG')}
              </Button>
            </div>
          </div>
        </AlertDialogContentComp>
      </AlertDialogComp>
      <AlertDialogComp
        open={isCreateProductOpen}
        onOpenChange={(open) => {
          setIsCreateProductOpen(open);
          if (!open) {
            setQuickProductImage(null);
            setQuickProductImageLookupUrl('');
            setBarcodeLookupStatus('idle');
            setBarcodeLookupMessage(t('POS_BARCODE_LOOKUP_HINT'));
          }
        }}
      >
        <AlertDialogContentComp className="right-0 w-fit border-0 bg-transparent p-0 shadow-none">
          <button
            onClick={() => setIsCreateProductOpen(false)}
            className="absolute -left-5 top-6 z-[100] flex h-10 w-10 items-center justify-center rounded-full border border-mainBorder bg-white text-mainText shadow-sm transition hover:scale-105"
          >
            <XIcons />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[100dvh] w-[390px] max-w-[calc(100vw-48px)] overflow-y-auto bg-white"
          >
            <AlertDialogTitleComp className="sr-only">
              {t('POS_ADD_PRODUCT_WITH_BARCODE')}
            </AlertDialogTitleComp>
            <AlertDialogDescriptionComp className="sr-only">
              {t('PRODUCT_NAME')}
            </AlertDialogDescriptionComp>
            <div className="border-b border-mainBorder px-7 py-5">
              <div className="mb-1.5 text-right text-sm font-medium text-secText">
                {t('PRODUCT_IMAGE')}
              </div>
              <input
                ref={quickProductImageInputRef}
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const selectedFile = e.target.files?.[0] ?? null;
                  setQuickProductImage(selectedFile);
                  if (selectedFile) {
                    setQuickProductImageLookupUrl('');
                  }
                }}
                className="hidden"
              />
              {(quickProductImagePreview || quickProductImageLookupUrl) ? (
                <div className="overflow-hidden rounded-xl border border-mainBorder bg-white shadow-sm">
                  <img
                    src={quickProductImagePreview || quickProductImageLookupUrl}
                    alt="product preview"
                    className="h-40 w-full bg-gray-100 object-cover"
                  />
                  <div className="space-y-2 p-3">
                    <div className="min-w-0 text-xs text-secText">
                      <p className="truncate font-medium text-mainText">
                        {quickProductImage?.name || t('PRODUCT_IMAGE')}
                      </p>
                      <p className="mt-0.5">
                        {quickProductImage?.size ? `${(quickProductImage.size / 1024).toFixed(1)} KB` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 flex-1 rounded-md px-2.5 text-xs"
                        onClick={() => quickProductImageInputRef.current?.click()}
                      >
                        {t('EDIT')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 flex-1 rounded-md border-red-200 px-2.5 text-xs text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setQuickProductImage(null);
                          setQuickProductImageLookupUrl('');
                        }}
                      >
                        {t('DELETE')}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => quickProductImageInputRef.current?.click()}
                  className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-mainBorder bg-gray-50/70 text-secText transition hover:border-main/40 hover:bg-main/5"
                >
                  <ImageIcon className="h-5 w-5 text-main/70" />
                  <span className="text-xs font-medium">{t('UPLOAD_IMAGE')}</span>
                </button>
              )}
            </div>
            <div className="space-y-4 px-7 py-6">
              <div>
                <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                  {t('PRODUCT_NAME')}
                </label>
                <Input
                  value={quickProductForm.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setQuickProductForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="h-11 rounded-md border-mainBorder bg-white px-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                  {t('BARCODE')}
                </label>
                <div className="flex w-full items-stretch gap-2 overflow-hidden">
                  <Input
                    value={quickProductForm.sku}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setQuickProductForm((prev) => ({ ...prev, sku: e.target.value }));
                      setBarcodeLookupStatus('idle');
                      setBarcodeLookupMessage(t('POS_BARCODE_LOOKUP_HINT'));
                    }}
                    className="h-11 min-w-0 flex-1 rounded-md border-mainBorder bg-white px-3 text-sm"
                    dir="ltr"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 shrink-0 whitespace-nowrap gap-1.5 rounded-md border-main/25 bg-main/5 px-2.5 text-main hover:bg-main/10"
                    onClick={() => void lookupBarcodeDetails(undefined, { force: true })}
                    disabled={isBarcodeLookupLoading || !quickProductForm.sku.trim()}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isBarcodeLookupLoading ? 'animate-spin' : ''}`}
                    />
                    <span className="text-xs font-semibold">{t('POS_BARCODE_LOOKUP_FETCH')}</span>
                  </Button>
                </div>
                <div
                  className={`mt-2 flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs ${
                    barcodeLookupStatus === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : barcodeLookupStatus === 'error' || barcodeLookupStatus === 'not_found'
                        ? 'border-red-200 bg-red-50 text-red-800'
                        : barcodeLookupStatus === 'loading'
                          ? 'border-indigo-200 bg-indigo-50 text-indigo-800'
                          : 'border-mainBorder bg-gray-50/70 text-secText'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      barcodeLookupStatus === 'success'
                        ? 'bg-emerald-500'
                        : barcodeLookupStatus === 'error' || barcodeLookupStatus === 'not_found'
                          ? 'bg-red-500'
                          : barcodeLookupStatus === 'loading'
                            ? 'animate-pulse bg-indigo-500'
                            : 'bg-gray-400'
                    }`}
                  />
                  <span className="truncate">
                    {barcodeLookupMessage || t('POS_BARCODE_LOOKUP_HINT')}
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                  {t('CATEGORY_NAME')}
                </label>
                <select
                  value={quickProductForm.category_id}
                  onChange={(e) =>
                    setQuickProductForm((prev) => ({
                      ...prev,
                      category_id: e.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-md border border-mainBorder bg-white px-3 text-sm outline-none focus:ring-1 focus:ring-main/20"
                >
                  <option value="">{t('CATEGORY_NAME')}</option>
                  {productCategoryOptions.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 [&>*]:min-w-0">
                <div>
                  <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                    {t('PRICE')}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={quickProductForm.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setQuickProductForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="h-10 w-full rounded-lg border-mainBorder bg-white px-3 text-sm tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-right text-sm font-medium text-secText">
                    {t('CURRENT_QUANTITY')}
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={quickProductForm.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setQuickProductForm((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-lg border-mainBorder bg-white px-3 text-sm tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 border-t border-mainBorder bg-white px-7 py-4">
              <Button
                type="button"
                loading={isCreatingProduct}
                disabled={isCreatingProduct}
                onClick={saveQuickProduct}
                className="h-11 w-full rounded-md text-base font-semibold"
              >
                {t('ADD_PRODUCT')}
              </Button>
            </div>
          </div>
        </AlertDialogContentComp>
      </AlertDialogComp>
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

      {isLocked && (
        <PinLoginScreen
          onClose={() => setIsLocked(false)}
          isLockScreen={true}
        />
      )}
    </>
  );
};
