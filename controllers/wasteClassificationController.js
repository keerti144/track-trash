const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.classifyWaste = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const form = new FormData();
        form.append("file", fs.createReadStream(req.file.path));

        const response = await axios.post(
            "http://localhost:5002/predict",
            form,
            { headers: form.getHeaders() }
        );

        res.json({
            success: true,
            prediction: response.data.prediction
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Prediction failed" });
    }
};