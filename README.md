# ⚡ Smart Campus Energy Monitoring & Load Forecasting
### Real-Time IoT Energy Meter Dashboard + Appwrite Authentication + ML-Based Load Prediction (Ongoing Project)

This project is a complete **IoT → Cloud → Web → ML** pipeline developed for **real-time campus energy monitoring** and **short-term load forecasting** at **NIT Andhra Pradesh**.  
The system collects live electrical parameters from industrial smart meters, sends them to the cloud through an IoT pipeline, and visualizes them on a fully responsive **React dashboard** with **Appwrite-based authentication**.  
Machine learning forecasting modules are currently under development.

---

## 🚀 Live Demo & Repository

| Aspect | Link |
|--------|------|
| 🔗 **Live Dashboard** | https://energy-meter-realtime-visualization.vercel.app/ |
| 📂 **GitHub Repository** | https://github.com/chaitanya-mutyala/energy-meter-realtime-visualization |
| 👤 **Developer** | *Chaitanya Mutyala* |

---

# 📘 Project Overview

The project delivers a **smart campus energy monitoring system** integrating:

- Real-time data acquisition from **industrial Modbus smart meters**
- RS485-based energy data collection using **Arduino (Modbus Master)**
- **ESP8266 cloud gateway** for wireless uplink
- **ThingSpeak / Custom API** as temporary cloud backend
- **React dashboard** for live visualization
- **Appwrite authentication** for secure user login
- **Machine learning forecasting** models (LR, RF, LSTM) under development

This system supports actionable decision-making for load management, peak demand control, and energy optimization.

---

# 🔌 IoT Hardware Architecture & Data Pipeline

### 1️⃣ Smart Energy Meter (Industrial-Grade)
Measures:
- Voltage (V)  
- Current (A)  
- Active Power (kW)  
- Power Factor (PF)  
- Energy (kWh)
- Reactive power (KWAR)
- Apparent power (KWA)
- Frequency (f)

### 2️⃣ RS485 → TTL Conversion (MAX485 Module)
- Handles differential A/B signals  
- Ensures noise immunity  
- Validated with **99.8% PDR (Packet Delivery Ratio)**  

### 3️⃣ Arduino – Modbus RTU Master
- Reads meter registers  
- Controls DE/RE lines  
- Ensures data integrity  
- Validates payload before sending to ESP8266  

### 4️⃣ ESP32– WiFi Cloud Gateway
- Receives validated Modbus output via UART  
- Handles WiFi connection  
- Pushes data to ThingSpeak/custom API  
- Maintains <2 second end-to-end latency  

### 5️⃣ Cloud Backend
- Temporary: **ThingSpeak**  
- Future: **Custom Node.js / Python backend**  
- Provides API for dashboard fetch requests  

### 6️⃣ Frontend Dashboard
- Pulls live data  
- Visualizes values via charts, KPIs, tables  

---

# 🔐 Appwrite Authentication (Integrated)

The platform supports secure login and user management using **Appwrite**.

### Supported Features
- User Signup  
- Login with email/password  
- JWT token-based authentication  
- Protected routes (dashboard only visible after login)  
- Future scope: admin panel, role-based access  



# 🎛️ React Dashboard Overview

The dashboard is built using **React + Vite**, providing:

### ✨ Dashboard Features
- 📊 **Live charts** for Voltage, Current, Power  
- 🔥 **Real-time updates** (auto refresh)  
- 🧮 **KPI metric cards**    
- 🔐 **Appwrite secure login UI**  
- 📱 Fully responsive UI (mobile + desktop)

### 🛠 Frontend Tech Stack
- React (Vite)
- Tailwind CSS
- Recharts (charts & graphs)
- Appwrite Auth SDK
- Axios (API client)
- Vercel (deployment)

---

# 📊 Machine Learning Forecasting (Ongoing)

Using historical data, the following models are being trained:

### 🔮 Algorithms:
- **Linear Regression**
- **Random Forest Regressor**
- **LSTM Neural Networks**

### 📈 Forecasting Types:
- 15 min ahead  
- 1 hour ahead  
- Day-ahead  
- Week-ahead  

### 🎯 Evaluation Metrics:
- MAE  
- MAPE  
- RMSE  

Forecast output will soon be integrated into the dashboard as predictive charts.

---

# 🏗 Project Structure

```
energy-meter-realtime-visualization/
│── public/
│── src/
│   ├── components/
│   ├── pages/
│   ├── charts/
│   ├── auth/              # Appwrite authentication logic
│   ├── services/
│   │    └── api.js        # API request handlers
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│── package.json
│── README.md
```

---

# 🛠 Installation & Setup

### 1️⃣ Clone Repository
```
git clone https://github.com/chaitanya-mutyala/energy-meter-realtime-visualization
cd energy-meter-realtime-visualization
```

### 2️⃣ Install Dependencies
```
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in project root:

```
VITE_APPWRITE_URL=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_COLLECTION_ID=
VITE_API_URL=
```

### 4️⃣ Run Project Locally
```
npm run dev
```

---

# 🚀 Future Enhancements

- Integration of ML forecast charts in dashboard  
- Custom backend replacing ThingSpeak  
- Multiple building comparison analytics  
- Alerts for high load / anomalies  
- Manual & automatic report generator (PDF + CSV)  
- Admin panel with role-based permissions  
- Energy-saving recommendations using AI  

---

# 🤝 Contribution

Contributions are welcome!  
Feel free to create issues or submit PRs.

---

# 📜 License
MIT License
