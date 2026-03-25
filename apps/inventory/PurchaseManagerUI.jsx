import React, { useState } from 'react';

export const PROVIDERS_MASTER = [
    { id: 'PROV-001', name: 'Harina de México S.A.', category: 'Materia Prima' },
    { id: 'PROV-002', name: 'Lácteos del Valle', category: 'Lácteos' },
    { id: 'PROV-003', name: 'Global Bakery Supplies', category: 'Insumos Varios' },
    { id: 'PROV-004', name: 'Empaques Pro-Toluca', category: 'Empaque' },
    { id: 'PROV-005', name: 'Producción Interna', category: 'Interno' }
];

export const PurchaseManagerUI = () => {
    // Simulamos datos que vendrían de los almacenes
    const [purchaseOrders, setPurchaseOrders] = useState([
        { id: 'PO-1001', provider: PROVIDERS_MASTER[0].name, items: 3, total: 12500, state: 'PENDING', date: '2024-03-10' },
        { id: 'PO-1002', provider: PROVIDERS_MASTER[1].name, items: 2, total: 4200, state: 'SENT', date: '2024-03-09' },
    ]);

    const [lowStockItems, setLowStockItems] = useState([
        { sku: 'INS-001', name: 'Harina de Trigo', current: 20, min: 50, unit: 'KG', provider: PROVIDERS_MASTER[0].name, cost: 18.5 },
        { sku: 'INS-002', name: 'Mantequilla Premium', current: 2, min: 10, unit: 'KG', provider: PROVIDERS_MASTER[1].name, cost: 120 },
        { sku: 'INS-005', name: 'Levadura Seca', current: 1, min: 5, unit: 'KG', provider: PROVIDERS_MASTER[0].name, cost: 240 },
    ]);

    const [selectedItems, setSelectedItems] = useState([]);

    const toggleSelectItem = (sku) => {
        if (selectedItems.includes(sku)) {
            setSelectedItems(selectedItems.filter(s => s !== sku));
        } else {
            setSelectedItems([...selectedItems, sku]);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white p-10 font-sans selection:bg-indigo-500 selection:text-white">
            
            <header className="mb-12 flex justify-between items-end">
                <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                    <h1 className="text-6xl font-black uppercase italic tracking-tighter text-indigo-500">Gestión de Compras</h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mt-2">Abastecimiento Inteligente | R DE RICO ERP</p>
                </div>
                <div className="flex gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-3xl flex gap-10">
                        <div>
                            <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Alertas Criticas</p>
                            <p className="text-2xl font-black text-red-500 italic">{lowStockItems.length}</p>
                        </div>
                        <div className="w-px bg-gray-800" />
                        <div>
                            <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Órdenes Pendientes</p>
                            <p className="text-2xl font-black text-amber-500 italic">2</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-10">
                
                {/* Columna Izquierda: Requerimientos de Compra */}
                <div className="col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <section className="bg-gray-900/30 border border-gray-800 rounded-[48px] overflow-hidden backdrop-blur-xl">
                        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-indigo-600/5">
                            <h3 className="text-xl font-black uppercase italic tracking-widest text-[#c1d72e]">Lista de Resurtido Automático</h3>
                            <span className="text-[10px] bg-[#c1d72e] text-black px-4 py-1.5 rounded-full font-black uppercase">Stock Bajo Detectado</span>
                        </div>
                        
                        <div className="p-4">
                            <table className="w-full text-left border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-[9px] font-black uppercase text-gray-600 tracking-widest">
                                        <th className="px-6 pb-4">🛒</th>
                                        <th className="px-6 pb-4">Insumo / Artículo</th>
                                        <th className="px-6 pb-4">Stock Actual</th>
                                        <th className="px-6 pb-4">Stock Mínimo</th>
                                        <th className="px-6 pb-4">Proveedor Sugerido</th>
                                        <th className="px-6 pb-4">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockItems.map(item => (
                                        <tr key={item.sku} className={`group hover:bg-white/5 transition-all ${selectedItems.includes(item.sku) ? 'bg-indigo-600/10' : ''}`}>
                                            <td className="px-6 py-6 rounded-l-2xl">
                                                <button 
                                                    onClick={() => toggleSelectItem(item.sku)}
                                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedItems.includes(item.sku) ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-800 hover:border-indigo-500'}`}
                                                >
                                                    {selectedItems.includes(item.sku) && '✓'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-6 font-black uppercase italic text-sm tracking-tight text-white/90">
                                                {item.name}
                                                <p className="text-[8px] font-mono text-gray-600 not-italic mt-0.5">{item.sku}</p>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-xl font-black font-mono text-red-500">{item.current}</span>
                                                <span className="ml-1 text-[9px] font-black text-gray-600">{item.unit}</span>
                                            </td>
                                            <td className="px-6 py-6 font-mono text-gray-400 text-sm tracking-widest">
                                                {item.min} {item.unit}
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-[10px] bg-gray-800 px-3 py-1.5 rounded-lg text-gray-400 font-bold uppercase">{item.provider}</span>
                                            </td>
                                            <td className="px-6 py-6 rounded-r-2xl">
                                                <button className="text-[9px] font-black uppercase tracking-widest text-indigo-400 opacity-0 group-hover:opacity-100 transition-all hover:text-white underline decoration-indigo-500/30 underline-offset-4">Historial de Costos</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* NUEVO: Maestro de Proveedores */}
                    <section className="bg-gray-900/30 border border-gray-800 rounded-[48px] overflow-hidden backdrop-blur-xl">
                        <div className="p-8 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-xl font-black uppercase italic tracking-widest text-indigo-400">Directorio Maestro de Proveedores</h3>
                            <button className="bg-indigo-600 text-[9px] font-black uppercase px-6 py-2 rounded-full hover:scale-105 transition-all">Alta de Proveedor +</button>
                        </div>
                        <div className="p-8 grid grid-cols-2 gap-6">
                            {PROVIDERS_MASTER.map(prov => (
                                <div key={prov.id} className="p-6 bg-black/40 border border-gray-800 rounded-[32px] flex justify-between items-center group hover:border-indigo-500 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 font-black">
                                            {prov.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase italic text-white/90">{prov.name}</p>
                                            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{prov.category} | {prov.id}</p>
                                        </div>
                                    </div>
                                    <button className="text-[10px] opacity-0 group-hover:opacity-100 transition-all text-indigo-400 hover:text-white underline underline-offset-4 decoration-indigo-500/30">Ficha</button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Columna Derecha: Resumen de Orden */}
                <div className="col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                    <section className="bg-indigo-600 rounded-[48px] p-10 shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-1000" />
                        
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-8 leading-none">Generar Orden de Compra</h3>
                        
                        <div className="space-y-4 mb-10">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-indigo-100">
                                <span>Artículos Seleccionados</span>
                                <span>{selectedItems.length}</span>
                            </div>
                            <div className="h-px bg-white/20" />
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase text-indigo-100">Subtotal Estimado</span>
                                <span className="text-4xl font-black italic tracking-tighter">$0.00</span>
                            </div>
                        </div>

                        <button 
                            disabled={selectedItems.length === 0}
                            className={`w-full py-6 rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${selectedItems.length > 0 ? 'bg-white text-indigo-600 hover:scale-[1.02] active:scale-95' : 'bg-white/20 text-white/40 cursor-not-allowed'}`}
                        >
                            Crear Orden Consolidada
                        </button>
                    </section>

                    <section className="bg-gray-900/30 border border-gray-800 rounded-[48px] p-8 backdrop-blur-xl">
                        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-6 px-2">Órdenes Sugeridas por Proveedor</h4>
                        <div className="space-y-3">
                            {['Harina de México S.A.', 'Lácteos del Valle'].map(p => (
                                <div key={p} className="p-4 bg-black/40 border border-gray-800 rounded-2xl flex justify-between items-center group hover:border-[#c1d72e] cursor-pointer transition-all">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-indigo-400">{p}</p>
                                        <p className="text-[8px] text-gray-600 font-bold uppercase mt-1">Sugerencia: 2 artículos</p>
                                    </div>
                                    <span className="text-xl group-hover:scale-125 transition-transform text-[#c1d72e]">⚡</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

            </div>

            <footer className="fixed bottom-10 left-10 text-[8px] text-gray-700 font-black uppercase tracking-[0.5em] flex items-center gap-4 pointer-events-none">
                <span>R DE RICO ERP | PROCUREMENT MODULE V1.0</span>
                <div className="w-1 h-1 bg-gray-800 rounded-full" />
                <span className="text-indigo-900/40">Integración con Inventarios tiempo real</span>
            </footer>

        </div>
    );
};
