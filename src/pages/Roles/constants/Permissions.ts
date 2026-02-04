// All available permissions in the system
/* 
  //////// صلاحيات الفواتير (نقطة بيع - المؤسسة - عرض سعر) و صلاحية الشراء
  'orders:read',
  'orders:manage',
  'orders:manage_tags',
  'purchasing:drafts:manage',
  'purchasing:closed:manage',
  'purchasing_from_po:drafts:manage',
  'direct_purchasing:drafts:manage',

  //////// صلاحيات المخزون
  'dashboard:inventory',
  'inventory_count:drafts:manage',
  'inventory_count:closed:manage',
  'inventory_items:read',
  'inventory_items:manage',
  
  //////// صلاحيات العملاء
  'customers:read',
  'customers:read_insights',
  'customers:manage',
  'customers:manage_house_account',
  'customers:manage_loyalty',

  //////// صلاحيات الموردين
  'suppliers:read',
  'suppliers:manage',

  //////// صلاحيات طرق الدفع
  'settings:manage_payment_methods',
  
  //////// صلاحيات المستخدمين
  'users:manage',

  //////// صلايحات الفروع
  'branches:manage',

  //////// صلاحيات الادوار
  roles only if the user is_owner = 1
  
  //////// صلاحيات الاعدادات
  'settings:manage',
  'settings:manage_taxes_and_groups',
  'settings:manage_charges',
  'settings:manage_tags',
  'settings:manage_reasons',
  'settings:manage_kitchen_flows',
  'settings:manage_reservations',
  'settings:manage_online_ordering',
  'settings:manage_price_tags',
  'settings:manage_notifications',
*/

export const ALL_PERMISSIONS = [
  // صلاحيات الفواتير و الشراء
  'orders:read',
  'orders:manage',
  'orders:manage_tags',
  'purchasing:drafts:manage',
  'purchasing:closed:manage',
  'purchasing_from_po:drafts:manage',
  'direct_purchasing:drafts:manage',
  'dashboard:inventory',
  'inventory_count:drafts:manage',
  'inventory_count:closed:manage',
  'inventory_items:read',
  'inventory_items:manage',
  'menu:read',
  'menu:manage',

  // صلاحيات المخزون
  'dashboard:inventory',
  'inventory_count:drafts:manage',
  'inventory_count:closed:manage',
  'inventory_items:read',
  'inventory_items:manage',
  'menu:read',
  'menu:manage',

  // صلاحيات العملاء
  'customers:read',
  'customers:read_insights',
  'customers:manage',
  'customers:manage_house_account',
  'customers:manage_loyalty',

  // صلاحيات الموردين
  'suppliers:read',
  'suppliers:manage',

  // صلاحيات طرق الدفع
  'settings:manage_payment_methods',

  // صلاحيات المستخدمين
  'users:manage',

  // صلاحيات الفروع
  'branches:manage',

  // صلاحيات الاعدادات
  'settings:manage',
  'settings:manage_taxes_and_groups',
  'settings:manage_charges',
  'settings:manage_tags',
  'settings:manage_reasons',
  'settings:manage_kitchen_flows',
  'settings:manage_reservations',
  'settings:manage_online_ordering',
  'settings:manage_price_tags',
  'settings:manage_notifications',

  /* 
  // Commented permissions - not used in current implementation
  'delivery-partners:read',
  'delivery-partners:read_insights',
  'delivery-partners:manage',
  'delivery-partners:manage_house_account',
  'delivery-partners:manage_loyalty',
  'po:drafts:manage',
  'po:posted:manage',
  'po:approved:manage',
  'po:approved:receive',
  'to:drafts:manage',
  'to:approved:manage',
  'transfers:drafts:manage',
  'transfers:closed:manage',
  'transfers:recieved:manage',
  'production:drafts:manage',
  'production:closed:manage',
  'quantity_adjustment:drafts:manage',
  'quantity_adjustment:closed:manage',
  'cost_adjustment:drafts:manage',
  'cost_adjustment:closed:manage',
  'order_transactions:read',
  'spot_check:drafts:manage',
  'spot_check:closed:manage',
  'count_sheet:drafts:manage',
  'ingredients:manage',
  'cost:manage',
  'coupons:manage',
  'devices:manage',
  'discounts:manage',
  'gift_cards:manage',
  'promotions:manage',
  'delivery_zones:manage',
  'timed_events:manage',
  'apps:manage',
  'reports:inventory_control',
  'reports:inventory_levels',
  'reports:inventory_transactions',
  'reports:other',
  'reports:sales',
  'reports:cost_adjustment_history',
  'dashboard:general',
  'dashboard:branches',
  'dashboard:call_center',
  'marketplace:manage',
  'cashier:access_cash_register',
  'cashier:access_device_management',
  'cashier:access_reports',
  'cashier:act_as_driver',
  'cashier:act_as_waiter',
  'cashier:add_open_charge',
  'cashier:add_open_price_product',
  'cashier:ahead_orders',
  'cashier:apply_discount',
  'cashier:apply_open_discount',
  'cashier:edit_products_sent_to_kitchen',
  'cashier:join_order',
  'cashier:open_cash_drawer',
  'cashier:perform_end_of_day',
  'cashier:print_check',
  'cashier:print_receipt',
  'cashier:return_order',
  'cashier:split_order',
  'cashier:view_done_orders',
  'cashier:void',
  'cashier:perform_payment',
  'cashier:edit_other_users_orders',
  'cashier:change_table_owner',
  'cashier:enroll_fingerprints',
  'cashier:send_to_kitchen_before_payment',
  'cashier:kitchen_reprint',
  'cashier:edit_tables_layout',
  'cashier:close_till_shift_with_active_orders',
  'cashier:manage_product_availability',
  'cashier:perform_spot_check',
  'cashier:pay_without_close',
  'cashier:manage_account_setup',
  */
];

