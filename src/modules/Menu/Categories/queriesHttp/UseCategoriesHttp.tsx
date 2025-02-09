import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { formCategoriesSchema } from "../Schema/Schema";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";

interface IUseCategoriesHttp {
  handleCloseSheet: () => void;
  IdCategory?: string;
}
const useCategoriesHttp = ({
  handleCloseSheet,
  IdCategory,
}: IUseCategoriesHttp) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  // get list
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useCustomQuery(
    ["meun-categories", filterObj],
    "/menu/categories",
    {},
    { ...filterObj }
  );

  // get one
  const {
    data: categoryOne,
    isLoading: isLoadingCategoryOne,
    refetch: refetchCategoryOne,
  } = useCustomQuery(
    ["meun-categories-one", IdCategory || ""],
    `/menu/categories/${IdCategory}`,
    {
      select: (data: {
        data: { name: string; id: string; image: string; reference: string };
      }) => {
        console.log(data, "datadata");

        const newDataFormat = {
          id: data?.data?.id,
          name: data?.data?.name,
          image: data?.data?.image,
          reference: data?.data?.reference,
        };
        return newDataFormat;
      },
      enabled: !!IdCategory,
    }
  );

  // create
  const { mutate: CreateCategory, isPending: loadingCreate } = useMutation({
    mutationKey: ["create-category"],
    mutationFn: async (values: z.infer<typeof formCategoriesSchema>) => {
      return axiosInstance.post("menu/categories", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.massage,
      });
      handleCloseSheet();
      refetchCategories();
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.massage,
      });
    },
  });

  // edit
  const { mutate: EditCategory, isPending: loadingEdit } = useMutation({
    mutationKey: ["edit-category", IdCategory],
    mutationFn: async (values: z.infer<typeof formCategoriesSchema>) => {
      return axiosInstance.put(`menu/categories/${IdCategory}`, values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.massage,
      });
      refetchCategories();
      refetchCategoryOne();
      handleCloseSheet();
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.massage,
      });
    },
  });

  // delete
  const { mutate: DeleteCategory, isPending: loadingDelete } = useMutation({
    mutationKey: ["delete-category", IdCategory],
    mutationFn: async () => {
      return axiosInstance.delete(`menu/categories/${IdCategory}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.massage,
      });
      refetchCategories();
      handleCloseSheet();
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.massage,
      });
    },
  });

  // export
  const { mutate: ExportCategory, isPending: loadingExport } = useMutation({
    mutationKey: ["export-category"],
    mutationFn: async () => {
      return axiosInstance.post(`export/categories`);
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
    isLoadingCategories,
    categoriesData,
    CreateCategory,
    loadingCreate,
    EditCategory,
    loadingEdit,
    DeleteCategory,
    loadingDelete,
    categoryOne,
    isLoadingCategoryOne,
    ExportCategory,
    loadingExport,
  };
};

export default useCategoriesHttp;
