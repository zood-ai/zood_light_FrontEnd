import { Checkbox } from "@/components/ui/checkbox";
import SingleInput from "../components/SingleInput";
import { Skeleton } from "@/components/ui/skeleton";
import useProductionHttp from "./useProductionHttp";
import useFilterQuery from "@/hooks/useFilterQuery";
import { addDays, format } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";
import { Row } from "@tanstack/react-table";
import { IProduction } from "../types/type";
import { getBgColor, getTextColor } from "@/utils/function";

const useGenetateColumns = (
  shapeOfDatafromBackend: { [key: string]: IProduction } | null,
  rowsSelectedIds: string[],
  setRowsSelectedIds: Dispatch<SetStateAction<string[]>>,
  setIsShowDropDown: Dispatch<SetStateAction<boolean>>
) => {
  const { filterObj } = useFilterQuery();
  const date = filterObj.date || format(addDays(new Date(), 1), "yyyy-MM-dd");
  const { isPendingUpdate, updateproduction } = useProductionHttp();
  const [itemId, setItemId] = useState<string>("");

  const Columns = [
    {
      id: "select",
      cell: ({ row }: { row: Row<IProduction> }) => {
        if (row.original.is_main) return;

        if (
          row.original.status ||
          !row.original.total ||
          date < format(new Date(), "yyyy-MM-dd")
        )
          return;
        return (
          <Checkbox
            checked={rowsSelectedIds.includes(row.original.itemId)}
            disabled={!!row.original.status || !row.original.total}
            onClick={(e) => {
              e.stopPropagation();
              setIsShowDropDown(false);
            }}
            onCheckedChange={(value: boolean) => {
              if (value) {
                setRowsSelectedIds((prev) => [...prev, row.original.itemId]);
              } else {
                setRowsSelectedIds((prev) =>
                  prev.filter((id) => id !== row.original.itemId)
                );
              }
              row.toggleSelected(!!value);
            }}
          />
        );
      },
    },
    {
      accessorKey: "item",
      header: () => <div>Item</div>,
      cell: ({ row }: { row: Row<IProduction> }) => {
        if (!row.index) {
          return <div></div>;
        }

        if (row.original?.isCateogry) {
          return (
            <span className="font-bold">{row.original?.categoryName}</span>
          );
        }

        return (
          <div className="flex flex-col font-bold">
            {row.getValue("item") || "-"}
            <span
              className={`text-white ${getBgColor(
                row.original.status,
                row.original.total
              )}  w-fit px-2 rounded-sm  font-normal text-xs`}
            >
              {row.original?.itemUnit || "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "total",
      header: () => <div>Total</div>,
      cell: ({ row }: { row: Row<IProduction> }) => {
        if (!row.index) {
          return <div className="font-semibold">Need</div>;
        }

        if (row.original?.isCateogry) {
          return;
        }

        return (
          <div
            key={row.original.itemId}
            className={`
              flex items-center gap-2
            ${getTextColor(row.original.status, row.original.total)}`}
          >
            {isPendingUpdate && itemId === row.original.itemId ? (
              <Skeleton className="w-[50px] h-[20px]" />
            ) : (
              row.getValue("total")
            )}{" "}
            {row.original?.unit}
          </div>
        );
      },
    },
  ];

  const branches =
    Object.values(shapeOfDatafromBackend ?? {}).flat()[0]?.branches || [];
  for (const branch of branches) {
    Columns.push({
      accessorKey: branch?.name,
      header: () => <div>{branch?.name}</div>,
      cell: ({ row }: { row: Row<IProduction> }) => {
        if (!row.index) {
          return (
            <div className="flex gap-5">
              <span className="font-semibold">Has</span>
              {!branch.is_cpu && <span className="font-semibold">Need</span>}
            </div>
          );
        }

        if (row.original?.isCateogry) {
          return;
        }

        return (
          <SingleInput
            row={row}
            key={row.original.itemId}
            branch={branch}
            setItemId={setItemId}
            updateproduction={updateproduction}
          />
        );
      },
    });
  }

  return Columns;
};

export default useGenetateColumns;
