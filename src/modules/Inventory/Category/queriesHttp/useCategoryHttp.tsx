import { useToast } from "@/components/ui/use-toast";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/guards/axiosInstance";
import { z } from "zod";
import useCustomQuery from "@/hooks/useCustomQuery";
import { formCategorySchema } from "../schema/Schema";

type Icategory = {
  handleCloseSheet?: () => void;
  setReference?: (value: string) => void;
};
const useCategoryHttp = ({ handleCloseSheet, setReference }: Icategory) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  const { data, refetch, isLoading } = useCustomQuery(
    ["categories", filterObj],
    `/inventory/inventory-categories`,
    {},
    filterObj
  );
  const { mutate: Createcategory, isPending } = useMutation({
    mutationKey: ["category"],
    mutationFn: async (values: z.infer<typeof formCategorySchema>) => {
      return axiosInstance.post("/inventory/inventory-categories", values);
    },
    onSuccess: (data) => {
      toast({
        description: "Inventory Category created Successfully",
      });

      handleCloseSheet?.();
      refetch();
    },
    onError: (data: any) => {
      console.log(data?.data?.massage);

      toast({
        description: data?.data?.massage,
      });

      refetch();
    },
  });

  const { mutate: mutateEdit, isPending: isPendingEdit } = useMutation({
    mutationKey: ["category/edit"],
    mutationFn: async (values: z.infer<typeof formCategorySchema>) => {
      return axiosInstance.put(
        `/inventory/inventory-categories/${values.id}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetch();
      handleCloseSheet?.();
    },
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ["category/delete"],
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`/inventory/inventory-categories/${id}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetch();
      handleCloseSheet?.();
    },
  });

  const { mutate: createReference, isPending: isPendingReference } =
    useMutation({
      mutationKey: ["category"],
      mutationFn: async () => {
        return axiosInstance.post("manage/generate_reference", {
          model: "branches",
        });
      },
      onSuccess: (data) => {
        setReference?.(data?.data?.data?.toString());
      },
    });

  return {
    Createcategory,
    mutateEdit,
    mutateDelete,
    isPendingDelete,
    isLoading,
    isPending,
    isPendingEdit,
    createReference,
    data,
    isPendingReference,
  };
};

export default useCategoryHttp;
