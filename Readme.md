# 🎓 Alumni Management System

An end‑to‑end **MERN stack** application to manage university/college alumni including events, jobs, forums, gallery, and system settings.

> ✅ This is a **monorepo** that contains both frontend and backend in a single repository:

```bash
Alumni Management System/
├── backend/   # Node.js + Express + Sequelize API
├── frontend/  # ReactJS client
└── README.md  # ← You are here
```

---

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based login/signup with HTTP-only cookies
* Role-based access: Public, Alumni, Admin

### 🛠️ Admin Dashboard

* User, Career, Course, Event, Forum, Gallery & Settings Management
* Summary Dashboard (Counts API)

### 🙋 Alumni Portal

* Register & wait for admin approval
* RSVP to events
* Browse/post in forums
* View jobs
* Manage own profile & avatar

### 📤 File Uploads

* Avatars and gallery images via Multer
* Served via Express static middleware

---

## 📁 Project Structure

```bash
.
├── backend/
│   ├── config/             # DB & Mail config
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Auth, error handlers
│   ├── models/             # Sequelize models
│   ├── public/             # Static files (avatars/images)
│   ├── routes/             # Express routes
│   ├── utils/              # Helpers & upload/mailers
│   ├── SqlDatabase/        # SQL Dump
│   ├── app.js              # Express instance
│   ├── index.js            # Server entry point
│   └── package.json
│
└── frontend/
    ├── public/             # Static assets
    ├── src/
    │   ├── admin/          # Admin views
    │   ├── components/     # Shared UI
    │   ├── utils/          # Contexts, Global URL
    │   ├── App.jsx         # Router & Layout
    │   └── main.jsx        # ReactDOM render
    └── package.json
```

---

## ⚙️ Getting Started

### ✅ Prerequisites

* Node.js (v16+)
* MySQL

### 📦 Install Dependencies

```bash
git clone https://github.com/ranajunaidhashim/Alumni-server.git
cd Alumni-server
```

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

### 🌐 Environment Setup

Create a `.env` file inside `backend/`:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=alumni_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=supersecretkey
PORT=3000
```

---

### 🗃️ Database Setup

1. Create a database:

```sql
CREATE DATABASE alumni_db;
```

2. Import SQL Dump:

```bash
mysql -u root -p alumni_db < backend/SqlDatabase/alumni_db.sql
```

---

### 🔃 Run the Application

#### Backend API

```bash
cd backend
npm start
```

> Runs at: [http://localhost:3000](http://localhost:3000)

#### Frontend

```bash
cd frontend
npm run dev
```

> Runs at: [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

### Auth

```
POST /auth/signup
POST /auth/login
POST /auth/logout
```

### Admin Panel `/api/admin`

* `GET /dashboard/counts`

#### Users

```
GET /users
PUT /users
DELETE /users/:id
```

#### Careers

```
GET /jobs
POST /jobs
PUT /jobs/:id
DELETE /jobs/:id
```

#### Courses

```
GET /courses
POST /courses
PUT /courses/:id
DELETE /courses/:id
```

#### Events

```
GET /events
POST /events
PUT /events/:id
DELETE /events/:id
POST /events/participate
POST /eventcommits/check
```

#### Forums

```
GET /forums
POST /forums
PUT /forums/:id
DELETE /forums/:id
GET /forums/:topicId/comments
POST /forums/:topicId/comments
PUT /forums/comments/:id
DELETE /forums/comments/:id
```

#### Gallery

```
GET /gallery
POST /gallery
DELETE /gallery/:id
```

#### Alumni

```
GET /alumni
GET /alumni/:id
PUT /alumni/status
PUT /alumni/account
DELETE /alumni/:id
```

#### Settings

```
GET /settings
```

---

## 🎨 Frontend Highlights

* Public Pages: Home, About, Jobs, Gallery, Forums
* Alumni Portal: Manage account, avatar, comments
* Admin: Full dashboard and CRUD access

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/YourFeature`
3. Commit changes: `git commit -m "feat: ..."`
4. Push and submit a PR

---

## 📄 License
