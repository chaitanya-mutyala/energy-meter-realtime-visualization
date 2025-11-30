import React, { useEffect, useState, useRef } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    RadialBarChart,
    RadialBar,
} from "recharts";
import { RefreshCw } from "lucide-react";

// ThingSpeak config
const CHANNEL_ID = 3100444;
const READ_API_KEY = "I2Y7E78X6NGBS2UW";

// Mapping fields
const FIELD_MAP = {
    voltage: "field1",
    current: "field2",
    activeKW: "field3",
    reactiveKVar: "field4",
    apparentKVA: "field5",
    pf: "field6",
    freq: "field7",
    EnergyUsed: "field8",
};

// Premium metric card
const MetricCard = ({ label, value, unit }) => (
    <div className="bg-[#f5f5f5] rounded-2xl shadow p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-3">
            {value ?? "--"}{" "}
            <span className="text-lg text-gray-500">{unit}</span>
        </p>
    </div>
);

function groupBy5Min(history) {
    const result = [];
    let lastMin = -9999;

    for (let i = 0; i < history.length; i++) {
        const item = history[i];
        if (!item?.timeLabel) continue;

        const [H, M] = item.timeLabel.split(":").map(Number);
        const totalMin = H * 60 + M;

        // only accept points at +5 minutes gap
        if (totalMin - lastMin >= 5) {
            result.push(item);
            lastMin = totalMin;
        }

        // stop at exactly 10 points
        if (result.length === 10) break;
    }

    return result;
}


