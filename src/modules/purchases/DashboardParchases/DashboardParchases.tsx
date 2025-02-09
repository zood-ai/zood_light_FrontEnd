// Components
import Card from "@/components/ui/custom/Card";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import PurchaseBy from "./components/PurchaseBy";
import HeaderTable from "@/components/ui/custom/HeaderTable";

// Hooks
import useDashboardPurchasesHttp from "./queriesHttp/useDashboardPurchasesHttp";
import usePurchaseColumns from "./hooks/usePurchaseColumns";
import useFilterQuery from "@/hooks/useFilterQuery";
import { format, startOfYear } from "date-fns";

const DashboardParchases = () => {
  const {
    dataByTotal,
    isLoadingDataByTotal,

    dataByLocation,
    isLoadingDataByLocation,

    dataBySupplier,
    isLoadingDataBySupplier,

    dataByItem,
    isLoadingDataByItem,

    dataByCategory,
    isLoadingDataByCategory,

    purchaseExport,
    isPurchaseExport,
  } = useDashboardPurchasesHttp();

  const { LocationColumns, SupplierColumns, ItemColumns, CategoryColumns } =
    usePurchaseColumns();

  const { filterObj } = useFilterQuery();
  return (
    <>
      <HeaderPage title="Purchasing insights" />
      <div className="flex items-center gap-3 mb-[24px]">
        <Card
          className="w-[340px]"
          showChart={false}
          showBorder={false}
          textColor="text-[#69777D]"
          isLoading={isLoadingDataByTotal}
          data={{
            totalData: {
              headerText: "Total ordered (excl. VAT)",
              mainValue:
                "SAR " +
                Number(dataByTotal?.data?.total_ordered).toLocaleString(),
              subValue: "",
            },
          }}
        />

        <Card
          className="w-[340px]"
          showChart={false}
          showBorder={false}
          tooltipContent="if the total don`t match, it could be due to changes in prices or differences in quantities"
          isLoading={isLoadingDataByTotal}
          textColor="text-[#69777D]"
          data={{
            totalData: {
              headerText: "Total delivered (excl. VAT)",
              mainValue:
                "SAR " +
                Number(dataByTotal?.data?.total_delivered).toLocaleString(),
              subValue: "",
            },
          }}
        />
      </div>

      <HeaderTable
        isBranches={true}
        isSupplier={true}
        isItems={true}
        isCategory={true}
        SearchInputkey="item_name"
        supplierkey="suppliers[0]"
        branchkey="filter[branch]"
        itemKey="items[0]"
        categorykey="categories[0]"
        onClickExport={() =>
          purchaseExport({
            from:
              filterObj["from"] ||
              format(startOfYear(new Date()), "yyyy-MM-dd"),
            to: filterObj["to"] || format(new Date(), "yyyy-MM-dd"),
          })
        }
        loadingExport={isPurchaseExport}
      />
      <div className="grid grid-cols-12 gap-[24px]">
        <div className="col-span-6">
          <PurchaseBy
            title="location"
            data={dataByLocation?.data}
            isLoading={isLoadingDataByLocation}
            columns={LocationColumns}
          />
        </div>
        <div className="col-span-6">
          <PurchaseBy
            title="Supplier"
            data={dataBySupplier?.data}
            isLoading={isLoadingDataBySupplier}
            columns={SupplierColumns}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-[24px]">
        <div className="col-span-6">
          <PurchaseBy
            title="Item"
            data={dataByItem?.data}
            isLoading={isLoadingDataByItem}
            columns={ItemColumns}
          />
        </div>
        <div className="col-span-6">
          <PurchaseBy
            title="Category"
            data={dataByCategory?.data}
            isLoading={isLoadingDataByCategory}
            columns={CategoryColumns}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardParchases;