// Grouped permissions for better UX
export const PERMISSION_GROUPS = {
  invoicesAndPurchasing: {
    name: 'INVOICES_AND_PURCHASING_AUTHORITIES',
    nameAr: 'الفواتير',
    permissions: [
      'orders:read',
      'orders:manage',
      'orders:manage_tags',
      'purchasing:drafts:manage',
      'purchasing:closed:manage',
      'purchasing_from_po:drafts:manage',
      'direct_purchasing:drafts:manage',
      'dashboard:inventory',
      'inventory_count:drafts:manage',
      'inventory_count:closed:manage',
      'inventory_items:read',
      'inventory_items:manage',
      'menu:read',
      'menu:manage',
      'customers:read',
      'customers:read_insights',
      'customers:manage',
      'customers:manage_house_account',
      'customers:manage_loyalty',
      'suppliers:read',
      'suppliers:manage',
    ],
  },
  inventory: {
    name: 'INVENTORY_AUTHORITIES',
    nameAr: 'المخزون',
    permissions: [
      'dashboard:inventory',
      'inventory_count:drafts:manage',
      'inventory_count:closed:manage',
      'inventory_items:read',
      'inventory_items:manage',
      'menu:read',
      'menu:manage',
    ],
  },
  customers: {
    name: 'CUSTOMER_AUTHORITIES',
    nameAr: 'العملاء',
    permissions: [
      'customers:read',
      'customers:read_insights',
      'customers:manage',
      'customers:manage_house_account',
      'customers:manage_loyalty',
    ],
  },
  suppliers: {
    name: 'SUPPLIER_AUTHORITIES',
    nameAr: 'الموردين',
    permissions: ['suppliers:read', 'suppliers:manage'],
  },
  paymentMethods: {
    name: 'PAYMENT_METHODS_AUTHORITIES',
    nameAr: 'طرق الدفع',
    permissions: ['settings:manage_payment_methods'],
  },
  users: {
    name: 'USERS_AUTHORITIES',
    nameAr: 'المستخدمين',
    permissions: ['users:manage'],
  },
  branches: {
    name: 'BRANCHES_AUTHORITIES',
    nameAr: 'الفروع',
    permissions: ['branches:manage'],
  },
  settings: {
    name: 'SETTINGS_AUTHORITIES',
    nameAr: 'الاعدادات',
    permissions: [
      'users:manage',
      'branches:manage',
      'settings:manage',
      'settings:manage_taxes_and_groups',
      'settings:manage_charges',
      'settings:manage_tags',
      'settings:manage_reasons',
      'settings:manage_kitchen_flows',
      'settings:manage_reservations',
      'settings:manage_online_ordering',
      'settings:manage_price_tags',
      'settings:manage_notifications',
    ],
  },
};
