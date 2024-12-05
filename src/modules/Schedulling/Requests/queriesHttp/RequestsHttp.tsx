import axiosInstance from "@/guards/axiosInstance";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useRequeststHttp = ({
  employeeId,
  handleCloseSheet,
  fromNavbar,
}: {
  employeeId?: string;
  handleCloseSheet?: () => void;
  fromNavbar?: boolean;
}) => {
  const { filterObj } = useFilterQuery();

  // const { toast } = useToast();

  const queryClient = useQueryClient();

  // get all the data
  const { data: RequestsPendingCount, isFetching: isFetchingRequestsPending } =
    useCustomQuery(
      ["forecast-console/requests"],
      "forecast-console/requests",
      {
        enabled: fromNavbar,
      },
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
      "filter[type]": filterObj.group_by,
    }
  );
  // get request detials
  const { data: RequestData, isFetching: isFetchingRequest } = useCustomQuery(
    ["forecast-console//requests", filterObj],
    "forecast-console/requests",
    {
      enabled: !!employeeId,
    },
    {
      "filter[employee_id]": employeeId ?? "",
    }
  );

  // approve
  const { mutate: approveRequest, isPending: isApproveRequest } = useMutation({
    mutationKey: ["forecast-console/requests/approver-action"],
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: number;
      status: string;
    }) => {
      const response = await axiosInstance.post(
        `/forecast-console/requests/approver-action/${requestId}/${status}`
      );
      return response.data;
    },
    onSuccess: () => {
      handleCloseSheet?.();

      queryClient.invalidateQueries({
        queryKey: ["forecast-console/requests", filterObj],
      });
    },
  });

  return {
    RequestsData,
    isFetchingRequests,

    RequestData,
    isFetchingRequest,

    approveRequest,
    isApproveRequest,

    RequestsPendingCount,
    isFetchingRequestsPending,
  };
};

export default useRequeststHttp;
