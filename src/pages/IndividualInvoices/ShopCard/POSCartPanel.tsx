import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Counter } from '@/components/custom/Counter';
import { useTranslation } from 'react-i18next';
import CurrencyAmount from '@/components/custom/CurrencyAmount';

export default function POSCartPanel() {
  const { t } = useTranslation();
  const cardItemValue = useSelector((state: any) => state.cardItems.value);

  const totalAmount = useMemo(
    () =>
      cardItemValue.reduce(
        (acc: number, item: any) =>
          acc + Number(item?.price || 0) * Number(item?.qty || 0),
        0
      ),
    [cardItemValue]
  );

  return (
    <div className="flex max-h-[calc(100dvh-170px)] flex-col rounded-xl border border-mainBorder bg-background p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">{t('POS_CART')}</h3>
        <span className="text-sm text-secText">
          {cardItemValue.length} {t('PRODUCTS')}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pe-1">
        {cardItemValue.length === 0 ? (
          <div className="rounded-md border border-dashed border-mainBorder px-3 py-6 text-center text-sm text-secText">
            {t('POS_CART_EMPTY')}
          </div>
        ) : (
          cardItemValue.map((item: any) => (
            <div
              key={item.id}
              className="rounded-md border border-mainBorder bg-white px-3 py-2"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                <Counter item={item} />
                <span className="text-sm font-semibold">
                  <CurrencyAmount value={Number(item.price || 0) * Number(item.qty || 0)} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 border-t border-mainBorder pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secText">{t('TOTAL_AMOUNT')}</span>
          <span className="font-bold">
            <CurrencyAmount value={totalAmount} />
          </span>
        </div>
      </div>
    </div>
  );
}
