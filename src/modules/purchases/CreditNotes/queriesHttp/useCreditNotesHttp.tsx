import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useDefaultBranch } from "@/hooks/useBranch";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreditNotesHttp = ({ invoiceId }: { invoiceId?: string }) => {
  const { filterObj } = useFilterQuery();

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: CreditNotesData, isLoading: isFetchingCreditNotes } =
    useCustomQuery(
      ["forecast-console/credit-notice", filterObj],
      "forecast-console/credit-notice",
      {},
      {
        ...useDefaultBranch(),
        ...(() => {
          const newFilterObj = { ...filterObj };
          delete newFilterObj["filter[branch]"];
          return newFilterObj;
        })(),
      }
    );

  const { data: invoiceData, isLoading: isFetchingOneInvoice } = useCustomQuery(
    [`forecast-console/invoice/${invoiceId}`, invoiceId || ""],
    `forecast-console/invoice/${invoiceId}`,
    {
      enabled: !!invoiceId,
    }
  );

  const { mutate: receiveCreditNotice, isPending: isLoadingReceive } =
    useMutation({
      mutationKey: ["forecast-console/credit-notice/receive"],
      mutationFn: async ({
        creditIds,
        recivedCheck,
      }: {
        creditIds: string[];
        recivedCheck?: boolean;
      }) => {
        const response = await axiosInstance.post(
          `forecast-console/credit-notice/${
            recivedCheck ? "receive" : "undo-receive"
          }`,
          {
            ids: creditIds,
          }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast({
          description: data?.message,
        });
        queryClient.invalidateQueries({
          queryKey: ["forecast-console/credit-notice", filterObj],
        });
      },
    });

  return {
    CreditNotesData,
    isFetchingCreditNotes,
    receiveCreditNotice,
    isLoadingReceive,
    invoiceData,
    isFetchingOneInvoice,
  };
};

export default useCreditNotesHttp;
