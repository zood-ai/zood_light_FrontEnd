import React from 'react';
import { LoadingSkeletonProps } from './LoadingSkeleton.types';
import './LoadingSkeleton.css';

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = () => {
  return (
    <div role="status" className="animate-pulse">
      <div className="flex-shrink-0 flex">
        <span className="flex justify-center items-center bg-gray-300 rounded-sm me-4 w-28 mt-5 h-12 " />
        <span className="flex justify-center items-center bg-gray-300 rounded-sm me-4 w-28 mt-5 h-12 " />
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {/* Add the header placeholders according to your table */}
            <th className="p-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>{' '}
              {/* Action column */}
            </th>
            <th className="p-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>{' '}
              {/* Date column */}
            </th>
            <th className="p-2">
              <div className="h-4 bg-gray-300 rounded w-40"></div>{' '}
              {/* Phone column */}
            </th>
            <th className="p-2">
              <div className="h-4 bg-gray-300 rounded w-48"></div>{' '}
              {/* Client Name */}
            </th>
            <th className="p-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>{' '}
              {/* Invoice Number */}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Repeat skeleton rows */}
          {[...Array(10)].map((_, i) => (
            <tr key={i}>
              <td className="p-2">
                <div className="h-6 bg-gray-200 rounded w-20"></div>{' '}
                {/* Action column */}
              </td>
              <td className="p-2">
                <div className="h-6 bg-gray-200 rounded w-28"></div>{' '}
                {/* Date column */}
              </td>
              <td className="p-2">
                <div className="h-6 bg-gray-200 rounded w-36"></div>{' '}
                {/* Phone column */}
              </td>
              <td className="p-2">
                <div className="h-6 bg-gray-200 rounded w-44"></div>{' '}
                {/* Client Name */}
              </td>
              <td className="p-2">
                <div className="h-6 bg-gray-200 rounded w-20"></div>{' '}
                {/* Invoice Number */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        {/* Pagination skeleton */}
        <div className="h-8 w-8 bg-gray-200 rounded-full mx-1"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full mx-1"></div>
        <div className="h-8 w-12 bg-gray-200 rounded mx-1"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full mx-1"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full mx-1"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
