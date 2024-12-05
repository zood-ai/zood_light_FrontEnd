"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ArrowLeftIcon from "@/assets/icons/ArrowLeft";
import ArrowRightIcon from "@/assets/icons/ArrowRight";
import ArrowLeftLinetIcon from "@/assets/icons/ArrowLeftLine";
import ArrowRightLinetIcon from "@/assets/icons/ArrowRightLine";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "../skeleton";
import useFilterQuery from "@/hooks/useFilterQuery";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: any;
  pagination?: boolean;
  loading?: boolean;
  paginationData?: any;
  Select?: boolean;
  className?: string;
  setRowIndex?: React.Dispatch<React.SetStateAction<number | null>>;
  height?: string;
  rowStyle?: (condition: boolean) => string;
  countReport?: boolean;
  conditionProp?: string;
  customRowStyle?: string;
}

export function CustomTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  pagination = true,
  loading,
  paginationData,
  conditionProp = "",
  rowStyle = (condition: boolean) => (condition ? "h-[32px] p-0" : ""),
  setRowIndex,
  className,
  countReport,
  customRowStyle,
}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filterObj } = useFilterQuery();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 50,
        pageIndex: currentPage - 1, // Set initial page from URL
      },
    },
  });

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setSearchParams({ ...filterObj, page: nextPage.toString() });
    table.nextPage();
  };

  const handlePreviousPage = () => {
    const previousPage = currentPage - 1;
    if (previousPage > 0) {
      setSearchParams({ ...filterObj, page: previousPage.toString() });
      table.previousPage();
    }
  };

  const handlePreviousPageEnd = () => {
    setSearchParams({ ...filterObj, page: "1" });
  };

  const handleNextPageEnd = () => {
    setSearchParams({
      ...filterObj,
      page: paginationData?.last_page?.toString(),
    });
  };

  return (
    <>
      {loading ? (
        <div className="flex gap-5 flex-col mt-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton className="h-4 w-full  mt-2  -z-50" key={index} />
          ))}
        </div>
      ) : (
        <>
          <div>
            <Table className={className}>
              {table.getRowModel().rows?.length ? (
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            // onMouseDown={() => console.log("header")}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
              ) : (
                <></>
              )}

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row: any) => (
                    <TableRow
                      onMouseEnter={() => {
                        setRowIndex?.(row.index);
                      }}
                      onMouseLeave={() => {
                        setRowIndex?.(null);
                      }}
                      className={`${onRowClick ? "cursor-pointer" : ""} ${
                        countReport && !row.original?.is_main
                          ? "hover:bg-transparent"
                          : countReport && row.original?.is_main
                          ? `bg-gray-200 hover:bg-gray-200 ${
                              row.original?.isCateogry && customRowStyle
                            }`
                          : ""
                      }`}
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell: any) => {
                        return (
                          <TableCell
                            key={cell.id}
                            className={rowStyle(
                              cell?.row?.original?.[conditionProp]
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns?.length}
                      className="h-24 text-center"
                    >
                      <div>👀</div>
                      There’s no records to display
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {table.getRowModel().rows?.length ? (
            <>
              {pagination && (
                <div className="flex justify-end items-center space-x-[19px] border-t-[2px] pt-4">
                  <div className="flex w-[100px] items-center justify-center text-gray-500 font-[12px]">
                    {paginationData?.from} - {paginationData?.to} of{" "}
                    {paginationData?.total}
                  </div>
                  <div className="flex">
                    <div
                      onClick={handlePreviousPageEnd}
                      className={`flex justify-center items-center cursor-pointer ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <ArrowLeftLinetIcon height="15" />
                    </div>
                    <div
                      onClick={handlePreviousPage}
                      className={`flex justify-center items-center cursor-pointer ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <ArrowLeftIcon color="var(--gray-500)" height="20" />
                    </div>

                    <div
                      onClick={
                        currentPage === paginationData?.last_page
                          ? () => {}
                          : () => handleNextPage()
                      }
                      className={`flex justify-center items-center  cursor-pointer${
                        currentPage === paginationData?.last_page
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <ArrowRightIcon color="var(--gray-500)" height="20" />
                    </div>

                    <div
                      onClick={handleNextPageEnd}
                      className={`flex justify-center items-center  cursor-pointer${
                        currentPage === paginationData?.last_page
                          ? "disabled"
                          : ""
                      }`}
                    >
                      <ArrowRightLinetIcon height="15" />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}
