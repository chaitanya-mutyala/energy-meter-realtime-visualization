import { getForecastPoints } from "../components/Firebasethree.js";

export function buildForecastEnergyData() {
  const f1 = getForecastPoints("meter_001");
  const f2 = getForecastPoints("meter_002");

  // Guard
  if (!Array.isArray(f1) || !Array.isArray(f2)) return [];

  const map = {};

  // 1️⃣ Pre-fill all 96 timestamps
  for (let i = 0; i < 96; i++) {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    const label = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    map[i] = {
      index: i,       // numeric axis key
      time: label,    // label for tooltip
      building1: 0,   // kW
      building2: 0,   // kW
    };
  }

  // 2️⃣ Fill meter 001
  f1.forEach((watt, i) => {
    if (map[i]) {
      map[i].building1 = Number((watt / 1000).toFixed(2)); // W → kW
    }
  });

  // 3️⃣ Fill meter 002
  f2.forEach((watt, i) => {
    if (map[i]) {
      map[i].building2 = Number((watt / 1000).toFixed(2));
    }
  });

  // 4️⃣ Return ordered array
  return Object.values(map);
}
