import {
  IconBoxSeam,
  IconChartHistogram,
  IconSettings,
  IconTruck,
  IconLock,
  IconBrandWhatsapp,
  IconBuildingSkyscraper,
  IconReceipt,
  IconTargetArrow,
  IconLayoutGridFilled,
  IconReceiptFilled,
  IconLayout2Filled,
  IconUserFilled,
  IconUserEdit,
  IconCreditCardFilled,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface NavLink {
  title: string;
  i18n: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: 'لوحة التحكم', // Dashboard
    i18n: 'DASHBOARD',
    label: '',
    href: '/zood-dashboard',
    icon: <IconLayoutGridFilled size={18} />,
  },
  {
    title: 'نقطة البيع', // Individual Invoices
    i18n: 'INDIVIDUAL_INVOICES',
    label: '',
    href: '/zood-dashboard/individual-invoices',
    icon: <IconReceiptFilled size={18} />,
  },
  {
    title: 'فاتورة المؤسسة', // Corporate Invoice
    i18n: 'CORPORATE_INVOICES',
    label: '',
    href: '/zood-dashboard/corporate-invoices',
    icon: <IconBuildingSkyscraper size={18} />,
  },
  {
    title: 'فاتورة الشراء', // Purchase Invoice
    i18n: 'PURCHASE_INVOICES',
    label: '',
    href: '/zood-dashboard/purchase-invoices',
    icon: <IconReceiptFilled size={18} />,
  },
  {
    title: 'عرض السعر', // Price Quote
    i18n: 'PRICE_QUOTE',
    label: '',
    href: '/zood-dashboard/price-quote',
    icon: <IconReceiptFilled size={18} />,
  },
  {
    title: 'المنتجات', // Products
    i18n: 'PRODUCTS',
    label: '',
    href: '/zood-dashboard/products',
    icon: <IconBoxSeam size={18} />,
  },
  {
    title: 'الفئات', // Categories
    i18n: 'CATEGORIES',
    label: '',
    href: '/zood-dashboard/categories',
    icon: <IconLayout2Filled size={18} />,
  },
  {
    title: 'العملاء', // Customers
    i18n: 'CUSTOMERS',
    label: '',
    href: '/zood-dashboard/customers',
    icon: <IconUserFilled size={18} />,
  },
  {
    title: 'الموردين', // Resources
    i18n: 'RESOURCES',
    label: '',
    href: '/zood-dashboard/resources',
    icon: <IconTruck size={18} />,
  },
  {
    title: 'التقارير', // Reports
    i18n: 'REPORTS',
    label: '',
    href: '/zood-dashboard',
    icon: <IconChartHistogram size={18} />,
    sub: [
      {
        title: 'فاتورة عاديه', // My Plan
        i18n: 'NORMAL_REPORT',
        label: '',
        href: '/zood-dashboard/normal-report',
        icon: <IconReceipt size={18} />,
      },
      {
        title: 'فاتورة B2B', // My Plan
        i18n: 'B2B_REPORT',
        label: '',
        href: '/zood-dashboard/b2b-report',
        icon: <IconReceipt size={18} />,
      },
      {
        title: 'فاتورة الشراء', // My Plan
        i18n: 'PURCHASE_REPORT',
        label: '',
        href: '/zood-dashboard/purchase-report',
        icon: <IconReceipt size={18} />,
      },
    ],
  },
  {
    title: 'خطتي', // My Plan
    i18n: 'MY_PLAN',
    label: '',
    href: '/zood-dashboard/my-plan',
    icon: <IconTargetArrow size={18} />,
  },
  {
    title: 'طرق الدفع', // Payment Methods
    i18n: 'PAYMENT_METHODS',
    label: '',
    href: '/zood-dashboard/payment-methods',
    icon: <IconCreditCardFilled size={18} />,
  },
  {
    title: 'الاعدادات', // Settings
    i18n: 'SETTINGS',
    label: '',
    href: '/zood-dashboard/settings',
    icon: <IconSettings size={18} />,
  },
  {
    title: 'الملف الشخصي', // Profile
    i18n: 'PROFILE',
    label: '',
    href: '/zood-dashboard/profile',
    icon: <IconUserEdit size={18} />,
  },
  {
    title: 'تواصل عبر الواتساب', // Contact via WhatsApp
    i18n: 'CONTACT_VIA_WHATSAPP',
    label: '',
    href: '/zood-dashboard/contact-whatsapp',
    icon: <IconBrandWhatsapp size={18} />,
  },
  {
    title: 'تسجيل الخروج', // Logout
    i18n: 'LOGOUT',
    label: '',
    href: '/',
    icon: <IconLock size={18} />,
  },
];
