import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const daliySaleData = await getDaliySalesData(startDate, endDate);
    res.status(200).json({ analyticsData, daliySaleData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
