import useCustomQuery from "@/hooks/useCustomQuery";
import { useMutation } from "@tanstack/react-query";
import { formStorageareaSchema } from "../schema/Schema";
import axiosInstance from "@/guards/axiosInstance";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import axios from "axios";
import { useDefaultBranch } from "@/hooks/useBranch";

interface IUseStorageAreasHttp {
  handleCloseSheet: () => void;
}
const useStorageAreasHttp = ({ handleCloseSheet }: IUseStorageAreasHttp) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  // get storage area
  const {
    data: storageAreasData,
    refetch: refetchStorageAreas,
    isFetching: isLoadingStorageAreas,
  } = useCustomQuery(
    ["storage-areas", filterObj],
    "forecast-console/storage-areas",
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

  // creeate storage area
  const { mutate: CreateStorageArea, isPending: loadingCreate } = useMutation({
    mutationKey: ["storage-areas"],
    mutationFn: async (values: z.infer<typeof formStorageareaSchema>) => {
      return axiosInstance.post("forecast-console/storage-areas", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchStorageAreas();
      handleCloseSheet();
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        });
      } else {
        toast({
          description: error?.data?.message,
        });
      }
    },
  });

  // delete storage area
  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ["storage-areas/delete"],
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`forecast-console/storage-areas/${id}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchStorageAreas();
      handleCloseSheet();
    },
  });

  // edit storage area
  const { mutate: mutateEdit, isPending: isPendingEdit } = useMutation({
    mutationKey: ["storage-areas/edit"],
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      return axiosInstance.put(`forecast-console/storage-areas/${id}`, {
        name,
      });
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchStorageAreas();
      handleCloseSheet();
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.message,
        });
      } else {
        toast({
          description: error?.data?.message,
        });
      }
    },
  });

  return {
    CreateStorageArea,
    mutateDelete,
    mutateEdit,
    refetchStorageAreas,
    isLoadingStorageAreas,
    loadingCreate,
    isPendingDelete,
    isPendingEdit,
    storageAreasData,
  };
};

export default useStorageAreasHttp;
