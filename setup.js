// Setup script for Wool Monitoring System
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

console.log('🐑 Wool Monitoring System Setup');
console.log('================================');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root', // Update this with your MySQL password
    multipleStatements: true
};

async function setupDatabase() {
    try {
        console.log('📊 Setting up database...');
        
        const connection = mysql.createConnection(dbConfig);
        
        // Read and execute SQL schema
        const sqlSchema = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
        
        connection.query(sqlSchema, (error, results) => {
            if (error) {
                console.error('❌ Database setup failed:', error.message);
                return;
            }
            
            console.log('✅ Database setup completed successfully!');
            console.log('📋 Created tables:');
            console.log('   - users (authentication)');
            console.log('   - farms (farm registry)');
            console.log('   - animals (animal database)');
            console.log('   - wool_quality (quality control)');
            console.log('   - supply_chain (tracking)');
            console.log('   - certificates (compliance)');
            console.log('   - market_prices (pricing data)');
            
            connection.end();
            
            console.log('\n🚀 Setup Complete!');
            console.log('Next steps:');
            console.log('1. Update MySQL password in server.js if needed');
            console.log('2. Add images to public/images/ directory');
            console.log('3. Run: npm start');
            console.log('4. Open: http://localhost:3000');
        });
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n🔧 Manual setup required:');
        console.log('1. Ensure MySQL is running');
        console.log('2. Update database credentials in server.js');
        console.log('3. Import database.sql manually');
    }
}

// Create uploads directory if it doesn't exist
function createDirectories() {
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('📁 Created uploads directory');
    }
}

// Main setup function
async function main() {
    createDirectories();
    await setupDatabase();
}

// Run setup
main().catch(console.error);