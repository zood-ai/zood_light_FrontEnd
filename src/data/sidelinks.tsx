import {
  IconBoxSeam,
  IconChartHistogram,
  IconSettings,
  IconTruck,
  IconBuildingSkyscraper,
  IconReceipt,
  IconTargetArrow,
  IconLayoutDashboardFilled,
  IconReceiptFilled,
  IconLayout2Filled,
  IconUserFilled,
  IconCreditCardFilled,
  IconCategory,
} from '@tabler/icons-react';

const navIconProps = { size: 18, stroke: 1.9 } as const;

export interface NavLink {
  title: string;
  i18n: string; // Added this key to support i18n
  label?: string;
  href: string;
  icon: JSX.Element;
  icon1?: JSX.Element;
  icon2?: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

//  Add i18n keys without altering the title field
export const sidelinks: SideLink[] = [
  {
    title: 'لوحة التحكم', // Dashboard
    i18n: 'DASHBOARD',
    label: '',
    href: '/zood-dashboard',
    icon: <IconLayoutDashboardFilled {...navIconProps} />,
  },
  {
    title: 'نقطة البيع', // Individual Invoices
    i18n: 'INDIVIDUAL_INVOICES',
    label: '',
    href: '/zood-dashboard/individual-invoices',
    icon: <IconReceiptFilled {...navIconProps} />,
  },
  {
    title: 'فاتورة المؤسسة', // Corporate Invoice
    i18n: 'CORPORATE_INVOICES',
    label: '',
    href: '/zood-dashboard/corporate-invoices',
    icon: <IconBuildingSkyscraper {...navIconProps} />,
  },
  {
    title: 'فاتورة الشراء', // Purchase Invoice
    i18n: 'PURCHASE_INVOICES',
    label: '',
    href: '/zood-dashboard/purchase-invoices',
    icon: <IconReceipt {...navIconProps} />,
  },
  {
    title: 'عرض السعر', // Price Quote
    i18n: 'PRICE_QUOTE',
    label: '',
    href: '/zood-dashboard/price-quote',
    icon: <IconTargetArrow {...navIconProps} />,
  },
  {
    title: 'المخزون', // Reports
    i18n: 'STOCK',
    label: '',
    href: '/zood-dashboard',
    icon: <IconBoxSeam {...navIconProps} />,
    sub: [
      {
        title: 'المنتجات', // Products
        i18n: 'PRODUCTS',
        label: '',
        href: '/zood-dashboard/products',
        icon: <IconBoxSeam {...navIconProps} />,
      },
      {
        title: 'الفئات', // Categories
        i18n: 'CATEGORIES',
        label: '',
        href: '/zood-dashboard/categories',
        icon: <IconCategory {...navIconProps} />,
      },
    ],
  },
  {
    title: 'العملاء', // Customers
    i18n: 'CUSTOMERS',
    label: '',
    href: '/zood-dashboard/customers',
    icon: <IconUserFilled {...navIconProps} />,
  },
  {
    title: 'الموردين', // Resources
    i18n: 'RESOURCES',
    label: '',
    href: '/zood-dashboard/resources',
    icon: <IconTruck {...navIconProps} />,
  },
  {
    title: 'التقارير', // Reports
    i18n: 'REPORTS',
    label: '',
    href: '/zood-dashboard',
    icon: <IconChartHistogram {...navIconProps} />,
    sub: [
      {
        title: 'فاتورة عاديه', // Normal Report
        i18n: 'NORMAL_REPORT',
        label: '',
        href: '/zood-dashboard/normal-report',
        icon: <IconReceipt {...navIconProps} />,
      },
      {
        title: 'فاتورة B2B', // B2B Report
        i18n: 'B2B_REPORT',
        label: '',
        href: '/zood-dashboard/b2b-report',
        icon: <IconBuildingSkyscraper {...navIconProps} />,
      },
      {
        title: 'فاتورة الشراء', // Purchase Report
        i18n: 'PURCHASE_REPORT',
        label: '',
        href: '/zood-dashboard/purchase-report',
        icon: <IconTruck {...navIconProps} />,
      },
      {
        title: 'تقرير الأصناف', // Items Report
        i18n: 'ITEMS_REPORT',
        label: '',
        href: '/zood-dashboard/items-report',
        icon: <IconBoxSeam {...navIconProps} />,
      },
    ],
  },
  {
    title: 'خطتي', // My Plan
    i18n: 'MY_PLAN',
    label: '',
    href: '/zood-dashboard/my-plan',
    icon: <IconCreditCardFilled {...navIconProps} />,
  },
  {
    title: 'طرق الدفع', // Payment Methods
    i18n: 'PAYMENT_METHODS',
    label: '',
    href: '/zood-dashboard/payment-methods',
    icon: <IconCreditCardFilled {...navIconProps} />,
  },
  {
    title: 'الاعدادات', // Settings
    i18n: 'SETTINGS',
    label: '',
    href: '/zood-dashboard/settings',
    icon: <IconSettings {...navIconProps} />,
  },
];
