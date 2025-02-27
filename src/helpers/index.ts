import { DateTime } from "luxon";
import { TTimerConfig } from "../types";

export const formatRelativeTime = (timestamp: string) => {
  // check if the date string is valid
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  if (!isValidDate(timestamp)) {
    return "";
  }

  const now = DateTime.utc();
  const sentDateTime = DateTime.fromISO(timestamp);
  const diffInSeconds = now.diff(sentDateTime, "seconds").seconds;

  if (diffInSeconds < 60) {
    return `${Math.round(diffInSeconds) || 1} sec ago`;
  }

  const diffInMinutes = now.diff(sentDateTime, "minutes").minutes;
  if (diffInMinutes < 60) {
    return `${Math.round(diffInMinutes)} min ago`;
  }

  const diffInHours = now.diff(sentDateTime, "hours").hours;
  if (diffInHours < 24) {
    return `${Math.round(diffInHours)} h ago`;
  }

  const diffInDays = now.diff(sentDateTime, "days").days;
  if (diffInDays < 7) {
    return `${Math.round(diffInDays)} d ago`;
  }

  // More than 1 week, show date as "DD.MM"
  return sentDateTime.toFormat("dd.MM");
};

export const countShowPolls = (
  currentStreamTime: number,
  config: TTimerConfig,
  pollsAmount: number
) => {
  if (!config) return 0;
  if (!pollsAmount) return 0;

  const currentTime = Math.floor(currentStreamTime);
  const countTime =
    (pollsAmount || 0) * (config?.answerTime + config?.viewResultTime) + 60;
  const showPolls =
    currentTime &&
    ((currentTime > config?.showInTime && currentTime < countTime) ||
      currentTime === config?.showInTime);

  return showPolls;
};
