import useCustomQuery from "@/hooks/useCustomQuery";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/guards/axiosInstance";
import { formProductsSchema } from "../Schema/Schema";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import useFilterQuery from "@/hooks/useFilterQuery";

interface IUseProductsHttp {
  handleCloseSheet: () => void;
  IdProduct?: string;
  ResetForm: (data: any) => void;
}
const useProductsHttp = ({
  handleCloseSheet,
  IdProduct,
  ResetForm,
}: IUseProductsHttp) => {
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();

  // get list
  const {
    data: ProductsData,
    isFetching: isLoadingProducts,
    refetch: refetchProducts,
  } = useCustomQuery(
    ["meun-products", filterObj],
    "/forecast-console/forecast-products",
    {},
    { ...filterObj }
  );

  // get one
  const {
    data: ProductOne,
    isLoading: isLoadingProductOne,
    refetch: refetchProductOne,
  } = useCustomQuery(
    ["meun-Products-one", IdProduct || ""],
    `/forecast-console/forecast-products/${IdProduct}`,
    {
      enabled: !!IdProduct,
      onSuccess: (data) => {
        const newDataFormat = {
          id: data?.data?.id,
          name: data?.data?.name,
          name_localized: data?.data?.name_localized,
          sku: data?.data?.sku,
          price: data?.data?.price,
          tax_group_id: data?.data?.tax_group?.id,
          category_id: data?.data?.category?.id,
          image: data?.data?.image,
          recipes: data?.data?.recipes.map((recipe: any) => ({
            id: recipe?.id,
          })),
          branches: data?.data?.branches.map((branch: any) => ({
            id: branch?.id,
            price: branch?.pivot?.price || 0,
          })),
        };
        ResetForm(newDataFormat);
      },
    }
  );

  // create
  const { mutate: CreateProduct, isPending: loadingCreate } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: async (values: z.infer<typeof formProductsSchema>) => {
      return axiosInstance.post("forecast-console/forecast-products", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.massage,
      });
      refetchProducts();
      handleCloseSheet();
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.massage,
      });
    },
  });

  // edit
  const { mutate: EditProduct, isPending: loadingEdit } = useMutation({
    mutationKey: ["edit-Product", IdProduct],
    mutationFn: async (values: z.infer<typeof formProductsSchema>) => {
      return axiosInstance.put(
        `/forecast-console/forecast-products/${IdProduct}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.massage,
      });
      refetchProducts();
      handleCloseSheet();
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.massage,
      });
    },
  });

  // delete
  const { mutate: DeleteProduct, isPending: loadingDelete } = useMutation({
    mutationKey: ["delete-Product", IdProduct],
    mutationFn: async () => {
      return axiosInstance.delete(
        `/forecast-console/forecast-products/${IdProduct}`
      );
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.massage,
      });
      refetchProducts();
      handleCloseSheet();
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.massage,
      });
    },
  });

  // export
  const { mutate: ExportProduct, isPending: loadingExport } = useMutation({
    mutationKey: ["export-Product"],
    mutationFn: async () => {
      return axiosInstance.post(`export/Products`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.massage,
      });

      window.open(data?.data?.data?.url);
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.massage,
      });
    },
  });

  return {
    isLoadingProducts,
    ProductsData,
    CreateProduct,
    loadingCreate,
    EditProduct,
    loadingEdit,
    DeleteProduct,
    loadingDelete,
    ProductOne,
    isLoadingProductOne,
    ExportProduct,
    loadingExport,
  };
};

export default useProductsHttp;
