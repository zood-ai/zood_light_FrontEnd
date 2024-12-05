import { Input } from "../input";
import useFilterQuery from "@/hooks/useFilterQuery";
import CustomSelect from "./CustomSelect";
import useCommonRequests from "@/hooks/useCommonRequests";
import { useSearchParams } from "react-router-dom";
import {
  DelivaryDateOptions,
  OrderTypesOptions,
  SortByOptions,
  StatusOptions,
  StatusOptionsTransferType,
  TypesOptions,
} from "@/constants/dropdownconstants";
import { Checkbox } from "../checkbox";
import { Button } from "../button";
import Export from "@/assets/icons/Export";
import useCpuFilterObj from "@/hooks/useCpuFilterObj";
type IHeaderTable = {
  placeHolder?: string;
  isSearch?: boolean;
  isCategory?: boolean;
  isSupplier?: boolean;
  isBranches?: boolean;
  isStatus?: boolean;
  isInvoiceNumber?: boolean;
  isHasCreditNotes?: boolean;
  supplierkey?: string;
  branchkey?: string;
  SearchInputkey?: string;
  isType?: boolean;
  isOrderType?: boolean;
  isSort?: boolean;
  isItems?: boolean;
  itemKey?: string;
  invoiceKey?: string;
  statusTypeKey?: string;
  statusKey?: string;
  orderTagsKey?: string;
  SortKey?: string;
  hasCreditNotesKey?: string;
  optionStatus?: { value: string; label: string }[];
  onClickExport?: () => void;
  loadingExport?: boolean;
  isOrderTags?: boolean;
  categorykey?: string;
  isStatusType?: boolean;
  fromMenu?: boolean;
  children?: JSX.Element;
  TypeOptions?: { value: string; label: string }[];
  isGroup?: boolean;
  isDelivaryDate?: boolean;
};

