// buildForecastEnergyData.js
import { getForecastPoints } from "../components/Firebasethree.js";
export function buildForecastEnergyData() {
  const f1 = getForecastPoints("meter_001");
  const f2 = getForecastPoints("meter_002");

  if (!Array.isArray(f1) || !Array.isArray(f2)) return [];

  const data = [];

  for (let i = 0; i < 96; i++) {
    // index 0  -> 00:15
    // index 95 -> 00:00 (next day)
    const totalMinutes = (i + 1) * 15;

    const hour = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;

    const timeLabel = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    data.push({
      index: i,
      time: timeLabel,
      building1: Number(((f1[i] ?? 0) / 1000).toFixed(2)),
      building2: Number(((f2[i] ?? 0) / 1000).toFixed(2)),
    });
  }

  return data;
}
