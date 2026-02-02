// All available permissions in the system
export const ALL_PERMISSIONS = [
  'orders:read',
  'orders:manage',
  'orders:manage_tags',
  'customers:read',
  'customers:read_insights',
  'customers:manage',
  'customers:manage_house_account',
  'customers:manage_loyalty',
  'delivery-partners:read',
  'delivery-partners:read_insights',
  'delivery-partners:manage',
  'delivery-partners:manage_house_account',
  'delivery-partners:manage_loyalty',
  'inventory_items:read',
  'inventory_items:manage',
  'suppliers:read',
  'suppliers:manage',
  'po:drafts:manage',
  'po:posted:manage',
  'po:approved:manage',
  'po:approved:receive',
  'to:drafts:manage',
  'to:approved:manage',
  'transfers:drafts:manage',
  'transfers:closed:manage',
  'transfers:recieved:manage',
  'purchasing:drafts:manage',
  'purchasing:closed:manage',
  'purchasing_from_po:drafts:manage',
  'direct_purchasing:drafts:manage',
  'production:drafts:manage',
  'production:closed:manage',
  'quantity_adjustment:drafts:manage',
  'quantity_adjustment:closed:manage',
  'cost_adjustment:drafts:manage',
  'cost_adjustment:closed:manage',
  'inventory_count:drafts:manage',
  'inventory_count:closed:manage',
  'order_transactions:read',
  'spot_check:drafts:manage',
  'spot_check:closed:manage',
  'count_sheet:drafts:manage',
  'menu:read',
  'menu:manage',
  'ingredients:manage',
  'cost:manage',
  'branches:manage',
  'coupons:manage',
  'devices:manage',
  'discounts:manage',
  'gift_cards:manage',
  'promotions:manage',
  'settings:manage',
  'delivery_zones:manage',
  'timed_events:manage',
  'users:manage',
  'apps:manage',
  'settings:manage_taxes_and_groups',
  'settings:manage_payment_methods',
  'settings:manage_charges',
  'settings:manage_tags',
  'settings:manage_reasons',
  'settings:manage_kitchen_flows',
  'settings:manage_reservations',
  'settings:manage_online_ordering',
  'settings:manage_price_tags',
  'settings:manage_notifications',
  'reports:inventory_control',
  'reports:inventory_levels',
  'reports:inventory_transactions',
  'reports:other',
  'reports:sales',
  'reports:cost_adjustment_history',
  'dashboard:general',
  'dashboard:branches',
  'dashboard:inventory',
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
];

