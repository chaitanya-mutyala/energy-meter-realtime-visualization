import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/container/Container.jsx";

import HeroBanner from "../assets/Banner4.webp";
import MeterDashboard from "../assets/3.jpg";
import MobileMonitoring from "../assets/1.jpg";
import zeroBanner from "../assets/banner5.webp";
// Added Brain icon for ML representation
import { Zap, Activity, BarChart, ShieldCheck, Cpu, Clock, Radio, Brain, LineChart } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  
  const REDIRECT_TIME_MS = 60000; 
  const [timeLeft, setTimeLeft] = useState(REDIRECT_TIME_MS / 1000);

  useEffect(() => {
    const startTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        navigate("/dashboard");
      }, REDIRECT_TIME_MS);
    };

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const resetTimer = () => {
      startTimer();
      setTimeLeft(REDIRECT_TIME_MS / 1000); 
    };

    startTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearInterval(countdownInterval);
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
      icon: <Brain className="w-7 h-7 tv:w-14 tv:h-14 text-blue-400" />,
      title: "Predictive Forecasting",
      description: "Utilizing Random Forest Regressors to project future load patterns based on historical usage."
    },
    {
      icon: <Clock className="w-7 h-7 tv:w-14 tv:h-14 text-emerald-400" />,
      title: "Minute-to-Minute Logs",
      description: "System precisely transmits data payloads every 60 seconds for granular energy auditing."
    },
  ];

  const stats = [
    { label: "Devices Installed", value: "02", icon: <Cpu className="text-emerald-500"/> },
    { label: "Network Latency", value: "< 2s", icon: <Radio className="text-emerald-500"/> },
    { label: "Sync Interval", value: "1 Min", icon: <Clock className="text-emerald-500"/> },
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
          <div className="mt-8 flex flex-col items-center">
            <div className="w-64 tv:w-[500px] h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              ></div>
            </div>
            <p className="mt-4 text-emerald-500 font-mono text-sm tv:text-3xl animate-pulse">
              System initializing... Redirecting in <span className="font-bold text-white">{timeLeft}s</span>
            </p>
          </div>
        </div>
      </div>

      <Container className="tv:px-20">
        
        {/* ================= SYSTEM VITALS STATISTICS BLOCK ================= */}
        <div className="mt-12 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-slate-900/80 border-l-4 border-emerald-500 rounded-r-xl">
              <div>
                <p className="text-slate-400 text-xs tv:text-xl uppercase tracking-widest">{s.label}</p>
                <p className="text-3xl tv:text-6xl font-bold text-white">{s.value}</p>
              </div>
              <div className="p-3 bg-black rounded-lg">
                {React.cloneElement(s.icon, { size: 32 })}
              </div>
            </div>
          ))}
        </div>

        {/* ================= DATA FLOW STRIP ================= */}
        <div className="my-16 tv:my-32 flex justify-center">
          <div className="px-8 py-5 tv:px-16 tv:py-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-emerald-400 font-mono tv:text-3xl tracking-[0.3em] text-center">
            METER → ESP32 → FIREBASE → ML MODEL → DASHBOARD
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

        {/* ================= NEW: ML FORECASTING SECTION ================= */}
       {/* ================= UPDATED: ML FORECASTING SECTION ================= */}
<section className="py-12 tv:py-24">
  <div className="flex flex-col lg:flex-row items-center gap-12 bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden">
    <div className="w-full lg:w-1/2 p-10 tv:p-24">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <Brain className="text-blue-400 w-8 h-8 tv:w-16 tv:h-16" />
        </div>
        <h2 className="text-3xl tv:text-7xl font-bold text-white tracking-tight">
          Load Forecasting
        </h2>
      </div>
      
      <p className="text-slate-400 tv:text-3xl mb-8 leading-relaxed">
        Every day, a specialized <b>Cloud Function</b> triggers our <b>Random Forest Regressor</b> hosted on Render. 
        The model processes historical trends to generate load predictions, which are then synced back to <b>Firebase</b> for real-time dashboard display.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
          <p className="text-blue-400 font-bold tv:text-2xl uppercase text-[10px] tracking-widest mb-1">Compute</p>
          <p className="text-white font-medium tv:text-xl">Render Engine</p>
        </div>
        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
          <p className="text-emerald-400 font-bold tv:text-2xl uppercase text-[10px] tracking-widest mb-1">Storage</p>
          <p className="text-white font-medium tv:text-xl">Firebase RTDB</p>
        </div>
      </div>
    </div>
    <div className="w-full lg:w-1/2">
      <img 
        src={zeroBanner} 
        alt="Dashboard UI" 
        className="w-full h-[370px] tv:h-[500px] object-cover object-top" 
      />
    </div>
          </div>
    

    
  
  
</section>
        {/* ================= VISUAL SECTION 1: DASHBOARD ================= */}
        <section className="py-12 tv:py-24">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 bg-slate-900/40 rounded-3xl border border-slate-800 overflow-hidden">
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

                <li>• Data transmission optimized for 1-minute intervals</li>

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