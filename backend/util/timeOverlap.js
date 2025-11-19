// utils/timeOverlap.js
const RESERVATION_DURATION_MIN = 90;

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes) => {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
};

const doTimesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

module.exports = { timeToMinutes, minutesToTime, doTimesOverlap, RESERVATION_DURATION_MIN };