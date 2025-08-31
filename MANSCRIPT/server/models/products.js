const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    pDescription: {
      type: String,
      required: true,
    },
    pPrice: {
      type: Number,
      required: true,
    },
    pSold: {
      type: Number,
      default: 0,
    },
    // The pQuantity field has been removed.
    // It is replaced by the pSizes array below.

    pCategory: {
      type: ObjectId,
      ref: "categories",
    },
    pImages: {
      type: Array,
      required: true,
    },
    pOffer: {
      type: String,
      default: null,
    },
    pRatingsReviews: [
      {
        review: String,
        user: { type: ObjectId, ref: "users" },
        rating: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    pStatus: {
      type: String,
      required: true,
    },

    // --- NEW FIELD FOR SIZES AND STOCK ---
    pSizes: [
      {
        size: {
          type: String,
          enum: ["S", "M", "L", "XL", "XXL"], // Allowed sizes
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0, // Quantity cannot be negative
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
