const fs = require('fs');
let text = fs.readFileSync('c:/Users/lavic/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx', 'utf8');

text = text.replace('ðŸ–¥ï¸ \r\n                            </div>', '🖥️\r\n                            </div>');
text = text.replace('ðŸ–¥ï¸ \n                            </div>', '🖥️\n                            </div>');
text = text.replace('ðŸ“Œ', '📌');

fs.writeFileSync('c:/Users/lavic/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx', text, 'utf8');
