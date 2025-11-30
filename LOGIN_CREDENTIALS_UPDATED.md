# 🔐 Updated Login Credentials - Wool Monitoring System

## ✅ Working Test Accounts

### Password for ALL accounts: `123456`

| User Type | Email | Password | Role |
|-----------|-------|----------|------|
| 👨‍🌾 **Farmer** | `farmer@woolsystem.gov.in` | `123456` | farmer |
| 🏪 **Trader** | `trader@woolsystem.gov.in` | `123456` | trader |
| 🔬 **Inspector** | `inspector@woolsystem.gov.in` | `123456` | inspector |
| 🏭 **Manufacturer** | `manufacturer@woolsystem.gov.in` | `123456` | manufacturer |
| 🏛️ **Officer** | `officer@woolsystem.gov.in` | `123456` | officer |
| 👤 **Demo** | `demo@woolsystem.gov.in` | `123456` | demo |

## 🚀 Quick Test Login

**Recommended for testing:**
- **Email:** `demo@woolsystem.gov.in`
- **Password:** `123456`

## 🛠️ Setup Required

### 1. Database Setup
```bash
# Run this in MySQL
mysql -u root -p < setup_database.sql
```

### 2. Start Server
```bash
npm start
```

### 3. Login Process
1. Go to `http://localhost:3000/login.html`
2. Enter any email from above
3. Enter password: `123456`
4. Click Login

## 🔧 Fixed Issues

✅ **Database Connection**: Direct MySQL connection without .env  
✅ **Password Hashing**: Proper bcrypt implementation  
✅ **Session Management**: 24-hour sessions with proper secret  
✅ **Error Handling**: Detailed console logging  
✅ **Test Data**: Pre-populated users and sample data  

## 📊 Sample Data Included

- **6 Test Users** with different roles
- **2 Sample Farms** for farmer user
- **4 Sample Animals** with health data
- **3 Wool Quality Tests** with grades
- **2 Digital Certificates** 
- **8 Market Price Entries** for different grades

## 🔍 Verification

After login, you should see:
- User dashboard with statistics
- Farm and animal data (for farmer role)
- Market prices
- Navigation to all features

## 🆘 Troubleshooting

**Login fails?**
1. Check server console for error messages
2. Verify MySQL is running: `mysql -u root -p`
3. Check database exists: `USE wool_monitoring; SHOW TABLES;`
4. Verify user exists: `SELECT * FROM users;`

**Data not showing?**
1. Check browser console (F12) for errors
2. Verify API endpoints are working: `http://localhost:3000/api/user`
3. Check session is created after login

---
**All credentials are now working with the updated server configuration!**