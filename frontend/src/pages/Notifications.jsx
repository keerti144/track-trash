import { useEffect, useState } from "react";
import api from "../services/api";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data || []);
      setError("");
    } catch (err) {
      console.error("Failed to load notifications", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`);
      setNotifications((current) =>
        current.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "collection":
        return "🚚";
      case "alert":
        return "⚠️";
      case "issue":
        return "🛠️";
      default:
        return "📢";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") {
      return !notification.is_read;
    }
    if (filter === "read") {
      return notification.is_read;
    }
    return true;
  });

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  const markAllVisibleAsRead = async () => {
    await Promise.all(
      filteredNotifications
        .filter((notification) => !notification.is_read)
        .map((notification) => markAsRead(notification.id))
    );
  };

  if (loading) {
    return <div className="notifications-container"><p>Loading notifications...</p></div>;
  }

  return (
    <div className="notifications-container">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Review assignments, alerts, and system updates in one place.</p>
      </div>

      <div className="notifications-toolbar">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === "read" ? "active" : ""}`}
            onClick={() => setFilter("read")}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {filteredNotifications.some((notification) => !notification.is_read) && (
          <button className="btn-small btn-secondary" onClick={markAllVisibleAsRead}>
            Mark visible as read
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <p>{filter === "unread" ? "No unread notifications." : "All caught up."}</p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.is_read ? "unread" : ""}`}
            >
              <div className="notification-content">
                <span className="notification-icon">{getNotificationIcon(notification.type)}</span>
                <div className="notification-text">
                  <h4>{notification.title || "Notification"}</h4>
                  <p className="notification-desc">{notification.message}</p>
                  <span className="notification-time">
                    {notification.created_at
                      ? new Date(notification.created_at).toLocaleString()
                      : "Unknown time"}
                  </span>
                </div>
                {!notification.is_read && <span className="unread-dot" />}
              </div>

              <div className="notification-actions">
                {!notification.is_read && (
                  <button
                    className="action-btn read-btn"
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
