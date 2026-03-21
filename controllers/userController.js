const db = require("../config/db");

// ✅ Update collector location
const updateCollectorLocation = (req, res) => {
  const user_id = req.user.id;
  const { latitude, longitude } = req.body;

  // Validation
  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      message: "Latitude and longitude are required",
    });
  }

  const sql = `
    UPDATE users 
    SET live_latitude = ?, live_longitude = ?
    WHERE id = ?
  `;

  db.query(sql, [latitude, longitude, user_id], (err) => {
    if (err) {
      console.error("❌ DB ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ message: "Location updated successfully" });
  });
};

module.exports = {
  updateCollectorLocation,
};