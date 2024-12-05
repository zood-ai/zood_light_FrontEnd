import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ActualVsTargetType } from "../types/types";
import useCustomQuery from "@/hooks/useCustomQuery";
import { Skeleton } from "@/components/ui/skeleton";
import CustomModal from "@/components/ui/custom/CustomModal";
import { DEFAULT_INSIGHTS_DATE } from "@/constants/constants";
import useFilterQuery from "@/hooks/useFilterQuery";
import CustomAlert from "@/components/ui/custom/CustomAlert";

const ManagementReport = ({
  countId,
  handleConfirm,
  modalName,
  isPendingDelete,
  setModalName,
  type,
  status,
}: {
  countId: string;
  handleConfirm: () => void;
  modalName: string;
  isPendingDelete: boolean;
  setModalName: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  status: string;
}) => {
  const { data: ReportData, isPending: isPendingGenerateReport } =
    useCustomQuery(
      ["inventory-count-report/management", countId ?? ""],
      `forecast-console/inventory-count-report/${countId}/management`
    );

  const { filterObj } = useFilterQuery();

  const branchId = filterObj["filter[branch]"];
  const ActualVsTarget: ActualVsTargetType[] = [
    {
      title: "Sales",
      type: "accordion",
      value: `SAR ${ReportData?.total_sales || "N/A"} `,
      content: isPendingGenerateReport
        ? []
        : Object.entries(ReportData?.data?.total_sales || {})?.map(
            ([key, value]: any) => ({
              label: key,
              value: `SAR ${value?.total_sales?.toLocaleString() || "N/A"}`,
              percentage: `${value?.total_sales_percentage ?? "0"} %`,
            })
          ),
    },
    {
      title: "Unassigned sales",
      value: `SAR ${ReportData?.unassigned_sales?.toLocaleString()} `,
      show: !!ReportData?.unassigned_sales,
    },
    {
      title: "Cost of Sales (actual)",
      value: `SAR ${ReportData?.costOfGoodsActual?.toLocaleString()} `,
      type: "accordion",
      // percentage: "20%",
      content: isPendingGenerateReport
        ? []
        : Object.entries(ReportData?.data?.costOfGoodsActual).map(
            ([key, value]: any) => ({
              label: key,
              value: `SAR ${value?.total_sales?.toLocaleString()} as of ${
                value?.date
              }`,
              percentage: `${value?.total_sales_percentage} %` as string,
            })
          ),
    },
    {
      title: "Cost of Sales (target)",
      value: `SAR ${ReportData?.costOfGoodsTarget?.toLocaleString()}`,
      type: "accordion",
      // percentage: "20%",
      content: isPendingGenerateReport
        ? []
        : Object.entries(ReportData?.data?.costOfGoodsTarget).map(
            ([key, value]: [any, any]) => ({
              label: key,
              value: `SAR ${value?.total_sales?.toLocaleString()}`,
              percentage: `${value?.total_sales_percentage} %`,
            })
          ),
    },
    {
      title: "Gross profit (actual)",
      value: `SAR ${ReportData?.actual_gp?.toLocaleString()}`,
      type: "accordion",
      // percentage: "20%",
      content: isPendingGenerateReport
        ? []
        : Object.entries(ReportData?.data?.actual_gp).map(
            ([key, value]: [any, any]) => ({
              label: key,
              value: `SAR ${value?.total_sales?.toLocaleString()}`,
              percentage: `${value?.total_sales_percentage} %`,
            })
          ),
    },
    {
      title: "Gross profit (target)",
      value: `SAR ${ReportData?.target_gp?.toLocaleString()}`,
      type: "accordion",
      content: isPendingGenerateReport
        ? []
        : Object.entries(ReportData?.data?.target_gp).map(
            ([key, value]: [any, any]) => ({
              label: key,
              value: `SAR ${value?.total_sales?.toLocaleString()}`,
              percentage: `${value?.total_sales_percentage} %`,
            })
          ),
    },
    {
      title: "Variance",
      value: `SAR ${ReportData?.variance?.toLocaleString()}`,
      type: "accordion",
      // percentage: "20%",
      content: isPendingGenerateReport
        ? []
        : Object.entries(ReportData?.data?.variance).map(
            ([key, value]: [any, any]) => ({
              label: key,
              value: `SAR ${value?.total_sales?.toLocaleString()}`,
              percentage: `${value?.total_sales_percentage} %`,
            })
          ),
    },
  ];

  return (
    <>
      {/* Cost of goods sold table */}
      <div className="mb-4 border border-gray-400 rounded-sm">
        <h4 className="text-[20px] py-[11px] px-2 border border-b-gray-400 font-semibold text-textPrimary">
          Cost of goods sold
        </h4>
        <div className="flex flex-col gap-4 p-4 text-textPrimary">
          <div className="flex items-center justify-between ">
            <span>Beginning inventory </span>
            {isPendingGenerateReport ? (
              <Skeleton className="w-[200px] text-right h-[20px] mb-2" />
            ) : (
              <span>SAR {ReportData?.opining} </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>Deliveries</span>
            {isPendingGenerateReport ? (
              <Skeleton className="w-[200px] text-right h-[20px] mb-2" />
            ) : (
              <span>SAR {ReportData?.delivery?.toLocaleString()} </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>Transfers</span>
            {isPendingGenerateReport ? (
              <Skeleton className="w-[200px] text-right h-[20px] mb-2" />
            ) : (
              <span>SAR {ReportData?.transfer?.toLocaleString()} </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>Ending inventory</span>
            {isPendingGenerateReport ? (
              <Skeleton className="w-[200px] text-right h-[20px] mb-2" />
            ) : (
              <span>SAR {ReportData?.closed?.toLocaleString()} </span>
            )}
          </div>
          <Accordion type="single" collapsible className="w-full ">
            <AccordionItem value={`item`} className="border-none ">
              <div className="flex items-center justify-between ">
                <AccordionTrigger className="justify-start gap-1 p-0 font-semibold capitalize text-textPrimary">
                  Cost of goods
                </AccordionTrigger>
                <span className="font-semibold text-textPrimary">
                  {isPendingGenerateReport ? (
                    <Skeleton className="w-[200px] text-right h-[20px] mb-2" />
                  ) : (
                    `SAR ${ReportData?.costOfGoodsActual?.toLocaleString()}`
                  )}
                </span>
              </div>
              <AccordionContent className="flex flex-col gap-4 pb-0 mt-4 text-textPrimary">
                {isPendingGenerateReport ? (
                  <Skeleton className="w-[200px] text-right h-[20px] mb-2" />
                ) : (
                  Object.entries(ReportData?.data?.costOfGoodsActual)?.map(
                    ([key, value]: any) => (
                      <div className="flex items-center justify-between">
                        <span className="w-[350px]">{key}</span>

                        <span>{value?.total_sales_percentage}%</span>

                        <span className="w-[120px] flex justify-end ">
                          SAR {value?.total_sales?.toLocaleString()}
                        </span>
                      </div>
                    )
                  )
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Actual vs target */}
      <div className="border border-gray-400 rounded-sm">
        <h4 className="text-[20px] py-[11px] px-2 border border-b-gray-400 font-semibold text-textPrimary">
          Actual vs target
        </h4>
        {ReportData?.unassigned_sales > 0 && (
          <CustomAlert
            className="mx-3"
            content={
              <p className="tracking-wider">
                Forecast calculates your GP% and COGS based on POS sales
                assigned to recipes.SAR{" "}
                {ReportData?.unassigned_sales?.toLocaleString()} in sales still
                need to be assigned.{" "}
                <Link
                  to={`/insights/sales?filter[branch]=${branchId}&${DEFAULT_INSIGHTS_DATE}`}
                  className="underline"
                >
                  You can do that on the POS IDs page.
                </Link>
              </p>
            }
            colorIcon="#FF0000"
            bgColor="bg-[#FED7D7]"
          />
        )}

        <div className="flex flex-col gap-4 p-4 text-textPrimary">
          {ActualVsTarget.map((item, index) =>
            item.type === "accordion" ? (
              <Accordion
                type="single"
                collapsible
                className="w-full "
                key={index}
              >
                <AccordionItem value={`item`} className="border-none ">
                  <div className="flex items-center justify-between">
                    <AccordionTrigger className="font-semibold capitalize   w-[200px] justify-start gap-1 p-0 text-textPrimary">
                      {item.title}
                    </AccordionTrigger>
                    <span className="font-semibold text-textPrimary">
                      {item.percentage}
                    </span>
                    <span className="text-textPrimary w-[200px] text-right font-semibold">
                      {isPendingGenerateReport ? (
                        <Skeleton className="w-[200px] text-right h-[20px] mb-2" />
                      ) : (
                        item.value
                      )}
                    </span>
                  </div>

                  <AccordionContent className="flex flex-col gap-4 pb-0 mt-4 text-textPrimary">
                    {item?.content?.map((content, index) => (
                      <div
                        className="flex items-center justify-between"
                        key={index}
                      >
                        <span className="w-[200px]">{content.label}</span>

                        <span>{content.percentage}</span>

                        <span className="w-[200px] text-right ">
                          {isPendingGenerateReport ? (
                            <Skeleton className="w-[200px] text-right h-[20px] mb-2" />
                          ) : (
                            content.value.toLocaleString()
                          )}
                        </span>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <div
                className={`flex ${
                  item?.show ? "" : "hidden"
                } justify-between items-center text-warn`}
                key={index}
              >
                <span>{item.title}</span>
                <span>{item.value.toLocaleString()}</span>
              </div>
            )
          )}
        </div>
      </div>

      <CustomModal
        descriptionModal={
          modalName === "delete" ? (
            <div className="flex flex-col gap-2">
              <span>This count will be deleted</span>
              <span>Count type: {type}</span>
              <span>Count status: {status}</span>
            </div>
          ) : (
            "You should save your count first. If you exit now, you'll lose what you've counted so far."
          )
        }
        headerModal={
          modalName === "delete"
            ? "Delete count"
            : "Are you sure you want to stop counting"
        }
        modalName={modalName}
        modalWidth="w-[466px]"
        isPending={isPendingDelete}
        setModalName={setModalName}
        confirmbtnText={
          modalName === "delete" ? "Delete count" : "Stop counting"
        }
        handleConfirm={handleConfirm}
      />
    </>
  );
};

export default ManagementReport;
