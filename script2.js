import fs from 'fs';
let text = fs.readFileSync('c:/Users/lavic/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx', 'utf8');

const replacement = `const PRODUCTS = [
        // EMPAQUE Y PAN BLANCO
        { id: 101, name: 'BOLILLO CALIENTE', price: 4.50, category: 'EMPAQUE Y PAN BLANCO', image: '🥖' },
        { id: 102, name: 'TELERA TRADICIONAL', price: 5.00, category: 'EMPAQUE Y PAN BLANCO', image: '🥖' },
        { id: 103, name: 'PAN DE CAJA INTEGRAL', price: 45.00, category: 'EMPAQUE Y PAN BLANCO', image: '🍞' },
        
        // A-B
        { id: 104, name: 'ALFAJOR DE MAICENA', price: 18.00, category: 'A-B', image: '🍪' },
        { id: 105, name: 'BERLINA RELLENA', price: 22.00, category: 'A-B', image: '🍩' },
        { id: 106, name: 'BISQUET TRADICIONAL', price: 15.00, category: 'A-B', image: '🥐' },

        // C-D
        { id: 107, name: 'CONCHA VAINILLA', price: 15.00, category: 'C-D', image: '🥯' },
        { id: 108, name: 'CONCHA CHOCOLATE', price: 15.00, category: 'C-D', image: '🥯' },
        { id: 109, name: 'CUERNITO MANTEQUILLA', price: 16.00, category: 'C-D', image: '🥐' },
        { id: 110, name: 'DONA CHOCOLATE', price: 18.00, category: 'C-D', image: '🍩' },

        // E-K
        { id: 111, name: 'EMPANADA DE PIÑA', price: 20.00, category: 'E-K', image: '🥟' },
        { id: 112, name: 'GARIBALDI', price: 25.00, category: 'E-K', image: '🧁' },

        // L-M
        { id: 113, name: 'MUFFIN DE MORAS', price: 28.00, category: 'L-M', image: '🧁' },
        { id: 114, name: 'MAGDALENA', price: 15.00, category: 'L-M', image: '🥮' },

        // N-P
        { id: 115, name: 'OREJA CRUJIENTE', price: 17.00, category: 'N-P', image: '🥐' },
        { id: 116, name: 'PAN DE MUERTO', price: 25.00, category: 'N-P', image: '🍞' },
        { id: 117, name: 'PASTEL MIL HOJAS', price: 350.00, category: 'N-P', image: '🍰' },

        // R-S
        { id: 118, name: 'REBANADA DE MANTEQUILLA', price: 12.00, category: 'R-S', image: '🍰' },

        // T-Z
        { id: 119, name: 'TRENZA GLACEADA', price: 22.00, category: 'T-Z', image: '🥨' },

        // ROSCA DE REYES
        { id: 120, name: 'ROSCA FAMILIAR', price: 420.00, category: 'ROSCA DE REYES', image: '🥨' },
        { id: 121, name: 'ROSCA INDIVIDUAL', price: 55.00, category: 'ROSCA DE REYES', image: '🥨' },

        // LACTEOS
        { id: 122, name: 'LECHE ENTERA 1L', price: 28.00, category: 'LACTEOS', image: '🥛' },

        // HELADOS
        { id: 123, name: 'HELADO VAINILLA 1L', price: 85.00, category: 'HELADOS', image: '🍨' },

        // AGUAS Y MALTEADAS
        { id: 124, name: 'AGUA NATURAL 500ML', price: 12.00, category: 'AGUAS Y MALTEADAS', image: '💧' }
    ];`;

const startIdx = text.indexOf('const PRODUCTS');
if (startIdx !== -1) {
    const endIdx = text.indexOf('];', startIdx) + 2;
    text = text.substring(0, startIdx) + replacement + text.substring(endIdx);
    fs.writeFileSync('c:/Users/lavic/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx', text, 'utf8');
}
