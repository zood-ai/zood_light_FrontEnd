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
  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const selectedCustomerId = useSelector((state: any) => state.orderSchema.customer_id);
  const { showToast } = useToast();
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
  const PAGE_SIZE = 24;
  const MAX_CONCURRENT_SCANS = 3;
  const SCAN_REQUEST_TIMEOUT_MS = 3000;
  const NOT_FOUND_CACHE_TTL_MS = 15000;
  const store = useStore();
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
    return products.filter((product: any) => {
      const categoryName =
        product?.category?.name ||
        product?.category_name ||
        product?.category?.name_en ||
        '';
      return String(categoryName).toLowerCase() === activeCategory;
    });
  }, [activeCategory, products]);

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    products.forEach((product: any) => {
      const categoryName =
        product?.category?.name ||
        product?.category_name ||
        product?.category?.name_en ||
        '';
      if (categoryName) {
        categories.add(String(categoryName).toLowerCase());
      }
    });
    return ['all', ...Array.from(categories)];
  }, [products]);
  const { data: customersData } = createCrudService<any>(
    'manage/customers?perPage=100000'
  ).useGetAll();
  const selectedCustomerName =
    customersData?.data?.find((customer: any) => customer.id === selectedCustomerId)
      ?.name || '';

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['individual-invoices-products', debouncedSearch, page],
    queryFn: async () => {
      const response = await axiosInstance.get('menu/products', {
        params: {
          not_default: 1,
          per_page: PAGE_SIZE,
          sort: '-created_at',
          page,
          ...(debouncedSearch ? { 'filter[name]': debouncedSearch } : {}),
        },
      });
      return response.data;
    },
  });

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
    setDiscountAmount(Number(parkedOrder.discount_amount || 0));
  };
  const deleteParkedOrder = (parkedId: string) => {
    setParkedOrders((prev) => prev.filter((order) => order.id !== parkedId));
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

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [debouncedSearch]);

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
      <div className="sticky top-2 z-20 mb-5 rounded-xl border border-mainBorder bg-background/95 p-4 shadow-sm backdrop-blur">
        <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-12">
          <Button
            type="button"
            variant="outline"
            className="h-10 md:col-span-2"
            onClick={() => setIsOpen(true)}
          >
            {t('POS_EXIT')}
          </Button>
          <div className="md:col-span-7">
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchInput(e.target.value)
              }
              defaultValue=""
              placeholder={t('SEARCH_TABLE_PLACEHOLDER')}
              className="h-10 w-full"
            />
          </div>
          <div className="md:col-span-3">
            <div
              className={`h-10 rounded-md border px-3 text-sm flex items-center ${
                lastScanStatus === 'success'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : lastScanStatus === 'error'
                  ? 'border-red-300 bg-red-50 text-red-700'
                  : 'border-mainBorder bg-background text-mainText'
              }`}
            >
              <div className="truncate w-full">
                <span className="text-xs opacity-80">{t('POS_LAST_SCAN')}:</span>{' '}
                <span className="font-medium">{lastScanMessage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4 xl:self-start">
          <div className="flex flex-col overflow-hidden rounded-xl border border-mainBorder bg-background p-3 xl:sticky xl:top-[150px] xl:h-[calc(100dvh-170px)]">
            <div className="mb-3 flex h-10 items-center justify-between">
              <div className="w-full max-w-[240px]">
                <CustomSearchInbox
                  options={customersData?.data?.map((customer: any) => ({
                    value: customer.id,
                    label: customer.name,
                  }))}
                  placeholder="CUSTOMER_NAME"
                  onValueChange={(value: string) =>
                    dispatch(updateField({ field: 'customer_id', value }))
                  }
                  className="h-full w-full"
                  triggerClassName="h-full min-h-10 justify-start border-0 bg-transparent px-0 text-mainText shadow-none hover:bg-transparent"
                  hideChevron
                  value={selectedCustomerId}
                  directValue={selectedCustomerName}
                />
              </div>
              <span className="flex h-full items-center text-xs leading-none text-secText">
                {cartItemsCount} {t('QUANTITY')}
              </span>
            </div>
            <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 text-xs"
                onClick={parkCurrentOrder}
                disabled={cardItemValue.length === 0}
              >
                {t('PARK_ORDER')}
              </Button>
              <div className="flex h-9 items-center rounded border border-mainBorder px-2 text-xs text-secText">
                {t('PARKED_ORDERS')}: {parkedOrders.length}
              </div>
            </div>
            {parkedOrders.length > 0 && (
              <div className="mb-2 max-h-[120px] space-y-1 overflow-y-auto rounded border border-mainBorder/70 p-2">
                {parkedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded bg-mainBg px-2 py-1 text-xs"
                  >
                    <div className="truncate">
                      {order.customer_name || t('CUSTOMER_NAME')} - SR{' '}
                      {Number(order.total || 0).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-main"
                        onClick={() => resumeParkedOrder(order.id)}
                      >
                        {t('RESUME_ORDER')}
                      </button>
                      <button
                        type="button"
                        className="text-destructive"
                        onClick={() => deleteParkedOrder(order.id)}
                      >
                        {t('DELETE')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div
              ref={cartListRef}
              className="mt-1 flex-1 space-y-2 overflow-y-auto pe-1"
            >
              {cardItemValue.length === 0 ? (
                <div className="rounded-md border border-dashed border-mainBorder px-3 py-6 text-center text-sm text-secText">
                  {t('POS_CART_EMPTY')}
                </div>
              ) : (
                cardItemValue.map((item: any) => (
                  <div
                    key={item.id}
                    data-cart-item-id={item.id}
                    className="flex items-center justify-between rounded-md border border-mainBorder px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-secText">
                        {item.qty} x SR {Number(item.price || 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => adjustCartItemQty(item.id, -1)}
                        className="h-7 w-7 rounded border border-mainBorder text-sm"
                      >
                        -
                      </button>
                      <Input
                        type="number"
                        min={0}
                        value={item.qty}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setCartItemQty(item.id, e.target.value)
                        }
                        className="!h-7 !w-[62px] !min-w-[62px] px-1 text-center text-sm font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => adjustCartItemQty(item.id, 1)}
                        className="h-7 w-7 rounded border border-mainBorder text-sm"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.id)}
                        className="ms-1 text-xs text-destructive"
                      >
                        {t('DELETE')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-3 rounded-md bg-[#F7F8FC] px-3 py-2 text-sm">
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
              type="button"
              onClick={() => navigate('shop-card')}
              disabled={cardItemValue.length === 0}
              className="mt-3 h-10 w-full"
            >
              {t('POS_PROCEED_PAYMENT')}
            </Button>
          </div>
        </div>
        <div className="xl:col-span-8 xl:h-[calc(100dvh-170px)] xl:overflow-y-auto xl:pe-1">
          <div className="sticky top-0 z-20 mb-3 grid grid-cols-1 gap-2 bg-mainBg pb-2 xl:h-10 xl:grid-cols-12 xl:items-stretch xl:gap-3">
            <div className="flex h-10 flex-nowrap items-center gap-2 overflow-x-auto xl:col-span-6 xl:h-full xl:whitespace-nowrap">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`inline-flex h-10 shrink-0 items-center rounded-md px-3 text-sm xl:h-full ${
                    activeCategory === category
                      ? 'bg-main text-white'
                      : 'border border-mainBorder bg-background text-mainText'
                  }`}
                >
                  {category === 'all' ? t('ALL') : category}
                </button>
              ))}
            </div>
            <div className="xl:col-span-6 xl:h-full">
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
                placeholder={t('SCAN_BARCODE_PLACEHOLDER')}
                className="h-10 w-full xl:h-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(185px,1fr))] gap-4">
            {isLoading && products.length === 0 ? (
              <CardGridSkeleton count={12} />
            ) : (
              visibleProducts?.map((item: any, index: any) => (
                <CardItem key={item.id} index={index} item={item} />
              ))
            )}
          </div>
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isFetching}
                className="rounded-md border border-mainBorder bg-background px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFetching ? t('LOADING') : t('LOAD_MORE')}
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />
    </>
  );
};
