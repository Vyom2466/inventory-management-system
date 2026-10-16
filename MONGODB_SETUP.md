# MongoDB Setup Guide

You have **2 options** to set up MongoDB. Choose one:

## Option 1: MongoDB Atlas (Cloud) - **RECOMMENDED** ⭐

**Advantages:**
- ✅ No installation needed
- ✅ Free forever (M0 tier)
- ✅ Works immediately
- ✅ Accessible from anywhere
- ✅ Automatic backups

### Steps:

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click "Try Free"

2. **Create Account**
   - Sign up with email or Google
   - Verify your email

3. **Create Cluster**
   - Click "Build a Database"
   - Choose **FREE** tier (M0)
   - Select region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

4. **Create Database User**
   - Go to "Database Access" (left menu)
   - Click "Add New Database User"
   - Username: `admin`
   - Password: `admin123` (or your own)
   - **Note:** Remember these credentials!
   - Click "Add User"

5. **Allow Network Access**
   - Go to "Network Access" (left menu)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"

6. **Get Connection String**
   - Go to "Database" (left menu)
   - Click "Connect" button on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Should look like:
     ```
     mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

7. **Update Backend .env**
   - Open: `backend\.env`
   - Replace `MONGODB_URI` with your connection string
   - Replace `<password>` with your actual password
   - Add database name:
   
   **Before:**
   ```
   MONGODB_URI=mongodb://localhost:27017/inventory-management
   ```
   
   **After:**
   ```
   MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/inventory-management?retryWrites=true&w=majority
   ```

8. **Test Connection**
   ```bash
   cd backend
   npm run seed
   ```
   
   ✅ **Success:** Should see "MongoDB Connected" and create demo data

---

## Option 2: MongoDB Local Installation

**Advantages:**
- ✅ Works offline
- ✅ Faster (no network latency)

**Disadvantages:**
- ❌ Requires installation
- ❌ Needs to be started manually
- ❌ Only accessible from this computer

### Steps:

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (7.0+)
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - ✅ **Check:** "Install MongoDB as a Service"
   - ✅ **Check:** "Install MongoDB Compass" (optional GUI)
   - Click "Next" → "Install"

3. **Verify Installation**
   
   Open Command Prompt:
   ```bash
   mongod --version
   ```
   
   Should show version information.

4. **Start MongoDB Service**
   
   Open Command Prompt as Administrator:
   ```bash
   net start MongoDB
   ```
   
   ✅ **Success:** "The MongoDB service was started successfully."

5. **Test Connection**
   ```bash
   cd backend
   npm run seed
   ```
   
   ✅ **Success:** Should see "MongoDB Connected: localhost" and create demo data

### Starting MongoDB Every Time

**Method 1: Automatic (Service)**
- If installed as service, MongoDB starts automatically on boot
- To check: `net start MongoDB`

**Method 2: Manual**
```bash
mongod
```
(Keep the terminal running)

---

## 🔍 Troubleshooting

### Issue: "MongoDB service is not installed"

**Solution:** Install MongoDB or use MongoDB Atlas (Option 1)

### Issue: "Authentication failed" with Atlas

**Solution:**
1. Check username and password in connection string
2. Verify database user exists in Atlas
3. Check Network Access allows your IP

### Issue: "Connection timeout" with Atlas

**Solution:**
1. Check your internet connection
2. Verify Network Access in Atlas
3. Try: "Allow Access from Anywhere" (0.0.0.0/0)

### Issue: Local MongoDB won't start

**Solution 1:** Start as service
```bash
net start MongoDB
```

**Solution 2:** Start manually
```bash
mongod --dbpath C:\data\db
```

(Create folder first: `mkdir C:\data\db`)

### Issue: "Address already in use"

**Solution:** Another MongoDB instance is running
```bash
# Find process
netstat -ano | findstr :27017

# Kill process (replace PID)
taskkill /PID <PID> /F
```

---

## ✅ Verification

After setup, verify MongoDB is working:

1. **Check Connection**
   ```bash
   cd backend
   node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
   ```
   
   Should show your connection string.

2. **Test with Seed Script**
   ```bash
   npm run seed
   ```
   
   Should see:
   - "MongoDB Connected"
   - "Created 3 users"
   - "Created 10 products"
   - "Data seeded successfully!"

3. **Start Backend**
   ```bash
   npm run dev
   ```
   
   Should see:
   - "Server running in development mode on port 5000"
   - "MongoDB Connected"

✅ **If all above work, MongoDB is set up correctly!**

---

## 🆚 Which Option Should I Choose?

### Choose MongoDB Atlas (Cloud) if:
- ✅ You want the easiest setup
- ✅ You want to access from multiple computers
- ✅ You don't want to manage installation
- ✅ You want automatic backups
- ✅ You plan to deploy to production later

### Choose Local MongoDB if:
- ✅ You want to work offline
- ✅ You prefer everything on your computer
- ✅ You're comfortable with installations
- ✅ You want faster local development

**Recommendation:** Use **MongoDB Atlas** - it's easier and works perfectly for development and production!

---

## 📝 Summary

**For MongoDB Atlas:**
1. Create account → Create cluster → Get connection string
2. Update `backend\.env` with connection string
3. Run `npm run seed`
4. Done! ✅

**For Local MongoDB:**
1. Download → Install → Start service
2. Keep `backend\.env` as is (localhost)
3. Run `npm run seed`
4. Done! ✅

---

**Next:** After MongoDB is set up, follow **STEPS_TO_RUN.md** to start the application!
