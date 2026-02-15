import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axiosInstance from '../interceptors';
import { toast } from '@/components/ui/use-toast';
import { useSearchParams } from 'react-router-dom';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';

interface CrudService<T> {
  useGetAll: () => any;
  useGetById: (id: string) => any;
  useGetByFillter: (filter: string) => any;
  useCreate: () => any;
  useUpdate: () => any;
  useRemove: () => any;
  useCreateById: () => any;
  useCreateNoDialog: () => any;
  useUpdateNoDialog: () => any;
}
const showToast = (title: string, description?: string) => {
  toast({
    title: title,
    description: description,
    duration: 3000,
    variant: 'default',
  });
};

const createCrudService = <T>(
  endpoint: string,
  filter = {} as any,
  page = 1,
  limit = 10
): CrudService<T> => {
  const useGetAll = () => {
    const [searchParams] = useSearchParams();
    const queryParams: { [key: string]: string | null } = {};
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    return useQuery<T[]>({
      queryKey: [endpoint, queryParams],
      queryFn: async () => {
        const response = await axiosInstance.get(endpoint, {
          params: {
            ...queryParams,
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
  const useGetByFillter = (filter: string) =>
    useQuery<T>({
      queryKey: [endpoint, filter],
      queryFn: async () => {
        const response = await axiosInstance.get<T>(`${endpoint}?${filter}`);
        return response.data;
      },
    });

  const useCreate = () =>
    ((queryClient: any, openDialog: (type: string) => void) =>
    useMutation<T, unknown, T>({
      mutationFn: async (data: T) => {
        const response = await axiosInstance.post<T>(endpoint, data);
        return response.data;
      },

      onSuccess: () => {
        // showToast("item created successfully");
        openDialog('added');
        queryClient.invalidateQueries([endpoint]);
      },
    }))(useQueryClient(), useGlobalDialog().openDialog);
  const useCreateNoDialog = () =>
    ((queryClient: any) =>
    useMutation<T, unknown, T>({
      mutationFn: async (data: T) => {
        const response = await axiosInstance.post<T>(endpoint, data);
        return response.data;
      },

      onSuccess: () => {
        // showToast("item created successfully");
        // openDialog('added')
        queryClient.invalidateQueries([endpoint]);
      },
    }))(useQueryClient());
  const useCreateById = () =>
    ((queryClient: any, openDialog: (type: string) => void) =>
    useMutation<T, unknown, T>({
      mutationFn: async ({ data, id }: any) => {
        const response = await axiosInstance.post<T>(endpoint + `/${id}`, data);
        return response.data;
      },

      onSuccess: () => {
        // showToast("item created successfully");
        openDialog('added');
        queryClient.invalidateQueries([endpoint]);
      },
    }))(useQueryClient(), useGlobalDialog().openDialog);

  const useUpdate = () =>
    ((queryClient: any, openDialog: (type: string) => void) =>
    useMutation<T, unknown, { id: string; data: T }>({
      mutationFn: async ({ id, data }) => {
        const response = await axiosInstance.put<T>(`${endpoint}/${id}`, data);
        return response.data;
      },

      onSuccess: () => {
        // showToast("item updated successfully");
        openDialog('updated');

        queryClient.invalidateQueries([endpoint]);
      },
    }))(useQueryClient(), useGlobalDialog().openDialog);
  const useUpdateNoDialog = () =>
    ((queryClient: any) =>
    useMutation<T, unknown, { id: string; data: T }>({
      mutationFn: async ({ id, data }) => {
        const response = await axiosInstance.put<T>(`${endpoint}/${id}`, data);
        return response.data;
      },

      onSuccess: () => {
        // showToast("item updated successfully");
        // openDialog('updated')

        queryClient.invalidateQueries([endpoint]);
      },
    }))(useQueryClient());

  const useRemove = () =>
    ((queryClient: any, openDialog: (type: string) => void) =>
    useMutation<void, unknown, string>({
      mutationFn: async ({ id }: any) => {
        await axiosInstance.delete(`${endpoint}/${id}`);
      },
      onSuccess: () => {
        // showToast("item deleted successfully");
        openDialog('deleted');

        queryClient.invalidateQueries([endpoint]);
      },
    }))(useQueryClient(), useGlobalDialog().openDialog);
  return {
    useGetAll,
    useUpdateNoDialog,
    useGetById,
    useCreate,
    useUpdate,
    useRemove,
    useCreateById,
    useCreateNoDialog,
    useGetByFillter,
  };
};

export default createCrudService;
