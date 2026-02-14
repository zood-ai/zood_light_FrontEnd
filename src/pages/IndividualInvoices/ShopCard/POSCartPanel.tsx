import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Counter } from '@/components/custom/Counter';
import { useTranslation } from 'react-i18next';

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
    <div className="rounded-xl border border-mainBorder bg-background p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">{t('POS_CART')}</h3>
        <span className="text-sm text-secText">
          {cardItemValue.length} {t('PRODUCTS')}
        </span>
      </div>

      <div className="space-y-2">
        {cardItemValue.map((item: any) => (
          <div
            key={item.id}
            className="rounded-md border border-mainBorder bg-white px-3 py-2"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
              <span className="text-sm font-semibold">
                SR {(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}
              </span>
            </div>
            <Counter item={item} />
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-mainBorder pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secText">{t('TOTAL_AMOUNT')}</span>
          <span className="font-bold">SR {totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
