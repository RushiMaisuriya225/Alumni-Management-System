# Alumni Management System — Setup & Usage Guide

MERN-style stack: **React (Vite)** frontend + **Node/Express + Sequelize** backend + **MySQL** database.

---

## 1. Prerequisites

- Node.js v16+ (tested on v24)
- MySQL 8.x (service running)
- Git

---

## 2. Clone

```bash
git clone https://github.com/ranajunaidhashim/Alumni-Management-System.git
cd Alumni-Management-System
```

Layout:
```
Alumni-Management-System/
├── backend/    # Express + Sequelize API  (port 3000)
├── frontend/   # React + Vite client      (port 5173)
└── SETUP_GUIDE.md
```

---

## 3. Install dependencies

```bash
cd backend  && npm install
cd ../frontend && npm install
```

If `bcrypt` fails to load on the backend, rebuild its native binary:
```bash
cd backend && npm rebuild bcrypt
```

---

## 4. Backend environment (`backend/.env`)

Create `backend/.env`:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=alumni_db
DB_USER=root
DB_PASS=mysqls
JWT_SECRET=supersecretkey_change_me
PORT=3000
EMAIL_USER=
EMAIL_PASS=
```

> Note: the code reads `DB_PASS` (not `DB_PASSWORD` as the original Readme says).
> `EMAIL_USER/PASS` are optional — leave blank unless you need mail features.
> Current MySQL root password in this setup is `mysqls`.

---

## 5. Database setup

Create the DB and import the dump. The original dump is MariaDB-flavored and fails
on MySQL 8 (a `date` column defaulting to `current_timestamp`). Use the patched copy:

```bash
# from the backend/ folder
mysql -u root -pmysqls -e "CREATE DATABASE IF NOT EXISTS alumni_db;"

# patch the dump (only needed once) then import
cd SqlDatabase
sed 's/`date_created` date NOT NULL DEFAULT current_timestamp()/`date_created` datetime NOT NULL DEFAULT current_timestamp()/' alumni_db.sql > alumni_db_patched.sql
mysql -u root -pmysqls alumni_db < alumni_db_patched.sql
cd ..
```

Verify:
```bash
mysql -u root -pmysqls -e "USE alumni_db; SHOW TABLES;"
```
Expected tables: `alumnus_bio, careers, courses, event_commits, events,
forum_comments, forum_topics, gallery, system_settings, users`.

### Fixes already applied to this working copy
If you are re-importing a fresh dump, re-apply these so all CRUD works:

```sql
USE alumni_db;
-- alumnus signup needs these defaults (NOT NULL columns in the dump)
ALTER TABLE alumnus_bio
  MODIFY gender varchar(10) NOT NULL DEFAULT '',
  MODIFY batch  year        NOT NULL DEFAULT 0;

-- normalize image/avatar paths so they display in the browser
UPDATE gallery     SET image_path = REPLACE(image_path, CHAR(92), '/');
UPDATE gallery     SET image_path = REPLACE(image_path, 'Public/Images/', 'public/images/');
UPDATE alumnus_bio SET avatar     = REPLACE(avatar, CHAR(92), '/');
UPDATE alumnus_bio SET avatar     = REPLACE(avatar, 'Public/Avatar/', 'public/avatars/');
```

---

## 6. Run

Open two terminals.

**Terminal 1 — backend** (http://localhost:3000)
```bash
cd backend
npm start        # nodemon index.js — auto-reloads on file changes
```
Expect: `Server is running on port 3000` + `Database connected successfully`.

**Terminal 2 — frontend** (http://localhost:5173)
```bash
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

Production build of the frontend (optional):
```bash
cd frontend && npm run build    # output in frontend/dist/
```

---

## 7. Stop / Restart

**Stop**
- In each terminal: press `Ctrl + C`.
- Kill all Node processes (Windows):
  ```bash
  taskkill //F //IM node.exe
  ```

