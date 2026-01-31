import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  ReferenceLine,
  Label,
} from "recharts";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

/* ---------------- TOOLTIP ---------------- */

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const { time } = payload[0].payload;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 shadow-2xl">
      <p className="text-white font-bold mb-2">{time}</p>
      {payload.map((entry, i) => (
        <p
          key={i}
          className="text-sm font-bold"
          style={{ color: entry.color }}
        >
          {entry.name}: {entry.value.toFixed(2)} kW
        </p>
      ))}
    </div>
  );
};

/* ---------------- HELPERS ---------------- */

// Convert IST clock time → forecast index
const getISTIndex = () => {
  const now = new Date();

  // Force IST (important)
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const minutes = ist.getHours() * 60 + ist.getMinutes();

  // index 0 corresponds to 00:15
  let index = Math.floor((minutes - 15) / 15);

  // wrap safely
  if (index < 0) index = 95;
  if (index > 95) index = 95;

  return index;
};
const indexToTime = (index) => {
  const totalMinutes = (index + 1) * 15;
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}`;
};


// 3-hour ticks aligned to your array
const X_TICKS = [-1, 11, 23, 35, 47, 59, 71, 83, 95];

/* ---------------- COMPONENT ---------------- */

export default function Forecast({ forecast }) {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isTV, setIsTV] = useState(false);

  useEffect(() => {
    // screen size
    const checkSize = () => setIsTV(window.innerWidth >= 1900);
    checkSize();
    window.addEventListener("resize", checkSize);

    // NOW line updater
    const updateNow = () => {
      setCurrentIndex(getISTIndex());
    };

    updateNow();
    const timer = setInterval(updateNow, 60_000);

    return () => {
      window.removeEventListener("resize", checkSize);
      clearInterval(timer);
    };
  }, []);

  if (!forecast || forecast.length !== 96) {
    return <div className="text-white p-10">Loading Forecast…</div>;
  }

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-2xl h-full">
      <h3 className="flex items-center gap-2 text-md tv:text-3xl uppercase tracking-wider text-slate-200 mb-8">
        <ChartBarIcon className="w-5 h-5 tv:w-10 tv:h-10 text-blue-400" />
        <span>Today Load Forecast (kW)</span>
      </h3>

      <div className="w-full h-[350px] tv:h-[700px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast}>
            <defs>
              <filter id="lineGlow" x="-10%" y="-10%" width="120%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              type="number"                 // 👈 REQUIRED
              dataKey="index"
              ticks={X_TICKS}
              domain={[-1, 95]}              // 👈 now respected
              tickFormatter={(i) => {
                if (i === -1) return "00:00";
                return forecast[i]?.time ?? "";
              }}
              tickLine={false}
              axisLine={false}
              stroke="#e1e7f0"
              tick={{ fontSize: isTV ? 20 : 16 }}
            />



            <YAxis
              stroke="#e1e7f0"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconSize={isTV ? 26 : 20}
              formatter={(value) => (
                <span style={{ color: "#ffffff", fontWeight: 400 }}>
                  {value}
                </span>
              )}
            />



            {/* NOW LINE */}
            {Number.isInteger(currentIndex) && (
              <ReferenceLine
                x={currentIndex}
                stroke="#22c55e"                 // ✅ green
                strokeWidth={isTV ? 3 : 2}
                strokeDasharray="6 4"
              >
                <Label
                  value={indexToTime(currentIndex)}
                  position="insideTop"
                  offset={20}
                  fill="#22c55e"
                  fontSize={isTV ? 20 : 16}
                  fontWeight="bold"
                />

              </ReferenceLine>
            )}


            <Area
              type="monotone"
              dataKey="building1"
              name="SRK Academic Complex"
              stroke="#f59e0b"
              fill="none"
              strokeWidth={isTV ? 6 : 3}
              filter="url(#lineGlow)"      // ✨
            />

            <Area
              type="monotone"
              dataKey="building2"
              name="APJ Lab"
              stroke="#3b82f6"
              fill="none"
              strokeWidth={isTV ? 6 : 3}
              filter="url(#lineGlow)"      // ✨
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
