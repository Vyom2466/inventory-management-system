import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import InventoryMovement from '../models/InventoryMovement.js';

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerName, customerContact, items } = req.body;

    if (!items || items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate and calculate totals on server side
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      // Use current product price
      const price = product.price;
      const subtotal = price * item.quantity;
      calculatedTotal += subtotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price,
        subtotal
      });
    }

    // Create order
    const order = await Order.create([{
      orderNumber: generateOrderNumber(),
      customerName,
      customerContact,
      items: orderItems,
      totalAmount: calculatedTotal,
      status: 'Pending',
      createdBy: req.user._id
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // Populate product details
    const populatedOrder = await Order.findById(order[0]._id)
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name sku price')
      .populate('createdBy', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
export const updateOrderStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldStatus = order.status;

    // If confirming order, reduce stock
    if (status === 'Confirmed' && oldStatus === 'Pending') {
      for (const item of order.items) {
        const product = await Product.findById(item.product).session(session);

        if (!product) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.product}`
          });
        }

        if (product.stock < item.quantity) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}`
          });
        }

        const previousStock = product.stock;
        product.stock -= item.quantity;
        await product.save({ session });

        // Record inventory movement
        await InventoryMovement.create([{
          product: product._id,
          quantityChange: -item.quantity,
          reason: `Order ${order.orderNumber} confirmed`,
          user: req.user._id,
          previousStock,
          newStock: product.stock
        }], { session });
      }
    }

    // If cancelling a confirmed order, restore stock
    if (status === 'Cancelled' && oldStatus === 'Confirmed') {
      for (const item of order.items) {
        const product = await Product.findById(item.product).session(session);

        if (product) {
          const previousStock = product.stock;
          product.stock += item.quantity;
          await product.save({ session });

          // Record inventory movement
          await InventoryMovement.create([{
            product: product._id,
            quantityChange: item.quantity,
            reason: `Order ${order.orderNumber} cancelled`,
            user: req.user._id,
            previousStock,
            newStock: product.stock
          }], { session });
        }
      }
    }

    order.status = status;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    const updatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get recent orders
// @route   GET /api/orders/recent/list
// @access  Private
export const getRecentOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
