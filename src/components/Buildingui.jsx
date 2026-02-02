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
    const intervalId = setInterval(load, 180_000);
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
          <h2 className="text-3xl tv:text-3xl font-semibold tracking-wide text-white text-center flex-1">
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
              className={`w-5 h-5 tv:w-8 tv:h-8 ${refreshing ? "animate-spin text-emerald-400" : "text-slate-200"
                }`}
            />
          </button>
        </div>
      </div>
      {/* Main Metrics */}
      <div className="flex flex-col lg:flex-row gap-4 tv:gap-12 mt-4">

        {/* Left Side: 4 Standard Metrics (2x2 Grid) */}
        <div className="lg:w-2/3 grid grid-cols-2 gap-4 tv:gap-12">
          <Metric icon={BoltIcon} title="Active Power" icolor="text-amber-400" value={data.activePower} unit="kW" />
          <Metric icon={LightBulbIcon} title="Reactive Power" icolor="text-cyan-400" value={data.reactivePower} unit="kVAR" sparkcolor={meterId === "meter_001" ? "amber" : "blue"} />
          <Metric icon={ArrowTrendingUpIcon} title="Energy Used Today" icolor="text-emerald-400" value={data.energyToday} unit="kWh" />
          <Metric icon={CalendarDaysIcon} title="Energy Used This Month" icolor="text-blue-400" value={data.energyMonth} unit="kWh" sparkcolor={meterId === "meter_001" ? "amber" : "blue"} />
        </div>

        {/* Right Side: 2 Speedometer Metrics (Stacked) */}
        <div className="lg:w-1/3">
          <PeakSpeedometer
            instantKva={data.Load}
            yesterdayPeak={data.yesterdayPeakKVA}
            monthlyPeak={data.monthlyPeakKVA}
            monthlyPeakAt={data.monthlyPeakAt}   // 👈 ADD THIS
            unit="kVA"
          />

        </div>
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

function Metric({ title, icolor, value, unit, icon: Icon, sparkcolor = "green" }) {
  const safe = typeof value === "number" ? value.toFixed(2) : "--";

  return (
    <div className="bg-slate-900/80 rounded-xl tv:rounded-3xl p-4 tv:p-12 shadow-lg flex flex-col justify-between border border-white/5">
      <div className="flex items-center gap-2 tv:gap-4 text-slate-300 text-2xl tv:text-3xl">
        <Icon className={`w-5 h-5 tv:w-10 tv:h-10 ${icolor}`} />
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
  let displayValue = "--";

  if (typeof value === "number") {
    // 1. Get the absolute value to handle -0.999 the same as 0.999
    const absValue = Math.abs(value);

    // 2. Floor to 2 decimal places logic:
    // Multiply by 100 (99.9), floor it (99), then divide by 100 (0.99)
    const floored = Math.floor(absValue * 100) / 100;

    // 3. Format to string to ensure two decimals (e.g., 0.9 becomes "0.90")
    displayValue = floored.toFixed(2);
  }

  return (
    <div className="bg-slate-900/70 rounded-lg tv:rounded-2xl px-4 py-3 tv:px-10 tv:py-8 text-center shadow-md border border-white/5">
      <div className="text-md tv:text-2xl text-slate-300 uppercase tracking-widest mb-1 tv:mb-4">
        {title}
      </div>
      <div className="text-lg tv:text-4xl font-semibold mt-1">
        {displayValue} <span className="text-sm tv:text-2xl font-normal text-slate-300">{unit}</span>
      </div>
    </div>
  );
}


function PeakSpeedometer({ instantKva, yesterdayPeak, monthlyPeak, monthlyPeakAt, unit }) {
  // Gauge logic
  const monthly = monthlyPeak || 1;
  const fillPercentage = Math.min((instantKva / monthly) * 100, 100);
  const safeInstant = typeof instantKva === "number" ? instantKva.toFixed(1) : "--";

  return (
    /* Shell matches Metric component exactly */
    <div className="bg-slate-900/80 rounded-xl tv:rounded-3xl p-2 tv:p-12 shadow-lg flex flex-col justify-between border border-white/5 overflow-hidden h-full">
      
      {/* Header - Matches Metric Header Style */}
      <div className="flex items-center gap-2 tv:gap-4 text-slate-300 text-2xl tv:text-3xl mb-4">
        <ChartBarIcon className="w-5 h-5 tv:w-10 tv:h-10 text-cyan-400" />
        Load Monitoring
      </div>

      {/* Speedometer Gauge Area */}
      <div className="relative flex items-center justify-center flex-grow py-2 tv:py-12">
        <svg className="w-64 h-36 tv:w-[580px] tv:h-[340px]" viewBox="0 0 100 55">
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#1e293b"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="9"
            strokeDasharray={`${(fillPercentage * 125.6) / 100} 125.6`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out"
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text UI - Matches Metric Value Style */}
        <div className="absolute bottom-4 tv:bottom-12 flex flex-col items-center">
          <div className="text-5xl tv:text-9xl font-bold tracking-tight text-white leading-none">
            {safeInstant} 
            <span className="text-xl tv:text-5xl font-medium text-slate-300 ml-2">
              {unit}
            </span>
          </div>
          <div className="text-[12px] tv:text-2xl text-cyan-400 font-bold uppercase tracking-[0.2em] mt-2">
            Instantaneous
          </div>
        </div>
      </div>

      {/* Footer Metrics - Keeping the centered/timestamp layout but synced colors */}
      <div className="w-full grid grid-cols-2 gap-3 mt-4">
        
        {/* Yesterday Peak */}
        <div className="bg-slate-800/40 rounded-xl p-3 tv:p-8 border border-white/5 flex flex-col items-center justify-center">
          <div className="text-[13px] tv:text-2xl text-slate-300 uppercase tracking-widest font-bold mb-1">
            Yesterday Peak
          </div>
          <div className="text-3xl tv:text-6xl font-black text-white tabular-nums">
            {yesterdayPeak?.toFixed(1)} 
            <span className="text-lg tv:text-2xl font-medium text-slate-200 ml-1">{unit}</span>
          </div>
        </div>

        {/* Monthly Peak */}
        <div className="bg-slate-800/40 rounded-xl p-3 tv:p-8 border border-white/5 flex flex-col items-center justify-center">
          <div className="text-[13px] tv:text-2xl text-slate-300 uppercase tracking-widest font-bold mb-1">
            Monthly Peak
          </div>
          <div className="text-3xl tv:text-6xl font-black text-emerald-400 tabular-nums">
            {monthlyPeak?.toFixed(1)} 
            <span className="text-lg tv:text-2xl font-medium text-slate-200 ml-1">{unit}</span>
          </div>
          
          {/* Timestamp UI */}
          <div className="text-[13px] tv:text-xl text-slate-300 font-mono mt-2 font-semibold bg-white/5 px-1 py-0.5 rounded flex items-center gap-2">
            <span>{monthlyPeakAt?.date}</span>
            <span className="opacity-20">|</span>
            <span>{monthlyPeakAt?.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}