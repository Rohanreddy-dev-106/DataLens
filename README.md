# 🔍 DataLens

**DataLens** is a full-stack AI-powered data analytics platform. Upload any CSV dataset and get instant statistical summaries, interactive visualizations, and deep predictive analysis driven by a **LangChain agentic AI pipeline** — all within a secure, authenticated workspace.

---

## ✨ Features

- 🔐 **Authentication** — Register, login & logout with JWT-based cookie authentication
- 📁 **CSV Upload** — Upload any CSV file directly from the browser
- 📊 **Automated EDA** — Instant Exploratory Data Analysis powered by a Python microservice
  - Numeric column statistics (mean, median, std, min, max)
  - Categorical column summaries (unique values, most frequent)
  - Datetime column ranges
  - Missing value detection & automatic filtering (>60% threshold)
- 📈 **Interactive Dashboard** — Visualize results with Recharts (bar charts, distribution graphs, donut overlays, custom tooltips)
- 🧠 **Deep Predictive Analytics** — Agentic AI pipeline powered by **LangChain**:
  - Autonomous model selection (Time-Series Regression or Continuous Feature Regression)
  - Historical vs. AI Forecast area chart with predictive horizon
  - LLM token ingestion metrics & execution latency tracking
  - Anomaly rate calculation & R² composite accuracy scoring
  - Real-time LangChain agent execution trace log
- 🛡️ **Protected Routes** — Analytics workspace is accessible only to authenticated users

---

## 🏗️ Architecture

```
DataLens/
├── frontend/       # React + Vite + TailwindCSS    (port 5173)
├── backend/        # Node.js + Express + MongoDB    (port 8080)
└── analysis/       # Python Flask microservices     (port 5000)
                    #  ├── /analysis  → Pandas EDA
                    #  └── /api/analytics/deep-analyze → LangChain Agent
```

### Data Flow

```
User Browser (React)
       │
       ├──(1) CSV Upload ──────▶  Node.js Backend (Express/8080)
       │                                  │
       │                                  ├──(2) Forward file ──▶  Flask /analysis
       │                                  │                         (Pandas EDA)
       │                                  │◀── EDA JSON Result ─────┘
       │◀── Visualized Dashboard ─────────┘
       │
       └──(3) Deep Analyze ────▶  Flask /api/analytics/deep-analyze
                                          │
                                          └──▶  LangChain Agent Pipeline
                                                 ├── Autonomous model selector
                                                 ├── Time-Series / Regression agent
                                                 ├── Anomaly detector
                                                 └── Predictive forecaster
                                  ◀── Metrics + Timeline + Trace Logs ──┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TailwindCSS 4, Recharts, React Router v6, Axios, shadcn/ui, Lucide |
| **Backend** | Node.js, Express 5, Mongoose, JWT, bcrypt, Multer, cookie-parser, dotenv |
| **EDA Service** | Python 3.14+, Flask, Pandas, NumPy, Matplotlib |
| **AI / Agentic** | LangChain, Python (AST-based agent execution, multi-model pipeline) |
| **Database** | MongoDB (via Mongoose) |

---

## 📦 Project Structure

```
DataLens/
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── LandingPage.jsx         # Public home / marketing page
│       │   ├── AnalyticsPage.jsx       # Main EDA dashboard with charts
│       │   └── DeepAnalyticPage.jsx    # LangChain agentic analytics view
│       ├── components/
│       │   ├── LoginForm.jsx
│       │   ├── RegisterForm.jsx
│       │   ├── NavBar.jsx
│       │   └── Footer.jsx
│       └── App.jsx                     # Route definitions & auth guard
│
├── backend/
│   ├── index.js                        # Express app setup, middleware config
│   ├── server.js                       # Entry point, MongoDB connection
│   ├── middlewares/
│   │   ├── Auth.js                     # JWT verification middleware
│   │   └── multer.js                   # File upload middleware
│   └── src/
│       ├── config/
│       │   └── mongodb.connection.js
│       ├── models/
│       │   └── user.model.js
│       ├── repo/
│       │   └── user.repo.js
│       ├── controllers/
│       │   └── user.controller.js
│       ├── routers/
│       │   └── user.routs.js
│       └── utils/
│           ├── api.responce.js
│           └── api.error.js
│
└── analysis/
    ├── main.py                         # Flask API entry point (EDA + LangChain routes)
    ├── analysis.py                     # Core Pandas EDA logic
    ├── deepanalysis.py                 # LangChain agentic pipeline logic
    ├── pyproject.toml
    └── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.14+
- **MongoDB** (local or Atlas)
- **uv** (Python package manager) or **pip**

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/DataLens.git
cd DataLens
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
ACCESSTOKEN_KEY=your_jwt_secret_key
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

---

### 3. Python Analysis + AI Service Setup

```bash
cd analysis
```

**Using `uv` (recommended):**
```bash
uv sync
uv run python main.py
```

**Using pip:**
```bash
pip install flask pandas numpy matplotlib langchain
python main.py
```

