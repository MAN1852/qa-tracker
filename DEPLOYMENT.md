# Deployment Guide

## Frontend (Vercel)

1. **Push code to GitHub** (if not already)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
7. Deploy!

---

## Backend (Render)

### Step 1: Create PostgreSQL Database
1. Go to [render.com](https://render.com)
2. New → PostgreSQL
3. Copy the **Internal Database URL**

### Step 2: Deploy Backend
1. New → Web Service
2. Connect your repository
3. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `DATABASE_URL` = (paste PostgreSQL URL)
   - `PORT` = `10000`

---

## Post-Deployment

1. Update frontend `.env` with actual backend URL
2. Redeploy frontend on Vercel
3. Test the live application

## URLs
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`
