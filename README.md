# ⚡ Smart Campus Energy Monitoring & Load Forecasting
### Real-Time IoT Energy Meter Dashboard + Appwrite Auth + Random Forest Load Prediction

This project is a complete **IoT → Cloud → ML → Web** pipeline developed for **real-time campus energy monitoring** and **short-term load forecasting** at **NIT Andhra Pradesh**.  
The system collects live electrical parameters from industrial smart meters via **ESP32**, processes predictive analytics using a **FastAPI + Random Forest** model on **Render**, and visualizes the results on a **React dashboard**.

---

## 🚀 Live Demo & Repository

| Aspect | Link |
|--------|------|
| 🔗 **Live Dashboard** | [https://energy-meter-realtime-visualization.vercel.app/](https://energy-meter-realtime-visualization.vercel.app/) |
| 📂 **GitHub Repository** | [https://github.com/chaitanya-mutyala/energy-meter-realtime-visualization](https://github.com/chaitanya-mutyala/energy-meter-realtime-visualization) |
| 👤 **Developer** | *Chaitanya Mutyala* |

---

# 📘 Project Overview

The project delivers a **smart campus energy monitoring system** integrating:

- **Hardware**: Industrial Modbus meters + RS485 Transceivers + ESP32.
- **Data Layer**: **Firebase Realtime Database** for live telemetry storage.
- **Intelligence**: **FastAPI** backend hosted on **Render** running a **Random Forest** regression model.
- **Automation**: Daily **Cloud Functions** trigger the ML pipeline to predict the next 24 hours of load.
- **Frontend**: **React (Vite)** dashboard with **Appwrite** secure authentication.

---

# 🔌 IoT Hardware Architecture & Data Pipeline

### 1️⃣ Smart Energy Meter (Industrial-Grade)
Measures: Voltage, Current, Active Power (kW), Power Factor, Energy (kWh), Reactive Power (kVAR), Apparent Power (kVA), and Frequency.

### 2️⃣ ESP32 – Unified Modbus Master & Cloud Gateway
- **Modbus RTU**: Polls registers every 60 seconds via MAX3485 TTL-to-RS485 transceiver.
- **WiFi Gateway**: Pushes validated JSON payloads to Firebase with <2s end-to-end latency.

### 3️⃣ Cloud Intelligence & ML Pipeline
- **FastAPI (Hosted on Render)**: A high-performance Python API that serves as the compute engine for forecasting.
- **Machine Learning**: A **Random Forest Regressor** trained on historical campus data to handle non-linear load patterns.
- **Workflow**: A scheduled **Cloud Function** pings the FastAPI endpoint once every 24 hours. The model generates 96 data points (15-min intervals) for the next day and syncs them to Firebase.

---

# 🔐 Appwrite Authentication

The platform supports secure user management via **Appwrite Integration**.
- **Features**: User Signup, Email/Password Login, and JWT-based session persistence.
- **Security**: Protected routes ensure the dashboard is only accessible to authenticated users.

---

# 📊 Machine Learning Forecasting

The system provides a visual "AI Forecast" to assist in peak demand management.

### 🔮 Algorithms
- **Random Forest Regressor** (Current Primary Model)
- **Linear Regression** (Baseline)
- **LSTM Neural Networks** (Future Integration)

### 📈 Operational Logic
The model accounts for time-of-day, day-of-week, and historical peaks to project the load curve. This allows facility managers to anticipate high-load periods before they occur.



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
```

### 4️⃣ Run Project Locally
```
npm run dev
```

---

# 🚀 Future Enhancements

 
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
