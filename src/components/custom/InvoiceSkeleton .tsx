import React from 'react';

const InvoiceSkeleton = () => {
  return (
    <div className="p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        {/* Title and date */}
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>

      {/* Header section */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Product, Quantity, Price labels */}
        <div className="col-span-1 h-8 bg-gray-200 rounded"></div>
        <div className="col-span-1 h-8 bg-gray-200 rounded"></div>
        <div className="col-span-1 h-8 bg-gray-200 rounded"></div>
      </div>

      {/* Left side inputs */}
      <div className="grid grid-cols-2 gap-8">
        {/* Payment Info */}
        <div className="col-span-1 space-y-4">
          {/* Amounts */}
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>

          {/* Total, Payment Method */}
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>

          {/* Total, Payment Method */}
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>

          {/* Add Button */}

          {/* Remaining Amount */}
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>

        {/* Right side inputs */}
    
      </div>
    </div>
  );
};

export default InvoiceSkeleton;
