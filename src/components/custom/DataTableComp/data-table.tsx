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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actionBtn?: any;
  handleRowClick: any;
  handleEdit: any;
  handleDel: any;
  filterBtn: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  actionBtn,
  handleRowClick,
  handleEdit,
  handleDel,
  filterBtn,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
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

  return (
    <div className="space-y-4 bag-background">
      {actionBtn && <DataTableToolbar table={table} actionBtn={actionBtn} />}
      <div className="rounded-md bordera">
        {/* <Input
          placeholder={'FILTER'}
          value={''}
          onChange={filterBtn}
          className={`h-8 w-[150px] lg:w-[250px]  `}
        /> */}
        <div className="h-[68px] ps-[16px]  flex z-10 flex-wrap  py-3 mt-4 text-right bg-background  border border-mainBorder border-solid  border-b-0 items-center rounded-t-[8px]">
          <div className="my-auto text-base font-semibold text-mainText  ">
            الفواتير الحديثة
          </div>
          <div className="max-w-[303px] ms-[14px]">
            <IconInput
              inputClassName="h-[35px]"
              placeholder="بحث عن فاتورة, عميل, تاريخ"
              iconSrc={search}
            />
          </div>
        </div>

        <div className="rounded-md rounded-t-none border bg-background">
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: any, index) => (
                  <TableRow
                    className={`h-[63px] ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                    } font-bold`}
                    style={{ cursor: 'pointer' }}
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => {
                      handleRowClick(row.original);
                    }}
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell key={cell.id} className="">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}

                    {/* <TableCell key={`new-col-${row.id}`}>
                      <DataTableRowActions
                        row={row}
                        handleDel={() => handleDel(row.original)}
                        handleEdit={() => handleEdit(row.original)}
                      />
                    </TableCell> */}
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
      <DataTablePagination table={table} />
    </div>
  );
}
