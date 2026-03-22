CREATE DATABASE IF NOT EXISTS track_trash;
USE track_trash;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'collector', 'user') NOT NULL DEFAULT 'user',
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  current_fill INT NOT NULL DEFAULT 0,
  latest_distance_cm DECIMAL(10, 2) NULL,
  sensor_status VARCHAR(20) NULL,
  status ENUM('empty', 'active', 'full') NOT NULL DEFAULT 'empty',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensor_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bin_id INT NOT NULL,
  fill_level INT NOT NULL,
  distance_cm DECIMAL(10, 2) NULL,
  sensor_status VARCHAR(20) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bin_id INT NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bin_id INT NOT NULL,
  collector_id INT NOT NULL,
  status ENUM('pending', 'collected') NOT NULL DEFAULT 'pending',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  collected_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE,
  FOREIGN KEY (collector_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  bin_id INT NOT NULL,
  issue_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('open', 'resolved') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS map_issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  description TEXT NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  assigned_collector_id INT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_collector_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT IGNORE INTO users (id, name, email, password, role)
VALUES
  (1, 'Admin', 'admin@tracktrash.local', '$2b$10$7sU4FqV0QGmS4X8V8m3bXe7kJ7Y0x3QmYx8m0Qb8xwzG4uR4fEw2G', 'admin'),
  (2, 'Collector One', 'collector@tracktrash.local', '$2b$10$7sU4FqV0QGmS4X8V8m3bXe7kJ7Y0x3QmYx8m0Qb8xwzG4uR4fEw2G', 'collector'),
  (3, 'User One', 'user@tracktrash.local', '$2b$10$7sU4FqV0QGmS4X8V8m3bXe7kJ7Y0x3QmYx8m0Qb8xwzG4uR4fEw2G', 'user');

INSERT IGNORE INTO bins (id, location, capacity, current_fill, status)
VALUES
  (1, 'Main Street', 100, 0, 'empty'),
  (2, 'Central Park', 120, 45, 'active'),
  (3, 'Market Road', 90, 85, 'full');
