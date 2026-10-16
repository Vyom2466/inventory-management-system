import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Order, Product } from '../types';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

interface OrderFormItem {
  product: string;
  quantity: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    items: [{ product: '', quantity: 1 }] as OrderFormItem[]
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [statusFilter, search]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const response = await api.get(`/orders?${params.toString()}`);
      setOrders(response.data.data);
    } catch (error: any) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?limit=100&stockStatus=in');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    try {
      await api.post('/orders', formData);
      toast.success('Order created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index: number, field: keyof OrderFormItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      return;
    }

    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        const response = await api.get(`/orders/${orderId}`);
        setSelectedOrder(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const viewOrderDetails = async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data.data);
      setShowDetailModal(true);
    } catch (error: any) {
      toast.error('Failed to fetch order details');
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerContact: '',
      items: [{ product: '', quantity: 1 }]
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading orders...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Orders</h2>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              Create Order
            </button>
          </div>

          <div className="filters">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by order number or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="form-group">
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {orders.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.customerContact}</td>
                    <td>{order.items.length}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => viewOrderDetails(order._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No orders found</div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Order</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Customer Contact</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.customerContact}
                  onChange={(e) => setFormData({ ...formData, customerContact: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Order Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <select
                      className="form-control"
                      value={item.product}
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      required
                      style={{ flex: 2 }}
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name} - ${product.price} (Stock: {product.stock})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="form-control"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      required
                      min="1"
                      style={{ flex: 1 }}
                      placeholder="Qty"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddItem}
                  style={{ marginTop: '0.5rem' }}
                >
                  + Add Item
                </button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - {selectedOrder.orderNumber}</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>
            <div>
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Contact:</strong> {selectedOrder.customerContact}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${selectedOrder.status.toLowerCase()}`}>
                {selectedOrder.status}
              </span></p>
              <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p><strong>Created By:</strong> {selectedOrder.createdBy.name}</p>

              <h4 style={{ marginTop: '1rem' }}>Items</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{typeof item.product === 'object' ? item.product.name : 'N/A'}</td>
                      <td>{typeof item.product === 'object' ? item.product.sku : 'N/A'}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ textAlign: 'right', fontSize: '1.25rem', fontWeight: 'bold' }}>
                Total: ${selectedOrder.totalAmount.toFixed(2)}
              </p>

              <div style={{ marginTop: '1rem' }}>
                <h4>Update Status</h4>
                <div className="actions">
                  {selectedOrder.status === 'Pending' && (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'Confirmed')}
                      >
                        Confirm Order
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'Cancelled')}
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'Confirmed' && (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'Shipped')}
                      >
                        Mark as Shipped
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'Cancelled')}
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