const HeaderTable = ({
  placeHolder = "Search by name",
  supplierkey = "filter[suppliers][0]",
  branchkey = "filter[branch]",
  SearchInputkey = "filter[name]",
  categorykey = "filter[category_id]",
  itemKey = "filter[item_name]",
  statusTypeKey = "filter[type]",
  statusKey = "filter[status]",
  invoiceKey = "filter[invoice_number]",
  orderTagsKey = "filter[order_tag]",
  hasCreditNotesKey = "filter[has_creditNotices]",
  SortKey = "filter[sort]",
  isSearch = true,
  isCategory = false,
  isSupplier = false,
  isBranches = false,
  isStatus = false,
  isInvoiceNumber = false,
  isHasCreditNotes = false,
  isType = false,
  isOrderType = false,
  isItems = false,
  loadingExport,
  isOrderTags = false,
  isSort = false,
  optionStatus = StatusOptions,
  isStatusType = false,
  fromMenu = false,
  children,
  TypeOptions = TypesOptions,
  isGroup = false,
  isDelivaryDate = false,

  onClickExport,
}: IHeaderTable) => {
  const { filterObj } = useFilterQuery();

  const modifyFilterObj = useCpuFilterObj();

  const [searchParams, setSearchParams] = useSearchParams();
  const {
    branchesSelect,
    SuppliersSelect,
    CategoriesSelect,
    ItemsSelect,
    tagsSelect,
    isFetchingTags,
  } = useCommonRequests({
    getBranches: isBranches || isStatus,
    getSuppliers: isSupplier,
    getCategories: isCategory,
    getItems: isItems,
    typeTag: "4",
    fromMenu,
  });

  const keys = [
    supplierkey,
    branchkey,
    SearchInputkey,
    categorykey,
    itemKey,
    statusTypeKey,
    invoiceKey,
    orderTagsKey,
    statusKey,
    hasCreditNotesKey,
  ];

  const clearSearchParams = () => {
    const branch = filterObj["filter[branch]"];
    const isCpu = filterObj["is_cpu"];
    const newFilterObj = {};

    if (branch) {
      newFilterObj["filter[branch]"] = branch;
    }

    if (isCpu) {
      newFilterObj["is_cpu"] = isCpu;
    }

    setSearchParams(new URLSearchParams(newFilterObj));
  };

  const CheckParamsLength =
    // check if there is a page param in url only to aviod show clear filter btn in this case
    (Object.keys(filterObj).length === 1 && filterObj?.page) ||
    // check if there is no filter options in url
    !Object.keys(filterObj).length ||
    // check if any keys  of filter options is present in the url
    !Object.keys(filterObj).some((key) => keys.includes(key));

  return (
    <div className="overflow-x-auto bg-popover ">
      <div className="justify-between border-gray-200 border-[1px] h-[64px] rounded-[4px] flex items-center p-[24px] ">
        <div className="flex justify-between w-fill-available">
          <div className="flex gap-[16px]">
            {isStatusType && (
              <CustomSelect
                placeHolder="Filter by type"
                options={StatusOptionsTransferType}
                optionDefaultLabel="All Transfers"
                value={searchParams.get(statusTypeKey) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[statusTypeKey];
                  } else {
                    updatedFilterObj[statusTypeKey] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}

            {isInvoiceNumber && (
              <Input
                placeholder="Search by invoice number..."
                searchIcon={true}
                className="w-[300px]"
                defaultValue={searchParams.get(invoiceKey) ?? ""}
                onChange={(e) => {
                  setSearchParams(filterObj);
                  if (
                    searchParams.get(invoiceKey)?.length === 1 &&
                    !e.target.value.length
                  ) {
                    delete filterObj[invoiceKey];
                    setSearchParams({
                      ...filterObj,
                    });
                  } else {
                    setSearchParams({
                      ...filterObj,
                      [invoiceKey]: e.target.value,
                    });
                  }
                }}
              />
            )}

            {isSearch && (
              <Input
                placeholder={placeHolder}
                searchIcon={true}
                defaultValue={searchParams.get(SearchInputkey) ?? ""}
                className="w-[180px] placeholder:font-normal"
                onChange={(e) => {
                  setSearchParams(filterObj);

                  if (
                    searchParams.get(SearchInputkey)?.length === 1 &&
                    !e.target.value.length
                  ) {
                    delete filterObj[SearchInputkey];
                    setSearchParams({
                      ...filterObj,
                    });
                  } else {
                    setSearchParams({
                      ...filterObj,
                      [SearchInputkey]: e.target.value,
                    });
                  }
                }}
              />
            )}

            {isDelivaryDate && (
              <CustomSelect
                placeHolder="Delivery Date"
                options={DelivaryDateOptions}
                optionDefaultLabel="Delivery Date"
                loading={isFetchingTags}
                value={searchParams.get(orderTagsKey) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[orderTagsKey];
                  } else {
                    updatedFilterObj[orderTagsKey] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}
            {isGroup && (
              <CustomSelect
                placeHolder="Group"
                options={[]}
                optionDefaultLabel="Group"
                loading={isFetchingTags}
                value={searchParams.get(orderTagsKey) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[orderTagsKey];
                  } else {
                    updatedFilterObj[orderTagsKey] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}

            {isOrderTags && (
              <CustomSelect
                placeHolder="Order Tags"
                options={tagsSelect}
                optionDefaultLabel="All Tags"
                loading={isFetchingTags}
                value={searchParams.get(orderTagsKey) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[orderTagsKey];
                  } else {
                    updatedFilterObj[orderTagsKey] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}
            {isCategory && (
              <CustomSelect
                placeHolder="All Categories"
                options={CategoriesSelect}
                optionDefaultLabel="All Categories"
                value={searchParams.get(categorykey) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[categorykey];
                  } else {
                    updatedFilterObj[categorykey] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}
            {isSupplier && (
              <CustomSelect
                placeHolder="All Supplier"
                optionDefaultLabel="All Suppliers"
                options={SuppliersSelect}
                value={searchParams.get(`${supplierkey}`) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[`${supplierkey}`];
                  } else {
                    updatedFilterObj[`${supplierkey}`] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}

            {isBranches && (
              <CustomSelect
                placeHolder="All Locations"
                optionDefaultLabel="All Locations"
                options={branchesSelect}
                value={searchParams.get(`${branchkey}`) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[`${branchkey}`];
                  } else {
                    updatedFilterObj = modifyFilterObj(
                      filterObj,
                      branchesSelect,
                      value,
                      branchkey
                    );
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}

            {isItems && (
              <CustomSelect
                placeHolder="All Items"
                optionDefaultLabel="All Items"
                options={ItemsSelect}
                value={searchParams.get(`${itemKey}`) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[`${itemKey}`];
                  } else {
                    updatedFilterObj[`${itemKey}`] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}

            {isStatus && (
              <CustomSelect
                placeHolder="Filter by status"
                options={optionStatus}
                optionDefaultLabel="All Status"
                value={searchParams.get(statusKey) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[statusKey];
                  } else {
                    updatedFilterObj[statusKey] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}

            {isOrderType && (
              <CustomSelect
                placeHolder="Filter by Order type"
                optionDefaultLabel="All Order Types"
                options={OrderTypesOptions}
                value={searchParams.get(statusTypeKey) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[statusTypeKey];
                  } else {
                    updatedFilterObj[statusTypeKey] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}
            {isType && (
              <CustomSelect
                placeHolder="All Types"
                optionDefaultLabel="All Types"
                options={TypeOptions}
                value={searchParams.get(statusTypeKey) || ""}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    delete updatedFilterObj[statusTypeKey];
                  } else {
                    updatedFilterObj[statusTypeKey] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}

            {isHasCreditNotes && (
              <div className="flex gap-2 mt-2">
                <Checkbox
                  className="mt-[1.5px]"
                  onCheckedChange={(checked) => {
                    let updatedFilterObj = { ...filterObj };

                    if (checked) {
                      updatedFilterObj[hasCreditNotesKey] = "1";
                    } else {
                      delete updatedFilterObj[hasCreditNotesKey];
                    }

                    setSearchParams(updatedFilterObj);
                  }}
                />
                <p>Show only invoices with credit notes</p>
              </div>
            )}

            {isSort && (
              <CustomSelect
                optionDefaultLabel="Sort By"
                width="w-[250px]"
                showSearch={false}
                options={SortByOptions}
                value={searchParams.get(SortKey) || SortByOptions[0].value}
                onValueChange={(value) => {
                  let updatedFilterObj: {
                    [x: string]: string;
                  } = { ...filterObj };
                  if (value === "null") {
                    return;
                  } else {
                    updatedFilterObj[SortKey] = value;
                  }

                  setSearchParams(updatedFilterObj);
                }}
              />
            )}
          </div>

          <div className="flex items-center ">
            {children}
            {!CheckParamsLength ? (
              <div
                className="text-primary text-[14px] cursor-pointer"
                onClick={clearSearchParams}
              >
                Clear filters
              </div>
            ) : (
              <div className="w-[20px]"></div>
            )}

            {onClickExport && (
              <Button
                variant="outline"
                onClick={onClickExport}
                loading={loadingExport}
              >
                <Export color="#2F3D4C" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTable;
