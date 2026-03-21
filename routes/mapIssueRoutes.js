const express = require("express");
const router = express.Router();

const {
  createMapIssue,
  getMyMapIssues,
  getAllMapIssues,
  assignCollectorToMapIssue,
  getCollectorMapIssues,
  updateMapIssueStatus,
} = require("../controllers/mapIssueController");

const { verifyToken } = require("../middleware/authMiddleware");

// TEMP SIMPLE VERSION - no role middleware for now
router.post("/", verifyToken, createMapIssue);
router.get("/my", verifyToken, getMyMapIssues);
router.get("/", verifyToken, getAllMapIssues);
router.put("/assign/:id", verifyToken, assignCollectorToMapIssue);
router.get("/collector", verifyToken, getCollectorMapIssues);
router.put("/status/:id", verifyToken, updateMapIssueStatus);

module.exports = router;