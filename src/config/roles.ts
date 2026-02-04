export enum Roles {
  ADMIN = 'admin',
  ORDERS = 'orders',
  PURCHASING = 'purchasing',
  INVENTORY = 'inventory',
  CUSTOMERS = 'customers',
  SUPPLIERS = 'suppliers',
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

export const rolePermissions: Record<Roles, Permissions[]> = {
  [Roles.ORDERS]: [
    Permissions.ORDERS_READ,
    Permissions.ORDERS_MANAGE,
    Permissions.ORDERS_MANAGE_TAGS,
    Permissions.DASHBOARD_INVENTORY,
    Permissions.INVENTORY_COUNT_DRAFTS_MANAGE,
    Permissions.INVENTORY_COUNT_CLOSED_MANAGE,
    Permissions.INVENTORY_ITEMS_READ,
    Permissions.INVENTORY_ITEMS_MANAGE,
  ],

  [Roles.PURCHASING]: [
    Permissions.PURCHASING_DRAFTS_MANAGE,
    Permissions.PURCHASING_CLOSED_MANAGE,
    Permissions.PURCHASING_FROM_PO_DRAFTS_MANAGE,
    Permissions.DIRECT_PURCHASING_DRAFTS_MANAGE,
  ],

  [Roles.INVENTORY]: [
    Permissions.DASHBOARD_INVENTORY,
    Permissions.INVENTORY_COUNT_DRAFTS_MANAGE,
    Permissions.INVENTORY_COUNT_CLOSED_MANAGE,
    Permissions.INVENTORY_ITEMS_READ,
    Permissions.INVENTORY_ITEMS_MANAGE,
  ],

  [Roles.CUSTOMERS]: [
    Permissions.CUSTOMERS_READ,
    Permissions.CUSTOMERS_READ_INSIGHTS,
    Permissions.CUSTOMERS_MANAGE,
    Permissions.CUSTOMERS_MANAGE_HOUSE_ACCOUNT,
    Permissions.CUSTOMERS_MANAGE_LOYALTY,
  ],

  [Roles.SUPPLIERS]: [Permissions.SUPPLIERS_READ, Permissions.SUPPLIERS_MANAGE],

  [Roles.PAYMENT_METHODS]: [Permissions.SETTINGS_MANAGE_PAYMENT_METHODS],

  [Roles.USERS]: [Permissions.USERS_MANAGE],

  [Roles.BRANCHES]: [Permissions.BRANCHES_MANAGE],

  [Roles.SETTINGS]: [
    Permissions.SETTINGS_MANAGE,
    Permissions.SETTINGS_MANAGE_TAXES_AND_GROUPS,
    Permissions.SETTINGS_MANAGE_CHARGES,
    Permissions.SETTINGS_MANAGE_TAGS,
    Permissions.SETTINGS_MANAGE_REASONS,
    Permissions.SETTINGS_MANAGE_KITCHEN_FLOWS,
    Permissions.SETTINGS_MANAGE_RESERVATIONS,
    Permissions.SETTINGS_MANAGE_ONLINE_ORDERING,
    Permissions.SETTINGS_MANAGE_PRICE_TAGS,
    Permissions.SETTINGS_MANAGE_NOTIFICATIONS,
  ],

  [Roles.ADMIN]: [
    //   Permissions.BRANCHES_MANAGE,
    //   Permissions.USERS_MANAGE,
    //   Permissions.SETTINGS_MANAGE_PAYMENT_METHODS,
    //   Permissions.SUPPLIERS_READ,
    //   Permissions.SUPPLIERS_MANAGE,
    //   Permissions.CUSTOMERS_READ,
    //   Permissions.CUSTOMERS_READ_INSIGHTS,
    //   Permissions.CUSTOMERS_MANAGE,
    //   Permissions.CUSTOMERS_MANAGE_HOUSE_ACCOUNT,
    //   Permissions.CUSTOMERS_MANAGE_LOYALTY,
    //   Permissions.DASHBOARD_INVENTORY,
    //   Permissions.INVENTORY_COUNT_DRAFTS_MANAGE,
    //   Permissions.INVENTORY_COUNT_CLOSED_MANAGE,
    //   Permissions.INVENTORY_ITEMS_READ,
    //   Permissions.INVENTORY_ITEMS_MANAGE,
    //   Permissions.PURCHASING_DRAFTS_MANAGE,
    //   Permissions.PURCHASING_CLOSED_MANAGE,
    //   Permissions.PURCHASING_FROM_PO_DRAFTS_MANAGE,
    //   Permissions.DIRECT_PURCHASING_DRAFTS_MANAGE,
    //   Permissions.ORDERS_READ,
    //   Permissions.ORDERS_MANAGE,
    //   Permissions.ORDERS_MANAGE_TAGS,
  ],
};
