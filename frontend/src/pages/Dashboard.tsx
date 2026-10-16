import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { DashboardStats } from '../types';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (error: any) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="empty-state">No data available</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ marginBottom: '1.5rem' }}>Dashboard</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Products</h3>
            <div className="value">{stats.totalProducts}</div>
          </div>
          <div className="stat-card">
            <h3>Low Stock Products</h3>
            <div className="value" style={{ color: '#e74c3c' }}>{stats.lowStockProducts}</div>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <div className="value">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <div className="value">${stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Pending Orders</h3>
            <div className="value">{stats.ordersByStatus.Pending}</div>
          </div>
          <div className="stat-card">
            <h3>Confirmed Orders</h3>
            <div className="value">{stats.ordersByStatus.Confirmed}</div>
          </div>
          <div className="stat-card">
            <h3>Shipped Orders</h3>
            <div className="value">{stats.ordersByStatus.Shipped}</div>
          </div>
          <div className="stat-card">
            <h3>Cancelled Orders</h3>
            <div className="value">{stats.ordersByStatus.Cancelled}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <Link to="/orders" className="btn btn-primary btn-sm">View All</Link>
          </div>
          {stats.recentOrders.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No recent orders</div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Products</h3>
          </div>
          {stats.topProducts.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Total Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.totalQuantity}</td>
                    <td>${product.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No sales data available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
