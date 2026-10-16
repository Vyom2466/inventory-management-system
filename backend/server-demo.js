import express from 'express';
import cors from 'cors';
import { products, orders, inventoryMovements, users, orderCounter } from './src/data/sampleData.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Demo user (no authentication needed)
const demoUser = users[0]; // Admin user

// Helper function to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// ============ AUTH ROUTES (Bypass) ============
app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: demoUser
  });
});

// ============ PRODUCT ROUTES ============
app.get('/api/products', (req, res) => {
  const { search, category, stockStatus } = req.query;
  let filtered = [...products];

  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (stockStatus === 'low') {
    filtered = filtered.filter(p => p.stock <= p.lowStockThreshold);
  } else if (stockStatus === 'out') {
    filtered = filtered.filter(p => p.stock === 0);
  } else if (stockStatus === 'in') {
    filtered = filtered.filter(p => p.stock > 0);
  }

  res.json({
    success: true,
    data: filtered,
    pagination: {
      page: 1,
      limit: 100,
      total: filtered.length,
      pages: 1
    }
  });
});

app.get('/api/products/low-stock/list', (req, res) => {
  const lowStock = products.filter(p => p.stock <= p.lowStockThreshold);
  res.json({
    success: true,
    data: lowStock
  });
});

app.get('/api/products/categories/list', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({
    success: true,
    data: categories
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  res.json({
    success: true,
    data: product
  });
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    _id: 'p' + (products.length + 1),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  products.push(newProduct);
  res.status(201).json({
    success: true,
    data: newProduct
  });
});

app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  delete req.body.stock; // Don't allow direct stock updates
  products[index] = {
    ...products[index],
    ...req.body,
    updatedAt: new Date()
  };
  
  res.json({
    success: true,
    data: products[index]
  });
});

app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  products.splice(index, 1);
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// ============ INVENTORY ROUTES ============
app.post('/api/inventory/adjust', (req, res) => {
  const { productId, quantityChange, reason } = req.body;
  
  const product = products.find(p => p._id === productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  const previousStock = product.stock;
  const newStock = previousStock + quantityChange;
  
  if (newStock < 0) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient stock. Cannot reduce below zero.'
    });
  }
  
  product.stock = newStock;
  
  const movement = {
    _id: 'm' + (inventoryMovements.length + 1),
    product: {
      _id: product._id,
      name: product.name,
      sku: product.sku
    },
    quantityChange,
    reason,
    user: {
      _id: demoUser._id,
      name: demoUser.name,
      email: demoUser.email
    },
    previousStock,
    newStock,
    createdAt: new Date()
  };
  
  inventoryMovements.unshift(movement);
  
  res.json({
    success: true,
    data: {
      product,
      movement
    }
  });
});

app.get('/api/inventory/movements', (req, res) => {
  res.json({
    success: true,
    data: inventoryMovements,
    pagination: {
      page: 1,
      limit: 20,
      total: inventoryMovements.length,
      pages: 1
    }
  });
});

app.get('/api/inventory/movements/:productId', (req, res) => {
  const movements = inventoryMovements.filter(m => m.product._id === req.params.productId);
  res.json({
    success: true,
    data: movements
  });
});

