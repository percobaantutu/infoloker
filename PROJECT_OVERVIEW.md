# Infoloker Project Overview

## Introduction
**Infoloker** is a comprehensive job listing platform designed to connect job seekers with employers. It features a modern MERN stack architecture with a robust backend and a responsive frontend, facilitating a seamless user experience for job searching, application management, and recruitment.

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), Google OAuth
- **Security:** Helmet, CORS, Rate Limiting (`express-rate-limit`)
- **Logging:** Winston
- **File Storage:** Cloudinary (via `multer-storage-cloudinary`), Local uploads
- **Email:** Nodemailer
- **Payments:** Midtrans Client

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS 4, Tailwind Merge, CLSX, Framer Motion
- **State Management:** React Context (`AuthProvider`)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Internationalization:** i18next
- **Rich Text Editor:** TinyMCE
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## Project Structure

The project is divided into two main directories:

- **`backend/`**: Contains the Node.js/Express server logic.
  - `config/`: Configuration files (DB, Cloudinary).
  - `controllers/`: Request handlers for API endpoints.
  - `models/`: Mongoose schemas (User, Job, Application, etc.).
  - `route/`: API route definitions.
  - `middleware/`: Custom middleware (Auth, Rate Limit, Maintenance).
  - `utils/`: Helper utility functions.

- **`frontend/`**: Contains the React application.
  - `src/components/`: Reusable UI components.
  - `src/pages/`: Page views for different routes.
  - `src/context/`: Global state context providers.
  - `src/routes/`: Route protection and configuration.
  - `src/hooks/`: Custom React hooks.

## Key Features

### 1. Authentication & User Management
- **Sign Up/Login:** Secure email/password login and Google OAuth integration.
- **Role-Based Access:** Support for three distinct roles:
  - **Job Seeker:** Can search and apply for jobs.
  - **Employer:** Can post jobs and manage applications.
  - **Admin:** System oversight and management.
- **Account Recovery:** Password reset flow via email.

### 2. Job Seeker Features
- **Job Search:** Browse and search for available job openings.
- **Job Details:** View detailed information about job requirements and benefits.
- **Applications:** Apply for jobs and track application status (`/applications/my`).
- **Profile:** Manage personal profile and resume.
- **Saved Jobs:** Bookmark jobs for later.

### 3. Employer Features
- **Dashboard:** Overview of recruiting activities.
- **Job Management:** Post, edit, and manage job listings.
- **Applicant Tracking:** View and manage applicants for posted jobs.
- **Company Profile:** Manage company details and branding.
- **Pricing:** View and purchase subscription plans.

### 4. Admin Features
- **Dashboard:** System-wide analytics and overview.
- **User Management:** Manage user accounts.
- **Job Management:** Oversee job postings.
- **Subscription Management:** Manage billing and subscriptions.
- **Content Management:** Create and manage articles/blog posts (Rich Text Editor).
- **Settings:** Configure system-wide settings.

### 5. Content & Community
- **Articles:** A section for career advice or news, managed by admins.

## Integrations
- **Cloudinary:** Used for storing and serving user-uploaded images (avatars, company logos).
- **Midtrans:** Integrated for handling payments, likely for premium employer features.
- **Google OAuth:** Facilitates easy sign-in for users.
- **Nodemailer:** Handles transactional emails (welcome emails, password resets).
