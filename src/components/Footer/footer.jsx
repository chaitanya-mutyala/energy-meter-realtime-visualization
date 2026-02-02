import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <section className="w-full bg-gradient-to-t from-slate-900 via-slate-950 to-black py-14 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap -m-6">

          {/* 1. Tech Stack */}
          <div className="p-6 w-1/2 md:w-1/4">
            <h3 className="mb-6 text-[10px] font-bold uppercase text-emerald-400 tracking-[0.2em]">
              Infrastructure
            </h3>
            <ul className="space-y-3">
              <li className="text-sm text-slate-300">ESP32 & Modbus RTU</li>
              <li className="text-sm text-slate-300">Firebase Realtime DB</li>
              <li className="text-sm text-slate-300">React & Tailwind CSS</li>
            </ul>
          </div>

          {/* 2. System Status */}
          <div className="p-6 w-1/2 md:w-1/4">
            <h3 className="mb-6 text-[10px] font-bold uppercase text-blue-400 tracking-[0.2em]">
              Live Status
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Gateway: Online
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                DB Sync: Active
              </li>
            </ul>
          </div>

          {/* 3. API & ML - Added for your Render Link */}
          <div className="p-6 w-1/2 md:w-1/4">
            <h3 className="mb-6 text-[10px] font-bold uppercase text-emerald-400 tracking-[0.2em]">
              Endpoints
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://loadforecast-api.onrender.com/docs" // Link to your Swagger/FastAPI docs if available
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Try Forecast API
                  <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 group-hover:bg-purple-500/40 transition-all">
                    LIVE
                  </span>
                </a>
              </li>
              <li>
                <Link className="text-sm text-slate-300 hover:text-emerald-400 transition-colors" to="/dashboard">
                  Main Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Project Info */}
          <div className="p-6 w-1/2 md:w-1/4">
            <h3 className="mb-6 text-[10px] font-bold uppercase text-emerald-400 tracking-[0.2em]">
              NIT Andhra Pradesh
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time monitoring and future load forecasting using Modbus-ESP32 integration.
            </p>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] text-slate-500">
              © 2026 Energy Monitoring System — NITANP
            </p>
            <div className="flex gap-6">
               <a 
                 href="https://github.com/chaitanya-mutyala/energy-meter-realtime-visualization" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-[11px] text-slate-600 hover:text-slate-400"
               >
                 GitHub Source
               </a>
               <Link to="/documentation" className="text-[11px] text-slate-600 hover:text-slate-400">Documentation</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;