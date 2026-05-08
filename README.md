# 🚀 SaaS Job & Internship Portal

Welcome to the **SaaS Job & Internship Portal**! This project is a modern, production-grade platform designed to connect job seekers with potential employers. It's built with scalability, security, and ease of use in mind.

---

## 🌟 What is this Project?

At its heart, this is a **Bridge**. 
- It helps **Job Seekers** find their dream roles or internships.
- It helps **Companies** find the right talent to grow their teams.
- It helps **Administrators** keep the platform safe and organized.

Think of it like a specialized marketplace where the "products" are career opportunities and the "customers" are talented individuals.

---

## 👥 Who Uses This? (User Roles)

The platform is designed with three distinct roles, each with their own "superpowers":

1.  **🔍 Job Seekers (SEEKER)**
    - Create a professional profile.
    - Search and filter for jobs or internships.
    - Apply to jobs with a single click (and a custom message).
    - Save (Bookmark) jobs to look at later.
    - Track the status of their applications.

2.  **🏢 Companies (COMPANY)**
    - Register their organization.
    - Post new job openings and internships.
    - Review applications from interested candidates.
    - Manage their company profile and logo.
    - *Note: Companies must be approved by an Admin before they can start posting.*

3.  **🛡️ Administrators (ADMIN)**
    - The "Engineers" of the platform.
    - Approve or reject new company registrations.
    - Manage users and ensure everything is running smoothly.
    - Access a bird's-eye view of all activity on the platform.

---

## 🛤️ How it Works (The User Journey)

### 1. The Onboarding
Every journey starts with a **Sign Up**. You can use your email or just link your Google account. If you use email, we'll send you a secret code (OTP) to make sure it's really you.

### 2. Setting the Stage
- **Seekers**: Fill out your profile with your skills and upload your resume. This is your digital business card!
- **Companies**: Register your company details. Once an Admin gives you the green light (Approved), you're ready to hire.

### 3. The Matchmaking
Companies post jobs. Seekers browse through them. Found something you like? Click **Apply**. 
The company will see your profile and resume immediately. They can then decide to accept or reject the application.

---

## ✨ Key Features

-   **🔐 Secure Authentication**: Sign up using your email or your Google account (OAuth 2.0). We use industry-standard encryption to keep your data safe.
-   **📧 OTP Verification**: To ensure every user is real, we use One-Time Passwords (OTP) sent via email for verification.
-   **📄 Smart Profiles**: Manage your resume, skills, and bio in one place.
-   **💼 Job Management**: A full suite of tools for companies to list, edit, and close job postings.
-   **📥 Application Tracking**: A clear workflow for applying and receiving feedback.
-   **📚 Interactive API Docs**: For the developers, we have a built-in "Swagger" page where you can test every part of the system live.

---

## 🛠️ The Technology Stack

We use modern, reliable tools to build this platform:

| Component | Technology | Why we use it? |
| :--- | :--- | :--- |
| **Backend** | Node.js & Express | Fast, scalable, and widely supported. |
| **Database** | MySQL | A powerful, industry-standard way to store data. |
| **Database Tool** | Prisma | Makes talking to the database easy and error-free for developers. |
| **Auth** | JWT & Passport.js | Securely identifies who is logged in. |
| **Documentation** | Swagger | Creates an interactive "manual" for the API. |

---

## 📁 Project Organization (For Techies)

If you're looking at the code, here is where the magic happens:

```text
├── client/           # The Frontend (User Interface)
├── prisma/           # Database blueprints (Schema)
├── src/              # The Backend (Logic)
│   ├── controllers/  # "The Brains" - Handles user requests
│   ├── services/     # "The Doers" - Handles heavy lifting and DB logic
│   ├── routes/       # "The Map" - Routes requests to the right place
│   ├── middleware/   # "The Guards" - Security and validation checks
│   └── utils/        # "The Toolbox" - Small helper functions
├── uploads/          # Where profile pictures and resumes are stored
└── server.js         # The entry point of the application
```

---

## 🚀 Getting Started

Want to run this locally? Follow these simple steps:

1.  **Clone the project** to your computer.
2.  **Install dependencies**: Run `npm install`.
3.  **Setup Environment**: Create a `.env` file (copy from `.env.example`) and add your database URL and secret keys.
4.  **Prepare Database**: 
    - Run `npm run db:migrate` to create the tables.
    - Run `npm run db:seed` to add some initial data (like an admin account).
5.  **Start the Engine**: Run `npm run dev`.
6.  **Visit the API Docs**: Open `http://localhost:5000/api-docs` in your browser.

---

## 📈 Future Roadmap

-   [ ] **Real-time Notifications**: Get alerted instantly when you get a job offer.
-   [ ] **AI Job Matching**: Automatically suggest the best jobs based on your skills.
-   [ ] **Video Interviews**: Built-in tools for companies to interview candidates.

---

*Built with ❤️ by the Lunar Intern Team.*
