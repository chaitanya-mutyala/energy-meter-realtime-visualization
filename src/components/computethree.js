// src/utils/generateBuildingMetrics.js

import {
  dailyRefresh,
  minuteRefresh,
  getLatestRow,
  getYesterdayLastWh,
  getPrevMonthLastWh,
  getYesterdayPeakKVA,
  getMonthlyPeakKVA,
} from "./Firebasethree.js";

/*
  ⚠️ IMPORTANT
  - Signature unchanged
  - Export unchanged
  - Caller code unchanged
*/

const initialized = {}; // meterId → boolean

export async function generateBuildingMetrics(db, meterId) {
  /* =====================================================
     1️⃣ DAILY HEAVY REFRESH (ONCE PER DAY PER METER)
     ===================================================== */
  if (!initialized[meterId]) {
    await dailyRefresh(db, meterId);
    initialized[meterId] = true;
  }

  /* =====================================================
     2️⃣ LIGHT REFRESH (EVERY CALL / EVERY MINUTE)
     ===================================================== */
  await minuteRefresh(db, meterId);

  /* =====================================================
     3️⃣ READ FROM CACHE (NO FIREBASE HERE)
     ===================================================== */
  const latest = getLatestRow(meterId);
  if (!latest) return null;

  const yesterdayLastWh = getYesterdayLastWh(meterId);
  const lastMonthLastWh = getPrevMonthLastWh(meterId);

  const yesterdayPeakKVA = getYesterdayPeakKVA(meterId);
  const monthlyPeakKVA = getMonthlyPeakKVA(meterId);

  /* =====================================================
     4️⃣ ENERGY CALCULATIONS
     ===================================================== */
  const todayEnergy =
    yesterdayLastWh != null ? latest.Wh - yesterdayLastWh : 0;

  const monthEnergy =
    lastMonthLastWh != null ? latest.Wh - lastMonthLastWh : 0;

  /* =====================================================
     5️⃣ REACTIVE POWER
     ===================================================== */
  const ReactivePower = Math.sqrt(
    Math.pow(latest.VA_total ?? 0, 2) -
    Math.pow(latest.Watts_Total ?? 0, 2)
  );

  /* =====================================================
     6️⃣ RETURN OBJECT (EXTENDED, BACKWARD SAFE)
     ===================================================== */
  return {
    activePower: (latest.Watts_Total ?? 0) / 1000,   // kW
    reactivePower: ReactivePower / 1000,            // kVAR

    energyToday: todayEnergy / 1000,                // kWh
    energyMonth: monthEnergy / 1000,                // kWh

    yesterdayPeakKVA: yesterdayPeakKVA ?? 0,        // 🔥 NEW
    monthlyPeakKVA: monthlyPeakKVA ?? 0,            // 🔥 NEW

    frequency: latest.freq ?? 0,                    // Hz
    pf: latest.PF_AVG ?? 0,                         // PF
    voltage: latest.VLL_AVG ?? 0,                   // V
    current: latest.Itotal ?? 0,                    // A
    timestamp: latest.timestamp,
  };
}
