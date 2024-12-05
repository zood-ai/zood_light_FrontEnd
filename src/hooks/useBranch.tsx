import { useLocation } from "react-router-dom";
import useFilterQuery from "./useFilterQuery";
import { CustomSplit } from "@/utils";

export const useDefaultBranch = () => {
  const { pathname } = useLocation();
  const { filterObj } = useFilterQuery();

  const path = CustomSplit(pathname, 2);
  const pathMain = CustomSplit(pathname, 1);
  const filterUrl = filterObj?.["filter[branch]"];
  const result: {
    branch_id?: string;
    "filter[branch_id]"?: string;
    "filter[branches][0]"?: string;
    "branches[0]"?: string;
    cpu_id?: string;
  } = {};


  if (
    (["waste", "price-changes"].includes(path) && filterUrl) ||
    pathMain === "transfer"
  ) {
    result.branch_id = filterUrl;
  }
  if (
    ["invoice", "credit-notes", "storage-areas"].includes(path) &&
    filterUrl
  ) {
    result["filter[branch_id]"] = filterUrl;
  }
  if (["items", "batches", "suppliers"].includes(path) && filterUrl) {
    result["filter[branches][0]"] = filterUrl;
  }
  if ((path == "purchases" || path == "sales-report") && filterUrl) {
    result["branches[0]"] = filterUrl;
  }
  if (((path == "invoices" || path == "orders") && pathMain == "central-kitchen") && filterUrl) {
    result.cpu_id = filterUrl;
  }

  return result;
};
