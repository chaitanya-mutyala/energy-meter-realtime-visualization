import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/container/Container.jsx";

import HeroBanner from "../assets/Banner4.webp";
import MeterDashboard from "../assets/3.jpg";
import MobileMonitoring from "../assets/1.jpg";

import { Zap, Activity, BarChart, ShieldCheck } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  // ================= AUTO-REDIRECT LOGIC =================
  useEffect(() => {
    const REDIRECT_TIME = 120000; // 60 Seconds

    const startTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        navigate("/dashboard");
      }, REDIRECT_TIME);
    };

    const resetTimer = () => startTimer();

    startTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [navigate]);

  const features = [
    {
      icon: <Zap className="w-7 h-7 tv:w-14 tv:h-14 text-emerald-400" />,
      title: "Real-Time Monitoring",
      description: "Live visualization of power metrics across campus buildings using Modbus RTU protocols."
    },
    {
      icon: <Activity className="w-7 h-7 tv:w-14 tv:h-14 text-emerald-400" />,
      title: "Anomaly Detection",
      description: "Identification of abnormal load patterns and leakage to ensure high electrical efficiency."
    },
    {
      icon: <BarChart className="w-7 h-7 tv:w-14 tv:h-14 text-emerald-400" />,
      title: "ML Forecasting",
      description: "Predictive analytics for next-day demand planning based on historical consumption data."
    },
  ];

  return (
    <div className="w-full min-h-screen bg-black text-slate-200">
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-[55vh] tv:h-[65vh] overflow-hidden flex items-center justify-center">
        <img
          src={HeroBanner}
          alt="Energy Monitoring System"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 text-center px-6 max-w-4xl tv:max-w-7xl">
          <h1 className="text-5xl md:text-6xl tv:text-9xl font-bold text-white mb-6 tracking-wide">
            Smart Energy Monitoring <br/> <span className="text-emerald-500">NIT Andhra Pradesh</span>
          </h1>
          <p className="text-lg md:text-xl tv:text-4xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            A complete IoT ecosystem: <b>Modbus RS-485</b> to <b>ESP32</b> gateways, synced with <b>Firebase</b> for real-time analytics.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-10 tv:mt-20 px-10 py-3 tv:px-20 tv:py-8 rounded-full bg-emerald-500 text-black font-bold tv:text-3xl hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            Launch Dashboard
          </button>
          <p className="mt-6 text-slate-500 text-xs tv:text-xl italic">Auto-redirecting to live data in 120s...</p>
        </div>
      </div>

      <Container className="tv:px-20">
        
        {/* ================= DATA FLOW STRIP ================= */}
        <div className="my-16 tv:my-32 flex justify-center">
          <div className="px-8 py-5 tv:px-16 tv:py-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-emerald-400 font-mono tv:text-3xl tracking-[0.3em]">
            METER → ESP32 → CLOUD → DASHBOARD
          </div>
        </div>
        {/* ================= FEATURE CARDS ================= */}
        <section className="py-16 tv:py-32">
          <div className="grid md:grid-cols-3 gap-8 tv:gap-16">
            {features.map((f, i) => (
              <div key={i} className="p-10 tv:p-20 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-emerald-500/50 transition-all">
                <div className="mb-6">{f.icon}</div>
                <h3 className="text-2xl tv:text-5xl font-bold text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 tv:text-2xl leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= VISUAL SECTION 1: DASHBOARD ================= */}
        <section className="py-12 tv:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden">
            <div className="w-full lg:w-1/2 p-10 tv:p-24">
              <h2 className="text-3xl tv:text-7xl font-bold text-white mb-6">Live Visualization</h2>
              <p className="text-slate-400 tv:text-3xl mb-8 leading-relaxed">
                Our web-based dashboard provides a high-fidelity view of electrical parameters including <b>Active Power (kW)</b>, <b>Power Factor</b>, and <b>Voltage stability</b>.
              </p>
              <div className="flex items-center gap-3 text-emerald-400 tv:text-3xl font-semibold">
                <ShieldCheck className="tv:w-10 tv:h-10"/> Secure Firebase Integration
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <img src={MeterDashboard} alt="Dashboard UI" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* ================= VISUAL SECTION 2: MOBILE/SYSTEM ================= */}
        <section className="py-12 tv:py-24">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden">
            <div className="w-full lg:w-1/2 p-10 tv:p-24">
              <h2 className="text-3xl tv:text-7xl font-bold text-white mb-6">Edge Intelligence</h2>
              <p className="text-slate-400 tv:text-3xl mb-8 leading-relaxed">
                The ESP32 acts as a robust <b>Modbus Master</b>, polling data every few seconds and handling local buffering to ensure zero data loss during network spikes.
              </p>
              <ul className="space-y-4 tv:space-y-8 text-slate-300 tv:text-2xl italic">
                <li>• Industry standard RS-485 Communication</li>
                <li>• Low-latency WebSocket updates</li>
                <li>• Responsive UI architecture</li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2">
              <img src={MobileMonitoring} alt="Hardware Gateway" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        

      </Container>
    </div>
  );
}

export default Home;