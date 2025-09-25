export function formatMatchDate(dateString) {
  const date = new Date(dateString);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${formattedDate} : ${minutes} minutes ${seconds} seconds`;
}

export function formatRemaining(seconds) {
  if (seconds == null || isNaN(seconds) || seconds < 0) return "Expired";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (h > 0) parts.push(`${h} hour${h !== 1 ? "s" : ""}`);
  if (m > 0) parts.push(`${m} minute${m !== 1 ? "s" : ""}`);
  if (s > 0 || parts.length === 0)
    parts.push(`${s} second${s !== 1 ? "s" : ""}`);

  return parts.join(" ");
}
