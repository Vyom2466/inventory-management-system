# Inventory & Order Management System

A full-stack MERN application for managing inventory, products, and customer orders with authentication and role-based access control.

## Features

### Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Role-based access control (Admin, Manager, Staff)
- Protected routes on both frontend and backend
- Automatic token expiration handling

### Product Management
- Create, read, update, and delete products
- Product fields: name, SKU, description, category, price, stock, timestamps
- Search by product name or SKU
- Filter by category and stock status
- Low-stock alerts and tracking
- Unique SKU validation
- Non-negative price and stock validation

### Inventory & Stock Operations
- Increase or decrease stock with reason tracking
- Complete inventory movement history
- Prevents negative stock quantities
- Records: product, quantity change, reason, user, timestamp
- Database transactions for stock consistency

### Customer Orders
- Create orders with multiple items
- Order statuses: Pending, Confirmed, Shipped, Cancelled
- Server-side total calculation for security
- Stock validation before order confirmation
- Stock deduction on order confirmation
- Stock restoration on order cancellation
- Order history and filtering by status

### Dashboard
- Total products count
- Low-stock products alert
- Total orders and orders by status
- Total revenue calculation
- Recent orders display
- Top-selling products

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Express Validator for request validation
- CORS enabled

### Frontend
- React 18 with TypeScript
- Vite for fast development
- React Router for navigation
- Axios for API calls
- React Toastify for notifications
- Responsive CSS design

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### For Production Mode:
- MongoDB (v6 or higher) - See options below

### For Demo Mode (No MongoDB):
- Nothing else needed! See [INSTANT_DEMO.txt](INSTANT_DEMO.txt)

---

## 🎭 Quick Start - Demo Mode (No MongoDB!)

**Want to run immediately without MongoDB setup?**

### Option 1: One-Click Start (Windows)
```bash
Double-click: START_DEMO_MODE.bat
```

### Option 2: Manual Commands
```bash
# Backend (Demo Mode)
cd backend
npm run demo

# Frontend (New Terminal)
cd frontend
npm run dev

# Browser
http://localhost:3000
```

✅ **No MongoDB, No Login, No Setup!**

Features:
- ✅ All features work
- ✅ Sample data included
- ✅ Perfect for demos
- ❌ Data not saved (resets on restart)

See [DEMO_MODE_GUIDE.md](DEMO_MODE_GUIDE.md) for details.

---

## 🏢 Production Mode Setup (With MongoDB)

For real deployment with authentication and data persistence:

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd inventory-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Never commit the `.env` file. Use `.env.example` as a template.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Demo Data

```bash
cd backend
npm run seed
```

This will create demo users and products. Demo account credentials:

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Manager Account:**
- Email: manager@example.com
- Password: manager123

**Staff Account:**
- Email: staff@example.com
- Password: staff123

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Server will run on http://localhost:5000

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Application will run on http://localhost:3000

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "staff"
}
```

#### POST /api/auth/login
Login user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "staff",
    "token": "jwt_token_here"
  }
}
```

#### GET /api/auth/me
Get current user (requires authentication)

### Product Endpoints

#### GET /api/products
Get all products with filtering

**Query Parameters:**
- `search`: Search by name or SKU
- `category`: Filter by category
- `stockStatus`: Filter by stock status (low, out, in)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### POST /api/products
Create new product (requires authentication)

**Request Body:**
```json
{
  "name": "Laptop",
  "sku": "LAPTOP-001",
  "description": "High-performance laptop",
  "category": "Electronics",
  "price": 999.99,
  "stock": 10,
  "lowStockThreshold": 5
}
```

#### PUT /api/products/:id
Update product (requires authentication)

#### DELETE /api/products/:id
Delete product (Admin/Manager only)

#### GET /api/products/low-stock/list
Get low-stock products

#### GET /api/products/categories/list
Get all product categories

### Inventory Endpoints

#### POST /api/inventory/adjust
Adjust product stock (requires authentication)

**Request Body:**
```json
{
  "productId": "product_id_here",
  "quantityChange": 10,
  "reason": "Purchase order received"
}
```

Note: Use negative numbers to decrease stock

#### GET /api/inventory/movements
Get all inventory movements

**Query Parameters:**
- `productId`: Filter by product
- `page`: Page number
- `limit`: Items per page

### Order Endpoints

#### POST /api/orders
Create new order (requires authentication)

**Request Body:**
```json
{
  "customerName": "Jane Smith",
  "customerContact": "jane@example.com",
  "items": [
    {
      "product": "product_id_here",
      "quantity": 2
    }
  ]
}
```

Note: Total is calculated on the server

#### GET /api/orders
Get all orders

**Query Parameters:**
- `status`: Filter by status
- `search`: Search by order number or customer name
- `page`: Page number
- `limit`: Items per page

#### GET /api/orders/:id
Get order details

#### PATCH /api/orders/:id/status
Update order status (requires authentication)

**Request Body:**
```json
{
  "status": "Confirmed"
}
```

Valid statuses: Pending, Confirmed, Shipped, Cancelled

### Dashboard Endpoints

#### GET /api/dashboard/stats
Get dashboard statistics (requires authentication)

