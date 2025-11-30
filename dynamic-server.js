const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection pool for dynamic operations
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wool_monitoring',
    port: 3306,
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
});

// Test database connection and auto-create tables
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.log('Creating database and tables automatically...');
        createDatabaseAndTables();
    } else {
        console.log('✅ Connected to MySQL database successfully');
        connection.release();
        ensureTablesExist();
    }
});

// Auto-create database and tables
function createDatabaseAndTables() {
    const rootDb = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: 3306,
        multipleStatements: true
    });

    const setupQuery = `
        CREATE DATABASE IF NOT EXISTS wool_monitoring;
        USE wool_monitoring;
        
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
        
        CREATE TABLE IF NOT EXISTS farms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            location VARCHAR(255) NOT NULL,
            area DECIMAL(10,2),
            latitude DECIMAL(10,8),
            longitude DECIMAL(11,8),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS animals (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            tag_id VARCHAR(50) UNIQUE NOT NULL,
            type ENUM('sheep', 'goat') NOT NULL,
            breed VARCHAR(50),
            age INT,
            health_status ENUM('excellent', 'good', 'fair', 'poor') DEFAULT 'good',
            photo_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS wool_quality (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            animal_id INT,
            grade ENUM('A+', 'A', 'B', 'C') NOT NULL,
            fiber_diameter DECIMAL(5,2),
            staple_length DECIMAL(5,2),
            moisture_content DECIMAL(5,2),
            test_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE SET NULL
        );
        
        CREATE TABLE IF NOT EXISTS supply_chain (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            batch_id VARCHAR(50) NOT NULL,
            stage ENUM('collection', 'processing', 'quality_check', 'packaging', 'shipping', 'delivered') NOT NULL,
            location VARCHAR(255),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            notes TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS certificates (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            certificate_type ENUM('quality', 'organic', 'export') NOT NULL,
            certificate_number VARCHAR(100) UNIQUE NOT NULL,
            issue_date DATE NOT NULL,
            expiry_date DATE NOT NULL,
            status ENUM('active', 'expired', 'revoked') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS market_prices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            grade ENUM('A+', 'A', 'B', 'C') NOT NULL,
            price_per_kg DECIMAL(10,2) NOT NULL,
            date DATE NOT NULL,
            market_location VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        INSERT IGNORE INTO market_prices (grade, price_per_kg, date, market_location) VALUES
        ('A+', 2850.00, CURDATE(), 'Delhi'),
        ('A', 1950.00, CURDATE(), 'Delhi'),
        ('B', 1200.00, CURDATE(), 'Delhi'),
        ('C', 800.00, CURDATE(), 'Delhi');
    `;

    rootDb.query(setupQuery, (err) => {
        if (err) {
            console.error('Database setup error:', err);
        } else {
            console.log('✅ Database and tables created successfully');
        }
        rootDb.end();
    });
}

function ensureTablesExist() {
    db.query('SHOW TABLES', (err, results) => {
        if (err || results.length === 0) {
            createDatabaseAndTables();
        } else {
            console.log('✅ All database tables ready for dynamic operations');
        }
    });
}

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use(session({
    secret: 'wool_monitoring_secret_key_2024',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// File upload configuration
const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Dynamic user registration
app.post('/api/signup', async (req, res) => {
    const { name, email, password, phone, address, aadhaar, pan } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, password, phone, address, aadhaar, pan) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        db.query(query, [name, email, hashedPassword, phone, address, aadhaar, pan], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Registration failed' });
            }
            
            req.session.userId = result.insertId;
            req.session.userEmail = email;
            req.session.userName = name;
            
            res.json({ 
                message: 'User registered successfully', 
                userId: result.insertId,
                user: { id: result.insertId, name, email }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Dynamic user login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = results[0];
        const isValid = await bcrypt.compare(password, user.password);
        
        if (isValid) {
            req.session.userId = user.id;
            req.session.userEmail = user.email;
            req.session.userName = user.name;
            
            res.json({ 
                message: 'Login successful', 
                user: { 
                    id: user.id, 
                    name: user.name, 
                    email: user.email,
                    role: user.role 
                } 
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Dynamic farm registration
app.post('/api/farms', (req, res) => {
    const { name, location, area, latitude, longitude } = req.body;
    const userId = req.session.userId || 1;
    
    if (!name || !location) {
        return res.status(400).json({ error: 'Farm name and location required' });
    }
    
    const query = 'INSERT INTO farms (user_id, name, location, area, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [userId, name, location, area || 0, latitude || 0, longitude || 0], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to register farm' });
        }
        res.json({ message: 'Farm registered successfully', farmId: result.insertId });
    });
});

// Dynamic animal registration
app.post('/api/animals', upload.single('photo'), (req, res) => {
    const { tag_id, type, breed, age, health_status } = req.body;
    const userId = req.session.userId || 1;
    
    if (!tag_id || !type) {
        return res.status(400).json({ error: 'Tag ID and animal type required' });
    }
    
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    const query = 'INSERT INTO animals (user_id, tag_id, type, breed, age, health_status, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [userId, tag_id, type, breed, age, health_status || 'good', photo_url], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Tag ID already exists' });
            }
            return res.status(500).json({ error: 'Failed to register animal' });
        }
        res.json({ message: 'Animal registered successfully', animalId: result.insertId });
    });
});

