import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IPaymentMethods } from "../types/types";

interface IUsePaymentMethodsHttps {
  handleCloseSheet?: () => void;
  PaymentMethodId?: string;
  setPaymentMethodOne?: any;
}
const usePaymentMethodsHttps = ({
  handleCloseSheet,
  PaymentMethodId,
  setPaymentMethodOne,
}: IUsePaymentMethodsHttps) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  const queryClient = useQueryClient();

  // get list
  const { data: PaymentMethodsData, isLoading: isLoadingPaymentMethods } =
    useCustomQuery(
      ["payment-Methods", filterObj],
      "/manage/payment_methods?filter[is_deleted]=false",
      {},
      { ...filterObj }
    );

  // create
  const {
    mutate: createPatmentMethods,
    isPending: isLoadingCreatePatmentMethods,
  } = useMutation({
    mutationKey: ["create-PaymentMethod"],
    mutationFn: async (values: IPaymentMethods) => {
      return axiosInstance.post("/manage/payment_methods", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      handleCloseSheet?.();
      queryClient.invalidateQueries({ queryKey: ["payment-Methods"] });
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

  // edit
  const { mutate: editPaymentMethod, isPending: isLoadingEditPaymentMethod } =
    useMutation({
      mutationKey: ["edit-PaymentMethod"],
      mutationFn: async (values: IPaymentMethods) => {
        return axiosInstance.put(
          `/manage/payment_methods/${PaymentMethodId}`,
          values
        );
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        handleCloseSheet?.();
        queryClient.invalidateQueries({ queryKey: ["payment-Methods"] });
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

  // delete
  const {
    mutate: deletePaymentMethod,
    isPending: isLoadingDeletePaymentMethod,
  } = useMutation({
    mutationKey: ["delete-PaymentMethod"],
    mutationFn: async () => {
      return axiosInstance.delete(`/manage/payment_methods/${PaymentMethodId}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      handleCloseSheet?.();
      queryClient.invalidateQueries({ queryKey: ["payment-Methods"] });
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
    isLoadingPaymentMethods,
    PaymentMethodsData,
    isLoadingCreatePatmentMethods,
    createPatmentMethods,
    editPaymentMethod,
    isLoadingEditPaymentMethod,

    deletePaymentMethod,
    isLoadingDeletePaymentMethod,
  };
};

export default usePaymentMethodsHttps;
