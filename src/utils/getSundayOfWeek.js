function getSundayOfWeek() {
  const today = new Date();
  const day = today.getDay(); // Get the day of the week (0-6, 0 = Sunday, 1 = Monday, ..., 6 = Saturday)

  if (day === 0) {
    // If today is Sunday
    return today; // Return today's date
  } else {
    const diff = today.getDate() - day; // Calculate the difference between today and the previous Sunday
    return new Date(today.setDate(diff)); // Set the date to the previous Sunday and return it
  }
}

export { getSundayOfWeek };
