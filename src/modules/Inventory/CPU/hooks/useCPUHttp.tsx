import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formCPUschema } from "../Schema/Schema";
import { z } from "zod";
import axios from "axios";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useDefaultBranch } from "@/hooks/useBranch";
import { ICpuBranchesPivot, ICpuOne, ICpuOrderRules } from "../types/types";

interface IUseCPUHttp {
  handleCloseSheet?: () => void;
  CPUId?: string;
  setCPUOne?: (data: ICpuOne) => void;
}
//create CPU
const useCPUHttp = ({ handleCloseSheet, setCPUOne, CPUId }: IUseCPUHttp) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();
  const queryClient = useQueryClient();

  //get All
  const {
    data: CPUData,
    isLoading,
    refetch: refetchCPU,
  } = useCustomQuery(
    ["cpus", filterObj],
    `/forecast-console/cpus`,
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
  // create CPU
  const { mutate: CreateCPU, isPending } = useMutation({
    mutationKey: ["CPU/create"],
    mutationFn: async (values: z.infer<typeof formCPUschema>) => {
      return axiosInstance.post("forecast-console/cpus", values);
    },
    onSuccess: () => {
      toast({
        description: "Cpu created successfully",
      });
      refetchCPU();
      handleCloseSheet?.();
    },
    onError: (error: { data: { message: string } }) => {
      toast({
        description: error?.data?.message,
      });
    },
  });

  // delete item
  const { mutate: DeleteCPU, isPending: isPendingDelete } = useMutation({
    mutationKey: ["cpus/delete"],
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`forecast-console/cpus/${id}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchCPU();
      handleCloseSheet?.();
    },
  });
  //get one
  const { data: CPU, isFetching: isPendingOne } = useCustomQuery(
    ["cpuId", CPUId ?? ""],
    `forecast-console/cpus/${CPUId ?? ""}`,
    {
      enabled: !!CPUId,
      onSuccess: (data) => {
        setCPUOne?.({
          name: data?.data?.name,
          primary_email: data?.data?.primary_email,
          accept_price_change: data?.data?.accept_price_change,
          max_order: data?.data?.max_order,
          min_order: data?.data?.min_order,
          phone: data?.data?.phone,
          comment: data?.data?.comment,
          branch_id: data?.data?.branch_id,

          branches: data?.data?.branches?.map((b: ICpuBranchesPivot) => ({
            id: b?.id,
            name: b?.name,
            cc_email: b?.pivot?.cc_email || null,
            customer_code: +b?.pivot?.customer_code || null,
            order_rules: b?.pivot?.order_rules?.map((e: ICpuOrderRules) => ({
              order_day: e?.order_day,
              delivery_day: e?.delivery_day,
              order_time: e?.order_time,
            })),
          })),
        });
      },
    }
  );

  //edit
  const { mutate: EditCPU, isPending: isPendingEdit } = useMutation({
    mutationKey: ["CPU/edit"],
    mutationFn: async ({
      CPUId,
      values,
    }: {
      CPUId: string;
      values: z.infer<typeof formCPUschema>;
    }) => {
      return axiosInstance.put(`forecast-console/cpus/${CPUId}`, {
        ...values,
      });
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      handleCloseSheet?.();
      queryClient.invalidateQueries({ queryKey: ["cpus"] });
      refetchCPU();
    },

    onError: (error: { data: { message: string } }) => {
      toast({
        description: error.data.message,
      });
    },
  });

  // export
  const { mutate: CPUExport, isPending: isPendingExport } = useMutation({
    mutationKey: ["cpus/export"],
    mutationFn: async () => {
      return axiosInstance.post("/forecast-console/cpus/export-bulk");
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      window.open(data?.data.url, "_blank");
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
    CPUData,
    isLoading,
    CreateCPU,
    DeleteCPU,
    EditCPU,
    isPending,
    isPendingDelete,
    CPU,
    isPendingEdit,
    isPendingOne,
    CPUExport,
    isPendingExport,
  };
};

export default useCPUHttp;
