import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DataTableRowActions } from './data-table-row-actions';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { Input } from '@/components/ui/input';
import IconInput from '../InputWithIcon';
import search from '/icons/search.svg';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { useNavigate } from 'react-router-dom';
import { titleMapping } from '@/constant/constant';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actionBtn?: any;
  handleRowClick: any;
  handleEdit: any;
  handleDel: any;
  filterBtn: any;
  meta?: any;
  loading?: boolean;
  actionText?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  actionBtn,
  handleRowClick,
  handleEdit,
  handleDel,
  filterBtn,
  meta,
  loading,
  actionText,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 50, // Set this to the desired page size
  });
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  const { current_page, last_page, per_page, total } = meta || {};
  console.log('Screen Height:', window.innerHeight);
  let navigate = useNavigate();
  const pagePath = window.location.pathname; // Get the current path
  const title = titleMapping(pagePath);
  return (
    <>
      {!loading ? (
        <>
          <div className="space-y-4 bag-background">
            {actionBtn && (
              <DataTableToolbar
                actionText={actionText}
                table={table}
                actionBtn={actionBtn}
              />
            )}
            <div className="rounded-md bordera">
              {/* <Input
          placeholder={'FILTER'}
          value={''}
          onChange={filterBtn}
          className={`h-8 w-[150px] lg:w-[250px]  `}
        /> */}
              <div className="h-[68px] ps-[16px]  flex z-10 flex-wrap  py-3 mt-4 text-right bg-background  border border-mainBorder border-solid  border-b-0 items-center rounded-t-[8px]">
                <div className="my-auto text-base font-semibold text-mainText  ">
                   {title.ar}
                </div>
                <div className="max-w-[303px] ms-[14px]">
                  <IconInput
                    inputClassName="h-[35px]"
                    placeholder="بحث عن فاتورة, عميل, تاريخ"
                    iconSrc={search}
                  />
                </div>
              </div>

              <div className="rounded-md rounded-t-none border bg-background ">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead
                              className="h-[63px]"
                              key={header.id}
                              colSpan={header.colSpan}
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
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row: any) => (
                        <TableRow
                          style={{ cursor: 'pointer' }}
                          key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                          onClick={() => {
                            navigate(`edit/${row.original.id}`);
                            // handleRowClick(row.original);
                          }}
                        >
                          {row.getVisibleCells()?.map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DataTablePagination
              current_page={current_page || 1}
              per_page={per_page || 1}
              total={total || 1}
              last_page={last_page || 1}
              // onPageChange={(newPageIndex) => {
              //   setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }))
              // }}
              onPageSizeChange={(newPageSize) => {
                setPagination({ pageIndex: 0, pageSize: newPageSize });
              }}
            />
          </div>
        </>
      ) : (
        <LoadingSkeleton />
      )}
    </>
  );
}
