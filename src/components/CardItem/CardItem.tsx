import React, { useState, useCallback, useMemo } from 'react';
import { CardItemProps } from './CardItem.types';
import './CardItem.css';
import PlusIcon from '../Icons/PlusIcon';
import { Button } from '../custom/button';
import NegativeIcon from '../Icons/NegativeIcon';
import XIcons from '../Icons/XIcons';
import { useDispatch, useSelector } from 'react-redux';
import { setCardItem } from '@/store/slices/cardItems';
import imagePLaceHolder from '/icons/imagePLaceHolder.svg';
import { useTranslation } from 'react-i18next';
import createCrudService from '@/api/services/crudService';

export const CardItem: React.FC<CardItemProps> = ({ index, item }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cardItemValue = useSelector((state: any) => state.cardItems.value);

  const cardItem = useMemo(
    () => cardItemValue.find((i: { id: string }) => i.id === item.id),
    [cardItemValue, item.id]
  );
  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const { data: taxes } = createCrudService<any>('manage/taxes').useGetAll();

  const qty = cardItem ? cardItem.qty : 0;
  const [inputQty, setInputQty] = useState(qty);

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
                is_tax_included: settings?.data?.tax_inclusive_pricing,
                taxes: [
                  {
                    id: taxes?.data[0]?.id,
                    rate: taxes?.data[0]?.rate,
                    amount: !settings?.data?.tax_inclusive_pricing
                      ? (newItem.price * (item.qty + newItem.qty) || 0) *
                        ((taxes?.data[0]?.rate || 0) / 100)
                      : (newItem.price * (item.qty + newItem.qty) || 0) *
                        ((taxes?.data[0]?.rate || 0) /
                          (100 + taxes?.data[0]?.rate || 0)),
                  },
                ],
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
              is_tax_included: settings?.data?.tax_inclusive_pricing,
              taxes: [
                {
                  id: taxes?.data[0]?.id,
                  rate: taxes?.data[0]?.rate,
                  amount: !settings?.data?.tax_inclusive_pricing
                    ? (newItem.price * newItem.qty || 0) *
                      ((taxes?.data[0]?.rate || 0) / 100)
                    : (newItem.price * newItem.qty || 0) *
                      ((taxes?.data[0]?.rate || 0) /
                        (100 + taxes?.data[0]?.rate || 0)),
                },
              ],
            },
          ])
        );
      }
    },
    [cardItemValue, dispatch]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(0, Number(e.target.value));
      setInputQty(value);
      updateCardItem({
        id: item.id,
        qty: value - qty,
        name: item.name,
        image: item.image,
        price: item.price,
      });
    },
    [item, qty, updateCardItem]
  );

  const incrementCount = useCallback(() => {
    setInputQty(qty + 1);
    updateCardItem({
      id: item.id,
      qty: 1,
      name: item.name,
      image: item.image,
      price: item.price,
    });
  }, [item, qty, updateCardItem]);

  const decrementCount = useCallback(() => {
    if (qty === 1) {
      const updatedItems = cardItemValue.filter(
        (item) => item.id !== cardItem.id
      );
      dispatch(setCardItem(updatedItems));
    } else if (qty > 1) {
      setInputQty(qty - 1);
      updateCardItem({
        id: item.id,
        qty: -1,
        name: item.name,
        image: item.image,
        price: item.price,
      });
    }
  }, [cardItem, cardItemValue, dispatch, item, qty, updateCardItem]);

  return (
    <div className="flex flex-col rounded-none h-[290px] w-[210px] ">
      <div className="flex flex-col pb-2 w-full bg-white rounded border border-gray-200 border-solid ">
        <div className="flex justify-center self-stretch px-5 pt-4 w-full bg-white rounded border border-gray-200 border-solid">
          <img
            loading="lazy"
            src={item?.image || imagePLaceHolder}
            className="object-contain aspect-[1.07] w-[165px]"
            alt={item?.name}
          />
        </div>
        <div className={'px-[8px] '}>
          <div className="mt-2.5 font-semibold text-zinc-500 text-center w-full ">
            <span className="pe-2 text-foreground block overflow-hidden whitespace-nowrap text-ellipsis">
              {item?.name}
            </span>
          </div>
          <div className="mt-0 font-semibold text-main text-center">
            SR {item?.price}
          </div>
          {qty === 0 ? (
            <Button
              className="w-full mt-3 flex"
              onClick={() => incrementCount()}
            >
              {t('ADD')}
            </Button>
          ) : (
            <div className="flex gap-2 mt-3 w-full font-bold whitespace-nowrap max-w-[100%] text-mainText justify-between">
              <div className="object-contain shrink-0 w-10 aspect-square">
                <div className="flex flex-col max-w-[40px]">
                  <div
                    onClick={() => incrementCount()}
                    className="flex flex-col justify-center items-center px-2 w-full h-10 bg-white rounded-full border border-gray-200 border-solid shadow-[0px_1px_11px_rgba(0,0,0,0.08)] cursor-pointer"
                  >
                    <PlusIcon />
                  </div>
                </div>
              </div>
              <div className="h-[40px] w-[90px] flex justify-center items-center bg-white rounded border border-gray-200 border-solid font-bold">
                <input
                  type="number"
                  dir="rtl"
                  value={inputQty}
                  onChange={handleInputChange}
                  className="w-full text-center"
                />
              </div>
              <div className="object-contain shrink-0 w-10 aspect-square">
                <div className="flex flex-col max-w-[40px]">
                  <div
                    onClick={() => decrementCount()}
                    className="flex flex-col justify-center items-center px-2 w-full h-10 bg-white rounded-full border border-gray-200 border-solid shadow-[0px_1px_11px_rgba(0,0,0,0.08)] cursor-pointer"
                  >
                    {qty === 1 ? (
                      <XIcons />
                    ) : (
                      <>
                        <NegativeIcon />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
