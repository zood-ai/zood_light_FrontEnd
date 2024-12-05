import { format } from "date-fns";
import { cn } from "@/utils";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

// Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DeliveryWarning from "./DeliveryWarning";
import Item from "./Item";

// Hooks
import useFilterQuery from "@/hooks/useFilterQuery";
import usePurchaseOrderHttp from "../queriesHttp/usePurchaseOrderHttp";
import { useSearchParams } from "react-router-dom";

// Icons
import ShoppingCartIcon from "@/assets/icons/ShoppingCart";
import { CalendarIcon } from "lucide-react";
import EmptyItemsIcon from "@/assets/icons/EmptyItems";

// Types
import { IItemData, IPurchaseOrderForm } from "../types/type";

const PurchaseOrderForm = ({
  items,
  setShowCart,
  handleCloseSheet,
  supplierId,
  formReceive,
  orderId,
  showCart,
}: IPurchaseOrderForm) => {
  // State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reset, setReset] = useState(false);
  const [filterdItems, setFilterdItems] = useState<IItemData[]>([]);

  // Hooks
  const { filterObj } = useFilterQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    CreatePurchaseOrder,
    LoadingCreatePurchaseOrder,
    UpdatePurchaseOrder,
    LoadingUpdatePurchaseOrder,
  } = usePurchaseOrderHttp({
    handleCloseSheet,
  });

  const { control, getValues, watch, formState, setValue } = useFormContext();

  useEffect(() => {
    if (items?.itemDailyUsage?.length > 0) {
      setFilterdItems(items?.itemDailyUsage);
      setValue("supplier", supplierId || filterObj["filter[supplier]"]);
      setValue("branch", filterObj["filter[branch]"]);
    }
  }, [items?.itemDailyUsage?.length]);

  const handleSearch = (value: string) => {
    if (value) {
      const filteredItems = items?.itemDailyUsage?.filter((item: IItemData) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilterdItems(filteredItems);
    } else {
      setFilterdItems(items?.itemDailyUsage);
    }
  };

  return (
    <>
      <>
        {/* search & date */}
        <div className=" pb-4 border-b-[#F5F5F5] border-b-[2px]">
          <Input
            placeholder={"Search by name"}
            searchIcon={true}
            className="w-full h-[40px]"
            defaultValue={searchParams.get("filter[name]") || ""}
            onChange={(e) => {
              handleSearch(e.target.value);
              setSearchParams({
                ...filterObj,
                "filter[name]": e.target.value,
              });
            }}
          />
          {/* date picker */}
          <FormField
            control={control}
            name="delivery_date"
            render={({ field }) => (
              <FormItem className="relative flex flex-col mt-5">
                <FormLabel className="mb-2 font-semibold text-textPrimary">
                  Delivery Date
                </FormLabel>
                <FormControl onClick={() => setShowDatePicker(!showDatePicker)}>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "py-3 pl-3 rounded-sm h-[40px] text-left font-normal ",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value || items?.deliveryDate?.delivery_date ? (
                      format(
                        field.value || items?.deliveryDate?.delivery_date,
                        "dd MMMM"
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                  </Button>
                </FormControl>

                {showDatePicker && (
                  <>
                    <Calendar
                      mode="single"
                      className="absolute z-10 bg-white shadow-md top-16"
                      selected={
                        new Date(
                          field.value || items?.deliveryDate?.delivery_date
                        )
                      }
                      onSelect={(date) => {
                        if (!date) {
                          return;
                        }

                        field.onChange(format(date, "yyyy-MM-dd"));
                        setShowDatePicker(false);

                        setValue("items", []);
                        setReset(!reset);
                      }}
                      fromDate={new Date()}
                    />
                    <div
                      className="absolute top-16 z-[2]  h-screen w-full"
                      onClick={() => setShowDatePicker(false)}
                    />
                  </>
                )}

                {items?.deliveryDate?.order_rules.every((rule) => {
                  return (
                    rule.delivery_day !==
                    format(getValues("delivery_date"), "EEEE")
                  );
                }) &&
                  format(getValues("delivery_date"), "EEEE") >
                    items.deliveryDate.delivery_date && (
                    <p className="mt-2 text-warn">
                      {filterObj["filter[supplier_name]"]} don`t deliver on{" "}
                      {format(new Date(getValues("delivery_date")), "eee")}
                    </p>
                  )}
              </FormItem>
            )}
          />

          <DeliveryWarning deliveryDate={items?.deliveryDate} />
        </div>

        {/* Items List */}
        {filterdItems?.length > 0 ? (
          <div className="pb-10">
            {filterdItems?.map((item: IItemData) => (
              <Item
                key={`${item.id} ${item.unit}`}
                item={item}
                reset={reset}
                deliveryDate={getValues("delivery_date")}
                showCart={showCart}
                getValues={getValues}
                setValue={setValue}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 mt-12 ">
            <EmptyItemsIcon />
            <p className="text-textPrimary font-semibold text-[20px]">
              No items
            </p>
            <span className="text-[16px] text-textPrimary">
              Your items will live here
            </span>
          </div>
        )}
      </>

      {watch("items").length > 0 && (
        <div className="absolute bottom-0 left-0 flex w-full gap-3 p-2 bg-white">
          <Button
            variant={"outline"}
            type="button"
            className="w-full mt-4 text-primary border-gray-400 text-[16px] h-[50px] font-semibold rounded-3xl"
            disabled={
              !!Object.keys(formState.errors)?.length ||
              LoadingCreatePurchaseOrder ||
              LoadingUpdatePurchaseOrder
            }
            onClick={() => {
              if (formReceive) {
                UpdatePurchaseOrder({
                  values: getValues(),
                  orderId: orderId as string,
                });
              } else {
                CreatePurchaseOrder({ ...getValues(), status: "1" });
              }
            }}
          >
            Save for later
          </Button>
          <Button
            className="w-full mt-4 h-[50px] flex gap-2 font-semibold bg-primary rounded-3xl"
            disabled={
              !!Object.keys(formState.errors)?.length ||
              LoadingCreatePurchaseOrder ||
              LoadingUpdatePurchaseOrder
            }
            onClick={() => {
              setShowCart(true);
            }}
            type="button"
          >
            <div className="relative">
              <ShoppingCartIcon />
              <span className="bg-[#EB8E35] w-[16px] h-[17px] rounded-full text-[12px] font-semibold flex items-center justify-center absolute -top-[7px] left-3">
                {watch("items")?.length}
              </span>
            </div>
            View Shopping Cart
          </Button>
        </div>
      )}
    </>
  );
};

export default PurchaseOrderForm;