// ============ ORDER ROUTES ============
app.post('/api/orders', (req, res) => {
  const { customerName, customerContact, items } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order must contain at least one item'
    });
  }
  
  let calculatedTotal = 0;
  const orderItems = [];
  
  for (const item of items) {
    const product = products.find(p => p._id === item.product);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.product}`
      });
    }
    
    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
      });
    }
    
    const price = product.price;
    const subtotal = price * item.quantity;
    calculatedTotal += subtotal;
    
    orderItems.push({
      product: {
        _id: product._id,
        name: product.name,
        sku: product.sku
      },
      quantity: item.quantity,
      price,
      subtotal
    });
  }
  
  const order = {
    _id: 'o' + orders.length,
    orderNumber: generateOrderNumber(),
    customerName,
    customerContact,
    items: orderItems,
    totalAmount: calculatedTotal,
    status: 'Pending',
    createdBy: {
      _id: demoUser._id,
      name: demoUser.name,
      email: demoUser.email
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  orders.unshift(order);
  
  res.status(201).json({
    success: true,
    data: order
  });
});

app.get('/api/orders', (req, res) => {
  const { status, search } = req.query;
  let filtered = [...orders];
  
  if (status) {
    filtered = filtered.filter(o => o.status === status);
  }
  
  if (search) {
    filtered = filtered.filter(o =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    data: filtered,
    pagination: {
      page: 1,
      limit: 10,
      total: filtered.length,
      pages: 1
    }
  });
});

app.get('/api/orders/recent/list', (req, res) => {
  res.json({
    success: true,
    data: orders.slice(0, 10)
  });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o._id === req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  res.json({
    success: true,
    data: order
  });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = orders.find(o => o._id === req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
  
  const oldStatus = order.status;
  
  // If confirming order, reduce stock
  if (status === 'Confirmed' && oldStatus === 'Pending') {
    for (const item of order.items) {
      const product = products.find(p => p._id === item.product._id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product._id}`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
      
      const previousStock = product.stock;
      product.stock -= item.quantity;
      
      const movement = {
        _id: 'm' + (inventoryMovements.length + 1),
        product: {
          _id: product._id,
          name: product.name,
          sku: product.sku
        },
        quantityChange: -item.quantity,
        reason: `Order ${order.orderNumber} confirmed`,
        user: {
          _id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email
        },
        previousStock,
        newStock: product.stock,
        createdAt: new Date()
      };
      
      inventoryMovements.unshift(movement);
    }
  }
  
  // If cancelling a confirmed order, restore stock
  if (status === 'Cancelled' && oldStatus === 'Confirmed') {
    for (const item of order.items) {
      const product = products.find(p => p._id === item.product._id);
      
      if (product) {
        const previousStock = product.stock;
        product.stock += item.quantity;
        
        const movement = {
          _id: 'm' + (inventoryMovements.length + 1),
          product: {
            _id: product._id,
            name: product.name,
            sku: product.sku
          },
          quantityChange: item.quantity,
          reason: `Order ${order.orderNumber} cancelled`,
          user: {
            _id: demoUser._id,
            name: demoUser.name,
            email: demoUser.email
          },
          previousStock,
          newStock: product.stock,
          createdAt: new Date()
        };
        
        inventoryMovements.unshift(movement);
      }
    }
  }
  
  order.status = status;
  order.updatedAt = new Date();
  
  res.json({
    success: true,
    data: order
  });
});

// ============ DASHBOARD ROUTES ============
app.get('/api/dashboard/stats', (req, res) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const totalOrders = orders.length;
  
  const statusCounts = {
    Pending: orders.filter(o => o.status === 'Pending').length,
    Confirmed: orders.filter(o => o.status === 'Confirmed').length,
    Shipped: orders.filter(o => o.status === 'Shipped').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length
  };
  
  const totalRevenue = orders
    .filter(o => o.status === 'Confirmed' || o.status === 'Shipped')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  
  const recentOrders = orders.slice(0, 5);
  
  // Top products
  const productSales = {};
  orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped').forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.product._id]) {
        productSales[item.product._id] = {
          _id: item.product._id,
          name: item.product.name,
          sku: item.product.sku,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      productSales[item.product._id].totalQuantity += item.quantity;
      productSales[item.product._id].totalRevenue += item.subtotal;
    });
  });
  
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);
  
  res.json({
    success: true,
    data: {
      totalProducts,
      lowStockProducts,
      totalOrders,
      ordersByStatus: statusCounts,
      totalRevenue,
      recentOrders,
      topProducts
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Inventory Management System API - DEMO MODE (No Authentication)',
    version: '1.0.0-demo'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('  DEMO MODE - No MongoDB, No Authentication Required');
  console.log('='.repeat(60));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Using sample in-memory data`);
  console.log(`✅ All features available without login`);
  console.log('='.repeat(60));
});
