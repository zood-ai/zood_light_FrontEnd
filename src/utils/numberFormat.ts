type FormatNumberOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export const formatNumber = (
  value: number | string | null | undefined,
  options: FormatNumberOptions = {}
) => {
  const numeric = Number(value ?? 0);
  const safeValue = Number.isFinite(numeric) ? numeric : 0;
  const minimumFractionDigits = options.minimumFractionDigits ?? 2;
  const maximumFractionDigits = options.maximumFractionDigits ?? 2;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping: true,
  }).format(safeValue);
};

export const formatInteger = (value: number | string | null | undefined) =>
  formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
