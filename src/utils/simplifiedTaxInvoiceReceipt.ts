/**
 * Shared thermal-style simplified tax invoice (POS receipt HTML + print).
 * Used by POS after payment and by ViewModal for matching print output.
 */

import QRCode from 'qrcode';
import { Buffer } from 'buffer';
import { toast } from '@/components/ui/use-toast';

const RECEIPT_RIYAL_ICON =
  '<span class="receipt-riyal" aria-hidden="true">﷼</span>';

export type ReceiptPaymentLine = { name: string; amount: number };

export type ReceiptLineItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  /** Per-unit discount amount (same semantics as POS cart lines) */
  discountPerUnit?: number;
  /** If set, overrides computed line total */
  lineTotal?: number;
};

export type SimplifiedTaxInvoiceReceiptInput = {
  isArabic: boolean;
  companyName: string;
  companyPhone: string;
  companyAddress: string;
  vatNumber: string;
  logoUrl: string;
  invoiceHeader: string;
  invoiceFooter: string;
  customerName: string;
  invoiceNumber: string;
  businessDate: string;
  items: ReceiptLineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payments: ReceiptPaymentLine[];
  /** Total paid (may differ from sum of rows if simplified) */
  paidAmount: number;
  changeAmount: number;
  qrCodeDataUrl: string;
};

const QZ_TRAY_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/qz-tray@2.2.5/qz-tray.js';
const POS_QZ_ENABLED_KEY = 'pos_qz_enabled';
const POS_QZ_PRINTER_NAME_KEY = 'pos_qz_printer_name';
const POS_KITCHEN_DEFAULT_PRINTER_NAME_KEY = 'pos_kitchen_default_printer_name';
const POS_KITCHEN_CATEGORY_ROUTING_KEY = 'pos_kitchen_category_routing';
let qzScriptLoadingPromise: Promise<any> | null = null;
let isQzSecurityConfigured = false;
let cachedQzPrinterName = '';
let qzConnectPromise: Promise<void> | null = null;
const QZ_CONNECT_TIMEOUT_MS = 12000;
const QZ_QUERY_TIMEOUT_MS = 20000;
const QZ_PRINT_TIMEOUT_MS = 20000;

export type KitchenTicketItem = {
  id?: string | number;
  name?: string;
  qty?: number;
  quantity?: number;
  note?: string;
  category_id?: string | number;
  category_name?: string;
  category?: { id?: string | number; name?: string };
};

export type QzDiagnosticsResult = {
  hasQzObject: boolean;
  connected: boolean;
  defaultPrinter: string;
  discoveredPrinters: string[];
  loadMs: number;
  connectMs: number;
  defaultMs: number;
  findMs: number;
  notes: string[];
};

export function escapeHtml(value: unknown): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Branch `registered_address` is often JSON (see settings) — format for receipt display. */
function joinAddressParts(parts: Record<string, unknown>): string {
  const keys = [
    'streetName',
    'district',
    'citySubdivisionName',
    'city',
    'buildingNumber',
    'additionalNumber',
    'postalCode',
    'commercialRegesterationNumber',
  ];
  const segments = keys
    .map((k) => {
      const v = parts[k];
      if (v == null) return '';
      const s = String(v).trim();
      return s === '' ? '' : s;
    })
    .filter(Boolean);
  return segments.join('، ');
}

function parseRegisteredAddressToDisplayString(raw: unknown): string {
  if (raw == null || raw === '') return '';
  if (typeof raw === 'object' && raw !== null) {
    return joinAddressParts(raw as Record<string, unknown>);
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') {
        return joinAddressParts(parsed as Record<string, unknown>);
      }
    } catch {
      return trimmed;
    }
  }
  return String(raw).trim();
}

export function formatBranchAddressForReceipt(
  branch: { registered_address?: unknown } | null | undefined,
  fallbackBusinessAddress?: string | null
): string {
  const fromBranch = parseRegisteredAddressToDisplayString(
    branch?.registered_address
  );
  if (fromBranch) return fromBranch;
  return String(fallbackBusinessAddress ?? '').trim();
}

/** ZATCA phase-1 TLV payload as Base64 (same as POS). */
function encodeZatcaPhase1(
  sellerName: string,
  vatNumber: string,
  invoiceDate: string,
  totalAmount: string,
  vatAmount: string
): string {
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
}

/**
 * Build a data-URL image for the receipt QR: backend TLV/base64 string, existing data URL,
 * or ZATCA phase-1 fallback when empty (matches POS `buildPrintQr` behavior).
 */
