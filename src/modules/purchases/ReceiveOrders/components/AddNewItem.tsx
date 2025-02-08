import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import useCustomQuery from "@/hooks/useCustomQuery";
import useFilterQuery from "@/hooks/useFilterQuery";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import useCommonRequests from "@/hooks/useCommonRequests";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "@/components/ui/avatar";
import useReceiveOrdersHttp from "../queriesHttp/useReceiveOrdersHttp";
import AuthPermission from "@/guards/AuthPermission";
import { PERMISSIONS } from "@/constants/constants";
interface CreateNewItemProps {
  setNewItem: React.Dispatch<React.SetStateAction<boolean>>;
  rowData?: any;
  scollToRef?: React.RefObject<HTMLDivElement>;
}

export const AddNewItem: React.FC<CreateNewItemProps> = ({
  setNewItem,
  rowData,
  scollToRef,
}) => {
  const { filterObj } = useFilterQuery();

  const [items, setItems] = useState<{ label: string; value: string }[]>([]);

  const { receiveOrder } = useReceiveOrdersHttp({
    orderId: rowData,
  });

  const { setValue, watch, trigger } = useFormContext();
  const {
    data: itemsData,
    refetch,
    isLoading,
  } = useCustomQuery(
    ["get/purchase-orders", receiveOrder],
    `forecast-console/orders/${watch("branch")}/supplier/${watch(
      "supplier"
    )}/items`,
    {},
    {},
    "post"
  );

  useEffect(() => {
    const arr =
      itemsData?.itemDailyUsage?.map((e: any) => ({
        value: e?.id,
        label: e?.name,
        unit: e?.unit,
      })) || [];

    const watchedItems = watch("items") || [];

    // Find unshared items with clear type matching and logging
    const unsharedItems = [
      ...arr.filter((item1) => {
        return !watchedItems.some((item2) => {
          return item2.item_id === item1.value && item2.unit === item1.unit;
        });
      }),
      ...watchedItems.filter((item2) => {
        return !arr.some((item1) => {
          return item1.value === item2.item_id && item1.unit === item2.unit;
        });
      }),
    ];

    setItems(unsharedItems);
    refetch();

    console.log("Unshared Items:", unsharedItems); // Logging for debugging
  }, [itemsData?.itemDailyUsage, watch("items")]);

  const { control } = useFormContext();

  const { append } = useFieldArray({
    control,
    name: "items",
  });

  const { taxGroups } = useCommonRequests({
    getTaxGroups: true,
  });

  const calculationSun = () => {
    setValue(
      "sub_total",
      watch("items").reduce(
        (acc: number, curr: { sub_total: number }) => acc + +curr?.sub_total,
        0
      ),
      { shouldValidate: true }
    );
    setValue(
      "total_tax",
      watch("items").reduce(
        (acc: number, curr: { tax_amount: number }) => acc + +curr?.tax_amount,
        0
      ),
      { shouldValidate: true }
    );
    setValue(
      "sub_total",
      watch("items").reduce(
        (acc: number, curr: { sub_total: number }) => acc + +curr?.sub_total,
        0
      ),
      { shouldValidate: true }
    );
    setValue("total_cost", watch("sub_total") + watch("total_tax"), {
      shouldValidate: true,
    });
    trigger("total");
  };

  const handleAddItem = (e) => {
    const item = itemsData?.itemDailyUsage?.find(
      (item: { id: string }) => item?.id == e
    );
    
    append({
      item_id: item?.id,
      name: item?.name,
      code: item?.code,
      unit: item?.unit,
      quantity: 1,
      invoice_quantity: 1,
      cost: item?.cost,
      order_cost: item?.cost,
      tax_group_id: item?.tax_group?.id,
      sub_total: item?.cost,
      price_per_unit: item?.cost,
      pack_per_case: item?.pack_per_case,
      pack_size: item?.pack_size,
      tax_amount:
        (taxGroups?.find((e: { id: string }) => e.id === item?.tax_group?.id)
          ?.rate /
          100) *
        item?.cost,

      total_cost:
        (taxGroups?.find((e: { id: string }) => e.id === item?.tax_group?.id)
          ?.rate /
          100) *
          item?.cost +
        item?.cost,
      order_unit: item?.pack_unit,
      supplier_item_id: item?.supplier_item_id,
    });

    calculationSun();
  };

  return (
    <>
      <div className="bg-popover h-[64px] rounded-[4px] px-[120px] flex items-center">
        {isLoading ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="border-popover-foreground border-[1.5px] p-3 bg-white py-[4px] w-[245px] text-gray-400 rounded-[4px] cursor-pointer">
                Loading...
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="border-popover-foreground border-[1.5px] p-3 bg-white py-[4px] w-[245px] text-gray-400 rounded-[4px] cursor-pointer">
                Add an item from the list
              </div>
            </DropdownMenuTrigger>

            {items?.length ? (
              <DropdownMenuContent
                className={`w-30 bg-white w-[248px] ${
                  items?.length > 4 ? "h-[180px]" : "h-auto"
                } overflow-y-scroll`}
              >
                {items?.map((item: any) => (
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer text-black "
                    onClick={() => handleAddItem(item.value)}
                  >
                    <div className="flex gap-1 items-center justify-between">
                      <div className="flex gap-1 items-center">
                        <p className="text-sm mr-5">
                          {item.label} ({item.unit})
                        </p>
                      </div>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent className="w-[248px] bg-white text-center text-gray-400 py-3">
                No Item
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        )}

        <AuthPermission
          permissionRequired={[
            PERMISSIONS?.can_add_inventory_items_from_deliveries_only,
          ]}
        >
          <Button
            type="button"
            className="border-gray-400 border-[1px] text-text-textPrimary bg-[#EAF2F7] mx-[8px]"
            onClick={() => {
              if (scollToRef?.current) {
                scollToRef.current.scrollIntoView({ behavior: "smooth" });
              }

              setNewItem(true);
              setValue("itemNew", {
                tax_group_id: "",
                pack_unit: "",
              });
            }}
          >
            Create new
          </Button>
        </AuthPermission>
      </div>
    </>
  );
};
