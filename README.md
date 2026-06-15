# ⚡ Smart Campus Energy Monitoring & Load Forecasting

A real-time IoT-based Smart Campus Energy Monitoring System developed at NIT Andhra Pradesh for monitoring and forecasting electrical energy consumption across campus buildings.
![Dashboard](./assets/dashboard.png)
The system collects live electrical parameters from industrial smart energy meters installed at the **SRK Academic Complex** and **APJ Abdul Kalam Laboratory Complex**, stores the data in Firebase Realtime Database, performs machine learning-based load forecasting using a FastAPI service deployed on Render, and visualizes real-time and predicted energy trends through a React dashboard.

---

## 🚀 Live Demo & Repository

| Resource | Link |
|-----------|------|
| 🌐 Live Dashboard | https://energy-meter-realtime-visualization.vercel.app/ |
| 📂 GitHub Repository | https://github.com/chaitanya-mutyala/energy-meter-realtime-visualization |

---

## 📖 Project Overview

The project was developed as a real-world smart campus energy management solution for NIT Andhra Pradesh.

The system continuously monitors energy consumption from:

- 🏢 SRK Academic Complex
- 🏢 APJ Abdul Kalam Laboratory Complex

using industrial-grade Modbus smart meters and provides:

- Real-time monitoring
- Historical energy analytics
- Building-wise energy comparison
- Daily and monthly consumption tracking
- Machine learning-based load forecasting
- Peak demand visualization

---

## 🏗 System Architecture

### Hardware Layer

- Industrial Smart Energy Meter
- RS485 Communication Interface
- MAX3485 RS485-to-TTL Converter
- ESP32 Microcontroller

### Cloud Layer

- Firebase Realtime Database
- Firebase Authentication
- Firebase Cloud Functions

### Machine Learning Layer

- FastAPI Prediction Service
- Random Forest Regressor
- Render Cloud Deployment

### Frontend Layer

- React
- Vite
- Tailwind CSS
- Recharts

---

## ⚡ Project Flow

```text
Smart Energy Meter
        │
        ▼
RS485 (Modbus RTU)
        │
        ▼
MAX3485 Converter
        │
        ▼
ESP32 Gateway
        │
        ▼
Firebase Realtime Database
        │
        ▼
Cloud Function Trigger
        │
        ▼
FastAPI ML Service (Render)
        │
        ▼
Random Forest Prediction
        │
        ▼
Forecast Data Stored in Firebase
        │
        ▼
React Dashboard Visualization
```

---

## 📊 Parameters Monitored

The system continuously collects and visualizes:

- Voltage (V)
- Current (A)
- Active Power (kW)
- Reactive Power (kVAR)
- Apparent Power (kVA)
- Power Factor
- Frequency (Hz)
- Energy Consumption (kWh)

---

## 📈 Dashboard Features

### Real-Time Monitoring

- Live Active Power Monitoring
- Reactive Power Monitoring
- Apparent Load Monitoring
- Voltage and Current Tracking
- Power Factor Monitoring
- Frequency Monitoring

### Energy Analytics

- Daily Energy Consumption
- Monthly Energy Consumption
- Historical Trends
- Building-wise Comparison
- Peak Load Monitoring

### Load Forecasting

- Day-ahead Load Prediction
- Forecast Visualization
- Predicted Demand Trends
- Future Load Curve Analysis

---

## 🤖 Machine Learning Forecasting

A Random Forest Regression model is used to predict short-term building load demand based on historical consumption data.

### Forecasting Workflow

1. Historical load data is collected from Firebase.
2. Data preprocessing and feature engineering are performed.
3. Random Forest model generates future load predictions.
4. Predictions are served through a FastAPI endpoint.
5. Forecast results are stored back into Firebase.
6. Dashboard displays actual and predicted load curves.

---

## 🔐 Authentication

Firebase Authentication is used for:

- User Registration
- User Login
- Session Management
- Protected Dashboard Access

---

## ☁ Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend API | Render |
| Authentication | Firebase |
| Database | Firebase Realtime Database |
| Machine Learning | FastAPI + Scikit-Learn |
| IoT Gateway | ESP32 |

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Recharts

### Backend

- FastAPI
- Python

### Machine Learning

- Scikit-Learn
- Random Forest Regressor

### Cloud

- Firebase Authentication
- Firebase Realtime Database
- Firebase Cloud Functions
- Render

### Hardware

- ESP32
- MAX3485
- RS485 Modbus Smart Energy Meter

---

## 📂 Project Structure

```text
src/
├── components/
├── charts/
├── pages/
├── firebase/
├── services/
├── App.jsx
└── main.jsx
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/chaitanya-mutyala/energy-meter-realtime-visualization
cd energy-meter-realtime-visualization
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Run Locally

```bash
npm run dev
```

---

## 🔮 Future Enhancements

- Campus-wide monitoring for all buildings
- AI-based anomaly detection
- Energy consumption alerts
- Automated PDF/CSV report generation
- Solar generation integration
- LSTM and XGBoost forecasting models
- Energy optimization recommendations

---

## 👨‍💻 Developer

**Chaitanya Mutyala**

B.Tech, Electrical & Electronics Engineering

National Institute of Technology Andhra Pradesh

---

## 📜 License

MIT License
