import mongoose from 'mongoose';
import Product from '../models/Product.js';
import InventoryMovement from '../models/InventoryMovement.js';

// @desc    Adjust stock (increase or decrease)
// @route   POST /api/inventory/adjust
// @access  Private
export const adjustStock = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, quantityChange, reason } = req.body;

    // Get product
    const product = await Product.findById(productId).session(session);

    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const previousStock = product.stock;
    const newStock = previousStock + quantityChange;

    // Prevent negative stock
    if (newStock < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock. Cannot reduce below zero.'
      });
    }

    // Update product stock
    product.stock = newStock;
    await product.save({ session });

    // Record inventory movement
    const movement = await InventoryMovement.create([{
      product: productId,
      quantityChange,
      reason,
      user: req.user._id,
      previousStock,
      newStock
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      data: {
        product,
        movement: movement[0]
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get inventory movements
// @route   GET /api/inventory/movements
// @access  Private
export const getInventoryMovements = async (req, res, next) => {
  try {
    const { productId, page = 1, limit = 20 } = req.query;

    const query = productId ? { product: productId } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const movements = await InventoryMovement.find(query)
      .populate('product', 'name sku')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await InventoryMovement.countDocuments(query);

    res.json({
      success: true,
      data: movements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory movement history for a product
// @route   GET /api/inventory/movements/:productId
// @access  Private
export const getProductMovements = async (req, res, next) => {
  try {
    const movements = await InventoryMovement.find({ product: req.params.productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: movements
    });
  } catch (error) {
    next(error);
  }
};