## Database Models

### User Model
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (admin, manager, staff)
- timestamps: createdAt, updatedAt

### Product Model
- name: String (required)
- sku: String (required, unique, indexed)
- description: String (required)
- category: String (required, indexed)
- price: Number (required, min: 0)
- stock: Number (required, min: 0, indexed)
- lowStockThreshold: Number (default: 10)
- timestamps: createdAt, updatedAt

### InventoryMovement Model
- product: ObjectId (ref: Product, indexed)
- quantityChange: Number (required)
- reason: String (required)
- user: ObjectId (ref: User, indexed)
- previousStock: Number (required)
- newStock: Number (required)
- timestamps: createdAt

### Order Model
- orderNumber: String (required, unique, indexed)
- customerName: String (required)
- customerContact: String (required)
- items: Array of OrderItems
- totalAmount: Number (required)
- status: String (Pending, Confirmed, Shipped, Cancelled, indexed)
- createdBy: ObjectId (ref: User)
- timestamps: createdAt, updatedAt

## Key Features Implementation

### Stock Consistency
- MongoDB transactions used for stock operations
- Prevents race conditions in concurrent stock updates
- Atomic operations for order confirmation and cancellation

### Server-Side Validation
- All totals calculated on server
- Stock availability checked before order confirmation
- Request validation using express-validator

### Authorization
- JWT tokens with 30-day expiration
- Role-based route protection
- Frontend automatically redirects on token expiration

### Error Handling
- Centralized error handler middleware
- Consistent error responses
- User-friendly error messages on frontend

## Security Best Practices

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Passwords never returned in API responses

2. **JWT Security**
   - Secure secret key (change in production)
   - Token expiration enforced
   - Tokens stored in localStorage (consider httpOnly cookies for production)

3. **Input Validation**
   - Server-side validation on all endpoints
   - Mongoose schema validation
   - Sanitization of user inputs

4. **Environment Variables**
   - Sensitive data in .env files
   - .env files gitignored
   - .env.example provided for reference

## Testing

### Manual Testing Flow

1. **Authentication**
   - Register a new user
   - Login with credentials
   - Verify protected routes

2. **Product Management**
   - Create a product
   - Search and filter products
   - Update product details
   - View low-stock alerts

3. **Inventory Operations**
   - Adjust stock (increase/decrease)
   - View inventory history
   - Verify stock changes reflected

4. **Order Processing**
   - Create an order with multiple items
   - Verify stock validation
   - Confirm order (stock deduction)
   - View order details
   - Cancel order (stock restoration)

5. **Dashboard**
   - View statistics
   - Check recent orders
   - Verify top products

## Deployment

### Backend Deployment (Example: Render, Railway, Heroku)

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secure random string
   - `NODE_ENV`: production
   - `PORT`: (usually auto-assigned)

4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`

### Frontend Deployment (Example: Vercel, Netlify)

1. Create a new site
2. Connect your GitHub repository
3. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. Set environment variable:
   - `VITE_API_URL`: Your deployed backend URL

### Database (MongoDB Atlas)

1. Create a free MongoDB Atlas cluster
2. Whitelist your deployment IP addresses
3. Create database user with password
4. Get connection string and update `MONGODB_URI`

## Production Considerations

1. **Security Enhancements**
   - Use httpOnly cookies for JWT tokens
   - Implement rate limiting
   - Add CSRF protection
   - Enable HTTPS only
   - Helmet.js for security headers

2. **Performance Optimization**
   - Add Redis for caching
   - Implement pagination on all list endpoints
   - Add database indexes for frequently queried fields
   - Compress API responses

3. **Monitoring & Logging**
   - Implement structured logging
   - Set up error tracking (Sentry)
   - Monitor API performance
   - Database query optimization

4. **Scalability**
   - Horizontal scaling with load balancer
   - Database replication
   - CDN for static assets

## Known Limitations

- No email verification for user registration
- No password reset functionality
- No file upload for product images
- Basic role-based access (could be more granular)
- No real-time updates (WebSocket)
- Limited analytics and reporting

## Future Enhancements

- [ ] Product images with file upload
- [ ] Advanced search with Elasticsearch
- [ ] Email notifications for low stock
- [ ] Order invoice generation (PDF)
- [ ] Barcode/QR code support
- [ ] Multi-warehouse support
- [ ] Advanced reporting and analytics
- [ ] Export data to CSV/Excel
- [ ] Mobile app with React Native
- [ ] Real-time updates with Socket.io

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify MONGODB_URI in .env file
- Check MongoDB Atlas whitelist if using cloud

### Port Already in Use
- Kill process using port: `lsof -ti:5000 | xargs kill` (Mac/Linux)
- Change PORT in backend .env file

### CORS Errors
- Verify frontend URL in backend CORS configuration
- Check API_URL in frontend .env

### Authentication Issues
- Clear localStorage and re-login
- Verify JWT_SECRET is consistent
- Check token expiration

## License

MIT

## Support

For issues and questions, please create an issue in the GitHub repository.

---

**Developed by:** [Your Name]
**Last Updated:** October 2026
