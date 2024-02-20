// Check if the date is valid
export const verifyDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};
