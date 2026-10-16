export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
}

export interface AuthResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  _id: string;
  product: {
    _id: string;
    name: string;
    sku: string;
  };
  quantityChange: number;
  reason: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  previousStock: number;
  newStock: number;
  createdAt: string;
}

export interface OrderItem {
  product: string | {
    _id: string;
    name: string;
    sku: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerContact: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Cancelled';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  ordersByStatus: {
    Pending: number;
    Confirmed: number;
    Shipped: number;
    Cancelled: number;
  };
  totalRevenue: number;
  recentOrders: Order[];
  topProducts: {
    _id: string;
    name: string;
    sku: string;
    totalQuantity: number;
    totalRevenue: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
