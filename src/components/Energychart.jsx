import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { name, value, fill } = payload[0];

        return (
            <div className="bg-slate-900 border border-slate-800 rounded-lg tv:rounded-2xl px-3 py-2 tv:px-8 tv:py-6 text-xs tv:text-2xl shadow-2xl">
                <p className="text-slate-200 mb-1 tv:mb-3">{label}</p>
                <p className="text-slate-200 font-semibold large">
                    {name}: <span style={{ color: fill }}>{value} kWh</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function EnergyConsumptionChart({ data }) {
    const [isTV, setIsTV] = useState(false);

    useEffect(() => {
        const checkSize = () => setIsTV(window.innerWidth >= 1900);
        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl tv:rounded-3xl p-6 tv:p-12 shadow-2xl flex flex-col h-full">
            <h3 className="flex items-center gap-2 tv:gap-4 text-md tv:text-3xl uppercase tracking-wider text-slate-200 mb-4 tv:mb-10">
                <ChartBarIcon className="w-5 h-5 tv:w-10 tv:h-10 text-slate-200" />
                <span>Energy Consumption (Last 7 Days)</span>
            </h3>

            <div className="w-full h-[260px] tv:h-[600px] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={data} 
                        barGap={isTV ? 12 : 6}
                        /* FIX 1: Add margins to prevent day labels (bottom) and kWh (left) from cutting */
                        margin={{ 
                            top: 10, 
                            right: 10, 
                            left: isTV ? 40 : 20, 
                            bottom: isTV ? 40 : 20 
                        }}
                    >
                        <XAxis
                            dataKey="day"
                            stroke="#d9e0e8ff"
                            fontSize={isTV ? 24 : 16}
                            tickLine={false}
                            axisLine={false}
                            /* FIX 2: dy pushes the text down slightly away from the axis line */
                            dy={isTV ? 15 : 10}
                        />

                        <YAxis
                            stroke="#d7dee6ff"
                            fontSize={isTV ? 24 : 16}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => v}
                            /* FIX 3: Change position to 'top' or increase offset/dx to move away from numbers */
                            label={{
                                value: "kWh",
                                angle: -90,
                                position: "insideLeft", 
                                fill: "#ecf0f6ff",
                                fontSize: isTV ? 24 : 16,
                                offset: isTV ? 10 : 0,
                                dx: isTV ? -30 : -15, // Moves label horizontally to the left
                            }}
                        />

                        <Tooltip
                            shared={false}
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(255,255,255,0.03)" }}
                        />

                        <Legend
                            verticalAlign="top"
                            align="right"
                            wrapperStyle={{ 
                                fontSize: isTV ? "24px" : "12px",
                                paddingBottom: isTV ? "40px" : "20px" 
                            }}
                            formatter={(value) => (
                                <span className="text-slate-200 ml-2">{value}</span>
                            )}
                        />

                        <Bar
                            dataKey="building1"
                            name="SRK Academic Complex"
                            fill="#e7a93dff"
                            radius={isTV ? [8, 8, 0, 0] : [4, 4, 0, 0]}
                            barSize={isTV ? 60 : undefined}
                        />

                        <Bar
                            dataKey="building2"
                            name="APJ Laboratory Complex"
                            fill="#2276fdff"
                            radius={isTV ? [8, 8, 0, 0] : [4, 4, 0, 0]}
                            barSize={isTV ? 60 : undefined}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
} 