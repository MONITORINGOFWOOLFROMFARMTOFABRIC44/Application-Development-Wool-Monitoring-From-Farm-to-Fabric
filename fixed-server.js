const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3005;

// Simple MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wool_monitoring',
    port: 3306
});

// Connect and create database/tables
db.connect((err) => {
    if (err) {
        console.log('Creating database...');
        const rootDb = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            port: 3306
        });
        
        rootDb.query('CREATE DATABASE IF NOT EXISTS wool_monitoring', (err) => {
            if (!err) {
                rootDb.query('USE wool_monitoring', () => {
                    createTables(rootDb);
                });
            }
        });
    } else {
        console.log('✅ Connected to MySQL');
        createTables(db);
    }
});

function createTables(connection) {
    const tables = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(15),
            address TEXT,
            aadhaar VARCHAR(12),
            pan VARCHAR(10),
            role VARCHAR(20) DEFAULT 'farmer',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS farms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            location VARCHAR(255) NOT NULL,
            area DECIMAL(10,2) DEFAULT 0,
            latitude DECIMAL(10,8) DEFAULT 0,
            longitude DECIMAL(11,8) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS animals (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            tag_id VARCHAR(50) UNIQUE NOT NULL,
            type VARCHAR(20) NOT NULL,
            breed VARCHAR(50),
            age INT DEFAULT 0,
            health_status VARCHAR(20) DEFAULT 'good',
            photo_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS wool_quality (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            animal_id INT,
            grade VARCHAR(5) NOT NULL,
            fiber_diameter DECIMAL(5,2) DEFAULT 0,
            staple_length DECIMAL(5,2) DEFAULT 0,
            moisture_content DECIMAL(5,2) DEFAULT 0,
            test_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS supply_chain (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            batch_id VARCHAR(50) NOT NULL,
            stage VARCHAR(50) NOT NULL,
            location VARCHAR(255),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            notes TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS certificates (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            certificate_type VARCHAR(20) NOT NULL,
            certificate_number VARCHAR(100) UNIQUE NOT NULL,
            issue_date DATE NOT NULL,
            expiry_date DATE NOT NULL,
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS market_prices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            grade VARCHAR(5) NOT NULL,
            price_per_kg DECIMAL(10,2) NOT NULL,
            date DATE NOT NULL,
            market_location VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    tables.forEach(table => {
        connection.query(table, (err) => {
            if (err) console.log('Table error:', err.message);
        });
    });
    
    console.log('✅ Tables created/verified');
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'wool_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const upload = multer({ dest: 'public/uploads/' });

// FARMS - Dynamic Storage
app.post('/api/farms', (req, res) => {
    const { name, location, area, latitude, longitude } = req.body;
    const userId = req.session.userId || 1;
    
    const query = 'INSERT INTO farms (user_id, name, location, area, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [userId, name, location, parseFloat(area) || 0, parseFloat(latitude) || 0, parseFloat(longitude) || 0];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.log('Farm insert error:', err);
            return res.json({ error: 'Failed to add farm' });
        }
        console.log('✅ Farm added:', result.insertId);
        res.json({ message: 'Farm added successfully', farmId: result.insertId });
    });
});

app.get('/api/farms', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM farms WHERE user_id = ?', [userId], (err, results) => {
        if (err) console.log('Farm fetch error:', err);
        res.json(results || []);
    });
});

// ANIMALS - Dynamic Storage
app.post('/api/animals', upload.single('photo'), (req, res) => {
    const { tag_id, type, breed, age, health_status } = req.body;
    const userId = req.session.userId || 1;
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const query = 'INSERT INTO animals (user_id, tag_id, type, breed, age, health_status, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [userId, tag_id, type, breed || '', parseInt(age) || 0, health_status || 'good', photo_url];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.log('Animal insert error:', err);
            return res.json({ error: 'Failed to add animal' });
        }
        console.log('✅ Animal added:', result.insertId);
        res.json({ message: 'Animal added successfully', animalId: result.insertId });
    });
});

app.get('/api/animals', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM animals WHERE user_id = ?', [userId], (err, results) => {
        if (err) console.log('Animal fetch error:', err);
        res.json(results || []);
    });
});

