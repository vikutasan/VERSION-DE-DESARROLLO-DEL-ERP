const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'apps', 'pos', 'RetailVisionPOS.jsx');
let content = fs.readFileSync(filePath, 'latin1'); // Leer como latin1 para ver los bytes exactos

console.log("=== Buscando caracteres problema ===");

// Buscar las líneas problemáticas
const lines = content.split('\n');
for (let i = 218; i < Math.min(238, lines.length); i++) {
    const line = lines[i];
    if (line.includes('\xc3') || line.includes('\xf0') || line.includes('\xe2\x80')){
        console.log(`Línea ${i+1} (hex):`, Buffer.from(line, 'latin1').toString('hex').substring(0, 100));
        console.log(`Línea ${i+1} (texto):`, line.substring(0, 100));
    }
}
