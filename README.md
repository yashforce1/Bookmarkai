<<<<<<< HEAD
# BookmarkAI 

A full-stack bookmark management application with AI-powered features.

## Stack

- Backend: Node.js, Express, TypeScript, MongoDB
- Frontend: React, TypeScript, Vite

## Prerequisites

- Node.js v18+
- MongoDB
- npm

## Installation

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Configure Environment

Backend `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/bookmarkai
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

### 3. Start MongoDB

```bash
# Using systemd
sudo systemctl start mongod

# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Development

### Start Backend

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:3000`

### Start Frontend

```bash
cd frontend
npm run dev
```

Client runs on `http://localhost:5173`

## API Endpoints

```
POST /api/v1/signup    User registration
POST /api/v1/signin    User authentication
```

## Production Build (MERN Project)

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Project Structure

```
BookmarkAI/
├── backend/          Express API server
│   ├── src/
│   ├── dist/
│   └── package.json
└── frontend/         React application
    ├── src/
    ├── public/
    └── package.json
```
=======
# devops-automate
>>>>>>> 17520cde30b8a2408198bdaf8f9dcf0582cf2a89
