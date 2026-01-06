import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-950 border border-slate-800 rounded-lg tv:rounded-3xl px-4 py-3 tv:px-10 tv:py-8 shadow-2xl z-50">
                {/* White color time text */}
                <p className="text-white font-bold text-lg tv:text-4xl mb-2 tv:mb-4">{label}</p>
                <div className="space-y-1 tv:space-y-4">
                    {payload.map((entry, index) => (
                        <p key={index} className="text-xs tv:text-3xl font-bold" style={{ color: entry.color }}>
                            {entry.name}: {Number(entry.value).toFixed(1)} kWh
                        </p>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export function PowerUsageChart({ hourlyData }) {
    const [isTV, setIsTV] = useState(false);

    useEffect(() => {
        const checkSize = () => setIsTV(window.innerWidth >= 1900);
        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    // Prevent crash if data is missing
    if (!hourlyData || hourlyData.length === 0) {
        return <div className="text-white p-10">Loading Chart Data...</div>;
    }

    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl tv:rounded-3xl p-6 tv:p-12 shadow-2xl flex flex-col min-h-[400px] tv:min-h-[850px]">
            <h3 className="flex items-center gap-2 tv:gap-4 text-md tv:text-3xl uppercase tracking-wider text-slate-200 mb-8 tv:mb-16">
                <ChartBarIcon className="w-5 h-5 tv:w-10 tv:h-10 text-amber-400" />
                <span>Yesterday 24-Hour Energy Consumption (kWh)</span>
            </h3>
            
            {/* Parent container MUST have a explicit height for ResponsiveContainer to work */}
            <div className="w-full h-[350px] tv:h-[700px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                        data={hourlyData} 
                        margin={{ top: 5, right: 30, left: isTV ? 60 : 20, bottom: isTV ? 60 : 20 }}
                    >
                        <defs>
                            <linearGradient id="colorM1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorM2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        
                        <XAxis 
                            dataKey="hour" 
                            stroke="#e1e7f0ff" 
                            fontSize={isTV ? 28 : 18} 
                            tickLine={false}
                            axisLine={false}
                            dy={isTV ? 30 : 10}
                        />
                        
                        <YAxis 
                            stroke="#e1e7f0ff" 
                            fontSize={isTV ? 28 : 18} 
                            tickLine={false}
                            axisLine={false}
                            dx={isTV ? -20 : -5}
                        />
                        
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 2 }} />
                        
                        <Area
                            type="monotone"
                            dataKey="building1" // Ensure this matches your data keys
                            name="SRK Academic"
                            stroke="#f59e0b"
                            strokeWidth={isTV ? 8 : 4}
                            fillOpacity={1}
                            fill="url(#colorM1)"
                            animationDuration={1500}
                        />
                        
                        <Area
                            type="monotone"
                            dataKey="building2" // Ensure this matches your data keys
                            name="APJ Laboratory"
                            stroke="#3b82f6"
                            strokeWidth={isTV ? 8 : 4}
                            fillOpacity={1}
                            fill="url(#colorM2)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}