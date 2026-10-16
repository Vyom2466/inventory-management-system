// In-memory sample data (no MongoDB needed)

export const users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'manager',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Staff User',
    email: 'staff@example.com',
    role: 'staff',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const products = [
  {
    _id: 'p1',
    name: 'Laptop Dell XPS 15',
    sku: 'LAPTOP-DELL-001',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    category: 'Electronics',
    price: 1299.99,
    stock: 15,
    lowStockThreshold: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'p2',
    name: 'iPhone 14 Pro',
    sku: 'PHONE-APPLE-001',
    description: 'Latest iPhone with A16 Bionic chip',
    category: 'Electronics',
    price: 999.99,
    stock: 25,
    lowStockThreshold: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'p3',
    name: 'Samsung Galaxy S23',
    sku: 'PHONE-SAMSUNG-001',
    description: 'Flagship Android phone with 256GB storage',
    category: 'Electronics',
    price: 899.99,
    stock: 8,
    lowStockThreshold: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'p4',
    name: 'Office Chair Ergonomic',
    sku: 'FURN-CHAIR-001',
    description: 'Comfortable ergonomic office chair with lumbar support',
    category: 'Furniture',
    price: 249.99,
    stock: 30,
    lowStockThreshold: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'p5',
    name: 'Standing Desk',
    sku: 'FURN-DESK-001',
    description: 'Adjustable height standing desk',
    category: 'Furniture',
    price: 499.99,
    stock: 12,
    lowStockThreshold: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'p6',
    name: 'Wireless Mouse Logitech',
    sku: 'ACC-MOUSE-001',
    description: 'Ergonomic wireless mouse with precision tracking',
    category: 'Accessories',
    price: 49.99,
    stock: 50,
    lowStockThreshold: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'p7',
    name: 'Mechanical Keyboard',
    sku: 'ACC-KEYBOARD-001',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    category: 'Accessories',
    price: 129.99,
    stock: 3,
    lowStockThreshold: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'p8',
    name: 'Monitor 27" 4K',
    sku: 'MONITOR-DELL-001',
    description: '27-inch 4K UHD monitor with IPS panel',
    category: 'Electronics',
    price: 399.99,
    stock: 18,
    lowStockThreshold: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'p9',
    name: 'USB-C Hub',
    sku: 'ACC-HUB-001',
    description: 'Multi-port USB-C hub with HDMI and Ethernet',
    category: 'Accessories',
    price: 59.99,
    stock: 0,
    lowStockThreshold: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'p10',
    name: 'Laptop Backpack',
    sku: 'ACC-BAG-001',
    description: 'Water-resistant laptop backpack with multiple compartments',
    category: 'Accessories',
    price: 79.99,
    stock: 22,
    lowStockThreshold: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export let orders = [];
export let inventoryMovements = [];
export let orderCounter = 1;
