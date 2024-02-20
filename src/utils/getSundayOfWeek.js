function getSundayOfWeek() {
  const today = new Date();
  const day = today.getDay(); // Get the day of the week (0-6, 0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const diff = today.getDate() - day + (day === 0 ? 0 : 7); // Calculate the difference between today and Sunday
  return new Date(today.setDate(diff)); // Set the date to Sunday and return it
}

export { getSundayOfWeek };
