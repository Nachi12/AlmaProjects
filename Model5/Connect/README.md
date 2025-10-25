# connect

A full-stack mock interview scheduling app for students to schedule interviews, track progress, and practice with curated resources.

Badges: React 18 -  Redux Toolkit -  Node.js -  Express -  MongoDB -  Tailwind CSS -  Jest/Vitest

Overview
connect enables scheduling mock interviews, viewing upcoming and completed sessions, practicing with categorized questions, and managing profiles with secure authentication. It is built as a Single Page Application (SPA) with a Node.js/Express backend and MongoDB for persistence.

Features
- Authentication: Email/password with JWT; optional Google OAuth.
- Scheduling: Select interview type, date/time, interviewer, duration, and notes.
- My Interviews: Tabs for all, upcoming, completed, cancelled; feedback and notes display.
- Practice Resources: Category filter (Frontend, Backend, Full Stack, Behavioral, DSA), pagination (10 per page), related blogs.
- Profile: View/update name, contact, DOB; email is non-editable; logout.
- UI/UX: Carousel, hover effects, FAQ accordion, responsive design.
- Validation: Frontend validation and backend validation using express-validator.
- Testing: Frontend tests (Vitest/RTL), backend tests (Jest/Supertest).

Tech Stack
- Frontend: React, Redux Toolkit, React Router, Tailwind CSS, Framer Motion, Axios, Vitest, React Testing Library.
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, express-validator, Jest, Supertest.
- Tooling: ESLint, Prettier, Vite, Nodemon.

Project Structure (example)
- Frontend/
  - src/
    - components/ (layout, ui, shared widgets)
    - pages/ (Dashboard, Login, Signup, MyInterviews, Profile, Resources, NotFound)
    - store/ (Redux store and slices)
    - tests/ (RTL/Vitest tests)
    - App.jsx, main.jsx
  - public/
  - package.json, vite.config.js, tailwind config, postcss config
- backend/
  - models/ (User, Interview, Resource)
  - routes/ (auth, users, interviews, resources)
  - middleware/ (auth, error handler, validators)
  - tests/ (Jest/Supertest)
  - server.js, db/config
  - package.json
- README.md, .gitignore, .env.example

Getting Started

Prerequisites
- Node.js 18+
- npm 9+ or yarn
- MongoDB (local or hosted)

Clone
- git clone <repo-url>
- cd <project-root>

Backend Setup
- cd backend
- npm install
- Create .env
  - NODE_ENV=development
  - PORT=5001
  - MONGODB_URI=mongodb://127.0.0.1:27017/connect
  - JWT_SECRET=change_this_in_production
  - FRONTEND_URL=http://localhost:5173
- Start
  - npm run dev (development)
  - npm start (production)

Frontend Setup (if in separate Frontend/)
- cd Frontend
- npm install
- Create .env
  - VITE_API_URL=http://localhost:5001/api
- Run
  - npm run dev
- Build
  - npm run build
- Preview
  - npm run preview

Environment Variables

Backend
- NODE_ENV: development | production
- PORT: default 5001
- MONGODB_URI: Mongo connection string
- JWT_SECRET: secret key for tokens
- FRONTEND_URL: CORS origin for frontend

Frontend
- VITE_API_URL: http://localhost:5001/api (adjust for production)
- Optional OAuth keys (e.g., VITE_GOOGLE_CLIENT_ID)

Scripts

Backend
- npm run dev: start dev server with nodemon
- npm start: start server
- npm test: run Jest tests
- npm run test:coverage: Jest coverage

Frontend
- npm run dev: Vite dev server
- npm run build: production build (dist/)
- npm run preview: serve built app

Testing

Frontend (Vitest + React Testing Library)
- cd Frontend
- npm test
- npm run test:coverage

Backend (Jest + Supertest)
- cd backend
- npm test
- npm run test:coverage

API (Examples)

Base URL
- Local: http://localhost:5001/api

Auth
- POST /auth/register: { name, email, password, contact }
- POST /auth/login: { email, password }
- POST /auth/google: { tokenId }
- POST /auth/reset-password: { token, password }
- GET /auth/me: Authorization: Bearer <token>

Users
- GET /users/profile: Authorization: Bearer <token>
- PUT /users/me: { name, contact, dob }

Interviews
- GET /interviews: Authorization: Bearer <token>
- POST /interviews: { type, date, time, interviewer, duration, notes }
- PUT /interviews/:id
- DELETE /interviews/:id

Resources
- GET /resources?category=frontend&page=1&limit=10

Pages

Dashboard
- Header with navigation (Schedule, My Interviews, Practice Resource, user menu)
- Schedule Interview form with type/date/time/interviewer/duration/notes
- Submit persists to DB

My Interviews
- Tabs: All, Upcoming, Completed, Cancelled
- Cards show date, time, type, interviewer, duration, notes, feedback
- Filtering and counts per status

Practice Resources
- Category dropdown (Frontend, Backend, Full Stack, Behavioral, DSA)
- 10 questions per page with pagination
- Expandable Q&A (accordion)
- Related blogs sidebar

Profile
- Non-editable email, editable name/contact/dob
- Save updates; logout available in user menu

Not Found
- 404 page with link back to home

Validation

Frontend
- Email format, required fields, password length, matching passwords, phone digits.

Backend
- express-validator rules per route with consistent error messages.

Security
- JWT auth on protected routes
- Passwords hashed with bcryptjs
- CORS configured to FRONTEND_URL
- Basic rate-limiting recommended in production

Deployment

Frontend
- Build: npm run build (dist/)
- Host on Vercel/Netlify/Nginx and proxy API requests to backend

Backend
- Render/Railway/Heroku/AWS/GCP/Azure
- Set environment variables in platform
- Use npm ci --omit=dev for production

Single-Server Option
- Serve frontend (dist/) via Nginx or Express static
- Run backend with PM2
- Use reverse proxy for /api

PDF Export of README (optional)
- Pandoc: pandoc README.md -o README.pdf
- Node: npx md-to-pdf README.md

Contributing
- Fork and branch: feature/<name>
- Commit with conventional messages
- Add tests and docs for new features
- Open a PR

License
- MIT License. Replace or update as needed for your project.

Credits
- React, Redux Toolkit, Tailwind CSS, shadcn/ui, Framer Motion
- Express, Mongoose, Jest, Supertest, Vitest, RTL

Quick Commands

Backend
- npm run dev
- npm start
- npm test
- npm run test:coverage

Frontend
- npm run dev
- npm run build
- npm run preview
