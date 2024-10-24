/* eslint-disable react-hooks/rules-of-hooks */
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import axiosInstance from "../interceptors";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";
import { useGlobalDialog } from "@/context/GlobalDialogProvider";

interface CrudService<T> {
  useGetAll: () => any;
  useGetById: (id: string) => any;
  useCreate: () => any;
  useUpdate: () => any;
  useRemove: () => any;
  useCreateById: () => any;
}
const showToast = (title: string, description?: string) => {
  toast({
    title: title,
    description: description,
    duration: 3000,
    variant: "default",
  });
};

const createCrudService = <T>(
  endpoint: string,
  filter = {} as any,
  page = 1,
  limit = 10
): CrudService<T> => {
  const queryClient: any = useQueryClient()
  const [searchParams] = useSearchParams()
  const { openDialog } = useGlobalDialog();

  const queryParams: { [key: string]: string | null } = {}
  searchParams.forEach((value, key) => {
    queryParams[key] = value
  })
  const useGetAll = () => {
    return useQuery<T[]>({
      queryKey: [endpoint, queryParams],
      queryFn: async () => {
        const response = await axiosInstance.get(endpoint, {
          params: {
            ...queryParams,
            ...filter,
          },
        })
        return response.data
      },
    })
  }

  const useGetById = (id: string) =>
    useQuery<T>({
      queryKey: [endpoint, id],
      queryFn: async () => {
        const response = await axiosInstance.get<T>(`${endpoint}/${id}`);
        return response.data;
      },
    });

  const useCreate = () =>
    useMutation<T, unknown, T>({
      mutationFn: async (data: T) => {
        const response = await axiosInstance.post<T>(endpoint, data);
        return response.data;
      },

      onSuccess: () => {
        // showToast("item created successfully");
        openDialog('added')
        queryClient.invalidateQueries([endpoint]);
      },
    });
  const useCreateById = () =>
    useMutation<T, unknown, T>({
      mutationFn: async ({data, id}:any) => {
        const response = await axiosInstance.post<T>(endpoint+`/${id}`, data);
        return response.data;
      },

      onSuccess: () => {
        // showToast("item created successfully");
        openDialog('added')
        queryClient.invalidateQueries([endpoint]);
      },
    });

  const useUpdate = () =>
    useMutation<T, unknown, { id: string; data: T }>({
      mutationFn: async ({ id, data }) => {
        const response = await axiosInstance.patch<T>(
          `${endpoint}/${id}`,
          data
        );
        return response.data;
      },

      onSuccess: () => {
        // showToast("item updated successfully");
        openDialog('updated')

        queryClient.invalidateQueries([endpoint]);
      },
    });

  const useRemove = () =>
    useMutation<void, unknown, string>({
      mutationFn: async ({ id }: any) => {
        await axiosInstance.delete(`${endpoint}/${id}`);
      },
      onSuccess: () => {
        // showToast("item deleted successfully");
        openDialog('deleted')

        queryClient.invalidateQueries([endpoint]);
      },
    });
  return { useGetAll, useGetById, useCreate, useUpdate, useRemove , useCreateById };
};

export default createCrudService;
