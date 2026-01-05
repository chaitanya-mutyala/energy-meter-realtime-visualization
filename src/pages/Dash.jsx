// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import BuildingDashboard from "../components/Buildingui.jsx";
import EnergyConsumptionChart from "../components/Energychart.jsx";
import { buildWeeklyEnergyData } from "../components/Buildweeklydata.js";
import { dailyRefresh } from "../components/Firebasetwo.js";
import db from "../store/fire";

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

  useEffect(() => {
    let dailyTimeout;
    let dailyInterval;

    const runDailyRefresh = async () => {
      await Promise.all([
        dailyRefresh(db, "meter_001"),
        dailyRefresh(db, "meter_002"),
      ]);
      setWeeklyEnergyData(buildWeeklyEnergyData());
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
  <div className="bg-black overflow-hidden">

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
          <div className="w-full">
            <BuildingDashboard meterId="meter_001" />
          </div>
          <div className="w-full">
            <BuildingDashboard meterId="meter_002" />
          </div>
        </div>

        {/* ================= CHARTS SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 tv:gap-12">
          <div className="w-full min-h-[400px] tv:min-h-[500px]">
            <EnergyConsumptionChart data={weeklyEnergyData} />
          </div>
          
        </div>

      </div>   {/* closes flex container */}
    </div>     {/* closes scale wrapper */}
  </div>   

);
}