import React, { useState } from 'react';
import { OrderCard } from '../kds/KDSComponent';

/**
 * R DE RICO - TPV MESEROS & KDS
 * 
 * Módulo especializado para la operación de salón:
 * 1. Gestión de Mesas (Status: Libre, Proceso, Comiendo, Pendiente Pago).
 * 2. Comanda Rápida con Modificadores.
 * 3. Vista KDS integrada para seguimiento.
 */

export const TableServicePOS = () => {
    const [selectedTable, setSelectedTable] = useState(null);
    const [view, setView] = useState('salon'); // 'salon' | 'menu' | 'kds'
    const [orders, setOrders] = useState([
        { id: 'ORD-101', createdAt: new Date(Date.now() - 500000), items: [{ name: 'Pizza Pepperoni', quantity: 1, category: 'PIZZA' }] },
        { id: 'ORD-102', createdAt: new Date(Date.now() - 100000), items: [{ name: 'Café Americano', quantity: 2, category: 'CAFE' }] }
    ]);

    const tables = [
        { id: 1, name: '1', status: 'libre' },
        { id: 2, name: '2', status: 'comiendo' },
        { id: 3, name: '3', status: 'proceso' },
        { id: 4, name: '4', status: 'libre' },
        { id: 5, name: '5', status: 'pendiente_pago' },
        { id: 6, name: 'Terraza 1', status: 'libre' },
    ];

    const menuItems = [
        { id: 'p1', name: 'Pastel Signature', price: 450, icon: '🍰', category: 'BAKERY' },
        { id: 'p2', name: 'Pizza R de Rico', price: 220, icon: '🍕', category: 'PIZZA' },
        { id: 'p3', name: 'Capuccino', price: 55, icon: '☕', category: 'CAFE' },
        { id: 'p4', name: 'Bolillo Docena', price: 48, icon: '🥖', category: 'BAKERY' },
    ];

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a] text-white">
            {/* Header Pro */}
            <header className="h-20 bg-black/60 border-b border-white/5 backdrop-blur-xl flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-orange-600/20">R</div>
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-[0.2em]">TPV Meseros & KDS</h1>
                        <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Salón Principal</p>
                    </div>
                </div>

                <nav className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                    <button
                        onClick={() => setView('salon')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'salon' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        🪑 Salón
                    </button>
                    <button
                        onClick={() => setView('kds')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'kds' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        🍳 Cocina (KDS)
                    </button>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-gray-400">Mesero Activo</p>
                        <p className="text-xs font-bold">Victor M.</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-800 rounded-full border border-white/10"></div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden flex">
                {view === 'salon' ? (
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="max-w-5xl mx-auto space-y-12">
                            <section>
                                <div className="flex justify-between items-end mb-8">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter">Estado del <span className="text-orange-500">Salón</span></h2>
                                    <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Libre</div>
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Ordenando</div>
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Ocupada</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {tables.map(table => (
                                        <button
                                            key={table.id}
                                            onClick={() => { setSelectedTable(table); setView('menu'); }}
                                            className="group relative aspect-square bg-gray-900/40 border border-white/5 rounded-[40px] p-8 flex flex-col justify-between hover:bg-orange-600/10 hover:border-orange-500/30 transition-all duration-500 active:scale-95"
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="text-5xl font-black italic text-white/10 group-hover:text-orange-500/20 transition-colors uppercase tracking-tighter">{table.name}</span>
                                                <div className={`w-4 h-4 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] ${table.status === 'libre' ? 'bg-green-500' :
                                                        table.status === 'proceso' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-orange-400 mb-1">Mesa</p>
                                                <p className="text-2xl font-black">{table.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                ) : view === 'menu' ? (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Selector de Menú */}
                        <div className="flex-1 p-8 overflow-y-auto bg-black/20">
                            <div className="mb-8 flex items-center gap-4">
                                <button onClick={() => setView('salon')} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">⬅</button>
                                <h2 className="text-2xl font-black uppercase tracking-tight">Comanda: Mesa {selectedTable?.name}</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {menuItems.map(item => (
                                    <button key={item.id} className="p-6 bg-gray-900/60 border border-white/5 rounded-3xl flex items-center gap-6 hover:bg-orange-600/10 hover:border-orange-500/20 transition-all text-left">
                                        <span className="text-4xl">{item.icon}</span>
                                        <div className="flex-1">
                                            <p className="font-black uppercase text-sm tracking-wide">{item.name}</p>
                                            <p className="text-orange-500 font-mono font-bold">${item.price}</p>
                                        </div>
                                        <span className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">+</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comanda Lateral */}
                        <div className="w-[400px] border-l border-white/5 bg-black/40 backdrop-blur-2xl p-8 flex flex-col shrink-0">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Orden Actual</h3>
                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                <p className="text-center text-gray-600 italic py-20 font-medium">No hay productos en la orden</p>
                            </div>
                            <div className="pt-8 space-y-4 border-t border-white/5 mt-auto">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-gray-500">Total estim.</span>
                                    <span className="text-4xl font-black text-orange-500 font-mono tracking-tighter">$0.00</span>
                                </div>
                                <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-6 rounded-[30px] shadow-2xl shadow-orange-600/20 transition-all active:scale-95 uppercase tracking-widest">
                                    Enviar a Cocina (KDS)
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 p-8 bg-black/20 overflow-x-auto">
                        <div className="flex gap-8 h-full">
                            {orders.map(order => (
                                <div key={order.id} className="h-fit">
                                    <OrderCard order={order} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
