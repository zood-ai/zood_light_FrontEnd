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
import { DEFAULT_INSIGHTS_DATE } from "@/constants/constants";
import useCpuFilterObj from "@/hooks/useCpuFilterObj";
import CustomInputDate from "../ui/custom/CustomInputDate";
import { addDays, format } from "date-fns";

const NavBar = () => {
  const { pathname } = useLocation();

  const modifyFilterObj = useCpuFilterObj();

  type LinkItem = {
    name: string;
    url: string;
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
      // { name: "Labour", url: "/labour" },
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
      },
      {
        name: "Requests",
        url: `/requests`,
      },
      {
        name: "People",
        url: `/people`,
      },
    ],
    chat: [],
    waste: [
      {
        name: "Counts",
        url: branchFilter?.length
          ? "/counts?filter[branch]=" + branchFilter + cpuFilter
          : "/counts",
      },
      {
        name: "Waste",
        url: branchFilter?.length
          ? "/waste?filter[branch]=" + branchFilter + cpuFilter
          : "/waste",
      },
      {
        name: "Productions",
        url: branchFilter?.length
          ? "/productions?filter[branch]=" + branchFilter + cpuFilter
          : "/productions",
      },
    ],
    purchase: [
      {
        name: "Purchase orders",
        url: branchFilter?.length
          ? `/purchase-orders?filter[branch]=${branchFilter}${cpuFilter}`
          : "/purchase-orders",
      },
      {
        name: "Receive order",
        url: branchFilter?.length
          ? `/receive-order?filter[branch]=${branchFilter}${cpuFilter}`
          : "/receive-order",
      },
      {
        name: "Invoice",
        url: branchFilter?.length
          ? `/invoice?filter[branch]=${branchFilter}${cpuFilter}`
          : `/invoice`,
      },
      {
        name: "Credit Notes",
        url: branchFilter?.length
          ? `/credit-notes?filter[branch]=${branchFilter}${cpuFilter}`
          : `/credit-notes`,
      },
      {
        name: "Purchases",
        url: branchFilter?.length
          ? `/purchases?filter[branch]=${branchFilter}${cpuFilter}`
          : `/purchases`,
      },
      {
        name: "Price Changes",
        url: branchFilter?.length
          ? `/price-changes?filter[branch]=${branchFilter}${cpuFilter}`
          : `/price-changes`,
      },
    ],
    transfer: [],

    "central-kitchen": [
      {
        name: "Production",
        url: branchFilter?.length
          ? `/production?filter[branch]=${branchFilter}${cpuFilter}`
          : `/production`,
      },
      {
        name: "Invoices",
        url: branchFilter?.length
          ? `/invoices?filter[branch]=${branchFilter}${cpuFilter}`
          : `/invoices`,
      },
      {
        name: "Orders",
        url: branchFilter?.length
          ? `/orders?filter[branch]=${branchFilter}${cpuFilter}`
          : `/orders`,
      },
      {
        name: "Sales Report",
        url: branchFilter?.length
          ? `/sales-report?filter[branch]=${branchFilter}${cpuFilter}`
          : `/sales-report`,
      },
    ],
    inventory: [
      {
        name: "Items",
        url: branchFilter?.length
          ? `/items?filter[branch]=${branchFilter}${cpuFilter}`
          : `/items`,
      },
      {
        name: "Batches",
        url: branchFilter?.length
          ? `/batches?filter[branch]=${branchFilter}${cpuFilter}`
          : `/batches`,
      },
      {
        name: "Storage areas",
        url: branchFilter?.length
          ? `/storage-areas?filter[branch]=${branchFilter}${cpuFilter}`
          : `/storage-areas`,
      },
      {
        name: "Recipes",
        url: branchFilter?.length
          ? `/recipes?filter[branch]=${branchFilter}${cpuFilter}`
          : `/recipes`,
      },
      {
        name: "Suppliers",
        url: branchFilter?.length
          ? `/suppliers?filter[branch]=${branchFilter}${cpuFilter}`
          : `/suppliers`,
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
      },
      {
        name: "Inventory Category",
        url: branchFilter?.length
          ? `/category?filter[branch]=${branchFilter}${cpuFilter}`
          : `/category`,
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
      { name: "POS Settings", url: "/pos-settings/branches" },
      { name: "HR Settings", url: "/hr-settings/branches" },
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
            (link: { name: string; url: string }, index) => (
              <li
                key={index}
                className={`mr-8 text-sm
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
                  className="flex items-center h-16"
                >
                  {link.name}
                </Link>
              </li>
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

      {/* right side */}
      <div className="flex gap-[16px] items-center py-4">
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

                setSearchParams(updatedFilter);
              }
            }}
          />
        </div>

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
