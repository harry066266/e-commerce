import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getrecommendedProducts,
  getProductsbyCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controllers.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsbyCategory);
router.get("/recommendations", protectRoute, getrecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
export default router;