// WOOL QUALITY - Dynamic Storage
app.post('/api/wool-quality', (req, res) => {
    const { animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date } = req.body;
    const userId = req.session.userId || 1;
    
    const query = 'INSERT INTO wool_quality (user_id, animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [userId, parseInt(animal_id) || null, grade, parseFloat(fiber_diameter) || 0, parseFloat(staple_length) || 0, parseFloat(moisture_content) || 0, test_date];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.log('Wool quality insert error:', err);
            return res.json({ error: 'Failed to record test' });
        }
        console.log('✅ Wool test added:', result.insertId);
        res.json({ message: 'Wool test recorded successfully', testId: result.insertId });
    });
});

app.get('/api/wool-quality', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM wool_quality WHERE user_id = ?', [userId], (err, results) => {
        if (err) console.log('Wool quality fetch error:', err);
        res.json(results || []);
    });
});

// SUPPLY CHAIN - Dynamic Storage
app.post('/api/supply-chain', (req, res) => {
    const { batch_id, stage, location, notes } = req.body;
    const userId = req.session.userId || 1;
    
    const query = 'INSERT INTO supply_chain (user_id, batch_id, stage, location, notes) VALUES (?, ?, ?, ?, ?)';
    const values = [userId, batch_id, stage, location || '', notes || ''];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.log('Supply chain insert error:', err);
            return res.json({ error: 'Failed to update supply chain' });
        }
        console.log('✅ Supply chain updated:', result.insertId);
        res.json({ message: 'Supply chain updated successfully', updateId: result.insertId });
    });
});

app.get('/api/supply-chain', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM supply_chain WHERE user_id = ? ORDER BY timestamp DESC', [userId], (err, results) => {
        if (err) console.log('Supply chain fetch error:', err);
        res.json(results || []);
    });
});

// MARKET PRICES - Dynamic Storage
app.post('/api/market-prices', (req, res) => {
    const { grade, price_per_kg, market_location } = req.body;
    
    const query = 'INSERT INTO market_prices (grade, price_per_kg, date, market_location) VALUES (?, ?, CURDATE(), ?)';
    const values = [grade, parseFloat(price_per_kg), market_location || 'Unknown'];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.log('Market price insert error:', err);
            return res.json({ error: 'Failed to update price' });
        }
        console.log('✅ Market price updated:', result.insertId);
        res.json({ message: 'Market price updated successfully', priceId: result.insertId });
    });
});

app.get('/api/market-prices', (req, res) => {
    db.query('SELECT * FROM market_prices ORDER BY date DESC LIMIT 20', (err, results) => {
        if (err) console.log('Market price fetch error:', err);
        res.json(results || []);
    });
});

// User registration
app.post('/api/signup', async (req, res) => {
    const { name, email, password, phone, address, aadhaar, pan } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, password, phone, address, aadhaar, pan) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        db.query(query, [name, email, hashedPassword, phone, address, aadhaar, pan], (err, result) => {
            if (err) {
                console.log('User signup error:', err);
                return res.json({ error: 'Registration failed' });
            }
            
            req.session.userId = result.insertId;
            req.session.userEmail = email;
            console.log('✅ User registered:', result.insertId);
            res.json({ message: 'User registered successfully', userId: result.insertId });
        });
    } catch (error) {
        res.json({ error: 'Server error' });
    }
});

// User login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.json({ error: 'Invalid credentials' });
        }
        
        const user = results[0];
        const isValid = await bcrypt.compare(password, user.password);
        
        if (isValid) {
            req.session.userId = user.id;
            req.session.userEmail = user.email;
            console.log('✅ User logged in:', user.id);
            res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
        } else {
            res.json({ error: 'Invalid credentials' });
        }
    });
});

// Dashboard data
app.get('/api/dashboard', (req, res) => {
    const userId = req.session.userId || 1;
    
    const queries = {
        farms: 'SELECT COUNT(*) as count FROM farms WHERE user_id = ?',
        animals: 'SELECT COUNT(*) as count FROM animals WHERE user_id = ?',
        woolTests: 'SELECT COUNT(*) as count FROM wool_quality WHERE user_id = ?',
        supplyChain: 'SELECT COUNT(*) as count FROM supply_chain WHERE user_id = ?'
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

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📊 All data will be stored DYNAMICALLY in MySQL');
    console.log('✅ Ready for dynamic operations');
});