# Fix and Run Guide

## ✅ Issues Fixed

1. **Created `.env` file in backend** - MongoDB connection string was undefined
2. **Created `.env` file in frontend** - API URL configuration
3. **Environment variables properly configured**

## 🚀 Steps to Run the Application

### Step 1: Ensure MongoDB is Running

**Check if MongoDB is running:**

```bash
# Windows - Open Command Prompt as Administrator and run:
net start MongoDB

# If MongoDB service doesn't exist, start mongod manually:
mongod
```

**If you see "service name is invalid" or MongoDB is not installed:**

You have two options:

#### Option A: Install MongoDB locally
1. Download MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Install it
3. Start the service: `net start MongoDB`

#### Option B: Use MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster (M0)
4. Get your connection string
5. Update `backend\.env` file with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory-management?retryWrites=true&w=majority
   ```

### Step 2: Install Dependencies (if not done)

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 3: Seed Demo Data

```bash
cd backend
npm run seed
```

You should see:
```
MongoDB Connected: localhost
Cleared existing data
Created 3 users
Created 10 products

Demo Accounts:
===============
Admin:
  Email: admin@example.com
  Password: admin123

Manager:
  Email: manager@example.com
  Password: manager123

Staff:
  Email: staff@example.com
  Password: staff123

Data seeded successfully!
```

### Step 4: Start Backend Server

**In Terminal 1:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

**Keep this terminal running!**

### Step 5: Start Frontend Server

**In Terminal 2 (new terminal):**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE ready in X ms

  ➜  Local:   http://localhost:3000/
```

**Keep this terminal running!**

### Step 6: Access the Application

1. Open your browser
2. Go to: **http://localhost:3000**
3. You'll see the Login page

### Step 7: Login

Use the demo admin account:
- **Email:** `admin@example.com`
- **Password:** `admin123`

Click "Login" button.

If successful, you'll be redirected to the Dashboard!

## 🐛 Troubleshooting

### Issue: "Registration failed" or "Login failed"

**Check Backend Terminal:**
- Should show: `MongoDB Connected: localhost`
- If it shows connection error, MongoDB is not running

**Solution:**
```bash
# Start MongoDB
net start MongoDB

# Or if that doesn't work:
mongod
```

Then restart backend:
```bash
cd backend
npm run dev
```

### Issue: "Cannot connect to server" or Network Error

**Check:**
1. Backend is running on port 5000
2. Frontend `.env` has correct API URL: `VITE_API_URL=http://localhost:5000/api`

**Solution:**
```bash
# Stop frontend (Ctrl+C)
# Restart frontend
cd frontend
npm run dev
```

### Issue: Port 5000 or 3000 already in use

**Find and kill the process:**

**Windows:**
```bash
# For port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# For port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

Then start the servers again.

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rmdir /s node_modules
npm install

cd ../frontend
rmdir /s node_modules
npm install
```

## ✅ Verification Checklist

After following all steps, verify:

- [ ] MongoDB is running (check with `mongod` or MongoDB service)
- [ ] Backend terminal shows "MongoDB Connected"
- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Local: http://localhost:3000"
- [ ] Browser opens http://localhost:3000 and shows Login page
- [ ] You can login with admin@example.com / admin123
- [ ] After login, you see the Dashboard with statistics

## 🎯 What You Should See

### 1. Login Page
- Email and Password fields
- Register link
- Login button

### 2. After Successful Login - Dashboard
- Navbar with menu items (Dashboard, Products, Inventory, Orders)
- Statistics cards showing:
  - Total Products: 10
  - Low Stock Products: 3
  - Total Orders: 0
  - Total Revenue: $0.00
- Status breakdown (Pending, Confirmed, Shipped, Cancelled)
- Recent Orders section
- Top Products section

### 3. Try These Actions:
1. **Click "Products"** - See 10 demo products
2. **Click "Add Product"** - Create a new product
3. **Click "Inventory"** - Adjust stock for a product
4. **Click "Orders"** - Create a test order
5. **Go back to Dashboard** - See updated statistics

## 📝 Important Files Created

1. **backend/.env** - Backend environment variables
   - MongoDB connection string
   - JWT secret key
   
2. **frontend/.env** - Frontend environment variables
   - API URL pointing to backend

**Note:** These `.env` files are gitignored and won't be committed to GitHub (for security).

## 🔐 Demo Accounts

All passwords are: `password123` suffix with role name

- **admin@example.com** / admin123 (Full access)
- **manager@example.com** / manager123 (Manager access)
- **staff@example.com** / staff123 (Staff access)

## 🎉 Success!

If you can login and see the dashboard, everything is working correctly! 

You can now:
- Create products
- Manage inventory
- Process orders
- View analytics

---

**Need help?** Check the terminal output for error messages and refer to the troubleshooting section above.
