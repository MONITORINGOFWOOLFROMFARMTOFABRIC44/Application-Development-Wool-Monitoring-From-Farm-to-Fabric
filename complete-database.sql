-- Create database
CREATE DATABASE IF NOT EXISTS wool_monitoring;
USE wool_monitoring;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    aadhaar VARCHAR(12) UNIQUE,
    pan VARCHAR(10) UNIQUE,
    role ENUM('farmer', 'admin', 'officer') DEFAULT 'farmer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farms table
CREATE TABLE IF NOT EXISTS farms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL DEFAULT 1,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    area DECIMAL(10,2),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Animals table
CREATE TABLE IF NOT EXISTS animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL DEFAULT 1,
    tag_id VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('sheep', 'goat') NOT NULL,
    breed VARCHAR(50),
    age INT,
    health_status ENUM('excellent', 'good', 'fair', 'poor') DEFAULT 'good',
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wool quality table
CREATE TABLE IF NOT EXISTS wool_quality (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL DEFAULT 1,
    animal_id INT,
    grade ENUM('A+', 'A', 'B', 'C') NOT NULL,
    fiber_diameter DECIMAL(5,2),
    staple_length DECIMAL(5,2),
    moisture_content DECIMAL(5,2),
    test_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supply chain table
CREATE TABLE IF NOT EXISTS supply_chain (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL DEFAULT 1,
    batch_id VARCHAR(50) NOT NULL,
    stage ENUM('collection', 'processing', 'quality_check', 'packaging', 'shipping', 'delivered') NOT NULL,
    location VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL DEFAULT 1,
    certificate_type ENUM('quality', 'organic', 'export') NOT NULL,
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market prices table
CREATE TABLE IF NOT EXISTS market_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grade ENUM('A+', 'A', 'B', 'C') NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    market_location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STATIC DATA INSERTION (Sample/Demo Data)

-- Insert sample users
INSERT IGNORE INTO users (id, name, email, password, phone, address, aadhaar, pan, role) VALUES
(1, 'Admin User', 'admin@wool.gov.in', '$2b$10$rQZ8kHWiZ8.vKxF5kGxHKOqJ5kJ5kJ5kJ5kJ5kJ5kJ5kJ5kJ5kJ5k', '9876543210', 'New Delhi, India', '123456789012', 'ABCDE1234F', 'admin'),
(2, 'Farmer John', 'farmer1@woolsystem.gov.in', 'password123', '9876543211', 'Punjab, India', '123456789013', 'ABCDE1234G', 'farmer'),
(3, 'Officer Smith', 'officer1@woolsystem.gov.in', 'password123', '9876543212', 'Mumbai, India', '123456789014', 'ABCDE1234H', 'officer');

-- Insert sample farms (STATIC)
INSERT IGNORE INTO farms (id, user_id, name, location, area, latitude, longitude) VALUES 
(1, 1, 'Green Valley Farm', 'Punjab, India', 25.5, 30.7333, 76.7794),
(2, 1, 'Sunrise Wool Farm', 'Rajasthan, India', 40.2, 26.9124, 75.7873),
(3, 2, 'Mountain View Ranch', 'Himachal Pradesh, India', 15.8, 31.1048, 77.1734),
(4, 2, 'Golden Fleece Farm', 'Gujarat, India', 35.0, 23.0225, 72.5714),
(5, 3, 'Highland Wool Estate', 'Kashmir, India', 50.3, 34.0837, 74.7973);

-- Insert sample animals (STATIC)
INSERT IGNORE INTO animals (id, user_id, tag_id, type, breed, age, health_status) VALUES 
(1, 1, 'SHEEP001', 'sheep', 'Merino', 3, 'excellent'),
(2, 1, 'GOAT001', 'goat', 'Cashmere', 2, 'good'),
(3, 2, 'SHEEP002', 'sheep', 'Romney', 4, 'good'),
(4, 2, 'SHEEP003', 'sheep', 'Corriedale', 2, 'excellent'),
(5, 3, 'GOAT002', 'goat', 'Angora', 3, 'fair'),
(6, 1, 'SHEEP004', 'sheep', 'Leicester', 5, 'good'),
(7, 2, 'GOAT003', 'goat', 'Mohair', 1, 'excellent');

-- Insert sample wool quality tests (STATIC)
INSERT IGNORE INTO wool_quality (id, user_id, animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date) VALUES 
(1, 1, 1, 'A+', 18.5, 12.3, 8.2, '2024-01-15'),
(2, 1, 2, 'A', 16.8, 10.5, 7.8, '2024-01-16'),
(3, 2, 3, 'B', 22.1, 9.2, 9.1, '2024-01-17'),
(4, 2, 4, 'A+', 19.2, 11.8, 8.0, '2024-01-18'),
(5, 3, 5, 'A', 17.5, 10.8, 8.5, '2024-01-19'),
(6, 1, 6, 'B', 21.3, 9.5, 9.3, '2024-01-20'),
(7, 2, 7, 'A+', 18.0, 12.1, 7.9, '2024-01-21');

-- Insert sample supply chain data (STATIC)
INSERT IGNORE INTO supply_chain (id, user_id, batch_id, stage, location, notes) VALUES 
(1, 1, 'BATCH001', 'collection', 'Green Valley Farm', 'Initial collection from farm'),
(2, 1, 'BATCH001', 'processing', 'Delhi Processing Unit', 'Wool cleaning and sorting'),
(3, 1, 'BATCH001', 'quality_check', 'Mumbai Quality Lab', 'Grade A+ certified'),
(4, 2, 'BATCH002', 'collection', 'Mountain View Ranch', 'Premium wool collection'),
(5, 2, 'BATCH002', 'processing', 'Ludhiana Mill', 'Advanced processing'),
(6, 3, 'BATCH003', 'collection', 'Highland Wool Estate', 'Cashmere collection'),
(7, 1, 'BATCH001', 'packaging', 'Delhi Packaging Center', 'Ready for shipment'),
(8, 2, 'BATCH002', 'shipping', 'Mumbai Port', 'Export shipment');

-- Insert sample certificates (STATIC)
INSERT IGNORE INTO certificates (id, user_id, certificate_type, certificate_number, issue_date, expiry_date, status) VALUES
(1, 1, 'quality', 'QC2024001', '2024-01-15', '2025-01-15', 'active'),
(2, 2, 'organic', 'ORG2024001', '2024-01-16', '2025-01-16', 'active'),
(3, 3, 'export', 'EXP2024001', '2024-01-17', '2025-01-17', 'active'),
(4, 1, 'quality', 'QC2024002', '2024-01-18', '2025-01-18', 'active'),
(5, 2, 'export', 'EXP2024002', '2024-01-19', '2025-01-19', 'active');

-- Insert sample market prices (STATIC)
INSERT IGNORE INTO market_prices (id, grade, price_per_kg, date, market_location) VALUES 
(1, 'A+', 2850.00, CURDATE(), 'Delhi'),
(2, 'A', 1950.00, CURDATE(), 'Delhi'),
(3, 'B', 1200.00, CURDATE(), 'Delhi'),
(4, 'C', 800.00, CURDATE(), 'Delhi'),
(5, 'A+', 2900.00, CURDATE(), 'Mumbai'),
(6, 'A', 2000.00, CURDATE(), 'Mumbai'),
(7, 'B', 1250.00, CURDATE(), 'Kolkata'),
(8, 'C', 850.00, CURDATE(), 'Chennai'),
(9, 'A+', 2800.00, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Delhi'),
(10, 'A', 1900.00, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Mumbai');

-- DYNAMIC DATA PROCEDURES (For Runtime Insertion)

DELIMITER //

-- Procedure to add farm dynamically
CREATE PROCEDURE IF NOT EXISTS AddFarm(
    IN p_user_id INT,
    IN p_name VARCHAR(100),
    IN p_location VARCHAR(255),
    IN p_area DECIMAL(10,2),
    IN p_latitude DECIMAL(10,8),
    IN p_longitude DECIMAL(11,8)
)
BEGIN
    INSERT INTO farms (user_id, name, location, area, latitude, longitude) 
    VALUES (p_user_id, p_name, p_location, p_area, p_latitude, p_longitude);
    SELECT LAST_INSERT_ID() as farm_id, 'Farm added successfully' as message;
END //

-- Procedure to add animal dynamically
CREATE PROCEDURE IF NOT EXISTS AddAnimal(
    IN p_user_id INT,
    IN p_tag_id VARCHAR(50),
    IN p_type ENUM('sheep', 'goat'),
    IN p_breed VARCHAR(50),
    IN p_age INT,
    IN p_health_status ENUM('excellent', 'good', 'fair', 'poor')
)
BEGIN
    INSERT INTO animals (user_id, tag_id, type, breed, age, health_status) 
    VALUES (p_user_id, p_tag_id, p_type, p_breed, p_age, p_health_status);
    SELECT LAST_INSERT_ID() as animal_id, 'Animal added successfully' as message;
END //

-- Procedure to add wool quality test dynamically
CREATE PROCEDURE IF NOT EXISTS AddWoolQuality(
    IN p_user_id INT,
    IN p_animal_id INT,
    IN p_grade ENUM('A+', 'A', 'B', 'C'),
    IN p_fiber_diameter DECIMAL(5,2),
    IN p_staple_length DECIMAL(5,2),
    IN p_moisture_content DECIMAL(5,2),
    IN p_test_date DATE
)
BEGIN
    INSERT INTO wool_quality (user_id, animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date) 
    VALUES (p_user_id, p_animal_id, p_grade, p_fiber_diameter, p_staple_length, p_moisture_content, p_test_date);
    SELECT LAST_INSERT_ID() as test_id, 'Wool quality test added successfully' as message;
END //

-- Procedure to add supply chain update dynamically
CREATE PROCEDURE IF NOT EXISTS AddSupplyChain(
    IN p_user_id INT,
    IN p_batch_id VARCHAR(50),
    IN p_stage ENUM('collection', 'processing', 'quality_check', 'packaging', 'shipping', 'delivered'),
    IN p_location VARCHAR(255),
    IN p_notes TEXT
)
BEGIN
    INSERT INTO supply_chain (user_id, batch_id, stage, location, notes) 
    VALUES (p_user_id, p_batch_id, p_stage, p_location, p_notes);
    SELECT LAST_INSERT_ID() as update_id, 'Supply chain updated successfully' as message;
END //

-- Procedure to update market price dynamically
CREATE PROCEDURE IF NOT EXISTS UpdateMarketPrice(
    IN p_grade ENUM('A+', 'A', 'B', 'C'),
    IN p_price_per_kg DECIMAL(10,2),
    IN p_market_location VARCHAR(100)
)
BEGIN
    INSERT INTO market_prices (grade, price_per_kg, date, market_location) 
    VALUES (p_grade, p_price_per_kg, CURDATE(), p_market_location);
    SELECT LAST_INSERT_ID() as price_id, 'Market price updated successfully' as message;
END //

DELIMITER ;

-- EXAMPLE DYNAMIC CALLS (Uncomment to test)
-- CALL AddFarm(1, 'Dynamic Test Farm', 'Test Location', 20.5, 28.6139, 77.2090);
-- CALL AddAnimal(1, 'DYN001', 'sheep', 'Test Breed', 2, 'good');
-- CALL AddWoolQuality(1, 1, 'A', 20.0, 10.0, 8.0, CURDATE());
-- CALL AddSupplyChain(1, 'DYNBATCH001', 'collection', 'Dynamic Location', 'Dynamic test');
-- CALL UpdateMarketPrice('A+', 3000.00, 'Dynamic Market');

-- Verification queries
SELECT 'STATIC DATA LOADED:' as info;
SELECT COUNT(*) as users_count FROM users;
SELECT COUNT(*) as farms_count FROM farms;
SELECT COUNT(*) as animals_count FROM animals;
SELECT COUNT(*) as wool_tests_count FROM wool_quality;
SELECT COUNT(*) as supply_chain_count FROM supply_chain;
SELECT COUNT(*) as certificates_count FROM certificates;
SELECT COUNT(*) as market_prices_count FROM market_prices;