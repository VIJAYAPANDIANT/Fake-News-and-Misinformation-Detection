# Fake News Detection Web Interface

This is the modern React web frontend built with Vite and styled using Tailwind CSS. It communicates with the Node.js Express backend to authenticate users and process article predictions.

## Features

- **Landing Page**: Explains detection technology and ML model benefits.
- **Interactive Forms**: Verification checks supporting optional title and news body copy.
- **Result Metrics**: Displays predictions (Fake vs Real) with animated percentage confidence meters.
- **User Log History**: Tracks past prediction results with timestamp ordering.
- **Dark Mode**: Integrated system preferences and persistent toggling.

---

## Installation & Startup

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Dev Server
Start the client server:
```bash
npm run dev
```

The app will be accessible at: http://localhost:5173
*(Make sure the Node.js Express backend is running on port 5000 and FastAPI on port 8000).*
