import {
  FieldValues,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { IItemData } from "../types/type";
import { updateIItemDailyUsage } from "@/utils/function";

interface AddRemoveItemsProps {
  qty: number;
  item: IItemData;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  packUnit: number;
  setUpdatedItem: any;
  deliveryDate?: any;
  fromShopping?: boolean;
  updatedItems?: any;
  getValues: UseFormGetValues<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

const AddRemoveItems = ({
  qty,
  item,
  setQty,
  packUnit,
  setUpdatedItem,
  deliveryDate,
  fromShopping,
  updatedItems,
  getValues,
  setValue,
}: AddRemoveItemsProps) => {
  const updatedItemQty = (itemIndex: number, quantity: number) => {
    setUpdatedItem(
      updateIItemDailyUsage(
        fromShopping ? updatedItems : (item as any),
        deliveryDate,
        quantity * packUnit
      )
    );

    const updatedItem = getValues(`items`).map(
      (it: { item_id: string; qty: number }, index: number) => {
        if (index === itemIndex) {
          return {
            ...it,
            quantity: quantity,
            invoice_quantity: quantity,
            total_tax: item.tax_amount * quantity,
            cost: item.cost,
            sub_total: item.cost * quantity,
            total_cost: item.cost * quantity + item.tax_amount,
          };
        }
        return it;
      }
    );
    setValue(`items`, updatedItem, { shouldValidate: true });
  };

  const addItemtoCard = (quantity?: number) => {
    setQty((prev) => prev + 1);

    const itemIndex = getValues("items").findIndex(
      (f: { item_id: string; unit: string }) =>
        f.unit === item?.unit && f.item_id === item.id
    );

    if (itemIndex === -1) {
      setUpdatedItem(
        updateIItemDailyUsage(
          fromShopping ? updatedItems : (item as any),
          deliveryDate,
          quantity ? quantity * packUnit : 1 * packUnit
        )
      );
      setValue(
        `items`,
        [
          ...getValues(`items`),
          {
            item_id: item?.id,
            id: item?.id,
            quantity: quantity ? quantity : 1,
            pack_per_case: item.pack_per_case,
            pack_size: item.pack_size,
            cost: item.cost,
            invoice_quantity: 1,
            total_tax: item.tax_amount * 1,
            unit: item.unit,
            tax_group_id: item.tax_group?.id,
            tax_amount: item.tax_amount,
            sub_total: item.cost * 1,
            total_cost: item.cost * 1 + item.tax_amount,
            packUnit,
          },
        ],
        { shouldValidate: true }
      );
    } else {
      updatedItemQty(
        itemIndex,
        quantity ? quantity : getValues(`items`)[itemIndex].quantity + 1
      );
    }
  };

  const removeItemFromCard = () => {
    setQty((prev) => prev - 1);
    const itemIndex = getValues("items").findIndex(
      (f: { item_id: string; unit: string }) =>
        f.unit === item?.unit && f.item_id === item.id
    );

    if (getValues("items")[itemIndex]?.quantity === 1) {
      setValue(
        `items`,
        getValues(`items`).filter((it: { item_id: string; unit: string }) => {
          if (it.item_id === item.id) return it.unit !== item?.unit;
          return it.item_id !== item.id;
        }),
        { shouldValidate: true }
      );

      setUpdatedItem(
        updateIItemDailyUsage(
          fromShopping ? updatedItems : (item as any),
          deliveryDate
        )
      );

      return;
    }

    updatedItemQty(itemIndex, getValues("items")[itemIndex]?.quantity - 1);
  };

  const itemIndex = getValues("items").findIndex(
    (f: { item_id: string; unit: string }) =>
      f.unit === item?.unit && f.item_id === item.id
  );

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        className="border-[1px] px-4 h-[40px] border-gray-400"
        onClick={() => removeItemFromCard()}
        disabled={!getValues("items")[itemIndex]?.quantity}
      >
        -
      </button>
      {/* <span className="border-[1px] flex items-center px-4 h-[40px] border-gray-400">
        {getValues("items")[itemIndex]?.quantity || qty}
      </span> */}
      <input
        className="border-[1px] flex items-center  h-[40px] w-[39.2px] border-gray-400 focus:outline-none text-center"
        type="number"
        min={0}
        value={getValues("items")[itemIndex]?.quantity || 0}
        onChange={(e) => {
          if (+e.target.value < 0 || !Number.isInteger(+e.target.value)) {
            return;
          }

          if (!+e.target.value) {
            setQty(0);
            setValue(
              `items`,
              getValues(`items`).filter(
                (it: { item_id: string; unit: string }) => it.unit !== item.unit
              )
            );

            setUpdatedItem(
              updateIItemDailyUsage(
                fromShopping ? updatedItems : (item as any),
                deliveryDate,
                +e.target.value * packUnit
              )
            );
            return;
          }
          addItemtoCard(+e.target.value);
          setQty(+e.target.value);
        }}
      />
      <button
        type="button"
        className="border-[1px] px-4 h-[40px]  border-gray-400"
        onClick={() => addItemtoCard()}
      >
        +
      </button>
    </div>
  );
};

export default AddRemoveItems;
