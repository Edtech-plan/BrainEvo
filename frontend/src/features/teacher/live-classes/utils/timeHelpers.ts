export const formatSessionTime = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const formatSessionDate = (isoString: string): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const calculateEndTime = (
  startIso: string,
  durationMins: number,
): string => {
  const date = new Date(startIso);
  date.setMinutes(date.getMinutes() + durationMins);
  return date.toISOString();
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "live":
      return "#EF4444"; // Red
    case "scheduled":
      return "#4F46E5"; // Indigo
    case "completed":
      return "#10B981"; // Emerald
    case "cancelled":
      return "#6B7280"; // Gray
    default:
      return "#374151";
  }
};