export async function resolveReceiptQrDataUrl(options: {
  qrcodeRaw: string;
  sellerName: string;
  vatNumber: string;
  invoiceIsoDate: string;
  totalAmount: string;
  taxAmount: string;
}): Promise<string> {
  const raw = String(options.qrcodeRaw || '').trim();
  const margin = 1;
  const width = 140;
  const tlvFallback = () =>
    encodeZatcaPhase1(
      options.sellerName,
      options.vatNumber,
      options.invoiceIsoDate,
      options.totalAmount,
      options.taxAmount
    );

  try {
    if (raw.startsWith('data:image/')) return raw;
    if (raw) {
      return await QRCode.toDataURL(raw, { margin, width });
    }
    return await QRCode.toDataURL(tlvFallback(), { margin, width });
  } catch {
    try {
      return await QRCode.toDataURL(tlvFallback(), { margin, width });
    } catch {
      return '';
    }
  }
}

function buildItemsHtml(items: ReceiptLineItem[]): string {
  return items
    .map((item) => {
      const name = escapeHtml(item.name || '-');
      const qty = Number(item.quantity || 0);
      const unitPrice = Number(item.unitPrice || 0);
      const discountAmt = Number(item.discountPerUnit || 0);
      let lineTotal: number;
      if (item.lineTotal != null && Number.isFinite(item.lineTotal)) {
        lineTotal = Number(item.lineTotal);
      } else {
        lineTotal = unitPrice * qty - discountAmt * qty;
      }
      const hasDiscount = discountAmt > 0;
      return `
          <div class="item-row">
            <div class="item-name">${name}</div>
            <div class="item-meta">
               ${qty} x ${unitPrice.toFixed(2)}
               ${hasDiscount ? `<br/><span style="font-size:10px; color:black;">(Discount: -${(discountAmt * qty).toFixed(2)})</span>` : ''}
            </div>
            <div class="item-total">
               ${hasDiscount ? `<span style="text-decoration:line-through; font-size:10px; color:#999; margin-right:4px; display:block;">${(unitPrice * qty).toFixed(2)}</span>` : ''}
               ${RECEIPT_RIYAL_ICON} ${lineTotal.toFixed(2)}
            </div>
          </div>
        `;
    })
    .join('');
}

