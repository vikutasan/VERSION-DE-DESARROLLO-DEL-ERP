const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:\\Users\\lavic\\Downloads\\ERP R DE RICO\\importar_productos_AQUI.json', 'utf8'));
const categories = [...new Set(data.map(item => item.category))].sort();
console.log(JSON.stringify(categories, null, 2));
