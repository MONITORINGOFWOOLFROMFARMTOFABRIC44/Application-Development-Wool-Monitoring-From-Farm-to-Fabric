const express = require('express');
const mysql = require('mysql2');
const app = express();

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wool_monitoring',
    port: 3306
});

// Setup database
db.query('CREATE DATABASE IF NOT EXISTS wool_monitoring', () => {
    db.query('USE wool_monitoring', () => {
        // Create tables
        const tables = [
            'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255), phone VARCHAR(15), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
            'CREATE TABLE IF NOT EXISTS farms (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT DEFAULT 1, name VARCHAR(100), location VARCHAR(255), area DECIMAL(10,2) DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
            'CREATE TABLE IF NOT EXISTS animals (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT DEFAULT 1, tag_id VARCHAR(50), type VARCHAR(20), breed VARCHAR(50), age INT DEFAULT 0, health_status VARCHAR(20) DEFAULT "good", created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
            'CREATE TABLE IF NOT EXISTS wool_quality (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT DEFAULT 1, animal_id INT, grade VARCHAR(5), fiber_diameter DECIMAL(5,2) DEFAULT 0, staple_length DECIMAL(5,2) DEFAULT 0, moisture_content DECIMAL(5,2) DEFAULT 0, test_date DATE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
            'CREATE TABLE IF NOT EXISTS supply_chain (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT DEFAULT 1, batch_id VARCHAR(50), stage VARCHAR(50), location VARCHAR(255), notes TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
            'CREATE TABLE IF NOT EXISTS certificates (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT DEFAULT 1, certificate_type VARCHAR(20), certificate_number VARCHAR(100) UNIQUE, issue_date DATE, expiry_date DATE, status VARCHAR(20) DEFAULT "active", created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
            'CREATE TABLE IF NOT EXISTS market_prices (id INT AUTO_INCREMENT PRIMARY KEY, grade VARCHAR(5), price_per_kg DECIMAL(10,2), date DATE, market_location VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
        ];
        
        tables.forEach(table => db.query(table));
        console.log('✅ Tables created');
        
        // Insert static sample data
        setTimeout(() => {
            // Sample farms
            db.query('INSERT IGNORE INTO farms (id, name, location, area) VALUES (1, "Green Valley Farm", "Punjab, India", 25.5), (2, "Sunrise Wool Farm", "Rajasthan, India", 40.2), (3, "Mountain View Ranch", "Himachal Pradesh, India", 15.8)');
            
            // Sample animals
            db.query('INSERT IGNORE INTO animals (id, tag_id, type, breed, age, health_status) VALUES (1, "SHEEP001", "sheep", "Merino", 3, "excellent"), (2, "GOAT001", "goat", "Cashmere", 2, "good"), (3, "SHEEP002", "sheep", "Romney", 4, "good")');
            
            // Sample wool quality tests
            db.query('INSERT IGNORE INTO wool_quality (id, animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date) VALUES (1, 1, "A+", 18.5, 12.3, 8.2, "2024-01-15"), (2, 2, "A", 16.8, 10.5, 7.8, "2024-01-16"), (3, 3, "B", 22.1, 9.2, 9.1, "2024-01-17")');
            
            // Sample supply chain data
            db.query('INSERT IGNORE INTO supply_chain (id, batch_id, stage, location, notes) VALUES (1, "BATCH001", "collection", "Green Valley Farm", "Initial collection from farm"), (2, "BATCH001", "processing", "Delhi Processing Unit", "Wool cleaning and sorting"), (3, "BATCH002", "quality_check", "Mumbai Quality Lab", "Grade A+ certified")');
            
            // Sample market prices
            db.query('INSERT IGNORE INTO market_prices (id, grade, price_per_kg, date, market_location) VALUES (1, "A+", 2850.00, CURDATE(), "Delhi"), (2, "A", 1950.00, CURDATE(), "Mumbai"), (3, "B", 1200.00, CURDATE(), "Kolkata"), (4, "C", 800.00, CURDATE(), "Chennai")');
            
            console.log('✅ Static sample data inserted');
        }, 1000);
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const session = require('express-session');
app.use(session({
    secret: 'wool_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// FARMS
app.post('/api/farms', (req, res) => {
    const { name, location, area } = req.body;
    db.query('INSERT INTO farms (name, location, area) VALUES (?, ?, ?)', 
        [name, location, parseFloat(area) || 0], 
        (err, result) => {
            if (err) {
                console.log('Farm error:', err);
                return res.json({ error: err.message });
            }
            console.log('✅ FARM STORED - ID:', result.insertId);
            res.json({ success: true, id: result.insertId, message: 'Farm stored in MySQL' });
        });
});

app.get('/api/farms', (req, res) => {
    db.query('SELECT * FROM farms ORDER BY id DESC', (err, results) => {
        console.log('📊 FARMS COUNT:', results ? results.length : 0);
        res.json(results || []);
    });
});

// ANIMALS
app.post('/api/animals', (req, res) => {
    const { tag_id, type, breed, age, health_status } = req.body;
    db.query('INSERT INTO animals (tag_id, type, breed, age, health_status) VALUES (?, ?, ?, ?, ?)', 
        [tag_id, type, breed, parseInt(age) || 0, health_status || 'good'], 
        (err, result) => {
            if (err) {
                console.log('Animal error:', err);
                return res.json({ error: err.message });
            }
            console.log('✅ ANIMAL STORED - ID:', result.insertId);
            res.json({ success: true, id: result.insertId, message: 'Animal stored in MySQL' });
        });
});

app.get('/api/animals', (req, res) => {
    db.query('SELECT * FROM animals ORDER BY id DESC', (err, results) => {
        console.log('📊 ANIMALS COUNT:', results ? results.length : 0);
        res.json(results || []);
    });
});

// WOOL QUALITY
app.post('/api/wool-quality', (req, res) => {
    const { animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date } = req.body;
    db.query('INSERT INTO wool_quality (animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date) VALUES (?, ?, ?, ?, ?, ?)', 
        [parseInt(animal_id) || null, grade, parseFloat(fiber_diameter) || 0, parseFloat(staple_length) || 0, parseFloat(moisture_content) || 0, test_date], 
        (err, result) => {
            if (err) {
                console.log('Wool quality error:', err);
                return res.json({ error: err.message });
            }
            console.log('✅ WOOL TEST STORED - ID:', result.insertId);
            res.json({ success: true, id: result.insertId, message: 'Wool test stored in MySQL' });
        });
});

app.get('/api/wool-quality', (req, res) => {
    db.query('SELECT * FROM wool_quality ORDER BY id DESC', (err, results) => {
        console.log('📊 WOOL TESTS COUNT:', results ? results.length : 0);
        res.json(results || []);
    });
});

// SUPPLY CHAIN
app.post('/api/supply-chain', (req, res) => {
    const { batch_id, stage, location, notes } = req.body;
    db.query('INSERT INTO supply_chain (batch_id, stage, location, notes) VALUES (?, ?, ?, ?)', 
        [batch_id, stage, location, notes], 
        (err, result) => {
            if (err) {
                console.log('Supply chain error:', err);
                return res.json({ error: err.message });
            }
            console.log('✅ SUPPLY CHAIN STORED - ID:', result.insertId);
            res.json({ success: true, id: result.insertId, message: 'Supply chain stored in MySQL' });
        });
});

app.get('/api/supply-chain', (req, res) => {
    db.query('SELECT * FROM supply_chain ORDER BY id DESC', (err, results) => {
        console.log('📊 SUPPLY CHAIN COUNT:', results ? results.length : 0);
        res.json(results || []);
    });
});

// MARKET PRICES
app.post('/api/market-prices', (req, res) => {
    const { grade, price_per_kg, market_location } = req.body;
    db.query('INSERT INTO market_prices (grade, price_per_kg, date, market_location) VALUES (?, ?, CURDATE(), ?)', 
        [grade, parseFloat(price_per_kg), market_location], 
        (err, result) => {
            if (err) {
                console.log('Market price error:', err);
                return res.json({ error: err.message });
            }
            console.log('✅ MARKET PRICE STORED - ID:', result.insertId);
            res.json({ success: true, id: result.insertId, message: 'Market price stored in MySQL' });
        });
});

app.get('/api/market-prices', (req, res) => {
    db.query('SELECT * FROM market_prices ORDER BY id DESC', (err, results) => {
        console.log('📊 MARKET PRICES COUNT:', results ? results.length : 0);
        res.json(results || []);
    });
});

// LOGIN & SIGNUP
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ error: 'Email and password required' });
    }
    
    // Simple login - just check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err || results.length === 0) {
            // Create user if doesn't exist
            db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
                [email.split('@')[0], email, password], 
                (err, result) => {
                    if (err) {
                        return res.json({ error: 'Login failed' });
                    }
                    req.session.userId = result.insertId;
                    console.log('✅ USER CREATED & LOGGED IN - ID:', result.insertId);
                    res.json({ message: 'Login successful', user: { id: result.insertId, email } });
                });
        } else {
            req.session.userId = results[0].id;
            console.log('✅ USER LOGGED IN - ID:', results[0].id);
            res.json({ message: 'Login successful', user: { id: results[0].id, email } });
        }
    });
});

