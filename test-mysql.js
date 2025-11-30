const mysql = require('mysql2');

// Test MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.log('❌ MySQL not running or wrong credentials');
        console.log('Error:', err.message);
        process.exit(1);
    }
    
    console.log('✅ MySQL connected');
    
    // Create database
    db.query('CREATE DATABASE IF NOT EXISTS wool_monitoring', (err) => {
        if (err) {
            console.log('❌ Cannot create database:', err.message);
            process.exit(1);
        }
        
        console.log('✅ Database created');
        
        // Use database
        db.query('USE wool_monitoring', (err) => {
            if (err) {
                console.log('❌ Cannot use database:', err.message);
                process.exit(1);
            }
            
            // Test insert
            db.query('CREATE TABLE IF NOT EXISTS test_table (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100))', (err) => {
                if (err) {
                    console.log('❌ Cannot create table:', err.message);
                    process.exit(1);
                }
                
                db.query('INSERT INTO test_table (name) VALUES (?)', ['test_data'], (err, result) => {
                    if (err) {
                        console.log('❌ Cannot insert data:', err.message);
                        process.exit(1);
                    }
                    
                    console.log('✅ Data inserted successfully, ID:', result.insertId);
                    
                    db.query('SELECT * FROM test_table', (err, results) => {
                        if (err) {
                            console.log('❌ Cannot select data:', err.message);
                        } else {
                            console.log('✅ Data retrieved:', results);
                        }
                        
                        db.query('DROP TABLE test_table', () => {
                            console.log('✅ MySQL test completed successfully');
                            process.exit(0);
                        });
                    });
                });
            });
        });
    });
});