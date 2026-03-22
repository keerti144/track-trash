const express = require("express");
const router = express.Router();
const sensorAuth = require("../middleware/sensorAuth");
const { updateSensorData } = require("../controllers/sensorController");

router.post("/update", sensorAuth, updateSensorData);

module.exports = router;
