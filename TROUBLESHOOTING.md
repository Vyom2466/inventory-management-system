# Troubleshooting Guide

## 🔍 Common Issues and Solutions

### Issue 1: "The 'uri' parameter to 'openUri()' must be a string"

**Cause:** `.env` file is missing or `MONGODB_URI` is not set

**Solution:**
1. Check if `backend/.env` file exists
2. If not, copy from `.env.example`:
   ```bash
   cd backend
   copy .env.example .env
   ```
3. Verify the content has:
   ```
   MONGODB_URI=mongodb://localhost:27017/inventory-management
   ```

---

### Issue 2: "Registration failed" or "Login failed"

**Possible Causes:**
1. MongoDB is not running
2. Backend server is not running
3. Frontend can't connect to backend

**Solution:**

**Step 1: Check MongoDB**
```bash
# Try to start MongoDB service
net start MongoDB

# If error, start mongod manually in a new terminal
mongod
```

**Step 2: Check Backend**
- Look at the backend terminal
- Should see: "MongoDB Connected: localhost"
- If not, restart backend after MongoDB is running

**Step 3: Check Frontend .env**
- Open `frontend/.env`
- Should have: `VITE_API_URL=http://localhost:5000/api`
- If changed, restart frontend server

---

### Issue 3: MongoDB Not Installed

**You have 2 options:**

**Option A: Install MongoDB Locally**

1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Edition
3. During installation, check "Install MongoDB as a Service"
4. After installation, verify:
   ```bash
   mongod --version
   ```

**Option B: Use MongoDB Atlas (Cloud - Easier)**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/inventory-management?retryWrites=true&w=majority
   ```
   (Replace username and password with your database user credentials)
7. In Atlas, go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

---

### Issue 4: Port Already in Use

**Error:** "Port 5000 is already in use" or "Port 3000 is already in use"

**Solution:**

**Find what's using the port:**
```bash
# For backend (port 5000)
netstat -ano | findstr :5000

# For frontend (port 3000)
netstat -ano | findstr :3000
```

**Kill the process:**
```bash
# Replace <PID> with the number from previous command
taskkill /PID <PID> /F
```

**Or change the port:**

For backend, edit `backend/.env`:
```
PORT=5001
```

For frontend, edit `frontend/vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001  // Change this
  }
});
```

---

### Issue 5: "Cannot find module" errors

**Error:** `Error: Cannot find module 'express'` or similar

**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rmdir /s /q node_modules
npm install

# Same for frontend
cd ../frontend
rmdir /s /q node_modules
npm install
```

---

### Issue 6: CORS Error in Browser

**Error:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**

1. Make sure backend is running on port 5000
2. Check `frontend/.env` has correct URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
3. After changing .env, restart frontend:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

---

### Issue 7: "Registration failed" but MongoDB is running

**Possible causes:**
1. Email already exists
2. Password too short
3. Backend validation error

**Solutions:**

**Try logging in instead:**
- Use demo account: admin@example.com / admin123

**Check backend terminal:**
- Look for error messages
- Common errors:
  - "User already exists" → Try different email
  - "Password must be at least 6 characters" → Use longer password
  - "Please provide a valid email" → Check email format

**Test with demo accounts first:**
```
Email: admin@example.com
Password: admin123
```

---

### Issue 8: Blank Dashboard or No Data

**Cause:** Database is empty, seed data not loaded

**Solution:**
```bash
cd backend
npm run seed
```

You should see:
```
Created 3 users
Created 10 products
Data seeded successfully!
```

---

### Issue 9: "nodemon: command not found"

**Solution:**
```bash
cd backend
npm install
```

Or run without nodemon:
```bash
node server.js
```

---

### Issue 10: Browser Shows Blank Page

**Causes:**
1. Frontend not compiled
2. JavaScript error
3. Wrong URL

**Solutions:**

**Check browser console:**
- Press F12 → Console tab
- Look for errors

**Verify URL:**
- Should be: `http://localhost:3000`
- Not: `http://localhost:5000` (that's the API)

**Clear cache and reload:**
- Press Ctrl+Shift+R (hard reload)

**Restart frontend:**
```bash
cd frontend
npm run dev
```

---

## 🔧 Advanced Troubleshooting

### Check if Backend API is Working

**Test API directly:**
1. Open browser
2. Go to: `http://localhost:5000`
3. Should see: `{"success":true,"message":"Inventory Management System API","version":"1.0.0"}`

**Test with curl:**
```bash
curl http://localhost:5000/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"admin123\"}"
```

### Check MongoDB Connection

**Verify MongoDB is running:**
```bash
# Check MongoDB service
sc query MongoDB

# Or try to connect with mongo shell
mongo
```

**Test connection string:**
```bash
cd backend
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

Should output: `mongodb://localhost:27017/inventory-management`

### Check Environment Variables

**Backend:**
```bash
cd backend
type .env
```

Should show:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory-management
JWT_SECRET=your_super_secret_jwt_key...
NODE_ENV=development
```

**Frontend:**
```bash
cd frontend
type .env
```

Should show:
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📋 Diagnostic Checklist

Run through this checklist to identify the issue:

- [ ] MongoDB is installed and running
- [ ] `backend/.env` file exists and has correct values
- [ ] `frontend/.env` file exists and has correct API URL
- [ ] Node.js version is 18+ (`node --version`)
- [ ] npm dependencies are installed in both backend and frontend
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] Backend terminal shows "MongoDB Connected"
- [ ] Browser can access `http://localhost:5000`
- [ ] Browser can access `http://localhost:3000`
- [ ] No CORS errors in browser console (F12)
- [ ] Seed data has been loaded (`npm run seed`)

---

## 🆘 Still Having Issues?

### Collect Information

1. **Backend terminal output** - Copy all text
2. **Frontend terminal output** - Copy all text
3. **Browser console errors** - Press F12, copy Console tab
4. **Your environment:**
   - Windows version
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - MongoDB version: `mongod --version` (if installed)

### Quick Reset

If nothing works, try a complete reset:

```bash
# Stop all terminals (Ctrl+C)

# Delete node_modules
cd backend
rmdir /s /q node_modules
cd ../frontend
rmdir /s /q node_modules

# Reinstall everything
cd ../backend
npm install
cd ../frontend
npm install

# Restart MongoDB
net start MongoDB

# Seed data
cd ../backend
npm run seed

# Start backend
npm run dev

# In new terminal, start frontend
cd frontend
npm run dev
```

---

## 🎯 Verification Steps

After fixing issues, verify everything works:

1. **MongoDB Running:**
   - Command: `net start MongoDB` or `mongod` running in terminal
   
2. **Backend Working:**
   - Terminal shows: "Server running on port 5000"
   - Terminal shows: "MongoDB Connected"
   - Browser shows API response at: http://localhost:5000

3. **Frontend Working:**
   - Terminal shows: "Local: http://localhost:3000"
   - Browser shows login page at: http://localhost:3000

4. **Login Working:**
   - Email: admin@example.com
   - Password: admin123
   - After login → Dashboard appears with statistics

5. **Data Present:**
   - Dashboard shows "Total Products: 10"
   - Products page shows 10 items
   - Can create new products

✅ **If all above work, your system is running correctly!**

---

**Last Updated:** Now  
**Need more help?** Check README.md for detailed documentation.
