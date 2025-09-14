// lib/formatDate.js
export function formatMatchDate(dateString) {
  const date = new Date(dateString);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${formattedDate} : ${minutes} minutes ${seconds} seconds`;
}
