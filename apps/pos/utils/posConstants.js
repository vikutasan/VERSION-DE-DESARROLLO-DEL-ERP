export const INITIAL_CATEGORIES = [
    { name: "1.-EMPAQUE Y PAN BLANCO", icon: "🥖", visionEnabled: true },
    { name: "2.-A - B", icon: "🍪", visionEnabled: true },
    { name: "3.-C - D", icon: "🍩", visionEnabled: true },
    { name: "4.-E - K", icon: "🥐", visionEnabled: true },
    { name: "5.-L - M", icon: "🧁", visionEnabled: true },
    { name: "6.-N - P", icon: "🥧", visionEnabled: true },
    { name: "7.-R - S", icon: "🍰", visionEnabled: true },
    { name: "8.-T - Z", icon: "🥨", visionEnabled: true },
    { name: "17.-ROSCA DE REYES", icon: "👑", visionEnabled: true },
    { name: "9.-LACTEOS", icon: "🥛", visionEnabled: false },
    { name: "10.-SOBRE PEDIDO", icon: "🎂", visionEnabled: false },
    { name: "11.-ESPORADICOS", icon: "🎁", visionEnabled: false },
    { name: "12.-CAFES Y CHOCOLATES", icon: "☕", visionEnabled: false },
    { name: "13.-SOUVENIRS", icon: "🛍️", visionEnabled: false },
    { name: "14.-HELADOS", icon: "🍨", visionEnabled: false },
    { name: "15.-PALETAS", icon: "🍭", visionEnabled: false },
    { name: "16.-AGUAS Y MALTEADAS", icon: "🥤", visionEnabled: false }
];

export const getProductEmoji = (p) => {
    const name = (p.name || '').toUpperCase();
    const categoryObj = p.category;
    const catName = (typeof categoryObj === 'string' ? categoryObj : (categoryObj?.name || 'GENERAL')).toUpperCase();
    
    if (catName.includes('LACTEOS') || name.includes('LECHE')) return '🥛';
    if (name.includes('CAF')) return '☕';
    if (name.includes('AGUA')) return '💧';
    if (name.includes('HELADO')) return '🍨';
    if (name.includes('PALETA')) return '🍭';
    if (name.includes('MALTEADA')) return '🥤';
    if (name.includes('PASTEL') || name.includes('TARTA')) return '🍰';
    if (name.includes('ROSCA')) return '👑';
    if (name.includes('DONA')) return '🍩';
    if (name.includes('CONCHA')) return '🥯';
    if (name.includes('BOLILLO') || name.includes('TELERA') || name.includes('BAGUETTE')) return '🥖';
    if (name.includes('CROISSANT') || name.includes('CUERNITO')) return '🥐';
    if (name.includes('GALLETA') || name.includes('POLVORON')) return '🍪';
    if (name.includes('MUFFIN') || name.includes('MAGDALENA')) return '🧁';
    if (catName.includes('PAN')) return '🍞';
    return '📦';
};

export const terminals = [
    { id: 'T6', name: 'Terminal 6', icon: '🖥️' },
    { id: 'T5', name: 'Terminal 5', icon: '🖥️' },
    { id: 'T4', name: 'Terminal 4', icon: '🖥️' },
    { id: 'T3', name: 'Terminal 3', icon: '🖥️' },
    { id: 'T2', name: 'Terminal 2', icon: '🖥️' },
    { id: 'CAJA', name: 'CAJA', icon: '/assets/pos_register.png' }
];
