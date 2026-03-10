import { useEffect, useState } from "react";
import api from "../services/api";
import "./Alerts.css";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/alerts");
      setAlerts(res.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("⛔ System alerts are only available to administrators");
      } else {
        setError("Failed to load alerts");
      }
      setLoading(false);
      console.error(err);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "🔴";
      case "warning":
        return "🟠";
      case "info":
        return "🔵";
      default:
        return "⚪";
    }
  };

  if (loading) return <div className="alerts-container"><p>Loading alerts...</p></div>;
  if (error) {
    return (
      <div className="alerts-container">
        <div className="page-header">
          <h1>⚠️ Alerts</h1>
          <p>Monitor critical bin and system alerts</p>
        </div>
        <div className="permission-message">
          <p>{error}</p>
          <a href="/dashboard" className="btn btn-primary">← Back to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-container">
      <div className="page-header">
        <h1>⚠️ Alerts</h1>
        <p>Monitor critical bin and system alerts</p>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-state">
          <p>✨ No active alerts. Everything is running smoothly!</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.severity?.toLowerCase() || 'info'}`}>
              <div className="alert-header">
                <span className="alert-icon">{getSeverityIcon(alert.severity)}</span>
                <div className="alert-title-section">
                  <h3>{alert.message || alert.type || "Alert"}</h3>
                  <p className="alert-bin">Bin #{alert.binId || "N/A"}</p>
                </div>
                <span className="alert-severity">{alert.severity || "Info"}</span>
              </div>
              <div className="alert-body">
                <p>{alert.description || "No additional details"}</p>
              </div>
              <div className="alert-footer">
                <span className="alert-time">
                  {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "Unknown time"}
                </span>
                <div className="alert-actions">
                  <button className="btn-small btn-secondary">Dismiss</button>
                  <button className="btn-small btn-primary">Take Action</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;
