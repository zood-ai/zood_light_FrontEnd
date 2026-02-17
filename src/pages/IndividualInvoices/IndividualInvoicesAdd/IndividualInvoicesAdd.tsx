import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { IndividualInvoicesAddProps } from './IndividualInvoicesAdd.types';

import './IndividualInvoicesAdd.css';
import { useTranslation } from 'react-i18next';
import { CardItem } from '@/components/CardItem';
import { useDispatch, useSelector, useStore } from 'react-redux';
import ConfirmBk from '@/components/custom/ConfimBk';
import { resetOrder, updateField } from '@/store/slices/orderSchema';
import { CardGridSkeleton } from '@/components/CardItem/components/CardGridSkeleton';
import { useQuery } from '@tanstack/react-query';
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
  User,
  Plus,
  Pencil,
  X,
  HelpCircle,
} from 'lucide-react';
import SH_LOGO from '@/assets/SH_LOGO.svg';

const CATEGORY_COLOR_PALETTE = [
  { bg: '#BDEAE8', border: '#A2D7D4', activeBg: '#A6D9D5', activeBorder: '#86C6C1' },
  { bg: '#EBCBA3', border: '#DCB686', activeBg: '#E1BC8E', activeBorder: '#D3A96F' },
  { bg: '#BFE3C1', border: '#A1CFA3', activeBg: '#A9D3AC', activeBorder: '#89BE8D' },
  { bg: '#E9A7A7', border: '#D98F8F', activeBg: '#DE9595', activeBorder: '#CC7474' },
  { bg: '#C7D7F0', border: '#ACBFDF', activeBg: '#B4C8E8', activeBorder: '#96ADD5' },
  { bg: '#E4C8EB', border: '#D3ADDC', activeBg: '#D9B6E2', activeBorder: '#C595D2' },
] as const;

