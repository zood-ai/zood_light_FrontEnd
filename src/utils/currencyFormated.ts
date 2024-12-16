export const currencyFormated = (num: number) => {
  const newFormeted = new Intl.NumberFormat('en-GB').format(num);
  return newFormeted;
};
