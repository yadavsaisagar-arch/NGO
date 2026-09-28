# NGO Disaster Response Management System (Full-Stack MERN)

A modern, production-grade web application designed for NGOs and emergency relief teams to coordinate rapid disaster response operations, track emergency assistance requests, mobilize volunteers, and manage relief supplies with MongoDB Atlas persistence.

---

## 🌟 Key Features

### 1. Modern Architecture
- **Frontend:** React 18, React Router v6, Axios, custom responsive design system preserving the original NGO brand identity (`#1f3c88` / `#23418c` / `#d62828`).
- **Backend:** Node.js, Express.js RESTful API, Helmet, CORS, body parsers, cookie-parser, and rate limiting.
- **Database:** MongoDB Atlas via Mongoose with live `$group` aggregation pipelines and indexes.
- **Authentication & Security:** Bcrypt password hashing, JWT session handling (HTTP-only cookies & Bearer tokens), role-based authorization (`USER` vs `ADMIN`), and centralized error handling.

### 2. Core Modules
- **Emergency Assistance:**
  - Emergency help request submission with multi-step validations (Name, 10-digit Phone, Location, Address, Disaster Type, Number of People, Required Help, Description).
  - Auto-generated tracking IDs (`ER-1001`, `ER-1002`, ...).
  - **User Data Ownership:** Users can only view and manage their personal submissions under `My Requests`.
  - Admin operational management with real-time status updates (`Pending`, `In Progress`, `Resolved`, `Rejected`).
- **Volunteer Management:**
  - Specialized volunteer registration (Skills: Medical, Rescue, Food Distribution, Communication, Transportation; Availability: Full Time, Part Time, Weekends).
  - Auto-generated Volunteer IDs (`V-1001`, `V-1002`, ...).
  - Users can view and update their volunteer profile status directly.
  - Admin volunteer dashboard with skill filters, search, and `Active`/`Inactive` toggles.
- **Relief Material Management:**
  - Real-time inventory tracking for Food, Water, Medicine, Clothing, Shelter Materials, and Logistics.
  - **Zero Fake Counters:** Inventory statistics are computed dynamically using MongoDB `$group` aggregation queries.
  - Admin inventory table with search, category filtering, stock adjustments (`Available`, `Low Stock`, `Distributed`), and item deletion.
- **Admin Dashboard:**
  - 6 Real-time KPI Metric Cards: Emergency Requests, Registered Volunteers, Relief Supplies, Active Operations, Registered Users, and Unread Inquiries.
  - Direct access to Operations Management.
  - Live activity preview tables with inline status updates and message processing.
- **Contact & Inquiries:**
  - Interactive contact form with input validation and instant modal feedback.
  - Administrative message inbox with `Unread` / `Read` / `Archived` filters and message deletion.

---

## 📂 Project Folder Structure

```
NGO-Disaster-Response/
├── client/                       # React 18 + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProtectedRoute, AdminRoute, Modal, Loading
│   │   ├── context/              # AuthContext (JWT, user state, roles)
│   │   ├── pages/                # Home, About, Services, Contact, Login, Signup,
│   │   │                         # Emergency, Volunteer, Relief, MyRequests,
│   │   │                         # AdminDashboard, EmergencyRequests, Volunteers, Materials
│   │   ├── services/             # Axios API client modules
│   │   ├── styles/               # global.css (enhanced brand design tokens & responsiveness)
│   │   ├── App.jsx               # React Router layout and route definitions
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js            # Configured with proxy to port 5000
│
├── server/                       # Express.js REST API Backend
│   ├── config/
│   │   └── db.js                 # MongoDB connection & configuration
│   ├── controllers/              # Business logic controllers
│   │   ├── authController.js     # User registration, login, logout, /me, admin seeder
│   │   ├── emergencyController.js# Emergency submissions, personal tracking, admin triage
│   │   ├── volunteerController.js# Volunteer registration, profile, admin management
│   │   ├── reliefController.js   # Relief inventory & MongoDB aggregation summary
│   │   ├── contactController.js  # Contact messages and admin inbox
│   │   └── adminController.js    # System dashboard metrics & user listings
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification from headers/cookies
│   │   ├── roleMiddleware.js     # Role authorization guard (ADMIN)
│   │   └── errorMiddleware.js    # Centralized 404 & Mongoose/JWT error handling
│   ├── models/                   # Mongoose Data Models
│   │   ├── User.js
│   │   ├── EmergencyRequest.js
│   │   ├── Volunteer.js
│   │   ├── ReliefMaterial.js
│   │   └── ContactMessage.js
│   ├── routes/                   # Modular Express routers
│   ├── utils/
│   │   └── generateToken.js      # JWT token generator & cookie handler
│   ├── app.js                    # Express app configuration & middlewares
│   ├── server.js                 # Server entry point on port 5000
│   ├── .env                      # Environment variables
│   └── .env.example
│
├── .gitignore                    # Protects node_modules, .env, and logs
├── package.json                  # Root orchestration scripts
├── test-e2e.js                   # Automated 16-point End-to-End test suite
└── [legacy HTML/CSS/JS files preserved for academic reference]
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+ or v20+ LTS recommended)
- **MongoDB Atlas** account or a running MongoDB database

### 2. Environment Configuration
The backend configuration is located in `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. Installation
From the project root directory, install dependencies for both client and server:

