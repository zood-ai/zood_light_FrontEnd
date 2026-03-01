export enum Roles {
  DASHBOARD = 'dashboard',
  ADMIN = 'admin',
  ORDERS = 'orders',
  PURCHASING = 'purchasing',
  PRICE_QUOTES = 'price_quotes',
  INVENTORY = 'inventory',
  CUSTOMERS = 'customers',
  SUPPLIERS = 'suppliers',
  REPORTS = 'reports',
  PAYMENT_METHODS = 'payment_methods',
  USERS = 'users',
  BRANCHES = 'branches',
  SETTINGS = 'settings',
}

export enum Permissions {
  // Orders
  ORDERS_READ = 'orders:read',
  ORDERS_MANAGE = 'orders:manage',
  ORDERS_MANAGE_TAGS = 'orders:manage_tags',

  // Purchasing
  PURCHASING_DRAFTS_MANAGE = 'purchasing:drafts:manage',
  PURCHASING_CLOSED_MANAGE = 'purchasing:closed:manage',
  PURCHASING_FROM_PO_DRAFTS_MANAGE = 'purchasing_from_po:drafts:manage',
  DIRECT_PURCHASING_DRAFTS_MANAGE = 'direct_purchasing:drafts:manage',

  // Price Quotes
  PRICE_QUOTES_DRAFTS_MANAGE = 'po:drafts:manage',
  PRICE_QUOTES_CLOSED_MANAGE = 'po:posted:manage',
  PRICE_QUOTES_APPROVED_MANAGE = 'po:approved:manage',
  PRICE_QUOTES_APPROVED_RECEIVE = 'po:approved:receive',

  // Inventory
  DASHBOARD_INVENTORY = 'dashboard:inventory',
  INVENTORY_COUNT_DRAFTS_MANAGE = 'inventory_count:drafts:manage',
  INVENTORY_COUNT_CLOSED_MANAGE = 'inventory_count:closed:manage',
  INVENTORY_ITEMS_READ = 'inventory_items:read',
  INVENTORY_ITEMS_MANAGE = 'inventory_items:manage',

  // Customers
  CUSTOMERS_READ = 'customers:read',
  CUSTOMERS_READ_INSIGHTS = 'customers:read_insights',
  CUSTOMERS_MANAGE = 'customers:manage',
  CUSTOMERS_MANAGE_HOUSE_ACCOUNT = 'customers:manage_house_account',
  CUSTOMERS_MANAGE_LOYALTY = 'customers:manage_loyalty',

  // Suppliers
  SUPPLIERS_READ = 'suppliers:read',
  SUPPLIERS_MANAGE = 'suppliers:manage',

  // Reports
  REPORTS_OTHER = 'reports:other',

  // Payment Methods
  SETTINGS_MANAGE_PAYMENT_METHODS = 'settings:manage_payment_methods',

  // Users
  USERS_MANAGE = 'users:manage',

  // Branches
  BRANCHES_MANAGE = 'branches:manage',

  // Settings
  SETTINGS_MANAGE = 'settings:manage',
  SETTINGS_MANAGE_TAXES_AND_GROUPS = 'settings:manage_taxes_and_groups',
  SETTINGS_MANAGE_CHARGES = 'settings:manage_charges',
  SETTINGS_MANAGE_TAGS = 'settings:manage_tags',
  SETTINGS_MANAGE_REASONS = 'settings:manage_reasons',
  SETTINGS_MANAGE_KITCHEN_FLOWS = 'settings:manage_kitchen_flows',
  SETTINGS_MANAGE_RESERVATIONS = 'settings:manage_reservations',
  SETTINGS_MANAGE_ONLINE_ORDERING = 'settings:manage_online_ordering',
  SETTINGS_MANAGE_PRICE_TAGS = 'settings:manage_price_tags',
  SETTINGS_MANAGE_NOTIFICATIONS = 'settings:manage_notifications',
}

export const rolePermissions: Record<Roles, string[]> = {
  [Roles.DASHBOARD]: ['dashboard:inventory'],

  [Roles.ORDERS]: [
    'orders:read',
    'orders:manage',
    'orders:manage_tags',
    'inventory_count:drafts:manage',
    'inventory_count:closed:manage',
    'inventory_items:read',
    'inventory_items:manage',
    'menu:read',
    'customers:read',
    'customers:read_insights',
    'customers:manage_house_account',
    'customers:manage_loyalty',
  ],

  [Roles.PURCHASING]: [
    'purchasing:drafts:manage',
    'purchasing:closed:manage',
    'purchasing_from_po:drafts:manage',
    'direct_purchasing:drafts:manage',
    'suppliers:read',
    'inventory_count:drafts:manage',
    'inventory_count:closed:manage',
    'inventory_items:read',
    'inventory_items:manage',
    'menu:read',
  ],

  [Roles.PRICE_QUOTES]: [
    'po:drafts:manage',
    'po:posted:manage',
    'po:approved:manage',
    'po:approved:receive',
    'inventory_count:drafts:manage',
    'inventory_count:closed:manage',
    'inventory_items:read',
    'inventory_items:manage',
    'menu:read',
    'customers:read',
    'customers:read_insights',
    'customers:manage_house_account',
    'customers:manage_loyalty',
  ],

  [Roles.INVENTORY]: [
    'inventory_count:drafts:manage',
    'inventory_count:closed:manage',
    'inventory_items:read',
    'inventory_items:manage',
    'menu:read',
    'menu:manage',
  ],

  [Roles.CUSTOMERS]: [
    'customers:read',
    'customers:read_insights',
    'customers:manage',
    'customers:manage_house_account',
    'customers:manage_loyalty',
  ],

  [Roles.REPORTS]: [
    'reports:other',
    'reports:inventory_control',
    'reports:inventory_levels',
    'reports:inventory_transactions',
    'reports:sales',
    'reports:cost_adjustment_history',
    'purchasing:drafts:manage',
    'purchasing:closed:manage',
    'purchasing_from_po:drafts:manage',
    'direct_purchasing:drafts:manage',
  ],

  [Roles.SUPPLIERS]: ['suppliers:read', 'suppliers:manage'],

  [Roles.PAYMENT_METHODS]: ['settings:manage_payment_methods'],

  [Roles.USERS]: ['users:manage'],

  [Roles.BRANCHES]: ['branches:manage'],

  [Roles.SETTINGS]: [
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

  [Roles.ADMIN]: [],
};
