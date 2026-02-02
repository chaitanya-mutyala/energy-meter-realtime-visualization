// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import BuildingDashboard from "../components/Buildingui.jsx";
import EnergyConsumptionChart from "../components/Energychart.jsx";
import { buildWeeklyEnergyData } from "../components/Buildweeklydatathree.js";
import { dailyRefresh } from "../components/Firebasethree.js";
import db from "../store/fire";
import { buildHourlyEnergyData } from "../components/Buildhourly.js";
import {PowerUsageChart} from "../components/linechart.jsx";
import Forecast from "../components/Forecast.jsx";
import {buildForecastEnergyData} from "../components/buildForecastEnergyData.js";


function msUntilNext535IST() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const next = new Date(istNow);
  next.setHours(5, 35, 0, 0);

  if (istNow >= next) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime() - istNow.getTime();
}

export default function Dash() {
  const [weeklyEnergyData, setWeeklyEnergyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [forecastPoints, setForecastPoints] = useState([]);

  useEffect(() => {
    let dailyTimeout;
    let dailyInterval;

    const runDailyRefresh = async () => {
  try {
    // Wait for Firebase to populate the internal caches in Firebasethree.js
    await Promise.all([
      dailyRefresh(db, "meter_001"),
      dailyRefresh(db, "meter_002"),
    ]);
    
    // Now that cache is full, build the array for the chart
    const chartData = buildWeeklyEnergyData();
    const hourlyData = buildHourlyEnergyData();
    const forecastData = buildForecastEnergyData();

    
    // Log this to your browser console (F12) to see if data exists

    setWeeklyEnergyData(chartData);
    setHourlyData(hourlyData);
    setForecastPoints(forecastData);
  } catch (error) {
    console.error("Refresh failed:", error);
  }
};

    runDailyRefresh();

    dailyTimeout = setTimeout(() => {
      runDailyRefresh();
      dailyInterval = setInterval(runDailyRefresh, 24 * 60 * 60 * 1000);
    }, msUntilNext535IST());

    return () => {
      clearTimeout(dailyTimeout);
      clearInterval(dailyInterval);
    };
  }, []);

  return (
  <div className="bg-black h-auto md:h-255 overflow-hidden">

    {/* SCALE WRAPPER */}
    <div
      className="
        origin-top-left
        scale-[0.6]
        w-[166%]

      "
    >
      <div
        className="
          flex flex-col
          gap-5
         p-2
          lg:p-8
          tv:p-12
        "
      >
        {/* ================= METERS SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 tv:gap-12">
          <div className="w-full border-2 border-amber-500/40 rounded-3xl p-1 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
    <BuildingDashboard meterId="meter_001" />
  </div>

  {/* Meter 2: APJ Laboratory Complex (Cyan/Blue Theme) */}
  <div className="w-full border-2 border-blue-500/40 rounded-3xl p-1 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
    <BuildingDashboard meterId="meter_002" />
  </div>
        </div>

        {/* ================= CHARTS SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 tv:gap-12">
          <div className="w-full min-h-[400px] tv:min-h-[500px] border-2 border-cyan-500/40 rounded-3xl p-1 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <EnergyConsumptionChart data={weeklyEnergyData} />
          </div>
          <div className="w-full min-h-[400px] tv:min-h-[500px] border-2 border-cyan-500/40 rounded-3xl p-1 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Forecast forecast={forecastPoints} />
          </div>

          
        </div>

        <div >
          <div className="w-full tv:min-h-[500px] border-2 border-cyan-500/40 rounded-3xl p-1 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
<PowerUsageChart hourlyData={hourlyData} />
          </div>
          
        </div>

      </div>   {/* closes flex container */}
    </div>     {/* closes scale wrapper */}
  </div>   

);
}