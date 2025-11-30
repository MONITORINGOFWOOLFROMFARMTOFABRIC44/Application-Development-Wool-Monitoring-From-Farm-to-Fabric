// Enterprise Wool Monitoring System - Enhanced Server
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Database connection with enterprise features
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wool_monitoring',
    multipleStatements: true
});

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'enterprise_wool_monitoring_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Blockchain simulation functions
function generateBlockchainHash(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

function generateBatchId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `WOL-${year}-${random}`;
}

// Enterprise API Routes

// Blockchain Batch Management
app.post('/api/enterprise/batches', (req, res) => {
    const { farm_id, animal_ids, quality_score, carbon_footprint, sustainability_score } = req.body;
    const batch_id = generateBatchId();
    const blockchain_hash = generateBlockchainHash({ batch_id, farm_id, animal_ids, timestamp: new Date() });
    
    db.query(`INSERT INTO blockchain_batches 
              (batch_id, farm_id, animal_ids, quality_score, carbon_footprint, sustainability_score, blockchain_hash) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [batch_id, farm_id, JSON.stringify(animal_ids), quality_score, carbon_footprint, sustainability_score, blockchain_hash],
        (err, result) => {
            if (err) {
                res.json({ success: false, message: 'Error creating batch' });
            } else {
                res.json({ success: true, batch_id, blockchain_hash, message: 'Batch created successfully' });
            }
        });
});

// AI Quality Assessment
app.post('/api/enterprise/quality-assessment', (req, res) => {
    const { batch_id, fiber_diameter, staple_length, crimp_frequency, color_consistency, 
            tensile_strength, contamination_level, image_path } = req.body;
    
    // AI grading logic simulation
    let overall_grade = 'Standard';
    let confidence_score = 85.0;
    
    if (fiber_diameter <= 85 && staple_length >= 90 && color_consistency >= 90) {
        overall_grade = 'Premium';
        confidence_score = 95.0;
    } else if (fiber_diameter <= 90 && staple_length >= 85 && color_consistency >= 85) {
        overall_grade = 'Excellent';
        confidence_score = 90.0;
    } else if (fiber_diameter <= 95 && staple_length >= 80 && color_consistency >= 80) {
        overall_grade = 'Good';
        confidence_score = 87.0;
    }
    
    db.query(`INSERT INTO ai_quality_assessments 
              (batch_id, fiber_diameter, staple_length, crimp_frequency, color_consistency, 
               tensile_strength, contamination_level, overall_grade, confidence_score, image_path, ai_model_version) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'v2.1.0')`,
        [batch_id, fiber_diameter, staple_length, crimp_frequency, color_consistency, 
         tensile_strength, contamination_level, overall_grade, confidence_score, image_path],
        (err, result) => {
            if (err) {
                res.json({ success: false, message: 'Error recording quality assessment' });
            } else {
                res.json({ success: true, overall_grade, confidence_score, message: 'Quality assessment completed' });
            }
        });
});

// IoT Sensor Data
app.post('/api/enterprise/iot-data', (req, res) => {
    const { animal_id, sensor_type, sensor_value, unit } = req.body;
    
    // Alert logic for abnormal values
    let alert_triggered = false;
    if (sensor_type === 'temperature' && (sensor_value < 38.0 || sensor_value > 40.0)) {
        alert_triggered = true;
    }
    if (sensor_type === 'heart_rate' && (sensor_value < 60 || sensor_value > 120)) {
        alert_triggered = true;
    }
    
    db.query(`INSERT INTO iot_sensor_data (animal_id, sensor_type, sensor_value, unit, alert_triggered) 
              VALUES (?, ?, ?, ?, ?)`,
        [animal_id, sensor_type, sensor_value, unit, alert_triggered],
        (err, result) => {
            if (err) {
                res.json({ success: false, message: 'Error recording sensor data' });
            } else {
                res.json({ success: true, alert_triggered, message: 'Sensor data recorded' });
            }
        });
});

// Supply Chain Tracking
app.post('/api/enterprise/supply-chain-stage', (req, res) => {
    const { batch_id, stage, location, processor_name, quality_metrics } = req.body;
    const blockchain_hash = generateBlockchainHash({ batch_id, stage, location, timestamp: new Date() });
    
    db.query(`INSERT INTO supply_chain_stages 
              (batch_id, stage, location, processor_name, start_date, quality_metrics, blockchain_hash) 
              VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
        [batch_id, stage, location, processor_name, JSON.stringify(quality_metrics), blockchain_hash],
        (err, result) => {
            if (err) {
                res.json({ success: false, message: 'Error updating supply chain stage' });
            } else {
                // Update batch current stage
                db.query('UPDATE blockchain_batches SET current_stage = ? WHERE batch_id = ?', 
                    [stage, batch_id]);
                res.json({ success: true, blockchain_hash, message: 'Supply chain stage updated' });
            }
        });
});

