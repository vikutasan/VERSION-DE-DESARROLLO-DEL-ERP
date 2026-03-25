import React, { useState } from 'react';

/**
 * R DE RICO - SELF-SERVICE INVOICING PORTAL
 * 
 * Portal de auto-servicio para que los clientes finales generen sus propias 
 * facturas CFDI 4.0 a partir de su ticket de compra (POS).
 */

export const CustomerInvoicingPortal = () => {
    const [step, setStep] = useState('find'); // find | data | result
    const [ticketData, setTicketData] = useState({ folio: '', amount: '' });
    const [loading, setLoading] = useState(false);

    const handleFindTicket = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulación de búsqueda en base de datos industrial
        setTimeout(() => {
            setLoading(false);
            setStep('data');
        }, 1500);
    };

    return (
        <div className="bg-[#080808] min-h-screen text-white font-sans flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black">

            {/* Logo y Branding */}
            <div className="mb-12 text-center animate-fade">
                <h1 className="text-6xl font-black uppercase italic tracking-tighter text-blue-500 mb-2">R DE RICO</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Self-Service Invoicing Portal</p>
            </div>

            <div className="w-full max-w-xl glass p-12 rounded-[60px] border-blue-500/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-10 w-20 h-1 bg-blue-500 rounded-full blur-sm opacity-50" />

                {step === 'find' && (
                    <div className="animate-in slide-in-from-bottom-5 duration-500">
                        <h2 className="text-3xl font-black uppercase mb-8 italic">Factura tu Compra</h2>
                        <p className="text-xs text-gray-500 mb-10 leading-relaxed font-bold">Ingresa los datos impresos al final de tu ticket de compra para comenzar el proceso de timbrado fiscal.</p>

                        <form onSubmit={handleFindTicket} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gray-600 ml-4">Folio del Ticket (POS)</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Ej: T-8829-X"
                                    className="w-full bg-black border border-gray-800 p-6 rounded-3xl outline-none focus:border-blue-500 font-mono text-xl transition-all"
                                    onChange={(e) => setTicketData({ ...ticketData, folio: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gray-600 ml-4">Importe Total del Pago</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="$ 0.00"
                                    className="w-full bg-black border border-gray-800 p-6 rounded-3xl outline-none focus:border-blue-500 font-mono text-xl transition-all"
                                    onChange={(e) => setTicketData({ ...ticketData, amount: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 py-6 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all mt-8"
                            >
                                {loading ? 'Buscando Ticket...' : 'Continuar →'}
                            </button>
                        </form>
                    </div>
                )}

                {step === 'data' && (
                    <div className="animate-in slide-in-from-right-10 duration-500">
                        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-900">
                            <div>
                                <h2 className="text-2xl font-black uppercase italic">Datos Fiscales</h2>
                                <p className="text-[9px] font-black text-gray-500 mt-1">CFDI 4.0 | RFC RECEPTOR</p>
                            </div>
                            <span className="text-blue-500 font-mono font-black text-sm">Ticket: {ticketData.folio}</span>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-600">RFC</label>
                                    <input placeholder="XAXX010101000" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-500 font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-600">CP Fiscal</label>
                                    <input placeholder="50000" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-500 font-mono" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gray-600">Razón Social</label>
                                <input placeholder="Nombre completo o Denominación" className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-gray-600">Uso de CFDI</label>
                                <select className="w-full bg-black border border-gray-800 p-4 rounded-xl outline-none focus:border-blue-500 text-xs">
                                    <option>G03 - Gastos en general</option>
                                    <option>D01 - Honorarios médicos</option>
                                    <option>S01 - Sin efectos fiscales</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setStep('result')}
                                className="w-full bg-emerald-600 py-6 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-600/20 hover:scale-[1.02] transition-all mt-4"
                            >
                                ⚡ GENERAR FACTURA LEGAL
                            </button>
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <div className="animate-in zoom-in-95 duration-500 text-center">
                        <div className="w-24 h-24 bg-emerald-600/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <span className="text-5xl">✅</span>
                        </div>
                        <h2 className="text-4xl font-black uppercase italic mb-4">¡Factura Lista!</h2>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-12 leading-relaxed font-bold italic">Tu comprobante fiscal ha sido timbrado por el SAT y enviado a tu correo.</p>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-3">
                                📑 DESCARGAR PDF
                            </button>
                            <button className="bg-gray-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-gray-800 hover:bg-black transition-all">
                                🛠️ DESCARGAR XML
                            </button>
                        </div>
                        <button onClick={() => setStep('find')} className="mt-12 text-[10px] font-black text-gray-700 uppercase tracking-widest hover:text-blue-500 transition-all underline underline-offset-8">REALIZAR OTRA FACTURA</button>
                    </div>
                )}
            </div>

            <footer className="mt-20 text-[8px] text-gray-800 font-black uppercase tracking-[0.5em] flex items-center gap-4">
                <span>R DE RICO ERP | FISCAL SELF-SERVICE ENGINE 4.0</span>
                <div className="w-1 h-1 bg-gray-900 rounded-full" />
                <span>POWERED BY SAT SECURE CONNECT</span>
            </footer>
        </div>
    );
};
