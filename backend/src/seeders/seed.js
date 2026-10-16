import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'manager123',
    role: 'manager'
  },
  {
    name: 'Staff User',
    email: 'staff@example.com',
    password: 'staff123',
    role: 'staff'
  }
];

const products = [
  {
    name: 'Laptop Dell XPS 15',
    sku: 'LAPTOP-DELL-001',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    category: 'Electronics',
    price: 1299.99,
    stock: 15,
    lowStockThreshold: 5
  },
  {
    name: 'iPhone 14 Pro',
    sku: 'PHONE-APPLE-001',
    description: 'Latest iPhone with A16 Bionic chip',
    category: 'Electronics',
    price: 999.99,
    stock: 25,
    lowStockThreshold: 10
  },
  {
    name: 'Samsung Galaxy S23',
    sku: 'PHONE-SAMSUNG-001',
    description: 'Flagship Android phone with 256GB storage',
    category: 'Electronics',
    price: 899.99,
    stock: 8,
    lowStockThreshold: 10
  },
  {
    name: 'Office Chair Ergonomic',
    sku: 'FURN-CHAIR-001',
    description: 'Comfortable ergonomic office chair with lumbar support',
    category: 'Furniture',
    price: 249.99,
    stock: 30,
    lowStockThreshold: 10
  },
  {
    name: 'Standing Desk',
    sku: 'FURN-DESK-001',
    description: 'Adjustable height standing desk',
    category: 'Furniture',
    price: 499.99,
    stock: 12,
    lowStockThreshold: 5
  },
  {
    name: 'Wireless Mouse Logitech',
    sku: 'ACC-MOUSE-001',
    description: 'Ergonomic wireless mouse with precision tracking',
    category: 'Accessories',
    price: 49.99,
    stock: 50,
    lowStockThreshold: 20
  },
  {
    name: 'Mechanical Keyboard',
    sku: 'ACC-KEYBOARD-001',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    category: 'Accessories',
    price: 129.99,
    stock: 3,
    lowStockThreshold: 10
  },
  {
    name: 'Monitor 27" 4K',
    sku: 'MONITOR-DELL-001',
    description: '27-inch 4K UHD monitor with IPS panel',
    category: 'Electronics',
    price: 399.99,
    stock: 18,
    lowStockThreshold: 8
  },
  {
    name: 'USB-C Hub',
    sku: 'ACC-HUB-001',
    description: 'Multi-port USB-C hub with HDMI and Ethernet',
    category: 'Accessories',
    price: 59.99,
    stock: 0,
    lowStockThreshold: 15
  },
  {
    name: 'Laptop Backpack',
    sku: 'ACC-BAG-001',
    description: 'Water-resistant laptop backpack with multiple compartments',
    category: 'Accessories',
    price: 79.99,
    stock: 22,
    lowStockThreshold: 10
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Cleared existing data');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\nDemo Accounts:');
    console.log('===============');
    console.log('Admin:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
    console.log('\nManager:');
    console.log('  Email: manager@example.com');
    console.log('  Password: manager123');
    console.log('\nStaff:');
    console.log('  Email: staff@example.com');
    console.log('  Password: staff123');
    console.log('\nData seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
