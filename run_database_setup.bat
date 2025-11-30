@echo off
echo Setting up Wool Monitoring Database...
echo.

echo Step 1: Creating database schema...
mysql -u root -p < setup_database_updated.sql
if %errorlevel% neq 0 (
    echo Error: Failed to create database schema
    pause
    exit /b 1
)

echo Step 2: Generating massive duplicate datasets...
mysql -u root -p < generate_duplicate_data.sql
if %errorlevel% neq 0 (
    echo Error: Failed to generate duplicate data
    pause
    exit /b 1
)

echo.
echo ✅ Database setup completed successfully!
echo.
echo Database contains:
echo - 2000+ Users
echo - 10000+ Farms  
echo - 20000+ Animals
echo - 15000+ Wool Quality Tests
echo - 8000+ Supply Chain Updates
echo - 5000+ Certificates
echo - 1000+ Market Prices
echo.
echo Test Login Credentials:
echo Email: farmer1@woolsystem.gov.in to farmer2000@woolsystem.gov.in
echo Password: password123
echo.
echo Original Demo Account:
echo Email: demo@woolsystem.gov.in
echo Password: 123456
echo.
pause