import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { formTransferSchema } from "../schema/Schema";
import { useDefaultBranch } from "@/hooks/useBranch";

interface UseTransferHttpProps {
  handleCloseSheet?: () => void;
  transferId?: string;
}

const useTransferHttp = ({
  handleCloseSheet,
  transferId,
}: UseTransferHttpProps) => {
  const { filterObj } = useFilterQuery();
  const { toast } = useToast();

  const {
    data: TransferSelect,
    refetch: refetchTransfers,
    isFetching: isFetching,
  } = useCustomQuery(
    ["forecast-console/transfer", filterObj],
    "forecast-console/transfer",
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

  const {
    data: TransferOne,
    isFetching: isFetchingOne,
    refetch: refetchOne,
  } = useCustomQuery(
    ["forecast-console/transfer/one", transferId || ""],
    `forecast-console/transfer/${transferId}`,
    {
      select: (data: any) => {
        console.log(data);

        const newDataFormat = {
          id: data?.data?.id,
          status: data?.data?.status,
          type: data?.data?.type,
          delivery_date: data?.data?.delivery_date,
          created_at: data?.data?.created_at,
          decline_reason: data?.data?.decline_reason,
          items: data?.data?.items?.map((e: any) => ({
            id: e?.id,
            name: e?.name,
            unit_cost: e?.unit_cost,
            total_cost: e?.pivot?.total_cost,
            pack_unit: e?.pack_unit,
            quantity: +e?.pivot?.quantity || 0,
            quantityOld: +e?.pivot?.quantity || 0,

            array_stock_counts: e?.pivot?.array_stock_counts?.map((a: any) => ({
              count: a.count,
              unit: a?.unit,
              quantity: a?.quantity,
              use_report: a?.use_report,
              cost: a?.cost,
              checked: a?.checked,
              report_preview: a?.report_preview,
              id: a?.id,
              show_as: a?.show_as,
            })),
          })),
          branch_id: data?.data?.branch?.id,
          branch_name: data?.data?.branch?.name,
          warehouse_id: data?.data?.warehouse?.id,
          warehouse_name: data?.data?.warehouse?.name,
          total_amount: 0,
        };

        return newDataFormat;
      },
      enabled: !!transferId,
    }
  );

  const { mutate: transferCreate, isPending: isLoadingCreate } = useMutation({
    mutationKey: ["transfer-create"],
    mutationFn: async (values: z.infer<typeof formTransferSchema>) => {
      return axiosInstance.post("forecast-console/transfer", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchTransfers();
      handleCloseSheet?.();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        });
      } else {
        toast({
          description: error.message,
        });
      }
    },
  });

  const { mutate: transferUpdate, isPending: isLoadingUpdate } = useMutation({
    mutationKey: ["transfer-update", transferId],
    mutationFn: async (values: z.infer<typeof formTransferSchema>) => {
      return axiosInstance.put(
        `forecast-console/transfer/${transferId}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchTransfers();
      refetchOne();
      handleCloseSheet?.();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        });
      } else {
        toast({
          description: error.message,
        });
      }
    },
  });

  return {
    TransferSelect,
    isFetching,
    transferCreate,
    isLoadingCreate,
    isFetchingOne,
    TransferOne,
    transferUpdate,
    isLoadingUpdate,
  };
};

export default useTransferHttp;
