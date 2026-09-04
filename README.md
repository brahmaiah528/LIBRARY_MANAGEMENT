# Full-Stack Library Management System Web Application

A modern, responsive full-stack Library Management System built with **React.js**, **Node.js + Express.js**, **MongoDB**, **JWT Authentication**, and **Tailwind-inspired CSS Design System**.

---

## 🌟 Features Overview

- **Authentication & Authorization**:
  - JWT token-based authentication with Bcrypt password hashing.
  - Role-based Access Control (RBAC): **Admin** and **Student** permissions.
  - Library-themed modern Login UI with Show/Hide password, Remember Me, Forgot password modal, and **Quick Demo Login buttons**.
  - Student Registration with automated validation.

- **Interactive Dashboard**:
  - Key Performance Metric cards (Total Books, Total Students, Books Issued, Returned, Overdue).
  - Pure SVG/CSS interactive charts (Monthly lending trends & Category distribution).
  - Real-time recent circulation feed table.

- **Book Catalog Management**:
  - Full CRUD operations (Add, Edit, Delete Books).
  - Multi-field live search (Title, Author, Category, ISBN).
  - Availability status tracking (Total copies vs. Available copies, Shelf locations).

- **Student Directory**:
  - Add, Edit, Delete student profiles.
  - View individual borrowing history (active issues, historical returns, fines paid).

- **Issue & Return Desk**:
  - Book issuing wizard (select student, select available book, auto-set due date).
  - Book return workflow with dynamic **Overdue Fine calculation** ($5/day overdue rate).
  - Status filters: All, Issued, Overdue, Returned.

- **Reports & Analytics**:
  - Monthly summaries, Issued log, Returned log, Overdue list, and Most Borrowed Books ranking.
  - Printable report view and **Export to CSV** functionality.

- **Theme & User Experience**:
  - Persistent Dark / Light Mode toggle.
  - Toast notification alerts for actions and errors.
  - Profile management and Password update screen.

---

## 🔑 Default Credentials

### 👑 Admin Account
- **Email**: `admin@library.com`
- **Password**: `Admin@123`

### 🎓 Student Account
- **Email**: `student@library.com`
- **Password**: `Student@123`

---

## 📁 Project Structure

```
software/
├── README.md
├── server/                    # Node.js + Express REST API
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   ├── server.js              # Express app entrypoint
│   ├── seed.js                # Database seed script
│   ├── config/
│   │   └── db.js              # Mongoose DB connection with Memory Fallback
│   ├── models/
│   │   ├── User.js            # User / Student schema
│   │   ├── Book.js            # Book catalog schema
│   │   └── IssuedBook.js      # Circulation & Fine schema
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT validation & role check
│   │   └── errorHandler.js    # Global error handler
│   ├── controllers/           # Business logic controllers
│   └── routes/                # REST API route handlers
└── client/                    # React SPA Frontend (Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── index.css          # Design system & dark mode styles
        ├── App.jsx            # React router & protected routes
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ThemeContext.jsx
        ├── components/        # Reusable UI components
        ├── pages/             # App views (Login, Dashboard, Books, etc.)
        └── utils/
            └── api.js         # API client wrapper
```

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

---

### Step 1: Start Backend Server (`server/`)

Open a terminal in the `server` directory:

```bash
cd server
npm install
npm run dev
```

> **Note on MongoDB**: The backend is configured to connect to `mongodb://localhost:27017/library_management`. If you do NOT have a local MongoDB daemon running, the server automatically starts an **in-memory MongoDB server (`mongodb-memory-server`)** so the app runs out-of-the-box in any environment without errors! It will also auto-seed default credentials and sample books on initial launch.

The backend API will run on `http://localhost:5000/api`.

---

### Step 2: Start Frontend Application (`client/`)

Open a second terminal in the `client` directory:

```bash
cd client
npm install
npm start
```

The frontend will run on `http://localhost:3000`.

---

## 🛠 API Endpoints Summary

### Auth Routes (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Current profile
- `PUT /api/auth/profile` - Update profile details
- `PUT /api/auth/change-password` - Update password

### Book Routes (`/api/books`)
- `GET /api/books` - List/Search books
- `GET /api/books/:id` - Book details
- `POST /api/books` - Add book (Admin)
- `PUT /api/books/:id` - Edit book (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### User / Student Routes (`/api/users`)
- `GET /api/users` - Directory list (Admin)
- `GET /api/users/:id` - Student details & history
- `POST /api/users` - Register student (Admin)
- `PUT /api/users/:id` - Update student (Admin)
- `DELETE /api/users/:id` - Remove student (Admin)

### Issue & Return Routes (`/api/issues`)
- `GET /api/issues` - Circulation records
- `POST /api/issues` - Issue book (Admin)
- `PUT /api/issues/:id/return` - Return book & calculate fine (Admin)

### Dashboard & Reports (`/api/dashboard` & `/api/reports`)
- `GET /api/dashboard/stats` - Aggregated metrics & chart data
- `GET /api/reports` - Detailed report datasets
