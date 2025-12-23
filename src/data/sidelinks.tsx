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
import Dashboard from './icons/Dashboard';
import DashboardActive from './icons/DashboardActive';
import PriceQuote from './icons/PriceQuote';
import PriceQuoteActive from './icons/PriceQuoteActive';
import Customers from './icons/Customers';
import CustomersActive from './icons/CustomersActive';
import Products from './icons/Products';
import ProductsActive from './icons/ProductsActive';
import Settings from './icons/Settings';
import SettingsActive from './icons/SettingsActive';
import Plan from './icons/Plan';
import PlanActive from './icons/PlanActive';
import PaymentMethods from './icons/PaymentMethods';
import PaymentMethodsActive from './icons/PaymentMethodsActive';
import Organization from './icons/Organization';
import OrganizationActive from './icons/OrganizationActive';
import Categories from './icons/Catogories';
import CategoriesActive from './icons/CategoriesActive';

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
    icon: <Dashboard />,
    icon1: <Dashboard />,
    icon2: <DashboardActive />,
  },
  {
    title: 'نقطة البيع', // Individual Invoices
    i18n: 'INDIVIDUAL_INVOICES',
    label: '',
    href: '/zood-dashboard/individual-invoices',
    icon: <PriceQuote />,
    icon1: <PriceQuote />,
    icon2: <PriceQuoteActive />,
  },
  {
    title: 'فاتورة المؤسسة', // Corporate Invoice
    i18n: 'CORPORATE_INVOICES',
    label: '',
    href: '/zood-dashboard/corporate-invoices',
    icon: <Organization />,
    icon1: <Organization />,
    icon2: <OrganizationActive />,
  },
  {
    title: 'فاتورة الشراء', // Purchase Invoice
    i18n: 'PURCHASE_INVOICES',
    label: '',
    href: '/zood-dashboard/purchase-invoices',
    icon: <PriceQuote />,
    icon1: <PriceQuote />,
    icon2: <PriceQuoteActive />,
  },
  {
    title: 'عرض السعر', // Price Quote
    i18n: 'PRICE_QUOTE',
    label: '',
    href: '/zood-dashboard/price-quote',
    icon: <PriceQuote />,
    icon1: <PriceQuote />,
    icon2: <PriceQuoteActive />,
  },
  {
    title: 'المخزون', // Reports
    i18n: 'STOCK',
    label: '',
    href: '/zood-dashboard',
    icon: <IconBoxSeam size={20} />,
    sub: [
      {
        title: 'المنتجات', // Products
        i18n: 'PRODUCTS',
        label: '',
        href: '/zood-dashboard/products',
        icon: <Products />,
        icon1: <Products />,
        icon2: <ProductsActive />,
      },
      {
        title: 'الفئات', // Categories
        i18n: 'CATEGORIES',
        label: '',
        href: '/zood-dashboard/categories',
        icon: <Categories />,
        icon1: <Categories />,
        icon2: <CategoriesActive />,
      }
    ]
  },
  {
    title: 'العملاء', // Customers
    i18n: 'CUSTOMERS',
    label: '',
    href: '/zood-dashboard/customers',
    icon: <Customers />,
    icon1: <Customers />,
    icon2: <CustomersActive />,
  },
  {
    title: 'الموردين', // Resources
    i18n: 'RESOURCES',
    label: '',
    href: '/zood-dashboard/resources',
    icon: <Customers />,
    icon1: <Customers />,
    icon2: <CustomersActive />,
  },
  {
    title: 'التقارير', // Reports
    i18n: 'REPORTS',
    label: '',
    href: '/zood-dashboard',
    icon: <IconChartHistogram size={20} />,
    sub: [
      {
        title: 'فاتورة عاديه', // Normal Report
        i18n: 'NORMAL_REPORT',
        label: '',
        href: '/zood-dashboard/normal-report',
        icon: <PriceQuote />,
        icon1: <PriceQuote />,
        icon2: <PriceQuoteActive />,
      },
      {
        title: 'فاتورة B2B', // B2B Report
        i18n: 'B2B_REPORT',
        label: '',
        href: '/zood-dashboard/b2b-report',
        icon: <PriceQuote />,
        icon1: <PriceQuote />,
        icon2: <PriceQuoteActive />,
      },
      {
        title: 'فاتورة الشراء', // Purchase Report
        i18n: 'PURCHASE_REPORT',
        label: '',
        href: '/zood-dashboard/purchase-report',
        icon: <PriceQuote />,
        icon1: <PriceQuote />,
        icon2: <PriceQuoteActive />,
      },
    ],
  },
  {
    title: 'خطتي', // My Plan
    i18n: 'MY_PLAN',
    label: '',
    href: '/zood-dashboard/my-plan',
    icon: <Plan />,
    icon1: <Plan />,
    icon2: <PlanActive />,
  },
  {
    title: 'طرق الدفع', // Payment Methods
    i18n: 'PAYMENT_METHODS',
    label: '',
    href: '/zood-dashboard/payment-methods',
    icon: <PaymentMethods />,
    icon1: <PaymentMethods />,
    icon2: <PaymentMethodsActive />,
  },
  {
    title: 'الاعدادات', // Settings
    i18n: 'SETTINGS',
    label: '',
    href: '/zood-dashboard/settings',
    icon: <Settings />,
    icon1: <Settings />,
    icon2: <SettingsActive />,
  },
];
