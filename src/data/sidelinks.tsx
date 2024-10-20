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
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'فواتير افراد', // Individual Invoices
    label: '',
    href: '/zood-dashboard/individual-invoices',
    icon: <IconHexagonNumber1 size={18} />,
  },
  {
    title: 'فاتورة المؤسسة', // Corporate Invoice
    label: '',
    href: '/zood-dashboard/corporate-invoices',
    icon: <IconHexagonNumber2 size={18} />,
  },
  {
    title: 'فاتورة الشراء', // Purchase Invoice
    label: '',
    href: '/zood-dashboard/purchase-invoices',
    icon: <IconHexagonNumber3 size={18} />,
  },
  {
    title: 'عرض السعر', // Price Quote
    label: '',
    href: '/zood-dashboard/price-quote',
    icon: <IconHexagonNumber4 size={18} />,
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
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'العملاء', // Customers
    label: '',
    href: '/zood-dashboard/customers',
    icon: <IconUsers size={18} />,
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
    href: '/zood-dashboard/reports',
    icon: <IconChartHistogram size={18} />,
    sub: [
      {
        title: 'فاتورة عاديه', // My Plan
        label: '',
        href: '/zood-dashboard/reports/normal-invoice',
        icon: <IconHexagonNumber5 size={18} />,
      },
      {
        title: 'فاتورة B2B', // My Plan
        label: '',
        href: '/zood-dashboard/reports/b2b-invoices',
        icon: <IconHexagonNumber5 size={18} />,
      },
      {
        title: 'فاتورة الشراء', // My Plan
        label: '',
        href: '/zood-dashboard/reports/purchase-invoices',
        icon: <IconHexagonNumber5 size={18} />,
      },
    ],
  },
  {
    title: 'خطتي', // My Plan
    label: '',
    href: '/zood-dashboard/my-plan',
    icon: <IconHexagonNumber5 size={18} />,
  },
  {
    title: 'طرق الدفع', // Payment Methods
    label: '',
    href: '/zood-dashboard/payment-methods',
    icon: <IconRouteAltLeft size={18} />,
  },
  {
    title: 'الاعدادات', // Settings
    label: '',
    href: '/zood-dashboard/settings',
    icon: <IconSettings size={18} />,
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
