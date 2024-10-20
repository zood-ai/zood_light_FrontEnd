import React, { useState } from 'react';

import { CounterProps } from './Counter.types';

import './Counter.css';

export const Counter: React.FC<CounterProps> = () => {
  const [count, setCount] = useState(1);

  // Handler for incrementing the count
  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  // Handler for decrementing the count
  const decrement = () => {
    // Prevent count from going below 0
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
    }
  };
  return (
    <>
      {' '}
      <div className="flex items-center border border-gray-300 rounded-lg w-[120px]">
        {/* Minus Button */}
        <button
          onClick={increment}
          className="w-1/3 h-10 text-lg flex items-center justify-center border-l border-gray-300"
        >
          {/* <PlusIcon /> */}+
        </button>

        {/* Number Display */}
        <div className="w-1/3 h-10 text-center flex items-center justify-center text-md font-semibold">
          {count}
        </div>

        {/* Plus Button */}
        <button
          onClick={decrement}
          className="w-1/3 h-10 text-lg flex items-center justify-center border-r border-gray-300"
        >
          -{/* <MinusIcon /> */}
        </button>
      </div>
    </>
  );
};
