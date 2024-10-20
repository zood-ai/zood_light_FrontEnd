/* eslint-disable react-hooks/rules-of-hooks */
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import axiosInstance from "../interceptors";
import { toast } from "@/components/ui/use-toast";

interface CrudService<T> {
  useGetAll: () => any;
  useGetById: (id: string) => any;
  useCreate: () => any;
  useUpdate: () => any;
  useRemove: () => any;
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
  const queryClient: any = useQueryClient();

  const useGetAll = () => {
    return useQuery<T[]>({
      queryKey: [endpoint, filter],
      queryFn: async () => {
        const response = await axiosInstance.get(endpoint, {
          params: {
            ...filter,
           
          },
        });
        return response.data;
      },
    });
  };

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
        showToast("item created successfully");

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
        showToast("item updated successfully");

        queryClient.invalidateQueries([endpoint]);
      },
    });

  const useRemove = () =>
    useMutation<void, unknown, string>({
      mutationFn: async ({ id }: any) => {
        await axiosInstance.delete(`${endpoint}?id=${id}`);
      },
      onSuccess: () => {
        showToast("item deleted successfully");

        queryClient.invalidateQueries([endpoint]);
      },
    });
  return { useGetAll, useGetById, useCreate, useUpdate, useRemove };
};

export default createCrudService;
