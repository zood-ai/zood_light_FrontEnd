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
  Lock,
  Delete,
  Image as ImageIcon,
  Layers,
  Percent,
} from 'lucide-react';
import PinLoginScreen from '../components/PinLoginScreen';
import SH_LOGO from '@/assets/SH_LOGO.svg';
import Cookies from 'js-cookie';

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
  const { t } = useTranslation();
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
  const [showPinLogin, setShowPinLogin] = useState(false);
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
  const currentCashier = useSelector((state: any) => state.posCashier?.currentCashier);
  const branchId = orderSchema?.branch_id || Cookies.get('branch_id') || '';
  const parkedOrdersKey = `pos_parked_orders_v1_${branchId || 'default'}`;
  const selectedCustomerId = orderSchema?.customer_id;
  const [selectedCartItemId, setSelectedCartItemId] = useState<string | null>(null);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { showToast } = useToast();

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
            discount_value: 0,
            discount_type: 'fixed',
            discount_amount: 0,
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

    // Determine target field and current value
    const targetField = editingItem._activeField || 'qty'; // Default to qty if not set
    const isDiscountValue = targetField === 'discount_value';
    const currentValue = String(editingItem[targetField] || (isDiscountValue ? '' : '0'));

    let nextValue = currentValue;

    if (key === 'backspace') {
      nextValue = currentValue.length > 1 ? currentValue.slice(0, -1) : (isDiscountValue ? '' : '0');
    } else if (key === 'clear') {
      nextValue = isDiscountValue ? '' : '0';
    } else if (key === '+10' || key === '+20' || key === '+50') {
        const increment = Number(key.replace('+', ''));
        const currentNum = Number(currentValue || 0);
        // If discount type is percent, cap at 100? or let it be flexible
        if (isDiscountValue && editingItem.discount_type === 'percent' && (currentNum + increment > 100)) {
             nextValue = '100';
        } else {
             nextValue = String(currentNum + increment);
        }
    } else if (key === '.') {
      if (!currentValue.includes('.')) {
        nextValue = currentValue + '.';
      }
    } else {
      // Append number
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
             const price = Number(item.price || 0);
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
                qty: qty,
                discount_value: numericValue,
                discount_type: editingItem.discount_type,
                discount_amount: Number(calculatedPerUnit.toFixed(4)),
                note: editingItem.note // Save note
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
        if (field === 'discount_value' || field === 'discount_type' || field === 'qty') {
             let calculatedPerUnit = 0;
             const numericValue = Number(next.discount_value || 0);
             const type = next.discount_type;
             const price = Number(next.price || 0);
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
            <button
              type="button"
              onClick={() => setShowPinLogin(true)}
              className="flex items-center gap-1.5 rounded-lg border border-mainBorder bg-white px-2.5 py-1.5 text-xs font-medium text-mainText shadow-sm hover:bg-gray-50 focus:ring-1 focus:ring-main/20"
              title={t('EMPLOYEE_LOGIN')}
            >
              <Lock className="h-4 w-4" />
              <span className="max-w-[80px] truncate">
                {currentCashier?.name || t('EMPLOYEE_LOGIN')}
              </span>
            </button>
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
                          SR {Number(item.price || 0).toFixed(2)}
                        </span>
                        {item.discount_amount > 0 && (
                          <span className="rounded bg-emerald-50 px-1 font-semibold text-emerald-600">
                             -{Number(item.discount_amount).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end shrink-0 ms-2">
                       <div className="text-sm font-bold text-mainText">
                          SR {(
                            (Number(item.price || 0) * Number(item.qty || 0)) - 
                            (Number(item.discount_amount || 0) * Number(item.qty || 0))
                          ).toFixed(2)}
                       </div>
                       {item.discount_amount > 0 && (
                         <div className="text-[10px] text-secText line-through decoration-red-400 decoration-1">
                           SR {(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}
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
                  SR {subtotalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-secText">{t('DISCOUNT')}</span>
                  <div className="flex h-6 w-fit items-center overflow-hidden rounded border border-mainBorder bg-white">
                    <button
                      type="button"
                      onClick={() => setDiscountType('fixed')}
                      className={`h-full px-2 text-[10px] font-bold transition-colors ${
                        discountType === 'fixed'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      SR
                    </button>
                    <div className="h-full w-[1px] bg-mainBorder" />
                    <button
                      type="button"
                      onClick={() => setDiscountType('percent')}
                      className={`h-full px-2 text-[10px] font-bold transition-colors ${
                        discountType === 'percent'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      %
                    </button>
                  </div>
                </div>
                <div className="w-[100px]">
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={discountValue}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setDiscountValue(val);
                    }}
                    className="!h-8 !w-full px-2 text-right"
                    placeholder={discountType === 'percent' ? '%' : 'SR'}
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
              onClick={() => {
                if (isEditItemOpen && editingItem) {
                  handleSaveEditItem();
                }
                navigate('shop-card');
              }}
              disabled={cardItemValue.length === 0}
              className="mt-2 h-12 w-full text-base font-semibold"
            >
              {t('POS_PROCEED_PAYMENT')}
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
                 <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveField('qty')}
                      className={`relative flex h-[110px] flex-col items-center justify-center gap-1 rounded-2xl border transition-all shadow-sm active:scale-95 overflow-hidden group ${
                        editingItem?._activeField === 'qty'
                          ? 'bg-[#5D5FEF] text-white ring-2 ring-offset-1 ring-[#5D5FEF] border-transparent'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-[#5D5FEF]/30'
                      }`}
                    >
                      <span className={`text-sm font-bold uppercase tracking-wider ${editingItem?._activeField === 'qty' ? 'text-white/80' : 'text-gray-400'}`}>
                        {t('QUANTITY')}
                      </span>
                      <span className="text-5xl font-black tracking-tight leading-none mt-1">
                        {editingItem?.qty || 0}
                      </span>
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
                      <span className={`text-sm font-bold uppercase tracking-wider ${editingItem?._activeField === 'discount_value' ? 'text-white/80' : 'text-gray-400'}`}>
                        {t('DISCOUNT')}
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-5xl font-black tracking-tight leading-none">
                          {editingItem?.discount_value || 0}
                        </span>
                        <span className="text-lg font-bold opacity-60">
                          {editingItem?.discount_type === 'percent' ? '%' : t('SAR', 'SR')}
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
                         {t('SAR', 'SR')}
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
                      <div className="text-center text-sm font-medium text-secText">
                        {t('UNIT_PRICE')}: <span className="font-bold text-main">SR {Number(editingItem?.price || 0).toFixed(2)}</span>
                      </div>
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
                           SR {(
                             (Number(editingItem?.price || 0) * Number(editingItem?.qty || 0)) - 
                             (Number(editingItem?.discount_amount || 0) * Number(editingItem?.qty || 0))
                           ).toFixed(2)}
                         </div>
                         {Number(editingItem?.discount_amount) > 0 && (
                            <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600 border border-emerald-100">
                              {t('SAVING')} {Number(editingItem.discount_amount * editingItem.qty).toFixed(2)} SR
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-12 gap-3">
                   <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        removeCartItem(editingItem?.id);
                        setIsEditItemOpen(false);
                      }}
                      className="col-span-4 h-[70px] rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 font-bold text-lg bg-white"
                    >
                      <Trash2 className="mr-2 h-6 w-6" />
                      {t('DELETE')}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveEditItem}
                      className="col-span-8 h-[70px] rounded-xl bg-[#5D5FEF] text-2xl font-bold text-white shadow-lg shadow-indigo-200 hover:bg-[#4B4DDB] active:scale-[0.98]"
                    >
                      {t('SAVE')}
                    </Button>
                </div>
              </div>
              
            </div>
            
            {/* Close Button Absolute - Left Side */}
             <button
              type="button"
              onClick={() => setIsEditItemOpen(false)}
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
          </>
          )}
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

      {showPinLogin && (
        <PinLoginScreen onClose={() => setShowPinLogin(false)} />
      )}
    </>
  );
};
