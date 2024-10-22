import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/custom/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams } from 'react-router-dom';
import useDirection from '@/hooks/useDirection';

interface PaginationProps {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  onPageSizeChange: (newPerPage: number) => void;
}

export function DataTablePagination({
  current_page,
  per_page,
  total,
  last_page,
  onPageSizeChange,
}: PaginationProps) {
  const isRTL = useDirection();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle page changes by updating the search params
  const handlePageChange = (page: number) => {
    if (page < 1 || page > last_page) return; // Prevent invalid page numbers
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  // Handle per page changes by updating the search params
  const handlePerPageChange = (newPerPage: number) => {
    searchParams.set('page', '1'); // Reset to page 1 when per page changes
    searchParams.set('per_page', newPerPage.toString());
    setSearchParams(searchParams);
  };

  return (
    <div
      className={`flex items-center justify-between overflow-auto px-2 ${
        isRTL ? 'flex-row-reverse' : ''
      }`}
    >
      <div className={`hidden flex-1 text-sm text-muted-foreground sm:block`}>
        Page {current_page} of {last_page} | {total} total items.
      </div>
      <div
        className={`flex items-center ${
          isRTL ? 'sm:space-x-reverse' : 'sm:space-x-6'
        } lg:space-x-8`}
      >
        <div
          className={`flex items-center space-x-2 ${
            isRTL ? 'space-x-reverse' : ''
          }`}
        >
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select
            value={`${per_page}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value)); // Pass new size

              handlePerPageChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={per_page} />
            </SelectTrigger>
            <SelectContent side={isRTL ? 'bottom' : 'top'}>
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {current_page} of {last_page}
        </div>
        <div
          className={`flex items-center space-x-2 ${
            isRTL ? 'space-x-reverse' : ''
          }`}
        >
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={current_page === 1}
          >
            <span className="sr-only">Go to first page</span>
            {isRTL ? (
              <DoubleArrowRightIcon className="h-4 w-4" />
            ) : (
              <DoubleArrowLeftIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(current_page - 1)}
            disabled={current_page === 1}
          >
            <span className="sr-only">Go to previous page</span>
            {isRTL ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(current_page + 1)}
            disabled={current_page === last_page}
          >
            <span className="sr-only">Go to next page</span>
            {isRTL ? (
              <ChevronLeftIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(last_page)}
            disabled={current_page === last_page}
          >
            <span className="sr-only">Go to last page</span>
            {isRTL ? (
              <DoubleArrowLeftIcon className="h-4 w-4" />
            ) : (
              <DoubleArrowRightIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
