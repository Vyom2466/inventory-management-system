import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    // Total products
    const totalProducts = await Product.countDocuments();

    // Low stock products
    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    });

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      Pending: 0,
      Confirmed: 0,
      Shipped: 0,
      Cancelled: 0
    };

    ordersByStatus.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    // Recent orders
    const recentOrders = await Order.find()
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Revenue calculation (confirmed and shipped orders)
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $in: ['Confirmed', 'Shipped'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Top products by order quantity
    const topProducts = await Order.aggregate([
      { $match: { status: { $in: ['Confirmed', 'Shipped'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          sku: '$product.sku',
          totalQuantity: 1,
          totalRevenue: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        totalOrders,
        ordersByStatus: statusCounts,
        totalRevenue,
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    next(error);
  }
};
