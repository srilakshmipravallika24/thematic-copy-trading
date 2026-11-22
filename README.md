# 📈 Thematic Social Copy-Trading Network (Regulated RIA Edition)
> **Standardized Stack:** Next.js (Frontend) • Node.js + Express.js (Backend) • MongoDB (Database)  
> **Project Status:** **Production-Ready Functional MVP**

---

## 📌 Executive Summary: What is this Platform About?

A **Thematic Social Copy-Trading Network** is a fintech platform operating at the intersection of **thematic asset management**, **fiduciary investment advisory**, and **social investing networks**. 

Unlike conventional, unregulated copy-trading platforms (common in forex or crypto) where anonymous traders post high-leverage gambles, this platform is specifically designed for a **regulated framework** (governed by the **SEC Investment Advisers Act of 1940** and **FINRA Rule 2210 / 2111**).

### Core Value Proposition:
1. **Registered Investment Advisors (RIAs):** Only verified fiduciary professionals with Central Registration Depository (**CRD**) credentials and public **Form ADV** disclosures can curate model portfolios and publish trade allocations.
2. **Thematic Baskets:** Instead of day-trading individual tickers, RIAs create macro-thematic baskets centered around long-term economic shifts (e.g., *Generative AI Infrastructure & Compute*, *Clean Grid Storage & Decarbonization*, *Semiconductor Supercycle*, *Mission-Critical Cyber Defense*).
3. **Retail Mirroring:** Retail investors can discover top-performing RIAs, review audited track records (CAGR, Sharpe Ratio, Maximum Drawdown), participate in compliance-moderated social discussions, and **automatically mirror proportional trade allocations** directly in their accounts.
4. **Safety & Risk Guards:** Implements proportional fractional order sizing, configurable cash buffers (2%–10% to prevent slippage), automated stop-loss thresholds, and FINRA suitability risk checks.

---

## 🏗️ What Points & Modules Does It Contain to Develop the Software Product?

Building an institutional, regulated social copy-trading platform requires **7 core architectural pillars**:

```
                               ┌────────────────────────────────────────────────────────┐
                               │   Thematic Social Copy-Trading Platform Architecture   │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
          ┌───────────────────────────┬───────────────────┴───────────────┬───────────────────────────┐
          ▼                           ▼                                   ▼                           ▼
┌──────────────────┐        ┌──────────────────┐                ┌──────────────────┐        ┌──────────────────┐
│ 1. Identity &    │        │ 2. Thematic      │                │ 3. Social &      │        │ 4. Mirror        │
│ Compliance       │        │ Baskets Engine   │                │ Discussion Hub   │        │ Calculation      │
├──────────────────┤        ├──────────────────┤                ├──────────────────┤        ├──────────────────┤
│ • Retail KYC/AML │        │ • RIA Model Bskts│                │ • SEC 2210 Feed  │        │ • Cash Buffer    │
│ • RIA CRD Verify │        │ • Weight Rebal   │                │ • Sentiment Tag  │        │ • Proportional $ │
│ • Form ADV Audit │        │ • Sharpe / Alpha │                │ • Advisor Q&A    │        │ • Stop Loss Guard│
└──────────────────┘        └──────────────────┘                └──────────────────┘        └──────────────────┘
          │                           │                                   │                           │
          └───────────────────────────┴───────────────────┬───────────────┴───────────────────────────┘
                                                          ▼
                               ┌────────────────────────────────────────────────────────┐
                               │ 5. Broker Execution & Clearing Layer (Alpaca/IBKR FIX) │
                               └────────────────────────────────────────────────────────┘
```

1. **User Identity & Regulatory Compliance Engine:**
   - Dual-role authentication: **Retail Investor** vs. **Verified RIA**.
   - RIA registration validation against SEC IAPD / FINRA BrokerCheck CRD databases.
   - Suitability profile assessment (Conservative, Moderate, Aggressive) and Form ADV Part 2A disclosure audit trails.

