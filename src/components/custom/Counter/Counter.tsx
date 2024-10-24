import React, { useState } from 'react';

import { CounterProps } from './Counter.types';

import './Counter.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCardItem } from '@/store/slices/cardItems';

export const Counter: React.FC<any> = ({item}:any) => {
  const [count, setCount] = useState(1);
  const dispatch = useDispatch();

  const cardItemValue = useSelector((state: any) => state.cardItems.value);

  const updateCardItem = (newItem: {
    id: string;
    qty: number;
    name: string;
    image: any;
    price: number;
  }) => {
    // Check if the item already exists in the array
    const existingItemIndex = cardItemValue.findIndex(
      (i: { id: string }) => i.id === newItem.id
    );
    console.log(existingItemIndex);

    // If exists, update the quantity
    if (existingItemIndex >= 0) {
      const updatedItems = cardItemValue.map(
        (item: { id: string; qty: number; name: string }, index: number) => {
          if (index === existingItemIndex) {
            // Create a new object with updated quantity
            return {
              ...item,
              qty: item.qty + newItem.qty, // Update the quantity
            };
          }
          return item; // Return the item unchanged
        }
      );
      dispatch(setCardItem(updatedItems));
    } else {
      // If not, add a new item
      dispatch(
        setCardItem([...cardItemValue, { ...newItem, qty: newItem.qty }])
      );
    }
  };

  const incrementCount = () => {
    setCount((prev) => prev + 1);
    // setShopCardCount(count + 1, 'plus');
    updateCardItem({
      id: item.id,
      qty: 1,
      name: item.name,
      image: item.images,
      price: item.price,
    });
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
      // setShopCardCount(count - 1, 'minus');
      updateCardItem({
        id: item.id,
        qty: -1,
        name: item.name,
        image: item.images,
        price: item.price,
      });
    }
  };

  return (
    <>
      {' '}
      <div className="flex items-center border border-gray-300 rounded-lg w-[120px]">
        {/* Minus Button */}
        <button
          onClick={() => incrementCount()}
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
          onClick={() => decrementCount()}
          className="w-1/3 h-10 text-lg flex items-center justify-center border-r border-gray-300"
        >
          -{/* <MinusIcon /> */}
        </button>
      </div>
    </>
  );
};
