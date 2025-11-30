# Wool Monitoring System - Database Mapping

## Overview
This document maps all HTML pages in the Wool Monitoring System to their corresponding MySQL database tables and explains the data structure for each feature.

## Database Tables Summary

### Core System Tables (25 tables total)

## 🏠 Main Pages

### 1. **index.html** - Home Page
- **Tables Used**: `users`, `farms`, `animals`, `wool_quality`, `market_prices`, `analytics_data`
- **Purpose**: Dashboard overview with statistics and navigation
- **Key Data**: Total farms, animals, quality tests, market trends

### 2. **dashboard.html** - Main Dashboard
- **Tables Used**: `users`, `farms`, `animals`, `wool_quality`, `supply_chain`, `certificates`, `market_prices`, `analytics_data`
- **Purpose**: Comprehensive dashboard with live data and charts
- **Key Features**: Real-time stats, production trends, user info display

### 3. **login.html** - Login Page
- **Tables Used**: `users`
- **Purpose**: User authentication
- **Key Fields**: email, password, last_login timestamp

### 4. **signup.html** - Registration Page
- **Tables Used**: `users`
- **Purpose**: New user registration
- **Key Fields**: name, email, password, phone, address, aadhaar, pan, farm details

## 🐑 Farm Management

### 5. **farm-registry.html** - Farm Registration
- **Tables Used**: `farms`, `farm_locations`
- **Purpose**: Register new farms with GPS coordinates
- **Key Fields**: farm name, location, area, type, latitude, longitude

### 6. **farm.html** - Farm Details
- **Tables Used**: `farms`, `animals`, `wool_quality`, `analytics_data`
- **Purpose**: Detailed farm information and management
- **Key Features**: Farm overview, animal count, production data

### 7. **farm-location.html** - Farm Location Management
- **Tables Used**: `farm_locations`, `farms`
- **Purpose**: GPS location tracking and mapping
- **Key Fields**: latitude, longitude, altitude, accuracy, location_name

### 8. **animal-database.html** - Animal Management
- **Tables Used**: `animals`, `farms`, `users`
- **Purpose**: Animal registration and health tracking
- **Key Fields**: tag_id, type, breed, age, health_status, photo_url, breeding_status

### 9. **farmer-portal.html** - Farmer Portal
- **Tables Used**: `users`, `farms`, `animals`, `wool_quality`, `certificates`, `notifications`
- **Purpose**: Comprehensive farmer dashboard
- **Key Features**: Farm overview, animal management, quality reports

## 🧶 Quality & Supply Chain

### 10. **wool-quality.html** - Wool Quality Control
- **Tables Used**: `wool_quality`, `animals`, `ai_quality_assessments`
- **Purpose**: Record and track wool quality tests
- **Key Fields**: grade, fiber_diameter, staple_length, moisture_content, test_date

### 11. **quality.html** - Quality Control Dashboard
- **Tables Used**: `wool_quality`, `analytics_data`
- **Purpose**: Quality control overview and analytics
- **Key Features**: Grade distribution, quality trends, test results

### 12. **supply-chain.html** - Supply Chain Tracking
- **Tables Used**: `supply_chain`, `blockchain_records`
- **Purpose**: Track wool movement through production stages
- **Key Fields**: batch_id, stage, location, handler, timestamp, notes

### 13. **supply-chain-tracking.html** - Chain Tracking
- **Tables Used**: `supply_chain`, `shipment_tracking`
- **Purpose**: Detailed supply chain monitoring
- **Key Features**: Stage tracking, location updates, timeline view

### 14. **supply-tracking.html** - Supply Tracking
- **Tables Used**: `supply_chain`, `live_tracking`
- **Purpose**: Real-time supply tracking
- **Key Features**: Live location, status updates, delivery tracking

### 15. **shipment-tracking.html** - Shipment Tracking
- **Tables Used**: `shipment_tracking`, `logistics`
- **Purpose**: Track individual shipments
- **Key Fields**: shipment_id, origin, destination, current_location, status

## 📊 Analytics & Market

### 16. **analytics.html** - Production Analytics
- **Tables Used**: `analytics_data`, `wool_quality`, `animals`, `farms`
- **Purpose**: Production analytics and performance metrics
- **Key Features**: Trends, charts, performance indicators

### 17. **market-prices.html** - Market Prices
- **Tables Used**: `market_prices`
- **Purpose**: Daily wool market pricing
- **Key Fields**: grade, price_per_kg, date, market_location, trading_volume

### 18. **live-market-prices.html** - Live Market Prices
- **Tables Used**: `market_prices`
- **Purpose**: Real-time market price updates
- **Key Features**: Live price feeds, price alerts, market trends

### 19. **live-tracking.html** - Live Tracking
- **Tables Used**: `live_tracking`, `iot_monitoring`
- **Purpose**: Real-time tracking of animals, batches, vehicles
- **Key Fields**: entity_type, entity_id, latitude, longitude, status

## 📄 Certificates & Compliance

### 20. **certificates.html** - Certificate Management
- **Tables Used**: `certificates`, `digital_certificates`
- **Purpose**: Generate and manage digital certificates
- **Key Fields**: certificate_type, certificate_number, issue_date, expiry_date

### 21. **digital-certificates.html** - Digital Certificates
- **Tables Used**: `digital_certificates`, `certificates`, `blockchain_records`
- **Purpose**: Enhanced digital certificate features
- **Key Features**: QR codes, blockchain verification, download tracking

