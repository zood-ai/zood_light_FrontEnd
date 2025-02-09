import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { formTaxesGroupSchema, formTaxesSchema } from "../Schema/schems";

interface IUseTaxesHttps {
  handleCloseSheet?: () => void;
  taxId?: string;
  taxGroupId?: string;
  setTaxOne?: any;
  setTaxGroupOne?: any;
}
const useTaxesHttps = ({
  handleCloseSheet,
  taxId,
  setTaxOne,
  setTaxGroupOne,
  taxGroupId,
}: IUseTaxesHttps) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  const queryClient = useQueryClient();

  // get list taxes
  const { data: TaxesData, isLoading: isLoadingTaxes } = useCustomQuery(
    ["taxes", filterObj],
    "/manage/taxes?filter[is_deleted]=false&include[]=tax_groups",
    {},
    { ...filterObj }
  );

  // get list tax groups
  const { data: TaxGroupsData, isLoading: isLoadingTaxGroups } = useCustomQuery(
    ["tax-groups", filterObj],
    "/manage/tax_groups?filter[is_deleted]=false&include[]=taxes",
    {},
    { ...filterObj }
  );

  // get one tax

  const { data: TaxOne, isLoading: isLoadingTaxOne } = useCustomQuery(
    ["tax-one", taxId || ""],
    `/manage/taxes/${taxId}`,
    {
      select: (data: any) => {
        const newData = {
          id: data?.data?.id,
          name: data?.data?.name,
          rate: +data?.data?.rate,
          applies_on_order_types: data?.data?.applies_on_order_types,
        };
        return newData;
      },
      enabled: !!taxId,
      onSuccess: (data) => {
        setTaxOne?.({
          name: data?.data?.name,
          id: data?.data?.id,
          name_localized: data?.data?.name_localized,
          rate: +data?.data?.rate,
          applies_on_order_types: data?.data?.applies_on_order_types,
        });
      },
    }
  );

  // get one taxgroup

  const { data: TaxGroupOne, isLoading: isLoadingTaxGroupOne } = useCustomQuery(
    ["tax-group-one", taxGroupId || ""],
    `/manage/tax_groups/${taxGroupId}`,
    {
      select: (data: any) => {
        const newData = {
          id: data?.data?.id,
          name: data?.data?.name,
          taxes: data?.data?.taxes?.map((tag: any) => {
            return {
              name: tag?.name,
              id: tag?.id,
            };
          }),
          reference: data?.data?.reference,
        };
        return newData;
      },
      enabled: !!taxGroupId,
      onSuccess: (data) => {
        setTaxGroupOne?.({
          name: data?.data?.name,
          id: data?.data?.id,
          name_localized: data?.data?.name_localized,
          taxes: data?.data?.taxes,
          reference: data?.data?.reference,
        });
      },
    }
  );
  //   create tax

  const { mutate: taxCreate, isPending: isLoadingCreate } = useMutation({
    mutationKey: ["create-tax"],
    mutationFn: async (values: z.infer<typeof formTaxesSchema>) => {
      return axiosInstance.post(`/manage/taxes`, values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      handleCloseSheet?.();
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
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

  //   edit tax

  const { mutate: taxEdit, isPending: isLoadingEdit } = useMutation({
    mutationKey: ["edit-tax", taxId],
    mutationFn: async (values: z.infer<typeof formTaxesSchema>) => {
      return axiosInstance.put(`/manage/taxes/${taxId}`, values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      handleCloseSheet?.();
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
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

  //   delete tax

  const { mutate: taxDelete, isPending: isLoadingDelete } = useMutation({
    mutationKey: ["delete-tax", taxId],
    mutationFn: async () => {
      return axiosInstance.delete(`/manage/taxes/${taxId}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      handleCloseSheet?.();
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
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

  //   create tax group

  const { mutate: taxGroupCreate, isPending: isLoadingCreateTaxGroup } =
    useMutation({
      mutationKey: ["create-tax-group"],
      mutationFn: async (values: z.infer<typeof formTaxesGroupSchema>) => {
        return axiosInstance.post(`/manage/tax_groups`, values);
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        handleCloseSheet?.();
        queryClient.invalidateQueries({ queryKey: ["tax-groups"] });
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

  // edit tax group
  const { mutate: taxGroupEdit, isPending: isLoadingEditTaxGroup } =
    useMutation({
      mutationKey: ["Edit-tax-group", taxGroupId],
      mutationFn: async (values: z.infer<typeof formTaxesGroupSchema>) => {
        return axiosInstance.put(`/manage/tax_groups/${taxGroupId}`, values);
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        handleCloseSheet?.();
        queryClient.invalidateQueries({ queryKey: ["tax-groups"] });
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

  // delete tax group
  const { mutate: taxGroupDelete, isPending: isLoadingDeleteTaxGroup } =
    useMutation({
      mutationKey: ["delete-tax-group", taxGroupId],
      mutationFn: async () => {
        return axiosInstance.delete(`/manage/tax_groups/${taxGroupId}`);
      },
      onSuccess: (data) => {
        toast({
          description: data?.data?.message,
        });
        handleCloseSheet?.();
        queryClient.invalidateQueries({ queryKey: ["tax-groups"] });
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
    TaxesData,
    isLoadingTaxes,
    TaxGroupsData,
    isLoadingTaxGroups,
    taxCreate,
    isLoadingCreate,
    taxEdit,
    isLoadingEdit,
    TaxOne,
    isLoadingTaxOne,
    isLoadingDelete,
    taxDelete,
    isLoadingCreateTaxGroup,
    taxGroupCreate,
    taxGroupEdit,
    isLoadingEditTaxGroup,
    TaxGroupOne,
    isLoadingTaxGroupOne,
    taxGroupDelete,
    isLoadingDeleteTaxGroup,
  };
};
export default useTaxesHttps;