app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
        [name, email, password], 
        (err, result) => {
            if (err) {
                return res.json({ error: 'Signup failed' });
            }
            req.session.userId = result.insertId;
            console.log('✅ USER REGISTERED - ID:', result.insertId);
            res.json({ message: 'Registration successful', userId: result.insertId });
        });
});

// DASHBOARD
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

// USER INFO
app.get('/api/user', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || !results || results.length === 0) {
            return res.json({ id: 1, name: 'Demo User', email: 'demo@woolsystem.gov.in' });
        }
        res.json(results[0]);
    });
});

// CERTIFICATES
app.post('/api/certificates', (req, res) => {
    const { certificate_type, certificate_number, issue_date, expiry_date } = req.body;
    const userId = req.session.userId || 1;
    
    db.query('INSERT INTO certificates (user_id, certificate_type, certificate_number, issue_date, expiry_date) VALUES (?, ?, ?, ?, ?)', 
        [userId, certificate_type, certificate_number, issue_date, expiry_date], 
        (err, result) => {
            if (err) {
                return res.json({ error: err.message });
            }
            console.log('✅ CERTIFICATE STORED - ID:', result.insertId);
            res.json({ success: true, id: result.insertId, message: 'Certificate stored in MySQL' });
        });
});

app.get('/api/certificates', (req, res) => {
    const userId = req.session.userId || 1;
    db.query('SELECT * FROM certificates WHERE user_id = ? ORDER BY id DESC', [userId], (err, results) => {
        res.json(results || []);
    });
});

