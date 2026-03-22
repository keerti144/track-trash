import { useEffect, useState } from "react";
import api from "../services/api";
import "./Issues.css";

function getIssueTone(issueType) {
  switch (issueType?.toLowerCase()) {
    case "overflow":
      return "high";
    case "damage":
    case "mechanical":
    case "malfunction":
      return "medium";
    case "other":
      return "low";
    default:
      return "medium";
  }
}

function Issues() {
  const [issues, setIssues] = useState([]);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    issue_type: "",
    description: "",
    bin_id: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "user";
    setUserRole(role);
    fetchIssues(role);
    fetchBins();
  }, []);

  const fetchIssues = async (role = userRole) => {
    try {
      const response =
        role === "admin" ? await api.get("/issues") : await api.get("/issues/my");
      setIssues(response.data || []);
      setError("");
    } catch (err) {
      console.error("Failed to load issues", err);
      setError("Failed to load issues.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBins = async () => {
    try {
      const response = await api.get("/bins");
      setBins(response.data || []);
    } catch (err) {
      console.error("Failed to load bins", err);
      setBins([]);
    }
  };

  const handleSubmitIssue = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.bin_id || !formData.issue_type || !formData.description.trim()) {
      setError("Please select a bin, choose an issue type, and add a description.");
      return;
    }

    try {
      await api.post("/issues", {
        bin_id: Number(formData.bin_id),
        issue_type: formData.issue_type,
        description: formData.description.trim(),
      });

      setFormData({ issue_type: "", description: "", bin_id: "" });
      setShowForm(false);
      fetchIssues();
    } catch (err) {
      console.error("Failed to create issue", err);
      setError(err.response?.data?.message || "Failed to create issue.");
    }
  };

  const resolveIssue = async (id) => {
    try {
      await api.put(`/issues/resolve/${id}`);
      setIssues((current) =>
        current.map((issue) => (issue.id === id ? { ...issue, status: "resolved" } : issue))
      );
    } catch (err) {
      console.error("Failed to resolve issue", err);
    }
  };

  if (loading) {
    return <div className="issues-container"><p>Loading issues...</p></div>;
  }

  return (
    <div className="issues-container">
      <div className="page-header">
        <h1>Issues and reports</h1>
        <p>Report damaged bins, overflow, and other operational problems.</p>
      </div>

      {userRole !== "admin" && (
        <div className="create-issue-section">
          {!showForm ? (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Report a new issue
            </button>
          ) : (
            <form className="issue-form" onSubmit={handleSubmitIssue}>
              <div className="form-group">
                <label htmlFor="issue-type">Issue type</label>
                <select
                  id="issue-type"
                  value={formData.issue_type}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, issue_type: event.target.value }))
                  }
                  required
                >
                  <option value="">Select issue type</option>
                  <option value="mechanical">Mechanical</option>
                  <option value="overflow">Overflow</option>
                  <option value="damage">Damage</option>
                  <option value="malfunction">Malfunction</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="issue-description">Description</label>
                <textarea
                  id="issue-description"
                  placeholder="Describe the issue in detail"
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, description: event.target.value }))
                  }
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="issue-bin">Bin</label>
                <select
                  id="issue-bin"
                  value={formData.bin_id}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, bin_id: event.target.value }))
                  }
                  required
                >
                  <option value="">Select a bin</option>
                  {bins.map((bin) => (
                    <option key={bin.id} value={bin.id}>
                      Bin #{bin.id} - {bin.location || "No location"}
                    </option>
                  ))}
                </select>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Submit issue
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {error && !showForm && <p className="error">{error}</p>}

      {issues.length === 0 ? (
        <div className="empty-state">
          <p>No issues reported yet.</p>
        </div>
      ) : (
        <div className="issues-list">
          {issues.map((issue) => (
            <div key={issue.id} className={`issue-card ${getIssueTone(issue.issue_type)}`}>
              <div className="issue-header">
                <span className="priority-icon">
                  {getIssueTone(issue.issue_type) === "high"
                    ? "🔴"
                    : getIssueTone(issue.issue_type) === "medium"
                      ? "🟠"
                      : "🟢"}
                </span>
                <div className="issue-title-section">
                  <h3>{issue.issue_type || "Issue report"}</h3>
                  <p className="issue-meta">
                    {issue.reporter_name && <>by {issue.reporter_name} • </>}
                    {issue.created_at
                      ? new Date(issue.created_at).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
                <span className={`status-badge ${issue.status?.toLowerCase() || "open"}`}>
                  {issue.status || "Open"}
                </span>
              </div>

              <div className="issue-body">
                <p>{issue.description}</p>
                {issue.bin_id && (
                  <p className="issue-bin">
                    <strong>Affected bin:</strong> #{issue.bin_id}
                    {issue.bin_location ? ` • ${issue.bin_location}` : ""}
                  </p>
                )}
              </div>

              <div className="issue-footer">
                {userRole === "admin" && issue.status?.toLowerCase() !== "resolved" && (
                  <button className="btn-small btn-primary" onClick={() => resolveIssue(issue.id)}>
                    Resolve issue
                  </button>
                )}
                {issue.status?.toLowerCase() === "resolved" && (
                  <span className="resolved-badge">Resolved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Issues;