// Dynamic wool quality testing
app.post('/api/wool-quality', (req, res) => {
    const { animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date } = req.body;
    const userId = req.session.userId || 1;
    
    if (!grade || !test_date) {
        return res.status(400).json({ error: 'Grade and test date required' });
    }
    
    const query = 'INSERT INTO wool_quality (user_id, animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [userId, animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to record test' });
        }
        res.json({ message: 'Wool quality test recorded successfully', testId: result.insertId });
    });
});

// Dynamic supply chain tracking
app.post('/api/supply-chain', (req, res) => {
    const { batch_id, stage, location, notes } = req.body;
    const userId = req.session.userId || 1;
    
    if (!batch_id || !stage) {
        return res.status(400).json({ error: 'Batch ID and stage required' });
    }
    
    const query = 'INSERT INTO supply_chain (user_id, batch_id, stage, location, notes) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [userId, batch_id, stage, location, notes], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update supply chain' });
        }
        res.json({ message: 'Supply chain updated successfully', updateId: result.insertId });
    });
});

// Dynamic certificate generation
app.post('/api/certificates', (req, res) => {
    const { certificate_type, certificate_number, issue_date, expiry_date } = req.body;
    const userId = req.session.userId || 1;
    
    if (!certificate_type || !certificate_number || !issue_date || !expiry_date) {
        return res.status(400).json({ error: 'All certificate fields required' });
    }
    
    const query = 'INSERT INTO certificates (user_id, certificate_type, certificate_number, issue_date, expiry_date) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [userId, certificate_type, certificate_number, issue_date, expiry_date], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Certificate number already exists' });
            }
            return res.status(500).json({ error: 'Failed to generate certificate' });
        }
        res.json({ message: 'Certificate generated successfully', certificateId: result.insertId });
    });
});

// Dynamic market price updates
app.post('/api/market-prices', (req, res) => {
    const { grade, price_per_kg, market_location } = req.body;
    
    if (!grade || !price_per_kg) {
        return res.status(400).json({ error: 'Grade and price required' });
    }
    
    const query = 'INSERT INTO market_prices (grade, price_per_kg, date, market_location) VALUES (?, ?, CURDATE(), ?)';
    
    db.query(query, [grade, price_per_kg, market_location || 'Unknown'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update price' });
        }
        res.json({ message: 'Market price updated successfully', priceId: result.insertId });
    });
});

// GET endpoints for retrieving dynamic data
app.get('/api/dashboard', (req, res) => {
    const userId = req.session.userId || 1;
    
    const queries = {
        farms: 'SELECT COUNT(*) as count FROM farms WHERE user_id = ?',
        animals: 'SELECT COUNT(*) as count FROM animals WHERE user_id = ?',
        woolTests: 'SELECT COUNT(*) as count FROM wool_quality WHERE user_id = ?',
        certificates: 'SELECT COUNT(*) as count FROM certificates WHERE user_id = ?'
    };
    
    const results = {};
    let completed = 0;
    
    Object.keys(queries).forEach(key => {
        db.query(queries[key], [userId], (err, result) => {
            results[key] = err ? 0 : (result[0]?.count || 0);
            completed++;
            
            if (completed === Object.keys(queries).length) {
                res.json(results);
            }
        });
    });
});

app.get('/api/farms', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM farms WHERE user_id = ?', [userId], (err, results) => {
        res.json(err ? [] : results);
    });
});

app.get('/api/animals', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM animals WHERE user_id = ?', [userId], (err, results) => {
        res.json(err ? [] : results);
    });
});

app.get('/api/wool-quality', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM wool_quality WHERE user_id = ?', [userId], (err, results) => {
        res.json(err ? [] : results);
    });
});

app.get('/api/supply-chain', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM supply_chain WHERE user_id = ? ORDER BY timestamp DESC', [userId], (err, results) => {
        res.json(err ? [] : results);
    });
});

app.get('/api/certificates', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM certificates WHERE user_id = ?', [userId], (err, results) => {
        res.json(err ? [] : results);
    });
});

app.get('/api/market-prices', (req, res) => {
    db.query('SELECT * FROM market_prices ORDER BY date DESC LIMIT 10', (err, results) => {
        res.json(err ? [] : results);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Wool Monitoring System running on http://localhost:${PORT}`);
    console.log(`📊 All data operations are DYNAMIC - stored directly in MySQL`);
    console.log(`🗄️  Database: wool_monitoring`);
    console.log(`✅ Ready to accept user registrations and data entries`);
});