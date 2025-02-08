-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS reuben_fitness_barracks;
USE reuben_fitness_barracks;
-- Drop existing tables if they exist
DROP TABLE IF EXISTS records;
DROP TABLE IF EXISTS members;
-- Create all tables in a single query
CREATE TABLE members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    rfid_tag VARCHAR(50) UNIQUE NOT NULL,
    membership_status ENUM('active', 'expired') NOT NULL DEFAULT 'active',
    expiration_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rfid_tag (rfid_tag),
    INDEX idx_membership_status (membership_status),
    INDEX idx_expiration_date (expiration_date)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    attendance_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_member_id (member_id),
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;