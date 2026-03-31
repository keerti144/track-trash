from flask import Flask, request, jsonify
from predict import predict
import uuid
import os

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def classify():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    
    file_path = f"temp_{uuid.uuid4().hex}.jpg"
    file.save(file_path)

    result = predict(file_path)

    os.remove(file_path)  # cleanup

    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run(port=5002)  