// Grouped permissions for better UX
export const PERMISSION_GROUPS = {
  orders: {
    name: 'ORDER_AUTHORITIES',
    permissions: [
      {
        value: 'orders:read',
        label: 'READ_ORDERS',
        tooltip: 'Allows the user to view orders in the console.',
      },
      {
        value: 'orders:manage',
        label: 'MANAGE_ORDERS',
        tooltip:
          'Allow the user to accept, decline, void and pay orders in the console',
      },
      {
        value: 'orders:manage_tags',
        label: 'MANAGE_ORDERS_TAGS',
        tooltip: 'Allows the user to edit order tags of orders in the console.',
      },
    ],
  },
  customers: {
    name: 'CUSTOMER_AUTHORITIES',
    permissions: [
      {
        value: 'customers:read',
        label: 'READ_CUSTOMERS',
        tooltip: 'Allows the user to view customers data in the console.',
      },
      {
        value: 'customers:read_insights',
        label: 'READ_CUSTOMERS_INSIGHTS',
        tooltip:
          'Allows the user to view customers loyalty, house account credit, etc...',
      },
      {
        value: 'customers:manage',
        label: 'MANAGE_CUSTOMERS',
        tooltip: 'Allows the user to edit or delete customers.',
      },
      {
        value: 'customers:manage_house_account',
        label: 'MANAGE_CUSTOMERS_HOUSE_ACCOUNT',
        tooltip:
          'Allows the user to activate/deactivate house accounts and register payments.',
      },
      {
        value: 'customers:manage_loyalty',
        label: 'MANAGE_CUSTOMERS_LOYALTY',
        tooltip:
          'Allows the user to activate/deactivate loyalty for customers.',
      },
    ],
  },
  deliveryPartners: {
    name: 'DELIVERY_PARTNERS_AUTHORITIES',
    permissions: [
      {
        value: 'delivery-partners:read',
        label: 'READ_DELIVERY_PARTNERS',
        tooltip:
          'Allows the user to view delivery partners data in the console.',
      },
      {
        value: 'delivery-partners:read_insights',
        label: 'READ_DELIVERY_PARTNERS_INSIGHTS',
        tooltip:
          'Allows the user to view delivery partners loyalty, house account credit, etc...',
      },
      {
        value: 'delivery-partners:manage',
        label: 'MANAGE_DELIVARY_PARTNERS',
        tooltip: 'Allows the user to edit or delete customers.',
      },
      {
        value: 'delivery-partners:manage_house_account',
        label: 'MANAGE_DELIVERY_PARTNERS_HOUSE_ACCOUNT',
        tooltip:
          'Allows the user to activate/deactivate house accounts and register payments.',
      },
      {
        value: 'delivery-partners:manage_loyalty',
        label: 'MANAGE_DELIVERY_PARTNERS_LOYALTY',
        tooltip:
          'Allows the user to activate/deactivate loyalty for customers.',
      },
    ],
  },
  inventory: {
    name: 'INVENTORY_AUTHORITIES',
    permissions: [
      {
        value: 'inventory_items:read',
        label: 'READ_INVENTORY_ITEMS',
        tooltip: 'Allows the user to view inventory items.',
      },
      {
        value: 'inventory_items:manage',
        label: 'MANAGE_INVENTORY_ITEMS',
        tooltip: 'Allows the user to edit or delete inventory items.',
      },
      {
        value: 'suppliers:read',
        label: 'READ_SUPPLIER',
        tooltip: 'Allows the user to view suppliers list.',
      },
      {
        value: 'suppliers:manage',
        label: 'MANAGE_SUPPLIERS',
        tooltip: 'Allows the user to edit or delete suppliers.',
      },
      {
        value: 'po:drafts:manage',
        label: 'CREATE_PURCHASE_ORDERS',
        tooltip: 'Allows the user to create a PO and save as draft.',
      },
      {
        value: 'po:posted:manage',
        label: 'SUBMIT_PURCHASE_ORDERS',
        tooltip: 'Allows the user to submit draft POs to be approved.',
      },
      {
        value: 'po:approved:manage',
        label: 'APPROVE_PURCHASE_ORDERS',
        tooltip: 'Allows the user to approve submitted POs.',
      },
      {
        value: 'po:approved:receive',
        label: 'VIEW_APPROVED_PURCHASE_ORDERS',
        tooltip: 'Allows the user to view approved POs.',
      },
      {
        value: 'to:drafts:manage',
        label: 'CREATE_TRANSFER_ORDERS',
        tooltip: 'Allows the user to request items from the warehouse.',
      },
      {
        value: 'to:approved:manage',
        label: 'SUBMIT_TRANSFER_ORDERS',
        tooltip:
          'Allows the user to create a transfer from one branch/warehouse to other locations.',
      },
      {
        value: 'transfers:drafts:manage',
        label: 'CREATE_TRANSFERS',
        tooltip: 'Allows the user to submit draft transafer transactions.',
      },
      {
        value: 'transfers:closed:manage',
        label: 'SEND_TRANSFERS',
        tooltip: 'Allows the user to send a transfere.',
      },
      {
        value: 'transfers:recieved:manage',
        label: 'RECEIVE_TRANSFERS',
        tooltip: 'Allows the user to recieve a transfere.',
      },
      {
        value: 'purchasing:drafts:manage',
        label: 'CREATE_PURCHASING',
        tooltip: 'Allows the user to submit draft purchasing transactions.',
      },
      {
        value: 'purchasing:closed:manage',
        label: 'SUBMIT_PURCHASING',
        tooltip:
          'Allows the user to create a purchasing transaction from a purchase order only and save it as a draft',
      },
      {
        value: 'purchasing_from_po:drafts:manage',
        label: 'CREATE_PURCHASING_FROM_PO',
        tooltip:
          'Allows the user to create a direct purchasing transaction (Local Market Purchasing) and save it as a draft',
      },
      {
        value: 'direct_purchasing:drafts:manage',
        label: 'CREATE_DIRECT_PURCHASING',
        tooltip: 'Allows the user to create draft production transactions.',
      },
      {
        value: 'production:drafts:manage',
        label: 'CREATE_PRODUCTION',
        tooltip: 'Allows the user to submit draft production transactions.',
      },
      {
        value: 'production:closed:manage',
        label: 'SUBMIT_PRODUCTION',
        tooltip: 'Allows the user to create draft QA transactions.',
      },
      {
        value: 'quantity_adjustment:drafts:manage',
        label: 'CREATE_QUANTITY_ADJUSTMENT',
        tooltip: 'Allows the user to submit draft QA transactions.',
      },
      {
        value: 'quantity_adjustment:closed:manage',
        label: 'SUBMIT_QUANTITY_ADJUSTMENT',
        tooltip: 'Allows the user to create draft count transactions.',
      },
      {
        value: 'cost_adjustment:drafts:manage',
        label: 'CREATE_COST_ADJUSTMENT',
        tooltip: 'Allows the user to submit draft count transactions.',
      },
      {
        value: 'cost_adjustment:closed:manage',
        label: 'SUBMIT_COST_ADJUSTMENT',
        tooltip: 'Allows the user to submit draft count transactions.',
      },
      {
        value: 'inventory_count:drafts:manage',
        label: 'CREATE_INVENTORY_COUNT',
        tooltip: 'Allows the user to submit draft Inventory count.',
      },
      {
        value: 'inventory_count:closed:manage',
        label: 'SUBMIT_INVENTORY_COUNT',
        tooltip: 'Allows the user to submit draft Inventory count.',
      },
      {
        value: 'order_transactions:read',
        label: 'READ_ORDER_TRANSACTIONS',
        tooltip:
          'Allows the user to view inventory transactions made from orders.',
      },
      {
        value: 'spot_check:drafts:manage',
        label: 'CREATE_INVENTORY_SPOT_CHECK',
        tooltip: 'Allows the user to create inventory spot check transaction',
      },
      {
        value: 'spot_check:closed:manage',
        label: 'SUBMIT_INVENTORY_SPOT_CHECK',
        tooltip:
          'Allows the user to submit and display the inventory spot check transaction',
      },
      {
        value: 'count_sheet:drafts:manage',
        label: 'READ_INVENTORY_COUNT_SHEET',
        tooltip:
          'Allows the user to create and display the inventory count sheet',
      },
    ],
  },
  menu: {
    name: 'MENU_AUTHORITIES',
    permissions: [
      {
        value: 'menu:read',
        label: 'READ_MENU',
        tooltip: 'Allows the user to view menu items in the console.',
      },
      {
        value: 'menu:manage',
        label: 'MANAGE_MENU',
        tooltip:
          'Allows the user to edit and manage menu items in the console.',
      },
    ],
  },
  other: {
    name: 'OTHER_AUTHORITIES',
    permissions: [
      {
        value: 'ingredients:manage',
        label: 'MANAGE_INGREDIENTS',
        tooltip: 'Allows the user to edit menu ingredients.',
      },
      {
        value: 'cost:manage',
        label: 'MANAGE_COSTS',
        tooltip: 'Allows the user to edit menu items costs.',
      },
    ],
  },
  admin: {
    name: 'ADMIN_AUTHORITIES',
    permissions: [
      {
        value: 'branches:manage',
        label: 'MANAGE_BRANCHES',
        tooltip:
          'Allows the user to edit and manage branch settings in the console.',
      },
      {
        value: 'coupons:manage',
        label: 'MANAGE_COUPONS',
        tooltip: 'Allows the user to create and edit coupons in the console.',
      },
      {
        value: 'devices:manage',
        label: 'MANAGE_DEVICES',
        tooltip:
          'Allows the user to edit and manage device settings in the console.',
      },
      {
        value: 'discounts:manage',
        label: 'MANAGE_DISCOUNTS',
        tooltip: 'Allows the user to create and edit discounts.',
      },
      {
        value: 'gift_cards:manage',
        label: 'MANAGE_GIFT_CARDS',
        tooltip: 'Allows the user to create and manage gift cards.',
      },
      {
        value: 'promotions:manage',
        label: 'MANAGE_PROMOTIONS',
        tooltip: 'Allows the user to create and edit promotions.',
      },
      {
        value: 'settings:manage',
        label: 'MANAGE_SETTINGS',
        tooltip:
          'Allows the user to configure business settings including loyalty, cashier settings, etc...',
      },
      {
        value: 'delivery_zones:manage',
        label: 'MANAGE_DELIVARY_ZONE',
        tooltip:
          'Allows the user to configure business settings including loyalty, cashier settings, etc...',
      },
      {
        value: 'timed_events:manage',
        label: 'MANAGE_TIMED_EVENTS',
        tooltip: 'Allows the user to create and edit timed events.',
      },
      {
        value: 'users:manage',
        label: 'MANAGE_USERS',
        tooltip: 'Allows the user to create and edit users and assign roles.',
      },
      { value: 'apps:manage', label: 'MANAGE_APPS', tooltip: '' },
      {
        value: 'settings:manage_taxes_and_groups',
        label: 'MANAGE_TAXES_TAX_GROUPS',
        tooltip: 'Allows the user to create and edit taxes and groups',
      },
      {
        value: 'settings:manage_payment_methods',
        label: 'MANAGE_PAYMENT_METHODS',
        tooltip: 'Allows the user to create and edit payment methods',
      },
      {
        value: 'settings:manage_charges',
        label: 'MANAGE_CHARGES',
        tooltip: 'Allows the user to create and edit charges',
      },
      {
        value: 'settings:manage_tags',
        label: 'MANAGE_TAGS',
        tooltip: 'Allows the user to create and edit tags',
      },
      {
        value: 'settings:manage_reasons',
        label: 'MANAGE_RESEANS',
        tooltip: 'Allows the user to create and edit kitchen flows',
      },
      {
        value: 'settings:manage_kitchen_flows',
        label: 'MANAGE_KITCHEN_FLOWS',
        tooltip: 'Allows the user to create and edit kitchen flows',
      },
      {
        value: 'settings:manage_reservations',
        label: 'MANAGE_RESERVATIONS',
        tooltip: 'Allows the user to configure reservations',
      },
      {
        value: 'settings:manage_online_ordering',
        label: 'MANAGE_ONLINE_ORDERING',
        tooltip: 'Allows the user to configure online ordering',
      },
      {
        value: 'settings:manage_price_tags',
        label: 'MANAGE_PRICE_TAGS',
        tooltip: 'Allows the user to create and edit price tags',
      },
      {
        value: 'settings:manage_notifications',
        label: 'MANAGE_NOTIFICATIONS',
        tooltip: 'Allows the user to create and edit notifications',
      },
    ],
  },
  reports: {
    name: 'REPORTS_AUTHORITIES',
    permissions: [
      {
        value: 'reports:inventory_control',
        label: 'VIEW_INVENTORY_CONTROL_REPORT',
        tooltip: 'Allows the user to view and export this report.',
      },
      {
        value: 'reports:inventory_levels',
        label: 'VIEW_INVENTORY_LEVEL_REPORT',
        tooltip: 'Allows the user to view and export this report.',
      },
      {
        value: 'reports:inventory_transactions',
        label: 'VIEW_INVENTORY_TRANSACTIONS_REPORT',
        tooltip:
          'Allows the user to view and export reports like taxes, drawer operations, voids, etc.',
      },
      {
        value: 'reports:other',
        label: 'VIEW_OTHER_REPORTS',
        tooltip: 'Allows the user to view and export all Sales reports.',
      },
      {
        value: 'reports:sales',
        label: 'VIEW_SALES_REPORTS',
        tooltip: 'Allows the user to view and export all Sales reports.',
      },
      {
        value: 'reports:cost_adjustment_history',
        label: 'VIEW_COST_ADJUSTMENT_HISTORY_REPORT',
        tooltip: 'Allows the user to view and export all Sales reports.',
      },
    ],
  },
  dashboard: {
    name: 'DASHBOARD_AUTHORITIES',
    permissions: [
      {
        value: 'dashboard:general',
        label: 'ACCESS_GENERAL_DASHBOARD',
        tooltip: 'Allows the user to view the general dashboard and graphs.',
      },
      {
        value: 'dashboard:branches',
        label: 'ACCESS_BRANCHES_DASHBOARD',
        tooltip: 'Allows the user to view the branches dashboard.',
      },
      {
        value: 'dashboard:inventory',
        label: 'ACCESS_INVENTORY_DASHBOARD',
        tooltip: 'Allows the user to view the inventory dashboard.',
      },
      {
        value: 'dashboard:call_center',
        label: 'ACCESS_CALL_CENTER_DASHBOARD',
        tooltip: 'Allows the user to view the call center dashboard.',
      },
    ],
  },
  marketplace: {
    name: 'MARKETPLACE_AUTHORITIES',
    permissions: [
      {
        value: 'marketplace:manage',
        label: 'MANAGE_MARKETPLACE',
        tooltip: 'Allows the user to view Dot marketplace.',
      },
    ],
  },
  cashier: {
    name: 'CASHIER_APP_AUTHORITIES',
    permissions: [
      {
        value: 'cashier:access_cash_register',
        label: 'ACCESS_CASH_REGISTER',
        tooltip:
          'Allows the user to access the menu and open till in the cashier.',
      },
      {
        value: 'cashier:access_device_management',
        label: 'ACCESS_DEVICES_MANAGEMENT',
        tooltip: 'Allows the user to add/edit devices in the cashier.',
      },
      {
        value: 'cashier:access_reports',
        label: 'ACCESS_REPORTS',
        tooltip:
          'Allows the user to access sales and till reports in the cashier.',
      },
      {
        value: 'cashier:act_as_driver',
        label: 'ACT_AS_DRIVER',
        tooltip:
          'Allows the user to be assigned as a driver to delivery orders.',
      },
      {
        value: 'cashier:act_as_waiter',
        label: 'ACT_AS_WAITER',
        tooltip: 'Allows the user to act as a waiter',
      },
      {
        value: 'cashier:add_open_charge',
        label: 'ADD_OPEN_CHARGE',
        tooltip: 'Allows the user to add an open charge to an order.',
      },
      {
        value: 'cashier:add_open_price_product',
        label: 'ADD_OPEN_PRICE_PRODUCT',
        tooltip: 'Allows the user to sell open price products.',
      },
      {
        value: 'cashier:ahead_orders',
        label: 'ADD_AHEAD_ORDERS',
        tooltip: 'Allows the user to assign future dates to orders.',
      },
      {
        value: 'cashier:apply_discount',
        label: 'APPLY_PREDEFINED_DISCOUNTS',
        tooltip:
          'Allows the user to apply a predefined discount on orders or products.',
      },
      {
        value: 'cashier:apply_open_discount',
        label: 'APPLY_OPEN_DISCOUNTS',
        tooltip:
          'Allows the user to apply open discounts on orders or products.',
      },
      {
        value: 'cashier:edit_products_sent_to_kitchen',
        label: 'EDIT_PRODUCTS_SENT_TO_KITCHEN',
        tooltip:
          "Allows the user to edit a product after it's been sent to the kitchen.",
      },
      {
        value: 'cashier:join_order',
        label: 'JOIN_ORDER',
        tooltip: 'Allows the user to join dine-in orders and tables.',
      },
      {
        value: 'cashier:open_cash_drawer',
        label: 'ACCESS_DRAWER_OPERATIONS',
        tooltip:
          'Allows the user to open the cash drawer for a reason besides sale transactions.',
      },
      {
        value: 'cashier:perform_end_of_day',
        label: 'PERFORM_END_OF_DAY',
        tooltip: 'Allows the user to end the day and generate EOD reports.',
      },
      {
        value: 'cashier:print_check',
        label: 'PRINT_CHECK',
        tooltip: 'Allows the user to print a check before closing the order.',
      },
      {
        value: 'cashier:print_receipt',
        label: 'PRINT_RECEIPT',
        tooltip: 'Allows the user to reprint a receipt of a closed order.',
      },
      {
        value: 'cashier:return_order',
        label: 'RETURN_ORDER',
        tooltip:
          'Allows the user to return a closed order and refund the customer.',
      },
      {
        value: 'cashier:split_order',
        label: 'SPLIT_ORDER',
        tooltip:
          'Allows the user to split an order to multiple orders or payments.',
      },
      {
        value: 'cashier:view_done_orders',
        label: 'VIEW_DONE_ORDERS',
        tooltip: 'Allows the user to view done orders history.',
      },
      {
        value: 'cashier:void',
        label: 'VOID_ORDERS_AND_PRODUCTS',
        tooltip: 'Allows the user to cancel orders and products for a reason.',
      },
      {
        value: 'cashier:perform_payment',
        label: 'PERFORM_PAYMENT',
        tooltip: 'Allows the user to add payments to orders',
      },
      {
        value: 'cashier:edit_other_users_orders',
        label: 'EDIT_ORDERS_OPENED_BY_OTHER_USERS',
        tooltip: 'Allows the user to edit orders opened by other users',
      },
      {
        value: 'cashier:change_table_owner',
        label: 'CHANGE_TABLE_OWNER',
        tooltip: 'Allows user to change the owner of a table',
      },
      {
        value: 'cashier:enroll_fingerprints',
        label: 'REGISTER_USERS_FINGERPRINT',
        tooltip:
          'Allows the user to register fingerprints for other users in cashier',
      },
      {
        value: 'cashier:send_to_kitchen_before_payment',
        label: 'SEND_TO_KITCHEN_BEFORE_PAYMENT',
        tooltip:
          'Allows sending the order to the kitchen before adding payment',
      },
      {
        value: 'cashier:kitchen_reprint',
        label: 'KITCHEN_REPRINT',
        tooltip: 'Allows reprinting the order in the kitchen',
      },
      {
        value: 'cashier:edit_tables_layout',
        label: 'EDUT_TABLES_LAYOUT',
        tooltip: 'Allows editing table layout in cashier',
      },
      {
        value: 'cashier:close_till_shift_with_active_orders',
        label: 'CLOSE_TILL_WITH_ACTIVE_ORDERS',
        tooltip:
          'Allows the user to close till/shift when there are active orders',
      },
      {
        value: 'cashier:manage_product_availability',
        label: 'MANAGE_PRODUCT_AVAILABILITY',
        tooltip:
          'Allows the user to manage the product availability (Available, Not Available, or Specify the Available quantity) in the cashier',
      },
      {
        value: 'cashier:perform_spot_check',
        label: 'PERFORM_SPOT_CHECK',
        tooltip:
          'User will be able to perform cash spot check and print open till reports without closing till.',
      },
      {
        value: 'cashier:pay_without_close',
        label: 'PAY_ORDERS_WITHOUT_CLOSING',
        tooltip: 'user will be able to fully pay orders without closing them',
      },
      {
        value: 'cashier:manage_account_setup',
        label: 'ACCOUNT_SETUP',
        tooltip:
          'user will be able to fully customize his account reom the app and create product, category, delivery partners ...etc',
      },
    ],
  },
};
