const fs = require('fs');
const path = require('path');

const htmlFiles = [
    'ai-assessment.html', 'ai-quality-assessment.html', 'ai-quality.html', 'analytics.html',
    'animal-database.html', 'auth.html', 'beneficiaries.html', 'blockchain.html',
    'certificates.html', 'dashboard.html', 'digital-certificates.html', 'e-marketplace.html',
    'enhanced-login.html', 'farm-location.html', 'farm-map.html', 'farm-registry.html',
    'farm.html', 'farmer-portal.html', 'features.html', 'government-schemes.html',
    'help-support.html', 'index.html', 'iot-monitoring.html', 'live-market-prices.html',
    'live-tracking.html', 'login.html', 'logistics.html', 'market-prices.html',
    'multilanguage-support.html', 'notifications.html', 'policies.html', 'quality.html',
    'register.html', 'shipment-tracking.html', 'signup.html', 'supply-chain-tracking.html',
    'supply-chain.html', 'supply-tracking.html', 'system-status.html', 'tenders.html',
    'wool-quality.html'
];

const navigationScript = '<script src="js/global-navigation.js"></script>';

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, 'public', file);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add navigation script before closing body tag if not already present
        if (!content.includes('global-navigation.js')) {
            content = content.replace('</body>', `${navigationScript}\n</body>`);
            fs.writeFileSync(filePath, content);
            console.log(`✅ Added navigation to ${file}`);
        } else {
            console.log(`⚠️ Navigation already exists in ${file}`);
        }
    } else {
        console.log(`❌ File not found: ${file}`);
    }
});

console.log('\n🎉 Navigation system added to all HTML files!');
console.log('All 41 HTML files are now connected with global navigation.');