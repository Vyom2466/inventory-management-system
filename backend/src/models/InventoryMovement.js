import mongoose from 'mongoose';

const inventoryMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantityChange: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for inventory adjustment'],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Indexes
inventoryMovementSchema.index({ product: 1, createdAt: -1 });
inventoryMovementSchema.index({ user: 1 });

const InventoryMovement = mongoose.model('InventoryMovement', inventoryMovementSchema);

export default InventoryMovement;
