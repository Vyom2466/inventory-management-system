# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Frontend (TypeScript + Vite)                       │  │
│  │  ├─ Authentication (Context API)                          │  │
│  │  ├─ React Router (Protected Routes)                       │  │
│  │  ├─ Axios HTTP Client                                     │  │
│  │  └─ Responsive UI Components                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js REST API                                      │  │
│  │  ├─ CORS Middleware                                       │  │
│  │  ├─ JWT Authentication                                    │  │
│  │  ├─ Request Validation                                    │  │
│  │  └─ Error Handler                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Auth      │  │  Product    │  │  Inventory  │            │
│  │ Controller  │  │ Controller  │  │ Controller  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │   Order     │  │  Dashboard  │                              │
│  │ Controller  │  │ Controller  │                              │
│  └─────────────┘  └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Mongoose ODM                                             │  │
│  │  ├─ User Model                                            │  │
│  │  ├─ Product Model                                         │  │
│  │  ├─ Order Model                                           │  │
│  │  └─ InventoryMovement Model                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MongoDB                                                  │  │
│  │  ├─ users collection                                      │  │
│  │  ├─ products collection (indexed: SKU, category, stock)  │  │
│  │  ├─ orders collection (indexed: orderNumber, status)     │  │
│  │  └─ inventorymovements collection (indexed: product)     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

### 1. Authentication Flow

```
User Login Request
    ↓
[Frontend] → POST /api/auth/login
    ↓
[Auth Controller] → Validate credentials
    ↓
[User Model] → Query database
    ↓
[bcrypt] → Compare password hash
    ↓
[JWT] → Generate token
    ↓
[Frontend] → Store token in localStorage
    ↓
[Context API] → Update auth state
    ↓
[Router] → Redirect to dashboard
```

### 2. Product Creation Flow

```
User Creates Product
    ↓
[Frontend Form] → Validate input
    ↓
[API Client] → POST /api/products + JWT token
    ↓
[Auth Middleware] → Verify token
    ↓
[Validation Middleware] → Validate request body
    ↓
[Product Controller] → Process request
    ↓
[Product Model] → Create document
    ↓
[MongoDB] → Insert with unique SKU check
    ↓
[Response] → Return created product
    ↓
[Frontend] → Update UI, show success toast
```

### 3. Order Processing Flow (with Stock Management)

```
User Creates Order
    ↓
[Frontend] → POST /api/orders
    ↓
[Auth Middleware] → Verify token
    ↓
[Order Controller] → Start MongoDB session
    ↓
[Transaction Start]
    ↓
    ├─ Validate each order item
    ├─ Check product stock availability
    ├─ Calculate total on server
    └─ Create order document
    ↓
[Transaction Commit]
    ↓
[Response] → Return order with items populated
    ↓
User Confirms Order
    ↓
[Frontend] → PATCH /api/orders/:id/status
    ↓
[Order Controller] → Start MongoDB session
    ↓
[Transaction Start]
    ↓
    ├─ Update order status to "Confirmed"
    ├─ Deduct stock from each product
    └─ Create inventory movement records
    ↓
[Transaction Commit] → All or nothing
    ↓
[Response] → Return updated order
    ↓
[Frontend] → Refresh orders list
```

### 4. Stock Adjustment Flow

```
User Adjusts Stock
    ↓
[Frontend] → POST /api/inventory/adjust
    ↓
[Auth Middleware] → Verify token
    ↓
[Inventory Controller] → Start MongoDB session
    ↓
[Transaction Start]
    ↓
    ├─ Get current product stock
    ├─ Calculate new stock (prevent negative)
    ├─ Update product.stock
    └─ Create inventory movement record
    ↓
[Transaction Commit]
    ↓
[Response] → Return product and movement
    ↓
[Frontend] → Update inventory history
```

## Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: admin/manager/staff),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  _id: ObjectId,
  name: String,
  sku: String (unique, indexed),
  description: String,
  category: String (indexed),
  price: Number (min: 0),
  stock: Number (min: 0, indexed),
  lowStockThreshold: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique, indexed),
  customerName: String,
  customerContact: String,
  items: [
    {
      product: ObjectId (ref: Product),
      quantity: Number,
      price: Number,
      subtotal: Number
    }
  ],
  totalAmount: Number,
  status: String (enum, indexed),
  createdBy: ObjectId (ref: User),
  createdAt: Date (indexed),
  updatedAt: Date
}
```

### InventoryMovement Schema
```javascript
{
  _id: ObjectId,
  product: ObjectId (ref: Product, indexed),
  quantityChange: Number,
  reason: String,
  user: ObjectId (ref: User),
  previousStock: Number,
  newStock: Number,
  createdAt: Date (indexed)
}
```

## Security Architecture

### Authentication Layer
```
┌────────────────────────────────────────┐
│  Client Request                        │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Extract JWT from Authorization header │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Verify token signature                │
│  Check expiration                      │
└────────────────────────────────────────┘
              ↓
        Valid? ─────No──→ 401 Unauthorized
              ↓
             Yes
              ↓
