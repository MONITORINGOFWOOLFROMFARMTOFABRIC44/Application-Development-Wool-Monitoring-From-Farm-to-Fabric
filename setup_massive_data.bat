@echo off
echo Setting up Wool Monitoring System with 15,000+ records...
echo.

echo Step 1: Creating database and tables...
mysql -u root -p -e "source setup_database_updated.sql"

echo.
echo Step 2: Generating massive dataset (this may take a few minutes)...
mysql -u root -p -e "source generate_massive_data.sql"

echo.
echo Step 3: Installing Node.js dependencies...
npm install

echo.
echo Setup complete! 
echo.
echo Database now contains:
echo - 1,000 Users with unique Aadhaar/PAN
echo - 5,000 Farms across locations
echo - 8,000 Animals (sheep and goats)
echo - 3,000 Wool quality tests
echo - 2,000 Supply chain updates
echo - 1,500 Certificates
echo - Market prices for multiple cities
echo.
echo Total: 15,000+ records
echo.
echo To start the server: npm start
echo Then open: http://localhost:3000
echo.
pause