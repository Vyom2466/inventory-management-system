# Quick Start Guide

Get the Inventory Management System running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need v18+)
node --version

# Check MongoDB (need v6+)
mongod --version

# Check npm
npm --version
```

If missing, install:
- **Node.js:** https://nodejs.org/
- **MongoDB:** https://www.mongodb.com/try/download/community

## Installation

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd inventory-management-system
```

### 2. Backend Setup (Terminal 1)
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` if needed (default settings work for local development):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory-management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**Start MongoDB** (if not running):
```bash
# macOS/Linux
mongod

# Windows (as Administrator)
net start MongoDB
```

**Seed Demo Data:**
```bash
npm run seed
```

**Start Backend:**
```bash
npm run dev
```

✅ Backend running at http://localhost:5000

### 3. Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
cp .env.example .env
```

Verify `.env` contents:
```env
VITE_API_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm run dev
```

✅ Frontend running at http://localhost:3000

## Login

Open http://localhost:3000 in your browser.

### Demo Accounts

**Admin** (Full Access)
- Email: `admin@example.com`
- Password: `admin123`

**Manager**
- Email: `manager@example.com`  
- Password: `manager123`

**Staff**
- Email: `staff@example.com`
- Password: `staff123`

## Quick Test Flow

1. **Login** with admin account
2. **Dashboard** → View statistics
3. **Products** → Create a new product
4. **Inventory** → Adjust stock for a product
5. **Orders** → Create an order
6. **Orders** → Confirm the order (watch stock decrease)
7. **Dashboard** → See updated statistics

## Common Issues

### Port Already in Use

**Backend (Port 5000):**
```bash
# Find and kill process
# macOS/Linux
lsof -ti:5000 | xargs kill

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Not Running

**Start MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Connection Refused

Check if backend is running and `.env` has correct URL:
```env
VITE_API_URL=http://localhost:5000/api
```

## API Testing

Import `Postman_Collection.json` to test API directly:
1. Open Postman
2. Import → `Postman_Collection.json`
3. Run "Login User" to get token
4. Test other endpoints

## Stopping the Application

Press `Ctrl+C` in both terminal windows.

## Next Steps

- Read `README.md` for full documentation
- See `DEPLOYMENT.md` for production deployment
- Check `SUBMISSION.md` for project details

## Support

If you encounter issues:
1. Check `README.md` troubleshooting section
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check terminal for error messages

---

**Happy coding! 🚀**