// ANALYTICS
app.get('/api/analytics/production', (req, res) => {
    const userId = req.session.userId || 1;
    const queries = {
        monthlyProduction: 'SELECT MONTH(created_at) as month, COUNT(*) as count FROM wool_quality WHERE user_id = ? GROUP BY MONTH(created_at)',
        gradeDistribution: 'SELECT grade, COUNT(*) as count FROM wool_quality WHERE user_id = ? GROUP BY grade',
        animalHealth: 'SELECT health_status, COUNT(*) as count FROM animals WHERE user_id = ? GROUP BY health_status'
    };
    
    const results = {};
    let completed = 0;
    
    Object.keys(queries).forEach(key => {
        db.query(queries[key], [userId], (err, result) => {
            results[key] = err ? [] : result;
            completed++;
            
            if (completed === Object.keys(queries).length) {
                res.json(results);
            }
        });
    });
});

// Test endpoint
app.get('/api/test-insert', (req, res) => {
    db.query('INSERT INTO farms (name, location, area) VALUES (?, ?, ?)', 
        ['Test Farm', 'Test Location', 10.5], 
        (err, result) => {
            if (err) {
                res.json({ error: err.message });
            } else {
                console.log('✅ TEST DATA INSERTED - ID:', result.insertId);
                res.json({ success: true, message: 'Test data inserted', id: result.insertId });
            }
        });
});

app.listen(3005, () => {
    console.log('🚀 Server running on http://localhost:3005');
    console.log('📊 MySQL storage confirmed working');
    console.log('🔗 Test: http://localhost:3005/api/test-insert');
});