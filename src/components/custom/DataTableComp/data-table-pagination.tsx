import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import useDirection from '@/hooks/useDirection'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const isRTL = useDirection();

  return (
    <div className={`flex items-center justify-between overflow-auto px-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={`hidden flex-1 text-sm text-muted-foreground sm:block`}>
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className={`flex items-center ${isRTL ? 'sm:space-x-reverse' : 'sm:space-x-6'} lg:space-x-8`}>
        <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
          <p className='hidden text-sm font-medium sm:block'>Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side={isRTL ? 'bottom' : 'top'}>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to first page</span>
            {isRTL ? <DoubleArrowRightIcon className='h-4 w-4' /> : <DoubleArrowLeftIcon className='h-4 w-4' />}
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to previous page</span>
            {isRTL ? <ChevronRightIcon className='h-4 w-4' /> : <ChevronLeftIcon className='h-4 w-4' />}
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to next page</span>
            {isRTL ? <ChevronLeftIcon className='h-4 w-4' /> : <ChevronRightIcon className='h-4 w-4' />}
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to last page</span>
            {isRTL ? <DoubleArrowLeftIcon className='h-4 w-4' /> : <DoubleArrowRightIcon className='h-4 w-4' />}
          </Button>
        </div>
      </div>
    </div>
  )
}
