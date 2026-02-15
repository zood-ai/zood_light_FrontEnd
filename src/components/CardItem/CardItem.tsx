import React, { useCallback, useMemo } from 'react';
import { CardItemProps } from './CardItem.types';
import './CardItem.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCardItem } from '@/store/slices/cardItems';
import imagePLaceHolder from '/icons/imagePLaceHolder.svg';

export const CardItem: React.FC<CardItemProps> = ({ index, item }) => {
  const dispatch = useDispatch();
  const cardItemValue = useSelector((state: any) => state.cardItems.value);

  const cardItem = useMemo(
    () => cardItemValue.find((i: { id: string }) => i.id === item.id),
    [cardItemValue, item.id]
  );
  const qty = cardItem ? cardItem.qty : 0;

  const updateCardItem = useCallback(
    (newItem: {
      id: string;
      qty: number;
      name: string;
      image: any;
      price: number;
    }) => {
      const existingItemIndex = cardItemValue.findIndex(
        (i: { id: string }) => i.id === newItem.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = cardItemValue.map(
          (item: { id: string; qty: number; name: string }, index: number) => {
            if (index === existingItemIndex) {
              return {
                ...item,
                qty: item.qty + newItem.qty,
              };
            }
            return item;
          }
        );
        dispatch(setCardItem(updatedItems));
      } else {
        dispatch(
          setCardItem([
            ...cardItemValue,
            {
              ...newItem,
              qty: newItem.qty,
            },
          ])
        );
      }
    },
    [cardItemValue, dispatch]
  );

  const incrementCount = useCallback(() => {
    updateCardItem({
      id: item.id,
      qty: 1,
      name: item.name,
      image: item.image,
      price: item.price,
    });
  }, [item, updateCardItem]);

  return (
    <div className="flex w-full flex-col rounded-none">
      <div
        className="flex cursor-pointer flex-col rounded border border-gray-200 border-solid bg-white w-full"
        onClick={incrementCount}
      >
        <div className="relative flex w-full self-stretch justify-center rounded border border-gray-200 border-solid bg-white px-5 pt-4">
          {qty > 0 && (
            <div className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-main px-1.5 text-xs font-bold text-white">
              {qty}
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 rounded-md bg-white/90 px-2 py-1 text-center backdrop-blur-[1px]">
            <div className="truncate text-xs font-semibold text-foreground">
              {item?.name}
            </div>
            <div className="text-xs font-bold text-main">SR {item?.price}</div>
          </div>
          <img
            loading="lazy"
            src={item?.image || imagePLaceHolder}
            className="object-contain aspect-[1.07] w-[165px]"
            alt={item?.name}
          />
        </div>
      </div>
    </div>
  );
};
