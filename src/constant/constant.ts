interface Option {
  value: string;
  label: string;
}

export const userTypes = [
  {
    value: 'individual',
    label: 'individual',
  },
  {
    value: 'company',
    label: 'company',
  },
];
export const userStatus = [
  {
    value: 'active',
    label: 'active',
  },
  {
    value: 'inactive',
    label: 'inactive',
  },
  {
    value: 'deleted',
    label: 'deleted',
  },
];
export const userRoles = [
  {
    value: 'admin',
    label: 'admin',
  },
  {
    value: 'seller',
    label: 'seller',
  },
  {
    value: 'user',
    label: 'user',
  },
  {
    value: 'superadmin',
    label: 'super admin',
  },
];

export const gender = [
  {
    value: 'male',
    label: 'male',
  },
  {
    value: 'female',
    label: 'female',
  },
];
export const selectOptions: Option[] = [
  { value: 'NationalID', label: 'National ID' },
  { value: 'passport', label: 'Passport' },
  { value: 'driverLicense', label: 'Driver License' },
];
export const paymentmethod: any = [
  {
    value: '1',
    label: 'Cash',
  },
  {
    value: '2',
    label: 'Card',
  },
  {
    value: '3',
    label: 'Other',
  },
];

export const titleMapping = (path) => {
  const Titles = {
    '/zood-dashboard': {
      en: 'Dashboard',
      ar: 'لوحة التحكم',
    },
    '/zood-dashboard/individual-invoices': {
      en: 'Individual Invoices',
      ar: 'فواتير افراد',
    },
    '/zood-dashboard/individual-invoices/add/shop-card': {
      en: 'Individual Invoices',
      ar: 'فواتير افراد',
    },
    '/zood-dashboard/individual-invoices/edit': {
      en: 'Individual Invoices',
      ar: 'فواتير افراد',
    },
    '/zood-dashboard/corporate-invoices': {
      en: 'Corporate Invoice',
      ar: 'فاتورة المؤسسة',
    },
    '/zood-dashboard/corporate-invoices/add/shop-card': {
      en: 'Corporate Invoice',
      ar: 'فاتورة المؤسسة',
    },
    '/zood-dashboard/corporate-invoices/edit': {
      en: 'Corporate Invoice',
      ar: 'فاتورة المؤسسة',
    },
    '/zood-dashboard/fast-invoices': {
      en: 'Fast Invoice',
      ar: 'فاتورة سريعة',
    },
    '/zood-dashboard/fast-invoices/add': {
      en: 'Fast Invoice',
      ar: 'فاتورة سريعة',
    },
    '/zood-dashboard/purchase-invoices': {
      en: 'Purchase Invoice',
      ar: 'فاتورة الشراء',
    },
    '/zood-dashboard/purchase-invoices/add': {
      en: 'Purchase Invoice',
      ar: 'فاتورة الشراء',
    },
    '/zood-dashboard/purchase-invoices/edit': {
      en: 'Purchase Invoice',
      ar: 'فاتورة الشراء',
    },
    '/zood-dashboard/price-quote': {
      en: 'Price Quote',
      ar: 'عرض السعر',
    },
    '/zood-dashboard/price-quote/add': {
      en: 'Price Quote',
      ar: 'عرض السعر',
    },
    '/zood-dashboard/price-quote/edit': {
      en: 'Price Quote',
      ar: 'عرض السعر',
    },
    '/zood-dashboard/price-quote/add/shop-card': {
      en: 'Price Quote',
      ar: 'عرض السعر',
    },
    '/zood-dashboard/products': {
      en: 'Products',
      ar: 'المنتجات',
    },
    '/zood-dashboard/products/add': {
      en: 'Products',
      ar: 'المنتجات',
    },
    '/zood-dashboard/products/edit': {
      en: 'Products',
      ar: 'المنتج',
    },
    '/zood-dashboard/categories': {
      en: 'Categories',
      ar: 'الفئات',
    },
    '/zood-dashboard/categories/add': {
      en: 'Categories',
      ar: 'الفئات',
    },
    '/zood-dashboard/categories/edit': {
      en: 'Categories',
      ar: 'الفئه',
    },
    '/zood-dashboard/customers': {
      en: 'Customers',
      ar: 'العملاء',
    },
    '/zood-dashboard/customers/add': {
      en: 'Customers',
      ar: 'العملاء',
    },
    '/zood-dashboard/customers/edit': {
      en: 'Customers',
      ar: 'العميل',
    },
    '/zood-dashboard/resources': {
      en: 'Resources',
      ar: 'الموردين',
    },
    '/zood-dashboard/resources/add': {
      en: 'Resources',
      ar: 'الموردين',
    },
    '/zood-dashboard/resources/edit': {
      en: 'Resources',
      ar: 'المورد',
    },
    '/zood-dashboard/my-plan': {
      en: 'My Plan',
      ar: 'خطتي',
    },
    '/zood-dashboard/payment-methods': {
      en: 'Payment Methods',
      ar: 'طرق الدفع',
    },
    '/zood-dashboard/payment-methods/add': {
      en: 'Payment Methods',
      ar: 'طرق الدفع',
    },
    '/zood-dashboard/payment-methods/edit': {
      en: 'Payment Methods',
      ar: 'طرق الدفع',
    },
    '/zood-dashboard/settings': {
      en: 'Settings',
      ar: 'الاعدادات',
    },
    '/zood-dashboard/profile': {
      en: 'Profile',
      ar: 'الملف الشخصي',
    },
    '/zood-dashboard/contact-whatsapp': {
      en: 'Contact via WhatsApp',
      ar: 'تواصل عبر الواتساب',
    },
    '/zood-dashboard/items-report': {
      en: 'Items Report',
      ar: 'تقرير الأصناف',
    },
    '/logout': {
      en: 'Logout',
      ar: 'تسجيل الخروج',
    },
  };

  // handle if last elelemnt in path name is id remove it
  const holder = path.split('/');

  const last = holder.pop();
  if (last.length < 22) {
    holder.push(last);
  }
  path = holder.join('/');

  return Titles[path];
};
