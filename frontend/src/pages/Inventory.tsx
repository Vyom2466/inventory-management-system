import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Product, InventoryMovement } from '../types';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const Inventory: React.FC = () => {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantityChange: '',
    reason: ''
  });

  useEffect(() => {
    fetchMovements();
    fetchProducts();
  }, []);

  const fetchMovements = async () => {
    try {
      const response = await api.get('/inventory/movements');
      setMovements(response.data.data);
    } catch (error: any) {
      toast.error('Failed to fetch inventory movements');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?limit=100');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId || !formData.quantityChange || !formData.reason) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await api.post('/inventory/adjust', {
        productId: formData.productId,
        quantityChange: parseInt(formData.quantityChange),
        reason: formData.reason
      });
      toast.success('Stock adjusted successfully');
      setShowModal(false);
      resetForm();
      fetchMovements();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      quantityChange: '',
      reason: ''
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading">Loading inventory...</div>
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
            <h2 className="card-title">Inventory Movements</h2>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Adjust Stock
            </button>
          </div>

          {movements.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Change</th>
                  <th>Previous</th>
                  <th>New</th>
                  <th>Reason</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement._id}>
                    <td>{new Date(movement.createdAt).toLocaleString()}</td>
                    <td>{movement.product.name}</td>
                    <td>{movement.product.sku}</td>
                    <td>
                      <span style={{
                        color: movement.quantityChange > 0 ? '#27ae60' : '#e74c3c',
                        fontWeight: 'bold'
                      }}>
                        {movement.quantityChange > 0 ? '+' : ''}{movement.quantityChange}
                      </span>
                    </td>
                    <td>{movement.previousStock}</td>
                    <td>{movement.newStock}</td>
                    <td>{movement.reason}</td>
                    <td>{movement.user.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No inventory movements found</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adjust Stock</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product</label>
                <select
                  className="form-control"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} ({product.sku}) - Current Stock: {product.stock}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity Change</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.quantityChange}
                  onChange={(e) => setFormData({ ...formData, quantityChange: e.target.value })}
                  required
                  placeholder="Use negative numbers to decrease stock"
                />
                <small>Use positive numbers to increase, negative to decrease</small>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  className="form-control"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  rows={3}
                  placeholder="e.g., Purchase order, Damaged goods, Inventory correction"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Adjust Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;
