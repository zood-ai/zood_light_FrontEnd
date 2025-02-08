import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useRequeststHttp = ({
  employeeId,
  handleCloseSheet,
  fromNavbar,
  branchId,
  requestid,
  getTotal,
}: {
  employeeId?: string;
  handleCloseSheet?: () => void;
  fromNavbar?: boolean;
  branchId?: string;
  requestid?: string;
  getTotal?: boolean;
}) => {
  const { filterObj } = useFilterQuery();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  // get all the data
  const { data: RequestsPendingCount, isFetching: isFetchingRequestsPending } =
    useCustomQuery(
      ["forecast-console/requests"],
      "forecast-console/requests",
      // {
      //   enabled: fromNavbar,
      // },
      {
        "filter[status]": "1",
        per_page: "1",
      }
    );

  const { data: RequestsData, isFetching: isFetchingRequests } = useCustomQuery(
    ["forecast-console/requests", filterObj],
    "forecast-console/requests",
    {},
    {
      "filter[status]": filterObj["filter[status]"],
      "timeoff_type ": filterObj["filter[type]"],
      ...(filterObj.group_by === "3"
        ? { open_change_tab: "1" }
        : { "filter[type]": filterObj.group_by }),
      page: filterObj.page,
    }
  );

  const { data: getOverlaps, isFetching: isFetchingOverlaps } = useCustomQuery(
    ["forecast-console/request-overlabs", requestid ?? ""],
    `forecast-console/request-overlabs/${requestid}`,
    {},
    {}
  );
  // // get request detials
  const { data: TotalRequests, isFetching: isTotalRequestsLoading } =
    useCustomQuery(
      ["forecast-console/requests-total"],
      "forecast-console/requests-total",
      {
        enabled: getTotal,
      }
    );

  // get request detials
  const { data: HolidayBalanceData, isFetching: isHolidayBalanceLoading } =
    useCustomQuery(
      [
        `forecast-console/requests-holiday`,
        { employeeId: employeeId ?? "", branchId: branchId ?? "" },
      ],
      `forecast-console/requests-holiday/${employeeId}/balance/${branchId}`,
      {
        enabled: !!employeeId && !!branchId,
      }
    );

  // approve
  const { mutate: approveRequest, isPending: isApproveRequest } = useMutation({
    mutationKey: ["forecast-console/requests/approver-action"],
    mutationFn: async ({
      requestId,
      status,
      data,
    }: {
      requestId: string;
      status: string;
      data?: { details?: any; replacement_id?: string };
    }) => {
      const response = await axiosInstance.post(
        `/forecast-console/requests/approver-action/${requestId}/${status}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      handleCloseSheet?.();

      queryClient.invalidateQueries({
        queryKey: ["forecast-console/requests", filterObj],
      });
      queryClient.invalidateQueries({
        queryKey: ["forecast-console/requests-total"],
      });
    },
    onError: ({ data }: { data: { message: string } }) => {
      toast({
        description: data?.message || "Something went wrong",
        // variant: "error",
      });
      handleCloseSheet?.();

      queryClient.invalidateQueries({
        queryKey: ["forecast-console/requests", filterObj],
      });
      queryClient.invalidateQueries({
        queryKey: ["forecast-console/requests-total"],
      });
    },
  });

  return {
    RequestsData,
    isFetchingRequests,

    // RequestData,
    // isFetchingRequest,

    approveRequest,
    isApproveRequest,

    RequestsPendingCount,
    isFetchingRequestsPending,

    HolidayBalanceData,
    isHolidayBalanceLoading,

    getOverlaps,
    isFetchingOverlaps,

    TotalRequests,
    isTotalRequestsLoading,
  };
};

export default useRequeststHttp;
