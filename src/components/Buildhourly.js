import { getLoadCurve } from "../components/Firebasethree.js";

export function buildLoadCurveData() {
  const b1 = getLoadCurve("meter_001");
  const b2 = getLoadCurve("meter_002");

  const data = [];

  // Generate 96 time labels (15-min intervals)
  for (let i = 0; i < 96; i++) {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;

    const label = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

    data.push({
      time: label,
      building1: Number((b1[i] ?? 0).toFixed(2)),
      building2: Number((b2[i] ?? 0).toFixed(2)),
    });
  }

  return data;
}