2. **Thematic Basket & Model Portfolio Management:**
   - Multi-asset equity baskets grouped by macro themes.
   - Exact target percentage weights (must sum to 100%).
   - Performance analytics: 1-Month, 1-Year, All-Time Return, Sharpe Ratio, Volatility, Max Drawdown, and Alpha vs. S&P 500 / NASDAQ 100.
   - Periodic rebalancing audit trails.

3. **Compliant Social Discussion & Advisory Feed:**
   - Verified RIA market insights, rebalance rationale, and educational threads.
   - Sentiment tagging (Bullish, Neutral, Bearish).
   - Automated enforcement of SEC Rule 2210 advertising disclaimers on every post.

4. **Proportional Mirror Calculation & Allocation Simulator:**
   - Mathematical engine calculating exact share counts and dollar distributions for any retail capital input ($500+).
   - Dynamic cash buffer deduction (default 5%) to absorb slippage and clearing fees.
   - Automatic stop-loss circuit breaker configuration.

5. **Brokerage & Clearing Integration Layer (55% Phase):**
   - OAuth & FIX API connections to broker-dealer clearing agents (e.g., Alpaca Broker API, Interactive Brokers, DriveWealth).
   - Sub-account omnibus execution and trade allocation drops.

6. **Automated Order Synchronization & Webhook Daemon (55% Phase):**
   - Real-time order execution matching advisor rebalancing signals with copier accounts.

7. **Mobile App Delivery (AI-Assisted React Native / Expo):**
   - Decoupled client architecture ready for mobile porting.

---

## 📊 Platform Feature Breakdown: Core Functional MVP vs. Enterprise Roadmap

| Feature / Module | Core Functional MVP (Implemented ✅) | Enterprise Roadmap (Upcoming ⏳) |
| :--- | :--- | :--- |
| **Tech Stack Foundation** | Next.js + Express.js + MongoDB architecture with clean controllers, routes, models, and middleware | CI/CD production pipelines, Docker container orchestration |
| **Authentication & RBAC** | JWT Auth, Bcrypt hashing, Role-based access (Retail vs. RIA vs. Admin) | Biometric 2FA, OAuth2 / Plaid SSO |
| **RIA Verification Model** | RIA Profile schema, CRD registration fields, AUM tracking, SEC Form ADV link | Automated real-time SEC IAPD API scraper & CRD background checker |
| **Thematic Baskets** | Thematic portfolio modeling, asset weight validation (100% check), risk scoring, Sharpe ratio | Automated Yahoo Finance / FactSet live price websocket feed |
| **Mirror Trading Engine** | Proportional allocation engine, cash buffer deduction, fractional share calculator, order preview | Direct Alpaca / IBKR Broker API FIX order routing & live execution |
| **Social Discussion Hub** | Thematic discussion feed, comments, likes, automated SEC Rule 2210 compliance disclaimers | Real-time WebSockets (Socket.io) chat & push notifications |
| **Regulatory Audit Logging** | MongoDB audit schemas recording suitability checks and mirror authorizations | Form ADV automated reporting, PDF audit generation for regulators |
| **Mobile Migration** | Decoupled REST APIs, Expo component migration guide with screen-by-screen prompts | Published iOS / Android native apps on App Store & Google Play |

---

## 🛠️ Technology Stack & Architecture

### Backend: Node.js + Express.js + MongoDB
- **Runtime:** Node.js (v20+)
- **Server:** Express.js (Modular REST API)
- **Database:** MongoDB via Mongoose ORM (with in-memory zero-dependency fallback for rapid evaluation)
- **Security:** JWT (JSON Web Tokens), Bcryptjs, CORS, Input Sanitization
- **Logging:** Morgan HTTP logger + Custom Regulatory Audit Logger

### Frontend: Next.js + Tailwind CSS
- **Framework:** Next.js (App Router, Responsive UI)
- **Styling:** Tailwind CSS with modern dark fintech palette
- **Icons:** Lucide React
- **State Management:** React Context API (`AuthContext`) with seamless demo account switching (Retail vs. RIA)
- **API Client:** Clean fetch client with Bearer token interceptor and error handling

---

## 📁 Project Directory Structure

