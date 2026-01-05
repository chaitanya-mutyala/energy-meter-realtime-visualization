import { getLast7DaysCache } from "../components/Firebasethree.js";

/**
 * Convert YYYY-MM-DD → weekday label (Mon, Tue, etc.)
 */
function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

/* buildWeeklyEnergyData.js */

export function buildWeeklyEnergyData() {
  const b1 = getLast7DaysCache("meter_001");
  const b2 = getLast7DaysCache("meter_002");

  if (!Array.isArray(b1) || !Array.isArray(b2)) return [];

  const map = {};

  /* ========= METER 001 ========= */
  b1.forEach((item) => {
    if (!item.day) return;
    const kWh = item.wh / 1000; 

    map[item.day] = {
      date: item.day,
      day: getDayName(item.day),
      building1: Number(kWh.toFixed(2)),
      building2: 0,
    };
  });

  /* ========= METER 002 ========= */
  b2.forEach((item) => {
    if (!item.day) return;
    const kWh = item.wh / 1000;

    if (!map[item.day]) {
      map[item.day] = {
        date: item.day,
        day: getDayName(item.day),
        building1: 0,
        building2: Number(kWh.toFixed(2)),
      };
    } else {
      map[item.day].building2 = Number(kWh.toFixed(2));
    }
  });

  return Object.values(map).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}