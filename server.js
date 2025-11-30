// require('dotenv').config(); // Commented out for direct configuration
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// MySQL connection pool for better performance and reliability
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wool_monitoring',
    port: 3306,
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    multipleStatements: true
});

// Handle connection errors
db.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconnecting to database...');
        db.connect();
    } else {
        console.error('Database error:', err);
    }
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
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

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        // For API calls, return 401
        if (req.path.startsWith('/api/')) {
            res.status(401).json({ error: 'Authentication required' });
        } else {
            // For page requests, redirect to login
            res.redirect('/login.html');
        }
    }
};

const optionalAuth = (req, res, next) => {
    if (!req.session) req.session = {};
    if (!req.session.userId) req.session.userId = 1;
    next();
};

// Routes
// User registration with Aadhaar and PAN
app.post('/api/signup', async (req, res) => {
    const { name, email, password, phone, address, aadhaar, pan, farmName, farmLocation, landSize, farmType } = req.body;
    
    console.log('Signup attempt:', { name, email, phone, aadhaar, pan, farmName });
    
    // Validate required fields
    if (!name || !email || !password || !phone || !aadhaar || !pan) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Basic validation only - no multi-step verification
    if (aadhaar && aadhaar.length !== 12) {
        return res.status(400).json({ error: 'Aadhaar must be 12 digits' });
    }
    
    if (pan && pan.length !== 10) {
        return res.status(400).json({ error: 'PAN must be 10 characters' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userQuery = 'INSERT INTO users (name, email, password, phone, address, aadhaar, pan, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        
        db.query(userQuery, [name, email, hashedPassword, phone, address, aadhaar, pan, 'farmer'], (err, result) => {
            if (err) {
                console.error('Signup error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.sqlMessage.includes('email')) {
                        res.status(400).json({ error: 'Email already exists' });
                    } else if (err.sqlMessage.includes('aadhaar')) {
                        res.status(400).json({ error: 'Aadhaar number already registered' });
                    } else if (err.sqlMessage.includes('pan')) {
                        res.status(400).json({ error: 'PAN number already registered' });
                    } else {
                        res.status(400).json({ error: 'Email, Aadhaar, or PAN already exists' });
                    }
                } else {
                    res.status(500).json({ error: 'Database error: ' + err.message });
                }
                return;
            }
            
            const userId = result.insertId;
            console.log('User registered successfully:', userId);
            
            // Auto-login after successful registration
            req.session.userId = userId;
            req.session.userEmail = email;
            req.session.userName = name;
            
            // Register farm if farm details provided
            if (farmName && farmLocation) {
                const farmQuery = 'INSERT INTO farms (user_id, name, location, area, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)';
                const area = landSize || 0;
                const latitude = 0; // Default coordinates
                const longitude = 0;
                
                db.query(farmQuery, [userId, farmName, farmLocation, area, latitude, longitude], (farmErr, farmResult) => {
                    if (farmErr) {
                        console.error('Farm registration error:', farmErr);
                        // Still return success for user registration
                    } else {
                        console.log('Farm registered successfully:', farmResult.insertId);
                    }
                });
            }
            
            res.json({ 
                message: 'User registered successfully', 
                userId: userId,
                user: { id: userId, name, email }
            });
        });
    } catch (error) {
        console.error('Signup server error:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// User login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log('Login attempt:', email);
    
    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error: ' + err.message });
            return;
        }
        
        if (results.length === 0) {
            console.log('User not found:', email);
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        
        const user = results[0];
        console.log('User found:', user.email);
        
        try {
            const isValid = await bcrypt.compare(password, user.password);
            
            if (isValid) {
                req.session.userId = user.id;
                req.session.userEmail = user.email;
                req.session.userName = user.name;
                
                console.log('Login successful for:', user.email);
                
                res.json({ 
                    message: 'Login successful', 
                    user: { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email,
                        phone: user.phone,
                        aadhaar: user.aadhaar,
                        pan: user.pan,
                        role: user.role || 'farmer'
                    } 
                });
            } else {
                console.log('Invalid password for:', email);
                res.status(401).json({ error: 'Invalid email or password' });
            }
        } catch (bcryptError) {
            console.error('Bcrypt error:', bcryptError);
            res.status(500).json({ error: 'Authentication error: ' + bcryptError.message });
        }
    });
});

app.get('/api/dashboard', optionalAuth, (req, res) => {
    const userId = req.session.userId;
    const queries = {
        farms: 'SELECT COUNT(*) as count FROM farms WHERE user_id = ?',
        animals: 'SELECT COUNT(*) as count FROM animals WHERE user_id = ?',
        woolTests: 'SELECT COUNT(*) as count FROM wool_quality WHERE user_id = ?',
        certificates: 'SELECT COUNT(*) as count FROM certificates WHERE user_id = ?',
        user: 'SELECT name, email, phone, aadhaar, pan FROM users WHERE id = ?'
    };
    
    const results = { farms: 0, animals: 0, woolTests: 0, certificates: 0, user: {} };
    let completed = 0;
    
    Object.keys(queries).forEach(key => {
        db.query(queries[key], [userId], (err, result) => {
            if (!err && result) {
                if (key === 'user') {
                    results[key] = result[0] || {};
                } else {
                    results[key] = result[0]?.count || 0;
                }
            }
            completed++;
            
            if (completed === Object.keys(queries).length) {
                res.json(results);
            }
        });
    });
});

app.get('/api/user', optionalAuth, (req, res) => {
    const query = 'SELECT id, name, email, phone, address, aadhaar, pan, role FROM users WHERE id = ?';
    db.query(query, [req.session.userId], (err, results) => {
        if (err || !results || results.length === 0) {
            return res.json({ id: 1, name: 'Demo User', email: 'demo@woolsystem.gov.in', role: 'farmer' });
        }
        res.json(results[0]);
    });
});

app.get('/api/farms', optionalAuth, (req, res) => {
    const query = 'SELECT * FROM farms WHERE user_id = ?';
    db.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Farms error:', err);
            return res.json([]);
        }
        res.json(results || []);
    });
});

