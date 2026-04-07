import React from 'react';
import { formatNumber } from '@/utils/numberFormat';

type CurrencyAmountProps = {
  value: number | string | null | undefined;
  currencyCode?: string | null | undefined;
  className?: string;
  numberClassName?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

const isSarCurrency = (code?: string | null) => {
  const normalized = String(code ?? 'SAR').trim().toUpperCase();
  return normalized === '' || normalized === 'SAR';
};

export default function CurrencyAmount({
  value,
  currencyCode,
  className = '',
  numberClassName = '',
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
}: CurrencyAmountProps) {
  const sar = isSarCurrency(currencyCode);
  const formatted = formatNumber(value, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return (
    <span className={`inline-flex items-center gap-1 ${className}`.trim()}>
      {sar ? (
        <span
          className="icon-saudi_riyal text-[0.95em] leading-none"
          aria-hidden="true"
        />
      ) : (
        <span>{currencyCode || 'SR'}</span>
      )}
      <span dir="ltr" className={numberClassName}>
        {formatted}
      </span>
    </span>
  );
}
