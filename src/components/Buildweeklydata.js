import { getLast7DaysCache } from "../components/Firebasetwo.js";

/**
 * Returns the full weekday name for TV displays to take advantage 
 * of the extra screen space, or keep it 'short' for consistency.
 */
function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", // Change to "long" if you want "Monday" instead of "Mon"
  });
}

export function buildWeeklyEnergyData() {
  const b1 = getLast7DaysCache("meter_001");
  const b2 = getLast7DaysCache("meter_002");

  const map = {};

  // ---------- Building 1 Processing ----------
  for (let i = 1; i < b1.length; i++) {
    const prev = b1[i - 1];
    const curr = b1[i];

    // Calculate consumption in kWh
    const kWh = (curr.Wh - prev.Wh) / 1000;
    
    map[curr.day] = {
      date: curr.day, // Keep raw date for sorting
      day: getDayName(curr.day),
      building1: Math.max(0, Number(kWh.toFixed(2))),
      building2: 0,
    };
  }

  // ---------- Building 2 Processing ----------
  for (let i = 1; i < b2.length; i++) {
    const prev = b2[i - 1];
    const curr = b2[i];

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

  // Final Step: Sort by date before returning.
  // This prevents the chart lines/bars from "jumping" on the TV screen.
  return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
}