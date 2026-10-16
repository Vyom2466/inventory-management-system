# Simple Steps to Run the Application

## ✅ What I Fixed

1. Created `backend/.env` file with MongoDB connection
2. Created `frontend/.env` file with API URL
3. Both files are now properly configured

## 🚀 Follow These Steps EXACTLY

### Step 1: Start MongoDB

**Open Command Prompt as Administrator** and run:

```bash
net start MongoDB
```

**If you see "service name is invalid":**
- MongoDB is not installed
- **Solution:** Use MongoDB Atlas (cloud) instead
  1. Go to https://mongodb.com/cloud/atlas
  2. Create free account
  3. Create free cluster
  4. Get connection string
  5. Replace in `backend\.env` file

**OR** start mongod manually in a terminal:
```bash
mongod
```
(Keep this terminal running)

---

### Step 2: Open Terminal 1 - Start Backend

```bash
cd C:\Users\vyom\OneDrive\Desktop\baroda_project\inventory-management-system\backend

npm run seed
```

Wait for:
```
Created 3 users
Created 10 products
Data seeded successfully!
```

Then run:
```bash
npm run dev
```

✅ **Success when you see:**
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

**Keep this terminal running!**

---

### Step 3: Open Terminal 2 - Start Frontend

Open a **NEW** terminal (don't close the backend terminal)

```bash
cd C:\Users\vyom\OneDrive\Desktop\baroda_project\inventory-management-system\frontend

npm run dev
```

✅ **Success when you see:**
```
VITE ready in XXX ms

➜  Local:   http://localhost:3000/
```

**Keep this terminal running too!**

---

### Step 4: Open Browser

1. Open your browser (Chrome, Edge, Firefox)
2. Go to: **http://localhost:3000**
3. You should see the **Login page**

---

### Step 5: Login

Use admin account:
- **Email:** `admin@example.com`
- **Password:** `admin123`

Click **"Login"** button

✅ **Success:** You'll see the Dashboard with:
- Total Products: 10
- Low Stock Products: 3
- Statistics and charts

---

## 🎉 You're Done!

Now you can:
- View products (click "Products")
- Create new products (click "Add Product")
- Manage inventory (click "Inventory")
- Create orders (click "Orders")

---

## ❌ If Something Goes Wrong

### Problem: "Registration failed" or "Login failed"

**Check Backend Terminal:**
- Does it show "MongoDB Connected"?
- If NO → MongoDB is not running, go back to Step 1

### Problem: Backend shows error about "uri parameter"

**Solution:**
```bash
cd backend
type .env
```

Should show:
```
MONGODB_URI=mongodb://localhost:27017/inventory-management
```

If empty or different, use the file I created.

### Problem: Can't access http://localhost:3000

**Check:**
1. Is frontend terminal running?
2. Does it show "Local: http://localhost:3000"?
3. Try: http://127.0.0.1:3000

### Problem: Port already in use

**Kill the process:**
```bash
# For port 5000
netstat -ano | findstr :5000
taskkill /PID <NUMBER> /F

# For port 3000
netstat -ano | findstr :3000
taskkill /PID <NUMBER> /F
```

Then restart the servers.

---

## 📝 Quick Reference

**Backend runs on:** http://localhost:5000  
**Frontend runs on:** http://localhost:3000

**Demo Accounts:**
- Admin: admin@example.com / admin123
- Manager: manager@example.com / manager123
- Staff: staff@example.com / staff123

**Important Commands:**
```bash
# Seed data
cd backend
npm run seed

# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev
```

---

## 🔥 Ultra Quick Start (Use Batch Files)

**If you want even easier:**

1. Double-click `SEED_DATA.bat` (first time only)
2. Double-click `START_APP.bat` (every time you want to run)
3. Wait 10 seconds
4. Browser opens automatically
5. Login with admin@example.com / admin123

---

**For detailed troubleshooting, see TROUBLESHOOTING.md**
