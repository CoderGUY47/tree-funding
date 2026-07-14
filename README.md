# 🌳 TreeFund — Premium Crowdfunding Platform for Sustainability

TreeFund is a full-stack MERN crowdfunding platform where **Supporters** buy platform credits to back active green campaigns, **Creators** raise funds for sustainability projects, and **Administrators** moderate every action. Built with **Next.js 14 App Router + TypeScript** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## 🔑 Admin Credentials

| Field | Value |
|---|---|
| **Email** | `admin@treefunding.com` |
| **Password** | `adminpassword123` |

> The database auto-seeds this admin account with 99,999 credits on first startup.

---

## 🌐 Live Links

| Resource | URL |
|---|---|
| **Live Frontend (Vercel)** | [https://tree-funding.vercel.app](https://tree-funding.vercel.app) |
| **GitHub Repository** | [https://github.com/CoderGUY47/tree-funding](https://github.com/CoderGUY47/tree-funding) |

---

## ✨ Key Features (10+)

1. **Role-Based Dashboards** — Three distinct workspace dashboards (Supporter, Creator, Admin) each with their own sidebar navigation, statistics, and access-controlled pages.
2. **Credit Purchase via Stripe** — Supporters purchase credits using Stripe payment gateway (simulated sandbox). Credits are credited to their wallet balance instantly on checkout confirmation.
3. **Campaign Contribution System** — Supporters pledge credits to approved campaigns. Contributions are held in a `pending` state until the Creator manually approves or rejects each pledge.
4. **Admin Campaign Approval Pipeline** — Newly created campaigns are hidden until an Admin reviews and approves them. Admins can also suspend or permanently delete campaigns.
5. **Creator Withdrawal Requests** — Creators request credit-to-cash payouts. Admins review and confirm or reject withdrawal requests on a dedicated management panel.
6. **Automatic Supporter Refunds** — If a Creator deletes a campaign with active approved contributions, the system automatically calculates and refunds all supporter balances.
7. **Real-Time Notification Bell** — A floating notification center in the navbar displays recent platform events (contribution statuses, campaign approvals, payout confirmations) with outside-click dismissal.
8. **Campaign Reporting** — Supporters can flag suspicious campaigns with a detailed report. Admins review all flagged campaigns in a Reports management panel.
9. **imgBB Media Uploads** — Campaign banner images are uploaded via drag-and-drop file inputs connected to the imgBB CDN API.
10. **Recharts Statistics Visualizations** — Supporter and Creator home dashboards feature Bar Charts (contribution distributions / campaign funding progress) and Pie Charts (category breakdowns / funding share) powered by Recharts.
11. **Google OAuth Login** — Users can sign in via Google using Better Auth, with automatic role assignment and credits setup on first sign-in.
12. **Responsive Design** — Fully responsive layout across mobile, tablet, and desktop. Dashboard sidebar collapses gracefully on smaller screens.
13. **Session Persistence on Reload** — Uses Better Auth session management to restore authenticated user sessions on page reload — private routes stay accessible without redirecting to login.
14. **Environment Variable Security** — All sensitive credentials (MongoDB URI, JWT secrets, Stripe keys, Google OAuth) are stored in `.env` files and never exposed to the client.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS v4, Recharts, Axios |
| **Backend** | Node.js, Express.js, Mongoose (MongoDB) |
| **Auth** | Better Auth (JWT sessions + Google OAuth) |
| **Payments** | Stripe Elements (sandbox mode) |
| **Media CDN** | imgBB API |
| **Deployment** | Vercel (Frontend) + Render/Railway (Backend) |

---

## 🚀 Local Setup Guide

### Prerequisites
- Node.js v18+
- MongoDB Atlas URI or local MongoDB running at `mongodb://127.0.0.1:27017`

### 1. Backend

```bash
cd backend
cp .env.example .env   # fill in your keys
npm install
npm run dev
```

Server starts at: `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # fill in your keys
npm install
npm run dev
```

Client starts at: `http://localhost:3000`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Frontend (`frontend/.env`)
```
MONGODB_URI=your_mongodb_atlas_uri
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 📁 Project Structure

```
tree-funding/
├── frontend/          # Next.js 14 App Router client
│   ├── src/app/       # Pages (dashboard, explore, auth)
│   ├── src/components # Navbar, Footer, reusable UI
│   └── src/context    # AuthContext (Better Auth session)
├── backend/           # Express.js REST API server
│   ├── routes/        # API route handlers
│   ├── models/        # Mongoose schemas
│   └── middleware/    # JWT auth guards
└── README.md
```
