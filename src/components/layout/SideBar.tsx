import { useLocation, useNavigate } from "react-router-dom";

// Icons
import DashboardIcon from "@/assets/icons/DashboardIcon";
import InventoryIcon from "@/assets/icons/InventoryIcon";
import PurchaseIcon from "@/assets/icons/PurchaseIcon";
import TransferIcon from "@/assets/icons/TransferIcon";
import WasteIcon from "@/assets/icons/WasteIcon";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import MenuIcon from "@/assets/icons/Menu";
import POSIcon from "@/assets/icons/POS";
import DotLogo from "@/assets/icons/DotLogo";
import EmployeeIcon from "@/assets/icons/Employee";

// Components
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
import { DEFAULT_INSIGHTS_DATE, PERMISSIONS } from "@/constants/constants";

// Hooks
import useFilterQuery from "@/hooks/useFilterQuery";
import CentralKitchen from "@/assets/icons/CentralKitchen";
import AuthPermission from "@/guards/AuthPermission";

interface IItem {
  icon: React.ReactElement;
  name: string;
  route: string;
  hide?: boolean;
  permission?: string[];
  admin?: boolean;
}


const SideBar = () => {
  const { pathname } = useLocation();
  const [mainPath] = pathname.split("/").slice(1);
  const { filterObj } = useFilterQuery();
  const { "filter[branch]": branchFilter, is_cpu: isCpu } = filterObj;

  const cpuFilter = isCpu ? `&is_cpu=${isCpu}` : "";

  const nagivate = useNavigate();
  const getIconColor = (route: string) =>
    route === mainPath ? "var(--primary)" : "var(--gray-300)";

  const items: IItem[] = [
    {
      name: "Insights",
      icon: <DashboardIcon color={getIconColor("insights")} />,
      route: branchFilter?.length
        ? `/insights/sales?${DEFAULT_INSIGHTS_DATE}&filter[branch]=${branchFilter}${cpuFilter}`
        : `/insights/sales?${DEFAULT_INSIGHTS_DATE}`,
      admin: true,

    },
    {
      name: "Schedulling & Workforce",
      icon: <EmployeeIcon color={getIconColor("schedulling")} />,
      route: `/schedulling/schedule`,
      permission: [

        PERMISSIONS.can_see_and_edit_employee_wages,
        PERMISSIONS.can_see_and_upload_employee_documents,
        PERMISSIONS.can_export_timecards,
        PERMISSIONS.can_edit_timecards,
        PERMISSIONS.can_override_timecards,
        PERMISSIONS.can_approve_timecards,
        PERMISSIONS.can_approve_schedule,
        PERMISSIONS.can_view_personal_info,
        PERMISSIONS.can_approve_holiday_request,
        PERMISSIONS.can_access_reports_for_all_locations,
        PERMISSIONS.can_adjust_cost_of_labour_view,
        PERMISSIONS.can_edit_holiday_entitlements,
        PERMISSIONS.can_deactivate_users_from_other_locations,
        PERMISSIONS.can_export_employee_data,
        PERMISSIONS.can_edit_permissions_for_users
      ],


    },
    {
      name: "POS",
      icon: <POSIcon color={getIconColor("POS")} />,
      route: branchFilter?.length
        ? `/POS/orders?filter[branch]=${branchFilter}${cpuFilter}`
        : `/POS/orders`,
      admin: true,

    },

    // {
    //   name: "Chat",
    //   icon: <ChatIcon color={getIconColor("chat")} />,
    //   route: "/chat",
    // },
    {
      name: "Count & Waste",
      icon: <WasteIcon color={getIconColor("waste")} />,
      route: branchFilter?.length
        ? `/waste/counts?filter[branch]=${branchFilter}${cpuFilter}`
        : "/waste/counts",
      permission:
        [PERMISSIONS.can_access_inventory_management_features]
    },
    {
      name: "Purchases",
      icon: <PurchaseIcon color={getIconColor("purchase")} />,
      route: branchFilter?.length
        ? `/purchase/purchase-orders?filter[branch]=${branchFilter}${cpuFilter}`
        : `/purchase/purchase-orders`,
      permission:
        [
          PERMISSIONS.can_access_inventory_management_features
        ]
    },
    {
      name: "Transfer",
      icon: <TransferIcon color={getIconColor("transfer")} />,
      route: branchFilter?.length
        ? `/transfer?filter[branch]=${branchFilter}${cpuFilter}`
        : `/transfer`,
      permission: [PERMISSIONS.can_access_inventory_management_features]
    },
    {
      name: "Menu Setup",
      icon: <MenuIcon color={getIconColor("menu")} />,
      route: branchFilter?.length
        ? `/menu/categories?filter[branch]=${branchFilter}${cpuFilter}`
        : `/menu/categories`,
      admin: true,

    },
    {
      name: "Central Kitchen",
      icon: <CentralKitchen color={getIconColor("central-kitchen")} />,
      hide: !isCpu,
      route: branchFilter?.length
        ? `/central-kitchen/production?filter[branch]=${branchFilter}${cpuFilter}`
        : `/central-kitchen/production`,
      permission: [PERMISSIONS.can_access_inventory_management_features]

    },
    {
      name: "Inventory Setup",
      icon: <InventoryIcon color={getIconColor("inventory")} />,
      route: branchFilter?.length
        ? `/inventory/items?filter[branch]=${branchFilter}${cpuFilter}`
        : `/inventory/items`,
      permission: [
        PERMISSIONS.can_access_inventory_management_features,

      ]
    },
  ];

  const handleClick = (item: IItem) => {
    nagivate(item?.route);
  };

  return (
    <nav className="fixed z-50 flex flex-col items-center w-16 h-full pb-6 bg-popover">
      <div className="flex items-center justify-center my-5 rounded-full">
        <DotLogo />
      </div>
      <ul className="flex flex-col items-center ">
        {items
          .filter((item) => !item?.hide)
          .map((item, index) => (
            <AuthPermission key={index} permissionRequired={item?.permission} >
              <li key={index} className="w-full min-h-12">
                <Tooltip delayDuration={50}>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => handleClick(item)}
                      onKeyDown={(e) => e.key === "Enter" && handleClick(item)}
                      className={`cursor-pointer border-r-2 px-[22px] py-[15px] ${pathname.split("/")[1] ===
                        item?.route?.split("/")?.[1]?.split("?")[0]
                        ? " border-primary"
                        : " border-transparent"
                        }`}
                      tabIndex={0}
                      role="button"
                      aria-label={item.name}
                    >
                      {item.icon}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-[#4e667e] text-white text-xs z-[100]"
                  >
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </li>
            </AuthPermission>
          ))}
      </ul>
      {

        <AuthPermission>

          <div
            className={`mt-auto cursor-pointer border-r-2 px-[22px] py-[15px] ${pathname.split("/")[1] === "settings"
              ? " border-primary"
              : " border-transparent"
              }`}
          >
            <SettingsIcon
              color={getIconColor("settings")}
              onClick={() => {
                nagivate("settings/pos-settings/branches");
              }}
            />
          </div>
        </AuthPermission>
      }
    </nav>
  );
};

export default SideBar;
