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
        <div className="h-[108px] md:h-[78px]  flex z-10 flex-wrap gap-3.5 px-5 py-3 mt-4 text-right bg-background  border border-gray-200 border-solid max-md:px-5 border-b-0 items-center">
          <div className="my-auto text-base font-semibold text-zinc-800  ">
            الفواتير الحديثة
          </div>
          <div className="max-w-[303px]">
            <IconInput
              placeholder="بحث عن فاتورة, عميل, تاريخ"
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/cccbd13d86e96c7d597403139b3bca31e0ba15a35f6c7f727bfcddcc54ff2c34?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
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
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
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
