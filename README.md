# Wool Monitoring System - Farm to Fabric

A comprehensive full-stack web application for monitoring wool production from farm to fabric, built for the Indian government's agricultural digitization initiative.

## Features

### Core Modules
1. **Authentication System** - Secure signup/login with bcrypt password hashing
2. **Dashboard** - Comprehensive overview with statistics and navigation
3. **Farm Registry** - Register farms with GPS location tracking
4. **Animal Database** - Manage sheep/goats with photo uploads and health tracking
5. **Wool Quality Control** - Record and monitor wool quality parameters
6. **Supply Chain Tracking** - Track wool movement through production stages
7. **Certificates & Compliance** - Generate and manage digital certificates
8. **Analytics** - Production trends and performance charts
9. **Market Prices** - Daily wool market pricing information

### Innovative Features
- **GPS Integration** - Live location capture for farm registration
- **Image Upload** - Animal photo management with basic verification
- **Real-time Charts** - Production analytics with Chart.js
- **Responsive Design** - Mobile-friendly interface
- **Government Branding** - Indian government logos and official styling
- **Blockchain Ready** - Architecture prepared for blockchain integration
- **AI Prediction Ready** - Data structure supports future AI implementations

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Chart.js for analytics visualization
- CSS animations and transitions
- Responsive grid layouts
- Government of India design theme

### Backend
- Node.js with Express.js framework
- MySQL database with comprehensive schema
- bcrypt for password security
- express-session for authentication
- multer for file uploads
- RESTful API architecture

### Database
- MySQL with 7 core tables
- Foreign key relationships
- Indexed queries for performance
- Sample data included

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd capstone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MySQL Database**
   - Create a MySQL database named `wool_monitoring`
   - Import the schema from `database.sql`
   ```bash
   mysql -u root -p < database.sql
   ```

4. **Configure Database Connection**
   - Open `server.js`
   - Update MySQL credentials in the database connection section:
   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: 'your_mysql_password', // Update this
       database: 'wool_monitoring'
   });
   ```

5. **Add Images** (Optional)
   - Add government logos and animal images to `public/images/`
   - See `public/images/placeholder.txt` for required images

6. **Start the Application**
   ```bash
   npm start
   ```

7. **Access the Application**
   - Open browser and navigate to `http://localhost:3000`
   - Create a new account or login with existing credentials

## Project Structure

```
capstone/
├── server.js              # Main Express server
├── database.sql           # MySQL database schema
├── package.json           # Node.js dependencies
├── README.md             # Project documentation
└── public/               # Frontend assets
    ├── index.html        # Landing page
    ├── login.html        # Login page
    ├── signup.html       # Registration page
    ├── dashboard.html    # Main dashboard
    ├── css/
    │   └── style.css     # Main stylesheet
    ├── js/
    │   ├── dashboard.js  # Dashboard functionality
    │   └── animations.js # UI animations
    ├── images/           # Image assets
    └── uploads/          # User uploaded files
```

## API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user info

### Farm Management
- `GET /api/farms` - Get user's farms
- `POST /api/farms` - Register new farm

### Animal Management
- `GET /api/animals` - Get user's animals
- `POST /api/animals` - Add new animal (with photo upload)

### Wool Quality
- `GET /api/wool-quality` - Get wool quality records
- `POST /api/wool-quality` - Record wool quality test

### Supply Chain
- `GET /api/supply-chain` - Get supply chain updates
- `POST /api/supply-chain` - Update supply chain status

### Certificates
- `GET /api/certificates` - Get certificates
- `POST /api/certificates` - Generate new certificate

### Analytics & Market
- `GET /api/analytics/production` - Get production analytics
- `GET /api/market-prices` - Get current market prices

## Database Schema

### Core Tables
1. **users** - User authentication and profiles
2. **farms** - Farm registry with GPS coordinates
3. **animals** - Animal database with health tracking
4. **wool_quality** - Quality control test results
5. **supply_chain** - Movement tracking through stages
6. **certificates** - Digital certification records
7. **market_prices** - Daily market pricing data

## Security Features

- **Password Hashing** - bcrypt with salt rounds
- **Session Management** - Secure session handling
- **Input Validation** - Server-side data validation
- **File Upload Security** - Controlled file uploads
- **SQL Injection Prevention** - Parameterized queries

## Future Enhancements

### Blockchain Integration
- Smart contracts for certificate verification
- Immutable supply chain records
- Decentralized quality assurance

### AI/ML Features
- Demand prediction algorithms
- Quality assessment automation
- Market price forecasting
- Animal health monitoring

### Advanced Features
- IoT sensor integration
- Mobile app development
- Multi-language support
- Advanced reporting system

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Start with auto-reload (if nodemon installed)
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is developed for the Government of India's agricultural digitization initiative.

## Support

For technical support or questions, please contact the development team.

---

**Government of India - Digital Agriculture Initiative**
*Empowering farmers through technology*