import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,              // ✅ ADD
} from "recharts";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 shadow-2xl">
        <p className="text-white font-bold mb-2">
          {payload[0]?.payload?.time}
        </p>
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
  }
  return null;
};

export default function Forecast({ forecast }) {
  const [isTV, setIsTV] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsTV(window.innerWidth >= 1900);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  if (!forecast || forecast.length === 0) {
    return <div className="text-white p-10">Loading Forecast...</div>;
  }

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl tv:rounded-3xl p-6 tv:p-12 shadow-2xl h-full">
      <h3 className="flex items-center gap-2 tv:gap-4 text-md tv:text-3xl uppercase tracking-wider text-slate-200 mb-8">
        <ChartBarIcon className="w-5 h-5 tv:w-10 tv:h-10 text-blue-400" />
        <span>Today Load Forecast (kW)</span>
      </h3>

      <div className="w-full h-[350px] tv:h-[700px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast}>
            <defs>
              {/* ✨ Glow */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="index"
              tickFormatter={(i) =>
                i % 12 === 0 ? forecast[i]?.time : ""
              }
              tickLine={false}
              axisLine={false}
              stroke="#e1e7f0ff"
            />

            <YAxis
              stroke="#e1e7f0ff"
              tickLine={false}
              axisLine={false}
              label={{
                value: "kW",
                angle: -90,
                position: "insideLeft",
                fill: "#e1e7f0ff",
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* ✅ LEGEND ADDED */}
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{
                fontSize: isTV ? "24px" : "12px",
                paddingBottom: isTV ? "30px" : "16px",
              }}
              formatter={(value) => (
                <span className="text-slate-200 ml-2">{value}</span>
              )}
            />

            <Area
              type="monotone"
              dataKey="building1"
              name="SRK Academic Complex"
              stroke="#f59e0b"
              strokeWidth={isTV ? 8 : 4}
              fill="none"
              filter="url(#glow)"
              animationDuration={1500}
            />

            <Area
              type="monotone"
              dataKey="building2"
              name="APJ Laboratory Complex"
              stroke="#3b82f6"
              strokeWidth={isTV ? 8 : 4}
              fill="none"
              filter="url(#glow)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
