import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getCategories
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes with authentication
router.get('/categories/list', protect, getCategories);
router.get('/low-stock/list', protect, getLowStockProducts);

router
  .route('/')
  .get(protect, getProducts)
  .post(
    protect,
    [
      body('name').trim().notEmpty().withMessage('Product name is required'),
      body('sku').trim().notEmpty().withMessage('SKU is required'),
      body('description').trim().notEmpty().withMessage('Description is required'),
      body('category').trim().notEmpty().withMessage('Category is required'),
      body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),
      body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
      validate
    ],
    createProduct
  );

router
  .route('/:id')
  .get(protect, getProduct)
  .put(
    protect,
    [
      body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
      body('sku').optional().trim().notEmpty().withMessage('SKU cannot be empty'),
      body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
      body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
      body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),
      validate
    ],
    updateProduct
  )
  .delete(protect, authorize('admin', 'manager'), deleteProduct);

export default router;