app.post('/api/farms', optionalAuth, (req, res) => {
    const { name, location, area, latitude, longitude } = req.body;
    
    if (!name || !location) {
        return res.json({ error: 'Name and location required' });
    }
    
    const query = 'INSERT INTO farms (user_id, name, location, area, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [req.session.userId, name, location, parseFloat(area) || 0, parseFloat(latitude) || 0, parseFloat(longitude) || 0];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Farm error:', err);
            return res.json({ error: 'Database error' });
        }
        res.json({ message: 'Farm registered successfully', farmId: result.insertId });
    });
});

app.get('/api/animals', optionalAuth, (req, res) => {
    const query = 'SELECT * FROM animals WHERE user_id = ?';
    db.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Animals error:', err);
            return res.json([]);
        }
        res.json(results || []);
    });
});

app.post('/api/animals', optionalAuth, upload.single('photo'), (req, res) => {
    const { tag_id, type, breed, age, health_status } = req.body;
    
    if (!tag_id || !type) {
        return res.json({ error: 'Tag ID and type required' });
    }
    
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    const query = 'INSERT INTO animals (user_id, tag_id, type, breed, age, health_status, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [req.session.userId, tag_id, type, breed || '', parseInt(age) || 0, health_status || 'good', photo_url];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Animal error:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({ error: 'Tag ID already exists' });
            }
            return res.json({ error: 'Database error' });
        }
        res.json({ message: 'Animal added successfully', animalId: result.insertId });
    });
});

app.get('/api/market-prices', (req, res) => {
    const query = 'SELECT * FROM market_prices ORDER BY date DESC LIMIT 10';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Market prices error:', err);
            return res.json([]);
        }
        res.json(results || []);
    });
});

app.get('/api/wool-quality', optionalAuth, (req, res) => {
    const query = 'SELECT * FROM wool_quality WHERE user_id = ?';
    db.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Wool quality error:', err);
            return res.json([]);
        }
        res.json(results || []);
    });
});

app.post('/api/wool-quality', optionalAuth, (req, res) => {
    const { animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date } = req.body;
    
    if (!grade || !test_date) {
        return res.json({ error: 'Grade and test date required' });
    }
    
    const query = 'INSERT INTO wool_quality (user_id, animal_id, grade, fiber_diameter, staple_length, moisture_content, test_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [req.session.userId, parseInt(animal_id) || null, grade, parseFloat(fiber_diameter) || 0, parseFloat(staple_length) || 0, parseFloat(moisture_content) || 0, test_date];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Wool quality error:', err);
            return res.json({ error: 'Database error' });
        }
        res.json({ message: 'Test recorded successfully', testId: result.insertId });
    });
});

app.get('/api/supply-chain', optionalAuth, (req, res) => {
    const query = 'SELECT * FROM supply_chain WHERE user_id = ? ORDER BY timestamp DESC';
    db.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Supply chain error:', err);
            return res.json([]);
        }
        res.json(results || []);
    });
});

app.post('/api/supply-chain', optionalAuth, (req, res) => {
    const { batch_id, stage, location, notes } = req.body;
    
    if (!batch_id || !stage) {
        return res.json({ error: 'Batch ID and stage required' });
    }
    
    const query = 'INSERT INTO supply_chain (user_id, batch_id, stage, location, notes) VALUES (?, ?, ?, ?, ?)';
    const values = [req.session.userId, batch_id, stage, location || '', notes || ''];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Supply chain error:', err);
            return res.json({ error: 'Database error' });
        }
        res.json({ message: 'Update recorded successfully', updateId: result.insertId });
    });
});

