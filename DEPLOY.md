# Deployment Instructions for AquaVault

Follow these step-by-step instructions to deploy AquaVault to production.

---

## 🛠️ SUPABASE SETUP

1. **Create Account & Project**:
   - Go to [supabase.com](https://supabase.com), create a free account, and create a new project named `aquavault`.
2. **Execute Database Schema**:
   - Go to the **SQL Editor** tab in the Supabase Dashboard.
   - Click **New Query**, paste the contents of `backend/supabase-schema.sql`, and click **Run**.
3. **Copy API credentials**:
   - Go to **Settings > API**.
   - Copy the **Project URL** and the **anon public key**.
   - Store these values in `backend/.env` (based on `backend/.env.example`).

---

## 💻 BACKEND DEPLOY ON RENDER

1. **Push Changes to GitHub**:
   - Ensure all changes (including `frontend/` and `backend/` directories) are committed and pushed to your GitHub repository.
2. **Deploy Web Service**:
   - Go to [render.com](https://render.com), log in, and click **New > Web Service**.
   - Connect your GitHub repository.
   - Configure the service settings:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
3. **Add Environment Variables**:
     - Click **Environment** settings and add these values:
       - `SUPABASE_URL` = (your Supabase project URL)
       - `SUPABASE_KEY` = (your Supabase anon key)
       - `PORT` = `3001`
4. **Deploy**:
   - Click **Deploy Web Service**.
   - Once live, copy the generated Render service URL (e.g. `https://aquavault-backend.onrender.com`).

---

## 🌐 FRONTEND DEPLOY ON VERCEL

1. **Deploy Frontend**:
   - Go to [vercel.com](https://vercel.com), click **Add New > Project**, and import your GitHub repository.
2. **Configure Settings**:
   - Set **Root Directory** to `frontend`.
   - Under **Environment Variables**, add:
     - `VITE_API_URL` = (your Render service URL copied from above, e.g. `https://aquavault-backend.onrender.com`)
3. **Deploy**:
   - Click **Deploy**. Vercel will build the frontend and provide your live application URL.

---

## ⚡ SERVER KEEP-ALIVE CONFIGURATION

To prevent Render's free tier server from sleeping (which happens after 15 minutes of inactivity):

1. Go to [cron-job.org](https://cron-job.org) and register for a free account.
2. Click **Create Cronjob**.
3. Configure settings:
   - **Title**: `AquaVault Keep-Alive`
   - **Address**: `https://(YOUR_RENDER_SERVICE_URL)/health`
   - **Schedule**: Every `10 minutes`
4. Click **Create**. The cron job will ping your server every 10 minutes, keeping it responsive and active 24/7!