### 22. **blockchain.html** - Blockchain Integration
- **Tables Used**: `blockchain_records`, `certificates`, `supply_chain`
- **Purpose**: Blockchain-based verification and immutable records
- **Key Fields**: blockchain_hash, transaction_id, smart_contract_address

## 🏦 Government Services

### 23. **government-schemes.html** - Government Schemes
- **Tables Used**: `government_schemes`, `beneficiaries`
- **Purpose**: Government subsidy and scheme management
- **Key Fields**: scheme_name, eligibility_criteria, subsidy_amount, benefits

### 24. **policies.html** - Government Policies
- **Tables Used**: `policies`
- **Purpose**: Policy information and compliance
- **Key Fields**: policy_title, policy_type, description, effective_date

### 25. **beneficiaries.html** - Beneficiary Management
- **Tables Used**: `beneficiaries`, `government_schemes`, `users`
- **Purpose**: Track scheme beneficiaries and disbursements
- **Key Fields**: application_number, status, approved_amount, disbursement_date

### 26. **tenders.html** - Government Tenders
- **Tables Used**: `tenders`
- **Purpose**: Government tender management
- **Key Fields**: tender_number, title, estimated_value, submission_deadline

## 🔬 Technology Features

### 27. **ai-quality.html** - AI Quality Assessment
- **Tables Used**: `ai_quality_assessments`, `wool_quality`
- **Purpose**: AI-powered wool quality analysis
- **Key Fields**: ai_model_version, confidence_score, predicted_grade

### 28. **ai-quality-assessment.html** - AI Assessment Details
- **Tables Used**: `ai_quality_assessments`, `wool_quality`
- **Purpose**: Detailed AI assessment results
- **Key Features**: Model accuracy, prediction confidence, image analysis

### 29. **iot-monitoring.html** - IoT Monitoring
- **Tables Used**: `iot_monitoring`, `farms`, `animals`
- **Purpose**: IoT sensor data monitoring
- **Key Fields**: device_id, sensor_value, battery_level, alert_triggered

### 30. **enhanced-login.html** - Enhanced Authentication
- **Tables Used**: `users`
- **Purpose**: Advanced login features
- **Key Features**: Multi-factor authentication, session management

## 🗺️ Maps & Location

### 31. **google-map.html** - Google Maps Integration
- **Tables Used**: `farm_locations`, `farms`, `live_tracking`
- **Purpose**: Interactive map display
- **Key Features**: Farm locations, real-time tracking, route planning

### 32. **maps-demo.html** - Maps Demo
- **Tables Used**: `farm_locations`, `farms`
- **Purpose**: Map functionality demonstration
- **Key Features**: Location plotting, GPS integration

### 33. **logistics.html** - Logistics Management
- **Tables Used**: `logistics`, `shipment_tracking`
- **Purpose**: Logistics and delivery management
- **Key Fields**: logistics_provider, pickup_address, delivery_date

## 📞 Support & Information

### 34. **features.html** - System Features
- **Tables Used**: `system_features`
- **Purpose**: Feature documentation and management
- **Key Fields**: feature_name, description, category, is_enabled

### 35. **help-support.html** - Help & Support
- **Tables Used**: `support_tickets`, `users`
- **Purpose**: Customer support ticket system
- **Key Fields**: ticket_number, subject, category, status, priority

### 36. **notifications.html** - Notifications
- **Tables Used**: `notifications`, `users`
- **Purpose**: System notifications and alerts
- **Key Fields**: title, message, type, priority, is_read

### 37. **multilanguage-support.html** - Multi-language
- **Tables Used**: `translations`
- **Purpose**: Multi-language interface support
- **Key Fields**: language_code, translation_key, translation_value

### 38. **e-marketplace.html** - E-Marketplace
- **Tables Used**: `marketplace_listings`, `users`, `certificates`
- **Purpose**: Online wool trading platform
- **Key Fields**: product_type, wool_grade, quantity, price_per_unit

## 🔒 Authentication Pages

### 39. **auth.html** - Authentication Hub
- **Tables Used**: `users`
- **Purpose**: Centralized authentication management
- **Key Features**: Login/logout, session management

### 40. **register.html** - Alternative Registration
- **Tables Used**: `users`
- **Purpose**: Alternative user registration interface
- **Key Features**: Simplified registration process

## Database Relationships

### Primary Relationships:
1. **users** → **farms** (One-to-Many)
2. **farms** → **animals** (One-to-Many)
3. **animals** → **wool_quality** (One-to-Many)
4. **users** → **certificates** (One-to-Many)
5. **users** → **supply_chain** (One-to-Many)
6. **government_schemes** → **beneficiaries** (One-to-Many)

### Key Indexes:
- User email, Aadhaar, PAN for authentication
- Farm coordinates for location queries
- Animal tag IDs for tracking
- Batch IDs for supply chain tracking
- Certificate numbers for verification
- Market prices by grade and date

## Data Security Features:
1. **Password Hashing**: bcrypt for user passwords
2. **Unique Constraints**: Email, Aadhaar, PAN, certificate numbers
3. **Foreign Key Constraints**: Data integrity across tables
4. **Blockchain Integration**: Immutable record keeping
5. **Audit Trails**: Created/updated timestamps on all tables

## Performance Optimizations:
1. **Indexes**: Strategic indexing on frequently queried columns
2. **Views**: Pre-computed views for common queries
3. **Triggers**: Automatic data updates and notifications
4. **Partitioning**: Ready for date-based partitioning on large tables

This comprehensive database structure supports all 40+ HTML pages in the system with full traceability, security, and scalability features required for a government-grade wool monitoring system.