The Flask service starts on **http://127.0.0.1:5000** and exposes:
- `GET  /` — Health check
- `POST /analysis` — Pandas EDA endpoint
- `POST /api/analytics/deep-analyze` — LangChain agentic pipeline endpoint

---

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## 📡 API Reference

### Node.js Backend — `localhost:8080`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|---|
| `POST` | `/api/user/register` | ❌ | Register a new user |
| `POST` | `/api/user/login` | ❌ | Login and receive JWT cookie |
| `POST` | `/api/user/logout` | ✅ | Clear JWT cookie |
| `GET`  | `/api/user/profile` | ✅ | Get authenticated user's profile |
| `POST` | `/api/user/analysis` | ✅ | Upload CSV → proxies to Flask EDA |

### Python Flask Service — `localhost:5000`

| Method | Endpoint | Description |
|--------|----------|---|
| `GET`  | `/` | Health check |
| `POST` | `/analysis` | Pandas EDA — accepts `multipart/form-data` CSV |
| `POST` | `/api/analytics/deep-analyze` | LangChain agentic deep analysis |

---

## 🧠 LangChain Agentic Pipeline

The **Deep Predictive Analytics** view (`/analytics/deep`) uses a LangChain multi-agent pipeline running inside the Flask service.

### How It Works

1. **Trigger** — The React frontend calls `POST /api/analytics/deep-analyze` on mount
2. **Model Selection** — The agent autonomously selects the best model:
   - `Time-Series Regression Model` — when temporal patterns are detected in logs
   - `Continuous Feature Target Regression` — for general numeric feature analysis
3. **Agent Execution** — LangChain runs a sequence of tool/agent steps (logged as trace steps)
4. **Forecast Generation** — Produces a timeline of historical actuals + predicted future values
5. **Metrics Output** — Returns tokens processed, latency, anomaly rate, and R² accuracy

### Deep Analysis Response Format

```json
{
  "success": true,
  "data": {
    "metrics": {
      "tokens_processed": 4821,
      "latency_ms": 312,
      "anomaly_rate": 2.4,
      "global_accuracy": 91.7
    },
    "timeline_data": [
      { "label": "2024-Q1", "value": 142.3, "prediction": null },
      { "label": "2024-Q2", "value": 158.7, "prediction": null },
      { "label": "2024-Q3", "value": null,  "prediction": 171.2 }
    ],
    "logs": [
      {
        "step_id": "STEP-001",
        "context": "Time-series feature extraction via LangChain memory thread",
        "metric": "R²=0.917"
      }
    ]
  }
}
```

### Agentic Confidence Allocation

| Agent / Tool Layer | Confidence |
|---|---|
| Time-Series Agent Execution | 94% |
| Scikit-Learn Regression Ensemble | 87% |
| NumPy Statistical Bounds | 81% |

> **Engine Insight:** LangChain reads dataframe dimensions natively, avoiding token overflow limits while evaluating algorithmic models dynamically via Python AST compilers.

---

## 🧪 EDA Output Format

```json
{
  "numeric_summary": {
    "column_name": { "count": 1000, "mean": 45.2, "median": 44.0, "std": 12.5, "min": 10.0, "max": 99.0 }
  },
  "categorical_summary": {
    "column_name": { "count": 980, "unique": 5, "freq": 320, "most_frequent": "Category A" }
  },
  "datetime_summary": {
    "column_name": { "count": 1000, "start": "2020-01-01", "end": "2023-12-31" }
  },
  "missing_summary": {
    "column_name": { "missing_count": 20, "missing_percent": 2.0 }
  },
  "filtered_map": { "numeric": ["col1", "col2"], "categorical": ["col3"] },
  "data": [{ "col1": 1, "col2": 2.5, "col3": "A" }]
}
```

> **Note:** Columns with **more than 60% missing values** are automatically excluded from the analysis before any stats are computed.

---

## 🔐 Authentication Flow

1. User registers or logs in via the React form
2. Backend validates credentials, signs a **JWT** (1-day expiry), and sets it as an **httpOnly cookie**
3. All subsequent requests include the cookie automatically (`withCredentials: true` in Axios)
4. The `jwtAuth` middleware on protected routes verifies the token on every request
5. On logout, the cookie is cleared server-side

---

## 🌐 App Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Guest only | Login form (redirects to `/analytics` if logged in) |
| `/register` | Guest only | Registration form (`/signup` also redirects here) |
| `/analytics` | 🔒 Auth required | Main EDA analytics dashboard |
| `/analytics/deep` | 🔒 Auth required | LangChain deep predictive analytics view |

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 🙏 Acknowledgements

- [LangChain](https://www.langchain.com/) — Framework for building agentic AI pipelines
- [Recharts](https://recharts.org/) — Composable charting library for React
- [shadcn/ui](https://ui.shadcn.com/) — Re-usable UI components built on Radix UI
- [Pandas](https://pandas.pydata.org/) — Data analysis and manipulation library
- [Flask](https://flask.palletsprojects.com/) — Lightweight Python web framework
