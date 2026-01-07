import { ref, query, orderByKey, limitToLast, get } from "firebase/database";

/* ========= GLOBAL PER-METER CACHE ========= */
const TODAY_DATE = {};         
const LATEST_ROW = {};         
const META_CACHE = {};         
const LAST_7_DAYS_CACHE = {};  
const HOURLY_WH_CACHE = {};    
const HOURLY_KWH_CACHE = {};   

/* =========================================================
   1️⃣ INIT TODAY (Find the latest date folder)
   ========================================================= */
async function initTodayFromFirebase(db, meterId) {
  const q = query(
    ref(db, `energy_data/meters/${meterId}`),
    orderByKey(),
    limitToLast(1)
  );

  const snap = await get(q);
  if (!snap.exists()) return null;

  TODAY_DATE[meterId] = Object.keys(snap.val())[0];
  return TODAY_DATE[meterId];
}

/* =========================================================
   2️⃣ FETCH TODAY META (Hourly & 7-Day Logic)
   ========================================================= */
async function fetchTodayMeta(db, meterId) {
  const today = TODAY_DATE[meterId];
  if (!today) return null;

  const metaRef = ref(db, `energy_meta/meters/${meterId}/daily/${today}`);
  const snap = await get(metaRef);
  
  if (!snap.exists()) {
    // Reset caches if no meta exists for the current day yet
    META_CACHE[meterId] = null;
    LAST_7_DAYS_CACHE[meterId] = [];
    HOURLY_KWH_CACHE[meterId] = [];
    return null;
  }

  const meta = snap.val();
  META_CACHE[meterId] = meta;

  /* ---------- LAST 7 DAYS USAGE ---------- */
  const dailyArr = meta.last_8_days_wh || [];
  const dailyResult = [];

  for (let i = 1; i < dailyArr.length; i++) {
    if (dailyArr[i] && dailyArr[i-1]) {
      const usage = dailyArr[i].wh - dailyArr[i-1].wh;
      dailyResult.push({
        day: dailyArr[i].date,
        wh: Math.max(0, usage),
      });
    }
  }
  LAST_7_DAYS_CACHE[meterId] = dailyResult;

  /* ---------- HOURLY USAGE (kWh) ---------- */
  const hourlyWh = meta.hourly_wh || {};
  HOURLY_WH_CACHE[meterId] = hourlyWh;

  const times = Object.keys(hourlyWh).sort(); 
  const hourlyUsage = [];

  // Start with the first available reading of the day
  let lastKnownWh = hourlyWh[times[0]] !== undefined ? hourlyWh[times[0]] : null;
  let gapIndices = [];

  for (let i = 1; i < times.length; i++) {
    const currentTime = times[i];
    const currentWh = hourlyWh[currentTime];

    // Create the initial entry for this hour
    hourlyUsage.push({ time: currentTime, kwh: 0 });
    const currentIndex = hourlyUsage.length - 1;

    if (currentWh === undefined || currentWh === lastKnownWh || lastKnownWh === null) {
      // It's a gap (no change in Wh) - track this index to fill later
      gapIndices.push(currentIndex);
    } else {
      // Reading changed! Calculate the total diff
      const diffWh = currentWh - lastKnownWh;
      
      // Calculate how many hours to split this between
      // (The current hour + all the gap hours we just found)
      const shareCount = gapIndices.length + 1;
      const equalKwh = Number(Math.max(0, (diffWh / shareCount) / 1000).toFixed(3));

      // Fill the gaps
      gapIndices.forEach(idx => {
        hourlyUsage[idx].kwh = equalKwh;
      });

      // Set the current hour
      hourlyUsage[currentIndex].kwh = equalKwh;

      // Clear the gap tracker
      gapIndices = [];
    }

    // Update reference
    if (currentWh !== undefined) {
      lastKnownWh = currentWh;
    }
  }

  HOURLY_KWH_CACHE[meterId] = hourlyUsage;
  
  return meta;
}
/* =========================================================
   3️⃣ FETCH LATEST VALUES (Real-time update)
   ========================================================= */
async function fetchLatestValues(db, meterId) {
  const today = TODAY_DATE[meterId];
  if (!today) return null;

  const q = query(
    ref(db, `energy_data/meters/${meterId}/${today}`),
    orderByKey(),
    limitToLast(1)
  );

  const snap = await get(q);
  if (!snap.exists()) return null;

  const tsKey = Object.keys(snap.val())[0];
  LATEST_ROW[meterId] = snap.val()[tsKey];
  return LATEST_ROW[meterId];
}

/* =========================================================
   4️⃣ REFRESH CONTROLLERS
   ========================================================= */
async function dailyRefresh(db, meterId) {
  await initTodayFromFirebase(db, meterId);
  return await fetchTodayMeta(db, meterId);
}

async function minuteRefresh(db, meterId) {
  return await fetchLatestValues(db, meterId);
}

/* =========================================================
   5️⃣ SAFE GETTERS
   ========================================================= */
export const getLatestRow = (id) => LATEST_ROW[id] || null;
export const getYesterdayLastWh = (id) => META_CACHE[id]?.yesterday_wh ?? null;
export const getPrevMonthLastWh = (id) => META_CACHE[id]?.last_month_wh ?? null;
export const getMonthlyPeakKVA = (id) => META_CACHE[id]?.monthly_peak_kVA ?? null;
export const getYesterdayPeakKVA = (id) => META_CACHE[id]?.yesterday_peak_kVA ?? null;
export const getLast7DaysCache = (id) => LAST_7_DAYS_CACHE[id] || [];
export const getHourlyWh = (id) => HOURLY_WH_CACHE[id] || {};
export const getHourlyUsage = (id) => HOURLY_KWH_CACHE[id] || [];

export {
  dailyRefresh,
  minuteRefresh,
};