const db = require("../config/db");

// USER: create map issue
const createMapIssue = (req, res) => {
  const { description, latitude, longitude } = req.body;
  const user_id = req.user.id;

  if (!description || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ message: "Description, latitude and longitude are required" });
  }

  const sql = `
    INSERT INTO map_issues (user_id, description, latitude, longitude)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [user_id, description, latitude, longitude], (err, result) => {
    if (err) {
      console.error("Error creating map issue:", err);
      return res.status(500).json({ message: "Server error while creating map issue" });
    }

    res.status(201).json({
      message: "Map issue created successfully",
      issueId: result.insertId,
    });
  });
};

// USER: get my map issues
const getMyMapIssues = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT *
    FROM map_issues
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching user map issues:", err);
      return res.status(500).json({ message: "Server error while fetching map issues" });
    }

    res.json(results);
  });
};

// ADMIN: get all map issues
const getAllMapIssues = (req, res) => {
  const sql = `
    SELECT *
    FROM map_issues
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all map issues:", err);
      return res.status(500).json({ message: "Server error while fetching all map issues" });
    }

    res.json(results);
  });
};

// ADMIN: assign collector
const assignCollectorToMapIssue = (req, res) => {
  const { id } = req.params;
  const { assigned_collector_id } = req.body;

  if (!assigned_collector_id) {
    return res.status(400).json({ message: "assigned_collector_id is required" });
  }

  const sql = `
    UPDATE map_issues
    SET assigned_collector_id = ?, status = 'assigned'
    WHERE id = ?
  `;

  db.query(sql, [assigned_collector_id, id], (err, result) => {
    if (err) {
      console.error("Error assigning collector:", err);
      return res.status(500).json({ message: "Server error while assigning collector" });
    }

    res.json({ message: "Collector assigned successfully" });
  });
};

// COLLECTOR: get assigned map issues
const getCollectorMapIssues = (req, res) => {
  const collector_id = req.user.id;

  const sql = `
    SELECT *
    FROM map_issues
    WHERE assigned_collector_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [collector_id], (err, results) => {
    if (err) {
      console.error("Error fetching collector map issues:", err);
      return res.status(500).json({ message: "Server error while fetching assigned map issues" });
    }

    res.json(results);
  });
};

// COLLECTOR: update status
const updateMapIssueStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const collector_id = req.user.id;

  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  const sql = `
    UPDATE map_issues
    SET status = ?
    WHERE id = ? AND assigned_collector_id = ?
  `;

  db.query(sql, [status, id, collector_id], (err, result) => {
    if (err) {
      console.error("Error updating map issue status:", err);
      return res.status(500).json({ message: "Server error while updating status" });
    }

    res.json({ message: "Map issue status updated successfully" });
  });
};

module.exports = {
  createMapIssue,
  getMyMapIssues,
  getAllMapIssues,
  assignCollectorToMapIssue,
  getCollectorMapIssues,
  updateMapIssueStatus,
};