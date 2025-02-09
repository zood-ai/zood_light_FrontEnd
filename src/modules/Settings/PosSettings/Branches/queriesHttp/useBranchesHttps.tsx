import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { formBranchesSchema } from "../Schema/schema";
import { useState } from "react";

interface IUseBranchesHttps {
  handleCloseSheet?: () => void;
  branchId?: string;
  setBranchOne?: any;
  setReference?: (value: string) => void;
}
const useBranchesHttps = ({
  handleCloseSheet,
  branchId,
  setBranchOne,
  setReference,
}: IUseBranchesHttps) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  const queryClient = useQueryClient();

  // get list
  const {
    data: BranchesData,
    isLoading: isLoadingBranches,
    refetch: refetchBranches,
  } = useCustomQuery(
    ["branches", filterObj],
    "/manage/branches?include[0]=tax_group&page=1",
    {},
    { ...filterObj }
  );

  // get one

  const { data: BrancheOne, isLoading: isLoadingBrancheOne } = useCustomQuery(
    ["branche-one", branchId || ""],
    `/manage/branches/${branchId}`,
    {
      select: (data: any) => {
        const newData = {
          name: data?.data?.name,
          id: data?.data?.id,
          name_localized: data?.data?.name_localized,
          opening_from: data?.data?.opening_from,
          opening_to: data?.data?.opening_to,
          inventory_end_of_day_time: data?.data?.inventory_end_of_day_time,
          reference: data?.data?.reference,
          tax_group_id: data?.data?.tax_group?.id,
          phone: +data?.data?.phone,
          address: data?.data?.address,
          receipt_footer: data?.data?.receipt_footer,
          receipt_header: data?.data?.receipt_header,
          devices: data?.data?.devices?.map((d: any) => ({
            name: d?.name,
            type: d?.type,
            in_use: d?.in_use,
            reference: d?.reference,
          })),

          tax_name: data?.data?.tax_name,
          tax_number: data?.data?.tax_number,
          latitude: +data?.data?.latitude,
          longitude: +data?.data?.longitude,
          image: data?.data?.image,
          users: data?.data?.users?.map((d: any) => ({
            id: d?.id,
          })),
          tags: data?.data?.tags?.map((d: any) => ({
            id: d?.id,
            name: d?.name,
          })),
        };
        return newData;
      },
      enabled: !!branchId,
      onSuccess: (data) => {
        setBranchOne?.({
          name: data?.data?.name,
          id: data?.data?.id,
          name_localized: data?.data?.name_localized,
          opening_from: data?.data?.opening_from,
          opening_to: data?.data?.opening_to,
          inventory_end_of_day_time: data?.data?.inventory_end_of_day_time,
          reference: data?.data?.reference,
          tax_group_id: data?.data?.tax_group?.id,
          phone: +data?.data?.phone,
          address: data?.data?.address,
          receipt_footer: data?.data?.receipt_footer,
          receipt_header: data?.data?.receipt_header,
          devices: data?.data?.devices?.map((d: any) => ({
            name: d?.name,
            type: d?.type,
            in_use: d?.in_use,
            reference: d?.reference,
          })),

          tax_name: data?.data?.tax_name,
          tax_number: data?.data?.tax_number,
          latitude: +data?.data?.latitude,
          longitude: +data?.data?.longitude,
          image: data?.data?.image,
          users: data?.data?.users?.map((d: any) => ({
            id: d?.id,
          })),
          tags: data?.data?.tags?.map((d: any) => ({
            id: d?.id,
            name: d?.name,
          })),
        });
      },
    }
  );
  // create
  const { mutate: branchCreate, isPending: isLoadingCreate } = useMutation({
    mutationKey: ["branch-create"],
    mutationFn: async (values: z.infer<typeof formBranchesSchema>) => {
      return axiosInstance.post("/manage/branches", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchBranches();
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
  // generate
  const { mutate: generateRef, isPending: isLoadingGenerate } = useMutation({
    mutationKey: ["geanrate-sku"],
    mutationFn: async () => {
      return axiosInstance.post("/manage/generate_reference", {
        model: "branches",
      });
    },
    onSuccess: (data) => {
      setReference?.(data?.data?.data?.toString());
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
  const { mutate: branchEdit, isPending: isLoadingEdit } = useMutation({
    mutationKey: ["branch-edit", branchId],
    mutationFn: async (values: z.infer<typeof formBranchesSchema>) => {
      return axiosInstance.put(`/manage/branches/${branchId}`, values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchBranches();
      handleCloseSheet?.();

      queryClient.invalidateQueries({ queryKey: ["branche-one"] });
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
  const { mutate: branchDelete, isPending: isLoadingDelete } = useMutation({
    mutationKey: ["branch-warn", branchId],
    mutationFn: async () => {
      return axiosInstance.delete(`/manage/branches/${branchId}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchBranches();
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

  // delete order
  const { mutate: branchDeleteOrder, isPending: isLoadingDeleteOrder } =
    useMutation({
      mutationKey: ["branch-warn-order", branchId],
      mutationFn: async () => {
        return axiosInstance.delete(`/manage/branches/${branchId}/orders`);
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        refetchBranches();
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

  // delete transaction
  const {
    mutate: branchDeleteTransaction,
    isPending: isLoadingDeleteTransaction,
  } = useMutation({
    mutationKey: ["branch-warn-Transaction", branchId],
    mutationFn: async () => {
      return axiosInstance.delete(`/manage/branches/${branchId}/transactions`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchBranches();
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
    isLoadingBranches,
    BranchesData,
    isLoadingCreate,
    branchCreate,
    isLoadingGenerate,
    generateRef,

    branchEdit,
    isLoadingEdit,
    BrancheOne,
    isLoadingBrancheOne,
    isLoadingDelete,
    branchDelete,
    isLoadingDeleteOrder,
    branchDeleteOrder,
    branchDeleteTransaction,
    isLoadingDeleteTransaction,
  };
};

export default useBranchesHttps;
