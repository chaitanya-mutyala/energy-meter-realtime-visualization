import { ref, query, orderByKey, limitToLast, get } from "firebase/database";

/* ========= GLOBAL PER-METER CACHE ========= */
const TODAY_DATE = {};
const LATEST_ROW = {};
const META_CACHE = {};
const LAST_7_DAYS_CACHE = {};
const FORECAST_CACHE = {};
const LOAD_CURVE_CACHE = {};   // 🔥 NEW

/* =========================================================
   1️⃣ INIT TODAY
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
   2️⃣ FETCH FORECAST
   ========================================================= */
async function fetchTodayForecast(db, meterId) {
  const today = TODAY_DATE[meterId];
  if (!today) return null;

  const forecastRef = ref(
    db,
    `loadforecast/meters/${meterId}/${today}`
  );

  const snap = await get(forecastRef);
  if (!snap.exists()) {
    FORECAST_CACHE[meterId] = null;
    return null;
  }

  const forecast = snap.val();

  FORECAST_CACHE[meterId] = {
    generated_at: forecast.generated_at,
    resolution: forecast.resolution,
    unit: forecast.unit,
    points: forecast.prediction_96_points || [],
  };

  return FORECAST_CACHE[meterId];
}

/* =========================================================
   3️⃣ FETCH META (UPDATED)
   ========================================================= */
async function fetchTodayMeta(db, meterId) {
  const today = TODAY_DATE[meterId];
  if (!today) return null;

  const metaRef = ref(
    db,
    `energy_meta/meters/${meterId}/daily/${today}`
  );

  const snap = await get(metaRef);

  if (!snap.exists()) {
    META_CACHE[meterId] = null;
    LAST_7_DAYS_CACHE[meterId] = [];
    LOAD_CURVE_CACHE[meterId] = [];
    return null;
  }

  const meta = snap.val();
  META_CACHE[meterId] = meta;

  /* ---------- LAST 7 DAYS ---------- */
  const dailyArr = meta.last_8_days_wh || [];
  const dailyResult = [];

  for (let i = 1; i < dailyArr.length; i++) {
    if (dailyArr[i] && dailyArr[i - 1]) {
      const usage = dailyArr[i].wh - dailyArr[i - 1].wh;
      dailyResult.push({
        day: dailyArr[i].date,
        wh: Math.max(0, usage),
      });
    }
  }

  LAST_7_DAYS_CACHE[meterId] = dailyResult;

  /* ---------- 🔥 NEW LOAD CURVE ---------- */
  LOAD_CURVE_CACHE[meterId] =
    meta.yesterday_load_curve || [];
  
  return meta;

}

/* =========================================================
   4️⃣ FETCH LATEST VALUES
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
   5️⃣ REFRESH CONTROLLERS
   ========================================================= */
async function dailyRefresh(db, meterId) {
  await initTodayFromFirebase(db, meterId);
  await fetchTodayMeta(db, meterId);
  await fetchTodayForecast(db, meterId);
  return true;
}

async function minuteRefresh(db, meterId) {
  return await fetchLatestValues(db, meterId);
}

/* =========================================================
   6️⃣ GETTERS
   ========================================================= */

export const getLatestRow = (id) =>
  LATEST_ROW[id] || null;

export const getYesterdayLastWh = (id) =>
  META_CACHE[id]?.yesterday_wh ?? null;

export const getPrevMonthLastWh = (id) =>
  META_CACHE[id]?.last_month_wh ?? null;

export const getMonthlyPeakKVA = (id) =>
  META_CACHE[id]?.monthly_peak_kVA ?? null;

export const getYesterdayPeakKVA = (id) =>
  META_CACHE[id]?.yesterday_peak_kVA ?? null;

export const getLast7DaysCache = (id) =>
  LAST_7_DAYS_CACHE[id] || [];

export const getMonthlyPeakAt = (id) =>
  META_CACHE[id]?.monthly_peak_at || null;

/* 🔥 NEW */
export const getLoadCurve = (id) =>
  LOAD_CURVE_CACHE[id] || [];

/* 🔮 FORECAST */
export const getForecast = (id) =>
  FORECAST_CACHE[id] || null;

export const getForecastPoints = (id) =>
  FORECAST_CACHE[id]?.points || [];

export const getForecastResolution = (id) =>
  FORECAST_CACHE[id]?.resolution || null;

export const getForecastUnit = (id) =>
  FORECAST_CACHE[id]?.unit || "W";

export {
  dailyRefresh,
  minuteRefresh,
};