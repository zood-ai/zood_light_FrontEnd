import { CustomSheet } from "@/components/ui/custom/CustomSheet";
import { CustomTable } from "@/components/ui/custom/CustomTable";
import HeaderPage from "@/components/ui/custom/HeaderPage";
import HeaderTable from "@/components/ui/custom/HeaderTable";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { IRecipesList } from "./types/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RecipeDetailsForm from "@/modules/Inventory/Recipes/components/RecipeDetailsForm";
import useCustomQuery from "@/hooks/useCustomQuery";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/guards/axiosInstance";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import CustomModal from "@/components/ui/custom/CustomModal";
import Avatar from "@/components/ui/avatar";
import { formSchema, defaultValues } from "./schema/RecipeSchema";
import useFilterQuery from "@/hooks/useFilterQuery";
import useCommonRequests from "@/hooks/useCommonRequests";
import { PERMISSIONS } from "@/constants/constants";
import AuthPermission from "@/guards/AuthPermission";

const Recipes = () => {
  //==========STATES==========//

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [rowData, setRowData] = useState<IRecipesList>();
  const [modalName, setModalName] = useState("");
  const { toast } = useToast();
  const { filterObj } = useFilterQuery();
  //==========CONSTANTS==========//

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const columns: ColumnDef<IRecipesList>[] = [
    {
      accessorKey: "name",
      header: () => <div>Name</div>,
      cell: ({ row }) => {
        const name = row.getValue<string>("name");
        return (
          <div className="w-[200px]  flex items-center gap-2">
            <Avatar text={name} />
            <div>{name}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "type",
      header: () => <div>Type</div>,
      cell: ({ row }) => <>{row.getValue("type")}</>,
    },
    {
      accessorKey: "price",
      header: () => <div>Target sale price</div>,
      cell: ({ row }) => {
        const price = row.getValue<number>("price");
        return <div className="">SAR {price.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "cost",
      header: () => <div>Food cost</div>,
      cell: ({ row }) => {
        const cost = row.getValue<number>("cost");
        return (
          <div className="">
            <span className="mr-[20px]">(SAR {cost?.toFixed(2)})</span>
            <span>{row.original.cost_percentage?.toFixed(2)}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "gross_profit",
      header: () => <div>Target GP%</div>,
      cell: ({ row }) => {
        const profit = row.getValue<number>("gross_profit");
        return (
          <div className="">
            <span className="mr-[20px]">(SAR {profit.toFixed(2)})</span>
            <span>{row.original.gross_profit_percentage?.toFixed(2)}%</span>
          </div>
        );
      },
    },
  ];

  //==========QUERY==========//

  const { InventoryItemsSelect, isInventoryItemsLoading } = useCommonRequests({
    getInventoryItems: true,
  });

  const {
    data,
    refetch: refetchRecipes,
    isPending: isRecipesLoading,
  } = useCustomQuery(
    ["recipes", filterObj],
    "forecast-console/recipe",
    {},
    { ...filterObj }
  );

  const { data: recipe, isFetching: isPendingRecipe } = useCustomQuery(
    ["recipe", rowData?.id || ""],
    `forecast-console/recipe/${rowData?.id || ""}`,
    {
      select: (data: any) => {
        const newDataFormat = {
          name: data?.data?.name,
          price: data?.data?.price,
          type: data?.data?.type,
          food: data?.data?.food,
          beverage: data?.data?.beverage,
          misc: data?.data?.misc,
          cost: data?.data?.cost,
          items: data?.data?.items?.map((item: any) => ({
            id: item?.id,
            quantity: item?.pivot?.quantity,
            unit: item?.pack_unit,
            cost: item?.pivot?.cost,
          })),
        };

        return newDataFormat;
      },
      enabled: !!rowData?.id,
    }
  );

  const { mutate: CreateRecipe, isPending } = useMutation({
    mutationKey: ["recipes/create"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return axiosInstance.post("forecast-console/recipe", values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchRecipes();
      handleCloseSheet();
    },
    onError: (error: any) => {
      toast({
        description: error.data.message,
      });
    },
  });

  const { mutate: mutateEdit, isPending: isPendingEdit } = useMutation({
    mutationKey: ["recipe/edit"],
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: z.infer<typeof formSchema>;
    }) => {
      return axiosInstance.put(`forecast-console/recipe/${id}`, values);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchRecipes();
      handleCloseSheet();
    },
  });

  // delete batche
  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ["recipes/delete"],
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`forecast-console/recipe/${id}`);
    },
    onSuccess: (data) => {
      toast({
        description: data?.data?.message,
      });
      refetchRecipes();
      handleCloseSheet();
    },
  });

  //==========FUNCTIONS==========//

  const handleCloseSheet = () => {
    setModalName("");
    setIsOpen(false);
    setIsEdit(false);
    setRowData(undefined);
    form.reset(defaultValues);
  };

  const handleConfirm = () => {
    if (modalName === "close edit") {
      handleCloseSheet();
    } else {
      mutateDelete(rowData?.id || "");
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEdit) {
      mutateEdit({ id: rowData?.id || "", values });
      return;
    }
    CreateRecipe(values);
  };

  //==========RENDER==========//

  useEffect(() => {
    if (Object.values(recipe || {}).length > 0) {
      form.reset(recipe);
      setIsOpen(true);
    }
  }, [recipe, form]);

  return (
    <>
      <HeaderPage
        title="Menu Recipes"
        textButton="Add Recipe"
        exportButton={true}
        onClickAdd={() => {
          setIsOpen(true);
        }}
        modalName={"recipes"}    
        permission={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}

      />
      <HeaderTable />

      <CustomTable
        columns={columns}
        data={data?.data || []}
        loading={isRecipesLoading}
        pagination
        paginationData={data?.meta}
        onRowClick={(row) => {
          setRowData(row);
          setIsEdit(true);
          setIsOpen(true);
        }}
      />
      <AuthPermission permissionRequired={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}>

      <CustomSheet
        isOpen={isOpen}
        isLoadingForm={isPendingRecipe}
        isEdit={isEdit}
        isDirty={form.formState.isDirty}
        handleCloseSheet={handleCloseSheet}
        headerLeftText={rowData?.name}
        form={form}
        onSubmit={onSubmit}
        setModalName={setModalName}
        isLoading={
          isPending ||
          isInventoryItemsLoading ||
          isPendingEdit ||
          isPendingDelete
        }
        permission={[PERMISSIONS.can_add_and_edit_inventory_items_recipes_and_suppliers]}

      >
        <RecipeDetailsForm InventoryItemsSelect={InventoryItemsSelect} />
      </CustomSheet>
      </AuthPermission>
      <CustomModal
        modalName={modalName}
        setModalName={setModalName}
        handleConfirm={handleConfirm}
        deletedItemName={rowData?.name}
        isPending={isPendingDelete}
      />
    </>
  );
};

export default Recipes;
