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
  IconUsersGroup,
  IconUsers,
  IconLockCheck,
  IconGitBranch,
  IconCategory,
} from '@tabler/icons-react';
import { BiSolidPurchaseTag } from 'react-icons/bi';
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
import { Permissions, rolePermissions, Roles } from '@/config/roles';

const navIconProps = { size: 18, stroke: 1.9 } as const;

export interface NavLink {
  title: string;
  i18n: string; // Added this key to support i18n
  label?: string;
  href: string;
  icon: JSX.Element;
  icon1?: JSX.Element;
  icon2?: JSX.Element;
  authorities?: string[];
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
  authorities: string[];
}

//  Add i18n keys without altering the title field
export const sidelinks: SideLink[] = [
  {
    title: 'لوحة التحكم', // Dashboard
    i18n: 'DASHBOARD',
    label: '',
    href: '/zood-dashboard',
    icon: <IconLayoutDashboardFilled {...navIconProps} />,
    authorities: [],
  },
  {
    title: 'نقطة البيع', // Individual Invoices
    i18n: 'INDIVIDUAL_INVOICES',
    label: '',
    href: '/zood-dashboard/individual-invoices',
    icon: <IconReceiptFilled {...navIconProps} />,
    authorities: rolePermissions[Roles.ORDERS],
  },
  {
    title: 'فاتورة المؤسسة', // Corporate Invoice
    i18n: 'CORPORATE_INVOICES',
    label: '',
    href: '/zood-dashboard/corporate-invoices',
    authorities: rolePermissions[Roles.ORDERS],
    icon: <IconBuildingSkyscraper {...navIconProps} />,
  },
  {
    title: 'عرض السعر', // Price Quote
    i18n: 'PRICE_QUOTE',
    label: '',
    href: '/zood-dashboard/price-quote',
    authorities: rolePermissions[Roles.PRICE_QUOTES],
    icon: <IconTargetArrow {...navIconProps} />,
  },
  {
    title: 'المشتريات',
    i18n: 'المشتريات',
    label: '',
    href: '/zood-dashboard',
    icon: <BiSolidPurchaseTag size={20} />,
    authorities: [],
    sub: [
      {
        title: 'فاتورة الشراء', // Purchase Invoice
        i18n: 'PURCHASE_INVOICES',
        label: '',
        href: '/zood-dashboard/purchase-invoices',
        authorities: rolePermissions[Roles.PURCHASING],
        icon: <IconReceipt {...navIconProps} />,
      },
      {
        title: 'الموردين', // Resources
        i18n: 'RESOURCES',
        label: '',
        href: '/zood-dashboard/resources',
        authorities: rolePermissions[Roles.SUPPLIERS],
        icon: <IconTruck {...navIconProps} />,
      },
    ],
  },
  {
    title: 'المخزون', // Reports
    i18n: 'STOCK',
    label: '',
    href: '/zood-dashboard',
    icon: <IconBoxSeam {...navIconProps} />,
    authorities: rolePermissions[Roles.INVENTORY],
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
    authorities: rolePermissions[Roles.CUSTOMERS],
  },
  {
    title: 'التقارير', // Reports
    i18n: 'REPORTS',
    label: '',
    href: '/zood-dashboard',
    icon: <IconChartHistogram size={20} />,
    authorities: rolePermissions[Roles.REPORTS],
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
      {
        title: 'تقرير المدفوعات', // Payments Report
        i18n: 'PAYMENT_REPORT',
        label: '',
        href: '/zood-dashboard/payment-report',
        icon: <IconCreditCardFilled {...navIconProps} />,
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
    authorities: rolePermissions[Roles.SETTINGS],
  },
  {
    title: 'طرق الدفع', // Payment Methods
    i18n: 'PAYMENT_METHODS',
    label: '',
    href: '/zood-dashboard/payment-methods',
    icon: <IconCreditCardFilled {...navIconProps} />,
    authorities: rolePermissions[Roles.PAYMENT_METHODS],
  },
  {
    title: 'المستخدمين',
    i18n: 'USERS',
    label: '',
    href: '/zood-dashboard/users',
    icon: <IconUsers />,
    icon1: <IconUsers />,
    icon2: <IconUsers />,
    authorities: rolePermissions[Roles.USERS],
  },
  {
    title: 'الفروع',
    i18n: 'BRANCHES',
    label: '',
    href: '/zood-dashboard/branches',
    icon: <IconGitBranch />,
    icon1: <IconGitBranch />,
    icon2: <IconGitBranch />,
    authorities: rolePermissions[Roles.BRANCHES],
  },
  {
    title: 'الادوار و الصلاحيات',
    i18n: 'ROLES_AND_PERMISSIONS',
    label: '',
    href: '/zood-dashboard/roles-and-permissions',
    icon: <IconLockCheck />,
    icon1: <IconLockCheck />,
    icon2: <IconLockCheck />,
    authorities: rolePermissions[Roles.SETTINGS],
  },
  {
    title: 'الاعدادات', // Settings
    i18n: 'SETTINGS',
    label: '',
    href: '/zood-dashboard/settings',
    icon: <IconSettings {...navIconProps} />,
    authorities: rolePermissions[Roles.SETTINGS],
  },
];