export default function Dashboard() {
    const [latest, setLatest] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null); // State already defined
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    // For needle animation
    const [needleAngle, setNeedleAngle] = useState(0);
    const MAX_CURRENT = 5; // You said max current = 5A

    const parseField = (obj, field) => {
        const v = obj?.[field];
        if (!v) return null;
        const n = Number(String(v).replace(",", "."));
        return Number.isFinite(n) ? n : null;
    };

    // Fetch ThingSpeak data
    const fetchData = async () => {
        setIsLoading(true);

        try {
            const lastURL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`;
            const histURL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=60`;

            const [lastRes, histRes] = await Promise.all([
                fetch(lastURL),
                fetch(histURL),
            ]);

            const lastJson = await lastRes.json();
            const histJson = await histRes.json();

            const latestObj = {
                voltage: parseField(lastJson, FIELD_MAP.voltage),
                current: parseField(lastJson, FIELD_MAP.current),
                activeKW: parseField(lastJson, FIELD_MAP.activeKW),
                reactiveKVar: parseField(lastJson, FIELD_MAP.reactiveKVar),
                apparentKVA: parseField(lastJson, FIELD_MAP.apparentKVA),
                pf: parseField(lastJson, FIELD_MAP.pf),
                freq: parseField(lastJson, FIELD_MAP.freq),
                EnergyUsed: parseField(lastJson, FIELD_MAP.EnergyUsed),
            };

            // Update needle animation
            const curr = latestObj.current ?? 0;
            const angle = Math.min(180, (curr / MAX_CURRENT) * 180);
            setNeedleAngle(angle);

            const feeds = histJson.feeds || [];

            const mapped = feeds.map((f) => {
                const t = new Date(f.created_at);
                const label = `${String(t.getHours()).padStart(2, "0")}:${String(
                    t.getMinutes()
                ).padStart(2, "0")}`;
                return {
                    timeLabel: label,
                    activeKW: parseField(f, FIELD_MAP.activeKW),
                    EnergyUsed: parseField(f, FIELD_MAP.EnergyUsed),
                };
            });

            setLatest(latestObj);
            setHistory(mapped);
            
            // --- MODIFICATION: Set lastUpdated state here ---
            // lastJson.created_at contains the timestamp of the latest feed entry.
            if (lastJson.created_at) {
                setLastUpdated(new Date(lastJson.created_at).toLocaleString());
            } else {
                setLastUpdated('N/A');
            }
            // -------------------------------------------------

        } catch (err) {
            setError(err.message);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
        intervalRef.current = setInterval(fetchData, 30000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const grouped = groupBy5Min(history);

    const gaugeValue = latest?.current ?? 0;

    return (
        <div
            className="min-h-screen p-6"
            style={{
                background: "linear-gradient(145deg,#e9efff,#d4e1ff)",
            }}
        >
            <div className="max-w-6xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-8">

                {/* HEADER */}
                <div className="flex justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 text-center">Smart Energy Monitoring</h1>
                        <p className="text-sm text-gray-600">Live meter dashboard</p>
                        
                        {/* --- MODIFICATION: Display Last Updated Timestamp --- */}
                        <p className="text-xs text-gray-500 mt-1">
                            Last Updated: 
                            <span className="font-semibold ml-1">
                                {lastUpdated || 'N/A'}
                            </span>
                        </p>
                        {/* -------------------------------------------------- */}
                    </div>

                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                        />
                        {isLoading ? "Loading..." : "Refresh"}
                    </button>
                </div>

                {/* PARAMETER CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <MetricCard label="Voltage" value={latest?.voltage?.toFixed(1)} unit="V" />
                    <MetricCard label="Current" value={latest?.current?.toFixed(2)} unit="A" />
                    <MetricCard label="Active Power" value={latest?.activeKW?.toFixed(2)} unit="kW" />
                    <MetricCard label="Apparent Power" value={latest?.reactiveKVar?.toFixed(2)} unit="kVA" />
                    <MetricCard label="Reactive Power" value={latest?.apparentKVA?.toFixed(2)} unit="kVAR" />
                    <MetricCard label="Power Factor" value={latest?.pf?.toFixed(2)} unit="" />
                    <MetricCard label="Frequency" value={latest?.freq?.toFixed(2)} unit="Hz" />
                    <MetricCard label="Total Energy Used" value={latest?.EnergyUsed?.toFixed(2)} unit="kWh" />
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LINE CHART */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100" style={{ height: 300 }}>
                        <h3 className="text-lg font-semibold mb-3">Active Power (kW)</h3>
                        <ResponsiveContainer>
                            <LineChart data={grouped}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="timeLabel" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="activeKW"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* BAR CHART */}
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100" style={{ height: 300 }}>
                        <h3 className="text-lg font-semibold mb-3">Energy Usage (kWh)</h3>
                        <ResponsiveContainer>
                            <BarChart data={grouped}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="timeLabel" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="EnergyUsed"
                                    fill="#3b82f6"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ==== ANIMATED NEEDLE GAUGE ==== */}
                <div className="mt-12 flex justify-center">
                    <div className="bg-white rounded-2xl shadow p-8 border border-gray-100 w-full lg:w-1/2 relative">

                        <h3 className="text-lg font-semibold text-center mb-6">Current (A)</h3>

                        {/* Gauge graphic */}
                        <div className="relative flex justify-center items-end" style={{ height: 220 }}>
                            <svg width="250" height="150">
                                
                                {/* Arc */}
                                <path
                                    d="M20,140 A110,110 0 0,1 230,140"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="18"
                                />

                                {/* Needle (ANIMATED) */}
                                <line
                                    x1="125"
                                    y1="140"
                                    x2="125"
                                    y2="40"
                                    stroke="#2563eb"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    style={{
                                        transform: `rotate(${needleAngle}deg)`,
                                        transformOrigin: "125px 140px",
                                        transition: "transform 0.9s ease-out",
                                    }}
                                />

                                {/* Center pin */}
                                <circle cx="125" cy="140" r="10" fill="#2563eb" />
                            </svg>
                        </div>

                        {/* Value */}
                        <p className="text-center text-3xl font-bold text-gray-900 mt-4">
                            {gaugeValue?.toFixed(2)} <span className="text-lg text-gray-500">A</span>
                        </p>

                        <p className="text-center text-sm text-gray-500 mt-1">
                            Max: 2.5 A
                        </p>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-10">
                    Auto-refresh every 30 seconds.
                </p>

                {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded mt-4">
                        <b>Error:</b> {error}
                    </div>
                )}
            </div>
        </div>
    );
}