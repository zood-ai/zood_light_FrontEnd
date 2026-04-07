import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef } from 'react';
import { ViewModalProps } from './ViewModal.types';
import { useReactToPrint } from 'react-to-print';
import './ViewModal.css';
import { useLocation } from 'react-router-dom';
import { QRCodeComp } from '@/components/custom/QRCodeComp';
import { currencyFormated } from '@/utils/currencyFormated';
import axiosInstance from '@/api/interceptors';
import { toast } from '@/components/ui/use-toast';
import { toggleActionView } from '@/store/slices/toggleAction';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';
import { useTranslation } from 'react-i18next';
import {
  buildReceiptCompanyContext,
  buildSimplifiedTaxInvoiceHtml,
  mapApiOrderToReceiptInput,
  openAndPrintSimplifiedTaxInvoice,
  resolveReceiptQrDataUrl,
} from '@/utils/simplifiedTaxInvoiceReceipt';
import CurrencyAmount from '@/components/custom/CurrencyAmount';
import { Pointer, Printer, Receipt, RotateCcw } from 'lucide-react';
import dayjs from 'dayjs';

/** Must match `title` prop from DetailsModal routes (used for layout + i18n). */
export const INVOICE_VIEW_TITLE = {
  SIMPLIFIED: 'فاتورة ضريبية مبسطة',
  PURCHASE: 'فاتورة  شراء',
  QUOTE: 'عرض سعر',
  TAX: 'فاتورة ضريبية',
} as const;

function resolveInvoiceViewTitle(
  rawTitle: string,
  translate: (key: string) => string
): string {
  const map: Record<string, string> = {
    [INVOICE_VIEW_TITLE.SIMPLIFIED]: 'VIEW_MODAL_TITLE_SIMPLIFIED',
    [INVOICE_VIEW_TITLE.PURCHASE]: 'VIEW_MODAL_TITLE_PURCHASE',
    [INVOICE_VIEW_TITLE.QUOTE]: 'VIEW_MODAL_TITLE_QUOTE',
    [INVOICE_VIEW_TITLE.TAX]: 'VIEW_MODAL_TITLE_TAX',
  };
  const key = map[rawTitle];
  return key ? translate(key) : rawTitle || translate('INVOICE');
}

/** Fixes doubled settings text e.g. "WelcomeWelcome" from saved receipt_header. */
function normalizeReceiptBannerHeader(raw: string | undefined): string {
  const s = String(raw ?? '').trim();
  if (!s) return '';
  if (s.length % 2 === 0) {
    const half = s.slice(0, s.length / 2);
    if (half === s.slice(s.length / 2)) return half;
  }
  return s;
}

function safeParseBranchStreetName(registeredAddress: string | undefined): string {
  if (!registeredAddress?.trim()) return '';
  try {
    const o = JSON.parse(registeredAddress) as { streetName?: string };
    return typeof o?.streetName === 'string' ? o.streetName.trim() : '';
  } catch {
    return '';
  }
}

/** Hides test/junk values often left in branch streetName. */
function isLikelyPlaceholderAddress(s: string): boolean {
  const t = s.trim();
  if (t.length < 2) return true;
  if (/^(.)\1{5,}$/.test(t)) return true;
  if (/^([a-zA-Z])\1{4,}\d*$/i.test(t)) return true;
  return false;
}

const animationStyles = `
    @keyframes buttonPulse {
      0% {
        box-shadow: 0 0 0 0 rgba(89, 81, 200, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(89, 81, 200, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(89, 81, 200, 0);
      }
    }

    @keyframes pointerPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
    }

    .button-send-zatca {
      animation: buttonPulse 2s infinite;
    }

    .pointer-icon-animation {
      animation: pointerPulse 1.5s ease-in-out infinite;
      display: inline-block;
    }
  `;

