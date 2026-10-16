# Setup Instructions for Reviewers

This repository contains a complete MERN stack Inventory Management System.

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/inventory-management-system.git
cd inventory-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file** in `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_at_least_32_characters
NODE_ENV=development
```

**Seed demo data:**
```bash
npm run seed
```

**Start backend:**
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

**Create `.env` file** in `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

**Start frontend:**
```bash
npm run dev
```

### 4. Access Application

Open browser: http://localhost:3000

**Demo Login Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

## 📚 Documentation

- **QUICKSTART.md** - Quick setup guide
- **README.md** - Complete documentation
- **DEPLOYMENT.md** - Production deployment guide
- **MONGODB_SETUP.md** - MongoDB setup instructions

## 🗄️ MongoDB Setup

You need MongoDB to run this application. Two options:

### Option A: MongoDB Atlas (Recommended)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `backend/.env`

### Option B: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use default connection string in `.env`

## 🎯 Features

- ✅ JWT Authentication
- ✅ Role-based Authorization
- ✅ Product Management (CRUD)
- ✅ Inventory Tracking
- ✅ Order Processing
- ✅ Dashboard Analytics
- ✅ Responsive Design

## 📧 Contact

For questions or issues, please open a GitHub issue.
