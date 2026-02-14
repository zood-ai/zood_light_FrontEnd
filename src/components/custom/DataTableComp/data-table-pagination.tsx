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
import { useTranslation } from 'react-i18next';

export function DataTablePagination({
  current_page,
  per_page,
  total,
  last_page,
  onPageSizeChange: _onPageSizeChange,
}: any) {
  const isRTL = useDirection();
  const { t } = useTranslation();
  const [currentPageState, setCurrentPageState] = useState(current_page);
  const [searchParams, setSearchParams] = useSearchParams();
  const safeTotal = Number(total) || 0;
  const safePerPage = Math.max(Number(per_page) || 0, 1);
  const safeLastPage = Math.max(Number(last_page) || 1, 1);
  const safeCurrentPage = Math.min(
    Math.max(Number(current_page) || 1, 1),
    safeLastPage
  );
  const fromRecord =
    safeTotal === 0 ? 0 : (safeCurrentPage - 1) * safePerPage + 1;
  const toRecord =
    safeTotal === 0 ? 0 : Math.min(safeCurrentPage * safePerPage, safeTotal);

  const firstButtonTarget = isRTL ? safeLastPage : 1;
  const lastButtonTarget = isRTL ? 1 : safeLastPage;
  const previousPageTarget = isRTL ? safeCurrentPage + 1 : safeCurrentPage - 1;
  const nextPageTarget = isRTL ? safeCurrentPage - 1 : safeCurrentPage + 1;

  const clampPage = (page: number) => Math.min(Math.max(page, 1), safeLastPage);

  const handlePageChange = (page: number) => {
    const nextPage = clampPage(page);
    if (nextPage === safeCurrentPage) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', nextPage.toString());
    setSearchParams(nextParams);
  };

  useEffect(() => {
    setCurrentPageState(current_page);
  }, [current_page]);

  return (
    <div className="mt-2 flex w-full flex-col items-center gap-1.5 px-1">
      <div
        className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="hidden h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:flex disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:opacity-30"
            onClick={() => handlePageChange(firstButtonTarget)}
            disabled={safeCurrentPage === firstButtonTarget}
            aria-label="First page"
          >
            {isRTL ? (
              <DoubleArrowLeftRTLIcon
                isActive={safeCurrentPage !== firstButtonTarget}
              />
            ) : (
              <DoubleArrowLeftIcon className="h-7 w-7 text-mainText" />
            )}
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:opacity-30"
            onClick={() => handlePageChange(previousPageTarget)}
            disabled={
              previousPageTarget < 1 || previousPageTarget > safeLastPage
            }
            aria-label="Previous page"
          >
            {isRTL ? (
              <SingleLeftArrowRTLIcon
                isActive={previousPageTarget >= 1 && previousPageTarget <= safeLastPage}
              />
            ) : (
              <ChevronLeftIcon className="h-7 w-7 text-mainText" />
            )}
          </button>

          <div
            dir="ltr"
            className="flex items-center gap-2 rounded-md px-1"
          >
            <Input
              onBlur={() => {
                const parsed = parseInt(String(currentPageState), 10);
                const clamped = clampPage(parsed || safeCurrentPage);
                setCurrentPageState(clamped);
                handlePageChange(clamped);
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                const parsed = parseInt(String(currentPageState), 10);
                const clamped = clampPage(parsed || safeCurrentPage);
                setCurrentPageState(clamped);
                handlePageChange(clamped);
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) {
                  setCurrentPageState('');
                  return;
                }
                const parsed = parseInt(value, 10);
                if (!Number.isNaN(parsed)) {
                  setCurrentPageState(parsed);
                }
              }}
              autoComplete="off"
              type="number"
              value={currentPageState}
              min={1}
              max={safeLastPage}
              className="h-8 w-[56px] border-0 bg-transparent px-0 text-center font-medium text-mainText shadow-none [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <div className="min-w-[70px] text-center text-sm font-medium text-mainText">
              {safeCurrentPage} / {safeLastPage}
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:opacity-30"
            onClick={() => handlePageChange(nextPageTarget)}
            disabled={nextPageTarget < 1 || nextPageTarget > safeLastPage}
            aria-label="Next page"
          >
            {isRTL ? (
              <SingleRightArrowRTLIcon
                isActive={nextPageTarget >= 1 && nextPageTarget <= safeLastPage}
              />
            ) : (
              <ChevronRightIcon className="h-7 w-7 text-mainText" />
            )}
          </button>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:opacity-30"
            onClick={() => handlePageChange(lastButtonTarget)}
            disabled={safeCurrentPage === lastButtonTarget}
            aria-label="Last page"
          >
            {isRTL ? (
              <div className="mx-1 flex items-center justify-center">
                <DoubleArrowRightRTLIcon isActive={safeCurrentPage !== lastButtonTarget} />
              </div>
            ) : (
              <DoubleArrowRightIcon className="h-7 w-7 text-mainText" />
            )}
          </button>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        {t('PAGINATION_RESULTS_LABEL', {
          from: fromRecord,
          to: toRecord,
          total: safeTotal,
        })}
      </div>
    </div>
  );
}
