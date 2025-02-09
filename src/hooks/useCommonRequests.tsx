import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomQuery from "./useCustomQuery";
import useFilterQuery from "./useFilterQuery";
import axiosInstance from "@/guards/axiosInstance";
import { toast } from "@/components/ui/use-toast";

interface IUseCommonRequests {
  getBranches?: boolean;
  getCategories?: boolean;
  getSuppliers?: boolean;
  getItems?: boolean;
  getInventoryItems?: boolean;
  getIngredients?: boolean;
  getTaxGroups?: boolean;
  getStorageAreas?: boolean;
  filterItem?: string;
  getAllItems?: boolean;
  filterByBranch?: string;
  filterBatches?: string;
  typeTag?: string;
  getUsers?: boolean;
  getTaxes?: boolean;
  getReasons?: boolean;
  getRecipes?: boolean;
  getCounts?: boolean;
  getDepartments?: boolean;
  filterRecipe?: string;
  setBranches?: (data: any) => void;
  fromMenu?: boolean;
  getSku?: boolean;
  handleCloseSheet?: () => void;
  modalName?: string;
  getPositions?: boolean;
  departmentId?: string;
  locationId?: string;
  getRoles?: boolean;
  getSigned?: boolean;
  getReviewed?: boolean;
  getProvided?: boolean;
  locationList?: any;
  getEmployees?: boolean;
  getShiftTypes?: boolean;
  getDocuments?: boolean;
}
const useCommonRequests = ({
  getBranches = false,
  getCategories = false,
  getSuppliers = false,
  getItems = false,
  getInventoryItems = false,
  getIngredients = false,
  getTaxGroups = false,
  getStorageAreas = false,
  filterItem = "",
  getAllItems = false,
  filterByBranch = "",
  filterBatches,
  getReasons = false,
  typeTag,
  getUsers = false,
  getTaxes = false,
  getRecipes = false,
  filterRecipe,
  setBranches,
  getSku,
  fromMenu = false,
  handleCloseSheet,
  modalName,
  getCounts,
  getDepartments = false,
  getPositions = false,
  departmentId,
  locationId,
  getRoles,
  getProvided = false,
  getReviewed = false,
  getSigned = false,
  locationList,
  getEmployees = false,
  getShiftTypes = false,
  getDocuments = false,
}: IUseCommonRequests) => {
  const queryClient = useQueryClient();

  const { data: branches, isLoading: isBranchesLoading } = useCustomQuery(
    ["select/branches"],
    "select/branches",
    {
      enabled: getBranches,
      onSuccess: (data: any) => {
        if (data?.length !== 0) {
          setBranches?.(
            data.map((branch: any) => ({
              id: branch.id,
            }))
          );
        }
      },
    }
  );

  const branchesSelect = branches?.map(
    (branch: { name: string; id: string; has_cpu: boolean }) => ({
      label: branch.name,
      value: branch.id,
      isCpu: branch.has_cpu,
    })
  );

  const { data: Categories, isLoading: isCategoriesLoading } = useCustomQuery(
    ["getAll/categories", String(fromMenu)],
    `select/${!fromMenu ? "inventory_categories" : "categories"}`,
    {
      enabled: getCategories,
    }
  );

  const CategoriesSelect = Categories?.map(
    (category: { name: string; id: string }) => ({
      label: category.name,
      value: category.id,
    })
  );

  const { data: Suppliers, isLoading: isSuppliersLoading } = useCustomQuery(
    ["getAll/suppliers"],
    "select/suppliers?type=all",
    {
      enabled: getSuppliers,
    }
  );
  const SuppliersSelect = Suppliers?.map(
    (supplier: { name: string; id: string; has_cpu: boolean }) => ({
      label: supplier.name,
      value: supplier.id,
      has_cpu: supplier.has_cpu,
    })
  );
  const { filterObj } = useFilterQuery();

  const { data: Items, isLoading: isItemsLoading } = useCustomQuery(
    ["getAll/items"],
    `forecast-console/items?filter[branches][0]=${filterObj["filter[branch]"]}`,
    {
      enabled: getItems,
    }
  );

  const ItemsSelect = Items?.data?.map(
    (item: { name: string; id: string; pack_unit: string; cost: number }) => ({
      label: item.name,
      value: item.id,
      unit: item.pack_unit,
      cost: item.cost,
    })
  );

  const { data: InventoryItems, isLoading: isInventoryItemsLoading } =
    useCustomQuery(["getAll/all-items"], `forecast-console/all-items`, {
      enabled: getInventoryItems,
    });

  const InventoryItemsSelect = InventoryItems?.data?.map(
    (item: {
      name: string;
      id: string;
      pack_unit: string;
      unit_cost: number;
    }) => ({
      label: item.name,
      value: item.id,
      unit: item.pack_unit,
      cost: item.unit_cost,
    })
  );

  const { data: ingredients, isLoading: isIngredientsLoading } = useCustomQuery(
    ["getAll/ingredients"],
    "forecast-console/all-items",
    {
      enabled: getIngredients,
    }
  );
  const ingredientsSelect = ingredients?.data?.map(
    (ingredient: {
      name: string;
      id: string;
      unit_cost: number;
      pack_unit: string;
    }) => ({
      label: ingredient.name,
      value: ingredient.id,
      cost: ingredient.unit_cost,
      pack_unit: ingredient.pack_unit,
    })
  );
  const { data: allItems, isLoading: isAllItemsLoading } = useCustomQuery(
    ["getAll/all-items", filterItem || ""],
    `forecast-console/all-items?${filterItem}`,
    {
      enabled: getAllItems,
    }
  );

  const { data: taxGroups, isLoading: istaxGroupsLoading } = useCustomQuery(
    ["getAll/taxGroup"],
    "select/tax_groups",
    {
      enabled: getTaxGroups,
    }
  );
  const { data: reasons, isLoading: isreasonsLoading } = useCustomQuery(
    ["getAll/reasons"],
    "select/reasons",
    {
      enabled: getReasons,
    }
  );

  const taxGroupsSelect = taxGroups?.map(
    (tax: { name: string; id: string }) => ({
      label: tax.name,
      value: tax.id,
    })
  );

  const { data: storageAreas, isLoading: isStorageAreasLoading } =
    useCustomQuery(
      ["getAll/storageAreas"],
      `forecast-console/storage-areas?${filterByBranch}`,
      {
        enabled: getStorageAreas,
      }
    );
  const storageAreasSelect = storageAreas?.data?.map(
    (storageArea: { name: string; id: number }) => ({
      label: storageArea.name,
      value: String(storageArea.id),
    })
  );
  // items
  const { data: itemsData, isLoading: isFetchingItems } = useCustomQuery(
    ["getAll/items", filterItem || ""],
    `forecast-console/all-items?${filterItem}`,
    { enabled: !!filterItem }
  );
  

  // batches
  const { data: batchesData, isFetching: isFetchingBatches } = useCustomQuery(
    ["getAll/batches", filterBatches || ""],
    `forecast-console/batch?${filterBatches}`,
    {
      enabled: !!filterBatches,
    }
  );

  // tags

  const { data: tagsData, isLoading: isFetchingTags } = useCustomQuery(
    ["getAlltags"],
    `manage/tags?filter[is_deleted]=false&filter[type]=${typeTag}`,
    {
      enabled: !!typeTag,
    }
  );

  const tagsSelect = tagsData?.data?.map(
    (tag: { name: string; id: number }) => ({
      label: tag.name,
      value: String(tag.id),
    })
  );
  ///users

  const { data: usersData, isLoading: isFetchingUsers } = useCustomQuery(
    ["getAll/users"],
    `auth/users?filter[is_deleted]=false&include[]=roles&type=all`,
    {
      enabled: getUsers,
    }
  );

  ///taxes

  const { data: taxesData, isLoading: isFetchingTaxes } = useCustomQuery(
    ["getAll/taxes"],
    `manage/taxes`,
    {
      enabled: getTaxes,
    }
  );

  const { data: recipesData, isLoading: isFetchingRecipes } = useCustomQuery(
    ["getAll/recipe", filterRecipe || ""],
    `forecast-console/recipe?type=all&${filterRecipe}`,
    {
      enabled: getRecipes,
    }
  );

  const recipeSelect = recipesData?.data?.map(
    (recipe: { name: string; id: string }) => ({
      label: recipe.name,
      value: recipe.id,
    })
  );

  const {
    data: sku,
    isFetching: isFetchingSku,
    refetch: refetchSku,
  } = useCustomQuery(
    ["manage/generate_sku"],
    `manage/generate_sku`,
    {
      enabled: getSku,
    },
    {},

    "post",
    { model: "products" }
  );

  const { mutate: Import, isPending: isPendingImport } = useMutation({
    mutationKey: ["import"],
    mutationFn: async (values: any) => {
      return axiosInstance.post("/forecast-console/import", values);
    },
    onSuccess: (data) => {
      toast({
        description: "Import File Successfully",
      });

      handleCloseSheet?.();

      queryClient.invalidateQueries({ queryKey: [modalName] });
    },
    onError: (data: any) => {
      toast({
        description: data?.data?.message,
      });
    },
  });

  const { mutate: downloadTemplate, isPending: isPendingDownloadTemplate } =
    useMutation({
      mutationKey: ["downloadTemplate"],
      mutationFn: async (values: { type: string }) => {
        return axiosInstance.post(
          `/forecast-console/import-template/${values.type}`
        );
      },

      onSuccess: (data) => {
        toast({
          description: "Download Template Successfully",
        });

        window.open(data?.data.url, "_blank");
        handleCloseSheet?.();
      },
      onError: (data: any) => {
        toast({
          description: data?.data?.message,
        });
      },
    });

  const { mutate: Export, isPending: isPendingExport } = useMutation({
    mutationKey: ["export"],
    mutationFn: async (values: any) => {
      return axiosInstance.post(`/forecast-console/export/${values?.type}`);
    },
    onSuccess: (data) => {
      toast({
        description: "Export File Successfully",
      });
      window.open(data?.data?.url, "_blank");
    },
    onError: (error: any) => {
      console.log(error);

      toast({
        description: error.data.message,
        variant: "error",
      });
    },
  });

  const { data: countDays } = useCustomQuery(
    ["count/days", filterObj],
    `forecast-console/get-count-date`,
    {
      enabled: getCounts,
    },
    { "filter[branch]": filterObj["filter[branch]"] }
  );
  const { data: departmentsData, isLoading: isDepartmentsLoading } =
    useCustomQuery(
      ["departments", locationId || ""],

      `${
        locationId
          ? `/forecast-console/department?filter[branches][0]=${locationId}`
          : `/forecast-console/department`
      }`,
      {
        enabled: getDepartments || !!locationId,
      }
    );
  const departmentsSelect = departmentsData?.map(
    (department: {
      name: string;
      id: string;
      positions: { name: string; id: number }[];
    }) => ({
      label: department.name,
      value: department.id,
      positions: department?.positions?.map(
        (position: { name: string; id: number }) => ({
          label: position.name,
          value: position.id,
        })
      ),
    })
  );

  const { data: departmentsDataList, isLoading: isDepartmentsLoadingList } =
    useCustomQuery(
      ["departments-list", locationList || ""],
      "/forecast-console/department",
      {
        enabled: locationList?.length > 0,
      },
      { "filter[branches]": locationList }
    );
  const { data: positionsData, isLoading: isPositionsLoading } = useCustomQuery(
    ["positions", departmentId ?? ""],
    `/forecast-console/position`,
    {
      enabled: getPositions || !!departmentId,
    },
    {
      ...(departmentId
        ? { "filter[department_id]": departmentId ?? "" }
        : { type: "all" }),
    }
  );
  const positionsSelect = positionsData?.map(
    (position: { name: string; id: number; department: { id: string } }) => ({
      label: position.name,
      value: position.id,
      departmentId: position?.department?.id,
    })
  );
  const { data: employeesData, isLoading: isEmployeesLoading } = useCustomQuery(
    ["select/forecast_employees", locationId || ""],
    `/select/forecast_employees?filter[branches][0]=${locationId}`,
    {
      enabled: getEmployees || !!locationId,
    }
  );
  const employeesSelect = employeesData?.map(
    (employee: {
      first_name: string;
      id: string;
      last_name: string;
      positions: {
        forecast_department_id: string;
        id: number;
        name: string;
        pivot: {
          forecast_position_id: number;
          forecast_employee_id: string;
        };
      }[];
      departments: {
        id: string;
        name: string;
        positions: {
          forecast_department_id: string;
          id: number;
          name: string;
        }[];
      }[];
    }) => ({
      label: employee.first_name + " " + employee.last_name,
      value: employee.id,
      departments: employee.departments,
      positions: employee.positions,
    })
  );

  const { data: shiftTypesData, isLoading: isShiftTypesLoading } =
    useCustomQuery(["select/shift_types"], `/select/shift_types?all=1`, {
      enabled: getShiftTypes,
    });
  const shiftTypesSelect = shiftTypesData?.map(
    (shift: { id: string; name: string; icon: string; type: string }) => ({
      label: shift.icon + " " + shift.name,
      value: shift.id,

      type: shift.type,
    })
  );
  const { data: rolesData, isLoading: isrolesLoading } = useCustomQuery(
    ["roles-select"],
    `/roles?filter[model]=1`,
    {
      enabled: getRoles,
    }
  );
  const rolesSelect = rolesData?.data?.map(
    (role: { name: string; id: string }) => ({
      label: role.name,
      value: role.id,
    })
  );
  const { data: documentsData, isLoading: isDocumentsLoading } = useCustomQuery(
    ["documents"],
    `/forecast-console/documents`,
    {
      enabled: getDocuments,
    }
  );

  const { data: documentProvidedData } = useCustomQuery(
    ["document-provided"],
    `/forecast-console/documents?filter[type]=1`,
    {
      enabled: getProvided,
    }
  );
  const { data: documentReviewedData } = useCustomQuery(
    ["document-reviewed"],
    `/forecast-console/documents?filter[type]=2`,
    {
      enabled: getReviewed,
    }
  );

  const { data: documentSignedData } = useCustomQuery(
    ["document-signed"],
    `/forecast-console/documents?filter[type]=3`,
    {
      enabled: getSigned,
    }
  );

  return {
    branchesSelect,
    isBranchesLoading,
    CategoriesSelect,
    isCategoriesLoading,
    SuppliersSelect,
    isSuppliersLoading,
    ItemsSelect,
    InventoryItemsSelect,
    isItemsLoading,
    isInventoryItemsLoading,
    ingredientsSelect,
    isIngredientsLoading,
    taxGroupsSelect,
    taxGroups,
    istaxGroupsLoading,
    storageAreasSelect,
    isStorageAreasLoading,
    ingredients,
    itemsData,
    isFetchingItems,
    reasons,
    isreasonsLoading,
    allItems,
    isAllItemsLoading,
    batchesData,
    isFetchingBatches,
    tagsSelect,
    isFetchingTags,
    isFetchingUsers,
    usersData,
    taxesData,
    isFetchingTaxes,
    recipesData,
    isFetchingRecipes,
    Items,
    skuNumber: sku?.data,
    isFetchingSku,
    refetchSku,
    recipeSelect,
    Import,
    isPendingImport,
    downloadTemplate,
    isPendingDownloadTemplate,
    Export,
    isPendingExport,
    countDays,
    departmentsSelect,
    positionsSelect,
    isDepartmentsLoading,
    isPositionsLoading,
    rolesSelect,
    documentProvidedData,
    documentSignedData,
    departmentsData,
    documentReviewedData,
    branches,
    departmentsDataList,
    isDepartmentsLoadingList,
    employeesSelect,
    isEmployeesLoading,
    shiftTypesSelect,
    isShiftTypesLoading,
    documentsData,
    isDocumentsLoading,
    rolesData,
  
  };
};

export default useCommonRequests;
