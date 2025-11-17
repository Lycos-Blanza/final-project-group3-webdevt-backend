// src/hooks/useAvailability.js
import { useAuth } from "../contexts/AuthContext";
import { useTables } from "../contexts/TablesContext";

export function useAvailability() {
  const { getAllReservations, STATUS } = useAuth();
  const { tables } = useTables();

  const isSlotAvailable = (date, time, guests, excludeId = null, targetTableId = null) => {
    const reservations = getAllReservations().filter(
      r =>
        r.date === date &&
        r.time === time &&
        r.status !== STATUS.CANCELED &&
        r.id !== excludeId
    );

    if (targetTableId) {
      const table = tables.find(t => t.id === targetTableId);
      if (!table) return false;

      const booked = reservations
        .filter(r => r.tableId === targetTableId)
        .reduce((sum, r) => sum + r.guests, 0);

      return table.capacity - booked >= guests;
    } else {
      const capacityMap = tables.map(table => {
        const booked = reservations
          .filter(r => r.tableId === table.id)
          .reduce((sum, r) => sum + r.guests, 0);
        return table.capacity - booked;
      });
      return capacityMap.some(cap => cap >= guests);
    }
  };

  const suggestTable = (date, time, guests, excludeId = null) => {
    const reservations = getAllReservations().filter(
      r =>
        r.date === date &&
        r.time === time &&
        r.status !== STATUS.CANCELED &&
        r.id !== excludeId
    );

    for (const table of tables) {
      const booked = reservations
        .filter(r => r.tableId === table.id)
        .reduce((sum, r) => sum + r.guests, 0);
      if (table.capacity - booked >= guests) {
        return table;
      }
    }
    return null;
  };

  return { isSlotAvailable, suggestTable };
}