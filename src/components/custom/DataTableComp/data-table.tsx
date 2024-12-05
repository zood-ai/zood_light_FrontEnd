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

import { useDispatch } from 'react-redux';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';

import { DataTableRowActions } from './data-table-row-actions';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { Input } from '@/components/ui/input';
import IconInput from '../InputWithIcon';
import search from '/icons/search.svg';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { useNavigate } from 'react-router-dom';
import { titleMapping } from '@/constant/constant';
import { DatePicker } from 'antd';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';

const { RangePicker } = DatePicker;

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
  dashBoard: boolean;
  handleSearch: any;
}
export function DataTable<TData, TValue>({
  columns,
  data,
  actionBtn,
  handleRowClick,
  handleEdit,
  handleDel,
  filterBtn,
  dashBoard = false,
  meta,
  loading,
  handleSearch,
  actionText,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const dispatch = useDispatch();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [fromDate, setFromData] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 50, // Set this to the desired page size
  });
  const { t } = useTranslation();
  const isRtl = useDirection();
  const filteredData = React.useMemo(() => {
    if (!fromDate || !endDate) return data;
    const from = parseISO(fromDate);
    const to = parseISO(endDate);
    return data.filter((item: any) => {
      const itemDate = parseISO(
        item.business_date ? item.business_date.split(' ')[0] : item.created_at
      );
      return itemDate >= from && itemDate <= to;
    });
  }, [data, fromDate, endDate]);
  const table = useReactTable({
    data: filteredData,
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
  const navigate = useNavigate();
  const pagePath = window.location.pathname; // Get the current path
  const title = titleMapping(pagePath);
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setFromData(dateStrings[0]);
    setEndDate(dateStrings[1]);
  };
  const customDatePickerClass = ` 
  .ant-picker-focused {
    border-color: #7272F6 !important; /* Change border color on focus */
  }
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end {
    background-color: #7272f633 !important; /* Change this to your desired color */
  }
  .ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-in-range:not(.ant-picker-cell-disabled):before,
  .ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-disabled):before,
  .ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-disabled):before {
    background-color: #7272f633 !important;
  } 
  .ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-disabled) .ant-picker-cell-inner{
    background-color: #7272F6 !important;
  }
  :where(.css-dev-only-do-not-override-1x0dypw).ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-selected:not(.ant-picker-cell-disabled) .ant-picker-cell-inner,
  :where(.css-dev-only-do-not-override-1x0dypw).ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-disabled) .ant-picker-cell-inner,
  :where(.css-dev-only-do-not-override-1x0dypw).ant-picker-dropdown .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-disabled) .ant-picker-cell-inner {
    background-color: #7272F6 !important; /* Change this to your desired color */
  }
`;
  return (
    <>
      {/* <style>{customDatePickerClass}</style> */}
      {!loading ? (
        <>
          <div className="space-y-4 bag-background">
            {actionBtn && (
              <DataTableToolbar
                actionText={t(`${actionText}`)}
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
              <div className="h-fit ps-[16px]  flex z-10   py-3 mt-4 text-right bg-background  border border-mainBorder border-solid  border-b-0 items-center rounded-t-[8px]">
                <div className="my-auto text-base font-semibold text-mainText min-w-fit ">
                  {/* {title?.ar === 'لوحة التحكم'
                    ? t('LATEST_INVOICES')
                    : title?.ar} */}
                  {isRtl ? title?.ar : title?.en}
                </div>
                <div className="flex flex-wrap gap-y-2 flex-grow">
                  <div className="max-w-[303px] ms-[14px]">
                    <IconInput
                      onChange={(e) => {
                        // e.preventDefault();
                        handleSearch(e.target.value);
                      }}
                      inputClassName="h-[35px]"
                      placeholder={t('SEARCH_TABLE_PLACEHOLDER')}
                      iconSrc={search}
                    />
                  </div>
                  <RangePicker
                    placeholder={[t('START_DATE'), t('END_DATE')]}
                    className="max-w-[303px] ms-[14px] text-black"
                    onChange={handleDateChange}
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
                            if (dashBoard) {
                              // (row.original);
                              handleRowClick(row.original);
                              dispatch(toggleActionView(true));
                              dispatch(toggleActionViewData(row.original));
                              // navigate(`${url}/edit/${row.original.id}`);
                            } else {
                              navigate(`edit/${row.original.id}`);
                            }
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
