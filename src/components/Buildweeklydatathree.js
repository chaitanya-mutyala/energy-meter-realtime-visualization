import { getLast7DaysCache } from "../components/Firebasethree.js";

/**
 * Convert YYYY-MM-DD → weekday label
 */
function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export function buildWeeklyEnergyData() {
  const b1 = getLast7DaysCache("meter_001");
  const b2 = getLast7DaysCache("meter_002");

  // 🚨 Guard: need at least 2 readings to compute 1 delta
  if (!Array.isArray(b1) || !Array.isArray(b2)) return [];
  if (b1.length < 2 && b2.length < 2) return [];

  const map = {};

  /* ========= METER 001 ========= */
  for (let i = 1; i < b1.length; i++) {
    const prev = b1[i - 1];
    const curr = b1[i];

    if (prev?.Wh == null || curr?.Wh == null) continue;

    const kWh = (curr.Wh - prev.Wh) / 1000;

    map[curr.day] = {
      date: curr.day,
      day: getDayName(curr.day),
      building1: Math.max(0, Number(kWh.toFixed(2))),
      building2: 0,
    };
  }

  /* ========= METER 002 ========= */
  for (let i = 1; i < b2.length; i++) {
    const prev = b2[i - 1];
    const curr = b2[i];

    if (prev?.Wh == null || curr?.Wh == null) continue;

    const kWh = (curr.Wh - prev.Wh) / 1000;

    if (!map[curr.day]) {
      map[curr.day] = {
        date: curr.day,
        day: getDayName(curr.day),
        building1: 0,
        building2: Math.max(0, Number(kWh.toFixed(2))),
      };
    } else {
      map[curr.day].building2 = Math.max(0, Number(kWh.toFixed(2)));
    }
  }

  // ✅ Stable ordering (TV-safe)
  return Object.values(map).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}
