import React, { useState } from 'react';

/**
 * R de Rico - Maestro Panadero / Production Planning Dashboard
 * 
 * Este módulo es el cerebro operativo para la cocina y panadería.
 * Permite al Jefe de Producción:
 * 1. Ver la producción sugerida (Ventas + Pedidos Especiales).
 * 2. Visualizar la meta en TANDAS (Batches) reales.
 * 3. Ejecutar la "Explosión de Materiales" (Reporte de entrega de almacén).
 */

export const MaestroPanaderoDashboard = ({ dailyPlan }) => {
    const [isApproved, setIsApproved] = useState(false);

    return (
        <div className="bg-[#1a1c1e] text-white p-8 min-h-screen font-sans">
            <div className="flex justify-between items-end mb-8 border-b-2 border-orange-500 pb-4">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-orange-400">Plani-Producción</h1>
                    <p className="text-gray-400 uppercase text-sm tracking-widest font-medium">Sucursal Toluca | Meta del Día</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-mono">{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    <span className="bg-orange-600/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-orange-500/50">INTELIGENCIA MRP ACTIVA</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Tabla de Producción General (Planificada por MRP) */}
                <div className="overflow-hidden rounded-[30px] border border-gray-800 bg-gray-900/30 backdrop-blur-xl">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/80 uppercase text-[10px] font-black tracking-widest text-gray-400">
                            <tr>
                                <th className="px-8 py-5">Producto Signature</th>
                                <th className="px-8 py-5">Predicción Venta</th>
                                <th className="px-8 py-5">Pedidos Especiales (Unidades)</th>
                                <th className="px-8 py-5 text-orange-400 text-center">Tandas (Charolas)</th>
                                <th className="px-8 py-5 text-green-400">Total a Hornear</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {dailyPlan.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-8 py-6 font-black text-xl italic text-gray-100">{item.productName}</td>
                                    <td className="px-8 py-6 text-gray-500 font-bold">{item.suggestedBySales} pcs</td>
                                    <td className="px-8 py-6 text-gray-500 font-bold">{item.customerOrders} pcs</td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="bg-orange-600 text-white px-5 py-2 rounded-xl font-black text-2xl shadow-xl shadow-orange-600/20 ring-1 ring-orange-500">
                                            {item.batchesToProduce}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-green-400 font-black text-3xl font-mono">{item.totalToProduce} <span className="text-[10px] uppercase tracking-widest text-gray-600">piezas</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sección de Pasteles Personalizados (Desde E-commerce) */}
                <div className="mt-4">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-pink-500 mb-6 flex items-center gap-3">
                        <div className="w-2 h-10 bg-pink-600 rounded-full" />
                        Pedidos Especiales Detallados (E-commerce)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Simulación de órdenes detalladas */}
                        {[
                            {
                                customer: "Lucía Valenzuela",
                                cake: "Pastel Signature 20 Personas",
                                spec: "Vainilla + Frutos Rojos + Buttercream",
                                message: "¡Feliz Cumpleaños Abuela!",
                                date: "Hoy 16:00h",
                                status: "PAID"
                            },
                            {
                                customer: "Roberto Rico",
                                cake: "Pastel Chocolate Belga 10 Personas",
                                spec: "Chocolate + Crema Hazelnut + Ganache",
                                message: "R de Rico Inauguración",
                                date: "Mañana 10:00h",
                                status: "PAID"
                            }
                        ].map((order, i) => (
                            <div key={i} className="bg-gray-900/40 border border-gray-800 p-6 rounded-[32px] hover:border-pink-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">CLIENTE: {order.customer}</p>
                                        <h3 className="text-lg font-black text-gray-100">{order.cake}</h3>
                                    </div>
                                    <span className="bg-green-600/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black border border-green-500/20">{order.status}</span>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 italic">
                                        <span className="text-pink-500 font-black uppercase tracking-widest text-[10px]">Config:</span> {order.spec}
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl border border-gray-800">
                                        <span className="text-orange-500 font-black uppercase tracking-widest text-[10px]">Mensaje:</span>
                                        <span className="text-xs font-bold text-gray-100 italic">"{order.message}"</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Entrega: <span className="text-white">{order.date}</span></p>
                                    <button className="bg-pink-600/10 text-pink-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all">Reportar Listo</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <div className="mt-8 flex justify-end gap-4">
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all">
                    Ver Insumos Requeridos
                </button>
                <button
                    onClick={() => setIsApproved(true)}
                    className={`${isApproved ? 'bg-green-600' : 'bg-orange-600 hover:bg-orange-500'} text-white px-12 py-4 rounded-xl font-black uppercase tracking-widest shadow-2xl shadow-orange-500/40 transition-all transform active:scale-95`}
                >
                    {isApproved ? 'Producción en curso...' : 'Aprobar e Iniciar Hornos'}
                </button>
            </div>
        </div>
    );
};
