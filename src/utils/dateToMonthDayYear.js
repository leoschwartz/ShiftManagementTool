import { verifyDate } from "./verifyDate";
function dateToMonthDayYear(date) {
  if (!verifyDate(date)) {
    return date;
  }
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

export { dateToMonthDayYear };