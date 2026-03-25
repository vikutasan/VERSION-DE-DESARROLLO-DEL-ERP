const fs = require('fs');
let text = fs.readFileSync('c:/Users/lavic/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx', 'utf8');

text = text.replace('ConfiguraciÃ³n de EstaciÃ³n', 'Configuración de Estación');
text = text.replace('ðŸ–¥ï¸ ', '🖥️');
text = text.replace('Cambiar EstaciÃ³n', 'Cambiar Estación');
text = text.replace('TransacciÃ³n Activa', 'Transacción Activa');
text = text.replace('ðŸ“Œ', '📌');
text = text.replace('Ver PizarrÃ³n', 'Ver Pizarrón');
text = text.replace('ESCÃ NER IA', 'ESCÁNER IA');

fs.writeFileSync('c:/Users/lavic/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx', text, 'utf8');