```
thematic-copy-trading/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection & fallback handler
│   │   │   └── jwt.js                # JWT sign and verify helpers
│   │   ├── models/
│   │   │   ├── User.js               # User & RIA schema (CRD, AUM, risk profile)
│   │   │   ├── Portfolio.js          # Thematic basket & allocation schema
│   │   │   ├── SocialPost.js         # Community discussion & compliance notice schema
│   │   │   ├── CopyTrade.js          # Mirrored positions & risk parameters schema
│   │   │   └── RegulatoryLog.js      # SEC/FINRA compliance audit trail schema
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, login, profile
│   │   │   ├── portfolioController.js# Thematic basket creation & explore
│   │   │   ├── copyController.js     # Mirror calculation & execution
│   │   │   ├── socialController.js   # Discussion feed, comments, likes
│   │   │   └── riaController.js      # Verified RIA directory
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── portfolioRoutes.js
│   │   │   ├── copyRoutes.js
│   │   │   ├── socialRoutes.js
│   │   │   └── riaRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT & Role validation (requireRole)
│   │   │   ├── validationMiddleware.js# Input sanitization & 100% allocation checks
│   │   │   └── errorMiddleware.js    # Global error handlers
│   │   ├── utils/
│   │   │   ├── mirrorCalculator.js   # Mathematical proportional allocation engine
│   │   │   ├── mockStore.js          # Realistic seed data for instant evaluation
│   │   │   └── seedData.js           # MongoDB database seeder script
│   │   ├── server.js                 # Production Express.js server
│   │   └── standalone-server.js      # Zero-dependency instant runner
│   ├── test-runner.js                # Verification test suite
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js             # Root layout with regulatory disclaimers & navbar
│   │   │   ├── page.js               # Thematic explore dashboard & mirror modal
│   │   │   ├── advisors/page.js      # Verified RIA fiduciary directory
│   │   │   ├── social/page.js        # Community advisory forum
│   │   │   └── my-trades/page.js     # Active mirrored trades & risk controls
│   │   ├── components/
│   │   │   ├── Navbar.js             # Header with role switcher (Retail <-> RIA)
│   │   │   ├── RegulatoryBanner.js   # SEC/FINRA compliance notification banner
│   │   │   ├── MetricCard.js         # Stat metric cards
│   │   │   ├── PortfolioCard.js      # Thematic basket cards with allocation weights
│   │   │   ├── AllocationBar.js      # Colored asset allocation breakdown bar
│   │   │   ├── MirrorModal.js        # Interactive copy-trade calculation modal
│   │   │   └── DiscussionFeed.js     # Compliant social feed
│   │   ├── context/
│   │   │   └── AuthContext.js        # Session & demo role state manager
│   │   ├── services/
│   │   │   └── api.js                # Centralized REST API service
│   │   └── styles/
│   │       └── globals.css           # Tailwind CSS directives
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
├── mobile-migration/
│   └── EXPO_MIGRATION_GUIDE.md       # AI migration guide for React Native + Expo
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started & Execution Instructions

### 1. Verification Test (Instant 5-Second Run)
You can verify the entire calculation engine, models, and RIA records immediately:
```bash
cd backend
node test-runner.js
```

### 2. Running the Backend API
```bash
cd backend
npm install
npm run dev
```
*Tip: If you do not have MongoDB running locally, the backend automatically operates in Hybrid Memory-Store Mode so all APIs and calculation endpoints remain 100% functional!*

### 3. Running the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## 🔒 Regulatory Compliance Implementation Details

- **SEC Investment Advisers Act Rule 206(4)-1:** Testimonials and performance advertising must present net-of-fees metrics, benchmark comparisons (S&P 500 / NASDAQ 100), and volatility indicators (Sharpe Ratio, Drawdown).
- **FINRA Rule 2210:** Social commentary automatically enforces educational-use disclaimers to prevent unauthorized promissory statements.
- **FINRA Rule 2111 (Suitability):** Retail copiers are prompted with suitability risk confirmations and cash reserve buffers prior to mirror trade activation.
