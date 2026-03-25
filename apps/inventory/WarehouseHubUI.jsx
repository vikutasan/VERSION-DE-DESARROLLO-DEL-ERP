import React, { useState } from 'react';

/**
 * R DE RICO - WAREHOUSE & INVENTORY HUB (Industrial Control)
 * 
 * Gestión multialmacén para Planta y Sucursales.
 * Control de stock real, mermas, transferencias y alertas de resurtido.
 */

export const WarehouseHubUI = () => {
    const [activeTab, setActiveTab] = useState('stock'); // stock | movements | warehouses | alerts

    const mockStock = [
        { id: 'SKU-001', name: 'Harina de Trigo (Extra)', category: 'Insumos', location: 'Planta - Rack A', stock: 850, unit: 'kg', min: 200, status: 'OK' },
        { id: 'SKU-002', name: 'Azúcar Refinada', category: 'Insumos', location: 'Planta - Rack B', stock: 45, unit: 'kg', min: 100, status: 'LOW' },
        { id: 'SKU-003', name: 'Pastel Signature Chocolate', category: 'Producto Terminado', location: 'Vitrina Toluca', stock: 12, unit: 'pzs', min: 5, status: 'OK' },
        { id: 'SKU-004', name: 'Mantequilla Premium', category: 'Insumos', location: 'Cámara Fría 1', stock: 5, unit: 'kg', min: 20, status: 'CRITICAL' },
    ];

    const mockMovements = [
        { id: 'MOV-101', date: '02/03/2026 10:15', product: 'Harina de Trigo', type: 'IN', qty: '+500 kg', reason: 'Compra Proveedor #88' },
        { id: 'MOV-102', date: '02/03/2026 12:40', product: 'Azúcar Refinada', type: 'OUT', qty: '-15 kg', reason: 'Batch Producción #402' },
        { id: 'MOV-103', date: '02/03/2026 14:05', product: 'Mantequilla Premium', type: 'WASTE', qty: '-2 kg', reason: 'Producto Caducado' },
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white p-10 font-sans animate-fade">

            {/* Header de Almacén */}
            <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-10">
                <div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter text-amber-500">Warehouse Control Hub</h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-3 underline decoration-amber-500/30">Gestión de Inventario Industrial | R DE RICO</p>
                </div>

                <div className="flex bg-gray-900/50 p-2 rounded-2xl border border-gray-800">
                    {['stock', 'movements', 'warehouses', 'alerts'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-amber-600 shadow-xl shadow-amber-600/30 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab === 'stock' ? 'Existencias' : tab === 'movements' ? 'Movimientos' : tab === 'warehouses' ? 'Almacenes' : 'Alertas (IA)'}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'stock' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                    {/* Buscador y Filtros */}
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Buscar por SKU, nombre o ubicación..."
                            className="flex-1 bg-gray-900/50 border border-gray-800 p-5 rounded-2xl outline-none focus:border-amber-500 font-bold transition-all placeholder:text-gray-700"
                        />
                        <button className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-amber-600/20 active:scale-95 transition-all">+ Nueva Entrada</button>
                    </div>

                    {/* Tabla de Inventario */}
                    <div className="glass overflow-hidden rounded-[50px]">
                        <table className="w-full text-left">
                            <thead className="bg-amber-600/5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                                <tr>
                                    <th className="p-8">Producto / SKU</th>
                                    <th className="p-8">Categoría</th>
                                    <th className="p-8">Ubicación</th>
                                    <th className="p-8">Stock Actual</th>
                                    <th className="p-8 text-right">Estatus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/30 text-xs font-bold">
                                {mockStock.map((item, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-all">
                                        <td className="p-8">
                                            <p className="text-white text-sm font-black uppercase italic">{item.name}</p>
                                            <p className="text-[9px] text-gray-500 font-mono mt-1">{item.id}</p>
                                        </td>
                                        <td className="p-8 text-gray-400 font-black uppercase text-[10px] tracking-widest">{item.category}</td>
                                        <td className="p-8 text-indigo-400">{item.location}</td>
                                        <td className="p-8 font-mono text-lg">
                                            <span className="text-white">{item.stock}</span>
                                            <span className="text-gray-600 ml-2">{item.unit}</span>
                                        </td>
                                        <td className="p-8 text-right">
                                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${item.status === 'OK' ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/20' :
                                                    item.status === 'LOW' ? 'bg-amber-600/10 text-amber-500 border border-amber-500/20' :
                                                        'bg-red-600/10 text-red-500 border border-red-500/20 animate-pulse'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'movements' && (
                <div className="animate-in slide-in-from-right-8 duration-500">
                    <div className="glass overflow-hidden rounded-[50px]">
                        <div className="p-8 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-2xl font-black uppercase italic">Kardex de Movimientos</h2>
                            <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-all">Descargar Reporte EXCEL ↓</button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-800 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                <tr>
                                    <th className="p-6">Fecha / Hora</th>
                                    <th className="p-6">Producto</th>
                                    <th className="p-6">Tipo</th>
                                    <th className="p-6">Cantidad</th>
                                    <th className="p-6">Motivo / Referencia</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/30 text-xs font-bold font-mono text-gray-300">
                                {mockMovements.map((mov, i) => (
                                    <tr key={i} className="hover:bg-white/2 transition-colors">
                                        <td className="p-6">{mov.date}</td>
                                        <td className="p-6 text-white font-sans font-black uppercase italic">{mov.product}</td>
                                        <td className="p-6">
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded ${mov.type === 'IN' ? 'bg-emerald-600 text-white' : mov.type === 'OUT' ? 'bg-indigo-600 text-white' : 'bg-red-600 text-white'}`}>
                                                {mov.type}
                                            </span>
                                        </td>
                                        <td className={`p-6 text-sm font-black ${mov.type === 'IN' ? 'text-emerald-500' : 'text-red-500'}`}>{mov.qty}</td>
                                        <td className="p-6 italic text-gray-500 font-sans">{mov.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <footer className="fixed bottom-8 left-10 text-[8px] text-gray-800 font-black uppercase tracking-[0.5em] flex items-center gap-4">
                <span>R DE RICO ERP | INVENTORY ENGINE V4.0</span>
                <div className="w-1 h-1 bg-gray-900 rounded-full" />
                <span className="text-gray-900 border border-gray-900 px-2 py-0.5 rounded">RACK SENSORS: ONLINE</span>
            </footer>
        </div>
    );
};
