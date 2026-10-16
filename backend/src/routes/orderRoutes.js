import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getRecentOrders
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.get('/recent/list', protect, getRecentOrders);

router
  .route('/')
  .get(protect, getOrders)
  .post(
    protect,
    [
      body('customerName').trim().notEmpty().withMessage('Customer name is required'),
      body('customerContact').trim().notEmpty().withMessage('Customer contact is required'),
      body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
      body('items.*.product').notEmpty().withMessage('Product ID is required'),
      body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
      validate
    ],
    createOrder
  );

router.get('/:id', protect, getOrder);

router.patch(
  '/:id/status',
  protect,
  [
    body('status')
      .isIn(['Pending', 'Confirmed', 'Shipped', 'Cancelled'])
      .withMessage('Invalid status'),
    validate
  ],
  updateOrderStatus
);

export default router;