function getLabels(isArabic: boolean) {
  return {
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
}

export function buildSimplifiedTaxInvoiceHtml(
  input: SimplifiedTaxInvoiceReceiptInput
): string {
  const labels = getLabels(input.isArabic);
  const itemsHtml = buildItemsHtml(input.items);
  const paymentsHtml = input.payments
    .filter((p) => Number(p.amount || 0) > 0)
    .map(
      (p) => `
          <div class="line">
            <span>${escapeHtml(p.name || (input.isArabic ? 'دفعة' : 'Payment'))}</span>
            <span>${RECEIPT_RIYAL_ICON} ${Number(p.amount || 0).toFixed(2)}</span>
          </div>
        `
    )
    .join('');

  const subtotalValue = Number(input.subtotal || 0).toFixed(2);
  const taxValue = Number(input.tax || 0).toFixed(2);
  const discountValue = Number(input.discount || 0).toFixed(2);
  const totalValue = Number(input.total || 0).toFixed(2);
  const paidValue = Number(input.paidAmount || 0).toFixed(2);
  const changeValue = Number(input.changeAmount || 0).toFixed(2);
  const qrCodeDataUrl = String(input.qrCodeDataUrl || '').trim();
  const backendQr =
    qrCodeDataUrl.startsWith('data:image/') ||
    qrCodeDataUrl.startsWith('http://') ||
    qrCodeDataUrl.startsWith('https://')
      ? qrCodeDataUrl
      : '';

  return `
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
              direction: ${input.isArabic ? 'rtl' : 'ltr'};
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
              padding: 2px 0;
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
            .receipt-riyal {
              display: inline-block;
              font-size: 0.95em;
              line-height: 1;
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
                input.logoUrl
                  ? `<div class="logo-wrap"><img class="logo" src="${escapeHtml(
                      String(input.logoUrl)
                    )}" alt="logo" /></div>`
                  : ''
              }
              <div class="brand">${labels.title}</div>
              <div class="sub">${labels.subtitle}</div>
            </div>
            <hr class="divider" />
            <div class="line"><span>${labels.companyName}</span><span>${escapeHtml(String(input.companyName || '-'))}</span></div>
            <div class="line"><span>${labels.companyPhone}</span><span>${escapeHtml(String(input.companyPhone || '-'))}</span></div>
            <div class="line"><span>${labels.companyAddress}</span><span>${escapeHtml(String(input.companyAddress || '-'))}</span></div>
            <div class="line"><span>${labels.vatNumber}</span><span>${escapeHtml(String(input.vatNumber || '-'))}</span></div>
            <hr class="divider" />

            <div class="line"><span>${labels.invoice}</span><span>${escapeHtml(String(input.invoiceNumber))}</span></div>
            <div class="line"><span>${labels.date}</span><span>${new Date(input.businessDate).toLocaleString()}</span></div>
            <div class="line"><span>${labels.customer}</span><span>${escapeHtml(String(input.customerName))}</span></div>
            ${
              input.invoiceHeader
                ? `<div class="sub" style="margin: 8px 0; text-align: center; white-space: pre-wrap;">${escapeHtml(
                    input.invoiceHeader
                  )}</div>`
                : ''
            }

            <hr class="divider" />
            <div class="section-title">${labels.items}</div>
            ${itemsHtml || `<div class="sub">${labels.noItems}</div>`}

            <hr class="divider" />
            <div class="totals">
              <div class="line"><span>${labels.subtotal}</span><span>${RECEIPT_RIYAL_ICON} ${subtotalValue}</span></div>
              <div class="line"><span>${labels.discount}</span><span>${RECEIPT_RIYAL_ICON} ${discountValue}</span></div>
              <div class="line"><span>${labels.tax}</span><span>${RECEIPT_RIYAL_ICON} ${taxValue}</span></div>
              <div class="grand"><span>${labels.total}</span><span>${RECEIPT_RIYAL_ICON} ${totalValue}</span></div>
            </div>

            <hr class="divider" />
            <div class="section-title">${labels.payments}</div>
            ${paymentsHtml || `<div class="line"><span>${labels.paid}</span><span>${RECEIPT_RIYAL_ICON} ${paidValue}</span></div>`}
            <div class="line"><span>${labels.amountPaid}</span><span>${RECEIPT_RIYAL_ICON} ${paidValue}</span></div>
            <div class="line"><span>${labels.change}</span><span>${RECEIPT_RIYAL_ICON} ${changeValue}</span></div>
            ${
              backendQr
                ? `<div class="qr-wrap">
              <img class="qr-image" src="${backendQr}" alt="ZATCA QR" />
            </div>`
                : ''
            }

            <hr class="divider" />
            ${
              input.invoiceFooter
                ? `<div class="sub" style="margin: 8px 0; text-align: center; white-space: pre-wrap;">${escapeHtml(
                    input.invoiceFooter
                  )}</div><hr class="divider" />`
                : ''
            }
            <div class="footer">${labels.footer}</div>
          </div>
        </body>
      </html>
    `;
}

export function openAndPrintSimplifiedTaxInvoice(
  html: string,
  options?: {
    onAfterPrint?: () => void;
    preferQzTray?: boolean;
    qzPrinterName?: string;
  }
): void {
  const useQzTray =
    options?.preferQzTray ??
    (typeof window !== 'undefined'
      ? window.localStorage.getItem(POS_QZ_ENABLED_KEY) !== '0'
      : true);

  if (useQzTray) {
    void printWithQzTray(html, options)
      .then(() => {
        options?.onAfterPrint?.();
      })
      .catch((error) => {
        notifyQzPrintIssue(error);
        openAndPrintWithBrowser(html, options);
      });
    return;
  }

  openAndPrintWithBrowser(html, options);
}

async function printWithQzTray(
  html: string,
  options?: { qzPrinterName?: string }
): Promise<void> {
  const qz = await withTimeout(
    ensureQzTrayClient(),
    QZ_CONNECT_TIMEOUT_MS,
    'QZ_TIMEOUT_LOAD'
  );
  configureQzTraySecurity(qz);

  await ensureQzConnected(qz);

  const preferredPrinter =
    options?.qzPrinterName ||
    cachedQzPrinterName ||
    (typeof window !== 'undefined'
      ? window.localStorage.getItem(POS_QZ_PRINTER_NAME_KEY) || ''
      : '');
  const printer = preferredPrinter.trim() || (await resolveDefaultQzPrinter(qz));
  if (!printer) {
    throw new Error('QZ_NO_PRINTER');
  }
  cachedQzPrinterName = printer;
  if (typeof window !== 'undefined' && !window.localStorage.getItem(POS_QZ_PRINTER_NAME_KEY)) {
    window.localStorage.setItem(POS_QZ_PRINTER_NAME_KEY, printer);
  }

  const config = qz.configs.create(printer);
  await withTimeout(
    qz.print(config, [
      {
        type: 'html',
        format: 'plain',
        data: html,
      },
    ]),
    QZ_PRINT_TIMEOUT_MS,
    'QZ_TIMEOUT_PRINT'
  );
}

async function resolveDefaultQzPrinter(qz: any): Promise<string> {
  const printer = await withTimeout(
    qz.printers.getDefault(),
    QZ_QUERY_TIMEOUT_MS,
    'QZ_TIMEOUT_PRINTER'
  );
  return String(printer || '').trim();
}

export async function warmupQzTrayConnection(): Promise<void> {
  const enabled =
    typeof window !== 'undefined'
      ? window.localStorage.getItem(POS_QZ_ENABLED_KEY) !== '0'
      : true;
  if (!enabled) return;

  const qz = await withTimeout(
    ensureQzTrayClient(),
    QZ_CONNECT_TIMEOUT_MS,
    'QZ_TIMEOUT_LOAD'
  );
  configureQzTraySecurity(qz);

  await ensureQzConnected(qz);

  const configuredPrinter =
    typeof window !== 'undefined'
      ? String(window.localStorage.getItem(POS_QZ_PRINTER_NAME_KEY) || '').trim()
      : '';
  if (configuredPrinter) {
    cachedQzPrinterName = configuredPrinter;
    return;
  }

  try {
    const defaultPrinter = await resolveDefaultQzPrinter(qz);
    if (defaultPrinter) {
      cachedQzPrinterName = defaultPrinter;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(POS_QZ_PRINTER_NAME_KEY, defaultPrinter);
      }
    }
  } catch {
    // Do not fail warmup if printer discovery is slow/unavailable.
  }
}

export async function listQzPrinters(): Promise<string[]> {
  const qz = await withTimeout(
    ensureQzTrayClient(),
    QZ_CONNECT_TIMEOUT_MS,
    'QZ_TIMEOUT_LOAD'
  );
  configureQzTraySecurity(qz);
  await ensureQzConnected(qz);

  const discovered = new Set<string>();

  try {
    const result = await withTimeout(
      qz.printers.find(),
      QZ_QUERY_TIMEOUT_MS,
      'QZ_TIMEOUT_PRINTER'
    );
    if (Array.isArray(result)) {
      result.forEach((name) => {
        const normalized = String(name || '').trim();
        if (normalized) discovered.add(normalized);
      });
    } else {
      const single = String(result || '').trim();
      if (single) discovered.add(single);
    }
  } catch {
    // ignore and continue with details/default fallbacks
  }

  try {
    const details = await withTimeout(
      qz.printers.details(),
      QZ_QUERY_TIMEOUT_MS,
      'QZ_TIMEOUT_PRINTER'
    );
    const list = Array.isArray(details) ? details : [details];
    list.forEach((entry: any) => {
      const candidate =
        String(entry?.name || entry?.printerName || entry?.deviceName || '').trim();
      if (candidate) discovered.add(candidate);
    });
  } catch {
    // optional API on some environments
  }

  try {
    const defaultPrinter = await resolveDefaultQzPrinter(qz);
    if (defaultPrinter) discovered.add(defaultPrinter);
  } catch {
    // ignore
  }

  return Array.from(discovered);
}

function isQzAlreadyConnectedError(error: any): boolean {
  const raw = String(error?.message || error || '').toLowerCase();
  return (
    raw.includes('open connection with qz tray already exists') ||
    raw.includes('already exists')
  );
}

function isQzTimeoutConnectError(error: any): boolean {
  const raw = String(error?.message || error || '');
  return raw.includes('QZ_TIMEOUT_CONNECT');
}

function isQzTimeoutPrintError(error: any): boolean {
  const raw = String(error?.message || error || '');
  return raw.includes('QZ_TIMEOUT_PRINT');
}

async function waitForQzActiveSocket(
  qz: any,
  options?: { totalMs?: number; stepMs?: number }
): Promise<boolean> {
  const totalMs = Math.max(0, Number(options?.totalMs || 2500));
  const stepMs = Math.max(100, Number(options?.stepMs || 250));
  const startedAt = Date.now();
  while (Date.now() - startedAt < totalMs) {
    if (qz.websocket?.isActive?.()) return true;
    await new Promise<void>((resolve) => window.setTimeout(resolve, stepMs));
  }
  return Boolean(qz.websocket?.isActive?.());
}

async function ensureQzConnected(qz: any): Promise<void> {
  if (qz.websocket?.isActive?.()) return;
  if (qzConnectPromise) {
    await qzConnectPromise;
    return;
  }

  qzConnectPromise = (async () => {
    if (!qz?.websocket?.connect) {
      throw new Error('QZ_WEBSOCKET_UNAVAILABLE');
    }

    const attempts = 3;

    let lastError: any = null;
    for (let index = 0; index < attempts; index += 1) {
      try {
        if (qz.websocket?.isActive?.()) return;
        if (index > 0) {
          try {
            await withTimeout(
              Promise.resolve(qz.websocket?.disconnect?.()),
              2000,
              'QZ_TIMEOUT_DISCONNECT'
            );
          } catch {
            // best effort cleanup before retrying another connection strategy
          }
        }
        await withTimeout(
          qz.websocket.connect(),
          QZ_CONNECT_TIMEOUT_MS,
          'QZ_TIMEOUT_CONNECT'
        );
        if (qz.websocket?.isActive?.()) return;
      } catch (error) {
        if (isQzAlreadyConnectedError(error)) return;
        if (isQzTimeoutConnectError(error)) {
          const becameActive = await waitForQzActiveSocket(qz, {
            totalMs: 3000,
            stepMs: 250,
          });
          if (becameActive) return;
        }
        lastError = error;
      }
    }

    throw lastError || new Error('QZ_TIMEOUT_CONNECT');
  })();

  try {
    await qzConnectPromise;
  } finally {
    qzConnectPromise = null;
  }
}

export function getKitchenCategoryRoutingFromStorage(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const raw = String(
    window.localStorage.getItem(POS_KITCHEN_CATEGORY_ROUTING_KEY) || ''
  ).trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return {};
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const k = String(key || '').trim().toLowerCase();
      const v = String(value || '').trim();
      if (!k || !v) continue;
      normalized[k] = v;
    }
    return normalized;
  } catch {
    return {};
  }
}

function resolveKitchenPrinterForItem(
  item: KitchenTicketItem,
  routing: Record<string, string>,
  defaultPrinterName: string
): string {
  const rawCategoryId =
    item?.category_id ??
    item?.category?.id ??
    '';
  const rawCategoryName =
    item?.category_name ??
    item?.category?.name ??
    '';
  const categoryId = String(rawCategoryId || '').trim().toLowerCase();
  const categoryName = String(rawCategoryName || '').trim().toLowerCase();

  return (
    routing[categoryId] ||
    routing[categoryName] ||
    defaultPrinterName
  );
}

function buildKitchenTicketRawText(options: {
  reference: string;
  businessDate: string;
  printerLabel: string;
  items: KitchenTicketItem[];
}): string {
  const lines: string[] = [];
  lines.push('\x1B\x40');
  lines.push('*** KITCHEN ORDER ***');
  lines.push(`Printer: ${options.printerLabel}`);
  lines.push(`Ref: ${options.reference || '-'}`);
  lines.push(`Time: ${new Date(options.businessDate).toLocaleString()}`);
  lines.push('------------------------------');
  for (const item of options.items) {
    const qty = Number(item?.qty ?? item?.quantity ?? 0);
    const qtyLabel = Number.isFinite(qty) && qty > 0 ? qty : 1;
    const name = String(item?.name || '-');
    lines.push(`${qtyLabel} x ${name}`);
    const note = String(item?.note || '').trim();
    if (note) lines.push(`  Note: ${note}`);
  }
  lines.push('------------------------------');
  lines.push('\n\n\n');
  lines.push('\x1D\x56\x41\x03');
  return lines.join('\n');
}

export async function printKitchenTicketsByCategory(options: {
  items: KitchenTicketItem[];
  reference?: string;
  businessDate?: string;
  suppressToastOnError?: boolean;
}): Promise<{ printedCount: number; groupedPrinters: string[] }> {
  const enabled =
    typeof window !== 'undefined'
      ? window.localStorage.getItem(POS_QZ_ENABLED_KEY) !== '0'
      : true;
  if (!enabled) return { printedCount: 0, groupedPrinters: [] };

  const routing = getKitchenCategoryRoutingFromStorage();
  const defaultPrinterName =
    typeof window !== 'undefined'
      ? String(
          window.localStorage.getItem(POS_KITCHEN_DEFAULT_PRINTER_NAME_KEY) || ''
        ).trim()
      : '';
  if (!defaultPrinterName && Object.keys(routing).length === 0) {
    return { printedCount: 0, groupedPrinters: [] };
  }

  const grouped = new Map<string, KitchenTicketItem[]>();
  for (const item of options.items || []) {
    const printerName = resolveKitchenPrinterForItem(item, routing, defaultPrinterName);
    if (!printerName) continue;
    const current = grouped.get(printerName) || [];
    current.push(item);
    grouped.set(printerName, current);
  }

  if (grouped.size === 0) return { printedCount: 0, groupedPrinters: [] };

  const qz = await withTimeout(
    ensureQzTrayClient(),
    QZ_CONNECT_TIMEOUT_MS,
    'QZ_TIMEOUT_LOAD'
  );
  configureQzTraySecurity(qz);
  await ensureQzConnected(qz);

  let printedCount = 0;
  const printers = Array.from(grouped.keys());
  for (const printerName of printers) {
    const rawText = buildKitchenTicketRawText({
      reference: String(options.reference || ''),
      businessDate: String(options.businessDate || new Date().toISOString()),
      printerLabel: printerName,
      items: grouped.get(printerName) || [],
    });

    const config = qz.configs.create(printerName);
    await withTimeout(
      qz.print(config, [{ type: 'raw', format: 'plain', data: rawText }]),
      QZ_PRINT_TIMEOUT_MS,
      'QZ_TIMEOUT_PRINT'
    );
    printedCount += 1;
  }

  return { printedCount, groupedPrinters: printers };
}

export async function testPrintOnQzPrinter(options: {
  printerName: string;
  title?: string;
}): Promise<void> {
  const printerName = String(options.printerName || '').trim();
  if (!printerName) {
    throw new Error('QZ_NO_PRINTER_NAME');
  }

  const qz = await withTimeout(
    ensureQzTrayClient(),
    QZ_CONNECT_TIMEOUT_MS,
    'QZ_TIMEOUT_LOAD'
  );
  configureQzTraySecurity(qz);
  await ensureQzConnected(qz);

  const config = qz.configs.create(printerName);
  const now = new Date().toLocaleString();

  // First try RAW for thermal-compatible printers.
  const rawPayload = [
    '\x1B\x40',
    String(options.title || 'QZ TEST'),
    `Printer: ${printerName}`,
    `Time: ${now}`,
    '------------------------------',
    'QZ direct print test succeeded.',
    '\n\n',
  ].join('\n');

  try {
    await withTimeout(
      qz.print(config, [{ type: 'raw', format: 'plain', data: rawPayload }]),
      QZ_PRINT_TIMEOUT_MS,
      'QZ_TIMEOUT_PRINT'
    );
    return;
  } catch (error) {
    // For office/laser printers RAW may stall; fallback to HTML test page.
    const htmlFallback = `
      <div style="font-family:Arial,sans-serif;padding:12px;">
        <h3 style="margin:0 0 8px 0;">${escapeHtml(String(options.title || 'QZ TEST'))}</h3>
        <div>Printer: ${escapeHtml(printerName)}</div>
        <div>Time: ${escapeHtml(now)}</div>
        <hr />
        <div>QZ direct print test succeeded.</div>
      </div>
    `;
    if (!isQzTimeoutPrintError(error)) {
      throw error;
    }
    await withTimeout(
      qz.print(config, [{ type: 'html', format: 'plain', data: htmlFallback }]),
      QZ_PRINT_TIMEOUT_MS,
      'QZ_TIMEOUT_PRINT'
    );
  }
}

export async function runQzDiagnostics(): Promise<QzDiagnosticsResult> {
  const notes: string[] = [];
  const result: QzDiagnosticsResult = {
    hasQzObject: false,
    connected: false,
    defaultPrinter: '',
    discoveredPrinters: [],
    loadMs: 0,
    connectMs: 0,
    defaultMs: 0,
    findMs: 0,
    notes,
  };

  const loadStart = Date.now();
  try {
    const qz = await withTimeout(
      ensureQzTrayClient(),
      5000,
      'QZ_TIMEOUT_LOAD'
    );
    result.loadMs = Date.now() - loadStart;
    result.hasQzObject = Boolean(qz);

    const connectStart = Date.now();
    try {
      await ensureQzConnected(qz);
      result.connected = true;
    } catch (error: any) {
      notes.push(`connect: ${String(error?.message || error || 'unknown')}`);
    } finally {
      result.connectMs = Date.now() - connectStart;
    }

    const defaultStart = Date.now();
    try {
      result.defaultPrinter = await resolveDefaultQzPrinter(qz);
      if (!result.defaultPrinter) {
        notes.push('default: empty');
      }
    } catch (error: any) {
      notes.push(`default: ${String(error?.message || error || 'unknown')}`);
    } finally {
      result.defaultMs = Date.now() - defaultStart;
    }

    const findStart = Date.now();
    try {
      const rawFind = await withTimeout(
        qz.printers.find(),
        QZ_QUERY_TIMEOUT_MS,
        'QZ_TIMEOUT_FIND'
      );
      if (Array.isArray(rawFind)) {
        result.discoveredPrinters = rawFind
          .map((item) => String(item || '').trim())
          .filter(Boolean);
      } else {
        const single = String(rawFind || '').trim();
        result.discoveredPrinters = single ? [single] : [];
      }
      if (!result.discoveredPrinters.length) {
        notes.push('find: empty list');
      }
    } catch (error: any) {
      notes.push(`find: ${String(error?.message || error || 'unknown')}`);
    } finally {
      result.findMs = Date.now() - findStart;
    }
  } catch (error: any) {
    result.loadMs = Date.now() - loadStart;
    notes.push(`load: ${String(error?.message || error || 'unknown')}`);
  }

  return result;
}

function notifyQzPrintIssue(error: any): void {
  const raw = String(error?.message || error || '');
  const normalized = raw.toLowerCase();
  const isArabicUi =
    typeof document !== 'undefined' &&
    (document?.documentElement?.dir === 'rtl' ||
      document?.documentElement?.lang?.toLowerCase().startsWith('ar'));
  const hasNoPrinter =
    raw.includes('QZ_NO_PRINTER') ||
    normalized.includes('default qz printer') ||
    normalized.includes('no printer');
  const hasTimeout =
    raw.includes('QZ_TIMEOUT_') ||
    normalized.includes('timeout') ||
    normalized.includes('timed out');
  const description = hasNoPrinter
    ? isArabicUi
      ? 'QZ Tray متصل، لكن لا توجد طابعة مهيأة. سيتم الرجوع لطباعة المتصفح.'
      : 'QZ Tray is connected, but no printer is configured. Fallback to browser print.'
    : hasTimeout
    ? isArabicUi
      ? 'QZ Tray لم يستجب في الوقت المحدد. سيتم الرجوع لطباعة المتصفح.'
      : 'QZ Tray did not respond in time. Fallback to browser print.'
    : isArabicUi
      ? 'فشلت الطباعة المباشرة عبر QZ. سيتم الرجوع لطباعة المتصفح.'
      : 'Direct QZ print failed. Fallback to browser print.';

  toast({
    description,
    duration: 2600,
    variant: 'destructive',
  });
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutCode: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(timeoutCode));
    }, timeoutMs);

    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

async function ensureQzTrayClient(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('QZ Tray is only available in browser');
  }
  const existingQz = (window as any).qz;
  if (existingQz) return existingQz;

  if (!qzScriptLoadingPromise) {
    qzScriptLoadingPromise = new Promise((resolve, reject) => {
      const currentQz = (window as any).qz;
      if (currentQz) {
        resolve(currentQz);
        return;
      }

      const script = document.createElement('script');
      script.src = QZ_TRAY_SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        const loadedQz = (window as any).qz;
        if (!loadedQz) {
          reject(new Error('QZ Tray script loaded without qz client'));
          return;
        }
        resolve(loadedQz);
      };
      script.onerror = () => reject(new Error('Failed to load QZ Tray script'));
      document.head.appendChild(script);
    });
  }

  return qzScriptLoadingPromise;
}

function configureQzTraySecurity(qz: any): void {
  if (isQzSecurityConfigured) return;
  if (!qz?.security?.setCertificatePromise || !qz?.security?.setSignaturePromise) {
    return;
  }

  // Development-friendly unsigned flow (matches QZ sample behavior).
  // This should show a manageable "allow" prompt in QZ instead of hard failures.
  qz.security.setCertificatePromise((resolve: (cert?: string) => void) => resolve());
  if (typeof qz.security.setSignatureAlgorithm === 'function') {
    qz.security.setSignatureAlgorithm('SHA512');
  }
  qz.security.setSignaturePromise(() => {
    return (resolve: (signature?: string) => void) => resolve();
  });
  isQzSecurityConfigured = true;
}

function openAndPrintWithBrowser(
  html: string,
  options?: { onAfterPrint?: () => void }
) {
  const printWindow = window.open('', '_blank', 'width=420,height=720');
  if (!printWindow) {
    const isArabicUi =
      typeof document !== 'undefined' &&
      (document?.documentElement?.dir === 'rtl' ||
        document?.documentElement?.lang?.toLowerCase().startsWith('ar'));
    toast({
      description: isArabicUi
        ? 'المتصفح منع نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.'
        : 'Browser blocked the print window. Please allow pop-ups for this site.',
      duration: 3000,
      variant: 'destructive',
    });
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();

  // Ensure icon fonts/classes (including icon-saudi_riyal) are available in print window.
  const styleLinks = Array.from(
    document.querySelectorAll('link[rel="stylesheet"][href]')
  ) as HTMLLinkElement[];
  styleLinks.forEach((link) => {
    const href = link.href;
    if (!href) return;
    const cloned = printWindow.document.createElement('link');
    cloned.rel = 'stylesheet';
    cloned.href = href;
    printWindow.document.head.appendChild(cloned);
  });

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

  if (options?.onAfterPrint) {
    printWindow.onafterprint = () => {
      printWindow.close();
      options.onAfterPrint?.();
    };
  }
}

/** Company + header/footer from Redux allSettings / manage settings (same as POS). */
export function buildReceiptCompanyContext(allSettings: any, settingsData?: any) {
  const s = allSettings?.settings?.data;
  const sd = settingsData?.data;
  return {
    logoUrl: String(s?.business_logo || sd?.business_logo || ''),
    companyName: String(
      allSettings?.WhoAmI?.business?.name ||
        s?.business_name ||
        'Zood'
    ),
    companyPhone: String(
      allSettings?.WhoAmI?.user?.branches?.[0]?.phone ||
        s?.phone_number ||
        ''
    ),
    companyAddress: formatBranchAddressForReceipt(
      allSettings?.WhoAmI?.user?.branches?.[0],
      s?.business_address || sd?.business_address
    ),
    vatNumber: String(
      s?.business_tax_number ||
        allSettings?.WhoAmI?.business?.tax_registration_number ||
        ''
    ),
    invoiceHeader: String(
      s?.receipt_header ||
        sd?.receipt_header ||
        s?.invoice_header ||
        sd?.invoice_header ||
        s?.header_text ||
        sd?.header_text ||
        s?.description ||
        sd?.description ||
        ''
    ),
    invoiceFooter: String(
      s?.receipt_footer ||
        sd?.receipt_footer ||
        s?.invoice_footer ||
        sd?.invoice_footer ||
        s?.footer_text ||
        sd?.footer_text ||
        s?.terms_and_conditions ||
        sd?.terms_and_conditions ||
        ''
    ),
  };
}

/**
 * Map API order (e.g. from invoice list / ViewModal) to receipt input.
 * Best-effort for order_product + products shapes.
 */
export function mapApiOrderToReceiptInput(
  order: any,
  ctx: ReturnType<typeof buildReceiptCompanyContext>,
  isArabic: boolean,
  qrDataUrl: string
): SimplifiedTaxInvoiceReceiptInput {
  const customerName = order?.customer?.name || '-';
  const businessDate = order?.business_date || new Date().toISOString();
  const invoiceNumber =
    order?.reference || order?.invoice_number || order?.id || '-';

  const lines: ReceiptLineItem[] = [];

  if (Array.isArray(order?.order_product) && order.order_product.length > 0) {
    order.order_product.forEach((op: any) => {
      const productName =
        order?.products?.find((p: any) => p.id === op.product_id)?.name ||
        op?.product?.name ||
        op?.name ||
        '-';
      const qty = Number(op?.quantity ?? 0);
      const unitPrice = Number(op?.unit_price ?? 0);
      const discountPerUnit = Number(op?.discount_amount ?? 0);
      lines.push({
        name: String(productName),
        quantity: qty,
        unitPrice,
        discountPerUnit,
      });
    });
  } else if (Array.isArray(order?.products)) {
    order.products.forEach((p: any) => {
      const qty = Number(p?.pivot?.quantity ?? p?.quantity ?? 0);
      const unitPrice = Number(
        p?.pivot?.price ?? p?.pivot?.unit_price ?? p?.pivot?.cost ?? p?.price ?? 0
      );
      lines.push({
        name: String(p?.name || '-'),
        quantity: qty,
        unitPrice,
        discountPerUnit: Number(p?.pivot?.discount_amount ?? 0),
      });
    });
  }

  const payments: ReceiptPaymentLine[] = Array.isArray(order?.payments)
    ? order.payments.map((pay: any) => ({
        name: String(
          pay?.payment_method?.name ||
            pay?.name ||
            (isArabic ? 'دفعة' : 'Payment')
        ),
        amount: Number(pay?.amount || 0),
      }))
    : [];

  const paidAmount = payments.reduce((s, p) => s + p.amount, 0);
  const total = Number(order?.total_price ?? 0);
  const changeAmount = Math.max(0, paidAmount - total);

  return {
    isArabic,
    ...ctx,
    customerName,
    invoiceNumber: String(invoiceNumber),
    businessDate,
    items: lines,
    subtotal: Number(order?.subtotal_price ?? 0),
    tax: Number(order?.total_taxes ?? 0),
    discount: Number(order?.discount_amount ?? 0),
    total,
    payments,
    paidAmount,
    changeAmount,
    qrCodeDataUrl: qrDataUrl || String(order?.qrcode || '').trim(),
  };
}
