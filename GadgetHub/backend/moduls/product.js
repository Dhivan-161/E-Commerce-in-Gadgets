const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    specs: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-increment numeric id
productSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const maxProduct = await mongoose.model('Product').findOne({}, {}, { sort: { id: -1 } });
      this.id = maxProduct && maxProduct.id ? maxProduct.id + 1 : 1;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
