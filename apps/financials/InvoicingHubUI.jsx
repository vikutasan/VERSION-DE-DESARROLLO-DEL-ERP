import React, { useState } from 'react';

/**
 * R DE RICO - HUB DE FACTURACIÓN ELECTRÓNICA (CFDI 4.0)
 * 
 * Interfaz profesional para la emisión y gestión de facturas fiscales 
 * conectadas directamente a la operación de POS y B2B.
 */

export const InvoicingHubUI = () => {
    const [view, setView] = useState('active'); // active | clients | settings
    const [stamping, setStamping] = useState(false);

    const invoices = [
        { id: 'FAC-001', rfc: 'GACM800101XYZ', name: 'RESTAURANTE GAUCHO S.A.', amount: '$12,500.00', date: '02/03/2026', status: 'STAMPED', uuid: 'E098-B234-A112-X987' },
        { id: 'FAC-002', rfc: 'SOTS921015ABC', name: 'SOFIA SOTO LOPEZ', amount: '$425.00', date: '02/03/2026', status: 'PENDING', uuid: '-' },
        { id: 'FAC-003', rfc: 'XAXX010101000', name: 'PUBLICO EN GENERAL', amount: '$8,200.00', date: '01/03/2026', status: 'STAMPED', uuid: 'F123-C445-B667-Z001' },
    ];

    const handleStamp = (id) => {
        setStamping(true);
        setTimeout(() => setStamping(false), 2000); // Simulación de timbrado con el PAC
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white p-10 font-sans animate-fade">

            {/* Header Fiscal */}
            <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-10">
                <div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter text-blue-500">Facturación Fiscal</h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-3 underline decoration-blue-500/30">Protocolo de Emisión CFDI 4.0 | SAT</p>
                </div>

                <div className="flex bg-gray-900/50 p-2 rounded-2xl border border-gray-800">
                    {['active', 'clients', 'settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setView(tab)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === tab ? 'bg-blue-600 shadow-xl shadow-blue-600/30 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab === 'active' ? 'Facturas Emitidas' : tab === 'clients' ? 'Datos Fiscales Clientes' : 'Configuración CSD'}
                        </button>
                    ))}
                </div>
            </div>

            {view === 'active' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                    {/* Dashboard de timbres */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="glass p-8 rounded-[40px] border-blue-500/20">
                            <p className="text-[9px] font-black uppercase text-gray-500 mb-3 tracking-widest">Timbres Disponibles</p>
                            <h2 className="text-3xl font-black text-blue-400">4,821 <span className="text-xs text-blue-900 tracking-tighter">/ 5,000</span></h2>
                        </div>
                        <div className="glass p-8 rounded-[40px]">
                            <p className="text-[9px] font-black uppercase text-gray-500 mb-3 tracking-widest">Facturado Hoy</p>
                            <h2 className="text-3xl font-black text-white">$21,125.00</h2>
                        </div>
                        <div className="glass p-8 rounded-[40px]">
                            <p className="text-[9px] font-black uppercase text-gray-500 mb-3 tracking-widest">Pendientes Timbrar</p>
                            <h2 className="text-3xl font-black text-orange-500">1</h2>
                        </div>
                        <div className="glass p-8 rounded-[40px] border-emerald-500/20">
                            <p className="text-[9px] font-black uppercase text-gray-500 mb-3 tracking-widest">Status SAT</p>
                            <h2 className="text-3xl font-black text-emerald-500 flex items-center gap-3">ONLINE <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" /></h2>
                        </div>
                    </div>

                    {/* Tabla de Facturas */}
                    <div className="glass overflow-hidden rounded-[50px]">
                        <table className="w-full text-left">
                            <thead className="bg-blue-600/5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                                <tr>
                                    <th className="p-8">ID / RFC</th>
                                    <th className="p-8">Razon Social</th>
                                    <th className="p-8">Importe</th>
                                    <th className="p-8">Estatus / UUID</th>
                                    <th className="p-8 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/30 text-xs font-bold">
                                {invoices.map((inv, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-all group">
                                        <td className="p-8">
                                            <p className="font-mono text-white text-sm">{inv.id}</p>
                                            <p className="text-[9px] text-gray-500 font-sans mt-1 uppercase tracking-widest font-black">{inv.rfc}</p>
                                        </td>
                                        <td className="p-8 uppercase italic font-black text-gray-300">{inv.name}</td>
                                        <td className="p-8 text-lg font-black">{inv.amount}</td>
                                        <td className="p-8 font-mono">
                                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${inv.status === 'STAMPED' ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/20' : 'bg-orange-600/10 text-orange-400 border border-orange-500/20'}`}>
                                                {inv.status}
                                            </span>
                                            <p className="mt-3 text-[8px] text-gray-700 uppercase tracking-tighter truncate max-w-[150px]">{inv.uuid}</p>
                                        </td>
                                        <td className="p-8 text-right space-x-3">
                                            {inv.status === 'PENDING' ? (
                                                <button
                                                    onClick={() => handleStamp(inv.id)}
                                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[9px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                                                >
                                                    {stamping ? 'TIMBRANDO...' : '⚡ TIMBRAR'}
                                                </button>
                                            ) : (
                                                <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-all">
                                                    <button className="bg-gray-800 text-gray-400 hover:text-white px-4 py-2 rounded-lg text-[8px] font-black uppercase border border-gray-700">📄 PDF</button>
                                                    <button className="bg-gray-800 text-gray-400 hover:text-white px-4 py-2 rounded-lg text-[8px] font-black uppercase border border-gray-700">🛠️ XML</button>
                                                    <button className="bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-[8px] font-black uppercase border border-red-500/20">✖ CANCELAR</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'clients' && (
                <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
                    <div className="glass p-12 rounded-[50px] border-blue-500/10">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black uppercase italic">Padrón de Clientes Fiscales</h2>
                            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px]">+ Alta RFC</button>
                        </div>
                        <div className="space-y-4">
                            {/* Input de busqueda */}
                            <input
                                type="text"
                                placeholder="Buscar Cliente por RFC o Razón Social..."
                                className="w-full bg-black/50 border border-gray-800 p-6 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all placeholder:text-gray-700 mb-8"
                            />
                            {[
                                { rfc: 'GACM800101XYZ', name: 'Restaurante Gaucho S.A. de C.V.', regime: '601 - Regimen General de Ley Personas Morales' },
                                { rfc: 'SOTS921015ABC', name: 'Sofia Soto Lopez', regime: '612 - Personas Físicas con Actividades Empresariales' }
                            ].map((c, i) => (
                                <div key={i} className="flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-gray-800 hover:border-blue-500/40 transition-all group">
                                    <div>
                                        <p className="font-mono text-blue-400 text-sm">{c.rfc}</p>
                                        <h3 className="uppercase font-black text-gray-200 mt-1">{c.name}</h3>
                                        <p className="text-[9px] text-gray-600 font-black uppercase mt-1 tracking-widest underline decoration-gray-800">{c.regime}</p>
                                    </div>
                                    <button className="text-[10px] font-black uppercase text-gray-600 group-hover:text-white transition-all">Editar Perfil fiscal →</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Legislativo */}
            <footer className="fixed bottom-8 left-10 text-[8px] text-gray-800 font-black uppercase tracking-[0.5em] flex items-center gap-4">
                <span>R DE RICO ERP | FISCAL ENGINE V4.0</span>
                <div className="w-1 h-1 bg-gray-900 rounded-full" />
                <span className="text-gray-900 border border-gray-900 px-2 py-0.5 rounded">CONEXIÓN SAT SECURE</span>
            </footer>
        </div>
    );
};
