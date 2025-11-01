import Category from "../model/category.model.js";

export const getAllCategories = async (_, res) => {
  try {
    const categories = await Category.find({});
    if (!categories) {
        return res.status(404).json({ message: "No categories found!" });
    }

    return res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    return res
        .status(500)
        .json({ message: "Server Error while fetching categories!" });
    }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required!" });
    }

    const existingCategory = await Category.findOne({
      name: name.toLowerCase().trim(),
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists!" });
    }

    const newCategory = await Category.create({
      name: name.toLowerCase().trim(),
      description: description || "",
      imageUrl: imageUrl || "",
    });

    return res
      .status(201)
      .json({
        message: "Category created successfully!",
        category: newCategory,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server Error while creating new category!" });
  }
};
