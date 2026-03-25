import React, { useState, useEffect } from 'react';

/**
 * R de Rico - Waiter App (PWA)
 * 
 * Interfaz "Tap-to-Order" para meseros:
 * 1. Categorías Visuales Rápidas.
 * 2. Modificadores Dinámicos.
 * 3. Mapa de Mesas en tiempo real (WebSockets).
 * 4. Sincronización Offline-First.
 */

export const WaiterAppUI = ({ tables, categories, menuItems }) => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [currentOrder, setCurrentOrder] = useState([]);
    const [showModifiers, setShowModifiers] = useState(null);

    // Simulación de WebSockets para actualización de KDS
    const sendToKDS = (order) => {
        console.log("[WebSocket] Enviando orden a Cocina/Barra:", order);
        // Acción: El KDS recibirá esta orden al instante
    };

    const addToOrder = (product) => {
        if (product.hasModifiers) {
            setShowModifiers(product);
        } else {
            setCurrentOrder([...currentOrder, { ...product, quantity: 1 }]);
        }
    };

    return (
        <div className="bg-[#0f1113] min-h-screen text-white font-sans flex flex-col">
            {/* Header: Estatus del Salón */}
            <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center shadow-lg">
                <h1 className="text-xl font-black text-orange-500 italic">R DE RICO | SALÓN</h1>
                <div className="flex gap-2">
                    <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-green-500/50">WIFI OK</span>
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-blue-500/50 underline">MODO PWA</span>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Panel Izquierdo: Mapa de Mesas y Menú */}
                <div className="flex-1 p-4 overflow-y-auto space-y-6">
                    {/* Mapa de Mesas */}
                    <section>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Mapa de Salón</h2>
                        <div className="grid grid-cols-4 gap-3">
                            {tables.map(table => (
                                <button
                                    key={table.id}
                                    onClick={() => setSelectedTable(table.id)}
                                    className={`p-4 rounded-xl border-2 transition-all active:scale-95 ${selectedTable === table.id ? 'border-orange-500 bg-orange-500/10 scale-105' : 'border-gray-800 bg-gray-900/40'
                                        }`}
                                >
                                    <div className={`w-3 h-3 rounded-full mb-2 ${table.status === 'libre' ? 'bg-green-500' :
                                        table.status === 'proceso' ? 'bg-yellow-500 animate-pulse' :
                                            table.status === 'comiendo' ? 'bg-red-500' : 'bg-blue-500'
                                        }`} />
                                    <span className="block text-2xl font-black">Mesa {table.name}</span>
                                    <span className="text-[10px] uppercase text-gray-500">{table.status}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Menú de Categorías */}
                    <section>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Menú Rápido</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => addToOrder(item)}
                                    className="bg-gray-800/50 p-4 rounded-2xl flex items-center gap-4 hover:bg-gray-700 transition-colors border border-gray-700/50"
                                >
                                    <div className="w-16 h-16 bg-gray-700 rounded-xl overflow-hidden shadow-inner flex items-center justify-center text-3xl">
                                        {item.icon || '🥖'}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-lg">{item.name}</p>
                                        <p className="text-orange-400 font-mono">${item.price}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Panel Derecho: Comanda Actual */}
                <div className="w-80 bg-gray-950 border-l border-gray-800 p-4 flex flex-col shadow-2xl">
                    <div className="flex-1">
                        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                            🛒 ORDEN {selectedTable ? `MESA ${selectedTable}` : ''}
                        </h2>
                        <div className="space-y-4">
                            {currentOrder.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-900/80 p-3 rounded-xl ring-1 ring-gray-800">
                                    <div>
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.modifiers?.join(", ")}</p>
                                    </div>
                                    <span className="font-mono text-orange-400 font-bold">${item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={!selectedTable || currentOrder.length === 0}
                        onClick={() => sendToKDS(currentOrder)}
                        className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 text-white font-black py-5 rounded-2xl shadow-2xl shadow-orange-500/20 transition-all active:scale-95 uppercase tracking-widest"
                    >
                        Enviar a Cocina
                    </button>
                </div>
            </div>

            {/* Modal de Modificadores (Simulado) */}
            {showModifiers && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                        <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Personalizar {showModifiers.name}</h3>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {["Sin Cebolla", "Extra Queso", "Masa Gruesa", "Picante"].map(mod => (
                                <button key={mod} className="p-4 bg-gray-800 rounded-xl border border-gray-700 font-bold hover:bg-orange-600/20 active:border-orange-500 transition-colors uppercase text-sm">
                                    {mod}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setCurrentOrder([...currentOrder, { ...showModifiers, price: showModifiers.price + 15, modifiers: ["Extra Queso"] }]);
                                setShowModifiers(null);
                            }}
                            className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-colors"
                        >
                            Confirmar & Agregar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
