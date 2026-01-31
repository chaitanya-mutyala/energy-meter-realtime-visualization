import { getHourlyUsage } from "../components/Firebasethree.js";

export function buildHourlyEnergyData() {
  const b1 = getHourlyUsage("meter_001");
  const b2 = getHourlyUsage("meter_002");

  // 1. Pre-fill the map with all 24 hours initialized to 0.
  // This prevents "holes" in your chart if data is missing for an hour.
  const map = {};
  for (let i = 0; i < 25; i++) {
    const hourLabel = `${i.toString().padStart(2, '0')}:00`;
    map[hourLabel] = {
      hour: hourLabel,
      building1: 0,
      building2: 0,
    };
  }

  // 2. Fill Meter 001 data
  if (Array.isArray(b1)) {
    b1.forEach((item) => {
      if (item.time && map[item.time]) {
        map[item.time].building1 = Number(item.kwh.toFixed(2));
      }
    });
  }

  // 3. Fill Meter 002 data
  if (Array.isArray(b2)) {
    b2.forEach((item) => {
      if (item.time && map[item.time]) {
        map[item.time].building2 = Number(item.kwh.toFixed(2));
      }
    });
  }

  // 4. Return sorted values (00:00 to 23:00)
  return Object.values(map).sort((a, b) => a.hour.localeCompare(b.hour));
}