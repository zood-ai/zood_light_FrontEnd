export const getRandomNumber = (min: number = 0, max: number = 7) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getHoursAndMinutes = (time) => {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  return `${hours}h ${minutes}m`;
};