**Restart**
- Just re-run the two commands from section 6.
- MySQL runs as a Windows service (`MySQL80`) and starts automatically on boot.
  Check / control it:
  ```bash
  # check status (PowerShell)
  powershell -Command "Get-Service MySQL80"
  # start / stop (run as admin)
  net start MySQL80
  net stop  MySQL80
  ```

Backend uses **nodemon**, so saving a backend file auto-restarts it (no manual
restart needed). Vite hot-reloads the frontend automatically.

---

## 8. Login credentials

| Role    | Email               | Password   | Notes |
|---------|---------------------|------------|-------|
| Admin   | admin@gmail.com     | admin123   | full dashboard access |
| Alumnus | alumnus@gmail.com   | (unknown)  | seed hash; reset if needed (below) |

Reset any user's password to a known value:
```bash
cd backend
node -e "import('bcrypt').then(async b=>{console.log(await b.hash('newpass123',10))})"
# copy the printed hash, then:
mysql -u root -pmysqls -e "USE alumni_db; UPDATE users SET password='<PASTE_HASH>' WHERE email='alumnus@gmail.com';"
```

---

## 9. Operations you can perform

Log in as **admin** (admin@gmail.com / admin123) to reach the dashboard.

- **Dashboard** — summary counts (forums, jobs, events, upcoming events, alumni).
- **Users** — list, edit, delete users. (No create here — use Signup.)
- **Alumni** — list, search (by name / course / batch), view, verify/unverify, delete.
- **Careers / Jobs** — add, edit, delete job postings.
- **Courses** — add, edit, delete courses.
- **Events** — add, edit, delete events; alumni can RSVP ("participate").
- **Forums** — add/edit/delete topics; add/edit/delete comments.
- **Gallery** — upload images (with caption), delete images.
- **Settings** — view system settings (name, email, contact, cover image, about).

**Creating users (there is no "Add User" button by design):**
Use the **Signup** page, or the API:
```bash
# admin account
curl -X POST localhost:3000/auth/signup -H "Content-Type: application/json" \
  -d '{"name":"New Admin","email":"admin2@test.com","password":"pass123","userType":"admin"}'

# alumnus account (needs a valid course_id)
curl -X POST localhost:3000/auth/signup -H "Content-Type: application/json" \
  -d '{"name":"New Alum","email":"alum2@test.com","password":"pass123","userType":"alumnus","course_id":1}'
```
New alumni register as **Unverified** and must be approved by an admin
(Alumni tab → View → Verify Account).

---

## 10. Quick API reference (base `http://localhost:3000`)

```
POST /auth/signup            POST /auth/login            POST /auth/logout

GET  /api/admin/dashboard/counts

GET/PUT/DELETE  /api/admin/users
GET/POST/PUT/DELETE  /api/admin/jobs
GET/POST/PUT/DELETE  /api/admin/courses
GET/POST/PUT/DELETE  /api/admin/events
POST /api/admin/events/participate
POST /api/admin/events/participation-check
GET  /api/admin/events/upcoming-events
GET/POST/PUT/DELETE  /api/admin/forums
GET/POST  /api/admin/forums/:topicId/comments
PUT/DELETE /api/admin/forums/comments/:id
GET/POST/DELETE  /api/admin/gallery      (POST = multipart, field "image")
GET/PUT/DELETE  /api/admin/alumni
PUT  /api/admin/alumni/status
PUT  /api/admin/alumni/account           (multipart, field "avatar")
GET  /api/admin/settings
```

Uploaded/seed images are served at `http://localhost:3000/api/admin/public/...`.

---

## 11. Troubleshooting

- **"Access denied for user 'root'"** — wrong `DB_PASS` in `.env`.
- **Import error `Invalid default value for 'date_created'`** — use the patched dump (section 5).
- **"error occurred" on create** — a `NOT NULL` column wasn't supplied. Check the
  backend terminal for the real SQL message; apply the defaults in section 5.
- **Images not showing** — run the path-normalization UPDATEs in section 5 and
  confirm files exist under `backend/public/images` and `backend/public/avatars`.
- **Port already in use** — stop old Node processes (`taskkill //F //IM node.exe`).
```
