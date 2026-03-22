const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "track_trash",
});

db.connect((err) => {
  if (err) {
    console.error(
      `Database not connected: ${err.code || "UNKNOWN"} ${err.message}`
    );
  } else {
    console.log(
      `Database connected to ${process.env.DB_HOST || "localhost"}/${process.env.DB_NAME || "track_trash"}`
    );
  }
});

module.exports = db;
