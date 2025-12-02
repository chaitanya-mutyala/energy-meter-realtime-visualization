import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    const azureColor = { color: '#007FFF' }; 
    const ivoryTextColor = 'text-gray-200';

    return (
        <section 
            className="relative overflow-hidden pt-10 pb-6 border border-t-2 border-t-black"
            style={{ backgroundColor: '#2A364F' }}
        >
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                <div className="-m-6 flex flex-wrap lg:justify-center">

                    {/* 1. Tech Stack Column */}
                    <div className="w-full p-6 md:w-1/2 lg:w-3/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-6 text-xs font-semibold uppercase" style={azureColor}>
                                Tech Stack
                            </h3>
                            <ul>
                                <li className="mb-3">
                                    <p className={`text-base font-medium ${ivoryTextColor}`}>
                                        React, Vite & Tailwind CSS
                                    </p>
                                </li>
                                <li className="mb-3">
                                    <p className={`text-base font-medium ${ivoryTextColor}`}>
                                        Redux Toolkit (RTK)
                                    </p>
                                </li>
                                <li>
                                    <p className={`text-base font-medium ${ivoryTextColor}`}>
                                        Appwrite Backend Service
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 2. Project Resources Column */}
                    <div className="w-full p-6 md:w-1/2 lg:w-3/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-6 text-xs font-semibold uppercase" style={azureColor}>
                                Resources
                            </h3>
                            <ul>
                                <li className="mb-3">
                                    <Link
                                        className={`text-base font-medium ${ivoryTextColor} hover:text-white transition-colors duration-200`}
                                        to="/dashboard"
                                    >
                                        Live Visualization Dashboard
                                    </Link>
                                </li>

                                {/* UPDATED GITHUB LINK */}
                                <li className="mb-3">
                                    <a
                                        className={`text-base font-medium ${ivoryTextColor} hover:text-white transition-colors duration-200`}
                                        href="https://github.com/chaitanya-mutyala/energy-meter-realtime-visualization"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Project Repository (GitHub)
                                    </a>
                                </li>

                                <li>
                                    <Link
                                        className={`text-base font-medium ${ivoryTextColor} hover:text-white transition-colors duration-200`}
                                        to="/documentation"
                                    >
                                        API Endpoints & Status
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. Contact & Legal Column */}
                    <div className="w-full p-6 md:w-1/2 lg:w-3/12">
                        <div className="h-full">
                            <h3 className="tracking-px mb-6 text-xs font-semibold uppercase" style={azureColor}>
                                Contact & Legal
                            </h3>
                            <ul>
                                <li className="mb-3">
                                    <p className={`text-base font-medium ${ivoryTextColor}`}>
                                        Energy Meter Support Team
                                    </p>
                                </li>
                                <li className="mb-3">
                                    <Link
                                        className={`text-base font-medium ${ivoryTextColor} hover:text-white transition-colors duration-200`}
                                        to="/about"
                                    >
                                        About the Project
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`text-base font-medium ${ivoryTextColor} hover:text-white transition-colors duration-200`}
                                        to="/terms"
                                    >
                                        Data Privacy & Terms
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className={`text-sm text-center text-gray-400 ${ivoryTextColor}`}>
                        &copy; 2025 Energy Monitoring and Load Prediction System – NIT Andhra Pradesh
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Footer
