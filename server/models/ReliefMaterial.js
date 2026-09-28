const mongoose = require('mongoose');

const reliefMaterialSchema = new mongoose.Schema(
  {
    materialId: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    materialName: {
      type: String,
      required: [true, 'Please enter material name'],
      trim: true,
      minlength: [3, 'Material name must be at least 3 characters'],
      validate: {
        validator: function (v) {
          return /^[A-Za-z ]+$/.test(v);
        },
        message: 'Material name should contain only letters and spaces',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Please enter quantity'],
      min: [1, 'Quantity must be at least 1'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Food',
        'Water',
        'Medicine',
        'Clothing',
        'Shelter Material',
        'Other',
      ],
    },
    distributionLocation: {
      type: String,
      required: [true, 'Please enter distribution location'],
      trim: true,
      minlength: [5, 'Distribution location must be at least 5 characters'],
    },
    status: {
      type: String,
      enum: ['Available', 'Low Stock', 'Distributed'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate human-readable materialId (e.g. RM-1001) before saving
reliefMaterialSchema.pre('save', async function (next) {
  if (!this.materialId) {
    const count = await mongoose.model('ReliefMaterial').countDocuments();
    this.materialId = `RM-${1000 + count + 1}`;
  }
  next();
});

const ReliefMaterial = mongoose.model('ReliefMaterial', reliefMaterialSchema);

module.exports = ReliefMaterial;
