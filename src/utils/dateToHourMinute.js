import { verifyDate } from "./verifyDate";
function dateToHourMinute(date) {
  if (!verifyDate(date)) {
    return date;
  }
  date = new Date(date);
  const hour = String(date.getHours()).padStart(2, "0"); // Get hours and pad with leading zero if needed
  const minute = String(date.getMinutes()).padStart(2, "0"); // Get minutes and pad with leading zero if needed
  return `${hour}:${minute}`;
}

export { dateToHourMinute };
