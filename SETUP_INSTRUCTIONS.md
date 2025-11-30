# Wool Monitoring System - Setup Instructions

## Quick Setup Guide

### 1. Database Setup
Run the updated database setup script:
```bash
mysql -u root -p < setup_database_updated.sql
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```

### 4. Access the Application
Open your browser and go to: `http://localhost:3000`

## Test Credentials
- **Email:** demo@woolsystem.gov.in
- **Password:** admin123
- **Aadhaar:** 123456789012
- **PAN:** ABCDE1234F

## Key Features Now Working

### ✅ Data Insertion Fixed
- All forms now properly insert data into the database
- Real-time data loading and display
- Proper error handling and validation

### ✅ Aadhaar & PAN Linking
- Aadhaar and PAN fields added to user registration
- Unique constraints to prevent duplicates
- Validation patterns for proper format
- Display in user profile and dashboard

### ✅ Dynamic Data Loading
- Dashboard shows real user data
- All pages load data dynamically from database
- Live updates every 30 seconds on dashboard
- Market prices refresh every 5 minutes

### ✅ Functional Buttons
- All navigation buttons work properly
- Form submissions with proper API calls
- Real-time feedback and error messages
- Proper authentication checks

## Working Pages

1. **signup.html** - Complete registration with Aadhaar/PAN
2. **login.html** - Authentication with session management
3. **dashboard.html** - Dynamic data display with live updates
4. **farm-registry.html** - Farm registration with GPS location
5. **animal-database.html** - Animal management with photo upload
6. **wool-quality.html** - Quality testing with grading system
7. **supply-chain.html** - Supply chain tracking with status updates
8. **certificates.html** - Digital certificate generation
9. **market-prices.html** - Live market price updates

## API Endpoints Working

- `POST /api/signup` - User registration with Aadhaar/PAN
- `POST /api/login` - User authentication
- `GET /api/dashboard` - Dashboard data with user info
- `GET /api/user` - Current user information
- `POST /api/farms` - Farm registration
- `GET /api/farms` - Get user farms
- `POST /api/animals` - Animal registration with photo
- `GET /api/animals` - Get user animals
- `POST /api/wool-quality` - Quality test recording
- `GET /api/wool-quality` - Get quality tests
- `POST /api/supply-chain` - Supply chain updates
- `GET /api/supply-chain` - Get supply chain data
- `POST /api/certificates` - Certificate generation
- `GET /api/certificates` - Get certificates
- `GET /api/market-prices` - Get market prices
- `POST /api/market-prices` - Update market prices

## Database Schema Updated

The database now includes:
- Aadhaar and PAN fields in users table
- Proper foreign key relationships
- Sample data for testing
- Unique constraints for data integrity

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Input validation and sanitization
- Aadhaar/PAN format validation
- SQL injection prevention

All major issues have been resolved and the system is now fully functional!