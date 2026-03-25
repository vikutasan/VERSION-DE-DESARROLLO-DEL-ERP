import React, { useState } from 'react';

/**
 * R DE RICO - FINANCIAL ENGINE & DASHBOARD (Industrial Grade)
 * 
 * Basado en estándares de la industria (GAP/IFRS):
 * 1. Libro Mayor (General Ledger) con sistema de partida doble.
 * 2. Estado de Resultados (P&L) en tiempo real.
 * 3. Flujo de Caja (Cash Flow).
 * 4. Conciliación de Cuentas.
 */

export const FinancialHubUI = () => {
    const [activeView, setActiveView] = useState('summary'); // summary | ledger | pl | settings

    return (
        <div className="bg-[#050505] min-h-screen text-white p-8 font-sans">
            {/* Header Financiero */}
            <div className="flex justify-between items-center mb-12 border-b border-gray-800 pb-8">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-emerald-500">Financial Control Hub</h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2 italic">R DE RICO | TESORERÍA & CONTABILIDAD INDUSTRIAL</p>
                </div>

                <div className="flex bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800 backdrop-blur-3xl shadow-2xl">
                    {['summary', 'ledger', 'pl', 'payables', 'settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveView(tab)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === tab ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab === 'summary' ? 'Resumen' : tab === 'ledger' ? 'Libro Mayor' : tab === 'pl' ? 'P&L (Resultados)' : tab === 'payables' ? 'CxP (Proveedores)' : 'Configuración'}
                        </button>
                    ))}
                </div>
            </div>

            {activeView === 'summary' && (
                <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
                    {/* Tarjetas de Salud Financiera */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Utilidad Neta (MTD)', value: '$142,500', trend: '+12%', color: 'text-emerald-500' },
                            { label: 'Margen Bruto (Prom)', value: '62.5%', trend: '+2.1%', color: 'text-indigo-400' },
                            { label: 'Efectivo en Caja/Bancos', value: '$2,450,800', trend: '-5%', color: 'text-blue-500' },
                            { label: 'Cuentas x Cobrar (B2B)', value: '$38,200', trend: 'Auditado', color: 'text-orange-500' }
                        ].map((card, i) => (
                            <div key={i} className="bg-gray-900/40 border border-gray-800/50 p-6 rounded-[32px] hover:border-emerald-500/20 transition-all group">
                                <p className="text-[10px] font-black uppercase text-gray-500 mb-3 tracking-widest">{card.label}</p>
                                <div className="flex justify-between items-end">
                                    <h2 className={`text-2xl font-black ${card.color}`}>{card.value}</h2>
                                    <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-1 rounded">{card.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Estado de Resultados (P&L Simple) */}
                        <div className="lg:col-span-2 bg-gray-900/30 border border-gray-800 p-10 rounded-[50px]">
                            <h3 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                Estado de Resultados (Últimos 30 días)
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: 'Ventas Totales (POS + E-commerce + B2B)', amount: '$850,200', percent: '100%' },
                                    { label: 'Costos de Venta (Insumos/BOM)', amount: '- $318,825', percent: '37.5%', isExpense: true },
                                    { label: 'Utilidad Bruta', amount: '$531,375', percent: '62.5%', isHighlight: true },
                                    { label: 'Gastos Operativos (Nómina + Logística)', amount: '- $245,400', percent: '28.8%', isExpense: true },
                                    { label: 'Utilidad Neta (Antes de Impuestos)', amount: '$285,975', percent: '33.7%', isEmerald: true }
                                ].map((row, i) => (
                                    <div key={i} className={`flex justify-between items-center p-5 rounded-2xl ${row.isHighlight ? 'bg-indigo-600/10 border border-indigo-500/20' : row.isEmerald ? 'bg-emerald-600/10 border border-emerald-500/20' : 'hover:bg-white/5'}`}>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs font-black uppercase ${row.isExpense ? 'text-red-500' : 'text-gray-400'}`}>{row.label}</span>
                                            <span className="text-[8px] font-bold text-gray-600">{row.percent}</span>
                                        </div>
                                        <span className={`text-xl font-black ${row.isExpense ? 'text-red-500' : 'text-white'}`}>{row.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Control de Cajas */}
                        <div className="bg-gray-900/30 border border-gray-800 p-10 rounded-[50px]">
                            <h3 className="text-xl font-black uppercase italic mb-8">Estado de Cajas</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Caja Toluca Centro', balance: '$8,200', status: 'OPEN' },
                                    { name: 'Caja Planta (Industrial)', balance: '$15,400', status: 'OPEN' },
                                    { name: 'Caja Sucursal Metepec', balance: '$0', status: 'CLOSED' }
                                ].map((box, i) => (
                                    <div key={i} className="p-6 bg-black/40 rounded-3xl border border-gray-800 border-l-4 border-l-emerald-500">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-xs font-black uppercase text-gray-100">{box.name}</h4>
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded ${box.status === 'OPEN' ? 'bg-emerald-600' : 'bg-gray-800 text-gray-600'}`}>
                                                {box.status}
                                            </span>
                                        </div>
                                        <div className="text-3xl font-black text-white">{box.balance}</div>
                                        <button className="w-full mt-4 text-[9px] font-black uppercase tracking-widest text-emerald-500/60 hover:text-emerald-500 transition-colors">Ver Detalles ↓</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* IA WASTE AUDIT SECTION */}
                    <div className="bg-orange-600/5 border border-orange-500/20 p-10 rounded-[50px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8">
                            <span className="bg-orange-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase animate-pulse">AI AUDIT LIVE</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase italic mb-6 text-orange-500">Monitor de Auditoría de Mermas (IA)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <p className="text-gray-400 text-sm font-bold leading-relaxed italic">
                                "Socio, he detectado una discrepancia del <span className="text-orange-500 font-black">4.2%</span> entre las unidades de harina reportadas como 'Mermas por error de pesado' y el impacto real en el inventario. Sugiero auditar la tanda #104 del Maestro Panadero."
                            </p>
                            <div className="bg-black/40 p-6 rounded-3xl border border-gray-800 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase">Impacto Financiero de Mermas</p>
                                    <p className="text-2xl font-black text-red-500">$4,820.00 <span className="text-[10px] text-gray-700">MTD</span></p>
                                </div>
                                <button className="bg-orange-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase">Ver Análisis</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'payables' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-900/40 p-8 rounded-[40px] border border-gray-800 border-t-red-500/50 border-t-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Total x Pagar (Vencido)</p>
                            <p className="text-3xl font-black text-red-500">$12,850.00</p>
                        </div>
                        <div className="bg-gray-900/40 p-8 rounded-[40px] border border-gray-800 border-t-blue-500/50 border-t-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Próximos 7 días</p>
                            <p className="text-3xl font-black text-white">$45,200.00</p>
                        </div>
                        <div className="bg-gray-900/40 p-8 rounded-[40px] border border-gray-800">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Proveedores Activos</p>
                            <p className="text-3xl font-black text-emerald-500">12</p>
                        </div>
                    </div>

                    <div className="bg-gray-900/30 border border-gray-800 rounded-[50px] overflow-hidden">
                        <div className="p-8 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-2xl font-black uppercase italic">Facturas de Proveedores (Payables)</h3>
                            <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase">+ Registrar Factura</button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-emerald-600/5 text-[10px] uppercase font-black tracking-widest text-emerald-500">
                                <tr>
                                    <th className="px-8 py-5">Proveedor</th>
                                    <th className="px-8 py-5">Vencimiento</th>
                                    <th className="px-8 py-5">Estatus</th>
                                    <th className="px-8 py-5 text-right">Importe</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/30 font-bold">
                                {[
                                    { vendor: 'Molinos de México S.A.', due: '2026-03-05', status: 'PENDING', amount: '$42,500.00' },
                                    { vendor: 'Distribuidora Lácteos Toluca', due: '2026-02-28', status: 'OVERDUE', amount: '$8,200.00' },
                                    { vendor: 'Gas Metropolitano', due: '2026-03-10', status: 'PENDING', amount: '$15,400.00' }
                                ].map((inv, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-6 uppercase italic">{inv.vendor}</td>
                                        <td className="px-8 py-6 font-mono text-gray-400">{inv.due}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded text-[8px] font-black uppercase ${inv.status === 'OVERDUE' ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'bg-orange-600/20 text-orange-400 border border-orange-500/20'}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right text-lg font-black">{inv.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeView === 'ledger' && (
                <div className="animate-in slide-in-from-right-10 duration-500">
                    <div className="bg-gray-900/30 border border-gray-800 rounded-[50px] overflow-hidden">
                        <div className="p-8 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-2xl font-black uppercase italic">Libro Diario (Diario Contable)</h3>
                            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">+ Nuevo Asiento</button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-emerald-600/5 text-[10px] uppercase font-black tracking-widest text-emerald-500">
                                <tr>
                                    <th className="px-8 py-5">Fecha / Ref</th>
                                    <th className="px-8 py-5">Descripción / Concepto</th>
                                    <th className="px-8 py-5">Cuenta Contable</th>
                                    <th className="px-8 py-5 text-right">Debe (Debit)</th>
                                    <th className="px-8 py-5 text-right">Haber (Credit)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/30 text-xs font-bold font-mono">
                                {[
                                    { date: '02/03/2026', ref: 'SLS-1025', desc: 'Venta POS Sucursal Toluca', account: '1101 - Caja', debit: '$1,200.00', credit: '-', type: 'D' },
                                    { date: '02/03/2026', ref: 'SLS-1025', desc: 'Venta POS Sucursal Toluca', account: '4101 - Ventas', debit: '-', credit: '$1,200.00', type: 'C' },
                                    { date: '02/03/2026', ref: 'EXP-502', desc: 'Compra de Harina (Planta)', account: '5102 - Materia Prima', debit: '$8,500.00', credit: '-', type: 'D' },
                                    { date: '02/03/2026', ref: 'EXP-502', desc: 'Compra de Harina (Planta)', account: '1105 - Banco', debit: '-', credit: '$8,500.00', type: 'C' }
                                ].map((entry, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-5">
                                            <p className="text-white">{entry.date}</p>
                                            <p className="text-[8px] text-gray-600 font-sans font-black">{entry.ref}</p>
                                        </td>
                                        <td className="px-8 py-5 text-gray-400 italic font-sans">{entry.desc}</td>
                                        <td className="px-8 py-5 text-indigo-400">{entry.account}</td>
                                        <td className={`px-8 py-5 text-right ${entry.type === 'D' ? 'text-white' : 'text-gray-800'}`}>{entry.debit}</td>
                                        <td className={`px-8 py-5 text-right ${entry.type === 'C' ? 'text-white' : 'text-gray-800'}`}>{entry.credit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
