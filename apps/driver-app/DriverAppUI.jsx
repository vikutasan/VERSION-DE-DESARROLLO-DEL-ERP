import React, { useState } from 'react';

/**
 * R de Rico - Driver Mobile App (PWA)
 * 
 * Interfaz ultra-simplificada para el repartidor en campo.
 * Prioriza: 1) Ver dirección, 2) Abrir Mapas, 3) Confirmar Entrega (Check-in).
 */

export const DriverAppUI = ({ activeRoute, currentDriver }) => {
    const [deliveries, setDeliveries] = useState(activeRoute?.orders || [
        { id: 'ORD-101', customer: 'Lucía Valenzuela', address: 'Av. Morelos 123, Metepec', cake: 'Pastel Signature 20p', status: 'ON_ROUTE' },
        { id: 'ORD-102', customer: 'Roberto Rico', address: 'Col. Centro, Toluca', cake: 'Pastel Chocolate 10p', status: 'ON_ROUTE' },
        { id: 'ORD-103', customer: 'Familia Soto', address: 'Residencial Los Sauces', cake: 'Bolillos (24pcs)', status: 'ON_ROUTE' }
    ]);

    const markAsDelivered = (orderId) => {
        setDeliveries(deliveries.map(d => d.id === orderId ? { ...d, status: 'DELIVERED' } : d));
    };

    return (
        <div className="bg-[#050505] text-white min-h-screen p-5 font-sans flex flex-col">
            {/* Header del Chofer */}
            <header className="flex justify-between items-center mb-8 pt-4">
                <div>
                    <h1 className="text-xl font-black uppercase text-blue-500 tracking-tighter">Misión de Entrega</h1>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{currentDriver?.name || 'Juan Pérez'} | TOYOTA HILUX</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center font-black text-blue-500 shadow-xl shadow-blue-600/10">
                    JP
                </div>
            </header>

            {/* Resumen de Ruta */}
            <div className="bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-500/20 p-5 rounded-3xl mb-8 flex justify-between items-center">
                <div>
                    <p className="text-[10px] font-black uppercase text-blue-400">Ruta Activa</p>
                    <p className="text-lg font-black truncate">Metepec Norte - Toluca</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-blue-500">{deliveries.filter(d => d.status === 'DELIVERED').length}/{deliveries.length}</p>
                    <p className="text-[8px] font-bold text-gray-500 uppercase">Completados</p>
                </div>
            </div>

            {/* Lista de Entregas (Scrollable) */}
            <div className="flex-1 space-y-4 overflow-y-auto pb-20">
                <h2 className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] px-2 mb-4">Próximas Paradas</h2>

                {deliveries.map((delivery) => (
                    <div
                        key={delivery.id}
                        className={`bg-gray-900/40 border transition-all duration-300 rounded-[32px] p-6 ${delivery.status === 'DELIVERED' ? 'border-green-500/30 opacity-50' : 'border-gray-800 hover:border-blue-500/30'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-black">{delivery.customer}</h3>
                                <p className="text-xs font-bold text-gray-400 italic mb-1">{delivery.address}</p>
                                <p className="text-[10px] font-mono text-blue-500 uppercase font-black tracking-widest">{delivery.cake}</p>
                            </div>
                            {delivery.status === 'DELIVERED' ? (
                                <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase ring-4 ring-green-600/10">✓ LISTO</span>
                            ) : (
                                <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-lg text-[9px] font-black border border-blue-500/20">STOP #{deliveries.indexOf(delivery) + 1}</span>
                            )}
                        </div>

                        {delivery.status !== 'DELIVERED' && (
                            <div className="flex gap-3">
                                <button className="flex-1 bg-gray-950 border border-gray-800 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-900 transition-all active:scale-95 shadow-xl">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-blue-500">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Ver Mapa</span>
                                </button>
                                <button
                                    onClick={() => markAsDelivered(delivery.id)}
                                    className="flex-[1.5] bg-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Confirmar Entrega
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Status Bar Inferior (Floating) */}
            <div className="fixed bottom-6 left-5 right-5 bg-black/60 backdrop-blur-2xl border border-gray-800 p-4 rounded-[28px] shadow-2xl flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Localización GPS Activa</p>
                </div>
                <button className="bg-gray-900 p-2 rounded-xl border border-gray-800 hover:bg-gray-800 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-gray-400">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                </button>
            </div>

            {/* Overlay de Carga (Opcional - solo estética) */}
            <div className="mt-8 text-center text-gray-800 text-[8px] font-black uppercase tracking-[0.4em] opacity-30 select-none">
                R de Rico | Logistics App v1.0
            </div>
        </div>
    );
};
