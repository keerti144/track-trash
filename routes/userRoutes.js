const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

// Get collectors (admin only)
router.get("/collectors", verifyToken, isAdmin, (req, res) => {
  db.query(
    "SELECT id, name, email, latitude, longitude FROM users WHERE role = 'collector'",
    (err, results) => {
      if (err) {
        console.error("Error fetching collectors:", err);
        return res.status(500).json({ message: "Failed to fetch collectors" });
      }
      res.json(results);
    }
  );
});
router.put("/location", verifyToken, (req, res) => {
  const { latitude, longitude } = req.body;
  const userId = req.user.id;

  db.query(
    "UPDATE users SET latitude=?, longitude=? WHERE id=?",
    [latitude, longitude, userId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update location" });
      }

      res.json({ message: "Location updated" });
    }
  );
});

module.exports = router;