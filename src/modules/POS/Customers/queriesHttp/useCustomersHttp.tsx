import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";
import { formCustomersSchema } from "../schema/Schema";

interface IUseCustomersHttp {
  handleCloseSheet: () => void;
  CustomerId?: string;
}
const useCustomersHttp = ({
  handleCloseSheet,
  CustomerId,
}: IUseCustomersHttp) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  // get list
  const {
    data: CustomersData,
    isLoading: isLoadingCustomers,
    refetch: refetchCustomers,
  } = useCustomQuery(
    ["Customers", filterObj],
    "manage/customers",
    {},
    { ...filterObj }
  );

  // get one
  const {
    data: CustomersOne,
    isFetching: isLoadingCustomersOne,
    refetch: refetchCustomersOne,
  } = useCustomQuery(
    ["Customers-one", CustomerId || ""],
    `manage/customers/${CustomerId}`,
    {
      select: (data: {
        data: {
          name: string;
          id: string;
          phone: string;
          notes: string;
          email: string;
          birth_date: string;
          gender: string;
          house_account_limit: number;
          is_blacklisted: number;
          is_loyalty_enabled: number;
        };
      }) => {
        const newDataFormat = {
          id: data?.data?.id,
          name: data?.data?.name,
          phone: data?.data?.phone,
          notes: data?.data?.notes || "",
          email: data?.data?.email || "",
          birth_date: data?.data?.birth_date || "",
          gender: data?.data?.gender || "",
          house_account_limit: data?.data?.house_account_limit || 0,
          is_blacklisted: data?.data?.is_blacklisted || 0,
          is_loyalty_enabled: data?.data?.is_loyalty_enabled || 0,
        };
        return newDataFormat;
      },
      enabled: !!CustomerId,
    }
  );

  // create
  const { mutate: CreateCustomers, isPending: loadingCreate } = useMutation({
    mutationKey: ["create-Customers"],
    mutationFn: async (values: z.infer<typeof formCustomersSchema>) => {
      return axiosInstance.post("manage/customers", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      handleCloseSheet();
      refetchCustomers();
    },
    onError: (data: any) => {
      toast({
        description: data?.response?.data?.message,
      });
    },
  });

  // edit
  const { mutate: EditCustomers, isPending: loadingEdit } = useMutation({
    mutationKey: ["edit-Customers", CustomerId],
    mutationFn: async (values: z.infer<typeof formCustomersSchema>) => {
      return axiosInstance.put(`manage/customers/${CustomerId}`, values);
    },
    onSuccess: (data) => {
      toast({
        description: "Customer updated Successfully",
      });
      refetchCustomers();
      handleCloseSheet();
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.message,
      });
    },
  });

  // delete
  const { mutate: DeleteCustomers, isPending: loadingDelete } = useMutation({
    mutationKey: ["delete-Customers", CustomerId],
    mutationFn: async () => {
      return axiosInstance.delete(`manage/customers/${CustomerId}`);
    },
    onSuccess: (data) => {
      toast({
        description: "Customer deleted Successfully",
      });
      refetchCustomers();
      handleCloseSheet();
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.message,
      });
    },
  });

  // export
  const { mutate: ExportCustomers, isPending: loadingExport } = useMutation({
    mutationKey: ["export-Customers"],
    mutationFn: async () => {
      return axiosInstance.post(`export/Customers`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.massage,
      });
      console.log(data, "data");

      window.open(data?.data?.data?.url);
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.massage,
      });
    },
  });

  return {
    isLoadingCustomers,
    CustomersData,
    CreateCustomers,
    loadingCreate,
    EditCustomers,
    loadingEdit,
    DeleteCustomers,
    loadingDelete,
    CustomersOne,
    isLoadingCustomersOne,
    ExportCustomers,
    loadingExport,
  };
};

export default useCustomersHttp;
