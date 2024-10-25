import React, { useState } from 'react';

import { CounterProps } from './Counter.types';

import './Counter.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCardItem } from '@/store/slices/cardItems';
import { TrashIcon } from '@radix-ui/react-icons';

export const Counter: React.FC<any> = ({ item }: any) => {
  const dispatch = useDispatch();

  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const cardItem = useSelector((state: any) =>
    state.cardItems.value.find((i: { id: string }) => i.id === item.id)
  );

  // Get the item's qty from the store, defaulting to 0 if not found
  const qty = cardItem ? cardItem.qty : 0;
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
    updateCardItem({
      id: item.id,
      qty: 1,
      name: item.name,
      image: item.images,
      price: item.price,
    });
  };

  const decrementCount = () => {
    if (qty > 0) {
      updateCardItem({
        id: item.id,
        qty: -1,
        name: item.name,
        image: item.images,
        price: item.price,
      });
    }
  };
  const removeItem = () => {
    const updatedItems = cardItemValue.filter(
      (i: { id: string }) => i.id !== item.id
    );
    dispatch(setCardItem(updatedItems));
  };

  return (
    <>
      <div className="flex items-center border border-gray-300 rounded-lg w-[120px]">
        <button
          onClick={() => incrementCount()}
          className="w-1/3 h-10 text-lg flex items-center justify-center border-l border-gray-300"
        >
          +
        </button>

        {/* Number Display */}
        <div className="w-1/3 h-10 text-center flex items-center justify-center text-md font-semibold">
          {qty}
        </div>
        {qty > 1 ? (
        <button
          onClick={() => decrementCount()}
          className="w-1/3 h-10 text-lg flex items-center justify-center border-r border-gray-300"
        >
          -
        </button>
      ) : (
        <button
          onClick={() => removeItem()}
          className="w-1/3 h-10 text-lg flex items-center justify-center border-r border-gray-300"
        >
          <TrashIcon />
        </button>
      )}
      </div>
    </>
  );
};
