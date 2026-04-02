import React, { useCallback, useMemo } from 'react';
import { CardItemProps } from './CardItem.types';
import './CardItem.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCardItem } from '@/store/slices/cardItems';
import imagePLaceHolder from '/icons/imagePLaceHolder.svg';
import CurrencyAmount from '@/components/custom/CurrencyAmount';

const CATEGORY_COLOR_PALETTE = [
  { bg: '#BDEAE8', border: '#A2D7D4', activeBg: '#A6D9D5', activeBorder: '#86C6C1' },
  { bg: '#EBCBA3', border: '#DCB686', activeBg: '#E1BC8E', activeBorder: '#D3A96F' },
  { bg: '#BFE3C1', border: '#A1CFA3', activeBg: '#A9D3AC', activeBorder: '#89BE8D' },
  { bg: '#E9A7A7', border: '#D98F8F', activeBg: '#DE9595', activeBorder: '#CC7474' },
  { bg: '#C7D7F0', border: '#ACBFDF', activeBg: '#B4C8E8', activeBorder: '#96ADD5' },
  { bg: '#E4C8EB', border: '#D3ADDC', activeBg: '#D9B6E2', activeBorder: '#C595D2' },
] as const;

const getCategoryStyle = (category: string) => {
  if (!category || category === 'all') {
    return {
      bg: '#EEF2F7',
      border: '#D4DDE8',
      activeBg: '#DDE7F4',
      activeBorder: '#B8C8DE',
    };
  }

  const normalized = category.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
  }

  return CATEGORY_COLOR_PALETTE[hash % CATEGORY_COLOR_PALETTE.length];
};

export const CardItem: React.FC<CardItemProps> = ({ index, item }) => {
  const dispatch = useDispatch();
  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const productImage = useMemo(() => {
    const directImage = item?.image;
    const imagesField = item?.images;

    const candidate =
      directImage ||
      (Array.isArray(imagesField)
        ? imagesField[0]
        : typeof imagesField === 'string'
          ? imagesField
          : imagesField?.url || imagesField?.path);

    const normalized = String(candidate || '').trim();
    if (
      !normalized ||
      normalized.toLowerCase() === 'null' ||
      normalized.toLowerCase() === 'undefined'
    ) {
      return imagePLaceHolder;
    }

    return normalized;
  }, [item?.image, item?.images]);

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
      stock_quantity?: number | string | null;
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
                stock_quantity:
                  newItem.stock_quantity !== undefined &&
                  newItem.stock_quantity !== null
                    ? newItem.stock_quantity
                    : (item as { stock_quantity?: unknown }).stock_quantity,
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
    const stock =
      item.quantity ?? item.stock_quantity ?? item.available_quantity;
    updateCardItem({
      id: item.id,
      qty: 1,
      name: item.name,
      image: item.image,
      price: item.price,
      ...(stock !== undefined && stock !== null ? { stock_quantity: stock } : {}),
    });
  }, [item, updateCardItem]);

  const categoryStyle = useMemo(() => {
    const categoryName =
      item?.category?.name ||
      item?.category_name ||
      item?.category?.name_en ||
      '';
    return getCategoryStyle(categoryName);
  }, [item]);

  return (
    <div className="h-full w-full">
      <div
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-mainBorder bg-white transition-all duration-150 hover:border-main/50 hover:shadow-md active:scale-95 active:shadow-none"
        style={{ borderBottomColor: categoryStyle.activeBorder, borderBottomWidth: '4px' }}
        onClick={incrementCount}
      >
        {qty > 0 && (
          <div className="absolute right-2 top-2 z-10 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-main px-1.5 text-xs font-bold text-white shadow-sm ring-2 ring-white">
            {qty}
          </div>
        )}
        
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-gray-100 p-4">
          <img
            loading="lazy"
            src={productImage}
            className="object-contain aspect-[1.07] w-[156px]"
            alt={item?.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = imagePLaceHolder;
            }}
          />
        </div>

        <div className="flex flex-col border-t border-mainBorder bg-white px-2 py-2 text-center">
          <div className="mb-1 flex h-8 w-full items-center justify-center">
            <div className="line-clamp-2 text-xs font-medium leading-tight text-mainText" title={item?.name}>
              {item?.name}
            </div>
          </div>
          <div className="text-xs font-bold text-main">
            <CurrencyAmount value={item?.price || 0} />
          </div>
        </div>
      </div>
    </div>
  );
};
