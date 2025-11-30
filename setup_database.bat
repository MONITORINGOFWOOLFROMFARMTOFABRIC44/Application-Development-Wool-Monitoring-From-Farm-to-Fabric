@echo off
echo Setting up MySQL Database for Wool Monitoring System...
echo.
echo Make sure MySQL is running on localhost:3306
echo Username: root
echo Password: root
echo.
pause

mysql -u root -proot -e "SOURCE complete-database.sql"

if %errorlevel% == 0 (
    echo.
    echo ✅ Database setup completed successfully!
    echo Database: wool_monitoring
    echo Tables created with sample data
) else (
    echo.
    echo ❌ Database setup failed!
    echo Please check:
    echo 1. MySQL is running
    echo 2. Username/password is correct (root/root)
    echo 3. MySQL is accessible on localhost:3306
)

echo.
pause