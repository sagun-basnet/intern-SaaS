# 🚀 SaaS Job & Internship Portal REST API

Welcome to the **SaaS Job & Internship Portal** backend service! This is a feature-rich, production-ready RESTful API built with **Node.js**, **Express**, **Prisma ORM**, **MySQL**, **Socket.IO**, and **Swagger UI**.

---

## 📋 Table of Contents

- [🌟 Project Overview](#-project-overview)
- [👥 User Roles & Access Control](#-user-roles--access-control)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Environment & Configuration](#️-environment--configuration)
- [🗄️ Database Setup & Prisma](#️-database-setup--prisma)
- [📧 SMTP Configuration (OTP Email Setup)](#-smtp-configuration-otp-email-setup)
- [🔑 Google OAuth 2.0 Setup](#-google-oauth-20-setup)
- [🚀 Running the Server](#-running-the-server)
- [📚 API Documentation & Testing](#-api-documentation--testing)
- [🔑 Default Seed Credentials](#-default-seed-credentials)

---

## 🌟 Project Overview

The **SaaS Job & Internship Portal** connects job seekers with employers in a streamlined, secure ecosystem. It provides:
- **For Job Seekers**: Profile creation, resume uploading, job searching, one-click applications, and bookmarking.
- **For Companies**: Company profile registration, job posting management, candidate application review, and status updates.
- **For Admins**: Platform oversight, company approval workflows, user management, and system stats.

---

## 👥 User Roles & Access Control

1. **`SEEKER`**: Job seekers looking for internships or full-time roles.
2. **`COMPANY`**: Employers posting openings (requires Admin approval before posting jobs).
3. **`ADMIN`**: Superusers with administrative control over users, companies, jobs, and platform metrics.

---

## ✨ Key Features

- **🔐 Dual Authentication**:
  - **Email & Password**: Account registration with 6-digit **OTP (One-Time Password)** email verification.
  - **Google OAuth 2.0**: One-click social sign-in.
- **📧 Email Services & OTP**:
  - 10-minute expiration timer for verification OTPs.
  - Endpoint to request new OTPs (`/api/auth/resend-otp`).
  - Automated HTML email templates powered by `Nodemailer`.
- **💼 Job Management & Filtering**:
  - CRUD operations for jobs (Full-time, Part-time, Internship, Contract).
  - Search by keyword, job type, and location.
- **📄 Profile & Resume Uploads**:
  - Static file hosting for resume uploads (`/uploads`) handled via `Multer`.
- **🔔 Real-time Notifications**:
  - WebSocket support via `Socket.IO` for real-time application updates and alerts.
- **📖 Interactive API Docs**:
  - Live OpenAPI 3.0 interactive documentation powered by `Swagger UI` at `/api/docs`.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime Environment** | Node.js (v18+) |
| **Web Framework** | Express v5 |
| **Database** | MySQL |
| **ORM** | Prisma ORM v5 |
| **Real-time Engine** | Socket.IO |
| **Authentication** | JSON Web Tokens (JWT) & Passport.js |
| **File Uploads** | Multer |
| **Mailing** | Nodemailer |
| **API Documentation** | Swagger UI Express / Swagger JSDoc |

---

## 📁 Project Structure

```text
SaaS/
├── prisma/
│   ├── schema.prisma        # Database schema definitions & models
│   ├── seed.js              # Database seed script for initial testing data
│   └── migrations/          # SQL migration files
├── src/
│   ├── config/
│   │   ├── db.js            # Prisma client instance initialization
│   │   ├── passport.js      # Passport Google OAuth configuration
│   │   ├── socket.js        # Socket.IO connection & event management
│   │   └── swagger.js       # Swagger spec definitions
│   ├── controllers/         # Request handling & HTTP response logic
│   ├── middleware/          # Auth guard, RBAC check, validation & error handler
│   ├── routes/              # Express API endpoints mapping
│   ├── services/            # Business logic & database operations
│   ├── utils/               # Nodemailer & helper functions
│   ├── generated/client/    # Generated Prisma Client output
│   └── app.js               # Express application configuration
├── uploads/                 # Static storage directory for uploaded resumes
├── .env                     # Local environment variables
├── .env.example             # Example environment configuration template
├── server.js                # HTTP server entry point & Vercel export
├── package.json             # Dependencies & npm scripts
└── vercel.json              # Vercel serverless deployment config
```

---

## ⚙️ Environment & Configuration

Create a `.env` file in the root folder by copying `.env.example`:

```bash
cp .env.example .env
```

### Environment Variables Reference

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Local server port | `5000` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |
| `DATABASE_URL` | MySQL connection string | `mysql://root:password@localhost:3306/saas_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_super_secret_jwt_key` |
| `JWT_EXPIRES_IN` | JWT token validity duration | `7d` |
| `UPLOAD_PATH` | Directory for uploaded files | `uploads` |
| `MAX_FILE_SIZE` | Maximum file upload size in bytes (5MB) | `5242880` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your_google_client_id` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `your_google_client_secret` |
| `GOOGLE_CALLBACK_URL` | Google OAuth redirect URL | `http://localhost:5000/api/auth/google/callback` |
| `FRONTEND_URL` | Frontend client application URL | `http://localhost:5173` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP authentication username / email | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP authentication password / App password | `your-app-password` |
| `SMTP_FROM_NAME` | Sender name in emails | `"Lunar SaaS"` |

---

## 🗄️ Database Setup & Prisma

### 1. Database Connection
Ensure your MySQL server is running locally or provide a remote database URL in `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/lunar_saas_db"
```

### 2. Generate Prisma Client
Generate the type-safe Prisma client based on `prisma/schema.prisma`:
```bash
npm run db:generate
```

### 3. Run Database Migrations
Create and execute migrations on your MySQL database:
```bash
npm run db:migrate
```

### 4. Seed Initial Data
Populate the database with sample users (Admin, Companies, Seekers) and job listings:
```bash
npm run db:seed
```

### 5. Open Prisma Studio (Database GUI)
Explore and manage database records interactively in your browser:
```bash
npm run db:studio
```

---

## 📧 SMTP Configuration (OTP Email Setup)

To enable email OTP generation for user registration and password/verification workflows, configure the SMTP settings in `.env`.

### Option A: Gmail (Recommended for testing)
1. Go to your Google Account Settings -> **Security**.
2. Enable **2-Step Verification**.
3. Go to **App Passwords** and generate a password for "Mail".
4. Update `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-account@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx  # Insert 16-character App Password here
SMTP_FROM_NAME="Lunar SaaS"
```

### Option B: Ethereal Mail / Mailtrap (Fake SMTP testing)
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
SMTP_FROM_NAME="Lunar SaaS"
```

---

## 🔑 Google OAuth 2.0 Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and configure the **OAuth consent screen**.
3. Create **OAuth 2.0 Client IDs** (Web Application).
4. Set Authorized Redirect URIs to:
   `http://localhost:5000/api/auth/google/callback`
5. Copy the Client ID and Client Secret into your `.env`:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

## 🚀 Running the Server

### Installation
First, install all project dependencies:
```bash
npm install
```

### Development Mode (with Auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Once started, the terminal will confirm:
```text
🚀 Server running on http://localhost:5000
📚 API Documentation: http://localhost:5000/api/docs
🏥 Health check: http://localhost:5000/health
```

---

## 📚 API Documentation & Testing

### Interactive Swagger UI
Access the full interactive Swagger documentation directly in your browser:
- **Swagger Docs**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Raw OpenAPI Spec**: [http://localhost:5000/api/docs.json](http://localhost:5000/api/docs.json)

### Main Endpoint Groups

| Module | Base Path | Description |
| :--- | :--- | :--- |
| **Health** | `GET /health` | Service status check |
| **Auth** | `/api/auth` | Register, verify OTP, resend OTP, login, Google OAuth, current user |
| **Users** | `/api/users` | Profile view/update & resume upload |
| **Companies** | `/api/companies` | Company listing, details, creation, and profile updates |
| **Jobs** | `/api/jobs` | Job search, job details, job posting CRUD |
| **Applications** | `/api/applications` | Apply for job, view applications, update application status |
| **Bookmarks** | `/api/bookmarks` | Save job, remove bookmark, view bookmarked jobs |
| **Notifications** | `/api/notifications` | User notifications list & mark read |
| **Admin** | `/api/admin` | Platform stats, company approval/rejection, user & job management |

---

## 🔑 Default Seed Credentials

After running `npm run db:seed`, you can log in with these pre-configured test accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@lunarportal.com` | `password123` | Full admin privileges |
| **SEEKER** | `john@student.com` | `password123` | Verified job seeker profile |
| **COMPANY** | `hr@techcorp.com` | `password123` | Approved company profile |

---

*Built with ❤️ by the Lunar Intern Team.*
