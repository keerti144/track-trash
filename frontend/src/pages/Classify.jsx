import { useEffect, useState } from "react";
import api from "../services/api";
import TX from "../components/TranslatedText";
import "./Classify.css";

function formatPrediction(prediction) {
  if (!prediction || typeof prediction !== "string") return "";
  return prediction.charAt(0).toUpperCase() + prediction.slice(1);
}

function Classify() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setPrediction("");
    setError("");

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please choose an image.");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post("/wastes/classify", formData);
      setPrediction(response.data?.prediction ?? "");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Prediction failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="classify-container">
      <div className="page-header">
        <h1>
          <TX>Garbage classification</TX>
        </h1>
        <p>
          <TX>Upload a photo of the garbage to get a classification result.</TX>
        </p>
      </div>

      <div className="classify-card">
        <form className="classify-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="garbage-image">
              <TX>Choose an image</TX>
            </label>
            <input
              id="garbage-image"
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {previewUrl && (
            <div className="preview-panel">
              <img
                src={previewUrl}
                alt="Uploaded garbage"
                className="classify-preview"
              />
            </div>
          )}

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={!selectedFile || loading}>
              {loading ? <TX>Classifying...</TX> : <TX>Classify</TX>}
            </button>
          </div>
        </form>

        {error && <div className="error-message" style={{ marginTop: "0.9rem", border: "1px solid var(--danger)", padding: "0.8rem" }}>{error}</div>}

        {prediction && (
          <div className="result-panel" style={{ marginTop: error ? "1rem" : "0.9rem" }}>
            <div className="result-label">
              <TX>Prediction</TX>
            </div>
            <div className="result-value">{formatPrediction(prediction)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Classify;

