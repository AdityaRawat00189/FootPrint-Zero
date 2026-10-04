# FootprintZero — Autonomous Privacy & Personal Data Erasure Platform

> An autonomous MERN + Python-agent web application that scans digital footprints for exposed personal data (security breaches & commercial data brokers), autonomously synthesizes enforceable GDPR/CCPA erasure and opt-out demand notices via a LangGraph multi-agent pipeline, enforces human-in-the-loop authorization, and tracks statutory 45-day response deadlines.

Built as a capstone / hackathon MVP.

---

## 🏛 System Architecture & Pipeline Workflow

FootprintZero coordinates five specialized autonomous agents structured as a LangGraph `StateGraph` state machine with state checkpoints and a human-in-the-loop pause:

```
                  ┌──────────────────────────────┐
                  │    01. DISCOVERY AGENT       │
                  │  (HIBP + CA Broker Registry) │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │   02. RISK RANKING AGENT     │
                  │ (Composite Sensitivity Matrix)│
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │   03. LEGAL DRAFTING AGENT   │
                  │ (ChromaDB GDPR/CCPA RAG Store│
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                 ┌────────────────────────────────┐
                 │ ⏸ HUMAN APPROVAL GATE (PAUSE)  │
                 │ (User Review, Edit, Diff View) │
                 └───────┬────────────────┬───────┘
                         │                │
            [Approved]   │                │ [Revision Requested]
                         ▼                └────────┐
                  ┌──────────────┐                 │
                  │ 04. EXECUTOR │                 │ (Loops back with
                  │    AGENT     │                 │  user feedback)
                  │(SMTP Relay & │                 │
                  │ 45-day Clock)│                 ▼
                  └──────┬───────┘    ┌─────────────────────────┐
                         │            │ Back to Legal Drafting  │
                         ▼            └─────────────────────────┘
                  ┌──────────────┐
                  │ 05. FOLLOW-UP│
                  │    AGENT     │
                  │ (node-cron   │
                  │ Escalation)  │
                  └──────────────┘
```

---

## 🧩 Services Breakdown

- **`client/`**: React 18 + Vite, TailwindCSS (dark fintech tokens), Framer Motion animations, Lucide icons, Axios API client.
- **`server/`**: Node.js & Express REST API, Mongoose ODM (MongoDB Atlas), JWT auth, `node-cron` statutory scheduler, Nodemailer SMTP relay.
- **`agent-service/`**: Python 3.10+ FastAPI microservice, LangGraph `StateGraph` multi-agent pipeline, ChromaDB vector store for GDPR/CCPA statutory citations, HIBP scanner tool.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ and pip
- MongoDB Atlas cluster or local MongoDB instance

---

### 1. Backend Server Setup (`server/`)

```bash
cd server
npm install
npm run seed     # Seeds 15 verified data brokers from California OAG Registry
npm run dev      # Runs Express REST API on http://localhost:5000
```

Configure `server/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
AGENT_SERVICE_URL=http://localhost:8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

### 2. Python Agent Service Setup (`agent-service/`)

```bash
cd agent-service
pip install -r requirements.txt
python main.py   # Runs FastAPI Agent runner on http://localhost:8000
```

Configure `agent-service/.env`:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key   # Optional / built-in fallback supported
HIBP_API_KEY=your_hibp_api_key       # Optional / built-in benchmark dataset supported
```

---

### 3. Frontend Client Setup (`client/`)

```bash
cd client
npm install
npm run dev      # Runs Vite dev server on http://localhost:5173
```

---

## ⚖️ Scope & Feature Calibration

### MVP Features (Implemented & Active)
- ✅ Autonomous Discovery Agent querying HIBP breach databases and California Data Broker Registry.
- ✅ Dynamic Risk Ranking Agent assigning 0-100 privacy vulnerability scores based on SSN, phone, address, and financial vectors.
- ✅ RAG Legal Drafting Agent embedding CCPA § 1798.105 / GDPR Art. 17 clauses via ChromaDB.
- ✅ Human-in-the-loop Approval Queue (`/approvals`) with side-by-side diff previews, manual editing, and feedback revision loop.
- ✅ Animated Agent Pipeline Progress Trail on Case Tracker (`/cases/:id`) with sequential node illumination.
- ✅ Scheduled Follow-up Agent (`node-cron`) auditing statutory response windows and drafting administrative regulatory escalations.

### Future Scope (Post-Hackathon)
- Multi-state comprehensive legislative sync (Texas TDPSA, Virginia VCDPA, Colorado CPA live updates).
- Direct IMAP inbox parser for autonomous ingestion of broker confirmation receipts.
- Cryptographically verifiable zero-knowledge identity validation tokens.
