import React, { useState } from 'react';

/**
 * R de Rico - Logistics & Delivery Dashboard
 * 
 * Este módulo permite al Gerente de Operaciones:
 * 1. Visualizar órdenes pagadas listas para entrega.
 * 2. Crear Rutas de Entrega y asignar Vehículos/Choferes.
 * 3. Monitorear el estatus 'ON_ROUTE' de los pasteles.
 */

export const LogisticsDashboardUI = ({ pendingDeliveries, vehicles, drivers }) => {
    const [activeTab, setActiveTab] = useState('planning'); // planning | active_routes | fleet
    const [selectedOrders, setSelectedOrders] = useState([]);

    return (
        <div className="bg-[#0c0d0e] text-white min-h-screen p-8 font-sans">
            {/* Header Estratégico */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-blue-500">Logística de Entrega</h1>
                    <p className="text-gray-500 font-bold tracking-widest text-[10px] uppercase italic">R DE RICO | NÚCLEO ÚLTIMA MILLA</p>
                </div>
                <div className="flex bg-gray-900/50 p-1 rounded-2xl border border-gray-800 backdrop-blur-md">
                    {['planning', 'active_routes', 'fleet'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            {tab === 'planning' ? 'Planeación' : tab === 'active_routes' ? 'En Ruta' : 'Flota'}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'planning' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Lista de Órdenes Pendientes (Izquierda) */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-600 block rounded-full" />
                            Órdenes Listas para Despacho
                        </h2>
                        <div className="bg-gray-900/30 border border-gray-800 rounded-[32px] overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-900/80 text-[10px] uppercase font-black tracking-widest text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4">Selección</th>
                                        <th className="px-6 py-4">Cliente / Pedido</th>
                                        <th className="px-6 py-4">Destino</th>
                                        <th className="px-6 py-4">Prioridad</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {pendingDeliveries.map(order => (
                                        <tr key={order.id} className="hover:bg-blue-600/5 transition-colors">
                                            <td className="px-6 py-5">
                                                <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer" />
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-black text-gray-100">{order.customerName}</p>
                                                <p className="text-[10px] text-gray-500 font-mono italic">#{order.id.slice(0, 8)}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-xs font-bold text-gray-400">{order.deliveryAddress}</p>
                                                <p className="text-[10px] text-blue-500 font-black uppercase">Entrega: {new Date(order.deliveryDate).getHours()}:00h</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="bg-orange-900/20 text-orange-500 px-3 py-1 rounded-md text-[10px] font-black border border-orange-500/20 uppercase">Alta (Pastel)</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Generador de Ruta (Derecha) */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black uppercase tracking-tight">Nueva Ruta</h2>
                        <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-[40px] shadow-2xl space-y-6">
                            <div>
                                <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block">Vehículo Asignado</label>
                                <select className="w-full bg-gray-950 border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-500 font-bold text-sm">
                                    <option value="">Seleccionar unidad...</option>
                                    {vehicles.map(v => <option key={v.id}>{v.model} ({v.plate})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-gray-500 mb-2 block">Chofer Autorizado</label>
                                <select className="w-full bg-gray-950 border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-500 font-bold text-sm">
                                    <option value="">Seleccionar repartidor...</option>
                                    {drivers.map(d => <option key={d.id}>{d.firstName} {d.lastName}</option>)}
                                </select>
                            </div>
                            <div className="bg-black/40 p-5 rounded-2xl border border-dashed border-gray-800">
                                <p className="text-gray-600 text-[10px] font-black uppercase text-center">Resumen de Carga</p>
                                <div className="flex justify-between mt-4">
                                    <span className="text-xs font-bold text-gray-400 italic">Órdenes:</span>
                                    <span className="text-lg font-black text-blue-500">0</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-xs font-bold text-gray-400 italic">Capacidad:</span>
                                    <span className="text-xs font-black">0%</span>
                                </div>
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20 transition-all active:scale-95">
                                Despachar Ruta
                            </button>
                        </div>

                        {/* Mapa Miniatura (Visualización abstracta) */}
                        <div className="bg-gray-800/20 aspect-video rounded-[32px] border border-gray-800 flex items-center justify-center p-6 grayscale">
                            <div className="text-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping mb-2 mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Map View (Inactive)</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'active_routes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Tarjeta de Ruta en Progreso */}
                    <div className="bg-gradient-to-br from-gray-900 to-[#14151a] border border-blue-500/20 p-8 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -mr-10 -mt-10 group-hover:bg-blue-600/10 transition-all" />
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">EN CURSO</span>
                            <p className="text-xs font-mono text-gray-500">ID: RTE-9821</p>
                        </div>
                        <h3 className="text-xl font-black uppercase mb-1">Ruta Metepec Norte</h3>
                        <p className="text-xs font-bold text-gray-500 italic mb-6">Chofer: Juan Pérez | Toyota Hilux</p>

                        {/* Progress Tracker */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-blue-400">Progreso de Entrega</span>
                                <span>3 / 8 Pasteles</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full w-full">
                                <div className="h-full bg-blue-500 rounded-full w-[37.5%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button className="flex-1 bg-gray-900 text-gray-400 font-black py-3 rounded-xl uppercase text-[10px] border border-gray-800">Ver Mapa</button>
                            <button className="flex-1 bg-gray-100 text-black font-black py-3 rounded-xl uppercase text-[10px]">Contactar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
