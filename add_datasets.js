// Script to add datasets to remaining HTML files
const fs = require('fs');
const path = require('path');

const publicDir = './public';
const datasetHTML = `
        <div style="background: rgba(33, 150, 243, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196F3;">
            <h3>📊 Dataset Information</h3>
            <p><strong>System Records:</strong> Comprehensive data collection with real-time updates and secure storage.</p>
            <p><strong>Data Usage:</strong> Information used for monitoring, analytics, and government compliance reporting.</p>
        </div>`;

const filesToUpdate = [
    'blockchain.html',
    'digital-certificates.html',
    'e-marketplace.html',
    'government-schemes.html',
    'help-support.html',
    'iot-monitoring.html',
    'live-market-prices.html',
    'live-tracking.html',
    'logistics.html',
    'notifications.html',
    'quality.html',
    'shipment-tracking.html',
    'supply-chain-tracking.html',
    'tenders.html'
];

filesToUpdate.forEach(filename => {
    const filePath = path.join(publicDir, filename);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find a good insertion point (after header or before main content)
        const insertPoints = [
            '<main class="container">',
            '<div class="container">',
            '<section class="container">',
            '<main>',
            '</header>'
        ];
        
        let inserted = false;
        for (const point of insertPoints) {
            if (content.includes(point) && !inserted) {
                content = content.replace(point, point + datasetHTML);
                inserted = true;
                break;
            }
        }
        
        if (inserted) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Added dataset to ${filename}`);
        } else {
            console.log(`⚠️ Could not find insertion point for ${filename}`);
        }
    } else {
        console.log(`❌ File not found: ${filename}`);
    }
});

console.log('Dataset addition complete!');