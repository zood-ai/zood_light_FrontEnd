import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { ICountHeader, ICountItem } from "../types/types";
import axios from "axios";

interface IUseCountsHttp {
  nextStep?: (step: number, id: string) => void;
  branchId?: string;
  countId?: string;
  handleCloseSheet?: (openReport?: boolean) => void;
  setBussinessDate?: (date: string) => void;
  setModalName?: (name: string) => void;
  setOpenReport?: (open: boolean) => void;
  setGetReport?: (getReport: boolean) => void;
  getReport?: boolean;
  setFormData?: (data: any) => void;
  page?: string;
  setCountId?: (countId: string) => void;
  setIsFirst?: (isFirst: boolean) => void;
}
const useCountsHttp = ({
  nextStep,
  countId,
  handleCloseSheet,
  setBussinessDate,
  setModalName,
  setOpenReport,
  setGetReport,
  getReport,
  setFormData,
  page = "1",
  setIsFirst,

  setCountId,
}: IUseCountsHttp) => {
  const { filterObj } = useFilterQuery();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // get all counts
  const {
    data: CountsData,
    isFetching: isFetchingCounts,
    refetch: refetchCounts,
  } = useCustomQuery(
    ["inventory-counts", filterObj["filter[branch]"]],
    `forecast-console/inventory-counts`,
    {
      // enabled: !!branchId,
      onSuccess: (data) => {
        setBussinessDate?.(
          format(
            addDays(
              data?.data?.[0]?.business_date || new Date(),
              data?.data?.length > 0 ? 1 : 0
            ),
            "yyyy-MM-dd"
          )
        );
      },
    },
    {
      branch_id: filterObj["filter[branch]"],
      page: "1",
    }
  );

  // get one count
  const { data: countData, isLoading: isFetchingcount } = useCustomQuery(
    [`inventory-counts/getOne`, countId ?? ""],
    `forecast-console/inventory-counts/${countId}`,
    {
      enabled: !!countId && !getReport,
      onSuccess: (data) => {
        setFormData?.({
          business_date: data?.data?.business_date,
          type: data?.data?.type,
          day_option: data?.data?.day_option,
          items: data?.data?.items.map((item: any) => ({
            id: item.id,
            quantity: item?.pivot?.quantity,
            total_cost: item?.pivot?.total_cost,
            unit: item.pivot.unit,
            array_stock_counts: item?.pivot?.array_stock_counts?.map(
              (sc: any) => ({
                id: sc.id,
                quantity: sc.quantity,
                unit: sc.unit || "-",
                use_report: sc.use_report,
                item_id: sc.item_id,
                count: sc.count,
                checked: sc.checked,
                show_as: item.show_as,
                report_preview: sc.report_preview,
                cost: sc.cost,
              })
            ),
          })),
        });
      },
    }
  );

  // update count
  const { mutate: updateCounts, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["inventory-counts/update"],
    mutationFn: async ({ id, values }: { id: string; values: any }) => {
      const data = values.items.map((item: any) => {
        const calculatedQuantity = item?.array_stock_counts?.reduce(
          (acc: number, crr: ICountHeader["stockCounts"][0]) => {
            return acc + crr.quantity * crr.count;
          },
          0
        );

        const calculatedTotalCost = item.array_stock_counts.reduce(
          (sum: number, sc: any) => sum + sc.quantity * sc.cost,
          0
        );

        return {
          ...item,
          quantity: calculatedQuantity || item?.quantity,
          total_cost: calculatedTotalCost || item?.total_cost,
        };
      });

      const res = await axiosInstance.put(
        `forecast-console/inventory-counts/${id}`,
        {
          ...values,
          items: data,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.data?.status == 2) {
        setModalName?.("");
        setOpenReport?.(true);
        generateReport();

        setIsFirst?.(true);
        handleCloseSheet?.(true);
      } else {
        // setCountId?.("");
        handleCloseSheet?.();
      }

      toast({
        description: data?.message,
      });
      queryClient.invalidateQueries({
        queryKey: ["inventory-counts", filterObj["filter[branch]"] ?? ""],
      });
    },
  });

  // delete count
  const { mutate: deleteCount, isPending: isPendingDelete } = useMutation({
    mutationKey: ["delete-count"],
    mutationFn: async ({ id }: { id: string }) => {
      const res = await axiosInstance.delete(
        `forecast-console/inventory-counts/${id}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        description: data?.message,
      });

      refetchCounts();
      handleCloseSheet?.();
      setCountId?.("");
      setGetReport?.(false);
    },
    onMutate: async (data) => {
      queryClient.setQueryData(
        ["inventory-counts", filterObj["filter[branch]"]],
        (old: any) => old?.data?.filter((item) => item.id !== data?.id)
      );
    },
  });

  // create count
  const { mutate: createCount, isPending: isPendingCreate } = useMutation({
    mutationKey: ["forecast-console/counts"],
    mutationFn: async (values: {
      business_date: string;
      type: string;
      day_option: string;
      branch_id: string;
    }) => {
      const res = await axiosInstance.post(
        `forecast-console/inventory-counts`,
        values
      );
      return res.data;
    },
    onSuccess: async (data) => {
      setBussinessDate?.(
        format(addDays(data?.data?.business_date, 1), "yyyy-MM-dd")
      );
      nextStep?.(2, data?.data?.id);
      await queryClient.invalidateQueries({
        queryKey: ["inventory-counts", filterObj["filter[branch]"] || ""],
      });

      toast({
        description: data?.message,
      });
    },
    onError: (error) => {
      toast({
        description: error?.message,
      });
    },
  });

  // generate report
  const {
    data: ReportData,
    isFetching: isPendingGenerateReport,
    refetch: generateReport,
  } = useCustomQuery(
    ["forecast-console/generate-report", countId ?? ""],
    `forecast-console/inventory-count-report/${countId}`,
    {
      enabled: !!countId && (getReport || false),
      onSuccess: (data) => {
        setGetReport?.(false);
        queryClient.invalidateQueries({
          queryKey: [`inventory-counts/getOne`, countId ?? ""],
        });
        // toast({
        //   description: "Report generated successfully",
        // });
      },
    }
  );

  const { mutate: countReportExport, isPending: isPendingExport } = useMutation(
    {
      mutationKey: ["count/export", countId],
      mutationFn: async () => {
        return axiosInstance.get(
          `/forecast-console/inventory-count-report/${countId}/export`
        );
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
    }
  );

  return {
    CountsData,
    isFetchingCounts,
    countData,
    isFetchingcount,
    deleteCount,
    isPendingDelete,
    updateCounts,
    isPendingUpdate,
    createCount,
    isPendingCreate,
    ReportData,
    isPendingGenerateReport,
    generateReport,
    countReportExport,
    isPendingExport,
  };
};

export default useCountsHttp;
