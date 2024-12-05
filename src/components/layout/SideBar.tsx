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
import { DEFAULT_INSIGHTS_DATE } from "@/constants/constants";

// Hooks
import useFilterQuery from "@/hooks/useFilterQuery";
import CentralKitchen from "@/assets/icons/CentralKitchen";
import AuthPermission from "@/guards/AuthPermission";

interface IItem {
  icon: React.ReactElement;
  name: string;
  route: string;
  hide?: boolean;
  permisssion?:string;
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
    },
    {
      name: "Schedulling & Workforce",
      icon: <EmployeeIcon color={getIconColor("schedulling")} />,
      route: `/schedulling/schedule`,
    },
    {
      name: "POS",
      icon: <POSIcon color={getIconColor("POS")} />,
      route: branchFilter?.length
        ? `/POS/orders?filter[branch]=${branchFilter}${cpuFilter}`
        : `/POS/orders`,
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
    },
    {
      name: "Purchases",
      icon: <PurchaseIcon color={getIconColor("purchase")} />,
      route: branchFilter?.length
        ? `/purchase/purchase-orders?filter[branch]=${branchFilter}${cpuFilter}`
        : `/purchase/purchase-orders`,
    },
    {
      name: "Transfer",
      icon: <TransferIcon color={getIconColor("transfer")} />,
      route: branchFilter?.length
        ? `/transfer?filter[branch]=${branchFilter}${cpuFilter}`
        : `/transfer`,
    },
    {
      name: "Menu Setup",
      icon: <MenuIcon color={getIconColor("menu")} />,
      route: branchFilter?.length
        ? `/menu/categories?filter[branch]=${branchFilter}${cpuFilter}`
        : `/menu/categories`,
    },
    {
      name: "Central Kitchen",
      icon: <CentralKitchen color={getIconColor("central-kitchen")} />,
      hide: !isCpu,
      route: branchFilter?.length
        ? `/central-kitchen/production?filter[branch]=${branchFilter}${cpuFilter}`
        : `/central-kitchen/production`,
    },
    {
      name: "Inventory Setup",
      icon: <InventoryIcon color={getIconColor("inventory")} />,
      route: branchFilter?.length
        ? `/inventory/items?filter[branch]=${branchFilter}${cpuFilter}`
        : `/inventory/items`,
        permisssion:"can_access_inventory_management_features"
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
            // <AuthPermission key={index} permissionRequired={item?.permisssion}>
            <li key={index} className="w-full min-h-12">
              <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => handleClick(item)}
                    onKeyDown={(e) => e.key === "Enter" && handleClick(item)}
                    className={`cursor-pointer border-r-2 px-[22px] py-[15px] ${
                      pathname.split("/")[1] ===
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
            // {/* </AuthPermission> */}
          ))}
      </ul>
      <div
        className={`mt-auto cursor-pointer border-r-2 px-[22px] py-[15px] ${
          pathname.split("/")[1] === "settings"
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
    </nav>
  );
};

export default SideBar;