```bash
# Install server dependencies
npm --prefix server install

# Install client dependencies
npm --prefix client install
```

### 4. Running the Application

```bash
# Option A: Start backend server (port 5000)
npm run server

# Option B: Start frontend client (port 3000)
npm run client
```

Now open **`http://localhost:3000`** in your browser.

---

## 🔐 User Roles & Default Credentials

| Role | Username | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Full access to Admin Dashboard, all emergency requests, volunteer assignments, inventory controls, and contact inbox. |
| **User** | *(Self-registered)* | *(Your password)* | Can submit emergency help requests, register as volunteer, contribute relief materials, and view own submitted records under `My Requests`. |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new community account
- `POST /api/auth/login` — Login user or admin, returns JWT & sets cookie
- `POST /api/auth/logout` — Logout user, clears session cookie
- `GET  /api/auth/me` — Get profile of currently logged-in user (Protected)

### Emergency Requests (`/api/emergency`)
- `POST /api/emergency` — Submit a new emergency assistance request (Protected)
- `GET  /api/emergency/my` — Get user's own submitted emergency requests (Protected)
- `GET  /api/emergency/:id` — Get single request details (Ownership / Admin verified)

### Volunteer Management (`/api/volunteers`)
- `POST /api/volunteers` — Register or update volunteer profile (Protected)
- `GET  /api/volunteers/my` — Get user's active volunteer profile (Protected)

### Relief Materials (`/api/relief`)
- `GET    /api/relief/summary` — Database-aggregated stock counts by category (Public)
- `POST   /api/relief` — Add contributed relief material (Protected)
- `GET    /api/relief/my` — Get user's contributed supplies (Protected)
- `GET    /api/relief/:id` — Get material details
- `PATCH  /api/relief/:id` — Update material details/status (Owner / Admin)
- `DELETE /api/relief/:id` — Remove material from inventory (Owner / Admin)

### Contact Messages (`/api/contact`)
- `POST /api/contact` — Submit an inquiry or support message (Public)

### Admin Operations (`/api/admin`) *(Requires ADMIN role)*
- `GET   /api/admin/dashboard` — Live aggregation metrics & recent operational activity
- `GET   /api/admin/users` — View all registered accounts
- `GET   /api/admin/emergency` — View all emergency requests with status & search filters
- `PATCH /api/admin/emergency/:id/status` — Update emergency request status (`Pending`, `In Progress`, `Resolved`, `Rejected`)
- `GET   /api/admin/volunteers` — View all volunteers with skill and status filters
- `PATCH /api/admin/volunteers/:id/status` — Toggle volunteer status (`Active` / `Inactive`)
- `GET   /api/admin/relief` — Central inventory management
- `GET   /api/admin/contact` — View incoming inquiries inbox
- `PATCH /api/admin/contact/:id/status` — Mark message as `Read` or `Archived`
- `DELETE /api/admin/contact/:id` — Delete inquiry

---

## 🧪 Automated Testing

To run the automated end-to-end verification suite across all 16 core requirements:

```bash
node test-e2e.js
```

**Results:**
```
====================================================
RESULTS: 16 PASSED, 0 FAILED
====================================================
```
