import Product from "../model/product.model.js";


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      ingredients,
      nutritionFacts,
      price,
      discount,
      variants,
      supplier,
      tags,
      imageUrls,
      isFeatured,
    } = req.body;

    if (
      [name, brand, category, description, price, supplier, imageUrls].some(
        (field) => !field || (Array.isArray(field) && field.length === 0)
      )
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled!" });
    }

    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number!" });
    }

    if (discount && (isNaN(discount) || discount < 0 || discount > 100)) {
        return res
            .status(400)
            .json({ message: "Discount must be a number between 0 and 100!" });
    }

    if (imageUrls && (!Array.isArray(imageUrls) || imageUrls.some(url => typeof url !== "string"))) {
        return res
            .status(400)
            .json({ message: "Image URLs must be an array of strings!" });
    }

    if (ingredients && (!Array.isArray(ingredients) || ingredients.some(i => typeof i !== "string"))) {
        return res
            .status(400)
            .json({ message: "Ingredients must be an array of strings!" });
    }

    if (variants && !Array.isArray(variants)) {
        return res
            .status(400)
            .json({ message: "Variants must be an array!" });
    }

    if (supplier && typeof supplier !== "object") {
        return res
            .status(400)
            .json({ message: "Supplier must be an object!" });
    }

    if (nutritionFacts && typeof nutritionFacts !== "object") {
        return res
            .status(400)
            .json({ message: "Nutrition Facts must be an object!" });
    }

    if (typeof isFeatured !== "undefined" && typeof isFeatured !== "boolean") {
        return res
            .status(400)
            .json({ message: "isFeatured must be a boolean!" });
    }

    if (tags && (!Array.isArray(tags) || tags.some(tag => typeof tag !== "string"))) {
        return res
            .status(400)
            .json({ message: "Tags must be an array of strings!" });
    }

    const newProduct = await Product.create({
      name,
      brand,
      category,
      description,
      ingredients,
      nutritionFacts,
      price,
      discount,
      variants,
      supplier,
      tags,
      imageUrls,
      isFeatured,
    });

    return res.status(201).json({
      message: "Product created successfully!",
      product: newProduct,
    });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while creating product!" });
  }
};

export const testCntr = (req, res) => {
  res.send("Product route is working...");
};
