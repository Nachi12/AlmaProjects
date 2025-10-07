# 🎯 connect - Mock Interview Platform

A full-stack web application for scheduling and managing mock interviews with comprehensive practice resources and interview tracking.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?logo=redux)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-success?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)
![Tests](https://img.shields.io/badge/Tests-24%2F24%20Passing-success)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎓 Interview Management
- **Schedule Interviews** - Book mock interviews with preferred time slots
- **Interview Tracking** - Track upcoming, completed, and cancelled interviews
- **Interview Types** - Frontend, Backend, Full Stack, DSA, System Design, HR, Behavioral
- **Real-time Status Updates** - Live updates on interview status

### 📚 Practice Resources
- **Categorized Resources** - Organized by interview type
- **Practice Questions** - Curated question banks with answers
- **Study Materials** - Links to helpful learning resources
- **Pagination & Search** - Easy navigation through resources

### 👤 User Features
- **User Authentication** - Secure JWT-based authentication
- **Google OAuth** - Quick login with Google
- **Profile Management** - Update personal information and preferences
- **Dashboard Analytics** - View interview statistics and insights

### 🎨 UI/UX Features
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Interactive Carousel** - Browse interview types with smooth animations
- **Card Hover Effects** - Engaging visual feedback
- **FAQ Accordion** - Collapsible frequently asked questions
- **Dark/Light Theme** - Theme toggle support (optional)

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Pre-built accessible components
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Vite** - Build tool
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Jest** - Testing framework
- **Supertest** - API testing

---

## 📁 Project Structure
## Frontend
├── .DS_Store
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── .DS_Store
│   ├── favicon.ico
│   ├── Favicon.png
│   ├── Hero Section.jpg
│   ├── LOGO.png
│   ├── placeholder.svg
│   ├── Resources.jpg
│   └── robots.txt
├── README.md
├── src
│   ├── .DS_Store
│   ├── App.css
│   ├── App.jsx
│   ├── components
│   │   ├── auth
│   │   │   └── GoogleSignIn.jsx
│   │   ├── interviews
│   │   │   └── InterviewCarousel.jsx
│   │   ├── layout
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Layout.jsx
│   │   └── ui
│   │       ├── accordion.jsx
│   │       ├── alert-dialog.jsx
│   │       ├── alert.jsx
│   │       ├── aspect-ratio.jsx
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       ├── breadcrumb.jsx
│   │       ├── button.jsx
│   │       ├── calendar.jsx
│   │       ├── card.jsx
│   │       ├── carousel.jsx
│   │       ├── chart.jsx
│   │       ├── checkbox.jsx
│   │       ├── collapsible.jsx
│   │       ├── command.jsx
│   │       ├── context-menu.jsx
│   │       ├── dialog.jsx
│   │       ├── drawer.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── form.jsx
│   │       ├── hover-card.jsx
│   │       ├── input-otp.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── Logo.jsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.jsx
│   │       ├── progress.jsx
│   │       ├── radio-group.jsx
│   │       ├── resizable.jsx
│   │       ├── scroll-area.jsx
│   │       ├── select.tsx
│   │       ├── separator.jsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.jsx
│   │       ├── skeleton.jsx
│   │       ├── slider.jsx
│   │       ├── sonner.jsx
│   │       ├── switch.jsx
│   │       ├── table.tsx
│   │       ├── tabs.jsx
│   │       ├── textarea.jsx
│   │       ├── toast.tsx
│   │       ├── toaster.jsx
│   │       ├── toggle-group.jsx
│   │       ├── toggle.jsx
│   │       ├── tooltip.jsx
│   │       └── use-toast.js
│   ├── config
│   │   └── firebase.js
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── index.css
│   ├── lib
│   │   └── utils.js
│   ├── main.jsx
│   ├── pages
│   │   ├── About.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Index.jsx
│   │   ├── Login.jsx
│   │   ├── MyInterviews.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Resources.jsx
│   │   ├── ScheduleInterview.jsx
│   │   └── Signup.jsx
│   ├── store
│   │   ├── slices
│   │   │   ├── authSlice.js
│   │   │   ├── interviewSlice.js
│   │   │   └── resourceSlice.js
│   │   └── store.js
│   ├── tests
│   │   ├── Dashboard.test.jsx
│   │   ├── Login.test.jsx
│   │   ├── Resources.test.jsx
│   │   └── setup.js
│   ├── utils
│   │   └── resourceMapping.js
│   └── vite-env.d.ts
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── UX Ui Design
│   ├── .DS_Store
│   └── connect Proj Pics
│       ├── .DS_Store
│       ├── 2012.i602.006_online_library_flat copy.jpg
│       ├── cropped
│       │   └── .DS_Store
│       └── successful-entrepreneurs-analyzing-perspectives copy.jpg
└── vite.config.ts


## Backend Structure

├── .DS_Store
├── .env
├── db.js
├── jest.config.js
├── middleware
│   └── auth.js
├── models
│   ├── Interview.js
│   ├── Resource.js
│   └── User.js
├── package-lock.json
├── package.json
├── README.md
├── routes
│   ├── auth.js
│   ├── interviews.js
│   ├── resources.js
│   └── users.js
├── server.js
└── tests
    ├── __mocks____
    │   ├── Interviews.js
    │   ├── mongoose.js
    │   ├── Resources.js
    │   └── User.js
    ├── auth.test.js
    ├── debug-auth.js
    ├── interviews.test.js
    ├── resources.test.js
    ├── setup.js
    └── users.test.js