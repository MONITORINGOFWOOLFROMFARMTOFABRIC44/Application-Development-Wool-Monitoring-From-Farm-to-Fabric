// Configuration file for Wool Monitoring System

module.exports = {
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },
    
    // Database Configuration
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'wool_monitoring',
        connectionLimit: 10
    },
    
    // Session Configuration
    session: {
        secret: process.env.SESSION_SECRET || 'wool_monitoring_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true in production with HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    },
    
    // File Upload Configuration
    upload: {
        destination: './public/uploads/',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
    },
    
    // Application Settings
    app: {
        name: 'Wool Monitoring System',
        version: '1.0.0',
        description: 'Application Development for Monitoring of Wool from Farm to Fabric',
        author: 'Government of India - Digital Agriculture Initiative'
    },
    
    // Security Settings
    security: {
        bcryptRounds: 10,
        maxLoginAttempts: 5,
        lockoutTime: 15 * 60 * 1000 // 15 minutes
    },
    
    // API Settings
    api: {
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        }
    },
    
    // Future Features Configuration
    features: {
        blockchain: {
            enabled: false, // Enable when blockchain module is ready
            network: 'ethereum',
            contractAddress: null
        },
        ai: {
            enabled: false, // Enable when AI module is ready
            predictionModel: null,
            confidenceThreshold: 0.8
        },
        iot: {
            enabled: false, // Enable when IoT integration is ready
            mqttBroker: null,
            deviceTypes: ['temperature', 'humidity', 'weight']
        }
    },
    
    // Market Data Configuration
    market: {
        updateInterval: 24 * 60 * 60 * 1000, // 24 hours
        sources: [
            'local_markets',
            'commodity_exchange',
            'government_data'
        ]
    },
    
    // Notification Settings
    notifications: {
        email: {
            enabled: false,
            smtp: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            }
        },
        sms: {
            enabled: false,
            provider: 'twilio',
            apiKey: process.env.SMS_API_KEY
        }
    },
    
    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: './logs/app.log',
        maxSize: '10m',
        maxFiles: 5
    }
};