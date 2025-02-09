import { endOfWeek, format, startOfWeek } from "date-fns";

export const INV_COUNT_TYPES = {
  weekly: "Weekly",
  monthly: "Monthly",
};

export const DEFAULT_INSIGHTS_DATE = `from=${format(
  startOfWeek(new Date()),
  "yyyy-MM-dd"
)}&to=${format(endOfWeek(new Date()), "yyyy-MM-dd")}`;



export const PERMISSIONS = {
  // ---------------------schedulling--------------------------
  can_export_timecards: "Can export timecards",
  can_edit_timecards: "Can edit timecards",
  can_override_timecards: "Can override timecards",
  can_approve_timecards: "Can approve timecards",
  can_approve_schedule: "Can approve schedule",
  // --------------------people---------------------------------------------
  can_see_and_upload_employee_documents: "Can see and upload employee documents",
  can_see_and_edit_employee_wages: "Can see and edit employee wages",
  can_view_personal_info: "Can view personal info",
  can_approve_holiday_request: "Can approve holiday request",
  can_access_reports_for_all_locations: "Can access reports for all locations",
  can_adjust_cost_of_labour_view: "Can adjust cost of labour view",
  can_edit_holiday_entitlements: "Can edit holiday entitlements",
  can_deactivate_users_from_other_locations: "Can deactivate users from other locations",
  can_export_employee_data: "Can export employee data",
  can_edit_permissions_for_users: "Can edit permissions for users",
  // ----------Inventory management features---------
  can_access_inventory_management_features: "Can access inventory management features",
  can_add_and_edit_inventory_items_recipes_and_suppliers: "Can add and edit inventory items, recipes and suppliers",
  can_add_inventory_items_from_deliveries_only: "Can add inventory items from deliveries only",
  can_access_inventory_reports: "Can access Inventory reports",
  can_edit_stock_counts: "Can edit stock counts",
  can_edit_waste: "Can edit waste",
  can_edit_invoices: "Can edit invoices",
  // ------------APP
  can_clock_out_from_any_location: "Can clock out from any location",
};


export const PermissionsLinks = {
  // ----------Inventory management features---------
  "Can access inventory management features": ["purchase","inventory","transfer","waste"],
  "Can add and edit inventory items, recipes and suppliers": ["purchase","inventory","transfer","waste"],
  "Can add inventory items from deliveries only": ["purchase","inventory","transfer","waste"],
  "Can access Inventory reports": ["purchase","inventory","transfer","waste"],
  "Can edit stock counts": ["purchase","inventory","transfer","waste"],
  "Can edit waste": ["purchase","inventory","transfer","waste"],
  "Can edit invoices": ["purchase","inventory","transfer","waste"],
// --------------------people---------------------------------------------
"Can access reports for all locations": ["schedulling"],
"Can adjust cost of labour view": ["schedulling"],
"Can edit holiday entitlements": ["schedulling"],
"Can deactivate users from other locations": ["schedulling"],
"Can export employee data": ["schedulling"],
"Can edit permissions for users": ["schedulling"],
"Can view personal info": ["schedulling"],
"Can see and edit employee wages": ["schedulling"],
"Can see and upload employee documents": ["schedulling"],
// ------------------schedulling-----------------------------------------------
"Can export timecards": ["schedulling"],
"Can edit timecards": ["schedulling"],
"Can override timecards": ["schedulling"],
"Can approve timecards": ["schedulling"],
"Can approve schedule": ["schedulling"],
"Can approve holiday request": ["schedulling"],
// ---------------------App--------------------------
"Can clock out from any location": ["schedulling"],
}