const CATEGORY_TEXT_COLOR = '#1D2735';

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
  const PARKED_ORDERS_KEY = 'pos_parked_orders_v1';
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
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
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [isEditCustomerMode, setIsEditCustomerMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState('');
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
  const selectedCustomerId = orderSchema?.customer_id;
  const [selectedCartItemId, setSelectedCartItemId] = useState<string | null>(null);
  const { showToast } = useToast();

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
  const scannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const cartListRef = useRef<HTMLDivElement | null>(null);
  const prevCartIdsRef = useRef<string[]>([]);
  const barcodeCacheRef = useRef<Map<string, any>>(new Map());
  const notFoundBarcodeCacheRef = useRef<Map<string, number>>(new Map());
  const barcodeQueueRef = useRef<string[]>([]);
  const pendingCountByBarcodeRef = useRef<Map<string, number>>(new Map());
  const rawBarcodeByKeyRef = useRef<Map<string, string>>(new Map());
  const inFlightBarcodesRef = useRef<Set<string>>(new Set());
  const activeRequestsRef = useRef(0);
  const PAGE_SIZE = 50;
  const MAX_CONCURRENT_SCANS = 3;
  const SCAN_REQUEST_TIMEOUT_MS = 3000;
  const NOT_FOUND_CACHE_TTL_MS = 15000;
  const store = useStore<any>();
  const navigate = useNavigate();
  const cartItemsCount = cardItemValue.reduce(
    (acc: number, item: any) => acc + Number(item?.qty || 0),
    0
  );
  const cartTotal = cardItemValue.reduce(
    (acc: number, item: any) =>
      acc + Number(item?.price || 0) * Number(item?.qty || 0),
    0
  );
  const { data: settingsData } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: taxesData } = createCrudService<any>('manage/taxes').useGetAll();
  const vatRate = Number(taxesData?.data?.[0]?.rate || 15);
  const isTaxInclusive = Boolean(settingsData?.data?.tax_inclusive_pricing);
  const subtotalAmountBeforeDiscount = isTaxInclusive
    ? cartTotal / (1 + vatRate / 100)
    : cartTotal;
  const discountOnSubtotal = isTaxInclusive
    ? discountAmount / (1 + vatRate / 100)
    : discountAmount;
  const subtotalAmount = Math.max(
    0,
    subtotalAmountBeforeDiscount - discountOnSubtotal
  );
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

  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(resetCard());
    dispatch(resetOrder());
  }, [dispatch]);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(PARKED_ORDERS_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setParkedOrders(parsed);
      }
    } catch {
      setParkedOrders([]);
    }
  }, []);
  useEffect(() => {
    window.localStorage.setItem(PARKED_ORDERS_KEY, JSON.stringify(parkedOrders));
  }, [parkedOrders]);
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

      if (existingItem) {
        const updatedItems = latestCardItems.map((cartItem: any) =>
          cartItem.id === product.id
            ? { ...cartItem, qty: Number(cartItem.qty || 0) + incrementBy }
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
          },
        ])
      );
    },
    [dispatch, store]
  );

  const normalizeBarcode = (value: string) => value.trim().toLowerCase();

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
      try {
        const skuResponse = await axiosInstance.get('menu/products', {
          timeout: SCAN_REQUEST_TIMEOUT_MS,
          params: {
            not_default: 1,
            per_page: 1,
            'filter[sku]': rawBarcode,
          },
        });

        let matchedProduct = skuResponse?.data?.data?.[0];

        // Some stores encode printable barcode in name field.
        if (!matchedProduct) {
          const nameResponse = await axiosInstance.get('menu/products', {
            timeout: SCAN_REQUEST_TIMEOUT_MS,
            params: {
              not_default: 1,
              per_page: 1,
              'filter[name]': rawBarcode,
            },
          });
          matchedProduct = nameResponse?.data?.data?.[0];
        }
        const pendingCount = pendingCountByBarcodeRef.current.get(barcodeKey) || 0;

        pendingCountByBarcodeRef.current.delete(barcodeKey);
        rawBarcodeByKeyRef.current.delete(barcodeKey);

        if (matchedProduct && pendingCount > 0) {
          const sku = String(matchedProduct?.sku || '');
          if (sku) {
            barcodeCacheRef.current.set(normalizeBarcode(sku), matchedProduct);
          }
          notFoundBarcodeCacheRef.current.delete(barcodeKey);
          addOrIncrementCardItem(matchedProduct, pendingCount);
          setLastScanStatus('success');
          setLastScanMessage(`${matchedProduct.name} x${pendingCount}`);
          playScannerTone('success');
          return;
        }

        notFoundBarcodeCacheRef.current.set(barcodeKey, Date.now());
        setLastScanStatus('error');
        setLastScanMessage(rawBarcode);
        playScannerTone('error');
        showToast({
          description: t('PRODUCT_NOT_FOUND_BY_BARCODE'),
          duration: 1800,
          variant: 'destructive',
        });
      } catch (error) {
        pendingCountByBarcodeRef.current.delete(barcodeKey);
        rawBarcodeByKeyRef.current.delete(barcodeKey);
        setLastScanStatus('error');
        setLastScanMessage(rawBarcode);
        playScannerTone('error');
        showToast({
          description: t('BARCODE_SEARCH_FAILED'),
          duration: 1800,
          variant: 'destructive',
        });
      } finally {
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
      const cachedProduct = barcodeCacheRef.current.get(barcodeKey);
      if (cachedProduct) {
        addOrIncrementCardItem(cachedProduct, 1);
        setLastScanStatus('success');
        setLastScanMessage(`${cachedProduct.name} x1`);
        playScannerTone('success');
        setBarcodeInput('');
        return;
      }

      const lastNotFoundAt = notFoundBarcodeCacheRef.current.get(barcodeKey);
      if (
        lastNotFoundAt &&
        Date.now() - lastNotFoundAt < NOT_FOUND_CACHE_TTL_MS
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
    setDiscountAmount(0);
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
    setDiscountAmount(Number(parkedOrder.discount_amount || 0));
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
      if (sampleTag && 'type' in sampleTag && sampleTag?.type) {
        payload.type = sampleTag.type;
      }
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
      } else {
        cartListRef.current.scrollTo({
          top: cartListRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }

    prevCartIdsRef.current = currentIds;
  }, [cardItemValue]);

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

  return (
    <>
      <div className="pos-container fixed inset-0 z-50 flex h-full w-full flex-col overflow-hidden bg-background md:flex-row md:flex-nowrap">
        {/* Left Side: Cart & Actions */}
        <div className="flex w-full shrink-0 flex-col border-b border-mainBorder bg-background md:h-full md:w-[300px] md:border-b-0 md:border-e lg:w-[340px] xl:w-[380px]">
          <div className="flex shrink-0 items-center justify-between border-b border-mainBorder bg-white px-3 py-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <img src={SH_LOGO} alt="Logo" className="h-8 w-auto object-contain" />
              <span className="hidden text-sm font-semibold text-mainText sm:block">
                {t('POS')}
              </span>
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
                {parkedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded bg-white px-2 py-1 text-[10px] shadow-sm"
                  >
                    <div className="truncate text-mainText">
                      <span className="font-semibold">{order.customer_name || t('GUEST')}</span>
                      <span className="mx-1 text-secText">-</span>
                      <span>SR {Number(order.total || 0).toFixed(2)}</span>
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
                ))}
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
                    onClick={() =>
                      setSelectedCartItemId(
                        selectedCartItemId === item.id ? null : item.id
                      )
                    }
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
                          SR {Number(item.price || 0).toFixed(2)}
                        </span>
                        <span className="mx-1 h-3 w-[1px] bg-gray-200"></span>
                        <span className="font-bold text-mainText">
                          SR {(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 transition-opacity duration-200 ${
                        selectedCartItemId === item.id
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Compact Quantity Control */}
                      <div className="flex h-7 items-center overflow-hidden rounded-md border border-mainBorder bg-gray-50">
                        <button
                          type="button"
                          onClick={() => adjustCartItemQty(item.id, 1)}
                          className="flex h-full w-7 items-center justify-center text-secText transition-colors hover:bg-white hover:text-mainText active:bg-gray-100"
                        >
                          +
                        </button>
                        <div className="h-full w-[1px] bg-mainBorder" />
                        <Input
                          type="number"
                          min={0}
                          value={item.qty}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setCartItemQty(item.id, e.target.value)
                          }
                          className="!h-full !w-[40px] !min-w-[40px] rounded-none border-0 bg-white px-0 text-center text-xs font-semibold focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <div className="h-full w-[1px] bg-mainBorder" />
                        <button
                          type="button"
                          onClick={() => adjustCartItemQty(item.id, -1)}
                          className="flex h-full w-7 items-center justify-center text-secText transition-colors hover:bg-white hover:text-mainText active:bg-gray-100"
                        >
                          -
                        </button>
                      </div>

                      {/* Delete Icon */}
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.id)}
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
                  SR {subtotalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-secText">{t('DISCOUNT')}</span>
                <div className="w-[120px]">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={discountAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const normalized = e.target.value.replace(',', '.');
                      const requested = Math.max(0, Number(normalized || 0));
                      const maxAllowed = isTaxInclusive
                        ? cartTotal
                        : subtotalAmountBeforeDiscount;
                      const clamped = Math.min(requested, maxAllowed);
                      setDiscountAmount(Number(clamped.toFixed(2)));
                    }}
                    className="!h-8 !w-[88px] !min-w-[88px] px-2 text-right"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-secText">
                  {t('TAX')} {vatRate}%
                </span>
                <span className="font-medium">SR {vatAmount.toFixed(2)}</span>
              </div>
              <div className="my-1 border-t border-mainBorder/50" />
              <div className="flex items-center justify-between py-1">
                <span className="font-semibold">{t('TOTAL_AMOUNT')}</span>
                <span className="font-bold">SR {grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <Button
              id="tour-payment"
              type="button"
              onClick={() => navigate('shop-card')}
              disabled={cardItemValue.length === 0}
              className="mt-2 h-12 w-full text-base font-semibold"
            >
              {t('POS_PROCEED_PAYMENT')}
            </Button>
          </div>
        </div>

        {/* Right Side: Products Grid */}
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-gray-50/50">
          {/* Odoo-style Header: Compact & Clean */}
          <div className="z-10 flex w-full flex-col border-b border-mainBorder bg-white shadow-sm">
            {/* Top Row: Navigation & Search */}
            <div className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(true)}
                  className="h-8 w-8 text-secText hover:bg-destructive/10 hover:text-destructive"
                  title={t('POS_EXIT')}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <div className="hidden h-6 w-[1px] bg-gray-200 sm:block" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={startTour}
                  className="h-8 w-8 text-secText hover:bg-main/10 hover:text-main"
                  title={t('HELP_TOUR')}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-1 items-center justify-end gap-3 md:max-w-xl">
                {/* Search Field */}
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center justify-center text-secText/50">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchInput(e.target.value)
                    }
                    defaultValue=""
                    placeholder={t('POS_SEARCH_PLACEHOLDER')}
                    className="h-9 w-full rounded-md border-mainBorder bg-gray-50/50 pl-9 text-sm focus:bg-white focus:ring-1 focus:ring-main/20"
                  />
                </div>

                {/* Barcode Field */}
                <div className="relative w-1/3 min-w-[140px]">
                  <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center justify-center text-secText/50">
                    <ScanBarcode className="h-4 w-4" />
                  </div>
                  <Input
                    autoFocus
                    value={barcodeInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBarcodeInput(e.target.value)
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        enqueueBarcode();
                      }
                    }}
                    placeholder={lastScanMessage || t('SCAN')}
                    className={`h-9 w-full rounded-md border-mainBorder pl-9 text-sm transition-all duration-300 focus:ring-1 focus:ring-main/20 ${
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

            {/* Categories Row - Compact */}
            <div id="tour-categories" className="flex w-full items-center gap-1.5 overflow-x-auto whitespace-nowrap border-t border-mainBorder/50 px-3 py-1.5">
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
                    className={`relative flex h-8 min-w-[80px] shrink-0 items-center justify-center rounded border px-3 text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'font-bold shadow-sm ring-1 ring-black/5'
                        : 'opacity-90 hover:opacity-100 hover:shadow-sm'
                    }`}
                  >
                    <span className="capitalize">
                      {category.id === 'all' ? t('ALL') : category.name}
                    </span>
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b"
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
        </div>
      </div>
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
            className="relative h-[100dvh] w-[390px] max-w-[calc(100vw-48px)] overflow-y-auto bg-white"
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
    </>
  );
};
