const express = require("express");
const router = express.Router();

// Middleware
const { verifyToken } = require("../middleware/authMiddleware");
const { isUser, isAdmin } = require("../middleware/roleMiddleware");

// Controllers
const {
  getAllAlerts,
  getAlertsByBin,
  createAlert,
  getMyAlerts
} = require("../controllers/alertController");


// ================= USER =================

// User sends alert
router.post("/", verifyToken, isUser, createAlert);

// User sees their alerts
router.get("/my", verifyToken, isUser, getMyAlerts);


// ================= ADMIN =================

// Admin sees all alerts
router.get("/", verifyToken, isAdmin, getAllAlerts);

// Admin sees alerts for specific bin
router.get("/bin/:binId", verifyToken, isAdmin, getAlertsByBin);


module.exports = router;
