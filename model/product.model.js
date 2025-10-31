import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    nutritionFacts: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      servingSize: String,
      servingsPerContainer: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number, //percentage
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: function () {
        return this.price - (this.price * this.discount) / 100;
      },
    },
    variants: [
      {
        flavor: String,
        size: String, // e.g., "1kg", "2kg"
        stock: {
          type: Number,
          default: 0,
        },
      },
    ],
    supplier: {
      name: String,
      contactEmail: String,
      phone: String,
      address: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    metaTitle: String,
    metaDescription: String,
    tags: {
      type: [String],
      lowercase: true,
      default: [],
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    }
}, { timestamps: true });

productSchema.pre("save", function(next){
    this.finalPrice = this.price - (this.price * this.discount) / 100;
    next();
});

productSchema.pre("save", function(next){
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

export default mongoose.model("Product", productSchema);