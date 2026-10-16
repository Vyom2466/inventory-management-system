import express from 'express';
import { body } from 'express-validator';
import {
  adjustStock,
  getInventoryMovements,
  getProductMovements
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.post(
  '/adjust',
  protect,
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantityChange')
      .isInt({ ne: 0 })
      .withMessage('Quantity change must be a non-zero integer'),
    body('reason').trim().notEmpty().withMessage('Reason is required'),
    validate
  ],
  adjustStock
);

router.get('/movements', protect, getInventoryMovements);
router.get('/movements/:productId', protect, getProductMovements);

export default router;
