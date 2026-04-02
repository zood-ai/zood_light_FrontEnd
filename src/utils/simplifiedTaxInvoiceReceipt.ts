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

const QZ_TRAY_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/qz-tray@2.2.4/qz-tray.js';
const POS_QZ_ENABLED_KEY = 'pos_qz_enabled';
const POS_QZ_PRINTER_NAME_KEY = 'pos_qz_printer_name';
let qzScriptLoadingPromise: Promise<any> | null = null;
let isQzSecurityConfigured = false;
let cachedQzPrinterName = '';
const QZ_CONNECT_TIMEOUT_MS = 4500;
const QZ_QUERY_TIMEOUT_MS = 4500;
const QZ_PRINT_TIMEOUT_MS = 7000;

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

  if (!qz.websocket?.isActive?.()) {
    await withTimeout(
      qz.websocket.connect({ retries: 1, delay: 0 }),
      QZ_CONNECT_TIMEOUT_MS,
      'QZ_TIMEOUT_CONNECT'
    );
  }

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

  if (!qz.websocket?.isActive?.()) {
    await withTimeout(
      qz.websocket.connect({ retries: 1, delay: 0 }),
      QZ_CONNECT_TIMEOUT_MS,
      'QZ_TIMEOUT_CONNECT'
    );
  }

  const configuredPrinter =
    typeof window !== 'undefined'
      ? String(window.localStorage.getItem(POS_QZ_PRINTER_NAME_KEY) || '').trim()
      : '';
  if (configuredPrinter) {
    cachedQzPrinterName = configuredPrinter;
    return;
  }

  const defaultPrinter = await resolveDefaultQzPrinter(qz);
  if (defaultPrinter) {
    cachedQzPrinterName = defaultPrinter;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(POS_QZ_PRINTER_NAME_KEY, defaultPrinter);
    }
  }
}

function notifyQzPrintIssue(error: any): void {
  const raw = String(error?.message || error || '');
  const normalized = raw.toLowerCase();
  const hasNoPrinter =
    raw.includes('QZ_NO_PRINTER') ||
    normalized.includes('default qz printer') ||
    normalized.includes('no printer');
  const hasTimeout =
    raw.includes('QZ_TIMEOUT_') ||
    normalized.includes('timeout') ||
    normalized.includes('timed out');
  const description = hasNoPrinter
    ? 'QZ Tray is connected, but no printer is configured. Fallback to browser print.'
    : hasTimeout
    ? 'QZ Tray did not respond in time. Fallback to browser print.'
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

  // Development-friendly defaults: if signed certificates are not configured yet,
  // fallback print path still exists and QZ errors are handled by caller.
  qz.security.setCertificatePromise(() => Promise.resolve(''));
  qz.security.setSignaturePromise(() => () => Promise.resolve(''));
  isQzSecurityConfigured = true;
}

function openAndPrintWithBrowser(
  html: string,
  options?: { onAfterPrint?: () => void }
) {
  const printWindow = window.open('', '_blank', 'width=420,height=720');
  if (!printWindow) {
    toast({
      description:
        'Browser blocked the print window. Please allow pop-ups for this site.',
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
