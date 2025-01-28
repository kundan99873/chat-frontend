import dayjs from "dayjs";

export const capitalizeFirstLetter = (data) => {
  if (!data) return;
  return data.charAt(0).toUpperCase() + data.slice(1);
};

export const getTimeDifference = (lastActive) => {
  const now = dayjs();
  const diffInMinutes = now.diff(lastActive, "minute");
  const diffInHours = now.diff(lastActive, "hour");
  const diffInDays = now.diff(lastActive, "day");

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }
};
