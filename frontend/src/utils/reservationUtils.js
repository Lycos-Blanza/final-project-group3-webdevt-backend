// src/utils/reservationUtils.js
// INDUSTRY-STANDARD 90-MINUTE OVERLAP CHECK
const RESERVATION_DURATION_MINUTES = 90;

export const isTimeSlotAvailable = (
  requestedDate,
  requestedTime,
  partySize,
  tables,
  reservations,
  excludeReservationId = null
) => {
  // Parse requested start time
  const [hours, minutes] = requestedTime.split(":").map(Number);
  const startDateTime = new Date(requestedDate);
  startDateTime.setHours(hours, minutes, 0, 0);

  const endDateTime = new Date(startDateTime);
  endDateTime.setMinutes(endDateTime.getMinutes() + RESERVATION_DURATION_MINUTES);

  // Filter tables that can fit the party
  const suitableTables = tables.filter(t => t.capacity >= partySize);

  const availableTables = suitableTables.filter(table => {
    // Check if this table has any overlapping reservation
    return !reservations.some(res => {
      if (res.status === "Cancelled") return false;
      if (excludeReservationId && (res._id === excludeReservationId || res.id === excludeReservationId)) return false;
      if (res.date !== requestedDate) return false;

      const bookedTable = res.tableNumber?._id || res.tableNumber?.number || res.tableNumber;
      if (String(bookedTable) !== String(table.number)) return false;

      const bookedTime = res.timeSlot || res.time;
      const [bH, bM] = bookedTime.split(":").map(Number);
      const bookedStart = new Date(requestedDate);
      bookedStart.setHours(bH, bM, 0, 0);
      const bookedEnd = new Date(bookedStart);
      bookedEnd.setMinutes(bookedEnd.getMinutes() + RESERVATION_DURATION_MINUTES);

      // REAL OVERLAP CHECK
      return startDateTime < bookedEnd && endDateTime > bookedStart;
    });
  });

  return {
    isAvailable: availableTables.length > 0,
    availableTables,
    startTime: startDateTime,
    endTime: endDateTime
  };
};