import React from 'react';
import { RefreshCw, Thermometer, Droplet, Zap } from 'lucide-react';

// --- CONFIGURATION ---
// These are your specific, correct credentials.
const CHANNEL_ID = 3098210; 
const READ_API_KEY = '2BRCLMHR0T4LW8X0'; 


// --- UI COMPONENTS ---

// Card for displaying a single metric (kept as a functional component for simplicity)
const MetricCard = ({ icon, label, value, unit, color }) => (
    <div className={`flex items-center p-6 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl ${color}`}>
        <div className="p-3 rounded-full bg-opacity-30 mr-4" style={{ backgroundColor: color }}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-800">
                {value ?? '--'}
                <span className="text-base font-normal ml-1">{unit}</span>
            </p>
        </div>
    </div>
);


// --- MAIN CLASS COMPONENT ---
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: { temperature: null, humidity: null, timestamp: null },
            isLoading: false,
            error: null,
        };
        this.intervalId = null; 
    }

    // Runs immediately after the component is mounted
    componentDidMount() {
        this.fetchData();
        // Set up automatic refresh every 30 seconds
        this.intervalId = setInterval(this.fetchData, 30000); 
    }

    // Runs right before the component is unmounted
    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    fetchData = async () => {
        this.setState({ isLoading: true, error: null });
        
        // FIX: Construct the URL inside the function to ensure constants are read correctly.
        // The API Key is mandatory for your private channel.
        const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`;
        
        const maxRetries = 5;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch(url); // Use the locally constructed URL
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}. Check your Channel ID and Read API Key.`);
                }
                const json = await response.json();
                
                // ThingSpeak returns an empty JSON object {} if there is no data in the channel yet.
                // We check if field1 and field2 exist AND are not null/undefined.
                if (json.field1 !== undefined && json.field1 !== null && 
                    json.field2 !== undefined && json.field2 !== null) {
                    
                    this.setState({
                        data: {
                            temperature: parseFloat(json.field1).toFixed(1),
                            humidity: parseFloat(json.field2).toFixed(1),
                            timestamp: new Date(json.created_at).toLocaleString(),
                        },
                        isLoading: false,
                    });
                    return; // Success, exit loop
                } else {
                    // This handles cases where data structure is present but field values are null 
                    // (e.g., if the ESP8266 sent a field with no value).
                    throw new Error("Data fields are empty or invalid. Ensure your ESP8266 is sending data to Field 1 and Field 2.");
                }

            } catch (err) {
                console.error(`Attempt ${attempt + 1} failed:`, err.message);
                if (attempt === maxRetries - 1) {
                    this.setState({
                        error: `Failed to fetch data after ${maxRetries} attempts. Last error: ${err.message}`,
                        isLoading: false,
                    });
                }
                // Wait for an exponentially increasing delay (e.g., 1s, 2s, 4s...)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    };

    render() {
        const { data, isLoading, error } = this.state;
        const isChannelConfigured = CHANNEL_ID && READ_API_KEY;

        return (
            <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
                <header className="max-w-4xl mx-auto mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight flex items-center">
                        <Zap className="w-8 h-8 mr-3 text-indigo-600" />
                        IoT Weather Monitor
                    </h1>
                    <p className="text-gray-500 mt-2">Live data fetched from ThingSpeak Channel: **{CHANNEL_ID}**</p>
                    
                    {!isChannelConfigured && (
                        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <p className="font-bold">Configuration Warning:</p>
                            <p className="text-sm">Please ensure both CHANNEL_ID and READ_API_KEY are correct for your private channel.</p>
                        </div>
                    )}
                </header>

                <main className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-gray-600">
                            Last Updated: 
                            <span className="font-semibold ml-1">
                                {data.timestamp || 'N/A'}
                            </span>
                        </p>
                        <button
                            onClick={this.fetchData}
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            {isLoading ? 'Fetching...' : 'Manual Refresh'}
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
                            <p className="font-bold">Error Fetching Data</p>
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* Temperature Card */}
                        <MetricCard 
                            icon={<Thermometer className="w-6 h-6 text-red-600" />}
                            label="Temperature"
                            value={data.temperature}
                            unit="°C"
                            color="rgba(239, 68, 68, 0.2)"
                        />

                        {/* Humidity Card */}
                        <MetricCard 
                            icon={<Droplet className="w-6 h-6 text-blue-600" />}
                            label="Humidity"
                            value={data.humidity}
                            unit="%RH"
                            color="rgba(59, 130, 246, 0.2)"
                        />
                    </div>
                    
                    {/* Developer Notes / Footer */}
                    <footer className="mt-10 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
                        <p>
                            Data feeds from ESP8266 and DHT11 via ThingSpeak API. 
                            Auto-refresh interval: 30 seconds.
                        </p>
                    </footer>
                </main>
            </div>
        );
    }
}

export default Dashboard;
