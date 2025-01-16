export const currencyFormated = (num: number) => {
  const newFormeted = new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  return newFormeted;
};