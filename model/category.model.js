import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: String,
    imageUrl: String, //for a banner or category thumbnail
    slug: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

categorySchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});


export default mongoose.model("Category", categorySchema);