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

export function DataTablePagination({
  current_page,
  per_page,
  total,
  last_page,
  onPageSizeChange,
}: any) {
  const isRTL = useDirection();
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > last_page) return;
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

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
            onClick={() => handlePageChange(1)}
          >
            {isRTL ? (
              <DoubleArrowLeftRTLIcon isActive={current_page !== 1} />
            ) : (
              <DoubleArrowLeftIcon />
            )}
          </div>

          <div
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(current_page - 1)}
          >
            {isRTL ? (
              <SingleLeftArrowRTLIcon isActive={current_page !== 1} />
            ) : (
              <ChevronLeftIcon />
            )}
          </div>

          <div
            dir="ltr"
            className={`flex text-sm text-muted-foreground justify-center items-center gap-md bg-black0 px-2`}
          >
            <div className="flex justify-center text-main items-center w-[32px] h-[32px] bg-white border border-1 rounded-sm border-mainBorder">
              {current_page}
            </div>
            <div className="text-mainText">
              {current_page}-{last_page} of {last_page}
            </div>
          </div>

          <div
            className="h-8 w-8 p-0 mx-1"
            onClick={() => handlePageChange(current_page + 1)}
          >
            {isRTL ? (
              <SingleRightArrowRTLIcon isActive={current_page !== last_page} />
            ) : (
              <ChevronRightIcon />
            )}
          </div>

          <div
            className="  h-8 w-8 p-0 flex "
            onClick={() => handlePageChange(last_page)}
          >
            {isRTL ? (
              <div className='mx-1'>


                <DoubleArrowRightRTLIcon isActive={current_page !== last_page} />
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
