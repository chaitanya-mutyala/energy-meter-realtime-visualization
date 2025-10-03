import React from 'react'
// FIX: Adjusted Container path assuming it's one level up from 'pages'
import Container from '../components/container/Container.jsx'
// FIX: Adjusted asset paths assuming the images are stored in a root 'assets' folder
import HeroBanner from '../assets/Banner4.webp'
import MeterDashboard from '../assets/3.webp'
import MobileMonitoring from '../assets/1.webp'
// Import icons (assuming you have Lucide or equivalent setup, or we use inline SVGs)
import { Zap, Activity, BarChart, Code } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'


function Home() {
    const navigate = useNavigate();
  
  // Feature Data for easy rendering
  const features = [
    {
      icon: <Zap className="text-blue-500 w-8 h-8"/>,
      title: "Real-Time Visualization",
      description: "Instantly see current energy flow, voltage, and consumption patterns across the campus. Reduce blind spots in usage data.",
    },
    {
      icon: <Activity className="text-yellow-500 w-8 h-8"/>,
      title: "Anomaly Detection",
      description: "Identify sudden spikes or drops in consumption that indicate faults, leakage, or unauthorized use, minimizing unexpected costs.",
    },
    {
      icon: <BarChart className="text-green-500 w-8 h-8"/>,
      title: "Predictive Analytics",
      description: "Leverage historical data to forecast future energy needs and identify opportunities for optimization and load shifting.",
    },
  ];

  return (
    <div className='w-full'>
      
      {/* === 1. Hero Section (Banner4.webp) === */}
<div className="relative w-full h-[50vh] overflow-hidden bg-gray-900 flex items-center justify-center">
  {/* Primary background image, set to fill container and slightly transparent */}
  <img
    src={HeroBanner}
    alt="Digital Energy Meters"
    className="w-full h-full object-cover opacity-30"
    // Added onError handler for resilience (already present in the last full file)
    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x600/2A364F/ffffff?text=HERO+BANNER+FAILED+TO+LOAD" }}
  />

  {/* Removed the unnecessary <div> with the duplicate <img src={HeroBanner} className='h-100'></img> */}

  {/* Content overlay, positioned absolutely over the image */}
  <div className="absolute inset-0 flex items-center justify-center text-center p-6 bg-opacity-30">
    <div className="max-w-4xl">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
        Smart Energy for a Smarter Campus
      </h1>
      <p className="text-xl text-gray-200 font-light drop-shadow-md">
        Real-time monitoring and predictive analytics to optimize energy consumption at NITAP.
      </p>
      <button
        className='mt-8 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition duration-300 shadow-xl'
        // FIX: The onClick now calls the navigate function correctly
        onClick={() => navigate('/dashboard')}
      >
        View Live Dashboard
      </button>
    </div>
  </div>
</div>
      <Container>
        
        {/* === 2. Why Our Project (Problem & Solution) === */}
        <section className="py-16 text-center">
          <h2 className="text-4xl font-bold text-[#2A364F] mb-4">
            Driving Efficiency, Reducing Waste
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg mb-12">
            In modern buildings, energy is the largest controllable operational cost. Our platform transforms raw meter data into actionable intelligence, ensuring responsible resource management.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transform hover:scale-[1.02] transition duration-300">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <hr className="my-10 border-gray-200" />

        {/* === 3. Use Case & Visualization (Image 3.jpg) === */}
         
        <section className="py-16">
          <div className="flex flex-wrap lg:flex-nowrap items-center bg-gray-50 rounded-xl overflow-hidden shadow-2xl">
            
            <div className="w-full lg:w-1/2 p-8 md:p-12 order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Deep Dive into Consumption Data
              </h2>
              <p className="text-gray-600 mb-6">
                Our dashboard provides high-resolution data visualization across various campus zones, allowing engineers and administrators to pinpoint exactly when and where energy spikes occur. Customizable charts, historical comparison tools, and metric summaries are available at your fingertips.
              </p>
              <ul className="space-y-2 text-gray-700">
                  <li className='flex items-center'><Activity className="w-5 h-5 text-green-500 mr-2"/> Real-time kW & kVA monitoring</li>
                  <li className='flex items-center'><BarChart className="w-5 h-5 text-green-500 mr-2"/> Load profile analysis</li>
                  <li className='flex items-center'><Zap className="w-5 h-5 text-green-500 mr-2"/> Power factor correction insights</li>
              </ul>
            </div>
            
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <img 
                src={MeterDashboard} 
                alt="Detailed Real-Time Dashboard" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/2A364F/ffffff?text=Visualization+Image" }}
              />
            </div>

          </div>
        </section>
        
        <hr className="my-10 border-gray-200" />

        {/* === 4. How It Works (Image 1.jpg) === */}
        <section className="py-16">
          <div className="flex flex-wrap lg:flex-nowrap items-center">
            
            <div className="w-full lg:w-1/2">
              <img 
                src={MobileMonitoring} 
                alt="Monitoring on a Mobile Device" 
                className="w-full h-full object-cover rounded-xl shadow-2xl" 
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/2A364F/ffffff?text=Mobile+Monitoring" }}
              />
            </div>

            <div className="w-full lg:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Seamless, Secure, and Scalable
              </h2>
              <p className="text-gray-600 mb-6">
                The architecture is designed for simplicity and reliability, ensuring data integrity from the meter to your screen.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-xl text-blue-600 mb-1">Data Ingestion</h4>
                  <p className="text-gray-600 text-sm">IoT gateways transmit secure meter readings (Modbus/MQTT) to our cloud backend in milliseconds.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-blue-600 mb-1">Processing & Storage</h4>
                  <p className="text-gray-600 text-sm">Appwrite handles secure authentication and persistence, while Redux Toolkit manages fast, centralized state on the client.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-xl text-blue-600 mb-1">User Interface</h4>
                  <p className="text-gray-600 text-sm">Built with React and Tailwind, offering a fast, responsive, and intuitive experience across desktop and mobile devices.</p>
                </div>
              </div>
            </div>

          </div>
        </section>
        
      </Container>
      
    </div>
  )
}

export default Home
