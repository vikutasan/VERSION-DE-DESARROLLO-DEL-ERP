import React, { useState } from 'react';

/**
 * R DE RICO - PURCHASING & PROCUREMENT HUB
 * 
 * Gestión profesional de abastecimiento, órdenes de compra y 
 * relaciones con proveedores para asegurar la cadena de suministro.
 */

export const PurchasingHubUI = () => {
    const [view, setView] = useState('orders'); // orders | vendors | requisitions
    const [isCreatingPO, setIsCreatingPO] = useState(false);

    const mockVendors = [
        { id: 'V-001', name: 'Molinos de México S.A.', rating: '⭐ 4.8', contact: 'Ing. Carlos Ruiz', terms: '30 Días' },
        { id: 'V-002', name: 'Distribuidora Lácteos Toluca', rating: '⭐ 4.5', contact: 'Lic. Martha Soto', terms: 'Contado' },
        { id: 'V-003', name: 'Gas Metropolitano', rating: '⭐ 4.9', contact: 'Atención Clientes', terms: '15 Días' }
    ];

    const mockOrders = [
        { id: 'OC-2026-001', vendor: 'Molinos de México', date: '01/03/2026', total: '$42,500.00', status: 'RECEIVED' },
        { id: 'OC-2026-002', vendor: 'Distribuidora Lácteos', date: '02/03/2026', total: '$8,200.00', status: 'APPROVED' },
        { id: 'OC-2026-003', vendor: 'Gas Metropolitano', date: '02/03/2026', total: '$15,400.00', status: 'PENDING' }
    ];

    const mockRequisitions = [
        { id: 'REQ-101', requester: 'Gerardo Ramos (Baker)', item: 'Harina (2 Tons)', priority: 'URGENT', status: 'PENDING' },
        { id: 'REQ-102', requester: 'Sofía Soto (Manager)', item: 'Cajas Empaque (1000 pzs)', priority: 'NORMAL', status: 'CONVERTED' }
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white p-10 font-sans animate-fade">

            {/* Header de Compras */}
            <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-10">
                <div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter text-emerald-500">Procurement & Sourcing</h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-3 underline decoration-emerald-500/30">Abastecimiento Industrial | R DE RICO ERP</p>
                </div>

                <div className="flex bg-gray-900/50 p-2 rounded-2xl border border-gray-800">
                    {['orders', 'vendors', 'requisitions'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setView(tab)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === tab ? 'bg-emerald-600 shadow-xl shadow-emerald-600/30 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab === 'orders' ? 'Órdenes de Compra' : tab === 'vendors' ? 'Catálogo Proveedores' : 'Requisiciones'}
                        </button>
                    ))}
                </div>
            </div>

            {view === 'orders' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-black uppercase italic">Órdenes de Compra (OC)</h2>
                        <button
                            onClick={() => setIsCreatingPO(true)}
                            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
                        >
                            + Generar OC
                        </button>
                    </div>

                    <div className="glass overflow-hidden rounded-[50px]">
                        <table className="w-full text-left">
                            <thead className="bg-emerald-600/5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                                <tr>
                                    <th className="p-8">Folio / Fecha</th>
                                    <th className="p-8">Proveedor</th>
                                    <th className="p-8">Total</th>
                                    <th className="p-8 text-right">Estatus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/30 text-xs font-bold">
                                {mockOrders.map((oc, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-all group">
                                        <td className="p-8">
                                            <p className="text-white text-sm font-black font-mono">{oc.id}</p>
                                            <p className="text-[9px] text-gray-500 uppercase mt-1">{oc.date}</p>
                                        </td>
                                        <td className="p-8 font-black uppercase italic text-gray-300">{oc.vendor}</td>
                                        <td className="p-8 text-lg font-black">{oc.total}</td>
                                        <td className="p-8 text-right">
                                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${oc.status === 'RECEIVED' ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/20' :
                                                    oc.status === 'APPROVED' ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' :
                                                        'bg-orange-600/10 text-orange-400 border border-orange-500/20'
                                                }`}>
                                                {oc.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'vendors' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-right-8 duration-500">
                    {mockVendors.map((v, i) => (
                        <div key={i} className="glass p-10 rounded-[50px] border-gray-800 hover:border-emerald-500/40 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-black uppercase italic leading-tight">{v.name}</h3>
                                <span className="text-xs bg-black p-2 rounded-lg text-emerald-500 font-bold">{v.rating}</span>
                            </div>
                            <div className="space-y-4 mb-10">
                                <p className="text-[10px] font-black uppercase text-gray-500">Contacto: <span className="text-white font-bold ml-2">{v.contact}</span></p>
                                <p className="text-[10px] font-black uppercase text-gray-500">Términos: <span className="text-white font-bold ml-2 font-mono">{v.terms}</span></p>
                            </div>
                            <button className="w-full py-4 rounded-2xl bg-gray-900 border border-gray-800 font-black uppercase text-[9px] tracking-[0.2em] group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all">Ver Historio Precios →</button>
                        </div>
                    ))}
                </div>
            )}

            {view === 'requisitions' && (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                    <h2 className="text-3xl font-black uppercase italic mb-8">Requisiciones de Operación</h2>
                    {mockRequisitions.map((req, i) => (
                        <div key={i} className="glass p-8 rounded-3xl flex justify-between items-center border-l-4 border-l-orange-500">
                            <div>
                                <h4 className="font-black uppercase text-gray-100 italic">{req.item}</h4>
                                <p className="text-[10px] font-black text-gray-500 mt-1">Solicita: <span className="text-gray-300 underline">{req.requester}</span></p>
                            </div>
                            <div className="flex gap-6 items-center">
                                <span className={`text-[8px] font-black px-3 py-1 rounded ${req.priority === 'URGENT' ? 'bg-red-600' : 'bg-gray-800'}`}>{req.priority}</span>
                                {req.status === 'PENDING' ? (
                                    <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase shadow-lg shadow-emerald-600/20">Convertir a OC</button>
                                ) : (
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">✓ Procesada</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <footer className="fixed bottom-8 left-10 text-[8px] text-gray-800 font-black uppercase tracking-[0.5em] flex items-center gap-4">
                <span>R DE RICO ERP | PROCUREMENT MASTER V4.0</span>
                <div className="w-1 h-1 bg-gray-900 rounded-full" />
                <span className="text-gray-900 border border-gray-900 px-2 py-0.5 rounded">AUTO-SOURCING ACTIVE</span>
            </footer>
        </div>
    );
};