// Enhanced Certificates with Blockchain
app.post('/api/enterprise/certificates', (req, res) => {
    const { batch_id, certificate_type, issuing_authority, issued_date, expiry_date } = req.body;
    const certificate_number = `CERT-${Date.now()}`;
    const verification_code = crypto.randomBytes(16).toString('hex');
    const blockchain_hash = generateBlockchainHash({ certificate_number, batch_id, issued_date });
    
    db.query(`INSERT INTO enhanced_certificates 
              (batch_id, certificate_type, certificate_number, issuing_authority, issued_date, 
               expiry_date, blockchain_hash, verification_code) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [batch_id, certificate_type, certificate_number, issuing_authority, issued_date, 
         expiry_date, blockchain_hash, verification_code],
        (err, result) => {
            if (err) {
                res.json({ success: false, message: 'Error generating certificate' });
            } else {
                res.json({ success: true, certificate_number, verification_code, blockchain_hash });
            }
        });
});

// Enterprise Analytics Dashboard
app.get('/api/enterprise/dashboard-data', (req, res) => {
    const queries = [
        'SELECT COUNT(*) as total_batches FROM blockchain_batches',
        'SELECT AVG(quality_score) as avg_quality FROM blockchain_batches',
        'SELECT AVG(sustainability_score) as avg_sustainability FROM blockchain_batches',
        'SELECT COUNT(*) as active_alerts FROM iot_sensor_data WHERE alert_triggered = TRUE AND DATE(timestamp) = CURDATE()',
        `SELECT stage, COUNT(*) as count FROM blockchain_batches 
         GROUP BY current_stage ORDER BY FIELD(current_stage, 'farm', 'shearing', 'processing', 'manufacturing', 'retail')`,
        `SELECT overall_grade, COUNT(*) as count FROM ai_quality_assessments 
         GROUP BY overall_grade ORDER BY FIELD(overall_grade, 'Premium', 'Excellent', 'Good', 'Standard', 'Below Standard')`
    ];
    
    Promise.all(queries.map(query => new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    }))).then(results => {
        res.json({
            success: true,
            data: {
                totalBatches: results[0][0].total_batches,
                avgQuality: results[1][0].avg_quality,
                avgSustainability: results[2][0].avg_sustainability,
                activeAlerts: results[3][0].active_alerts,
                stageDistribution: results[4],
                gradeDistribution: results[5]
            }
        });
    }).catch(err => {
        res.json({ success: false, message: 'Error fetching dashboard data' });
    });
});

// Predictive Analytics
app.get('/api/enterprise/predictions/:type', (req, res) => {
    const { type } = req.params;
    
    // Simulate predictive analytics
    const predictions = {
        quality_forecast: { value: 91.5, confidence: 87.2, trend: 'improving' },
        health_risk: { value: 12.3, confidence: 92.1, trend: 'stable' },
        production_estimate: { value: 2450, confidence: 89.7, trend: 'increasing' },
        market_demand: { value: 78.9, confidence: 85.4, trend: 'growing' }
    };
    
    res.json({ success: true, prediction: predictions[type] || null });
});

// Blockchain Verification
app.get('/api/enterprise/verify/:hash', (req, res) => {
    const { hash } = req.params;
    
    db.query(`SELECT 'batch' as type, batch_id as id, creation_date as timestamp FROM blockchain_batches WHERE blockchain_hash = ?
              UNION
              SELECT 'certificate' as type, certificate_number as id, issued_date as timestamp FROM enhanced_certificates WHERE blockchain_hash = ?
              UNION
              SELECT 'stage' as type, CONCAT(batch_id, '-', stage) as id, start_date as timestamp FROM supply_chain_stages WHERE blockchain_hash = ?`,
        [hash, hash, hash], (err, results) => {
            if (err || results.length === 0) {
                res.json({ success: false, message: 'Hash not found or invalid' });
            } else {
                res.json({ success: true, verified: true, data: results[0] });
            }
        });
});

// Mobile API for offline sync
app.post('/api/mobile/sync', (req, res) => {
    const { user_id, device_id, offline_data } = req.body;
    
    db.query(`INSERT INTO mobile_sessions (user_id, device_id, offline_data, last_sync) 
              VALUES (?, ?, ?, NOW()) 
              ON DUPLICATE KEY UPDATE offline_data = VALUES(offline_data), last_sync = NOW()`,
        [user_id, device_id, JSON.stringify(offline_data)], (err, result) => {
            if (err) {
                res.json({ success: false, message: 'Sync failed' });
            } else {
                res.json({ success: true, message: 'Data synchronized successfully' });
            }
        });
});

app.listen(PORT, () => {
    console.log(`🚀 Enterprise Wool Monitoring System running on http://localhost:${PORT}`);
    console.log('🔗 Blockchain integration: Active');
    console.log('🤖 AI Quality Assessment: Ready');
    console.log('📡 IoT Monitoring: Connected');
});