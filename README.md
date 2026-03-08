I've sent out hundreds of job applications through platforms like JobStreet, Glints, and LinkedIn, and rarely heard back. Not even a rejection email.

The reason? My CV was buried under thousands of other applicants. On most job platforms, HR receives a massive pile of applications through an internal dashboard, and if your CV isn't near the top, it's practically invisible.

I thought: what if applications landed directly in HR's email inbox instead? An email feels personal. It stands out. It doesn't get lost in a dashboard full of 500 other applicants. So I built lokerbaru.id a job board where applications go straight to the employer's email, making every application feel more personal and significantly more visible.

🛠️ Tech Stack — and Why
I built lokerbaru.id using the MERN stack (MongoDB, Express, React, Node.js) — but with significant additions:

| Layer | Technology | Why I Chose It |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast dev experience with HMR; React's component model made it easy to build complex multi-role UIs (Job Seeker, Employer, Admin) |
| **Styling** | Tailwind CSS 4 | Rapid prototyping with utility classes — I could iterate on UI design without switching between files |
| **Animations** | Framer Motion | Smooth, premium-feeling micro-animations that make the app feel polished and alive |
| **Backend** | Express 5 + Node.js | Lightweight and flexible — perfect for building a REST API with middleware-heavy architecture |
| **Database** | MongoDB + Mongoose | Schema flexibility was key — job listings, user profiles, articles, and subscriptions all have very different shapes |
| **Caching** | Redis | Implemented SWR (Stale-While-Revalidate) caching to handle high traffic without overloading the database |
| **Payments** | Midtrans | Integrated for premium employer subscriptions (Indonesian payment gateway) |
| **Auth** | JWT + Google OAuth | Dual authentication — traditional email/password with bcrypt hashing, plus one-click Google sign-in |
| **File Storage** | Cloudinary | Cloud-based image uploads for profile photos and company logos |
| **Rich Text** | TinyMCE | WYSIWYG editor for articles and job descriptions |
| **i18n** | i18next | Multi-language support (Indonesian & English) |
| **Backend Deployment** | Fly.io | Global edge deployment for fast load times worldwide |
| **Frontend Deployment** | Vercel | Global edge deployment for fast load times worldwide |

🧗 Challenges
1. Building a Multi-Role System from Scratch
Infoloker isn't just one app — it's three. Job seekers browse and apply, employers post and manage listings, and admins moderate everything. Each role has its own dashboard, permissions, and data flow. Designing the auth middleware to cleanly separate these roles without duplicating code was one of the hardest architectural decisions.

2. Making Applications Feel Personal (Email Delivery)
The core differentiator — sending applications via email — sounds simple, but getting it right was tricky. I had to handle email formatting, file attachments (CVs), error handling for invalid addresses, and rate limiting to prevent abuse. Making sure emails didn't land in spam folders was an ongoing battle.

3. Performance at Scale with Redis Caching
Early on, the app was slow when loading job listings because every request hit the database. I implemented a Stale-While-Revalidate (SWR) caching pattern with Redis — the frontend shows cached data instantly while the backend refreshes it in the background. This dramatically improved perceived performance.

4. Security Hardening
As a job platform handling personal data (CVs, emails, phone numbers), security couldn't be an afterthought. I implemented:

Helmet for HTTP security headers
Rate limiting to prevent brute-force attacks
MongoDB sanitization to prevent NoSQL injection
HPP (HTTP Parameter Pollution) protection
Input validation with Yup on every endpoint
HTML sanitization to prevent XSS in rich-text content
5. Payment Integration
Integrating Midtrans for premium subscriptions meant handling webhooks, payment verification, subscription expiry via cron jobs, and graceful error states — all while keeping the UX smooth.

6. Deployment & DevOps
Deploying a full-stack app across two platforms (Fly.io + Vercel) introduced challenges: CORS configuration, environment variable management, Docker containerization for the backend, and ensuring the SPA routing worked correctly on Vercel.

✅ Results
Full-stack production app deployed and live
3 user roles with dedicated dashboards (Job Seeker, Employer, Admin)
Direct-to-email applications — the core differentiator
Premium subscription system with real payment integration
Article/blog CMS with rich text editing
Real-time notifications for application updates
Analytics dashboard for admins with Recharts visualization
Multi-language support (Indonesian & English)
Redis-powered caching for fast page loads
Comprehensive security middleware stack

📸 Screenshots
<img width="804" height="1634" alt="iPhone-13-PRO-lokerbaru id" src="https://github.com/user-attachments/assets/7d6486ef-92f4-4b52-93b5-7b126fec6029" />
<img width="804" height="1634" alt="iPhone-13-PRO-lokerbaru id (1)" src="https://github.com/user-attachments/assets/6c0f6507-5a47-4f16-a047-3c65dc8a5662" />
<img width="804" height="1634" alt="iPhone-13-PRO-lokerbaru id (2)" src="https://github.com/user-attachments/assets/77d82e44-70c8-4668-a0d5-e9b137216288" />
<img width="804" height="1634" alt="iPhone-13-PRO-lokerbaru id (3)" src="https://github.com/user-attachments/assets/d1d04042-c96e-4060-b2e2-fbd82e00cb63" />
<img width="804" height="1634" alt="iPhone-13-PRO-lokerbaru id (4)" src="https://github.com/user-attachments/assets/5eb15737-37ff-4230-a3a3-b1bdb53e245a" />
<img width="804" height="1634" alt="iPhone-13-PRO-lokerbaru id (5)" src="https://github.com/user-attachments/assets/238eb1de-a842-4b1f-bdad-0b73590d9f24" />



link: [lokerbaru.id](https://lokerbaru.id/)
Github: https://github.com/percobaantutu/infoloker
