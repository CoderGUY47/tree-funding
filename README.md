# TreeFund - Premium Crowdfunding Platform for Sustainability

TreeFund is a MERN stack crowdfunding platform designed to help environmental creators raise credits for tree-planting, clean energy, and sustainability projects. Supporters purchase credits securely and back active campaigns, while creators withdraw their earnings in cash payouts once campaigns are approved and completed.

---

## 🔑 Administrative Credentials

To inspect the administrator dashboard and moderate the system, use the following credentials:

* **Admin Username (Email)**: `admin@treefunding.com`
* **Admin Password**: `adminpassword123`

Note: The database automatically seeds this administrator user with 99,999 credits on startup if no admin exists.

---

## 🌐 Platform URLs

* **Frontend Live Deployment**: [https://tree-fund-client.vercel.app](https://tree-fund-client.vercel.app)
* **Client-Side GitHub Repository**: [https://github.com/coderguy/tree-funding-client](https://github.com/coderguy/tree-funding-client)
* **Server-Side GitHub Repository**: [https://github.com/coderguy/tree-funding-server](https://github.com/coderguy/tree-funding-server)

---

## ✨ Platform Features & Highlights

1. **Role-Based Workspaces**: Custom dashboards for three distinct user roles (Supporters, Creators, and Administrators) securing isolated navigation menus and system clearance boundaries.
2. **Double-Credit Contribution Ledger**: Supporter balances deduct immediately upon making contributions. Credits are safely locked in a pending status to prevent double-spending, and are fully refunded on rejection or campaign deletions.
3. **Admin Moderation & Approvals**: Administrators approve newly created campaigns before they go live and confirm creator withdrawal requests before transferring cash.
4. **Stripe Payment Gateway**: Supporter credit checkouts are powered by Stripe Elements. The platform automatically falls back to a simulated dummy payment flow if Stripe secret keys are not configured.
5. **Interactive Campaign Detailing**: Rich story summaries, category filtering, title keyword search, progress bars showing raised percentages, and deadline countdowns.
6. **Automatic Supporter Refunds**: If a creator deletes an active campaign, all approved backer credits are automatically calculated and returned to their respective supporter accounts.
7. **Creator Earnings Conversion**: Standardized business conversion math where supporters buy 10 credits for $1, but creators withdraw $1 for every 20 credits raised, generating platform revenue.
8. **Real-Time Notification Pop-up**: A floating alert center in the navigation bar displays actions (contribution statuses, payouts, reports, approvals) in descending order, with outside click dismissal.
9. **Supporter Reporting System**: Supporters can flag suspicious or invalid campaigns, adding details that admins review in a dedicated moderation panel.
10. **Backend Data Pagination**: Supporter contribution tables use backend skipped queries to paginate results, minimizing document payload sizes.
11. **imgBB API Media Uploading**: Creators can upload campaign banners directly via drag-and-drop file inputs, connecting to the imgBB API for CDN storage.
12. **Auto-Seeding Database**: The server auto-seeds connection configurations and default admin credentials to ensure local testing works immediately.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 14+ (App Router, Tailwind CSS, TypeScript, Axios, Framer Motion)
* **Backend**: Node.js + Express.js API Server
* **Database**: MongoDB + Mongoose ODM (Schemas, aggregations)
* **Security**: JSON Web Tokens (JWT) for session management, BCrypt for password hashing

---

## 🚀 Local Run Guide

### Prerequisite

* Node.js v18+ installed
* MongoDB local service running on `mongodb://127.0.0.1:27017`

### 1. Start Backend API

```bash
cd backend
npm install
npm run dev
```

Server runs on port 5000: <http://localhost:5000>

### 2. Start Next.js Client

```bash
cd ../frontend
npm install
npm run dev
```

Client runs on port 3000: <http://localhost:3000>
