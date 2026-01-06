import {
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

export default function EnergyForecastChart() {
    const [isTV, setIsTV] = useState(false);

    useEffect(() => {
        const checkSize = () => setIsTV(window.innerWidth >= 1900);
        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    // Static axis points for a 24-hour view (every 3 hours)
    const emptyAxisData = [
        { time: "00:00" }, { time: "03:00" }, { time: "06:00" }, 
        { time: "09:00" }, { time: "12:00" }, { time: "15:00" }, 
        { time: "18:00" }, { time: "21:00" }, { time: "24:00" }
    ];

    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl tv:rounded-3xl p-6 tv:p-12 shadow-2xl flex flex-col h-full">
            {/* Heading Section */}
            <h3 className="flex items-center gap-2 tv:gap-4 text-md tv:text-3xl uppercase tracking-wider text-slate-100 mb-4 tv:mb-10">
                <ChartBarIcon className="w-5 h-5 tv:w-10 tv:h-10 text-blue-400" />
                <span>Next 24-Hour Energy Forecast</span>
            </h3>

            {/* Chart Canvas Area */}
            <div className="w-full h-[260px] tv:h-[600px] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={emptyAxisData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: isTV ? 40 : 20,
                            bottom: isTV ? 40 : 20
                        }}
                    >
                        {/* Background Grid */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        
                        {/* Time Axis */}
                        <XAxis
                            dataKey="time"
                            stroke="#ebf1f7ff"
                            fontSize={isTV ? 24 : 18}
                            tickLine={false}
                            axisLine={false}
                            dy={isTV ? 15 : 10}
                        />

                        {/* kWh Axis */}
                        <YAxis
                            stroke="#edf2f7ff"
                            fontSize={isTV ? 24 : 18}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 1000]} // Default scale
                            label={{
                                value: "kWh",
                                angle: -90,
                                position: "insideLeft",
                                fill: "#ecf0f6ff",
                                fontSize: isTV ? 24 : 16,
                                dx: isTV ? -30 : -15,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}