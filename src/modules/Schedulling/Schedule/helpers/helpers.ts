export const getRandomNumber = (min: number = 0, max: number = 7) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