┌────────────────────────────────────────┐
│  Load user from database               │
│  Attach user to request object         │
└────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────┐
│  Check role authorization (if needed)  │
└────────────────────────────────────────┘
              ↓
        Allowed? ───No──→ 403 Forbidden
              ↓
             Yes
              ↓
┌────────────────────────────────────────┐
│  Process request                       │
└────────────────────────────────────────┘
```

### Password Hashing
```
User Registration/Password Change
    ↓
Plain text password
    ↓
bcrypt.genSalt(10)
    ↓
Generate random salt
    ↓
bcrypt.hash(password, salt)
    ↓
Store hashed password in database

Login Verification
    ↓
User submits password
    ↓
Fetch hashed password from database
    ↓
bcrypt.compare(submitted, stored)
    ↓
Return boolean
```

## Transaction Management

### MongoDB Transaction Flow
```javascript
// Stock adjustment with transaction
const session = await mongoose.startSession();
session.startTransaction();

try {
  // 1. Get product with session
  const product = await Product.findById(id).session(session);
  
  // 2. Update stock
  product.stock = newStock;
  await product.save({ session });
  
  // 3. Create movement record
  await InventoryMovement.create([{
    product: productId,
    quantityChange: change,
    // ... other fields
  }], { session });
  
  // 4. Commit transaction
  await session.commitTransaction();
  
} catch (error) {
  // 5. Rollback on error
  await session.abortTransaction();
  throw error;
  
} finally {
  session.endSession();
}
```

## API Request/Response Flow

### Successful Request
```
Client
  ├─→ Request Headers
  │   ├─ Authorization: Bearer <token>
  │   └─ Content-Type: application/json
  │
  ├─→ Request Body (if POST/PUT/PATCH)
  │   └─ { validated JSON data }
  │
  ↓
Server Processing
  ├─ Authentication middleware
  ├─ Validation middleware
  ├─ Controller logic
  └─ Database operations
  ↓
Response
  ├─→ Status Code: 200/201
  └─→ Body: {
        success: true,
        data: { ... }
      }
```

### Error Response
```
Client Request
  ↓
Server Processing
  ├─ Error detected
  │  (validation, auth, database, etc.)
  ↓
Error Handler Middleware
  ├─ Log error
  ├─ Determine error type
  └─ Format response
  ↓
Response
  ├─→ Status Code: 400/401/403/404/500
  └─→ Body: {
        success: false,
        message: "Error description"
      }
```

## Deployment Architecture

### Production Setup
```
┌─────────────────────────────────────────────────────┐
│  CDN (Vercel/Netlify)                                │
│  └─ Static React Build                               │
└─────────────────────────────────────────────────────┘
                    ▼ HTTPS
┌─────────────────────────────────────────────────────┐
│  Load Balancer (optional)                            │
└─────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────┐
│  Backend Server (Render/Railway)                     │
│  ├─ Node.js + Express                                │
│  ├─ PM2 Process Manager                              │
│  └─ Environment Variables                            │
└─────────────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────────┐
│  MongoDB Atlas Cluster                               │
│  ├─ Primary Node                                     │
│  ├─ Secondary Nodes (Replication)                    │
│  └─ Automated Backups                                │
└─────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
```
Load Balancer
    ├─→ Backend Instance 1 ─┐
    ├─→ Backend Instance 2 ─┼─→ MongoDB Cluster
    └─→ Backend Instance 3 ─┘
```

### Caching Layer (Future Enhancement)
```
Client Request
    ↓
Backend Server
    ├─→ Check Redis Cache
    │   ├─ Hit → Return cached data
    │   └─ Miss ↓
    └─→ Query MongoDB
        └─→ Store in Redis
        └─→ Return data
```

## Error Handling Strategy

```
Error Occurs
    ↓
Try-Catch Block
    ↓
Pass to Error Handler Middleware
    ↓
Error Type Detection
    ├─ Mongoose CastError → 404 Not Found
    ├─ Duplicate Key Error → 400 Bad Request
    ├─ Validation Error → 400 Bad Request
    ├─ JWT Error → 401 Unauthorized
    └─ Unknown Error → 500 Internal Server Error
    ↓
Format Response
    ↓
Send to Client
    ↓
Frontend Error Handler
    ↓
Display User-Friendly Message
```

## Performance Optimization Points

1. **Database Indexes**
   - Unique: SKU
   - Single: category, stock, status
   - Compound: product + createdAt
   - Text: product name search

2. **Query Optimization**
   - Pagination (limit + skip)
   - Field selection (select specific fields)
   - Population (only needed fields)
   - Aggregation pipelines for stats

3. **Frontend Optimization**
   - Code splitting (React.lazy)
   - Tree shaking (Vite)
   - Compression (gzip)
   - Asset optimization

4. **API Response Optimization**
   - Consistent response format
   - Minimal data transfer
   - Proper HTTP status codes
   - Compression middleware

---

This architecture provides a solid foundation for a production-ready inventory management system with room for growth and enhancement.
