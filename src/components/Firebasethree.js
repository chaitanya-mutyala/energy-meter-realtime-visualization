import { ref, query, orderByKey, limitToLast, get } from "firebase/database";

/* ========= GLOBAL PER-METER CACHE ========= */

const TODAY_DATE = {};              // meterId → YYYY-MM-DD
const LATEST_ROW = {};              // meterId → latest reading

const META_CACHE = {};              // meterId → today meta object
const LAST_7_DAYS_CACHE = {};       // meterId → [{ day, Wh }]

/* =========================================================
   1️⃣ INIT TODAY (LAST FOLDER) – DAILY
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
   2️⃣ FETCH TODAY META (CHEAP – DAILY)
   ========================================================= */
/* Firebasethree.js */

async function fetchTodayMeta(db, meterId) {
  const today = TODAY_DATE[meterId];
  if (!today) throw new Error("TODAY_DATE missing");

  const metaRef = ref(db, `energy_meta/meters/${meterId}/daily/${today}`);
  const snap = await get(metaRef);

  if (!snap.exists()) return null;

  META_CACHE[meterId] = snap.val();

  const arr = snap.val().last_8_days_wh || [];
  const result = [];

  // Logic: Current Day Usage = (Current Day Total - Previous Day Total)
  // We start at i = 1 because we need the 'i-1' baseline
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] && arr[i].date && arr[i-1]) {
      const dailyUsageWh = arr[i].wh - arr[i-1].wh;
      
      result.push({
        day: arr[i].date, // The date the energy was used
        wh: Math.max(0, dailyUsageWh), // Ensure we don't get negative numbers
      });
    }
  }
  
  LAST_7_DAYS_CACHE[meterId] = result;
  console.log(`Cache built for ${meterId}:`, result);
}
/* =========================================================
   3️⃣ FETCH LATEST VALUES – EVERY MINUTE
   ========================================================= */
async function fetchLatestValues(db, meterId) {
  const today = TODAY_DATE[meterId];
  if (!today) throw new Error("TODAY_DATE missing");

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
  await fetchTodayMeta(db, meterId);
}

async function minuteRefresh(db, meterId) {
  await fetchLatestValues(db, meterId);
}

async function manualRefresh(db, meterId) {
  await fetchLatestValues(db, meterId);
}

/* =========================================================
   5️⃣ SAFE GETTERS (NO FIREBASE HERE)
   ========================================================= */

function getLatestRow(meterId) {
  return LATEST_ROW[meterId] || null;
}

function getYesterdayLastWh(meterId) {
  return META_CACHE[meterId]?.yesterday_wh ?? null;
}

function getPrevMonthLastWh(meterId) {
  return META_CACHE[meterId]?.last_month_wh ?? null;
}

function getMonthlyPeakKVA(meterId) {
  return META_CACHE[meterId]?.monthly_peak_kVA ?? null;
}

function getYesterdayPeakKVA(meterId) {
  return META_CACHE[meterId]?.yesterday_peak_kVA ?? null;
}

function getLast7DaysCache(meterId) {
    console.log("Getting last 7 days cache for meter:", meterId);
    console.log("Cache content:", LAST_7_DAYS_CACHE[meterId]);
  return LAST_7_DAYS_CACHE[meterId] || [];
}

/* =========================================================
   6️⃣ EXPORTS (API UNCHANGED + NEW PEAK GETTERS)
   ========================================================= */

export {
  dailyRefresh,
  minuteRefresh,
  manualRefresh,

  getLatestRow,
  getYesterdayLastWh,
  getPrevMonthLastWh,
  getLast7DaysCache,

  getMonthlyPeakKVA,
  getYesterdayPeakKVA,
};
