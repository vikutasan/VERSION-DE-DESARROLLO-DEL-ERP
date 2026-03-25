const fs = require('fs');
let text = fs.readFileSync('c:/Users/lavic/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx', 'utf8');

text = text.replace(/ðŸ–¥ï¸ /g, '🖥️');
text = text.replace(/ðŸ“Œ/g, '📌');

fs.writeFileSync('c:/Users/lavic/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx', text, 'utf8');
