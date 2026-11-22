# 🚀 Deployment & Team Lead Presentation Guide
## Regulated Thematic Social Copy-Trading Network

This guide provides everything you need to **deploy the platform** and conduct a **high-impact live demonstration** for your team lead and engineering peers.

---

## 🎯 Part 1: How to Present to Your Team Lead (Demo Script)

Follow this 5-minute structured presentation flow to highlight full adherence to the team's tech stack mandate and engineering standards.

### 1. Introduction & Executive Banner (1 Minute)
- **Open:** `http://localhost:3000`
- **What to say:**
  > *"Hi team, here is the functional platform for the Regulated Thematic Social Copy-Trading Network. We built it strictly adhering to our mandated stack: Next.js for the responsive frontend, Node.js and Express.js for the backend API, and MongoDB for our data persistence."*
- **What to show:**
  - The **Institutional Hero Banner**: Highlights SEC / FINRA compliance, CRD verification, and active fractional rebalancing engine.
  - The top **Regulatory Compliance Banner**: Points to public Form ADV Part 2A filings and SEC IAPD database.

### 2. Thematic Basket Exploration & Holdings (1.5 Minutes)
- **What to say:**
  > *"Unlike unregulated crypto or forex copy platforms, our platform allows retail investors to follow Registered Investment Advisors (RIAs). Instead of day-trading individual stocks, RIAs curate long-term thematic macro baskets like Generative AI Infrastructure, Clean Tech Grid Storage, and Cyber Defense."*
- **What to show:**
  - Click on the theme filter pills (**Artificial Intelligence & Cloud**, **Clean Tech & Renewable Energy**, **Cybersecurity & Defense**).
  - Show the **Asset Allocation Bar**: Highlight how holdings (e.g. NVDA 28%, MSFT 22%, TSM 18%) visually display their model weights.
  - Point to the verified RIA profile with their Central Registration Depository (**CRD #**) and audited Sharpe ratio.

### 3. Interactive Mirror Calculation Engine (Live Demo) (1.5 Minutes)
- **What to say:**
  > *"Here is our core business calculation engine. When a retail user mirrors an RIA, they don't buy fixed shares — our backend dynamically calculates proportional fractional share allocations based on the investor's exact capital and risk parameters."*
- **What to show:**
  - Click **"Mirror This Allocation"** on the AI Infrastructure basket.
  - Change capital from `$5,000` to `$10,000`. Show how the calculated share counts update in real time.
  - Adjust the **Cash Buffer slider** (e.g., 5% = $500 reserved in cash to prevent market slippage).
  - Adjust the **Stop-Loss circuit breaker** (-15%).
  - Check the mandatory **SEC Suitability Acknowledgment** checkbox.
  - Click **"Authorize Mirror Trade"** and show the confirmation dialog and regulatory log entry.

### 4. Fiduciary Community Forum & Role Switching (1 Minute)
- **What to say:**
  > *"We built role-based authorization into both frontend and backend. Watch how the interface adapts when I switch from a Retail Investor to a Verified RIA."*
- **What to show:**
  - Click the **"Switch: Verified RIA"** button in the navbar.
  - The user badge immediately switches to **Sarah Chen, CFA (Apex Thematic Asset Mgmt • CRD #6894021)**.
  - Open the **Advisory Discussion Feed**: Show how discussions include mandatory SEC Rule 2210 compliance disclaimers.

### 5. Architectural Quality Walkthrough (30 Seconds)
- Open your code editor and briefly show:
  - `backend/src/controllers/`: Clean separation of business logic (`portfolioController`, `copyController`).
  - `backend/src/middleware/`: Validation middleware enforcing that model basket weights sum to exactly 100%.
  - `backend/src/models/`: MongoDB schemas with Mongoose models and audit logging.
  - `mobile-migration/`: Mobile migration blueprint for React Native + Expo.

---

## 🌐 Part 2: Deployment Options

### Option A: One-Command Presentation (Fastest for Local Demo)

To launch both the **Backend API (port 5000)** and **Next.js Frontend (port 3000)** simultaneously:

```powershell
cd C:\Users\prava\.gemini\antigravity\scratch\thematic-copy-trading
node start-all.js
```
*(On Windows, you can also simply double-click `start-presentation.bat`).*

---

### Option B: Free Cloud Deployment (Live Public URL)

To give your team lead a live link they can open on their phone or laptop, deploy using **Vercel + Render + MongoDB Atlas**:

#### Step 1: Database (MongoDB Atlas)
1. Sign up for free at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a user (e.g., `thematic_admin` / password).
4. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** -> **Connect your application** -> Copy the connection string:
   ```text
   mongodb+srv://thematic_admin:<password>@cluster0.abcde.mongodb.net/thematic_copy_trading?retryWrites=true&w=majority
   ```

#### Step 2: Backend (Render.com)
1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Regulated Thematic Copy Trading Network"
   git branch -M main
   git remote add origin https://github.com/<your-username>/thematic-copy-trading.git
   git push -u origin main
   ```
2. Log in to [render.com](https://render.com) and click **New +** -> **Web Service**.
3. Select your repository and configure:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. In **Environment Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas URI from Step 1>`
   - `JWT_SECRET`: `super_secure_jwt_secret_key_ria_thematic_2026`
5. Click **Deploy Web Service**. You will get a backend URL: `https://your-backend.onrender.com`.

#### Step 3: Frontend (Vercel)
1. Log in to [vercel.com](https://vercel.com) and click **Add New** -> **Project**.
2. Select the same GitHub repository.
3. Configure project settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click Edit and select `frontend`
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com/api`
5. Click **Deploy**. Vercel will output a live HTTPS link: `https://your-app.vercel.app`.

---

### Option C: Instant Shareable Public URL (30 Seconds via LocalTunnel)

If you are presenting in a few minutes and don't want to configure cloud services:
1. Start the local app:
   ```powershell
   node start-all.js
   ```
2. In a second terminal window, run:
   ```powershell
   npx localtunnel --port 3000
   ```
3. LocalTunnel will give you an instant public HTTPS URL (e.g., `https://green-fintech-42.loca.lt`) that you can send to your team lead immediately.

---

### Option D: Docker Container Deployment

If your team lead prefers Docker:
```bash
docker compose up --build
```
This automatically provisions MongoDB 7.0, builds the Express API container, and compiles the Next.js production container.
