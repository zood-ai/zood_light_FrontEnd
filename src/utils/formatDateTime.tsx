import dayjs from 'dayjs';

/**
 * Utility function to format a date string to 'YYYY-MM-DD HH:mm:ss'
 * @param {string} dateString - The date string in ISO format (e.g., "2024-10-15T08:28:28.000000Z")
 * @param {string} format - Optional. The format you want the date to be in (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} - The formatted date string
 */
export const formatDateTime = (dateString, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(dateString).format(format);
};
export const formatDate = (dateString, format = 'DD/MM/YYYY') => {
  return dayjs(dateString).format(format);
};


