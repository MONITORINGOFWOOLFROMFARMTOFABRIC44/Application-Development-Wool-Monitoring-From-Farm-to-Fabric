const bcrypt = require('bcrypt');
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wool_monitoring',
    port: 3306
});

async function createTestUser() {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        // Insert test user
        const query = `
            INSERT INTO users (name, email, password, phone, address, aadhaar, pan, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            password = VALUES(password),
            name = VALUES(name)
        `;
        
        const values = [
            'Demo Farmer',
            'demo@woolsystem.gov.in',
            hashedPassword,
            '9876543210',
            'Demo Farm, Village Wool, District Agriculture, State India',
            '123456789012',
            'ABCDE1234F',
            'farmer'
        ];
        
        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error creating test user:', err);
            } else {
                console.log('✅ Test user created successfully!');
                console.log('📧 Email: demo@woolsystem.gov.in');
                console.log('🔑 Password: 123456');
                
                // Also create a test farm for this user
                const farmQuery = `
                    INSERT INTO farms (user_id, name, location, area, latitude, longitude)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE name = VALUES(name)
                `;
                
                db.query(farmQuery, [result.insertId || 1, 'Demo Wool Farm', 'Demo Village, Agriculture District', 25.5, 28.6139, 77.2090], (farmErr) => {
                    if (!farmErr) {
                        console.log('🏡 Demo farm created successfully!');
                    }
                    db.end();
                });
            }
        });
        
    } catch (error) {
        console.error('Error:', error);
        db.end();
    }
}

// Connect and create user
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to database, creating test user...');
    createTestUser();
});