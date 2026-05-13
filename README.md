# TaskFlow — To-Do List Web Application

**Student:** Sonam Choki  
**Student ID:** 02240360  
**Assignment:** DSO101 — Assignment 1 (CI/CD)

---

## Project Overview

TaskFlow is a full-stack To-Do List web application with a React frontend, Node.js/Express backend, and PostgreSQL database. It is fully containerized with Docker and deployed on Render with automated CI/CD via GitHub.

---

## Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18, CSS3                |
| Backend   | Node.js, Express              |
| Database  | PostgreSQL (Render managed)   |
| Container | Docker, Nginx                 |
| Deploy    | Render.com                    |
| CI/CD     | GitHub + Render Blueprint     |

---

## Folder Structure

```
sonamchoki_02240360_DSO101_A1/
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── .env.example
│   ├── .env.production
│   └── .gitignore
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   ├── .env.production
│   └── .gitignore
├── render.yaml
├── .gitignore
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL installed locally (or use Render free DB)
- Docker Desktop installed

### Step 1 — Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/sonamchoki_02240360_DSO101_A1.git
cd sonamchoki_02240360_DSO101_A1
```

### Step 2 — Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env with your local DB credentials
npm install
npm start
```

### Step 3 — Frontend setup
```bash
cd frontend
cp .env.example .env
# .env already has: REACT_APP_API_URL=http://localhost:5000
npm install
npm start
```

The app will open at **http://localhost:3000**

### Screenshot — Project Folder Structure
> 📸 Insert screenshot of your folder structure in VS Code/Explorer here

### Screenshot — Running Frontend Locally
> 📸 Insert screenshot of http://localhost:3000 in browser here

### Screenshot — Running Backend Locally
> 📸 Insert screenshot of terminal showing "Server running on port 5000" here

---

## Docker Build

### Build Backend Image
```bash
cd backend
docker build -t YOUR_DOCKERHUB_USERNAME/be-todo:02240360 .
```

### Build Frontend Image
```bash
cd frontend
docker build -t YOUR_DOCKERHUB_USERNAME/fe-todo:02240360 .
```

### Screenshot — Docker Image Build Success
> 📸 Insert screenshot of terminal showing successful docker build output here

---

## Docker Hub Push

### Login to Docker Hub
```bash
docker login
# Enter your Docker Hub username and password
```

### Push Backend
```bash
docker push YOUR_DOCKERHUB_USERNAME/be-todo:02240360
```

### Push Frontend
```bash
docker push YOUR_DOCKERHUB_USERNAME/fe-todo:02240360
```

### Screenshot — Docker Hub Repositories
> 📸 Insert screenshot of hub.docker.com showing both be-todo and fe-todo repositories

---

## Render Deployment (Part A — Pre-built Docker Image)

### Step 1 — Create PostgreSQL Database on Render
1. Go to https://render.com → Sign in
2. Click **New +** → **PostgreSQL**
3. Name: `todo-db`, Plan: **Free**
4. Click **Create Database**
5. Copy the **Internal Database URL** or individual credentials

### Screenshot — PostgreSQL Database Created on Render
> 📸 Insert screenshot of Render PostgreSQL dashboard showing DB is active

### Step 2 — Deploy Backend Service
1. Click **New +** → **Web Service**
2. Choose **Deploy an existing image from a registry**
3. Image URL: `YOUR_DOCKERHUB_USERNAME/be-todo:02240360`
4. Name: `be-todo`, Region: Oregon, Plan: **Free**
5. Add Environment Variables:
   - `DB_HOST` → paste from Render DB dashboard
   - `DB_USER` → paste from Render DB dashboard
   - `DB_PASSWORD` → paste from Render DB dashboard
   - `DB_NAME` → paste from Render DB dashboard
   - `DB_PORT` → `5432`
   - `PORT` → `5000`
6. Click **Create Web Service**

### Step 3 — Deploy Frontend Service
1. Click **New +** → **Web Service**
2. Choose **Deploy an existing image from a registry**
3. Image URL: `YOUR_DOCKERHUB_USERNAME/fe-todo:02240360`
4. Name: `fe-todo`, Region: Oregon, Plan: **Free**
5. Add Environment Variable:
   - `REACT_APP_API_URL` → `https://be-todo.onrender.com`
6. Click **Create Web Service**

### Screenshot — Render Web Service Settings
> 📸 Insert screenshot of Render backend service showing environment variables

### Screenshot — Live Frontend URL
> 📸 Insert screenshot of the live frontend app running at https://fe-todo.onrender.com

### Screenshot — Live Backend API
> 📸 Insert screenshot of browser hitting https://be-todo.onrender.com/health showing `{"status":"ok"}`

---

## Blueprint CI/CD Deployment (Part B — GitHub + Render)

### Step 1 — Push Code to GitHub
```bash
# From the root of the project
git init
git add .
git commit -m "Initial commit: Todo app with Docker"
git remote add origin https://github.com/YOUR_USERNAME/sonamchoki_02240360_DSO101_A1.git
git push -u origin main
```

### Step 2 — Update render.yaml
Edit `render.yaml` and replace all placeholder DB credentials with your actual Render DB values.

### Step 3 — Connect Render Blueprint
1. Go to Render Dashboard → Click **New +** → **Blueprint**
2. Connect your GitHub account
3. Select your repo: `sonamchoki_02240360_DSO101_A1`
4. Render detects `render.yaml` automatically
5. Click **Apply**

Now every `git push` to `main` triggers a new build and deployment automatically.

### Screenshot — GitHub Repository
> 📸 Insert screenshot of your GitHub repo showing all files including render.yaml

### Screenshot — Successful Blueprint Deployment
> 📸 Insert screenshot of Render showing both be-todo and fe-todo services as "Live"

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot connect to server` in frontend | Check `REACT_APP_API_URL` is correct and backend is running |
| `password authentication failed` | Double-check DB credentials copied from Render |
| Docker build fails | Make sure you are inside the correct folder (backend/ or frontend/) before running docker build |
| Render service shows "Build Failed" | Check Render logs; make sure Dockerfile path in render.yaml is correct |
| Port already in use | Run `lsof -i :5000` and kill that process, or change PORT in .env |
