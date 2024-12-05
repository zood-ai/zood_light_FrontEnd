import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useDefaultBranch } from "@/hooks/useBranch";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useWasteHttp = ({
  wasteId,
  handleClose,
  setWasteOne,
}: {
  wasteId?: any;
  handleClose?: () => void;
  setWasteOne?: any;
}) => {
  const { filterObj } = useFilterQuery();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: WastesData,
    isPending: isFetchingWastes,
    refetch: refetchWastes,
  } = useCustomQuery(
    ["forecast-console/waste", filterObj],
    `forecast-console/item-wastes`,
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

  const { data: WastesDataOne, isFetching: isFetchingWastesOne } =
    useCustomQuery(
      ["forecast-console/waste/one", wasteId],
      `/forecast-console/item-wastes/${wasteId}`,
      {
        select: (data: any) => {
          const newDataFormat = {
            id: data?.data?.item?.id,
            name: data?.data?.item.name,
            unit: data?.data?.item?.unit,
            total_cost: data?.data?.total_cost,
            quantity: +data?.data?.quantity,
            business_date: data?.data?.business_date,
            array_stock_counts: data?.data?.array_stock_counts,
            reason: data?.data?.reason?.id,
            cost: data?.data?.item?.cost,
          };
          return newDataFormat;
        },

        enabled: !!wasteId,
        onSuccess: (data) => {
          setWasteOne?.({
            id: data?.data?.item?.id,
            name: data?.data?.item.name,
            unit: data?.data?.item?.unit,
            total_cost: data?.data?.total_cost,
            quantity: +data?.data?.quantity,
            business_date: data?.data?.business_date,
            array_stock_counts: data?.data?.array_stock_counts,
            reason: data?.data?.reason?.id,
            cost: data?.data?.item?.cost,
          });
        },
      }
    );

  const { mutate: wasteUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["waste/update", wasteId],
    mutationFn: async (values) => {
      return axiosInstance.put(
        `/forecast-console/item-wastes/${wasteId}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        description: "Log Updated Successfully",
      });
      refetchWastes();
      handleClose?.();
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

  const { mutate: wasteCreate, isPending: isPendingCreate } = useMutation({
    mutationKey: ["waste/Create"],
    mutationFn: async (values: any) => {
      return axiosInstance.post(`/forecast-console/item-wastes`, values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      handleClose?.();
      refetchWastes();
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
  const { mutate: wasteDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ["waste/delete", wasteId],
    mutationFn: async () => {
      return axiosInstance.delete(`/forecast-console/item-wastes/${wasteId}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchWastes();
      handleClose?.();
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
  const { mutate: wasteDownload, isPending: isPendingDownload } = useMutation({
    mutationKey: ["waste/Download", wasteId],
    mutationFn: async () => {
      return axiosInstance.get(
        `/forecast-console/item-wastes-download?branch_id=${filterObj["filter[branch]"]}`
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
  });

  return {
    WastesData,
    isFetchingWastes,
    wasteUpdate,
    isPendingUpdate,
    WastesDataOne,
    isFetchingWastesOne,
    wasteDelete,
    isPendingDelete,
    wasteDownload,
    isPendingDownload,
    wasteCreate,
    isPendingCreate,
  };
};

export default useWasteHttp;
