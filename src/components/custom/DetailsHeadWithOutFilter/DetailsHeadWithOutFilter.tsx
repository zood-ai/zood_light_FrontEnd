import React from 'react';

import { DetailsHeadWithOutFilterProps } from './DetailsHeadWithOutFilter.types';

import './DetailsHeadWithOutFilter.css';
import { BackBtn } from '../BackBtn';
// titleMapping.ts
const titleMapping = {
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
  '/zood-dashboard/corporate-invoices': {
    en: 'Corporate Invoice',
    ar: 'فاتورة المؤسسة',
  },
  '/zood-dashboard/corporate-invoices/add/shop-card': {
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
  '/zood-dashboard/price-quote': {
    en: 'Price Quote',
    ar: 'عرض السعر',
  },
  '/zood-dashboard/price-quote/add': {
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
  '/zood-dashboard/categories': {
    en: 'Categories',
    ar: 'الفئات',
  },
  '/zood-dashboard/categories/add': {
    en: 'Categories',
    ar: 'الفئات',
  },
  '/zood-dashboard/customers': {
    en: 'Customers',
    ar: 'العملاء',
  },
  '/zood-dashboard/customers/add': {
    en: 'Customers',
    ar: 'العملاء',
  },
  '/zood-dashboard/resources': {
    en: 'Resources',
    ar: 'الموارد',
  },
  '/zood-dashboard/resources/add': {
    en: 'Resources',
    ar: 'الموارد',
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
  '/logout': {
    en: 'Logout',
    ar: 'تسجيل الخروج',
  },
};

export default titleMapping;

export const DetailsHeadWithOutFilter: React.FC<
  DetailsHeadWithOutFilterProps
> = ({ bkAction , mainTittle = 'Title Not Found' }) => {
  const pagePath = window.location.pathname; // Get the current path
  const title = titleMapping[pagePath]; // Get the title object based on the path
  const isArabic = true; // Set this based on your app's localization logic
  return (
    <>
      <div className="grid grid-cols-1">
        <div onClick={bkAction ? bkAction : () => {}}>
          <BackBtn bkAction={bkAction} />
        </div>
        <div className=" max-w-[580px] my-4">
          <div className="flex gap-3 max-w-full text-right text-zinc-800  shrink grow">
            <div className="    text-2xl  font-semibold ">
              {title ? (isArabic ? title.ar : title.en) : mainTittle}
            </div>
            <div className="flex  gap-px  items-center  text-sm font-medium mt-[10px] shrink grow">
              <span>{' pm '}</span>
              <div className="  ms-1">{' 12:00 '}</div>
              {' - '}
              <div className=" ">10/06/2024</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
