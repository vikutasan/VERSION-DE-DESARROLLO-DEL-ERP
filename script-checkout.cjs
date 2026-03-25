const fs = require('fs');
let text = fs.readFileSync('c:/Users/lavic/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx', 'utf8');

text = text.replace('VisiÃ³n Inteligente', 'Visión Inteligente');
text = text.replace('ðŸ” ', '🔍');
text = text.replace('Carrito VacÃ­o', 'Carrito Vacío');
text = text.replace('ðŸ›’', '🛒');
text = text.replace('ðŸ’µ', '💵');
text = text.replace('ðŸ’³', '💳');

fs.writeFileSync('c:/Users/lavic/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx', text, 'utf8');
