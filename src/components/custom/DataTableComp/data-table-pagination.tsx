import DoubleArrowLeftRTLIcon from '@/components/Icons/DoubleArrowLeftRTLIcon';
import SingleLeftArrowRTLIcon from '@/components/Icons/SingleLeftArrowRTLIcon';
import SingleRightArrowRTLIcon from '@/components/Icons/SingleRightArrowRTLIcon';
import DoubleArrowRightRTLIcon from '@/components/Icons/DoubleArrowRightRTLIcon';
import useDirection from '@/hooks/useDirection';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { set } from 'date-fns';

export function DataTablePagination({
  current_page,
  per_page,
  total,
  last_page,
  onPageSizeChange,
}: any) {
  const isRTL = useDirection();
  const [currentPageState, setCurrentPageState] = useState(current_page);
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > last_page) return;
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setCurrentPageState(current_page);
  }, [current_page]);

  return (
    <div
      className={`flex items-center justify-center overflow-auto px-2 ${
        isRTL ? 'flex-row-reverse' : ''
      }`}
    >
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
          <div
            className="hidden h-8 w-8 p-0 lg:flex mx-1 rounded-full"
            // onClick={() => handlePageChange(1)}
            onClick={() => handlePageChange(last_page)}
          >
            {isRTL ? (
              <DoubleArrowLeftRTLIcon
                // isActive={currentPageState !== 1}
                isActive={currentPageState !== last_page}
              />
            ) : (
              <DoubleArrowLeftIcon />
            )}
          </div>

          <div
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPageState + 1)}
          >
            {isRTL ? (
              <SingleLeftArrowRTLIcon
                // isActive={currentPageState !== 1}
                isActive={currentPageState !== last_page}
              />
            ) : (
              <ChevronLeftIcon />
            )}
          </div>

          <div
            dir="ltr"
            className={`flex text-sm text-muted-foreground justify-center items-center gap-md bg-black0 px-2`}
          >
            <Input
              onChange={(e) => {
                setCurrentPageState(
                  parseInt(e.target.value) || currentPageState
                );
                handlePageChange(parseInt(e.target.value) || currentPageState);
              }}
              autoComplete="off"
              type="number"
              value={currentPageState}
              min={1}
              max={last_page}
              className="text-center text-main h-8 w-[60px] px-0 border rounded-sm border-mainBorde outline-none focus-visible:ring-12"
            />
            <div className="text-mainText">
              {currentPageState}-{last_page} of {last_page}
            </div>
          </div>

          <div
            className="h-8 w-8 p-0 mx-1"
            onClick={() => handlePageChange(currentPageState - 1)}
          >
            {isRTL ? (
              <SingleRightArrowRTLIcon isActive={currentPageState !== 1} />
            ) : (
              <ChevronRightIcon />
            )}
          </div>

          <div
            className="  h-8 w-8 p-0 flex "
            onClick={() => handlePageChange(1)}
          >
            {isRTL ? (
              <div className="mx-1">
                <DoubleArrowRightRTLIcon isActive={currentPageState !== 1} />
              </div>
            ) : (
              <DoubleArrowRightIcon />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
