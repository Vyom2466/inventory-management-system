# Quick Reference Card

## 🚀 One-Time Setup

```bash
# 1. Setup MongoDB (choose one):
#    - MongoDB Atlas: See MONGODB_SETUP.md
#    - Local: net start MongoDB

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Create demo data
cd backend && npm run seed
```

---

## 🎯 Every Time You Want to Run

### Method 1: Double-Click Batch Files (Windows)
1. `SEED_DATA.bat` (first time only)
2. `START_APP.bat` (opens both servers + browser)

### Method 2: Manual Commands

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

**Browser:**
```
http://localhost:3000
```

---

## 🔐 Login Credentials

| Role    | Email                    | Password   |
|---------|--------------------------|------------|
| Admin   | admin@example.com        | admin123   |
| Manager | manager@example.com      | manager123 |
| Staff   | staff@example.com        | staff123   |

---

## 🌐 URLs

| Service  | URL                      | Purpose           |
|----------|--------------------------|-------------------|
| Frontend | http://localhost:3000    | User interface    |
| Backend  | http://localhost:5000    | API server        |
| API      | http://localhost:5000/api| API endpoints     |

---

## 📁 Important Files

| File                    | Purpose                          |
|-------------------------|----------------------------------|
| `backend/.env`          | Backend configuration (MongoDB)  |
| `frontend/.env`         | Frontend configuration (API URL) |
| `STEPS_TO_RUN.md`       | Detailed run instructions        |
| `TROUBLESHOOTING.md`    | Fix common issues                |
| `MONGODB_SETUP.md`      | MongoDB installation guide       |

---

## 🛠️ Common Commands

### Backend
```bash
cd backend

npm install              # Install dependencies
npm run dev              # Start development server
npm run seed             # Create demo data
npm start                # Start production server
```

### Frontend
```bash
cd frontend

npm install              # Install dependencies
npm run dev              # Start development server
npm run build            # Build for production
```

### MongoDB
```bash
net start MongoDB        # Start service (Windows)
mongod                   # Start manually
mongo                    # Open MongoDB shell
```

---

## 🔧 Quick Fixes

### Backend won't start
```bash
# Check .env file exists
cd backend
type .env

# Should show MongoDB connection string
# If empty, see FIX_AND_RUN.md
```

### Frontend can't connect
```bash
# Check .env file
cd frontend
type .env

# Should show: VITE_API_URL=http://localhost:5000/api
```

### MongoDB not running
```bash
# Start MongoDB service
net start MongoDB

# OR start manually
mongod
```

### Port already in use
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### Login/Register fails
```bash
# 1. Check backend terminal shows:
#    "MongoDB Connected"

# 2. Use demo account instead:
#    admin@example.com / admin123

# 3. Re-seed if needed:
cd backend
npm run seed
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `POST /api/inventory/adjust` - Adjust stock
- `GET /api/inventory/movements` - List movements

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update status

### Dashboard
- `GET /api/dashboard/stats` - Get statistics

---

## 🎨 Main Features

### Dashboard
- View total products, orders, revenue
- See low-stock alerts
- Recent orders list
- Top selling products

### Products
- Create, edit, delete products
- Search by name or SKU
- Filter by category and stock
- View low-stock products

### Inventory
- Adjust stock (increase/decrease)
- View complete history
- Track reasons and users
- Prevent negative stock

### Orders
- Create multi-item orders
- Confirm orders (deducts stock)
- Cancel orders (restores stock)
- Track order status
- View order details

---

## ✅ Success Indicators

### Backend Running ✅
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

### Frontend Running ✅
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

### Login Successful ✅
- Redirects to Dashboard
- Shows user name in navbar
- Displays statistics

### Data Loaded ✅
- Dashboard shows: Total Products: 10
- Products page shows 10 items
- Can navigate all pages

---

## 🚨 Emergency Reset

```bash
# 1. Stop everything (Ctrl+C in terminals)

# 2. Delete node_modules
cd backend
rmdir /s /q node_modules

cd ../frontend
rmdir /s /q node_modules

# 3. Reinstall
cd backend
npm install

cd ../frontend
npm install

# 4. Restart MongoDB
net start MongoDB

# 5. Re-seed data
cd backend
npm run seed

# 6. Start servers
# Backend terminal:
npm run dev

# Frontend terminal:
cd frontend
npm run dev
```

---

## 📱 Test Flow

1. **Login** → Dashboard appears
2. **Products** → Create new product
3. **Inventory** → Adjust stock
4. **Orders** → Create order
5. **Orders** → Confirm order (stock decreases)
6. **Dashboard** → Statistics updated

---

## 📚 Documentation Files

1. **STEPS_TO_RUN.md** - Simple step-by-step guide
2. **FIX_AND_RUN.md** - What I fixed + how to run
3. **TROUBLESHOOTING.md** - Detailed problem solving
4. **MONGODB_SETUP.md** - MongoDB installation
5. **QUICK_REFERENCE.md** - This file
6. **README.md** - Complete documentation

---

## 🎯 Next Steps After Running

1. Explore all features
2. Create test products
3. Process test orders
4. View analytics
5. Deploy to production (see DEPLOYMENT.md)

---

## 💡 Pro Tips

- Use `admin@example.com` for full access
- Check browser console (F12) for errors
- Keep both terminals running
- Don't commit `.env` files
- Use MongoDB Atlas for easy setup
- Read TROUBLESHOOTING.md if stuck

---

**Need Help?**
1. Check TROUBLESHOOTING.md
2. Review terminal output
3. Verify checklist above
4. Check browser console (F12)

**Quick Start:**
1. Start MongoDB
2. Run `START_APP.bat`
3. Login: admin@example.com / admin123
4. Done! 🎉

---

**Last Updated:** Now  
**Keep this card open while running the app!**
