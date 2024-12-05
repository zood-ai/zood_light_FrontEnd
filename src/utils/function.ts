import { IReconciliationReport } from "@/modules/Waste/Counts/types/types";
import { IItem } from "@/modules/purchases/PurchaseOrders/types/type";

export function SearchInList(
  list: { label: string; value: string }[],
  search: string
) {
  const result = list?.filter((item: any) => {
    return item?.label?.toLowerCase()?.includes(search?.toLowerCase());
  });
  return result;
}

export function changeFirstLetterToUpperCase(str: string) {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export function sumData(name: string, arr: IReconciliationReport[]) {
  const sum = arr.reduce(
    (
      acc,
      {
        opining_count = 0,
        opining_value = 0,
        delivers_count = 0,
        delivers_value = 0,
        transfer_count = 0,
        transfer_value = 0,
        waste_count = 0,
        waste_value = 0,
        batching_count = 0,
        batching_value = 0,
        closing_count = 0,
        closing_value = 0,
        used_count = 0,
        used_value = 0,
        pos_count = 0,
        pos_value = 0,
        variance_count = 0,
        variance_value = 0,
      }
    ) => {
      acc.opining_count += opining_count;
      acc.opining_value += opining_value;
      acc.delivers_count += delivers_count;
      acc.delivers_value += delivers_value;
      acc.transfer_count += transfer_count;
      acc.transfer_value += transfer_value;
      acc.waste_count += waste_count;
      acc.waste_value += waste_value;
      acc.batching_count += batching_count;
      acc.batching_value += batching_value;
      acc.closing_count += closing_count;
      acc.closing_value += closing_value;
      acc.used_count += used_count;
      acc.used_value += used_value;
      acc.pos_count += pos_count;
      acc.pos_value += pos_value;
      acc.variance_count += variance_count;
      acc.variance_value += variance_value;
      return acc;
    },
    {
      opining_count: 0,
      opining_value: 0,
      delivers_count: 0,
      delivers_value: 0,
      transfer_count: 0,
      transfer_value: 0,
      waste_count: 0,
      waste_value: 0,
      batching_count: 0,
      batching_value: 0,
      closing_count: 0,
      closing_value: 0,
      used_count: 0,
      used_value: 0,
      pos_count: 0,
      pos_value: 0,
      variance_count: 0,
      variance_value: 0,
    }
  );

  return {
    ...sum,
    name: name?.split("@")[0],
    includedGb: +name?.split("@")[1],
    is_main: 1,
    itemCount: arr?.length,
  };
}

// export const getMaxStock = (dailyUsage: IItem["item"]["daily_usage"]) => {
//   return Math.max(...dailyUsage.map((day) => day.in_stock));
// };

export const updateIItemDailyUsage = (
  data: IItem,
  deliveryDate?: string,
  quantity: number = 0
) => {
  let maxStock = 0;
  let neededCount = 0;

  let didNeedStock = !!data.daily_usage.find((d) => {
    if (d.date >= (deliveryDate || data.deliveryDate.delivery_date))
      return d.es_stock <= 0 || d.es_stock < d.usage;
  });

  const updatedDailyUsage = data.daily_usage.map((day, i) => {
    let delivery =
      quantity && deliveryDate && deliveryDate === day.date
        ? day.delivery + quantity
        : day.delivery;

    if (quantity > 0 && deliveryDate && deliveryDate === day.date) {
      maxStock = day.es_stock + quantity;
    } else if (
      quantity > 0 &&
      deliveryDate &&
      day.date > deliveryDate &&
      deliveryDate >= data.daily_usage[0]?.date
    ) {
      const updatedStock = maxStock - data.daily_usage[i - 1]?.usage;

      const maxIsNegative = updatedStock < 0;

      if (maxIsNegative) {
        maxStock = 0;
      } else {
        maxStock = updatedStock + delivery;
      }
    } else {
      maxStock = day.es_stock < 0 ? 0 : day.es_stock;
    }

    return {
      ...day,
      in_stock: maxStock,
      es_stock: day.es_stock < 0 ? 0 : day.es_stock,
      isCovered: maxStock >= day.usage,
      delivery,
    };
  });

  neededCount = updatedDailyUsage.reduce((acc, curr) => {
    if (
      curr.date >= (deliveryDate || data.deliveryDate.delivery_date) &&
      !curr.isCovered
    ) {
      return acc + curr.usage;
    }
    return acc;
  }, 0);

  return {
    ...data,
    neededCount,
    didNeedStock,
    daily_usage: updatedDailyUsage,
  };
};
// export const updateIItemDailyUsage = (
//   data: IItem,
//   deliveryDate?: string,
//   quantity: number = 0
// ) => {
//   let maxStock = getMaxStock(data?.item?.daily_usage);
//   let neededCount = 0;
//   let didNeedStock = !!data.item.daily_usage.find((d) => {
//     if (d.date >= (deliveryDate || data.deliveryDate.delivery_date))
//       return d.es_stock <= 0;
//   });

//   const updatedDailyUsage = data.item.daily_usage.map((day, i) => {

//     let delivery =
//       quantity && deliveryDate && deliveryDate === day.date
//         ? day.delivery + quantity
//         : day.delivery;

//     // maxStock

//     if (i === 0) {
//       maxStock = maxStock + delivery;
//     } else {
//       const updatedStock = maxStock - data.item.daily_usage[i - 1].usage;
//       const isAfterDeliveryDate =
//         quantity && deliveryDate && day.date >= deliveryDate;
//       const maxIsNegative = updatedStock < 0;

//       if (maxIsNegative) {
//         if (isAfterDeliveryDate) {
//           maxStock = 0 + delivery;
//         } else {
//           maxStock = 0;
//         }
//         // delivery = 0;
//       } else {
//         maxStock = updatedStock + delivery;
//       }
//       // maxStock = updatedStock < 0 ? 0 : updatedStock + delivery;
//     }

//     // let maxStock;
//     // if (quantity && deliveryDate && day.date >= deliveryDate) {
//     //   if (!!data.item.daily_usage.find((d) => d.es_stock)) {
//     //     maxStock = day.es_stock + quantity;
//     //   } else {
//     //     maxStock = day.es_stock + quantity;
//     //   }
//     // } else if (day.es_stock < 0) {
//     //   maxStock = 0;
//     // } else {
//     //   maxStock = day.es_stock;
//     // }

//     return {
//       ...day,
//       in_stock: maxStock,
//       es_stock: day.es_stock < 0 ? 0 : day.es_stock,
//       isCovered: maxStock >= day.usage,
//       delivery,
//     };
//   });

//   neededCount = updatedDailyUsage.reduce((acc, curr) => {
//     if (
//       curr.date >= (deliveryDate || data.deliveryDate.delivery_date) &&
//       !curr.isCovered
//     ) {
//       return acc + curr.usage;
//     }
//     return acc;
//   }, 0);

//   return {
//     item: {
//       ...data.item,
//       neededCount,
//       didNeedStock,
//       daily_usage: updatedDailyUsage,
//     },
//   };
// };

export const generateTableData = (data: { [key: string]: any }) => {
  const tableData: any = [
    {
      is_main: true,
      branches: Object.values(data).flat()[0]?.branches,
    },
  ];

  for (const key in data) {
    tableData.push({
      is_main: true,
      isCateogry: true,
      categoryName: key || "No category",
    });

    for (const item of data[key]) {
      tableData.push({
        item: item.name,
        itemUnit: item.last_unit,
        total: item.total,
        unit: item.first_unit,
        branches: item.branches,
        itemId: item.branches[0].item_id,
        status: item.status,
      });
    }
  }

  return tableData;
};

export const getTextColor = (status: number, total: number) => {
  if (status === 1) return "text-info";
  if (status === 2) return "text-success ";
  if (!status && total) return "text-warn";
  return "text-black";
};

export const getBgColor = (status: number, total: number) => {
  if (status === 1) return "bg-info";
  if (status === 2) return "bg-success ";
  if (!status && total) return "bg-warn";
  return "bg-slate-200 !text-black";
};

export const getDay = (day: string) => {
  switch (day) {
    case "Sat":
      return "Saturday"
    case "Sun":
      return "Sunday"
    case "Mon":
      return "Monday"
    case "Tue":
      return "Tuesday"
    case "Wed":
      return "Wednesday"
    case "Thu":
      return "Thursday"
    case "Fri":
      return "Friday"
    default:
      return ""
  }
}
