# SaaS Subscription & Client Management System

A lightweight, production-ready **Subscription and Client Management System** built with **Node.js (Express)**, **MySQL**, and **Bootstrap 5**. Designed specifically for freelancers, digital agencies, and small SaaS platforms to effortlessly manage recurring client subscriptions, pricing, and status tracking.

---

## 🌟 Key Features

- **User Authentication:** Secure signup and login powered by `bcryptjs` password hashing and `express-session`.
- **Subscription Management:** Easily add, display, filter, and delete active or pending client services.
- **Status Badges:** Visual representation of subscription statuses (`Active`, `Pending`, `Cancelled`).
- **Cloud Database Ready:** Fully prepared for MySQL cloud hosts like **Aiven**, **PlanetScale**, or **AWS RDS** with built-in auto-table creation logic.
- **MVC Architecture:** Clean separation of concerns with modular routes, middleware, views, and configurations.
- **RTL & Responsive Design:** Built using Bootstrap 5 with RTL support for multi-language readiness.

---

## 📁 Directory Structure

```text
subscription-manager/
├── config/
│   └── db.js            # Database connection configuration
├── middleware/
│   └── auth.js          # Authentication check middleware
├── routes/
│   ├── auth.js          # Authentication routes (login, register, logout)
│   └── dashboard.js     # Subscription CRUD routes
├── views/
│   ├── login.html       # Login UI
│   ├── register.html    # Registration UI
│   └── dashboard.html   # Main Dashboard UI
├── .env                 # Environment variables
├── schema.sql           # Raw database schema
├── server.js            # Express app & table auto-initializer
└── package.json         # Dependencies and scripts