app.get('/api/certificates', optionalAuth, (req, res) => {
    const query = 'SELECT * FROM certificates WHERE user_id = ?';
    db.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Certificates error:', err);
            return res.json([]);
        }
        res.json(results || []);
    });
});

app.post('/api/certificates', optionalAuth, (req, res) => {
    const { certificate_type, certificate_number, issue_date, expiry_date } = req.body;
    
    if (!certificate_type || !certificate_number || !issue_date || !expiry_date) {
        return res.json({ error: 'All fields required' });
    }
    
    const query = 'INSERT INTO certificates (user_id, certificate_type, certificate_number, issue_date, expiry_date) VALUES (?, ?, ?, ?, ?)';
    const values = [req.session.userId, certificate_type, certificate_number, issue_date, expiry_date];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Certificate error:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.json({ error: 'Certificate number exists' });
            }
            return res.json({ error: 'Database error' });
        }
        res.json({ message: 'Certificate generated successfully', certificateId: result.insertId });
    });
});

// Analytics endpoint
app.get('/api/analytics/production', optionalAuth, (req, res) => {
    const queries = {
        monthlyProduction: 'SELECT MONTH(created_at) as month, COUNT(*) as count FROM wool_quality WHERE user_id = ? AND YEAR(created_at) = YEAR(CURDATE()) GROUP BY MONTH(created_at)',
        gradeDistribution: 'SELECT grade, COUNT(*) as count FROM wool_quality WHERE user_id = ? GROUP BY grade',
        animalHealth: 'SELECT health_status, COUNT(*) as count FROM animals WHERE user_id = ? GROUP BY health_status'
    };
    
    const results = {};
    let completed = 0;
    
    Object.keys(queries).forEach(key => {
        db.query(queries[key], [req.session.userId], (err, result) => {
            if (!err) results[key] = result;
            completed++;
            
            if (completed === Object.keys(queries).length) {
                res.json(results);
            }
        });
    });
});

// Market prices POST endpoint
app.post('/api/market-prices', optionalAuth, (req, res) => {
    const { grade, price_per_kg, market_location } = req.body;
    
    if (!grade || !price_per_kg) {
        return res.json({ error: 'Grade and price required' });
    }
    
    const query = 'INSERT INTO market_prices (grade, price_per_kg, date, market_location) VALUES (?, ?, CURDATE(), ?)';
    const values = [grade, parseFloat(price_per_kg), market_location || 'Unknown'];
    
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Market price error:', err);
            return res.json({ error: 'Database error' });
        }
        res.json({ message: 'Price updated successfully', priceId: result.insertId });
    });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Could not log out' });
        } else {
            res.json({ message: 'Logged out successfully' });
        }
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working', timestamp: new Date().toISOString() });
});

app.post('/api/test', (req, res) => {
    res.json({ message: 'POST request working', data: req.body, timestamp: new Date().toISOString() });
});



// MySQL access endpoint
app.get('/api/mysql-status', (req, res) => {
    db.query('SELECT 1 as connected', (err, results) => {
        if (err) {
            res.json({ 
                status: 'disconnected', 
                error: err.message,
                config: {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT
                }
            });
        } else {
            res.json({ 
                status: 'connected', 
                message: 'MySQL connection successful',
                config: {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT
                }
            });
        }
    });
});

// Database info endpoint
app.get('/api/db-info', requireAuth, (req, res) => {
    const queries = [
        'SHOW TABLES',
        'SELECT COUNT(*) as user_count FROM users',
        'SELECT COUNT(*) as farm_count FROM farms',
        'SELECT COUNT(*) as animal_count FROM animals'
    ];
    
    const results = {};
    let completed = 0;
    
    // Get table list
    db.query(queries[0], (err, tables) => {
        if (!err) results.tables = tables.map(t => Object.values(t)[0]);
        completed++;
        checkComplete();
    });
    
    // Get counts
    queries.slice(1).forEach((query, index) => {
        db.query(query, (err, result) => {
            if (!err) {
                const key = query.match(/as (\w+)/)[1];
                results[key] = result[0][key];
            }
            completed++;
            checkComplete();
        });
    });
    
    function checkComplete() {
        if (completed === queries.length) {
            res.json(results);
        }
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 MySQL: localhost:3306`);
    console.log(`🗄️  Database: wool_monitoring`);
    console.log(`👤 User: root`);
    console.log(`\n📋 Test Login Credentials:`);
    console.log(`   Email: demo@woolsystem.gov.in`);
    console.log(`   Password: 123456`);
});