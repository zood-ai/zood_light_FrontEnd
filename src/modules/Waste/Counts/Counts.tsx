import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { addDays, format } from "date-fns";

// types
import { ICountsList, IStockCounts } from "./types/types";

// UI components
import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ChooseBranch from "@/components/ui/custom/ChooseBranch";
import ReconciliationReport from "./components/ReconciliationReport";
import ManagementReport from "./components/ManagementReport";
import CountFormContent from "./components/CountFormContent";
import CountHeader from "./components/CountHeader";

// hooks
import useCountsHttp from "./queriesHttp/useCountsHttp";
import useCommonRequests from "@/hooks/useCommonRequests";

// Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formCountsSchema } from "./schema/Schema";

// Icons
import DocumentIcon from "@/assets/icons/Document";
import ArrowRightIcon from "@/assets/icons/ArrowRIghtIcon";
import Export from "@/assets/icons/Export";

// constants
import { INV_COUNT_TYPES, PERMISSIONS } from "@/constants/constants";
import AuthPermission from "@/guards/AuthPermission";

const Counts = () => {
  const [countId, setCountId] = useState("");
  const [isFirstCol, setIsFirstCol] = useState(true);
  const [fromReport, setFromReport] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);

  const storageAreasFilter = searchParams.get("filter[storage_areas]")
    ? `&filter[storageAreas][0]=${searchParams.get("filter[storage_areas]")}`
    : "";
  const typeFilter = searchParams.get("filter[type]")
    ? `&filter[type]=${searchParams.get("filter[type]")}`
    : "";

  const { allItems, isAllItemsLoading } = useCommonRequests({
    getAllItems: true,
    filterByBranch: `filter[branch_id]=${searchParams.get(
      "filter[branch]"
    )}&type=all`,
    filterItem: `filter[branches][0]=${searchParams.get(
      "filter[branch]"
    )}${storageAreasFilter}${typeFilter}`,
  });

  const [getReport, setGetReport] = useState(false);

  const [rowsSelectedIds, setRowsSelectedIds] = useState<string[]>([]);

  const handleCloseSheet = () => {
    setIsOpen(false);
    setIsEdit(false);
    setModalName("");
    setOpenReport(false);
    setFromReport(false);
    setStep(1);
    const branchId = searchParams.get("filter[branch]") ?? "";
    setSearchParams({ "filter[branch]": branchId });
    form.reset(defaultValues);
  };

  const handleCLoseSheetWithCountId = (openReport: boolean = false) => {
    setIsOpen(false);
    setIsEdit(false);
    setModalName("");
    if (!openReport) {
      setOpenReport(false);
      setCountId("");
    }

    const branchId = searchParams.get("filter[branch]") ?? "";

    setSearchParams({ "filter[branch]": branchId });

    setFromReport(false);
    setStep(1);
    form.reset(defaultValues);
  };

  const {
    CountsData,
    isFetchingCounts,
    countData,
    isFetchingcount,
    isPendingGenerateReport,
    ReportData,
    isPendingDelete,
    deleteCount,
    countReportExport,
    isPendingExport,
  } = useCountsHttp({
    countId: countId || "",
    setBussinessDate: (date: string) => {
      form.setValue("business_date", date, { shouldValidate: true });
    },
    setGetReport: (getReport: boolean) => setGetReport(getReport),
    getReport,
    handleCloseSheet,
    setFormData: (data) => {
      form.reset(data);
    },
  });

  const [modalName, setModalName] = useState("");
  const [rowIndex, setRowIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [step, setStep] = useState<number>(1);

  const defaultValues = {
    business_date: format(
      addDays(
        CountsData?.data?.[0]?.business_date || new Date(),
        CountsData?.data?.length > 0 ? 1 : 0
      ),
      "yyyy-MM-dd"
    ),
    type: "weekly",
    day_option: "start",
    items: [],
  };

  const nextStep = (stepNumber: number, countId?: string) => {
    setStep(stepNumber);
    if (countId) {
      setCountId(countId);
    }
  };

  const onSubmit = () => {};

  const status: { [key: number]: string } = {
    1: "Draft",
    2: "Completed",
  };

  const form = useForm<z.infer<typeof formCountsSchema>>({
    resolver: zodResolver(formCountsSchema),
    defaultValues,
  });

  const columns: ColumnDef<ICountsList>[] = [
    {
      id: "select",
      cell: ({ row }: { row: Row<ICountsList> }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={
            row.getValue("status") === 1 ||
            (!rowsSelectedIds.includes(row?.original?.id) &&
              rowsSelectedIds.length === 2)
          }
          onClick={(e) => {
            e.stopPropagation();
          }}
          onCheckedChange={(value) => {
            if (value) {
              setRowsSelectedIds((prev) => [...prev, String(row.original.id)]);
            } else {
              setRowsSelectedIds((prev) =>
                prev.filter((id) => id != row.original.id)
              );
            }

            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "business_date",
      header: () => <div>Date</div>,
      cell: ({ row }: { row: Row<ICountsList> }) => {
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
              <DocumentIcon />
            </div>
            {format(row.getValue("business_date"), "dd MMMM, yyyy")}
            <span className="text-[12px] text-textPrimary flex items-center justify-center bg-muted-foreground border border-secondary rounded-sm w-[59px] h-[24px]">
              Day {row.original.day_option}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: () => <div>Type</div>,

      cell: ({ row }: { row: Row<ICountsList> }) => (
        <div>{row.getValue("type") || "-"}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }: { row: Row<ICountsList> }) => (
        <>{status[row.getValue("status") as keyof typeof status] || "-"}</>
      ),
    },
  ];

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      deleteCount({ id: countId || "" });
    }
  };

  return (
    <>
      {!searchParams.get("filter[branch]") ? (
        <ChooseBranch showHeader />
      ) : (
        <>
          <HeaderPage
            title="Counts"
            onClickAdd={() => {
              setIsOpen(true);
            }}
            textButton="New Count"
            permission={[PERMISSIONS.can_edit_stock_counts]}
          >
            {/* <Button
              className="text-gray-400 bg-transparent border-gray-400"
              variant={"outline"}
              disabled={rowsSelectedIds.length <= 1}
              onClick={() => setOpenReport(true)}
            >
              Generate Report
            </Button> */}
          </HeaderPage>

          <CustomTable
            columns={columns}
            data={CountsData?.data || []}
            loading={isFetchingCounts}
            pagination
            setRowIndex={setRowIndex}
            paginationData={{
              from: CountsData?.from || 0,
              total: CountsData?.total || 0,
              current_page: CountsData?.current_page || 0,
              to: CountsData?.to || 0,
              last_page: CountsData?.last_page || 0,
            }}
            onRowClick={(row: ICountsList) => {
              if (row.status === 1) {
                setIsOpen(true);
                setIsEdit(true);
                setCountId(row.id);
                setGetReport(false);
                setIsFirstCol(false);
              } else {
                setCountId(row.id);
                setGetReport(true);
                setOpenReport(true);
                setIsFirstCol(
                  CountsData?.data?.filter((item) => item.status === 2)[0]
                    .id === row.id
                );
              }
            }}
          />

          <CustomSheet
            isOpen={isOpen}
            isEdit={step === 2}
            setModalName={setModalName}
            handleCloseSheet={handleCLoseSheetWithCountId}
            form={form}
            onSubmit={onSubmit}
            isLoadingForm={isFetchingcount}
            width="w-[672px]"
            isLoading={isFetchingCounts}
            contentStyle={step === 1 ? "p-0" : "px-6"}
            headerStyle={`border-b-0 ${
              (step === 2 || step === 3) && "pb-0"
            } flex items-center justify-between w-full`}
            purchaseHeader={
              <CountHeader
                setStep={setStep}
                fromReport={fromReport}
                countId={countId}
                modalName={modalName}
                setModalName={setModalName}
                step={step}
                isEdit={isEdit}
                handleCloseSheet={handleCloseSheet}
                useReportCount={
                  allItems?.data[selectedItemIndex]?.stock_counts?.find(
                    (sc) => sc?.use_report === 1
                  )?.count ?? 0
                }
                stockCounts={
                  form
                    .watch("items")
                    ?.find(
                      (item) =>
                        item.id === allItems?.data[selectedItemIndex]?.id
                    )?.array_stock_counts as IStockCounts[]
                }
                quantity={
                  form
                    .getValues("items")
                    ?.find(
                      (it) => it.id === allItems?.data[selectedItemIndex]?.id
                    )?.quantity ?? 0
                }
                itemName={allItems?.data[selectedItemIndex]?.name}
                businessDate={form.getValues("business_date")}
                dayOption={form.getValues("day_option")}
                type={form.getValues("type")}
                packUnit={allItems?.data[selectedItemIndex]?.pack_unit}
                status={status[countData?.data?.status]}
                mainUnit={allItems?.data[selectedItemIndex]?.stock_counts?.find(
                  (sc: {
                    id: number;
                    item_id: string;
                    show_as: string;
                    use_report: number;
                    count: number;
                    checked: number;
                  }) => sc?.use_report === 1
                )}
              />
            }
          >
            <CountFormContent
              step={step}
              setStep={setStep}
              setSelectedItemIndex={setSelectedItemIndex}
              formControl={form.control}
              fromReport={fromReport}
              itemsData={allItems?.data}
              isEdit={isEdit}
              countId={countId}
              setOpenReport={setOpenReport}
              handleCloseSheet={handleCLoseSheetWithCountId}
              isFetchingItems={isAllItemsLoading}
              selectedItemIndex={selectedItemIndex}
              setIsFirst={setIsFirstCol}
              nextStep={nextStep}
              businessDate={format(
                addDays(
                  CountsData?.data?.[0]?.business_date || new Date(),
                  CountsData?.data?.length > 0 ? 1 : 0
                ),
                "yyyy-MM-dd"
              )}
              setGetReport={setGetReport}
              getReport={getReport}
              setCountId={setCountId}
            />
          </CustomSheet>

          {/* Report Modal */}
          <CustomSheet
            isOpen={openReport}
            handleCloseSheet={handleCLoseSheetWithCountId}
            form={form}
            onSubmit={onSubmit}
            isLoadingForm={isPendingGenerateReport}
            width="w-[90%]"
            isLoading={isPendingGenerateReport}
            purchaseHeader={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center w-full gap-2">
                  <h1 className="text-textPrimary flex items-center gap-2 text-[16px] font-semibold  ">
                    {INV_COUNT_TYPES[ReportData?.invCount?.type]} count • 
                    {format(
                      ReportData?.from || new Date(),
                      "dd MMMM yyyy"
                    )}{" "}
                    {""}
                    <span className="bg-muted border border-secondary rounded-sm flex items-center justify-center w-[59px] h-[24px] text-secondary text-[12px] font-medium">
                      Day {ReportData?.lastDayOption}
                    </span>
                  </h1>
                  <ArrowRightIcon className="w-3 h-3 -ml-1" />
                  <h1 className="text-textPrimary flex items-center gap-2 text-[16px] font-semibold ">
                    {INV_COUNT_TYPES[ReportData?.invCount?.type]} count • 
                    {format(ReportData?.to || new Date(), "dd MMMM yyyy")} {""}
                    <span className="bg-muted border border-secondary rounded-sm flex items-center justify-center w-[59px] h-[24px] text-secondary text-[12px] font-medium">
                      Day {ReportData?.invCount?.day_option}
                      {/* {dayOption}{" "} */}
                    </span>
                  </h1>
                </div>
                <AuthPermission permissionRequired={[PERMISSIONS.can_edit_stock_counts]}>
                  
                   <div className="flex items-center gap-2">
                  <Button
                    variant={"outline"}
                    disabled={isPendingDelete}
                    className="font-medium bg-transparent border-none text-textPrimary "
                    onClick={() => {
                      setOpenReport(false);
                      setFromReport(true);
                      setStep(2);
                      setIsOpen(true);
                      setIsEdit(true);
                    }}
                  >
                    Back to count
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => countReportExport()}
                    loading={isPendingExport}
                  >
                    <Export color="var(--text-primary)" />
                  </Button>
                  {/* {} */}
                  {isFirstCol && (
                    <Button
                      type="button"
                      disabled={isPendingDelete}
                      variant="outline"
                      onClick={() => setModalName("delete")}
                      className="px-4 font-semibold w-fit text-warn border-warn"
                    >
                      Delete
                    </Button>
                  )}

                  <Button
                    disabled={isPendingDelete}
                    className="font-semibold bg-primary"
                    onClick={() => setOpenReport(false)}
                  >
                    Close
                  </Button>
                </div></AuthPermission>
               
              </div>
            }
            tabs={[
              {
                name: "Reconciliation report",
                content: (
                  <ReconciliationReport
                    reportData={ReportData?.data}
                    isPendingGenerateReport={isPendingGenerateReport}
                    modalName={modalName}
                    type={INV_COUNT_TYPES[ReportData?.invCount?.type]}
                    status={status[ReportData?.invCount?.status]}
                    isPendingDelete={isPendingDelete}
                    setModalName={setModalName}
                    handleConfirm={handleConfirm}
                  />
                ),
              },
              {
                name: "Management report",
                content: (
                  <ManagementReport
                    countId={countId}
                    handleConfirm={handleConfirm}
                    modalName={modalName}
                    type={INV_COUNT_TYPES[ReportData?.invCount?.type]}
                    status={status[ReportData?.invCount?.status]}
                    isPendingDelete={isPendingDelete}
                    setModalName={setModalName}
                  />
                ),
              },
            ]}
          />
        </>
      )}
    </>
  );
};

export default Counts;
