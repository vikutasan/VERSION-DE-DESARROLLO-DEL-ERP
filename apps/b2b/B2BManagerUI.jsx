import React, { useState } from 'react';

/**
 * R DE RICO - B2B Business Manager (Abastecimiento a Restaurantes)
 * 
 * Este módulo gestiona la relación industrial con otros negocios.
 * Incluye:
 * 1. Directorio de Clientes (Restaurantes).
 * 2. Captura de Pedidos masivos.
 * 3. Liquidación de Ruta (Control de efectivo vs producto).
 * 4. Terminal de cobro virtual.
 */

export const B2BManagerUI = ({ clients, products }) => {
    const [activeTab, setActiveTab] = useState('clients'); // clients | orders | liquidation | whatsapp_ai
    const [showTerminal, setShowTerminal] = useState(false);

    return (
        <div className="bg-[#0a0b0d] text-white min-h-screen p-8 font-sans">
            {/* Header Corporativo B2B */}
            <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter text-indigo-500">B2B Business Hub</h1>
                    <p className="text-gray-500 font-bold tracking-widest text-xs mt-2 italic uppercase">R DE RICO | DIVISIÓN INDUSTRIAL & MAYOREO</p>
                </div>
                <div className="flex bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800 backdrop-blur-3xl shadow-2xl">
                    {['clients', 'orders', 'liquidation', 'whatsapp_ai'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab === 'clients' ? 'Clientes' : tab === 'orders' ? 'Pedidos' : tab === 'liquidation' ? 'Liquidación' : 'IA WhatsApp'}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'clients' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                    {/* Tabla de Clientes */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                <span className="w-2 h-8 bg-indigo-600 block rounded-full" />
                                Directorio de Restaurantes
                            </h2>
                            <button className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-white/5 active:scale-95 transition-all">
                                + Nuevo Cliente
                            </button>
                        </div>
                        <div className="bg-gray-900/30 border border-gray-800 rounded-[40px] overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-indigo-600/5 text-[10px] uppercase font-black tracking-widest text-indigo-400">
                                    <tr>
                                        <th className="px-8 py-5">Restaurante / Contacto</th>
                                        <th className="px-8 py-5">Ubicación</th>
                                        <th className="px-8 py-5">Venta Semanal</th>
                                        <th className="px-8 py-5">Estatus</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {clients.map(client => (
                                        <tr key={client.id} className="hover:bg-indigo-600/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="font-black text-gray-100 text-lg">{client.restaurantName}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{client.contactName} | {client.phone}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-bold text-gray-400 line-clamp-1">{client.address}</p>
                                                    <a href={client.googleMapsLink} target="_blank" className="text-indigo-500 hover:text-indigo-400">
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-lg font-black text-white">$12,450</p>
                                                <p className="text-[10px] text-green-500 font-black uppercase">+15% vs prev</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-green-600/10 text-green-500 px-3 py-1 rounded-md text-[10px] font-black border border-green-500/20 uppercase">ACTIVO</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sugerencia de Producción B2B */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-orange-500">Predicción de Demanda</h2>
                        <div className="bg-orange-500/5 border border-orange-500/20 p-8 rounded-[40px] shadow-2xl">
                            <p className="text-[10px] font-black uppercase text-orange-500 mb-6 tracking-widest italic">Sugerencia para Próxima Semana</p>
                            <div className="space-y-4">
                                {[
                                    { name: 'Brownie Industrial', qty: 450, unit: 'unidades' },
                                    { name: 'Pay de Queso Premium', qty: 85, unit: 'unidades' },
                                    { name: 'Bolillo Restaurante', qty: 1200, unit: 'unidades' }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-gray-800">
                                        <span className="text-xs font-black uppercase text-gray-400">{item.name}</span>
                                        <div className="text-right">
                                            <span className="text-xl font-black text-white">{item.qty}</span>
                                            <span className="text-[8px] block font-bold text-gray-500 uppercase">{item.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full bg-orange-600 text-white py-4 rounded-xl mt-8 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
                                Mandar a Plan de Producción
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'liquidation' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Total Producto Cargado</p>
                            <p className="text-3xl font-black">1,850 <span className="text-xs font-bold text-gray-600">PCS</span></p>
                        </div>
                        <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Producto Entregado</p>
                            <p className="text-3xl font-black text-green-500">1,842 <span className="text-xs font-bold text-gray-600 text-green-900">PCS</span></p>
                        </div>
                        <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Mermas / Devoluciones</p>
                            <p className="text-3xl font-black text-red-500">8 <span className="text-xs font-bold text-gray-600 text-red-900">PCS</span></p>
                        </div>
                        <div className="bg-indigo-600/20 p-6 rounded-3xl border border-indigo-500/30">
                            <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Efectivo por Entregar</p>
                            <p className="text-3xl font-black text-white">$45,892.00</p>
                        </div>
                    </div>

                    <div className="bg-gray-900/30 border border-gray-800 rounded-[40px] p-10">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black uppercase italic">Reporte de Liquidación de Ruta</h3>
                            <button onClick={() => setShowTerminal(true)} className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-2xl flex items-center gap-2">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                                    <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
                                </svg>
                                Activar Terminal de Cobro
                            </button>
                        </div>
                        <div className="space-y-4">
                            {/* Lista de restaurantes visitados */}
                            {[
                                { name: 'Restaurante El Gaucho', status: 'PAID', amount: '$8,200', type: 'CARD' },
                                { name: 'Pizzería Napolitana', status: 'PAID', amount: '$3,450', type: 'CASH' },
                                { name: 'Hotel Marriott Toluca', status: 'PAID', amount: '$15,800', type: 'TRANSFER' }
                            ].map((visit, i) => (
                                <div key={i} className="flex justify-between items-center p-6 bg-black/40 rounded-2xl border border-gray-800 hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center font-black text-gray-500">{i + 1}</div>
                                        <div>
                                            <p className="font-black text-lg text-gray-100 uppercase">{visit.name}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{visit.type} | {visit.status}</p>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black text-white">{visit.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'whatsapp_ai' && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="bg-green-600/10 border border-green-500/30 p-12 rounded-[50px] text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] -mr-32 -mt-32" />
                        <div className="w-20 h-20 bg-green-600 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-600/30">
                            <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10">
                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.814 9.814 0 0012.04 2z" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-black uppercase text-white mb-4">Agente IA WhatsApp (B2B)</h2>
                        <p className="text-gray-400 font-bold max-w-xl mx-auto mb-10 italic">"Hola Chef, soy el asistente de R de Rico. Noté que no has programado tu pedido de Brownies para el jueves, ¿quieres que lo pida igual que la semana pasada?"</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="bg-black/40 p-6 rounded-3xl border border-gray-800">
                                <h4 className="text-[10px] font-black uppercase text-green-500 mb-3 tracking-widest">Recordatorios Programados</h4>
                                <ul className="space-y-3 text-xs font-bold text-gray-400">
                                    <li>• Lunes 09:00 AM: Recordar a Restaurantes de Metepec</li>
                                    <li>• Miércoles 10:00 AM: Confirmar entregas para fin de semana</li>
                                    <li>• Diario: Notificar estatus de ruta 'En Camino'</li>
                                </ul>
                            </div>
                            <div className="bg-black/40 p-6 rounded-3xl border border-gray-800">
                                <h4 className="text-[10px] font-black uppercase text-indigo-500 mb-3 tracking-widest">Estadísticas de IA</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between"><span className="text-xs font-bold text-gray-500 italic">Conversiones:</span> <span className="font-black">82%</span></div>
                                    <div className="flex justify-between"><span className="text-xs font-bold text-gray-500 italic">Pedidos Autogestionados:</span> <span className="font-black">124</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Terminal Virtual */}
            {showTerminal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6 z-[100]">
                    <div className="bg-white text-black p-12 rounded-[50px] max-w-md w-full shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                        <div className="flex justify-between items-center mb-8">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8" />
                            <button onClick={() => setShowTerminal(false)} className="text-gray-400 hover:text-black">✖</button>
                        </div>
                        <p className="text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Cobro a Cliente B2B</p>
                        <h4 className="text-2xl font-black mb-10">Restaurante El Gaucho</h4>
                        <div className="bg-gray-100 p-8 rounded-3xl text-center mb-10">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Importe a Cobrar</p>
                            <p className="text-5xl font-black italic">$8,200.00</p>
                        </div>
                        <button className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-500 transition-all">
                            Procesar Tarjeta
                        </button>
                        <p className="text-center text-[8px] font-black text-gray-400 uppercase mt-6 tracking-widest">Seguridad Cifrada 256-bit | Terminal ID: B2B-T5</p>
                    </div>
                </div>
            )}
        </div>
    );
};
