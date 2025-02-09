import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

// Utils
import { CustomSplit } from "@/utils";

// Icons

import CustomSelect from "../ui/custom/CustomSelect";
import useCommonRequests from "@/hooks/useCommonRequests";
import useFilterQuery from "@/hooks/useFilterQuery";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Avatar from "@/components/ui/avatar";
import CustomDatePicker from "../ui/custom/CustomDatePicker";
import LogoutIcon from "@/assets/icons/Logout";
import { DEFAULT_INSIGHTS_DATE, PERMISSIONS } from "@/constants/constants";
import useCpuFilterObj from "@/hooks/useCpuFilterObj";
import CustomInputDate from "../ui/custom/CustomInputDate";
import { addDays, format } from "date-fns";
import AuthPermission from "@/guards/AuthPermission";
import useRequeststHttp from "@/modules/Schedulling/Requests/queriesHttp/RequestsHttp";

const NavBar = () => {
  const { pathname } = useLocation();

  const modifyFilterObj = useCpuFilterObj();

  type LinkItem = {
    name: string;
    url: string;
    admin?: boolean;
    permission?: string[];
    badgeValue?: number;
  };

  type LinksType = { [key: string]: LinkItem[] };
  const { filterObj } = useFilterQuery();
  const {
    "filter[branch]": branchFilter,
    is_cpu: isCpu,
    from: fromDate,
    to: toDate,
  } = filterObj;

  const cpuFilter = isCpu ? `&is_cpu=${isCpu}` : "";

  const { TotalRequests } = useRequeststHttp({
    getTotal: true,
  });

  const totalReq = TotalRequests?.totals?.reduce(
    (acc, curr) => acc + curr.total,
    0
  );
  const Links: LinksType = {
    insights: [
      {
        name: "Sales",
        url: branchFilter?.length
          ? `/sales/?filter[branch]=${branchFilter}&${DEFAULT_INSIGHTS_DATE}${cpuFilter}`
          : `/sales/?${DEFAULT_INSIGHTS_DATE}`,
      },
      {
        name: "CoGS",
        url: branchFilter?.length
          ? `/inventory?${DEFAULT_INSIGHTS_DATE}&filter[branch]=${branchFilter}${cpuFilter}`
          : `/inventory?${DEFAULT_INSIGHTS_DATE}`,
      },
      {
        name: "Labour",
        url: branchFilter?.length
          ? `/labour?${DEFAULT_INSIGHTS_DATE}&filter[branch]=${branchFilter}${cpuFilter}`
          : `/labour?${DEFAULT_INSIGHTS_DATE}`,
      },
      {
        name: "Flash P&L",
        url: branchFilter?.length
          ? `/flash?${DEFAULT_INSIGHTS_DATE}&filter[branch]=${branchFilter}${cpuFilter}`
          : `/flash?${DEFAULT_INSIGHTS_DATE}`,
      },
    ],
    schedulling: [
      {
        name: "Schedule",
        url: branchFilter?.length
          ? `/schedule?filter[branch]=${branchFilter}${cpuFilter}&from=${fromDate}&to=${toDate}`
          : "/schedule",
        permission: [
          PERMISSIONS.can_approve_schedule,
          PERMISSIONS.can_approve_holiday_request,
        ],
      },
      {
        name: "Requests",
        url: `/requests`,
        badgeValue: totalReq,
        permission: [
          PERMISSIONS.can_approve_timecards,
          PERMISSIONS.can_approve_holiday_request,
        ],
      },
      {
        name: "People",
        url: `/people`,
        permission: [
          PERMISSIONS.can_see_and_edit_employee_wages,
          PERMISSIONS.can_see_and_upload_employee_documents,
          PERMISSIONS.can_view_personal_info,
          PERMISSIONS.can_access_reports_for_all_locations,
          PERMISSIONS.can_adjust_cost_of_labour_view,
          PERMISSIONS.can_edit_holiday_entitlements,
          PERMISSIONS.can_deactivate_users_from_other_locations,
          PERMISSIONS.can_export_employee_data,
          PERMISSIONS.can_edit_permissions_for_users,
        ],
      },
      {
        name: "Payroll",
        url: `/payroll?${DEFAULT_INSIGHTS_DATE}`,

        permission: [
          PERMISSIONS.can_export_timecards,
          PERMISSIONS.can_edit_timecards,
          PERMISSIONS.can_override_timecards,
          PERMISSIONS.can_approve_timecards,
        ],
      },
    ],
    chat: [],
    waste: [
      {
        name: "Counts",
        url: branchFilter?.length
          ? "/counts?filter[branch]=" + branchFilter + cpuFilter
          : "/counts",
        permission: [PERMISSIONS.can_access_inventory_reports],
      },

      {
        name: "Waste",
        url: branchFilter?.length
          ? "/waste?filter[branch]=" + branchFilter + cpuFilter
          : "/waste",
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Productions",
        url: branchFilter?.length
          ? "/productions?filter[branch]=" + branchFilter + cpuFilter
          : "/productions",
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
    ],
    purchase: [
      {
        name: "Purchase orders",
        url: branchFilter?.length
          ? `/purchase-orders?filter[branch]=${branchFilter}${cpuFilter}`
          : "/purchase-orders",
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Receive order",
        url: branchFilter?.length
          ? `/receive-order?filter[branch]=${branchFilter}${cpuFilter}`
          : "/receive-order",
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Invoice",
        url: branchFilter?.length
          ? `/invoice?filter[branch]=${branchFilter}${cpuFilter}`
          : `/invoice`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Credit Notes",
        url: branchFilter?.length
          ? `/credit-notes?filter[branch]=${branchFilter}${cpuFilter}`
          : `/credit-notes`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Purchases",
        url: branchFilter?.length
          ? `/purchases?filter[branch]=${branchFilter}${cpuFilter}`
          : `/purchases`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Price Changes",
        url: branchFilter?.length
          ? `/price-changes?filter[branch]=${branchFilter}${cpuFilter}`
          : `/price-changes`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
    ],
    transfer: [],

    "central-kitchen": [
      {
        name: "Production",
        url: branchFilter?.length
          ? `/production?filter[branch]=${branchFilter}${cpuFilter}`
          : `/production`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Invoices",
        url: branchFilter?.length
          ? `/invoices?filter[branch]=${branchFilter}${cpuFilter}`
          : `/invoices`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Orders",
        url: branchFilter?.length
          ? `/orders?filter[branch]=${branchFilter}${cpuFilter}`
          : `/orders`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Sales Report",
        url: branchFilter?.length
          ? `/sales-report?filter[branch]=${branchFilter}${cpuFilter}`
          : `/sales-report`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
    ],
    inventory: [
      {
        name: "Items",
        url: branchFilter?.length
          ? `/items?filter[branch]=${branchFilter}${cpuFilter}`
          : `/items`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Batches",
        url: branchFilter?.length
          ? `/batches?filter[branch]=${branchFilter}${cpuFilter}`
          : `/batches`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Storage areas",
        url: branchFilter?.length
          ? `/storage-areas?filter[branch]=${branchFilter}${cpuFilter}`
          : `/storage-areas`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Recipes",
        url: branchFilter?.length
          ? `/recipes?filter[branch]=${branchFilter}${cpuFilter}`
          : `/recipes`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Suppliers",
        url: branchFilter?.length
          ? `/suppliers?filter[branch]=${branchFilter}${cpuFilter}`
          : `/suppliers`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      // {
      //   name: "Warehouse",
      //   url: branchFilter?.length
      //     ? `/warehouse?filter[branch]=${branchFilter}`
      //     : `/warehouse`,
      // },
      {
        name: "CPUs",
        url: branchFilter?.length
          ? `/CPU?filter[branch]=${branchFilter}${cpuFilter}`
          : `/CPU`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
      {
        name: "Inventory Category",
        url: branchFilter?.length
          ? `/category?filter[branch]=${branchFilter}${cpuFilter}`
          : `/category`,
        permission: [PERMISSIONS.can_access_inventory_management_features],
      },
    ],
    menu: [
      {
        name: "Categories",
        url: branchFilter?.length
          ? `/categories?filter[branch]=${branchFilter}${cpuFilter}`
          : `/categories`,
      },

      {
        name: "Products",
        url: branchFilter?.length
          ? `/products?filter[branch]=${branchFilter}${cpuFilter}`
          : `/products`,
      },
      // { name: "Modifiers", url: "/modifiers" },
      // { name: "Modifiers Options", url: "/modifiers-options" },
    ],
    POS: [
      {
        name: "Orders",
        url: branchFilter?.length
          ? `/orders?filter[branch]=${branchFilter}${cpuFilter}`
          : `/orders`,
      },
      {
        name: "Customers",
        url: branchFilter?.length
          ? `/customers?filter[branch]=${branchFilter}${cpuFilter}`
          : `/customers`,
      },
      // { name: "Delivery partners", url: "/delivery-partners" },
    ],
    settings: [
      {
        name: "POS Settings",
        url: "/pos-settings/branches",
      },
      {
        name: "HR Settings",
        url: "/hr-settings/branches",
      },
    ],
  };

  const { branchesSelect } = useCommonRequests({
    getBranches: true,
  });
  const nagivate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLogout = () => {
    Cookies.remove("name");
    Cookies.remove("profile_photo");
    Cookies.remove("token");
    Cookies.remove("id");
    localStorage.removeItem("___admin");
    localStorage.removeItem("___permission");
    localStorage.removeItem("___role");

    nagivate("/login");
  };

  return (
    <header className="h-16 pt-0 pr-5 pb-0 pl-4 flex justify-between items-center border-b-[1px] border-border">
      {/* left side */}
      <nav className="flex gap-2">
        <ul
          className={`flex items-center cursor-pointer ${
            Links[CustomSplit(pathname, 1)]?.length ? "border-r" : ""
          } border-border`}
        >
          {Links[CustomSplit(pathname, 1)]?.map(
            (
              link: {
                name: string;
                url: string;
                badgeValue?: number;
                permission?: string[];
                admin?: boolean;
              },
              index
            ) => (
              <AuthPermission permissionRequired={link.permission}>
                <li
                  key={index}
                  className={`mr-8 text-sm relative
                  ${
                    CustomSplit(link.url, 1)?.includes(
                      CustomSplit(pathname, 2)
                    ) ||
                    (pathname === "/insights" && !link.url.includes("/"))
                      ? `text-primary border-b-[2px] border-primary`
                      : " text-var(--gray-300)"
                  }
                `}
                >
                  <Link
                    to={`${CustomSplit(pathname, 1)}${link.url}`}
                    className="flex items-center h-16 "
                  >
                    {link.name}
                  </Link>

                  {!!link?.badgeValue && (
                    <span className="absolute w-4 h-4 text-xs text-center text-white bg-red-500 rounded-full -right-3 top-3">
                      {link?.badgeValue}
                    </span>
                  )}
                </li>
              </AuthPermission>
            )
          )}
        </ul>
        {["insights", "transfer", "POS"]?.includes(
          CustomSplit(pathname, 1)
        ) && <CustomDatePicker />}

        {[
          "waste",
          "invoice",
          "credit-notes",
          "purchases",
          "price-changes",
          "sales-report",
          "schedule",
          "payroll",
          "people",
        ]?.includes(CustomSplit(pathname, 2)) && (
          <CustomDatePicker
            disableChoose={CustomSplit(pathname, 2) === "schedule"}
          />
        )}
        {["production"]?.includes(CustomSplit(pathname, 2)) && (
          <CustomInputDate
            disabledDate={(date) => date > addDays(new Date(), 1)}
            onSelect={(date) =>
              setSearchParams({
                ...filterObj,
                date: format(date, "yyyy-MM-dd"),
              })
            }
            className="justify-center"
            defaultValue={format(
              filterObj.date || addDays(new Date(), 1),
              "dd MMM"
            )}
          />
        )}

        {/* date picker */}
      </nav>
      <div className="flex gap-[16px] items-center py-4">
        {pathname !== "/" && (
          <div className="flex items-center gap-1 cursor-pointer ">
            <CustomSelect
              options={branchesSelect}
              className="border-transparent"
              optionDefaultLabel="All Locations"
              value={
                CustomSplit(pathname, 2) == "flash"
                  ? "null"
                  : searchParams.get("filter[branch]") ?? ""
              }
              disabled={CustomSplit(pathname, 2) == "flash" ? true : false}
              onValueChange={(value) => {
                if (value == "null") {
                  delete filterObj["filter[branch]"];
                  setSearchParams({ ...filterObj });
                } else {
                  const updatedFilter = modifyFilterObj(
                    filterObj,
                    branchesSelect,
                    value
                  );
                  if (CustomSplit(pathname, 2) == "payroll") {
                    setSearchParams({ ...updatedFilter, is_home: "true" });
                  } else {
                    setSearchParams(updatedFilter);
                  }
                }
              }}
            />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Avatar
                text={`${Cookies.get("name")}`}
                className="font-bold cursor-pointer"
                bg="secondary"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20 mr-8 bg-white">
            <DropdownMenuCheckboxItem
              className="flex gap-3 cursor-pointer text-textPrimary "
              onClick={handleLogout}
            >
              <LogoutIcon />
              <p>Logout</p>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NavBar;
