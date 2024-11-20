import Product from "../models/product.model.js";
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      res.status(200).json(JSON.parse(featuredProducts));
    }
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      res.status(404).json({ message: "No featured products found" });
    }
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json(product);
    console.log("Product created successfully");
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      try {
        const imageId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imageId);
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
    }
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getrecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      $sample({ size: 4 }),
      $project({ name: 1, image: 1, _id: 1, price: 1, description: 1 }),
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsbyCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }
    product.isFeatured = !product.isFeatured;
    await product.save();
    await updateFeaturedProductsCache();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error updating featured products cache", error);
  }
}
