export function timeAgoShort(date: Date) {
  const now = new Date();
  const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsPast < 60) {
    return `${secondsPast} sec${secondsPast !== 1 ? "s" : ""} ago`;
  }
  if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  }
  if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
  }
  if (secondsPast < 2592000) {
    const days = Math.floor(secondsPast / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
  if (secondsPast < 31536000) {
    const months = Math.floor(secondsPast / 2592000);
    return `${months} mon${months !== 1 ? "s" : ""} ago`;
  }
  const years = Math.floor(secondsPast / 31536000);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}
