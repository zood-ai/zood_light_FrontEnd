import { DashIcon } from '@radix-ui/react-icons';
import {
  IconApps,
  IconBarrierBlock,
  IconBoxSeam,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconError404,
  IconExclamationCircle,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconServerOff,
  IconSettings,
  IconTruck,
  IconUserShield,
  IconUsers,
  IconLock,
  IconBrandWhatsapp,
  IconDashboard,
  IconInvoice,
  IconFileInvoice,
  IconLayoutGrid,
  IconBuildingFactory2,
  IconBuildingSkyscraper,
  IconFileDollar,
  IconReceipt,
  IconLayoutGridAdd,
  IconTargetArrow,
  IconCreditCard,
  IconLayoutGridFilled,
  IconReceiptFilled,
  IconLayout2Filled,
  IconUserFilled,
  IconUserDown,
  IconUserEdit,
  IconCreditCardFilled,
} from '@tabler/icons-react';

export interface NavLink {
  title: string;
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
    label: '',
    href: '/zood-dashboard',
    icon: <IconLayoutGridFilled size={18} />,
  },
  {
    title: 'نقطة البيع', // Individual Invoices
    label: '',
    href: '/zood-dashboard/individual-invoices',
    icon: <IconReceiptFilled size={18} />,
  },
  {
    title: 'فاتورة المؤسسة', // Corporate Invoice
    label: '',
    href: '/zood-dashboard/corporate-invoices',
    icon: <IconBuildingSkyscraper size={18} />,
  },
  // {
  //   title: 'فاتورة سريعة', // Corporate Invoice
  //   label: '',
  //   href: '/zood-dashboard/fast-invoices',
  //   icon: <IconReceiptFilled size={18} />,
  // },
  {
    title: 'فاتورة الشراء', // Purchase Invoice
    label: '',
    href: '/zood-dashboard/purchase-invoices',
    icon: <IconReceiptFilled size={18} />,
  },
  {
    title: 'عرض السعر', // Price Quote
    label: '',
    href: '/zood-dashboard/price-quote',
    icon: <IconReceiptFilled size={18} />,
  },
  {
    title: 'المنتجات', // Products
    label: '',
    href: '/zood-dashboard/products',
    icon: <IconBoxSeam size={18} />,
  },
  {
    title: 'الفئات', // Categories
    label: '',
    href: '/zood-dashboard/categories',
    icon: <IconLayout2Filled size={18} />,
  },
  {
    title: 'العملاء', // Customers
    label: '',
    href: '/zood-dashboard/customers',
    icon: <IconUserFilled size={18} />,
  },
  {
    title: 'الموارد', // Resources
    label: '',
    href: '/zood-dashboard/resources',
    icon: <IconTruck size={18} />,
  },
  {
    title: 'التقارير', // Reports
    label: '',
    href: '/zood-dashboard',
    icon: <IconChartHistogram size={18} />,
    sub: [
      {
        title: 'فاتورة عاديه', // My Plan
        label: '',
        href: '/zood-dashboard/normal-report',
        icon: <IconReceipt size={18} />,
      },
      {
        title: 'فاتورة B2B', // My Plan
        label: '',
        href: '/zood-dashboard/b2b-report',
        icon: <IconReceipt size={18} />,
      },
      {
        title: 'فاتورة الشراء', // My Plan
        label: '',
        href: '/zood-dashboard/purchase-report',
        icon: <IconReceipt size={18} />,
      },
    ],
  },
  {
    title: 'خطتي', // My Plan
    label: '',
    href: '/zood-dashboard/my-plan',
    icon: <IconTargetArrow size={18} />,
  },
  {
    title: 'طرق الدفع', // Payment Methods
    label: '',
    href: '/zood-dashboard/payment-methods',
    icon: <IconCreditCardFilled size={18} />,
  },
  {
    title: 'الاعدادات', // Settings
    label: '',
    href: '/zood-dashboard/settings',
    icon: <IconSettings size={18} />,
  },
  {
    title: 'الملف الشخصي', // Settings
    label: '',
    href: '/zood-dashboard/profile',
    icon: <IconUserEdit size={18} />,
  },
  {
    title: 'تواصل عبر الواتساب', // Contact via WhatsApp
    label: '',
    href: '/zood-dashboard/contact-whatsapp',
    icon: <IconBrandWhatsapp size={18} />,
  },
  {
    title: 'تسجيل الخروج', // Logout
    label: '',
    href: '/logout',
    icon: <IconLock size={18} />,
  },
];