export const ViewModal: React.FC<ViewModalProps> = ({ title }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const data = useSelector((state: any) => state.toggleAction.data);
  const allSettings = useSelector((state: any) => state.allSettings.value);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [isConnectedLoading, setIsConnectedLoading] = useState(false);
  const isConnectedToZatca = useSelector(
    (state: any) => state?.allSettings?.value?.WhoAmI?.is_connected_to_zatca
  );
  const customerInfo = { data: data?.customer };
  const supplierInfo = { data: data?.get_supplier };
  const { pathname } = useLocation();
  const Corporate = pathname === '/zood-dashboard/purchase-invoices';
  const [zatcaStatus, setZatcaStatus] = useState<string | undefined>(
    data?.zatca_report_status
  );
  const Another = !Corporate;
  const customerRaw = data?.customer as
    | {
        phone?: string;
        mobile?: string;
        tax_registration_number?: string;
        vat_registration_number?: string;
      }
    | undefined;
  const supplierRaw = data?.get_supplier as
    | { phone?: string; tax_registration_number?: string }
    | undefined;
  const partyPhone = Corporate
    ? String(supplierRaw?.phone ?? '').trim()
    : String(customerRaw?.phone ?? customerRaw?.mobile ?? '').trim();
  const partyTax = Corporate
    ? String(supplierRaw?.tax_registration_number ?? '').trim()
    : String(
        customerRaw?.tax_registration_number ??
          customerRaw?.vat_registration_number ??
          ''
      ).trim();
  const ShowCar =
    allSettings.WhoAmI?.business?.business_type?.toLowerCase() === 'workshop';
  const showReturn = [
    // Invoice
    'orders:manage',
    // Purchasing
    'purchasing:drafts:manage',
    'purchasing:closed:manage',
    'purchasing_from_po:drafts:manage',
    // Price quote
    'po:drafts:manage',
    'po:posted:manage',
    'po:approved:manage',
    'po:approved:receive',
  ].some((permission) =>
    allSettings?.WhoAmI?.user?.roles
      ?.flatMap((el) => el?.permissions?.map((el2) => el2.name))
      ?.includes(permission)
  );
  const Data = { data };
  const receiptHeaderRaw = allSettings.settings?.data?.receipt_header;
  const receiptHeaderNormalized =
    normalizeReceiptBannerHeader(receiptHeaderRaw);
  const receiptHeaderHasZood = String(receiptHeaderRaw ?? '').includes('Zood');
  const branchStreetName = safeParseBranchStreetName(
    allSettings.WhoAmI?.user?.branches[0]?.registered_address
  );
  const showBranchAddressLine =
    branchStreetName.length > 0 &&
    !isLikelyPlaceholderAddress(branchStreetName);
  const isArabic = Boolean(i18n.language?.startsWith('ar'));
  const showPartyBlock = Corporate || Another;

  const invoiceMetaBox = (
    <div className="rounded-lg border border-border bg-muted/30 p-3 text-start">
      <p className="text-xs font-medium text-muted-foreground">
        {resolveInvoiceViewTitle(title, t)}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {title === INVOICE_VIEW_TITLE.QUOTE
          ? t('VIEW_MODAL_QUOTE_NUMBER')
          : t('INVOICE_NUMBER')}
      </p>
      <p
        className="mt-1 text-lg font-bold tabular-nums text-foreground"
        dir="ltr"
      >
        {data?.reference || '—'}
      </p>
      {data?.business_date?.split(' ')[0] && (
        <p className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
          {t('VIEW_MODAL_INVOICE_DATE')}:{' '}
          <span className="font-medium text-foreground tabular-nums" dir="ltr">
            {dayjs(
              `${dayjs(data?.business_date).format('YYYY-MM-DD')} ${dayjs(
                data?.created_at
              ).format('HH:mm:ss')}`
            ).format('D/M/YYYY h:mm A')}
          </span>
        </p>
      )}
    </div>
  );

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const handlePrint = () => {
    reactToPrintFn();
  };

  /** Same thermal receipt HTML as POS (shared template). */
  const handlePrintPosReceipt = async () => {
    if (!data) return;
    const ctx = buildReceiptCompanyContext(allSettings, undefined);
    const isArabic = Boolean(i18n.language?.startsWith('ar'));
    let invoiceIsoDate = new Date().toISOString();
    try {
      if (data?.business_date) {
        invoiceIsoDate = new Date(data.business_date).toISOString();
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
    const totalStr = Number(data?.total_price ?? 0).toFixed(2);
    const taxStr = Number(data?.total_taxes ?? 0).toFixed(2);
    const qrDataUrl = await resolveReceiptQrDataUrl({
      qrcodeRaw: String(data?.qrcode || ''),
      sellerName,
      vatNumber,
      invoiceIsoDate,
      totalAmount: totalStr,
      taxAmount: taxStr,
    });
    const input = mapApiOrderToReceiptInput(data, ctx, isArabic, qrDataUrl);
    const html = buildSimplifiedTaxInvoiceHtml(input);
    openAndPrintSimplifiedTaxInvoice(html);
  };
  const handleReturn = async () => {
    if (!data) return;
    setLoading(true);
    try {
      await axiosInstance.put(`/orders/${data?.id}/refund`);
      toast({
        title: t('VIEW_MODAL_RETURN_SUCCESS'),
        description: t('VIEW_MODAL_RETURN_SUCCESS_DESC'),
        duration: 3000,
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/orders'] });
      dispatch(toggleActionView(false));
    } catch (error) {
      toast({
        title: t('VIEW_MODAL_ERROR'),
        description: t('VIEW_MODAL_ERROR'),
        duration: 3000,
        variant: 'destructive',
      });
    }
  };

  const handleSendToZatca = async () => {
    if (!data) return;
    try {
      setIsConnectedLoading(true);
      const res = await axiosInstance.post(`zatca/orders/${data?.id}/report`);
      toast({
        title: t('REPORT'),
        description: res.data.message || t('VIEW_MODAL_ZATCA_SENT'),
        duration: 3000,
        variant: 'default',
      });
    } catch (err) {
      console.error('Zatca Error: ', err);
    } finally {
      setIsConnectedLoading(false);
      queryClient.invalidateQueries({ queryKey: ['/orders'] });
      dispatch(toggleActionView(false));
    }
  };

  return (
    <>
      <div className="relative w-full min-w-0 max-w-full rounded-lg bg-background">
        <div className="flex min-w-0 flex-col rounded-lg">
          <div className="w-full min-w-0 max-md:max-w-full rounded-lg bg-card px-3 py-4 sm:px-6 md:px-8 md:py-6">
            <div className="myDiv flex min-w-0 gap-4 max-md:flex-col md:flex-row md:items-start md:gap-5">
              <div
                ref={contentRef}
                style={{
                  width: '100%',
                  maxWidth: 'min(100%, 860px)',
                  margin: 'auto',
                  padding: 'clamp(8px, 2vw, 20px)',
                }}
                className="a4-size flex w-full min-w-0 flex-1 flex-col md:max-w-[min(100%,860px)]"
              >
                  <div className="print-content invoice-a4-document mx-auto w-full max-w-[210mm] rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-foreground max-md:mt-2 md:p-6">
                    <header
                      className="invoice-a4-doc-header shrink-0 -mx-4 -mt-4 mb-4 border-b border-border bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground sm:-mx-5 sm:px-5 md:-mx-6 md:-mt-6 md:px-8"
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      <p className="font-medium text-foreground">
                        {resolveInvoiceViewTitle(title, t)}
                      </p>
                    </header>
                    <div className="invoice-a4-main min-h-0">
                    <section className="invoice-a4-meta border-b border-border pb-4">
                      <div
                        className="invoice-a4-header__grid grid grid-cols-2 gap-3 md:items-start md:gap-4"
                        dir="ltr"
                      >
                        <section
                          className={`invoice-a4-document-stack flex min-w-0 flex-col ${
                            isArabic ? 'order-1' : 'order-2'
                          }`}
                          aria-label={t('INVOICE')}
                          dir={isArabic ? 'rtl' : 'ltr'}
                        >
                          {invoiceMetaBox}
                        </section>

                        <section
                          className={`invoice-a4-seller min-w-0 rounded-lg border border-border bg-muted/30 p-3 ${
                            isArabic ? 'order-2' : 'order-1'
                          }`}
                          aria-labelledby="invoice-a4-seller-title"
                          dir={isArabic ? 'rtl' : 'ltr'}
                        >
                          <p className="text-xs font-medium text-muted-foreground">
                            {t('VIEW_MODAL_SELLER')}
                          </p>
                          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
                            <img
                              className="h-12 w-12 shrink-0 rounded border border-border bg-background object-contain p-1 sm:h-14 sm:w-14"
                              src={`${allSettings.settings?.data?.business_logo}`}
                              alt=""
                            />
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <h2
                                id="invoice-a4-seller-title"
                                className="text-base font-semibold leading-snug text-foreground"
                              >
                                {allSettings.WhoAmI?.business?.name}
                              </h2>
                              {showBranchAddressLine ? (
                                <p className="max-w-prose text-xs text-muted-foreground">
                                  {branchStreetName}
                                </p>
                              ) : null}
                              <dl className="flex flex-col gap-1 border-t border-border pt-2 text-xs">
                                <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                                  <dt className="text-muted-foreground">
                                    {t('SETTINGS_TAX_NUMBER')}
                                  </dt>
                                  <dd
                                    className="font-medium text-foreground tabular-nums"
                                    dir="ltr"
                                  >
                                    {allSettings.settings?.data?.business_tax_number}
                                  </dd>
                                </div>
                                <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                                  <dt className="text-muted-foreground">
                                    {t('phone')}
                                  </dt>
                                  <dd
                                    className="font-medium text-foreground tabular-nums"
                                    dir="ltr"
                                  >
                                    {allSettings.WhoAmI?.user?.branches[0]?.phone}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </section>
                      </div>

                      {showPartyBlock && (
                        <div
                          className="mt-4 w-full min-w-0"
                          dir={isArabic ? 'rtl' : 'ltr'}
                        >
                          <div className="invoice-a4-party w-full rounded-lg border border-border bg-muted/30">
                            <div className="flex w-full flex-col gap-3 p-3 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between min-[480px]:gap-4">
                                <div className="min-w-0 flex-1 space-y-3 text-start">
                                <div className="space-y-1.5">
                                  <p className="text-xs font-medium text-muted-foreground">
                                    {Corporate
                                      ? t('VIEW_MODAL_SUPPLIER_SECTION')
                                      : t('VIEW_MODAL_CUSTOMER_SECTION')}
                                  </p>
                                  <p className="text-base font-semibold leading-snug text-foreground">
                                    {Corporate ? data?.get_supplier?.name : ''}
                                    {Another ? data?.customer?.name : ''}
                                  </p>
                                  {(partyPhone || partyTax) && (
                                    <dl className="grid gap-1 text-xs">
                                      {partyPhone ? (
                                        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                                          <dt className="text-muted-foreground">
                                            {t('phone')}
                                          </dt>
                                          <dd
                                            className="font-medium tabular-nums text-foreground"
                                            dir="ltr"
                                          >
                                            {partyPhone}
                                          </dd>
                                        </div>
                                      ) : null}
                                      {partyTax ? (
                                        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                                          <dt className="text-muted-foreground">
                                            {t('SETTINGS_TAX_NUMBER')}
                                          </dt>
                                          <dd
                                            className="font-medium tabular-nums text-foreground"
                                            dir="ltr"
                                          >
                                            {partyTax}
                                          </dd>
                                        </div>
                                      ) : null}
                                    </dl>
                                  )}
                                  {title === INVOICE_VIEW_TITLE.PURCHASE &&
                                    Corporate && (
                                      <p className="text-xs leading-snug">
                                        <span className="text-muted-foreground">
                                          {t('VIEW_MODAL_REFERENCE_NUMBER')}{' '}
                                        </span>
                                        <span
                                          className="font-medium tabular-nums text-foreground"
                                          dir="ltr"
                                        >
                                          {data?.invoice_number || '—'}
                                        </span>
                                      </p>
                                    )}
                                  {Another &&
                                    data?.customer?.addresses[0]?.name && (
                                      <p className="text-xs leading-relaxed text-foreground">
                                        <span className="text-muted-foreground">
                                          {t('VIEW_MODAL_CUSTOMER_ADDRESS')}{' '}
                                        </span>
                                        <span className="font-medium">
                                          {data?.customer?.addresses[0]?.name}
                                        </span>
                                      </p>
                                    )}
                                </div>

                                {ShowCar &&
                                  (data?.kitchen_received_at ||
                                    data?.kitchen_done_at) && (
                                    <div className="space-y-1.5 border-t border-border pt-3">
                                      <p className="text-xs font-medium text-muted-foreground">
                                        {t('VIEW_MODAL_VEHICLE_SECTION')}
                                      </p>
                                      <dl className="space-y-1.5 text-xs leading-snug">
                                        {data?.kitchen_received_at ? (
                                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                            <dt className="shrink-0 text-muted-foreground">
                                              {t('CAR_TYPE')}
                                            </dt>
                                            <dd className="min-w-0 font-medium text-foreground">
                                              {data.kitchen_received_at}
                                            </dd>
                                          </div>
                                        ) : null}
                                        {data?.kitchen_done_at ? (
                                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                            <dt className="shrink-0 text-muted-foreground">
                                              {t('CAR_PLATE')}
                                            </dt>
                                            <dd
                                              className="min-w-0 font-medium tabular-nums text-foreground"
                                              dir="ltr"
                                            >
                                              {data.kitchen_done_at}
                                            </dd>
                                          </div>
                                        ) : null}
                                      </dl>
                                    </div>
                                  )}
                                </div>

                                <div className="flex shrink-0 justify-center min-[480px]:self-start">
                                  <div className="rounded border border-border bg-background p-1">
                                    <QRCodeComp
                                      settings={allSettings.settings}
                                      Data={Data}
                                    />
                                  </div>
                                </div>
                              </div>
                          </div>
                        </div>
                      )}
                    </section>

                    {(receiptHeaderHasZood || receiptHeaderNormalized) && (
                      <div
                        className="invoice-a4-preamble mt-4 rounded-lg border border-dashed border-border bg-muted/10 px-3 py-2"
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t('receipt_header')}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground">
                          {receiptHeaderHasZood
                            ? t('VIEW_MODAL_RECEIPT_WELCOME')
                            : receiptHeaderNormalized}
                        </p>
                      </div>
                    )}

                    {Data?.data?.order_product && Data.data.order_product.length > 0 ? (
                      <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                        <table className="invoice-line-table w-full min-w-[520px] border-collapse text-sm">
                          <thead>
                            <tr className="invoice-preview-table-header border-b border-border bg-muted/90 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              <th className="px-3 py-3 text-start">
                                {t('VIEW_MODAL_PRODUCT_NAME')}
                              </th>
                              <th className="w-20 px-2 py-3 text-end tabular-nums">
                                {t('VIEW_MODAL_QTY')}
                              </th>
                              <th className="w-24 px-2 py-3 text-end tabular-nums">
                                {t('VIEW_MODAL_UNIT_PRICE')}
                              </th>
                              {!Corporate && (
                                <th className="w-24 px-2 py-3 text-end tabular-nums">
                                  {t('VIEW_MODAL_TAX_VALUE')}
                                </th>
                              )}
                              <th className="w-28 px-2 py-3 text-end tabular-nums">
                                {t('TOTAL')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border bg-card">
                            {Data.data.order_product.map((e, idx) => (
                              <tr
                                key={`op-${e?.product_id ?? idx}`}
                                className="hover:bg-muted/20"
                              >
                                <td className="max-w-[220px] px-3 py-2.5 text-start align-top text-sm font-medium">
                                  {e?.kitchen_notes
                                    ? e?.kitchen_notes
                                    : Data?.data?.products?.find(
                                        (test) => test.id === e.product_id
                                      )?.name}
                                </td>
                                <td className="px-2 py-2.5 text-end tabular-nums text-muted-foreground">
                                  {currencyFormated(e?.quantity)}
                                </td>
                                <td className="px-2 py-2.5 text-end tabular-nums text-muted-foreground">
                                  {currencyFormated(e?.unit_price)}
                                </td>
                                {!Corporate && (
                                  <td className="px-2 py-2.5 text-end tabular-nums">
                                    {currencyFormated(
                                      e?.taxes?.[0]?.pivot?.amount
                                    )}
                                  </td>
                                )}
                                <td className="px-2 py-2.5 text-end text-sm font-semibold tabular-nums">
                                  {currencyFormated(
                                    parseFloat(e?.unit_price) *
                                      parseFloat(e?.quantity) +
                                      e?.taxes?.[0]?.pivot?.amount *
                                        (e?.is_tax_included ? -1 : 0)
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}

                    {Data?.data?.items && Data.data.items.length > 0 ? (
                      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                        <table className="invoice-line-table w-full min-w-[480px] border-collapse text-sm">
                          <thead>
                            <tr className="invoice-preview-table-header border-b border-border bg-muted/90 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              <th className="px-3 py-3 text-start">
                                {t('VIEW_MODAL_PRODUCT_NAME')}
                              </th>
                              <th className="w-20 px-2 py-3 text-end tabular-nums">
                                {t('VIEW_MODAL_QTY')}
                              </th>
                              <th className="w-24 px-2 py-3 text-end tabular-nums">
                                {t('VIEW_MODAL_UNIT_PRICE')}
                              </th>
                              <th className="w-28 px-2 py-3 text-end tabular-nums">
                                {t('VIEW_MODAL_LINE_TOTAL')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border bg-card">
                            {Data.data.items.map((e, idx) => (
                              <tr key={`it-${e?.name ?? idx}-${idx}`} className="hover:bg-muted/20">
                                <td className="max-w-[240px] px-3 py-2.5 text-start align-top text-sm font-medium">
                                  {e?.name === 'sku-zood-20001'
                                    ? e?.pivot?.kitchen_notes
                                    : e?.name}
                                </td>
                                <td className="px-2 py-2.5 text-end tabular-nums text-muted-foreground">
                                  {currencyFormated(e?.pivot?.quantity)}
                                </td>
                                <td className="px-2 py-2.5 text-end tabular-nums text-muted-foreground">
                                  {currencyFormated(e?.pivot?.cost)}
                                </td>
                                <td className="px-2 py-2.5 text-end text-sm font-semibold tabular-nums">
                                  {currencyFormated(
                                    e?.pivot?.quantity * e?.pivot?.cost
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}

                    <div className="mt-5 flex justify-end">
                      <div className="makeEvenOddBg w-full max-w-md space-y-0 overflow-hidden rounded-xl border border-border bg-muted/10 p-0 text-sm">
                      {Data?.data?.subtotal_price ? (
                        <div className="flex justify-between gap-4 border-b border-border/60 px-4 py-2.5 text-muted-foreground">
                          <span>{t('SUBTOTAL')}</span>
                          <span className="tabular-nums text-foreground">
                            <CurrencyAmount value={Data?.data?.subtotal_price} />
                          </span>
                        </div>
                      ) : null}
                      {Data?.data?.discount_amount ? (
                        <div className="flex justify-between gap-4 border-b border-border/60 px-4 py-2.5 text-muted-foreground">
                          <span>{t('DISCOUNT')}</span>
                          <span className="tabular-nums text-foreground">
                            <CurrencyAmount value={Data?.data?.discount_amount} />
                          </span>
                        </div>
                      ) : null}
                      {Data?.data?.items ? (
                        <div className="flex justify-between gap-4 border-b border-border/60 px-4 py-2.5 text-muted-foreground">
                          <span>{t('VIEW_MODAL_TOTAL_EXCL_VAT_AMOUNT')}</span>
                          <span className="tabular-nums text-foreground">
                            <CurrencyAmount
                              value={Data?.data?.items?.reduce(
                                (sum, item) => sum + item?.pivot?.total_cost,
                                0
                              )}
                            />
                          </span>
                        </div>
                      ) : null}
                      {Data?.data?.tax_exclusive_discount_amount ? (
                        <div className="flex justify-between gap-4 border-b border-border/60 px-4 py-2.5 text-muted-foreground">
                          <span>{t('VIEW_MODAL_VAT_15_TOTAL')}</span>
                          <span className="tabular-nums text-foreground">
                            <CurrencyAmount
                              value={Data.data.tax_exclusive_discount_amount}
                            />
                          </span>
                        </div>
                      ) : null}
                      {Corporate ? (
                        <div className="flex justify-between gap-4 border-b border-border/60 px-4 py-2.5 text-muted-foreground">
                          <span>{t('VIEW_MODAL_VAT_15_TOTAL')}</span>
                          <span className="tabular-nums text-foreground">
                            <CurrencyAmount value={parseFloat(Data.data.paid_tax || 0)} />
                          </span>
                        </div>
                      ) : null}

                      {Data?.data?.total_price ? (
                        <div className="flex justify-between gap-4 border-b-2 border-border bg-muted/25 px-4 py-3 text-base font-semibold text-foreground">
                          <span>{t('TOTAL_AMOUNT')}</span>
                          <span className="tabular-nums">
                            <CurrencyAmount value={Data?.data?.total_price} />
                          </span>
                        </div>
                      ) : null}
                      {Data?.data?.items ? (
                        <div className="flex justify-between gap-4 border-b border-border/60 px-4 py-2.5 text-muted-foreground">
                          <span>{t('VIEW_MODAL_TOTAL_INCL_VAT')}</span>
                          <span className="tabular-nums text-foreground">
                            <CurrencyAmount
                              value={
                                parseFloat(Data.data.paid_tax || 0) +
                                Data?.data?.items?.reduce(
                                  (sum, item) => sum + item?.pivot?.total_cost,
                                  0
                                )
                              }
                            />
                          </span>
                        </div>
                      ) : null}
                      {Data?.data?.payments?.map((e, payIdx) => {
                        if (!e?.payment_method_id) return null;
                        return (
                          <div
                            key={e?.payment_method_id ?? payIdx}
                            className="flex justify-between gap-4 border-b border-border/60 px-4 py-2.5 text-muted-foreground"
                          >
                            <span>{e?.payment_method?.name}</span>
                            <span className="tabular-nums text-foreground">
                              <CurrencyAmount value={e?.amount} />
                            </span>
                          </div>
                        );
                      })}
                      {Data?.data?.payments?.length > 0 ? (
                        <div className="flex justify-between gap-4 border-b border-border/60 px-4 py-2.5 text-muted-foreground">
                          <span>{t('AMOUNT_PAID')}</span>
                          <span className="tabular-nums text-foreground">
                            <CurrencyAmount
                              value={Data?.data?.payments.reduce(
                                (sum, item) => sum + item?.amount,
                                0
                              )}
                            />
                          </span>
                        </div>
                      ) : null}
                      {Data?.data?.payments?.length > 0 &&
                      Data?.data?.total_price &&
                      Data?.data?.payments?.reduce(
                        (sum, item) => sum + item?.amount,
                        0
                      ) -
                        Data?.data?.total_price >
                        0 ? (
                        <div className="flex justify-between gap-4 border-b border-border/60 px-4 py-2.5 text-muted-foreground">
                          <span>{t('VIEW_MODAL_TOTAL_REMAINING')}</span>
                          <span className="tabular-nums text-foreground">
                            <CurrencyAmount
                              value={
                                Data?.data?.payments?.reduce(
                                  (sum, item) => sum + item?.amount,
                                  0
                                ) - Data?.data?.total_price
                              }
                            />
                          </span>
                        </div>
                      ) : null}
                      {Data?.data?.total_price &&
                      Data.data.total_price -
                        Data?.data?.payments?.reduce(
                          (sum, item) => sum + item.amount,
                          0
                        ) >
                        0 ? (
                        <div className="flex justify-between gap-4 px-4 py-2.5 text-muted-foreground">
                          <span>{t('VIEW_MODAL_TOTAL_DUE')}</span>
                          <span className="tabular-nums text-foreground">
                            <CurrencyAmount
                              value={
                                (Data?.data?.payments?.reduce(
                                  (sum, item) => sum + item.amount,
                                  0
                                ) || 0) <= Data.data.total_price
                                  ? Data.data.total_price -
                                    Data?.data?.payments?.reduce(
                                      (sum, item) => sum + item.amount,
                                      0
                                    )
                                  : 0
                              }
                            />
                          </span>
                        </div>
                      ) : null}
                    </div>
                    </div>

                    {!Corporate && data?.kitchen_notes && (
                      <div
                        className="mt-4 rounded-lg border border-dashed border-border bg-muted/10 px-3 py-2"
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t('NOTES')}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed">
                          {data?.kitchen_notes}
                        </p>
                      </div>
                    )}
                    {Corporate && data?.notes && (
                      <div
                        className="mt-4 rounded-lg border border-dashed border-border bg-muted/10 px-3 py-2"
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t('VIEW_MODAL_PURCHASE_DESCRIPTION')}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed">
                          {data?.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      {/* <p className="text-sm w-[50%] mt-[30px] text-[#26262F]">
                        Terms and conditions
                      </p> */}
                      {/* <div className="justify-items-end">
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f427b12df7330067f0a9d705f3491cda199d05af240961b0cade6a24ca16fbb?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                          className="object-contain mt-4 w-full aspect-[1000] max-md:max-w-full"
                        />
                        <img
                          loading="lazy"
                          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/09bd1d8b3659c4aa3e73986718a7168664c3a59f4de1c92cf4f068ebb6f83a0e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
                          className="object-contain self-center mt-2 aspect-[1.74] w-[99px]"
                        />
                      </div> */}
                    </div>
                    {/* {data?.kitchen_notes ? (
                      <div className="flex flex-col pt-4 pb-2 bg-white rounded-lg-none  max-md:px-5 justify-between">
                        <div>
                          {t('NOTES')}: {data?.kitchen_notes || ''}
                        </div>
                      </div>
                    ) : null} */}
                    </div>
                    <footer
                      className="invoice-a4-doc-footer shrink-0 -mx-4 border-t border-border bg-muted/30 px-4 py-4 text-center text-xs leading-relaxed text-muted-foreground sm:-mx-5 sm:px-5 md:-mx-6 md:px-8"
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      {String(
                        allSettings.settings?.data?.receipt_footer ?? ''
                      ).trim() ? (
                        <p>{allSettings.settings?.data?.receipt_footer}</p>
                      ) : (
                        <p className="text-muted-foreground">
                          {allSettings.WhoAmI?.business?.name}
                        </p>
                      )}
                    </footer>
                  </div>
              </div>
              <div className="no-print flex w-full shrink-0 flex-col rounded-xl border border-border bg-muted/40 p-4 md:ml-5 md:w-[26%] md:rounded-none md:border-0 md:bg-transparent md:p-0">
                <div className="flex w-full max-w-full flex-col">
                  <h3 className="text-base font-semibold text-foreground">
                    {t('VIEW_INVOICE_PRINT_SECTION')}
                  </h3>
                  <div className="mt-4 flex w-full max-w-[240px] flex-col gap-2.5 self-end">
                    <button
                      disabled={loading}
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 active:bg-neutral-950 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:active:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950/40 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-300/60 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <Printer className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
                      {t('PRINT')}
                    </button>
                    {Another && !Corporate && (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => void handlePrintPosReceipt()}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Receipt className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                        {t('RECEIPT_POS_STYLE')}
                      </button>
                    )}
                    {Another &&
                      zatcaStatus !== 'PASS' &&
                      Boolean(isConnectedToZatca) && (
                        <Button
                          block
                          type="primary"
                          disabled={isConnectedLoading}
                          className="button-send-zatca flex h-11 items-center justify-center gap-2 rounded-lg border-0 px-4 text-sm font-semibold shadow-sm transition-all duration-200 ease-out hover:scale-[1.01] hover:shadow-md active:scale-[0.99]"
                          onClick={() => {
                            handleSendToZatca();
                          }}
                        >
                          <Pointer
                            size={16}
                            className="pointer-icon-animation shrink-0"
                          />
                          <span>{t('SEND_TO_ZATCA')}</span>
                        </Button>
                      )}
                    {Another && showReturn && (
                      <button
                        disabled={loading}
                        type="button"
                        onClick={handleReturn}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 px-4 text-sm font-semibold text-destructive transition-colors hover:border-destructive/70 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <RotateCcw className="h-4 w-4 shrink-0" aria-hidden />
                        {t('VIEW_INVOICE_REFUND')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
