import { memo, useEffect, useState } from "react";
import { IItem, IUpdatedItem } from "../types/type";
import { format } from "date-fns";
import AddRemoveItems from "./AddRemoveItems";
import { Button } from "@/components/ui/button";
import StarIcon from "@/assets/icons/Star";
import RightCircleIcon from "@/assets/icons/RightCircle";
import CarIcon from "@/assets/icons/Car";
import { updateIItemDailyUsage } from "@/utils/function";
import {
  FieldValues,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface ItemProps {
  item: any;
  deliveryDate: IItem["deliveryDate"]["delivery_date"];
  reset?: boolean;
  showCart?: boolean;
  getValues: UseFormGetValues<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}
const Item = ({
  item,
  deliveryDate,
  reset,
  showCart,
  getValues,
  setValue,
}: ItemProps) => {
  const [covredCount, setCoveredCount] = useState(0);
  const [qty, setQty] = useState(0);
  const [updatedItem, setUpdatedItem] = useState<IUpdatedItem>();
  const [clickedDay, setClickedDay] = useState<number>(-1);

  useEffect(() => {
    setClickedDay(-1);
    setQty(0);
  }, [reset]);

  useEffect(() => {
    let covred = 0;
    item.daily_usage.forEach((day, i) => {
      if (day.es_stock < day.usage && day.date >= deliveryDate) {
        covred = covred + day.usage;
        setCoveredCount(covred);
      }
    });

    setUpdatedItem(
      updateIItemDailyUsage({
        ...item,
        deliveryDate: { delivery_date: deliveryDate },
      })
    );
  }, [deliveryDate]);

  useEffect(() => {
    const quantity =
      (getValues(`items`)?.find(
        (it: any) => it.unit === item.unit && it.item_id === item.id
      )?.quantity || 0) * packUnit;
    setUpdatedItem(updateIItemDailyUsage(item, deliveryDate, quantity));
  }, [showCart, item]);

  const packUnit = item?.pack_per_case
    ? item?.pack_per_case * item?.pack_size
    : item?.pack_size;

  console.log({ items: getValues(`items`) });

  const updatedItemQty = (itemIndex: number, quantity: number) => {
    setQty(quantity);
    setUpdatedItem(
      updateIItemDailyUsage(
        updatedItem as any,
        deliveryDate,
        quantity * packUnit
      )
    );

    const updatedItem2 = getValues(`items`).map(
      (it: { item_id: string; qty: number }, index: number) => {
        if (index === itemIndex) {
          return {
            ...it,
            quantity: quantity,
            invoice_quantity: quantity,
            total_tax: item.tax_amount * quantity,
            supplier_item_id: item.supplier_item_id,
            cost: item.cost,
            sub_total: item.cost * quantity,
            total_cost: item.cost * quantity + item.tax_amount,
          };
        }
        return it;
      }
    );
    setValue(`items`, updatedItem2);
  };

  const addItemtoCard = () => {
    const itemIndex = getValues(`items`).findIndex(
      (it: any) => it.unit === item.unit && it.item_id === item.id
    );

    const quantity =
      Math.ceil(covredCount / packUnit) -
      (getValues(`items`).find(
        (it: any) => it.unit === item.unit && it.item_id === item.id
      )?.quantity || 0);

    if (itemIndex === -1) {
      setUpdatedItem(
        updateIItemDailyUsage(
          updatedItem as any,
          deliveryDate,
          quantity * packUnit
        )
      );
      setQty(Math.ceil(covredCount / packUnit));

      setValue(
        `items`,
        [
          ...getValues(`items`),
          {
            item_id: item?.id,
            supplier_item_id: item.supplier_item_id,
            id: item?.id,
            pack_per_case: item.pack_per_case,
            pack_size: item.pack_size,
            quantity:
              Math.ceil(covredCount / packUnit) -
              (getValues(`items`).find(
                (it: any) => it.unit === item.unit && it.item_id === item.id
              )?.quantity || 0),
            cost: item.cost,
            invoice_quantity:
              Math.ceil(covredCount / packUnit) -
              (getValues(`items`).find(
                (it: any) => it.unit === item.unit && it.item_id === item.id
              )?.quantity || 0),
            total_tax:
              item.tax_amount * Math.ceil(covredCount / packUnit) -
              (getValues(`items`).find(
                (it: any) => it.unit === item.unit && it.item_id === item.id
              )?.quantity || 0),
            tax_group_id: item.tax_group?.id,
            tax_amount: item.tax_amount,
            sub_total:
              item.cost * Math.ceil(covredCount / packUnit) -
              (getValues(`items`).find(
                (it: any) => it.unit === item.unit && it.item_id === item.id
              )?.quantity || 0),
            total_cost:
              item.cost * Math.ceil(covredCount / packUnit) -
              (getValues(`items`).find(
                (it: any) => it.unit === item.unit && it.item_id === item.id
              )?.quantity || 0) +
              item.tax_amount,
            packUnit,
            unit: item.unit,
          },
        ],
        { shouldValidate: true }
      );
    } else {
      updatedItemQty(
        itemIndex,
        getValues(`items`)[itemIndex].quantity +
          Math.ceil(covredCount / packUnit) -
          (getValues(`items`).find((it: any) => it.unit === item.unit)
            ?.quantity || 0)
      );
    }
  };

  return (
    <div className="mt-4 border-b-[#F5F5F5] border-b-[2px] pb-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <p className="text-textPrimary font-semibold text-[16px]">
            {item.name}
          </p>
          <p className="text-textPrimary text-[12px] font-medium bg-[#F2F2F6] flex items-center justify-center rounded-[4px] h-[20px] w-16">
            {item.unit}
          </p>
        </div>

        <AddRemoveItems
          qty={item.quantity || qty}
          setQty={setQty}
          item={item}
          packUnit={packUnit}
          getValues={getValues}
          setValue={setValue}
          setUpdatedItem={setUpdatedItem}
          deliveryDate={deliveryDate}
        />
      </div>
      <div className="flex gap-20 mt-3">
        <span className="text-[16px] font-semibold w-[20px]">Daily usage</span>
        <div className="flex items-center justify-between flex-1">
          {updatedItem?.daily_usage.map((day, i) => {
            return (
              <div
                onClick={() => {
                  if (clickedDay === i) {
                    setClickedDay(-1);
                    return;
                  }
                  setClickedDay(i);
                }}
                className={`flex flex-col ${
                  clickedDay < i || clickedDay < 0
                    ? "opacity-50"
                    : "opacity-100"
                } select-none cursor-pointer items-center gap-2 mr-6 font-semibold ${
                  day.isCovered ? "text-success" : "text-[#B1405B]"
                } `}
                key={day.day}
              >
                <p className="flex items-center gap-2">
                  {i === 0 ? "Today" : day.day.slice(0, 3)}
                  {item.daily_usage.reduce(
                    (acc, curr) => acc + curr.delivery,
                    0
                  ) > Math.ceil(covredCount / packUnit) &&
                    day.delivery > 0 && <CarIcon />}
                </p>
                <p>{day.usage}</p>
              </div>
            );
          })}
        </div>
      </div>
      {clickedDay >= 0 && (
        <div className="flex gap-16 mt-3 text-gray-500">
          <span>
            In stock {item.daily_usage[clickedDay].day.slice(0, 3)}:{" "}
            {updatedItem?.daily_usage?.[clickedDay]?.in_stock} {item.pack_unit}
          </span>
          <span>
            Deliveries: {updatedItem?.daily_usage?.[clickedDay]?.delivery}{" "}
            {item.pack_unit}
          </span>
          <span>
            Usage {updatedItem?.daily_usage?.[clickedDay]?.day.slice(0, 3)}:{" "}
            {item.daily_usage[clickedDay]?.usage} {item.pack_unit}
          </span>
        </div>
      )}

      {/* -1 is fallback if the neededCount is undefined */}
      {updatedItem?.neededCount ?? -1 > 0 ? (
        <div className="bg-warn-foreground flex justify-between items-center mt-3  text-textPrimary  gap-2 p-2 rounded-[4px] border border-[#E7D3D9]">
          <div className="flex items-center gap-2">
            <StarIcon />
            <div>
              To cover {format(new Date(deliveryDate), "eee")} -{" "}
              {item.daily_usage[item.daily_usage.length - 1].day.slice(0, 3)},
              you’ll need to{" "}
              <strong>
                {Math.ceil((covredCount ?? 0) / packUnit) -
                  (getValues("items").find(
                    (f: { item_id: string; unit: string }) =>
                      f.unit === item?.unit && f.item_id === item.id
                  )?.quantity || 0)}{" "}
                pack ({item.unit})
              </strong>{" "}
              of <strong> {item.name}</strong>
            </div>
          </div>
          <Button
            type="button"
            className="font-semibold bg-primary"
            // disabled={defaultDeliveryDate !== deliveryDate}
            onClick={() => addItemtoCard()}
          >
            Add to cart
          </Button>
        </div>
      ) : updatedItem?.didNeedStock && updatedItem?.neededCount === 0 ? (
        <p className="bg-[#CBF7F2] flex items-center gap-2 border border-success mt-3 py-[10px] px-2 rounded-sm text-textPrimary">
          <RightCircleIcon />
          <span className="tracking-wider">
            This order will cover you from{" "}
            <strong>{format(new Date(deliveryDate), "eee")}</strong> to{" "}
            <strong>
              {item.daily_usage[item.daily_usage.length - 1].day.slice(0, 3)}
            </strong>
          </span>
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default memo(Item);
