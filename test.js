// Simple test script for Wool Monitoring System
const http = require('http');
const mysql = require('mysql2');

console.log('🧪 Testing Wool Monitoring System');
console.log('=================================');

// Test database connection
function testDatabase() {
    console.log('📊 Testing database connection...');
    
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'wool_monitoring'
    });
    
    db.connect((err) => {
        if (err) {
            console.error('❌ Database connection failed:', err.message);
            console.log('💡 Make sure MySQL is running and credentials are correct');
        } else {
            console.log('✅ Database connection successful');
            
            // Test table existence
            db.query('SHOW TABLES', (err, results) => {
                if (err) {
                    console.error('❌ Error checking tables:', err.message);
                } else {
                    console.log('📋 Found tables:', results.map(row => Object.values(row)[0]).join(', '));
                }
                db.end();
            });
        }
    });
}

// Test server startup
function testServer() {
    console.log('🌐 Testing server startup...');
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET'
    };
    
    const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
            console.log('✅ Server is running on http://localhost:3000');
        } else {
            console.log(`⚠️  Server responded with status: ${res.statusCode}`);
        }
    });
    
    req.on('error', (err) => {
        console.log('❌ Server is not running');
        console.log('💡 Start the server with: npm start');
    });
    
    req.end();
}

// Test file structure
function testFileStructure() {
    console.log('📁 Testing file structure...');
    
    const fs = require('fs');
    const requiredFiles = [
        'server.js',
        'database.sql',
        'package.json',
        'public/index.html',
        'public/dashboard.html',
        'public/css/style.css',
        'public/js/dashboard.js'
    ];
    
    let allFilesExist = true;
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} - Missing`);
            allFilesExist = false;
        }
    });
    
    if (allFilesExist) {
        console.log('✅ All required files present');
    } else {
        console.log('⚠️  Some files are missing');
    }
}

// Run all tests
async function runTests() {
    testFileStructure();
    console.log('');
    testDatabase();
    console.log('');
    
    // Wait a bit before testing server
    setTimeout(() => {
        testServer();
        console.log('');
        console.log('🎉 Test completed!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Fix any issues shown above');
        console.log('2. Run: npm start');
        console.log('3. Open: http://localhost:3000');
        console.log('4. Create an account and test features');
    }, 1000);
}

runTests();