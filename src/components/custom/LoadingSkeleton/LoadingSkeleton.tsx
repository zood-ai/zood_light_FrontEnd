import React from 'react';

import { LoadingSkeletonProps } from './LoadingSkeleton.types';

import './LoadingSkeleton.css';

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = () => {
  return (
    <>
      <>
        <h3 className="h-3 bg-gray-300 rounded-full  w-48 mb-4" />
        <div role="status" className="flex max-w-sm animate-pulse ">
          <div className="flex-shrink-0 flex">
            <span className="flex justify-center items-center bg-gray-300 rounded-sm me-4 w-28 mt-5 h-12 " />
            <span className="flex justify-center items-center bg-gray-300 rounded-sm me-4 w-28 mt-5 h-12 " />
          </div>
          <div className="ml-4 mt-2 w-full">
            <p className="h-2 bg-gray-300 rounded-full w-[320px] mb-2.5" />
            <p className="h-2 bg-gray-300 rounded-full w-[320px] mb-2.5" />
            <p className="h-2 bg-gray-300 rounded-full w-[320px] mb-2.5" />
            <p className="h-2 bg-gray-300 rounded-full w-[320px] mb-2.5" />
          </div>
        </div>
        {/* <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
            </div>
          </div> */}

        <div
          role="status"
          className="border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
          </div>

          <span className="sr-only">Loading...</span>
        </div>
        <div
          role="status"
          className="border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
          </div>

          <span className="sr-only">Loading...</span>
        </div>
        <div
          role="status"
          className="border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
          </div>

          <span className="sr-only">Loading...</span>
        </div>
        <div
          role="status"
          className="border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
          </div>

          <span className="sr-only">Loading...</span>
        </div>
        <div
          role="status"
          className="border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
          </div>

          <span className="sr-only">Loading...</span>
        </div>
        <div
          role="status"
          className="border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
          </div>

          <span className="sr-only">Loading...</span>
        </div>
        <div
          role="status"
          className="border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
          </div>

          <span className="sr-only">Loading...</span>
        </div>
        <div
          role="status"
          className="border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="flex items-center w-full max-w-[480px]">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
              <div className="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
          </div>

          <span className="sr-only">Loading...</span>
        </div>
      </>
    </>
  );
};
