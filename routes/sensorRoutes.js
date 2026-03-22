const express = require("express");
const router = express.Router();

const { updateSensorData } = require("../controllers/sensorController");

// POST /api/sensor
router.post("/", updateSensorData);

module.exports = router;