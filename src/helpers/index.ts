export const formatDate = (dateString: string) => {
  // check if the date string is valid
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  if (!isValidDate(dateString)) {
    return "";
  }

  //  format the date as am/pm time
  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? +String(hours).padStart(2, "0") : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const date = new Date(dateString);
  const formattedTime = formatTime(date);

  return formattedTime;
};
