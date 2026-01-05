// src/components/BuildingDashboard.jsx
import { useEffect, useState } from "react";
import db from "../store/fire";
import { generateBuildingMetrics } from "./computethree.js";
import Sparkline from "./Sparkline";
import {
  BoltIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ChartBarIcon,
  FireIcon
} from "@heroicons/react/24/outline";

export default function BuildingDashboard({ meterId }) {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!meterId) return;
    let mounted = true;
    const load = async () => {
      const res = await generateBuildingMetrics(db, meterId);
      if (mounted) setData(res);
    };
    load();
    const intervalId = setInterval(load, 60_000);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [meterId]);

  const manualRefresh = async () => {
    setRefreshing(true);
    const start = Date.now();
    const res = await generateBuildingMetrics(db, meterId);
    setData(res);
    const elapsed = Date.now() - start;
    const MIN_SPIN = 600;
    setTimeout(() => setRefreshing(false), Math.max(0, MIN_SPIN - elapsed));
  };

  if (!data) {
    return (
      <div className="w-full h-full bg-black rounded-2xl p-8 tv:p-20 text-white text-2xl">
        Loading…
      </div>
    );
  }

  const timeOnly = new Date(data.timestamp * 1000).toLocaleTimeString();

  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-slate-900 to-black rounded-2xl p-2 tv:p-16 shadow-2xl text-white border border-white/5">
      
      {/* Header - Tightened for TV and Laptop */}
<div className="flex flex-col items-center justify-center tv:mb-4 pb-2 tv:pb-4 border-b border-slate-700/60">
  
  {/* Icon Container: Reduced from w-24/h-24 to w-16/h-16 on TV */}
  <div className="flex items-center justify-center w-10 h-10 tv:w-16 tv:h-16 rounded-lg tv:rounded-xl bg-slate-800 shadow-lg">
    <span className="text-xl tv:text-4xl">
      {meterId === "meter_001" ? "🏢" : "🔬"}
    </span>
  </div>

  <div className="w-full flex items-center mt-1 tv:mt-3 px-2">
    {/* Text: Reduced from text-5xl to text-3xl on TV */}
    <h2 className="text-lg tv:text-3xl font-semibold tracking-wide text-white text-center flex-1">
      {meterId === "meter_001"
        ? "SRK Academic Complex"
        : "APJ Laboratory Complex"}
    </h2>

    {/* Refresh Button: Reduced padding */}
    <button
      onClick={manualRefresh}
      disabled={refreshing}
      className="p-1.5 tv:p-3 rounded-md tv:rounded-xl bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
    >
      <ArrowPathIcon
        className={`w-5 h-5 tv:w-8 tv:h-8 ${
          refreshing ? "animate-spin text-emerald-400" : "text-slate-200"
        }`}
      />
    </button>
  </div>
</div>
      {/* Main Metrics */}
      <div className="grid grid-cols-3 gap-4 mt-2 tv:gap-12">
        <Metric icon={BoltIcon} title="Active Power" value={data.activePower} unit="kW" />
        <Metric icon={LightBulbIcon} title="Reactive Power" value={data.reactivePower} unit="kVAR" sparkcolor={meterId === "meter_001" ? "amber" : "blue"} />
        <Metric icon={ChartBarIcon} title="Peak Load Yesterday" value={data.yesterdayPeakKVA} unit="kVA" />
        <Metric icon={ArrowTrendingUpIcon} title="Energy Used Today" value={data.energyToday} unit="kWh" />
        <Metric icon={CalendarDaysIcon} title="Energy Used This Month" value={data.energyMonth} unit="kWh" sparkcolor={meterId === "meter_001" ? "amber" : "blue"} />
         <Metric icon={FireIcon} title="Monthly Peak Load" value={data.monthlyPeakKVA} unit="kVA" />
        
      </div>

      {/* System Parameters */}
      <div className="grid grid-cols-4 gap-4 tv:gap-10 mt-4 tv:mt-16">
        <SysCard title="Voltage" value={data.voltage} unit="V" />
        <SysCard title="Current" value={data.current} unit="A" />
        <SysCard title="Power Factor" value={data.pf} />
        <SysCard title="Frequency" value={data.frequency} unit="Hz" />
      </div>

      {/* Footer */}
      <div className="mt-2 tv:mt-10 text-right text-sm tv:text-2xl text-slate-300 flex items-center justify-end">
        Updated at {timeOnly}
        <span className="inline-block w-2 h-2 tv:w-5 tv:h-5 rounded-full bg-emerald-400 animate-pulse ml-2 tv:ml-4"></span>
      </div>
    </div>
  );
}

function Metric({ title, value, unit, icon: Icon, sparkcolor = "green" }) {
  const safe = typeof value === "number" ? value.toFixed(2) : "--";

  return (
    <div className="bg-slate-900/80 rounded-xl tv:rounded-3xl p-4 tv:p-12 shadow-lg flex flex-col justify-between border border-white/5">
      <div className="flex items-center gap-2 tv:gap-4 text-slate-300 text-xl tv:text-3xl">
        <Icon className="w-5 h-5 tv:w-10 tv:h-10 text-slate-200" />
        {title}
      </div>

      <div className="text-3xl tv:text-8xl font-bold text-center my-3 tv:my-12 tracking-tight">
        {safe} <span className="text-lg tv:text-4xl font-medium text-slate-300">{unit}</span>
      </div>

      {/* Scale Sparkline for TV if your Sparkline component supports height props */}
      <div className="h-6 tv:h-24">
         <Sparkline color={sparkcolor} />
      </div>
    </div>
  );
}

function SysCard({ title, value, unit = "" }) {
  const safe = typeof value === "number" && !Number.isNaN(value) ? value.toFixed(2) : "--";

  return (
    <div className="bg-slate-900/70 rounded-lg tv:rounded-2xl px-4 py-3 tv:px-10 tv:py-8 text-center shadow-md border border-white/5">
      <div className="text-xs tv:text-2xl text-slate-300 uppercase tracking-widest mb-1 tv:mb-4">
        {title}
      </div>
      <div className="text-lg tv:text-4xl font-semibold mt-1">
        {Math.abs(safe) } <span className="text-sm tv:text-2xl font-normal text-slate-300">{unit}</span>
      </div>
    </div>
  );
}